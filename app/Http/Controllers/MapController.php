<?php

namespace App\Http\Controllers;

use App\Models\Map;
use App\Services\GoogleSheetsService;
use App\Services\SheetsSyncService;
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
                'barangay' => 'required|string|in:Butong,Salawagan,San Jose',
                'map_image' => 'nullable|image|mimes:jpeg,png,jpg', // No size limit
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
                'barangay' => $request->barangay,
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
            'barangay' => $request->barangay,
            'has_map_image' => $request->hasFile('map_image'),
            'has_gis_files' => $request->hasFile('gis_files'),
            'gis_files_count' => $request->hasFile('gis_files') ? count($request->file('gis_files')) : 0,
            'remove_gis_files' => $request->input('remove_gis_files'),
            'all_input' => $request->all(),
        ]);

        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'barangay' => 'required|string|in:Butong,Salawagan,San Jose',
                'map_image' => 'nullable|image|mimes:jpeg,png,jpg', // No size limit
                'gis_files' => 'nullable|array',
                'gis_files.*' => 'nullable|file|max:51200', // 50MB per file
                'remove_map_image' => 'nullable|boolean',
                'remove_gis_files' => 'nullable|array',
                'remove_gis_files.*' => 'nullable|integer',
            ]);

            \Log::info('Validation passed for map update', $validated);

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
            if ($request->has('remove_gis_files') && is_array($request->input('remove_gis_files'))) {
                $filesToRemove = $request->input('remove_gis_files', []);
                \Log::info('Removing GIS files', ['indices' => $filesToRemove, 'current_files_count' => count($gisFilePaths)]);
                
                // Sort indices in descending order to avoid index shifting issues
                rsort($filesToRemove);
                
                foreach ($filesToRemove as $index) {
                    if (isset($gisFilePaths[$index])) {
                        \Log::info('Deleting file', ['index' => $index, 'file' => $gisFilePaths[$index]]);
                        Storage::disk('public')->delete($gisFilePaths[$index]['path']);
                        unset($gisFilePaths[$index]);
                    }
                }
                $gisFilePaths = array_values($gisFilePaths); // Re-index array
                \Log::info('Files after removal', ['count' => count($gisFilePaths)]);
            }

            // Handle new GIS files upload
            if ($request->hasFile('gis_files')) {
                $uploadedFiles = $request->file('gis_files');
                \Log::info('Uploading new GIS files', ['count' => count($uploadedFiles)]);
                
                foreach ($uploadedFiles as $index => $file) {
                    if ($file && $file->isValid()) {
                        $filename = $file->getClientOriginalName();
                        $path = $file->storeAs('maps/gis', time().'_'.$index.'_'.$filename, 'public');
                        $gisFilePaths[] = [
                            'original_name' => $filename,
                            'path' => $path,
                            'size' => $file->getSize(),
                            'extension' => $file->getClientOriginalExtension(),
                        ];
                        \Log::info('File uploaded', ['name' => $filename, 'path' => $path]);
                    }
                }
                \Log::info('GIS files upload completed', ['total_files' => count($gisFilePaths)]);
            }

            // Update the map record
            $updateData = [
                'title' => $request->title,
                'description' => $request->description,
                'barangay' => $request->barangay,
                'map_image_path' => $mapImagePath,
                'gis_file_paths' => $gisFilePaths,
            ];
            
            \Log::info('Updating map with data', $updateData);
            
            $map->update($updateData);

            \Log::info('Map updated successfully', [
                'map_id' => $map->id,
                'title' => $map->title,
                'files_count' => count($gisFilePaths),
                'has_image' => !empty($mapImagePath)
            ]);

            return redirect()
                ->route('maps.show', $map)
                ->with('success', 'Map updated successfully!');

        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation failed for map update', [
                'map_id' => $map->id,
                'errors' => $e->errors(),
                'input' => $request->all()
            ]);
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            \Log::error('Failed to update map', [
                'map_id' => $map->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);

            return back()->withErrors(['general' => 'Failed to update map: '.$e->getMessage()])->withInput();
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

    /**
     * Get Google Sheets URL for a specific map based on its barangay
     */
    public function getGoogleSheetsUrl(Map $map)
    {
        try {
            \Log::info('Getting Google Sheets URL for map', [
                'map_id' => $map->id,
                'map_title' => $map->title,
                'barangay' => $map->barangay
            ]);

            if (!$map->barangay) {
                return response()->json([
                    'error' => 'No barangay specified for this map'
                ], 400);
            }

            $googleSheetsService = new GoogleSheetsService();
            $url = $googleSheetsService->getSheetUrlForBarangay($map->barangay);
            
            if (!$url) {
                \Log::warning('Failed to get Google Sheets URL', [
                    'map_id' => $map->id,
                    'barangay' => $map->barangay
                ]);

                return response()->json([
                    'error' => 'Failed to get Google Sheet for barangay: ' . $map->barangay
                ], 404);
            }

            \Log::info('Successfully generated Google Sheets URL', [
                'map_id' => $map->id,
                'barangay' => $map->barangay,
                'url' => $url
            ]);

            return response()->json([
                'url' => $url,
                'barangay' => $map->barangay,
                'sheet_name' => "Brgy. " . $map->barangay
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to get Google Sheets URL', [
                'map_id' => $map->id,
                'barangay' => $map->barangay,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Failed to get Google Sheets URL: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Redirect directly to Google Sheets for a specific map
     */
    public function redirectToGoogleSheets(Map $map)
    {
        try {
            \Log::info('Redirecting to Google Sheets for map', [
                'map_id' => $map->id,
                'map_title' => $map->title,
                'barangay' => $map->barangay
            ]);

            if (!$map->barangay) {
                \Log::warning('No barangay specified for map', ['map_id' => $map->id]);
                abort(400, 'No barangay specified for this map');
            }

            $googleSheetsService = new GoogleSheetsService();
            $url = $googleSheetsService->getSheetUrlForBarangay($map->barangay);
            
            if (!$url) {
                \Log::warning('Failed to get Google Sheets URL for redirect', [
                    'map_id' => $map->id,
                    'barangay' => $map->barangay
                ]);

                return response()->view('errors.google-sheets-error', [
                    'message' => 'Unable to access Google Sheets. Please check your credentials and try again.',
                    'barangay' => $map->barangay
                ], 500);
            }

            \Log::info('Successfully redirecting to Google Sheets', [
                'map_id' => $map->id,
                'barangay' => $map->barangay,
                'url' => $url
            ]);

            return redirect()->away($url);

        } catch (\Exception $e) {
            \Log::error('Error redirecting to Google Sheets', [
                'map_id' => $map->id,
                'barangay' => $map->barangay ?? 'Unknown',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            $errorMessage = $e->getMessage();
            
            // Check if it's a JWT/credentials/authentication error
            if (strpos($errorMessage, 'JWT') !== false || 
                strpos($errorMessage, 'invalid_grant') !== false ||
                strpos($errorMessage, 'authentication failed') !== false ||
                strpos($errorMessage, 'expired credentials') !== false) {
                
                return response()->view('errors.google-sheets-error', [
                    'message' => 'Google Sheets authentication has failed. The service account credentials have expired or are invalid. Please regenerate the credentials following the guide in GOOGLE_SHEETS_AUTH_FIX.md or contact your system administrator.',
                    'barangay' => $map->barangay ?? 'Unknown',
                    'technical_details' => config('app.debug') ? $errorMessage : null
                ], 500);
            }

            // Generic error
            return response()->view('errors.google-sheets-error', [
                'message' => 'Unable to access Google Sheets. ' . $errorMessage,
                'barangay' => $map->barangay ?? 'Unknown',
                'technical_details' => config('app.debug') ? $errorMessage : null
            ], 500);
        }
    }

    /**
     * Export map data to Google Sheets
     */
    public function exportToGoogleSheets(Map $map)
    {
        try {
            $googleSheetsService = new GoogleSheetsService();
            $result = $googleSheetsService->exportMapData($map);
            
            if ($result) {
                return response()->json([
                    'success' => true,
                    'message' => 'Map data exported to Google Sheets successfully',
                    'cells_updated' => $result
                ]);
            } else {
                return response()->json([
                    'error' => 'Failed to export data to Google Sheets'
                ], 500);
            }
        } catch (\Exception $e) {
            \Log::error('Failed to export to Google Sheets', [
                'map_id' => $map->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'error' => 'Failed to export to Google Sheets'
            ], 500);
        }
    }

    /**
     * Sync Google Sheets data to database for all barangays
     */
    public function syncSheetsToDatabase()
    {
        try {
            $syncService = new SheetsSyncService();
            $results = $syncService->syncAllBarangays();

            $totalSynced = 0;
            $totalErrors = 0;
            $details = [];

            foreach ($results as $barangay => $result) {
                if (isset($result['error'])) {
                    $details[] = [
                        'barangay' => $barangay,
                        'status' => 'error',
                        'message' => $result['error']
                    ];
                    $totalErrors++;
                } else {
                    $details[] = [
                        'barangay' => $barangay,
                        'status' => 'success',
                        'synced' => $result['synced'],
                        'errors' => $result['errors']
                    ];
                    $totalSynced += $result['synced'];
                    $totalErrors += $result['errors'];
                }
            }

            return response()->json([
                'success' => true,
                'message' => "Sync completed: {$totalSynced} records synced, {$totalErrors} errors",
                'total_synced' => $totalSynced,
                'total_errors' => $totalErrors,
                'details' => $details,
                'statistics' => $syncService->getSyncStatistics()
            ]);

        } catch (\Exception $e) {
            \Log::error('Failed to sync sheets to database', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Failed to sync sheets to database: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Sync Google Sheets data to database for a specific barangay
     */
    public function syncSpecificBarangayToDatabase(Request $request)
    {
        try {
            $barangayName = $request->input('barangay');
            
            if (!$barangayName) {
                return response()->json([
                    'error' => 'Barangay name is required'
                ], 400);
            }

            $syncService = new SheetsSyncService();
            $result = $syncService->syncSpecificBarangay($barangayName);

            if (isset($result['error'])) {
                return response()->json([
                    'error' => $result['error']
                ], 500);
            }

            return response()->json([
                'success' => true,
                'message' => "Sync completed for {$barangayName}: {$result['synced']} records synced",
                'barangay' => $barangayName,
                'synced' => $result['synced'],
                'errors' => $result['errors'],
                'error_details' => $result['error_details'] ?? []
            ]);

        } catch (\Exception $e) {
            \Log::error('Failed to sync specific barangay to database', [
                'barangay' => $request->input('barangay'),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'error' => 'Failed to sync barangay to database: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get crop data for a specific barangay from database
     */
    public function getBarangayCropData(Request $request)
    {
        try {
            $barangayName = $request->input('barangay');
            
            if (!$barangayName) {
                return response()->json([
                    'error' => 'Barangay name is required'
                ], 400);
            }

            $syncService = new SheetsSyncService();
            $cropData = $syncService->getBarangayCropData($barangayName);

            return response()->json([
                'success' => true,
                'barangay' => $barangayName,
                'data' => $cropData,
                'count' => $cropData->count()
            ]);

        } catch (\Exception $e) {
            \Log::error('Failed to get barangay crop data', [
                'barangay' => $request->input('barangay'),
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'error' => 'Failed to get crop data: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get sync statistics for all barangays
     */
    public function getSyncStatistics()
    {
        try {
            $syncService = new SheetsSyncService();
            $statistics = $syncService->getSyncStatistics();

            return response()->json([
                'success' => true,
                'statistics' => $statistics
            ]);

        } catch (\Exception $e) {
            \Log::error('Failed to get sync statistics', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'error' => 'Failed to get sync statistics: ' . $e->getMessage()
            ], 500);
        }
    }
}
