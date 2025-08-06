<?php

namespace App\Http\Controllers;

use App\Models\Map;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MapController extends Controller
{
    public function upload()
    {
        return Inertia::render('maps/upload');
    }

    public function store(Request $request)
    {
        // Log incoming request for debugging
        \Log::info('Map upload request received', [
            'title' => $request->title,
            'description' => $request->description,
            'has_map_image' => $request->hasFile('map_image'),
            'has_gis_files' => $request->hasFile('gis_files'),
            'gis_files_count' => $request->hasFile('gis_files') ? count($request->file('gis_files')) : 0,
            'user_id' => auth()->id(),
        ]);

        $gisExtensions = [
            // QGIS formats
            'qgz', 'qgs', 'qlr', 'qml', 'qmd', 'qpt',
            // Shapefile components
            'shp', 'shx', 'dbf', 'prj', 'sbn', 'sbx', 'fbn', 'fbx', 'ain', 'aih', 'ixs', 'mxs', 'atx', 'cpg', 'qix',
            // Vector formats
            'geojson', 'json', 'kml', 'kmz', 'gml', 'gpx', 'dxf', 'dgn', 'dwg', 'tab', 'map', 'id', 'dat', 'ind',
            // Database formats
            'gdb', 'mdb', 'sqlite', 'db', 'accdb',
            // Raster formats
            'tif', 'tiff', 'img', 'ecw', 'jp2', 'sid', 'bil', 'bip', 'bsq', 'asc', 'dem', 'dt0', 'dt1', 'dt2', 'hgt', 'xyz', 'png', 'jpg', 'jpeg',
            // Point cloud formats
            'las', 'laz', 'ply', 'pcd', 'e57',
            // Other formats
            'csv', 'txt', 'nc', 'hdf', 'he5', 'fits', 'rst', 'grd', 'flt', 'hdr', 'xml',
        ];

        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'map_image' => 'nullable|image|mimes:jpeg,png,jpg|max:10240', // 10MB
                'gis_files.*' => 'nullable|file|max:51200', // 50MB per file - removed MIME validation for now
            ]);

            \Log::info('Validation passed', $validated);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation failed', ['errors' => $e->errors()]);
            throw $e;
        }

        $mapImagePath = null;
        $gisFilePaths = [];

        // Handle map image upload
        if ($request->hasFile('map_image')) {
            try {
                $mapImagePath = $request->file('map_image')->store('maps/images', 'public');
                \Log::info('Map image uploaded', ['path' => $mapImagePath]);
            } catch (\Exception $e) {
                \Log::error('Failed to upload map image', ['error' => $e->getMessage()]);

                return back()->withErrors(['map_image' => 'Failed to upload map image: '.$e->getMessage()]);
            }
        }

        // Handle GIS files upload
        if ($request->hasFile('gis_files')) {
            try {
                foreach ($request->file('gis_files') as $index => $file) {
                    $filename = $file->getClientOriginalName();
                    $path = $file->storeAs('maps/gis', time().'_'.$index.'_'.$filename, 'public');
                    $gisFilePaths[] = [
                        'original_name' => $filename,
                        'path' => $path,
                        'size' => $file->getSize(),
                        'extension' => $file->getClientOriginalExtension(),
                    ];
                }
                \Log::info('GIS files uploaded', ['count' => count($gisFilePaths), 'files' => $gisFilePaths]);
            } catch (\Exception $e) {
                \Log::error('Failed to upload GIS files', ['error' => $e->getMessage()]);

                return back()->withErrors(['gis_files' => 'Failed to upload GIS files: '.$e->getMessage()]);
            }
        }

        // Create the map record
        try {
            $map = Map::create([
                'title' => $request->title,
                'description' => $request->description,
                'map_image_path' => $mapImagePath,
                'gis_file_paths' => $gisFilePaths,
                'user_id' => auth()->id(),
            ]);

            \Log::info('Map created successfully', ['map_id' => $map->id, 'title' => $map->title]);

            return redirect()
                ->route('dashboard')
                ->with('success', 'Map uploaded successfully!');
        } catch (\Exception $e) {
            \Log::error('Failed to create map record', ['error' => $e->getMessage()]);

            return back()->withErrors(['general' => 'Failed to save map: '.$e->getMessage()]);
        }
    }

    public function index()
    {
        $maps = Map::where('user_id', auth()->id())
            ->latest()
            ->get();

        return response()->json($maps);
    }

    public function show(Map $map)
    {
        // Allow viewing for all authenticated users, but check ownership for edit/delete permissions
        $isOwner = $map->user_id === auth()->id();

        // Add the full URL for the map image if it exists
        if ($map->map_image_path) {
            $map->map_image_url = Storage::url($map->map_image_path);
        }

        // Add full URLs for GIS files if they exist
        if ($map->gis_file_paths) {
            $map->gis_file_paths = collect($map->gis_file_paths)->map(function ($file) {
                $file['url'] = Storage::url($file['path']);

                return $file;
            })->toArray();
        }

        return Inertia::render('maps/show', [
            'map' => $map,
            'isOwner' => $isOwner,
        ]);
    }

    public function edit(Map $map)
    {
        // Ensure the user owns this map
        if ($map->user_id !== auth()->id()) {
            abort(403, 'Unauthorized access to this map.');
        }

        return Inertia::render('maps/edit', [
            'map' => $map,
        ]);
    }

    public function update(Request $request, Map $map)
    {
        // Ensure the user owns this map
        if ($map->user_id !== auth()->id()) {
            abort(403, 'Unauthorized access to this map.');
        }

        \Log::info('Map update request received', [
            'map_id' => $map->id,
            'title' => $request->title,
            'description' => $request->description,
            'has_map_image' => $request->hasFile('map_image'),
            'has_gis_files' => $request->hasFile('gis_files'),
        ]);

        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'map_image' => 'nullable|image|mimes:jpeg,png,jpg|max:10240', // 10MB
                'gis_files.*' => 'nullable|file|max:51200', // 50MB per file
                'remove_map_image' => 'nullable|boolean',
                'remove_gis_files' => 'nullable|array',
            ]);

            $mapImagePath = $map->map_image_path;
            $gisFilePaths = $map->gis_file_paths ?: [];

            // Handle map image removal
            if ($request->boolean('remove_map_image') && $mapImagePath) {
                Storage::disk('public')->delete($mapImagePath);
                $mapImagePath = null;
            }

            // Handle new map image upload
            if ($request->hasFile('map_image')) {
                // Delete old image if exists
                if ($mapImagePath) {
                    Storage::disk('public')->delete($mapImagePath);
                }
                $mapImagePath = $request->file('map_image')->store('maps/images', 'public');
                \Log::info('Map image updated', ['path' => $mapImagePath]);
            }

            // Handle GIS files removal
            if ($request->has('remove_gis_files')) {
                $filesToRemove = $request->input('remove_gis_files', []);
                foreach ($filesToRemove as $index) {
                    if (isset($gisFilePaths[$index])) {
                        Storage::disk('public')->delete($gisFilePaths[$index]['path']);
                        unset($gisFilePaths[$index]);
                    }
                }
                $gisFilePaths = array_values($gisFilePaths); // Re-index array
            }

            // Handle new GIS files upload
            if ($request->hasFile('gis_files')) {
                foreach ($request->file('gis_files') as $index => $file) {
                    $filename = $file->getClientOriginalName();
                    $path = $file->storeAs('maps/gis', time().'_'.$filename, 'public');
                    $gisFilePaths[] = [
                        'original_name' => $filename,
                        'path' => $path,
                        'size' => $file->getSize(),
                        'extension' => $file->getClientOriginalExtension(),
                    ];
                }
                \Log::info('GIS files updated', ['count' => count($request->file('gis_files'))]);
            }

            // Update the map record
            $map->update([
                'title' => $request->title,
                'description' => $request->description,
                'map_image_path' => $mapImagePath,
                'gis_file_paths' => $gisFilePaths,
            ]);

            \Log::info('Map updated successfully', ['map_id' => $map->id]);

            return redirect()
                ->route('maps.show', $map)
                ->with('success', 'Map updated successfully!');

        } catch (\Exception $e) {
            \Log::error('Failed to update map', ['error' => $e->getMessage()]);

            return back()->withErrors(['general' => 'Failed to update map: '.$e->getMessage()]);
        }
    }

    public function destroy(Map $map)
    {
        // Ensure the user owns this map
        if ($map->user_id !== auth()->id()) {
            abort(403, 'Unauthorized access to this map.');
        }

        try {
            // Delete associated files
            if ($map->map_image_path) {
                Storage::disk('public')->delete($map->map_image_path);
            }

            if ($map->gis_file_paths) {
                foreach ($map->gis_file_paths as $file) {
                    Storage::disk('public')->delete($file['path']);
                }
            }

            // Delete the map record
            $map->delete();

            \Log::info('Map deleted successfully', ['map_id' => $map->id]);

            return redirect()
                ->route('dashboard')
                ->with('success', 'Map deleted successfully!');

        } catch (\Exception $e) {
            \Log::error('Failed to delete map', ['error' => $e->getMessage()]);

            return back()->withErrors(['general' => 'Failed to delete map: '.$e->getMessage()]);
        }
    }

    public function download(Map $map)
    {
        // Ensure the user owns this map
        if ($map->user_id !== auth()->id()) {
            abort(403, 'Unauthorized access to this map.');
        }

        try {
            $zip = new \ZipArchive;
            $zipFileName = storage_path('app/temp/').'map_'.$map->id.'_'.time().'.zip';

            // Create temp directory if it doesn't exist
            if (! file_exists(storage_path('app/temp'))) {
                mkdir(storage_path('app/temp'), 0755, true);
            }

            if ($zip->open($zipFileName, \ZipArchive::CREATE) !== true) {
                throw new \Exception('Could not create ZIP file');
            }

            $fileCount = 0;

            // Add map image if exists
            if ($map->map_image_path) {
                $imagePath = Storage::disk('public')->path($map->map_image_path);
                if (file_exists($imagePath)) {
                    $imageExtension = pathinfo($map->map_image_path, PATHINFO_EXTENSION);
                    $zip->addFile($imagePath, 'map_image.'.$imageExtension);
                    $fileCount++;
                }
            }

            // Add GIS files if exist
            if ($map->gis_file_paths) {
                foreach ($map->gis_file_paths as $file) {
                    $filePath = Storage::disk('public')->path($file['path']);
                    if (file_exists($filePath)) {
                        $zip->addFile($filePath, $file['original_name']);
                        $fileCount++;
                    }
                }
            }

            if ($fileCount === 0) {
                $zip->close();
                unlink($zipFileName);

                return back()->withErrors(['general' => 'No files available for download.']);
            }

            $zip->close();

            \Log::info('Map files downloaded', ['map_id' => $map->id, 'files_count' => $fileCount]);

            return response()->download($zipFileName, $map->title.'_files.zip')->deleteFileAfterSend(true);

        } catch (\Exception $e) {
            \Log::error('Failed to download map files', ['map_id' => $map->id, 'error' => $e->getMessage()]);

            return back()->withErrors(['general' => 'Failed to create download: '.$e->getMessage()]);
        }
    }
}
