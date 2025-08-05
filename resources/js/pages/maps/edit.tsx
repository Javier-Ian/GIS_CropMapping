import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useFlashNotifications } from '@/hooks/use-flash-notifications';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { AlertCircle, Eye, FileText, MapPin, Save, Trash2, Upload, X } from 'lucide-react';
import { useState } from 'react';

interface Map {
    id: number;
    title: string;
    description: string;
    map_image_path: string | null;
    map_image_url?: string;
    gis_file_paths: Array<{
        original_name: string;
        path: string;
        url: string;
        size: number;
        extension: string;
    }> | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    map: Map;
    errors: Record<string, string>;
}

export default function MapEdit({ map, errors }: Props) {
    // Handle flash notifications from Laravel
    useFlashNotifications();

    const [previewImage, setPreviewImage] = useState<string | null>(map.map_image_url || null);
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const { data, setData, post, processing } = useForm({
        title: map.title,
        description: map.description,
        map_image: null as File | null,
        gis_files: null as File[] | null,
        _method: 'PUT',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: map.title,
            href: `/maps/${map.id}`,
        },
        {
            title: 'Edit',
            href: `/maps/${map.id}/edit`,
        },
    ];

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('map_image', file);
            const reader = new FileReader();
            reader.onload = (e) => setPreviewImage(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleGisFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            setData('gis_files', Array.from(files));
            setSelectedFiles(files);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            setData('gis_files', Array.from(files));
            setSelectedFiles(files);
        }
    };

    const removeSelectedFile = (index: number) => {
        if (selectedFiles) {
            const dt = new DataTransfer();
            for (let i = 0; i < selectedFiles.length; i++) {
                if (i !== index) {
                    dt.items.add(selectedFiles[i]);
                }
            }
            const newFiles = dt.files;
            setData('gis_files', newFiles.length > 0 ? Array.from(newFiles) : null);
            setSelectedFiles(newFiles.length > 0 ? newFiles : null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/maps/${map.id}`, {
            forceFormData: true,
        });
    };

    const supportedGisFormats = [
        '.qgz', '.qgs', '.qlr', '.qml', '.qmd', '.shp', '.shx', '.dbf', '.prj', '.cpg',
        '.kml', '.kmz', '.gpx', '.geojson', '.json', '.gml', '.geopackage', '.gpkg',
        '.mxd', '.lyr', '.style', '.qml', '.sld', '.se', '.fgb', '.parquet', '.csv',
        '.tab', '.mif', '.mid', '.dgn', '.dwg', '.dxf', '.e00', '.gen', '.gmt',
        '.bna', '.kml', '.kmz', '.osm', '.pbf', '.xlsx', '.xls', '.ods', '.sqlite',
        '.db', '.mdb', '.accdb', '.nc', '.hdf', '.hdf4', '.hdf5', '.tif', '.tiff',
        '.asc', '.xyz', '.las', '.laz', '.ply', '.obj', '.dae', '.fbx', '.3ds'
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${map.title}`} />
            
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <MapPin className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Edit Map</h1>
                            <p className="text-muted-foreground">Update your map details and files</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link href={`/maps/${map.id}`}>
                            <Button variant="secondary" className="flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                View Details
                            </Button>
                        </Link>
                        <Link href="/dashboard">
                            <Button variant="outline">Cancel</Button>
                        </Link>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
                    {/* Form Section */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Map Information</CardTitle>
                                <CardDescription>
                                    Update the basic details of your map
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Map Title</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Enter map title"
                                        required
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-destructive">{errors.title}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Describe your map"
                                        className="min-h-[100px]"
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-destructive">{errors.description}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Map Image Upload */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Map Preview Image</CardTitle>
                                <CardDescription>
                                    Upload a new preview image for your map (optional)
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {previewImage && (
                                        <div className="relative">
                                            <img
                                                src={previewImage}
                                                alt="Map preview"
                                                className="w-full h-48 object-cover rounded-lg border"
                                            />
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                size="sm"
                                                className="absolute top-2 right-2"
                                                onClick={() => {
                                                    setPreviewImage(null);
                                                    setData('map_image', null);
                                                }}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                    
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                        <Label htmlFor="map_image">Choose new image</Label>
                                        <Input
                                            id="map_image"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                    </div>
                                    {errors.map_image && (
                                        <p className="text-sm text-destructive">{errors.map_image}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* GIS Files Upload */}
                        <Card>
                            <CardHeader>
                                <CardTitle>GIS Files</CardTitle>
                                <CardDescription>
                                    Upload new GIS files to replace existing ones (optional)
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div
                                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                                            isDragging
                                                ? 'border-primary bg-primary/10'
                                                : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                                        }`}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                    >
                                        <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                                        <p className="text-sm text-muted-foreground mb-2">
                                            Drag and drop GIS files here, or click to browse
                                        </p>
                                        <input
                                            type="file"
                                            multiple
                                            accept={supportedGisFormats.join(',')}
                                            onChange={handleGisFilesChange}
                                            className="hidden"
                                            id="gis-files"
                                        />
                                        <Label htmlFor="gis-files" className="cursor-pointer">
                                            <Button type="button" variant="outline">
                                                Browse Files
                                            </Button>
                                        </Label>
                                    </div>

                                    {selectedFiles && selectedFiles.length > 0 && (
                                        <div className="space-y-2">
                                            <h4 className="text-sm font-medium">New files to upload:</h4>
                                            {Array.from(selectedFiles).map((file, index) => (
                                                <div key={index} className="flex items-center justify-between p-2 border rounded">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-4 w-4" />
                                                        <span className="text-sm">{file.name}</span>
                                                        <Badge variant="secondary" className="text-xs">
                                                            {file.name.split('.').pop()?.toUpperCase()}
                                                        </Badge>
                                                        <span className="text-xs text-muted-foreground">
                                                            {formatFileSize(file.size)}
                                                        </span>
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeSelectedFile(index)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {errors.gis_files && (
                                        <Alert variant="destructive">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>{errors.gis_files}</AlertDescription>
                                        </Alert>
                                    )}

                                    <Alert>
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            Note: Uploading new GIS files will replace all existing GIS files.
                                        </AlertDescription>
                                    </Alert>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Current Files Sidebar */}
                    <div className="space-y-6">
                        {/* Submit Button */}
                        <Card>
                            <CardContent className="pt-6">
                                <Button 
                                    type="submit" 
                                    className="w-full"
                                    disabled={processing}
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Current GIS Files */}
                        {map.gis_file_paths && map.gis_file_paths.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Current GIS Files</CardTitle>
                                    <CardDescription>
                                        {map.gis_file_paths.length} file{map.gis_file_paths.length !== 1 ? 's' : ''} currently attached
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {map.gis_file_paths.map((file, index) => (
                                            <div key={index} className="flex items-center gap-2 p-2 border rounded text-sm">
                                                <FileText className="h-4 w-4 text-muted-foreground" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="truncate" title={file.original_name}>
                                                        {file.original_name}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge variant="secondary" className="text-xs">
                                                            {file.extension.toUpperCase()}
                                                        </Badge>
                                                        <span className="text-xs text-muted-foreground">
                                                            {formatFileSize(file.size)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Supported Formats */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Supported Formats</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-1">
                                    {supportedGisFormats.slice(0, 15).map((format) => (
                                        <Badge key={format} variant="outline" className="text-xs">
                                            {format}
                                        </Badge>
                                    ))}
                                    <Badge variant="outline" className="text-xs">
                                        +{supportedGisFormats.length - 15} more
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
