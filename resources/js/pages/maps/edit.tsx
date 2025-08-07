import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useFlashNotifications } from '@/hooks/use-flash-notifications';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { AlertCircle, Eye, FileText, MapPin, Save, Upload, X, Sparkles, Activity, Database, Layers, Camera, ArrowLeft, CheckCircle, FileUp, Download, FileCheck, Info, Map } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Map {
    id: number;
    title: string;
    description: string;
    barangay: string;
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
    const [filesToDelete, setFilesToDelete] = useState<number[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const { data, setData, post, processing } = useForm({
        title: map.title,
        description: map.description,
        barangay: map.barangay || '',
        map_image: null as File | null,
        gis_files: null as File[] | null,
        remove_gis_files: [] as number[],
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

    const handleBrowseClick = () => {
        const fileInput = document.getElementById('gis-files') as HTMLInputElement;
        if (fileInput) {
            fileInput.click();
        }
    };

    const handleFileDownload = (file: any) => {
        if (file.url) {
            window.open(file.url, '_blank');
        }
    };

    const removeNewFile = (index: number) => {
        if (data.gis_files) {
            const newFiles = [...data.gis_files];
            newFiles.splice(index, 1);
            setData('gis_files', newFiles.length > 0 ? newFiles : null);
        }
    };

    const handleDropAreaClick = (e: React.MouseEvent) => {
        // Only trigger file input if clicked area is not the button
        const target = e.target as HTMLElement;
        if (!target.closest('button')) {
            handleBrowseClick();
        }
    };

    const handleFileDeleteToggle = (index: number) => {
        const newFilesToDelete = filesToDelete.includes(index) ? filesToDelete.filter((i) => i !== index) : [...filesToDelete, index];

        setFilesToDelete(newFilesToDelete);
        setData('remove_gis_files', newFilesToDelete);
    };

    const handleSelectAllFiles = () => {
        if (!map.gis_file_paths || map.gis_file_paths.length === 0) return;

        if (filesToDelete.length === map.gis_file_paths.length) {
            // If all are selected, deselect all
            setFilesToDelete([]);
            setData('remove_gis_files', []);
        } else {
            // Select all files
            const allIndices = map.gis_file_paths.map((_, index) => index);
            setFilesToDelete(allIndices);
            setData('remove_gis_files', allIndices);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/maps/${map.id}`, {
            forceFormData: true,
        });
    };

    const supportedGisFormats = [
        '.qgz',
        '.qgs',
        '.qlr',
        '.qml',
        '.qmd',
        '.shp',
        '.shx',
        '.dbf',
        '.prj',
        '.cpg',
        '.kml',
        '.kmz',
        '.gpx',
        '.geojson',
        '.json',
        '.gml',
        '.geopackage',
        '.gpkg',
        '.mxd',
        '.lyr',
        '.style',
        '.qml',
        '.sld',
        '.se',
        '.fgb',
        '.parquet',
        '.csv',
        '.tab',
        '.mif',
        '.mid',
        '.dgn',
        '.dwg',
        '.dxf',
        '.e00',
        '.gen',
        '.gmt',
        '.bna',
        '.kml',
        '.kmz',
        '.osm',
        '.pbf',
        '.xlsx',
        '.xls',
        '.ods',
        '.sqlite',
        '.db',
        '.mdb',
        '.accdb',
        '.nc',
        '.hdf',
        '.hdf4',
        '.hdf5',
        '.tif',
        '.tiff',
        '.asc',
        '.xyz',
        '.las',
        '.laz',
        '.ply',
        '.obj',
        '.dae',
        '.fbx',
        '.3ds',
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${map.title}`} />

            <div className={`flex h-full flex-1 flex-col gap-8 rounded-xl p-6 bg-gradient-to-br from-emerald-50/30 to-teal-50/30 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                {/* Animated Header */}
                <div className={`transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-green-600 text-white shadow-lg shadow-emerald-200/50 transform transition-all duration-300 hover:scale-110 hover:rotate-3">
                                <MapPin className="h-8 w-8 animate-pulse" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-emerald-700 via-teal-600 to-green-700 bg-clip-text text-transparent flex items-center gap-3 mb-2">
                                    <Sparkles className="h-8 w-8 text-emerald-600 transform transition-all duration-300 hover:rotate-12 hover:scale-110 drop-shadow-sm" />
                                    Edit Map
                                </h1>
                                <p className="text-slate-600 flex items-center gap-2 font-medium text-lg">
                                    <Activity className="h-5 w-5 text-emerald-500" />
                                    Update your map details and files
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Link href={`/maps/${map.id}`}>
                                <Button className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-teal-200/50 rounded-xl font-semibold px-4 py-2">
                                    <Eye className="h-4 w-4" />
                                    View Details
                                </Button>
                            </Link>
                            <Link href="/dashboard">
                                <Button className="flex items-center gap-2 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white transform hover:scale-105 transition-all duration-300 rounded-xl font-semibold px-4 py-2">
                                    <ArrowLeft className="h-4 w-4" />
                                    Cancel
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className={`grid gap-8 lg:grid-cols-3 transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    {/* Form Section */}
                    <div className="space-y-8 lg:col-span-2">
                        {/* Basic Information */}
                        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl shadow-emerald-100/20 rounded-2xl overflow-hidden transform hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-200/30">
                            <CardHeader className="bg-gradient-to-r from-emerald-100/50 to-teal-100/50 border-b border-emerald-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-emerald-100">
                                        <Database className="h-5 w-5 text-emerald-700" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-emerald-800 font-bold text-xl">Map Information</CardTitle>
                                        <CardDescription className="text-emerald-600 font-medium">Update the basic details of your map</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="space-y-3">
                                    <Label htmlFor="title" className="text-emerald-800 font-semibold flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-emerald-600" />
                                        Map Title
                                    </Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Enter map title"
                                        required
                                        className={`border-2 transition-all duration-300 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl ${errors.title ? 'border-red-400 focus:border-red-400' : 'border-emerald-200 hover:border-emerald-300'}`}
                                    />
                                    {errors.title && (
                                        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded-lg">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.title}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="description" className="text-emerald-800 font-semibold flex items-center gap-2">
                                        <Layers className="h-4 w-4 text-emerald-600" />
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Describe your map"
                                        className={`min-h-[120px] border-2 transition-all duration-300 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl ${errors.description ? 'border-red-400 focus:border-red-400' : 'border-emerald-200 hover:border-emerald-300'}`}
                                    />
                                    {errors.description && (
                                        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded-lg">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.description}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="barangay" className="text-emerald-800 font-semibold flex items-center gap-2">
                                        <Map className="h-4 w-4 text-emerald-600" />
                                        Barangay Location
                                    </Label>
                                    <Select value={data.barangay} onValueChange={(value) => setData('barangay', value)}>
                                        <SelectTrigger className={`border-2 transition-all duration-300 focus:border-emerald-400 focus:ring-emerald-200 rounded-xl ${errors.barangay ? 'border-red-400 focus:border-red-400' : 'border-emerald-200 hover:border-emerald-300'}`}>
                                            <SelectValue placeholder="Select barangay location..." />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-emerald-200">
                                            <SelectItem value="Butong" className="cursor-pointer hover:bg-emerald-50 focus:bg-emerald-100 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                                    Butong
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="Salawagan" className="cursor-pointer hover:bg-emerald-50 focus:bg-emerald-100 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                                                    Salawagan
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="San Jose" className="cursor-pointer hover:bg-emerald-50 focus:bg-emerald-100 rounded-lg">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
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
                                    <p className="text-sm text-emerald-600 flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4" />
                                        Update the barangay where this agricultural map data was collected
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Map Image Upload */}
                        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl shadow-teal-100/20 rounded-2xl overflow-hidden transform hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-teal-200/30">
                            <CardHeader className="bg-gradient-to-r from-teal-100/50 to-green-100/50 border-b border-teal-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-teal-100">
                                        <Camera className="h-5 w-5 text-teal-700" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-teal-800 font-bold text-xl">Map Preview Image</CardTitle>
                                        <CardDescription className="text-teal-600 font-medium">Upload a new preview image for your map (optional)</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-6">
                                    {previewImage && (
                                        <div className="relative group">
                                            <img src={previewImage} alt="Map preview" className="h-64 w-full rounded-2xl border-2 border-teal-200 object-cover transform group-hover:scale-[1.02] transition-all duration-300 shadow-lg" />
                                            <Button
                                                type="button"
                                                className="absolute top-3 right-3 h-8 w-8 p-0 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl transform hover:scale-110 transition-all duration-300 shadow-lg"
                                                onClick={() => {
                                                    setPreviewImage(null);
                                                    setData('map_image', null);
                                                }}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}

                                    <div className="space-y-3">
                                        <Label htmlFor="map_image" className="text-teal-800 font-semibold flex items-center gap-2">
                                            <Camera className="h-4 w-4 text-teal-600" />
                                            Choose New Image
                                        </Label>
                                        <Input 
                                            id="map_image" 
                                            type="file" 
                                            accept="image/*" 
                                            onChange={handleImageChange}
                                            className={`border-2 transition-all duration-300 focus:border-teal-400 focus:ring-teal-200 rounded-xl file:bg-gradient-to-r file:from-teal-600 file:to-green-600 file:text-white file:border-0 file:rounded-lg file:px-4 file:py-2 file:mr-4 file:font-semibold hover:file:from-teal-700 hover:file:to-green-700 ${errors.map_image ? 'border-red-400 focus:border-red-400' : 'border-teal-200 hover:border-teal-300'}`}
                                        />
                                        {errors.map_image && (
                                            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded-lg">
                                                <AlertCircle className="h-4 w-4" />
                                                {errors.map_image}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* GIS Files Upload */}
                        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl shadow-green-100/20 rounded-2xl overflow-hidden transform hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-green-200/30">
                            <CardHeader className="bg-gradient-to-r from-green-100/50 to-emerald-100/50 border-b border-green-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-green-100">
                                        <FileUp className="h-5 w-5 text-green-700" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-green-800 font-bold text-xl">GIS Files</CardTitle>
                                        <CardDescription className="text-green-600 font-medium">Update your map's GIS data files (optional)</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-6">
                                    {/* Current Files */}
                                    {map.gis_file_paths && map.gis_file_paths.length > 0 && (
                                        <div className="space-y-3">
                                            <Label className="text-green-800 font-semibold flex items-center gap-2">
                                                <FileText className="h-4 w-4 text-green-600" />
                                                Current Files
                                            </Label>
                                            <div className="grid gap-3">
                                                {map.gis_file_paths.map((file: any, index: number) => (
                                                    <div key={index} className="flex items-center justify-between p-4 border border-green-200 rounded-xl bg-gradient-to-r from-green-50/50 to-emerald-50/50 hover:from-green-100/50 hover:to-emerald-100/50 transition-all duration-300">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 rounded-lg bg-green-100">
                                                                <FileText className="h-4 w-4 text-green-700" />
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-green-800">{file.original_name || file.name}</p>
                                                                <p className="text-sm text-green-600">{(file.size / 1024).toFixed(2)} KB</p>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleFileDownload(file)}
                                                            className="text-green-700 hover:text-green-800 hover:bg-green-100 rounded-lg"
                                                        >
                                                            <Download className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* File Upload */}
                                    <div className="space-y-3">
                                        <Label htmlFor="gis_files" className="text-green-800 font-semibold flex items-center gap-2">
                                            <FileUp className="h-4 w-4 text-green-600" />
                                            Upload New Files
                                        </Label>
                                        <Input
                                            id="gis_files"
                                            type="file"
                                            multiple
                                            accept=".shp,.kml,.kmz,.geojson,.gpx,.gdb,.tif,.tiff"
                                            onChange={handleGisFilesChange}
                                            className={`border-2 transition-all duration-300 focus:border-green-400 focus:ring-green-200 rounded-xl file:bg-gradient-to-r file:from-green-600 file:to-emerald-600 file:text-white file:border-0 file:rounded-lg file:px-4 file:py-2 file:mr-4 file:font-semibold hover:file:from-green-700 hover:file:to-emerald-700 ${errors.gis_files ? 'border-red-400 focus:border-red-400' : 'border-green-200 hover:border-green-300'}`}
                                        />
                                        {errors.gis_files && (
                                            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded-lg">
                                                <AlertCircle className="h-4 w-4" />
                                                {errors.gis_files}
                                            </div>
                                        )}
                                    </div>

                                    {/* New Files Preview */}
                                    {data.gis_files && data.gis_files.length > 0 && (
                                        <div className="space-y-3">
                                            <Label className="text-green-800 font-semibold flex items-center gap-2">
                                                <FileCheck className="h-4 w-4 text-green-600" />
                                                Files to Upload
                                            </Label>
                                            <div className="grid gap-3">
                                                {Array.from(data.gis_files).map((file: File, index: number) => (
                                                    <div key={index} className="flex items-center justify-between p-4 border-2 border-dashed border-green-300 rounded-xl bg-gradient-to-r from-green-50/80 to-emerald-50/80 hover:from-green-100/80 hover:to-emerald-100/80 transition-all duration-300">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 rounded-lg bg-green-100">
                                                                <FileCheck className="h-4 w-4 text-green-700" />
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-green-800">{file.name}</p>
                                                                <p className="text-sm text-green-600">{(file.size / 1024).toFixed(2)} KB</p>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removeNewFile(index)}
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-100 rounded-lg"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                                        <p className="text-sm text-green-700 font-medium flex items-center gap-2">
                                            <Info className="h-4 w-4" />
                                            Supported formats: SHP, KML, KMZ, GeoJSON, GPX, GDB, TIFF
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Enhanced Sidebar */}
                    <div className="space-y-6">
                        {/* Submit Button */}
                        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl shadow-emerald-100/20 rounded-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-200/30">
                            <CardContent className="p-6">
                                <Button 
                                    type="submit" 
                                    className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300" 
                                    disabled={processing}
                                >
                                    <Save className="mr-3 h-5 w-5" />
                                    {processing ? 'Saving Changes...' : 'Save Changes'}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Map Statistics */}
                        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl shadow-green-100/20 rounded-2xl overflow-hidden transform hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-green-200/30">
                            <CardHeader className="bg-gradient-to-r from-green-100/50 to-emerald-100/50 border-b border-green-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-green-100">
                                        <Activity className="h-5 w-5 text-green-700" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-green-800 font-bold">Map Statistics</CardTitle>
                                        <CardDescription className="text-green-600 font-medium">Current map details</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                                        <span className="text-green-700 font-medium">Total Files</span>
                                        <Badge className="bg-green-600 hover:bg-green-700 text-white">
                                            {map.gis_file_paths?.length || 0}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
                                        <span className="text-emerald-700 font-medium">Created</span>
                                        <span className="text-emerald-600 text-sm font-medium">
                                            {new Date(map.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-teal-50 to-green-50 rounded-xl">
                                        <span className="text-teal-700 font-medium">Last Updated</span>
                                        <span className="text-teal-600 text-sm font-medium">
                                            {new Date(map.updated_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Current GIS Files Management */}
                        {map.gis_file_paths && map.gis_file_paths.length > 0 && (
                            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl shadow-emerald-100/20 rounded-2xl overflow-hidden transform hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-200/30">
                                <CardHeader className="bg-gradient-to-r from-emerald-100/50 to-green-100/50 border-b border-emerald-100">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-xl bg-emerald-100">
                                                <Database className="h-5 w-5 text-emerald-700" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-emerald-800 font-bold">File Management</CardTitle>
                                                <CardDescription className="text-emerald-600 font-medium">
                                                    {map.gis_file_paths.length} file{map.gis_file_paths.length !== 1 ? 's' : ''} attached
                                                </CardDescription>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                id="select-all-files"
                                                checked={filesToDelete.length === map.gis_file_paths.length && map.gis_file_paths.length > 0}
                                                onCheckedChange={handleSelectAllFiles}
                                                className="border-emerald-400 data-[state=checked]:bg-emerald-600"
                                            />
                                            <Label htmlFor="select-all-files" className="cursor-pointer text-sm font-medium text-emerald-700 hover:text-emerald-800">
                                                Select All
                                            </Label>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-3">
                                        {map.gis_file_paths.map((file, index) => (
                                            <div key={index} className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 ${filesToDelete.includes(index) ? 'border-red-300 bg-red-50/50' : 'border-emerald-200 bg-gradient-to-r from-emerald-50/50 to-green-50/50 hover:from-emerald-100/50 hover:to-green-100/50'}`}>
                                                <Checkbox
                                                    id={`file-${index}`}
                                                    checked={filesToDelete.includes(index)}
                                                    onCheckedChange={() => handleFileDeleteToggle(index)}
                                                    className="border-emerald-400 data-[state=checked]:bg-emerald-600"
                                                />
                                                <div className="p-2 rounded-lg bg-emerald-100">
                                                    <FileText className="h-4 w-4 text-emerald-700" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate font-semibold text-emerald-800" title={file.original_name}>
                                                        {file.original_name}
                                                    </p>
                                                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                                                        <Badge className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white">
                                                            {file.extension.toUpperCase()}
                                                        </Badge>
                                                        <span className="text-xs text-emerald-600 font-medium">{formatFileSize(file.size)}</span>
                                                        {filesToDelete.includes(index) && (
                                                            <Badge variant="destructive" className="text-xs">
                                                                Will be deleted
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {filesToDelete.length > 0 && (
                                        <Alert className="mt-4 border-red-200 bg-red-50/50">
                                            <AlertCircle className="h-4 w-4 text-red-600" />
                                            <AlertDescription className="text-red-700 font-medium">
                                                {filesToDelete.length} file{filesToDelete.length !== 1 ? 's' : ''} selected for deletion. They will be
                                                removed when you save changes.
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Supported Formats */}
                        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl shadow-teal-100/20 rounded-2xl overflow-hidden transform hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-teal-200/30">
                            <CardHeader className="bg-gradient-to-r from-teal-100/50 to-emerald-100/50 border-b border-teal-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-teal-100">
                                        <Layers className="h-5 w-5 text-teal-700" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-teal-800 font-bold">Supported Formats</CardTitle>
                                        <CardDescription className="text-teal-600 font-medium">Compatible file types</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="flex flex-wrap gap-2">
                                    {supportedGisFormats.slice(0, 15).map((format) => (
                                        <Badge key={format} className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs">
                                            {format}
                                        </Badge>
                                    ))}
                                    <Badge className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white text-xs">
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
