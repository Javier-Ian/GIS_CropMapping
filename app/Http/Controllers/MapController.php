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
            'user_id' => auth()->id()
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
            'csv', 'txt', 'nc', 'hdf', 'he5', 'fits', 'rst', 'grd', 'flt', 'hdr', 'xml'
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
                return back()->withErrors(['map_image' => 'Failed to upload map image: ' . $e->getMessage()]);
            }
        }

        // Handle GIS files upload
        if ($request->hasFile('gis_files')) {
            try {
                foreach ($request->file('gis_files') as $index => $file) {
                    $filename = $file->getClientOriginalName();
                    $path = $file->storeAs('maps/gis', time() . '_' . $index . '_' . $filename, 'public');
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
                return back()->withErrors(['gis_files' => 'Failed to upload GIS files: ' . $e->getMessage()]);
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
            return back()->withErrors(['general' => 'Failed to save map: ' . $e->getMessage()]);
        }
    }

    public function index()
    {
        $maps = Map::where('user_id', auth()->id())
            ->latest()
            ->get();

        return response()->json($maps);
    }
}
