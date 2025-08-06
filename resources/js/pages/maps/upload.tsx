import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useFlashNotifications } from '@/hooks/use-flash-notifications';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { FileType, MapPin, Upload } from 'lucide-react';
import { useState } from 'react';

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
    const [mapImage, setMapImage] = useState<File | null>(null);
    const [gisFiles, setGisFiles] = useState<FileList | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Clear previous errors
        setErrors({});

        // Basic validation
        if (!title.trim()) {
            setErrors({ title: 'Map title is required' });
            return;
        }

        setProcessing(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);

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
            mapImage: mapImage?.name,
            gisFilesCount: gisFiles?.length || 0,
        });

        router.post(route('maps.store'), formData, {
            onSuccess: (page) => {
                console.log('Upload successful:', page);
                setTitle('');
                setDescription('');
                setMapImage(null);
                setGisFiles(null);
                setProcessing(false);
                // Force redirect to dashboard
                router.visit('/dashboard');
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

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Upload New Map</h1>
                        <p className="text-muted-foreground">Add a new GIS map to your collection</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Map Information</CardTitle>
                            <CardDescription>Provide basic details about your map</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Map Title</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter map title..."
                                    className={errors.title ? 'border-destructive' : ''}
                                />
                                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={description}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                                    placeholder="Describe your map, its purpose, data sources, etc..."
                                    rows={4}
                                    className={errors.description ? 'border-destructive' : ''}
                                />
                                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Map Image Upload */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Map Preview Image</CardTitle>
                            <CardDescription>Upload a preview image of your map (PNG, JPG, JPEG)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label htmlFor="map_image">Preview Image</Label>
                                <Input
                                    id="map_image"
                                    type="file"
                                    accept="image/png,image/jpg,image/jpeg"
                                    onChange={(e) => setMapImage(e.target.files?.[0] || null)}
                                    className={errors.map_image ? 'border-destructive' : ''}
                                />
                                {errors.map_image && <p className="text-sm text-destructive">{errors.map_image}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* GIS Files Upload */}
                    <Card>
                        <CardHeader>
                            <CardTitle>GIS Files</CardTitle>
                            <CardDescription>
                                Upload your GIS data files. Supports QGIS projects (.qgz, .qgs), layer definitions (.qlr, .qmd), Shapefile, GeoJSON,
                                KML, and many other formats.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div
                                    className={`relative rounded-lg border-2 border-dashed p-6 transition-colors ${
                                        dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                                    } ${errors.gis_files ? 'border-destructive' : ''}`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    <div className="text-center">
                                        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                                        <div className="mt-4">
                                            <Label htmlFor="gis_files" className="cursor-pointer">
                                                <span className="mt-2 block text-sm font-medium text-foreground">
                                                    Drop files here or click to browse
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
                                        <p className="mt-2 text-xs text-muted-foreground">Maximum file size: 50MB per file</p>
                                    </div>
                                </div>

                                {gisFiles && gisFiles.length > 0 && (
                                    <div className="space-y-2">
                                        <Label>Selected Files:</Label>
                                        <div className="space-y-1 rounded-md border p-3">
                                            {Array.from(gisFiles).map((file, index) => (
                                                <div key={index} className="flex items-center gap-2 text-sm">
                                                    <FileType className="h-4 w-4 text-muted-foreground" />
                                                    <span>{file.name}</span>
                                                    <span className="text-muted-foreground">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {errors.gis_files && <p className="text-sm text-destructive">{errors.gis_files}</p>}

                                {/* Show general errors */}
                                {Object.keys(errors).length > 0 && !errors.title && !errors.description && !errors.map_image && !errors.gis_files && (
                                    <div className="rounded-md bg-destructive/10 p-3">
                                        <p className="text-sm font-medium text-destructive">Upload failed:</p>
                                        {Object.entries(errors).map(([key, value]) => (
                                            <p key={key} className="text-sm text-destructive">
                                                {key}: {String(value)}
                                            </p>
                                        ))}
                                    </div>
                                )}

                                <div className="text-xs text-muted-foreground">
                                    <p className="mb-1 font-medium">Supported GIS formats:</p>
                                    <p>
                                        <strong>QGIS:</strong> Project files (.qgz, .qgs), Layer files (.qlr, .qmd, .qml)
                                    </p>
                                    <p>
                                        <strong>Vector:</strong> Shapefile (.shp + components), GeoJSON, KML/KMZ, GML, GPX, DXF, AutoCAD (.dwg)
                                    </p>
                                    <p>
                                        <strong>Raster:</strong> GeoTIFF (.tif), IMG, ECW, JPEG2000, DEM formats
                                    </p>
                                    <p>
                                        <strong>Point Cloud:</strong> LAS/LAZ, PLY, PCD
                                    </p>
                                    <p>
                                        <strong>Database:</strong> GeoDatabase (.gdb), SQLite, Access (.mdb)
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex gap-4">
                        <Button type="submit" disabled={processing} className="flex items-center gap-2">
                            <Upload className="h-4 w-4" />
                            {processing ? 'Uploading...' : 'Upload Map'}
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
                        >
                            Clear
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
