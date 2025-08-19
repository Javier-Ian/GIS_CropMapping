import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import GoogleSheetsIcon from '@/components/icons/GoogleSheetsIcon';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Calendar, Download, Edit3, FileText, MapPin, Trash2, ZoomIn, Sparkles, Activity, Layers, Eye, ArrowLeft, ExternalLink } from 'lucide-react';
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
    isOwner: boolean;
}

export default function MapShow({ map, isOwner }: Props) {
    const [isDownloading, setIsDownloading] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isGoogleSheetsLoading, setIsGoogleSheetsLoading] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

        const handleGoogleSheetsClick = async (e: React.MouseEvent) => {
        // Allow the default link behavior (opening in new tab)
        // but also show loading state
        setIsGoogleSheetsLoading(true);
        
        try {
            console.log('Opening Google Sheets for map:', map.id, 'barangay:', map.barangay);
            
            // Reset loading state after a short delay since the page opens in new tab
            setTimeout(() => {
                setIsGoogleSheetsLoading(false);
            }, 2000);
        } catch (error) {
            console.error('Error with Google Sheets:', error);
            setIsGoogleSheetsLoading(false);
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: map.title,
            href: `/maps/${map.id}`,
        },
    ];

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this map? This action cannot be undone.')) {
            router.delete(route('maps.destroy', map.id));
        }
    };

    const handleDownload = () => {
        // Check if there are files to download
        const totalFiles = (map.gis_file_paths?.length || 0) + (map.map_image_path ? 1 : 0);
        if (totalFiles === 0) {
            alert('No files available for download.');
            return;
        }

        setIsDownloading(true);

        // Show a brief message about what's being downloaded
        const fileTypes = [];
        if (map.map_image_path) fileTypes.push('map image');
        if (map.gis_file_paths?.length) fileTypes.push(`${map.gis_file_paths.length} GIS file${map.gis_file_paths.length !== 1 ? 's' : ''}`);

        const message = `Preparing download with ${fileTypes.join(' and ')}...`;
        console.log(message);

        // Create a temporary link to trigger download
        const link = document.createElement('a');
        link.href = route('maps.download', map.id);
        link.download = `${map.title}_files.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Reset downloading state after a short delay
        setTimeout(() => {
            setIsDownloading(false);
        }, 2000);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={map.title} />

            <div className={`flex h-full flex-1 flex-col gap-4 rounded-xl p-4 bg-gradient-to-br from-emerald-50/30 to-teal-50/30 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                {/* Compact Header */}
                <div className={`transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 via-teal-600 to-green-600 text-white shadow-lg shadow-emerald-200/50 transform transition-all duration-300 hover:scale-110">
                                <MapPin className="h-6 w-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-emerald-700 via-teal-600 to-green-700 bg-clip-text text-transparent flex items-center gap-2 mb-1">
                                    <Sparkles className="h-6 w-6 text-emerald-600 transform transition-all duration-300 hover:rotate-12 hover:scale-110" />
                                    {map.title}
                                </h1>
                                <p className="text-slate-600 flex items-center gap-2 font-medium text-sm">
                                    <Calendar className="h-4 w-4 text-emerald-500" />
                                    Created on {formatDate(map.created_at)}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Link href="/dashboard">
                                <Button size="sm" className="flex items-center gap-2 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white transform hover:scale-105 transition-all duration-300 rounded-lg font-semibold">
                                    <ArrowLeft className="h-4 w-4" />
                                    Back
                                </Button>
                            </Link>
                            {isOwner && (
                                <Link href={`/maps/${map.id}/edit`}>
                                    <Button size="sm" className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-emerald-200/50 rounded-lg font-semibold">
                                        <Edit3 className="h-4 w-4" />
                                        Edit
                                    </Button>
                                </Link>
                            )}
                            <Button
                                size="sm"
                                onClick={handleDownload}
                                className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-teal-200/50 rounded-lg font-semibold"
                                disabled={(map.gis_file_paths?.length || 0) + (map.map_image_path ? 1 : 0) === 0 || isDownloading}
                            >
                                {isDownloading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        Preparing...
                                    </>
                                ) : (
                                    <>
                                        <Download className="h-4 w-4" />
                                        ZIP
                                    </>
                                )}
                            </Button>
                            {isOwner && (
                                <Button 
                                    size="sm"
                                    variant="destructive" 
                                    onClick={handleDelete} 
                                    className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transform hover:scale-105 transition-all duration-300 rounded-lg font-semibold"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                <div className={`grid gap-4 lg:grid-cols-4 xl:grid-cols-5 flex-1 min-h-0 transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    {/* Map Image Section - Takes up more space */}
                    <div className="lg:col-span-3 xl:col-span-3 h-full">
                        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl shadow-emerald-100/20 rounded-xl overflow-hidden transform hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-200/30 h-full">
                            <CardHeader className="bg-gradient-to-r from-emerald-100/50 to-teal-100/50 border-b border-emerald-100 py-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-emerald-100">
                                        <Eye className="h-4 w-4 text-emerald-700" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-emerald-800 font-bold text-lg">Map Preview</CardTitle>
                                        <CardDescription className="text-emerald-600 font-medium text-sm">Click to view in full size</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 h-full flex flex-col">
                                {map.map_image_url ? (
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <div className="group relative cursor-pointer rounded-xl overflow-hidden flex-1 min-h-0">
                                                <img
                                                    src={map.map_image_url}
                                                    alt={map.title}
                                                    className="h-full w-full object-contain rounded-xl border-2 border-emerald-200 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-200/50 transform group-hover:scale-[1.01]"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/20 group-hover:opacity-100">
                                                    <div className="rounded-full bg-white/95 p-3 shadow-lg transform scale-75 group-hover:scale-100 transition-all duration-300">
                                                        <ZoomIn className="h-6 w-6 text-emerald-700" />
                                                    </div>
                                                </div>
                                                <div className="absolute top-2 right-2">
                                                    <Badge className="bg-emerald-600 text-white backdrop-blur-sm font-semibold border-0 shadow-lg text-xs">
                                                        <Eye className="w-3 h-3 mr-1" />
                                                        Click to Zoom
                                                    </Badge>
                                                </div>
                                            </div>
                                        </DialogTrigger>
                                        <DialogContent className="max-h-[90vh] max-w-7xl p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-3xl">
                                            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                                <img src={map.map_image_url} alt={map.title} className="h-auto max-h-[90vh] w-full object-contain rounded-2xl" />
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                ) : (
                                    <div className="flex h-96 items-center justify-center rounded-2xl border-3 border-dashed border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50">
                                        <div className="text-center">
                                            <div className="relative mb-4">
                                                <MapPin className="mx-auto h-16 w-16 text-emerald-400 animate-bounce" />
                                                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
                                            </div>
                                            <p className="text-emerald-700 font-semibold text-lg">No preview image available</p>
                                            <p className="text-emerald-600 font-medium text-sm mt-1">Upload an image to see your map preview here</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Compact Sidebar */}
                    <div className="lg:col-span-1 xl:col-span-2 space-y-3 h-full overflow-y-auto">
                        {/* Map Information */}
                        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl shadow-teal-100/20 rounded-xl overflow-hidden transform hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-teal-200/30">
                            <CardHeader className="bg-gradient-to-r from-teal-100/50 to-green-100/50 border-b border-teal-100 py-3">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 rounded-lg bg-teal-100">
                                        <MapPin className="h-4 w-4 text-teal-700" />
                                    </div>
                                    <CardTitle className="text-teal-800 font-bold text-base">Map Details</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 space-y-3">
                                <div>
                                    <label className="text-xs font-bold text-teal-800 flex items-center gap-1 mb-2">
                                        <Layers className="h-3 w-3" />
                                        Description
                                    </label>
                                    <p className="text-slate-700 text-sm font-medium bg-gradient-to-r from-teal-50 to-green-50 p-3 rounded-lg border border-teal-200">
                                        {map.description || 'No description provided'}
                                    </p>
                                </div>

                                {/* Barangay Location */}
                                {map.barangay && (
                                    <div>
                                        <label className="text-xs font-bold text-emerald-800 flex items-center gap-1 mb-2">
                                            <MapPin className="h-3 w-3" />
                                            Barangay Location
                                        </label>
                                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 px-3 py-2 rounded-lg border border-emerald-200">
                                            <MapPin className="w-4 h-4 text-emerald-700" />
                                            <span className="text-emerald-800 font-bold text-sm">{map.barangay} Barangay</span>
                                        </div>
                                    </div>
                                )}

                                {/* Google Sheets Integration */}
                                {map.barangay && (
                                    <div>
                                        <label className="text-xs font-bold text-green-800 flex items-center gap-1 mb-2">
                                            <GoogleSheetsIcon className="h-3 w-3" />
                                            Data Management
                                        </label>
                                        <a
                                            href={`/maps/${map.id}/google-sheets-redirect`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={handleGoogleSheetsClick}
                                            className="w-full inline-flex items-center justify-center bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-green-200/50 rounded-lg font-semibold px-3 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                            style={{ 
                                                pointerEvents: isGoogleSheetsLoading ? 'none' : 'auto',
                                                opacity: isGoogleSheetsLoading ? 0.5 : 1 
                                            }}
                                        >
                                            <GoogleSheetsIcon className="mr-1.5 h-4 w-4" />
                                            {isGoogleSheetsLoading ? 'Opening...' : `${map.barangay} Data`}
                                            <ExternalLink className="ml-1.5 h-3 w-3" />
                                        </a>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-teal-50 to-green-50 rounded-lg border border-teal-200">
                                        <div className="p-1 rounded bg-teal-100">
                                            <Calendar className="h-3 w-3 text-teal-700" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className="text-xs font-semibold text-teal-800 block">Created:</span>
                                            <p className="text-xs text-teal-700 font-medium truncate">{formatDate(map.created_at)}</p>
                                        </div>
                                    </div>
                                    {map.updated_at !== map.created_at && (
                                        <div className="flex items-center gap-2 p-2 bg-gradient-to-r from-teal-50 to-green-50 rounded-lg border border-teal-200">
                                            <div className="p-1 rounded bg-teal-100">
                                                <Calendar className="h-3 w-3 text-teal-700" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <span className="text-xs font-semibold text-teal-800 block">Updated:</span>
                                                <p className="text-xs text-teal-700 font-medium truncate">{formatDate(map.updated_at)}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                        {/* GIS Files - Compact */}
                        {map.gis_file_paths && map.gis_file_paths.length > 0 && (
                            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl shadow-green-100/20 rounded-xl overflow-hidden transform hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-green-200/30">
                                <CardHeader className="bg-gradient-to-r from-green-100/50 to-emerald-100/50 border-b border-green-100 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 rounded-lg bg-green-100">
                                            <FileText className="h-4 w-4 text-green-700" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-green-800 font-bold text-base">GIS Files</CardTitle>
                                            <CardDescription className="text-green-600 font-medium text-xs">
                                                {map.gis_file_paths.length} file{map.gis_file_paths.length !== 1 ? 's' : ''}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-3">
                                    <div className="space-y-2">
                                        {map.gis_file_paths.map((file, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between rounded-lg border border-green-200 p-2 transition-all duration-300 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:shadow-md group"
                                            >
                                                <div className="flex min-w-0 flex-1 items-center gap-2">
                                                    <div className="p-1 rounded bg-green-100 group-hover:bg-green-200 transition-colors">
                                                        <FileText className="h-3 w-3 flex-shrink-0 text-green-700" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-xs font-bold text-green-800 group-hover:text-green-900 transition-colors" title={file.original_name}>
                                                            {file.original_name}
                                                        </p>
                                                        <div className="mt-1 flex items-center gap-1">
                                                            <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-semibold border-0 px-1.5 py-0.5">
                                                                {file.extension.toUpperCase()}
                                                            </Badge>
                                                            <span className="text-xs text-green-600 font-semibold bg-green-100 px-1.5 py-0.5 rounded">
                                                                {formatFileSize(file.size)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <a href={file.url} download={file.original_name} className="ml-2 flex-shrink-0">
                                                    <Button size="sm" className="h-7 w-7 p-0 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-green-200/50">
                                                        <Download className="h-3 w-3" />
                                                    </Button>
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Statistics - Compact */}
                        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl shadow-emerald-100/20 rounded-xl overflow-hidden transform hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-200/30">
                            <CardHeader className="bg-gradient-to-r from-emerald-100/50 via-teal-100/50 to-green-100/50 border-b border-emerald-100 py-3">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 rounded-lg bg-emerald-100">
                                        <Activity className="h-4 w-4 text-emerald-700" />
                                    </div>
                                    <CardTitle className="text-emerald-800 font-bold text-base">Statistics</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-3 space-y-2">
                                <div className="grid grid-cols-1 gap-2">
                                    <div className="flex justify-between items-center p-2 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                                        <span className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
                                            <FileText className="h-3 w-3" />
                                            Total Files:
                                        </span>
                                        <span className="text-sm font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded">
                                            {(map.gis_file_paths?.length || 0) + (map.map_image_path ? 1 : 0)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center p-2 bg-gradient-to-r from-teal-50 to-green-50 rounded-lg border border-teal-200">
                                        <span className="text-xs font-semibold text-teal-800 flex items-center gap-1">
                                            <FileText className="h-3 w-3" />
                                            GIS Files:
                                        </span>
                                        <span className="text-sm font-bold text-teal-700 bg-teal-100 px-2 py-1 rounded">
                                            {map.gis_file_paths?.length || 0}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                                        <span className="text-xs font-semibold text-green-800 flex items-center gap-1">
                                            <Sparkles className="h-3 w-3" />
                                            Total Size:
                                        </span>
                                        <span className="text-sm font-bold text-green-700 bg-green-100 px-2 py-1 rounded">
                                            {formatFileSize(map.gis_file_paths?.reduce((total, file) => total + file.size, 0) || 0)}
                                        </span>
                                    </div>
                                </div>
                                {(map.gis_file_paths?.length || 0) + (map.map_image_path ? 1 : 0) > 0 && (
                                    <div className="border-t border-emerald-200 pt-2">
                                        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 p-2 rounded-lg border border-emerald-200">
                                            <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                                                <Download className="h-3 w-3" />
                                                Download all files as ZIP using button above.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
