import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useFlashNotifications } from '@/hooks/use-flash-notifications';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { FileType, MapPin, Upload, Sparkles, CheckCircle, AlertCircle, Camera, Database, Layers, Map, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Upload Map',
        href: '/maps/upload',
    },
];

export default function MapUpload() {
    // Handle flash notifications from Laravel
    useFlashNotifications();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [barangay, setBarangay] = useState('');
    const [mapImage, setMapImage] = useState<File | null>(null);
    const [gisFiles, setGisFiles] = useState<FileList | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Clear previous errors
        setErrors({});

        // Basic validation
        if (!title.trim()) {
            setErrors({ title: 'Map title is required' });
            return;
        }

        if (!barangay.trim()) {
            setErrors({ barangay: 'Barangay selection is required' });
            return;
        }

        setProcessing(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('barangay', barangay);

        if (mapImage) {
            formData.append('map_image', mapImage);
        }

        if (gisFiles) {
            Array.from(gisFiles).forEach((file, index) => {
                formData.append(`gis_files[${index}]`, file);
            });
        }

        console.log('Submitting form data:', {
            title,
            description,
            barangay,
            mapImage: mapImage?.name,
            gisFilesCount: gisFiles?.length || 0,
        });

        router.post(route('maps.store'), formData, {
            onSuccess: (page) => {
                console.log('Upload successful:', page);
                setTitle('');
                setDescription('');
                setBarangay('');
                setMapImage(null);
                setGisFiles(null);
                setProcessing(false);
                Swal.fire({
                    icon: 'success',
                    title: 'Map Uploaded!',
                    text: 'Your map has been uploaded successfully.',
                    confirmButtonText: 'Go to Dashboard',
                    confirmButtonColor: '#00786f',
                }).then(() => {
                    router.visit('/dashboard');
                });
            },
            onError: (errors) => {
                console.error('Upload errors:', errors);
                setErrors(errors);
                setProcessing(false);
            },
            onFinish: () => {
                setProcessing(false);
            },
        });
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setGisFiles(e.dataTransfer.files);
        }
    };

    const acceptedGISExtensions = [
        // QGIS formats
        '.qgz',
        '.qgs',
        '.qlr',
        '.qml',
        '.qmd',
        '.qlr',
        '.qpt',

        // Shapefile components
        '.shp',
        '.shx',
        '.dbf',
        '.prj',
        '.sbn',
        '.sbx',
        '.fbn',
        '.fbx',
        '.ain',
        '.aih',
        '.ixs',
        '.mxs',
        '.atx',
        '.xml',
        '.cpg',
        '.qix',

        // Common GIS vector formats
        '.geojson',
        '.json',
        '.kml',
        '.kmz',
        '.gml',
        '.gpx',
        '.dxf',
        '.dgn',
        '.dwg',
        '.tab',
        '.map',
        '.id',
        '.dat',
        '.ind',

        // Database formats
        '.gdb',
        '.mdb',
        '.sqlite',
        '.db',
        '.accdb',

        // Raster formats
        '.tif',
        '.tiff',
        '.img',
        '.ecw',
        '.jp2',
        '.sid',
        '.bil',
        '.bip',
        '.bsq',
        '.asc',
        '.dem',
        '.dt0',
        '.dt1',
        '.dt2',
        '.hgt',
        '.xyz',
        '.png',
        '.jpg',
        '.jpeg',

        // Point cloud formats
        '.las',
        '.laz',
        '.ply',
        '.pcd',
        '.e57',

        // CAD formats
        '.dwg',
        '.dxf',
        '.dgn',

        // Other GIS formats
        '.csv',
        '.txt',
        '.xyz',
        '.gmt',
        '.nc',
        '.hdf',
        '.he5',
        '.fits',
        '.rst',
        '.grd',
        '.flt',
        '.hdr',
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Upload Map" />

            <div className={`flex h-full flex-1 flex-col gap-8 rounded-xl p-6 bg-gray-50 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                {/* Animated Header */}
                <div className={`transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                    <div className="flex items-center gap-4 mb-2">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-lg transform transition-all duration-300 hover:scale-110">
                            <MapPin className="h-7 w-7" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight text-gray-800 flex items-center gap-3">
                                Upload New Map
                            </h1>
                            <p className="text-gray-600 mt-2 flex items-center gap-2 font-medium text-lg">
                                <Upload className="h-5 w-5 text-teal-500" />
                                Add a new GIS map to your agricultural data collection
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className={`max-w-4xl mx-auto w-full space-y-8 transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    {/* Basic Information */}
                    <Card className="border border-gray-200 bg-white shadow-sm rounded-2xl overflow-hidden transform hover:scale-[1.01] transition-all duration-300 hover:shadow-md">
                        <CardHeader className="bg-gray-50 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-teal-100">
                                    <Database className="h-5 w-5 text-teal-700" />
                                </div>
                                <div>
                                    <CardTitle className="text-gray-800 font-bold text-xl">Map Information</CardTitle>
                                    <CardDescription className="text-gray-600 font-medium">Provide basic details about your agricultural map</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-3">
                                <Label htmlFor="title" className="text-gray-800 font-semibold flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-teal-600" />
                                    Map Title
                                </Label>
                                <Input
                                    id="title"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter map title..."
                                    className={`border-2 transition-all duration-300 focus:border-teal-400 focus:ring-teal-200 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 ${errors.title ? 'border-red-400 focus:border-red-400' : 'border-gray-200 hover:border-gray-300'}`}
                                />
                                {errors.title && (
                                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded-lg">
                                        <AlertCircle className="h-4 w-4" />
                                        {errors.title}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="description" className="text-gray-800 font-semibold flex items-center gap-2">
                                    <Layers className="h-4 w-4 text-teal-600" />
                                    Description
                                </Label>
                                <Textarea
                                    id="description"
                                    value={description}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                                    placeholder="Describe your map, its purpose, data sources, agricultural insights, etc..."
                                    rows={4}
                                    className={`border-2 transition-all duration-300 focus:border-teal-400 focus:ring-teal-200 rounded-xl bg-white text-gray-900 placeholder:text-gray-400 ${errors.description ? 'border-red-400 focus:border-red-400' : 'border-gray-200 hover:border-gray-300'}`}
                                />
                                {errors.description && (
                                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded-lg">
                                        <AlertCircle className="h-4 w-4" />
                                        {errors.description}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="barangay" className="text-gray-800 font-semibold flex items-center gap-2">
                                    <Map className="h-4 w-4 text-teal-600" />
                                    Barangay Location
                                </Label>
                                <Select value={barangay} onValueChange={setBarangay}>
                                    <SelectTrigger className={`border-2 transition-all duration-300 focus:border-teal-400 focus:ring-teal-200 rounded-xl bg-white text-gray-900 ${errors.barangay ? 'border-red-400 focus:border-red-400' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <SelectValue placeholder="Select barangay location..." className="text-gray-900" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-gray-200 bg-white">
                                        <SelectItem value="Butong" className="cursor-pointer hover:bg-teal-600 hover:text-white focus:bg-teal-600 focus:text-white rounded-lg text-gray-900">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                                                Butong
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="Salawagan" className="cursor-pointer hover:bg-teal-600 hover:text-white focus:bg-teal-600 focus:text-white rounded-lg text-gray-900">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                                                Salawagan
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="San Jose" className="cursor-pointer hover:bg-teal-600 hover:text-white focus:bg-teal-600 focus:text-white rounded-lg text-gray-900">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                                                San Jose
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.barangay && (
                                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded-lg">
                                        <AlertCircle className="h-4 w-4" />
                                        {errors.barangay}
                                    </div>
                                )}
                                <p className="text-sm text-gray-600 flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-teal-600" />
                                    Select the barangay where this agricultural map data was collected
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Map Image Upload */}
                    <Card className="border border-gray-200 bg-white shadow-sm rounded-2xl overflow-hidden transform hover:scale-[1.01] transition-all duration-300 hover:shadow-md">
                        <CardHeader className="bg-gray-50 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-teal-100">
                                    <Camera className="h-5 w-5 text-teal-700" />
                                </div>
                                <div>
                                    <CardTitle className="text-gray-800 font-bold text-xl">Map Preview Image</CardTitle>
                                    <CardDescription className="text-gray-600 font-medium">Upload a preview image of your map (PNG, JPG, JPEG) - No size limit</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-3">
                                <Label htmlFor="map_image" className="text-gray-800 font-semibold flex items-center gap-2">
                                    <Camera className="h-4 w-4 text-teal-600" />
                                    Preview Image
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="map_image"
                                        type="file"
                                        accept="image/png,image/jpg,image/jpeg"
                                        onChange={(e) => setMapImage(e.target.files?.[0] || null)}
                                        className={`border-2 transition-all duration-300 focus:border-teal-400 focus:ring-teal-200 rounded-xl file:bg-teal-700 file:text-white file:border-0 file:rounded-lg file:px-4 file:py-2 file:mr-4 file:font-semibold hover:file:bg-teal-800 ${errors.map_image ? 'border-red-400 focus:border-red-400' : 'border-gray-200 hover:border-gray-300'}`}
                                    />
                                </div>
                                {mapImage && (
                                    <div className="flex items-center gap-2 text-sm text-teal-700 bg-teal-50 p-3 rounded-xl border border-teal-200">
                                        <CheckCircle className="h-4 w-4 text-teal-600" />
                                        <span className="font-medium">{mapImage.name}</span>
                                        <span className="text-teal-600">({(mapImage.size / 1024 / 1024).toFixed(2)} MB)</span>
                                    </div>
                                )}
                                {errors.map_image && (
                                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded-lg">
                                        <AlertCircle className="h-4 w-4" />
                                        {errors.map_image}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* GIS Files Upload */}
                    <Card className="border border-gray-200 bg-white shadow-sm rounded-2xl overflow-hidden transform hover:scale-[1.01] transition-all duration-300 hover:shadow-md">
                        <CardHeader className="bg-gray-50 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-teal-100">
                                    <Upload className="h-5 w-5 text-teal-700" />
                                </div>
                                <div>
                                    <CardTitle className="text-gray-800 font-bold text-xl">GIS Files</CardTitle>
                                    <CardDescription className="text-gray-600 font-medium">
                                        Upload your GIS data files. Supports QGIS projects (.qgz, .qgs), layer definitions (.qlr, .qmd), Shapefile, GeoJSON,
                                        KML, and many other formats.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-6">
                                <div
                                    className={`relative rounded-2xl border-3 border-dashed p-8 transition-all duration-300 ${
                                        dragActive 
                                            ? 'border-teal-400 bg-teal-50 scale-[1.02] shadow-lg' 
                                            : 'border-gray-300 hover:border-teal-400 hover:bg-gray-50'
                                    } ${errors.gis_files ? 'border-red-400 bg-red-50' : ''}`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    <div className="text-center">
                                        <div className="relative mb-4">
                                            <Upload className={`mx-auto h-16 w-16 transition-all duration-300 ${dragActive ? 'text-teal-600 scale-110' : 'text-gray-400'}`} />
                                        </div>
                                        <div className="mt-4">
                                            <Label htmlFor="gis_files" className="cursor-pointer">
                                                <span className="mt-2 block text-lg font-bold text-gray-800 hover:text-teal-700 transition-colors">
                                                    Drop files here or click to browse
                                                </span>
                                                <span className="mt-1 block text-sm text-gray-600 font-medium">
                                                    Supports multiple file selection
                                                </span>
                                            </Label>
                                            <Input
                                                id="gis_files"
                                                type="file"
                                                multiple
                                                accept={acceptedGISExtensions.join(',')}
                                                onChange={(e) => setGisFiles(e.target.files)}
                                                className="sr-only"
                                            />
                                        </div>
                                        <p className="mt-3 text-sm text-gray-600 font-medium bg-gray-100 rounded-full px-4 py-2 inline-block">
                                            Maximum file size: 50MB per file
                                        </p>
                                    </div>
                                </div>

                                {gisFiles && gisFiles.length > 0 && (
                                    <div className="space-y-3">
                                        <Label className="text-gray-800 font-semibold flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-teal-600" />
                                            Selected Files: ({gisFiles.length})
                                        </Label>
                                        <div className="space-y-2 rounded-2xl border-2 border-gray-200 bg-gray-50 p-4">
                                            {Array.from(gisFiles).map((file, index) => (
                                                <div key={index} className="flex items-center gap-3 text-sm bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.01]">
                                                    <div className="p-1 rounded-lg bg-teal-100">
                                                        <FileType className="h-4 w-4 text-teal-700" />
                                                    </div>
                                                    <span className="font-semibold text-gray-800 flex-1">{file.name}</span>
                                                    <span className="text-gray-600 font-medium bg-gray-100 px-2 py-1 rounded-lg">
                                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {errors.gis_files && (
                                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                                        <AlertCircle className="h-4 w-4" />
                                        {errors.gis_files}
                                    </div>
                                )}

                                {/* Show general errors */}
                                {Object.keys(errors).length > 0 && !errors.title && !errors.description && !errors.map_image && !errors.gis_files && (
                                    <div className="rounded-2xl bg-red-50 border-2 border-red-200 p-4 shadow-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <AlertCircle className="h-5 w-5 text-red-600" />
                                            <p className="text-sm font-bold text-red-800">Upload failed:</p>
                                        </div>
                                        {Object.entries(errors).map(([key, value]) => (
                                            <p key={key} className="text-sm text-red-700 ml-7">
                                                {key}: {String(value)}
                                            </p>
                                        ))}
                                    </div>
                                )}

                                <div className="text-sm text-gray-600 bg-gray-50 rounded-2xl p-6 border border-gray-200">
                                    <p className="mb-4 font-bold text-gray-800 text-base flex items-center gap-2">
                                        <Layers className="h-5 w-5 text-teal-600" />
                                        Supported GIS formats:
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <p className="font-semibold text-gray-700">
                                                <strong>QGIS:</strong> Project files (.qgz, .qgs), Layer files (.qlr, .qmd, .qml)
                                            </p>
                                            <p className="font-semibold text-gray-700">
                                                <strong>Vector:</strong> Shapefile (.shp + components), GeoJSON, KML/KMZ, GML, GPX, DXF, AutoCAD (.dwg)
                                            </p>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="font-semibold text-gray-700">
                                                <strong>Raster:</strong> GeoTIFF (.tif), IMG, ECW, JPEG2000, DEM formats
                                            </p>
                                            <p className="font-semibold text-gray-700">
                                                <strong>Database:</strong> GeoDatabase (.gdb), SQLite, Access (.mdb)
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex gap-6 justify-center pt-4">
                        <Button 
                            type="submit" 
                            disabled={processing} 
                            className="flex items-center gap-3 bg-teal-700 hover:bg-teal-800 text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl px-8 py-4 rounded-2xl font-bold text-lg min-w-[200px] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {processing ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload className="h-5 w-5" />
                                    Upload Map
                                </>
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setTitle('');
                                setDescription('');
                                setMapImage(null);
                                setGisFiles(null);
                            }}
                            className="flex items-center gap-3 bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900 transform hover:scale-105 transition-all duration-300 px-8 py-4 rounded-2xl font-bold text-lg min-w-[150px] shadow-md hover:shadow-lg"
                        >
                            <X className="h-5 w-5" />
                            Clear
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
