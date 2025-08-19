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
                                    {map.title}
                                </h1>
                                <p className="text-slate-600 flex items-center gap-2 font-medium text-lg">
                                    <Calendar className="h-5 w-5 text-emerald-500" />
                                    Created on {formatDate(map.created_at)}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Link href="/dashboard">
                                <Button className="flex items-center gap-2 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white transform hover:scale-105 transition-all duration-300 rounded-xl font-semibold px-4 py-2">
                                    <ArrowLeft className="h-4 w-4" />
                                    Back to Dashboard
                                </Button>
                            </Link>
                            {isOwner && (
                                <Link href={`/maps/${map.id}/edit`}>
                                    <Button className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-emerald-200/50 rounded-xl font-semibold px-4 py-2">
                                        <Edit3 className="h-4 w-4" />
                                        Edit Map
                                    </Button>
                                </Link>
                            )}
                            <Button
                                onClick={handleDownload}
                                className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-teal-200/50 rounded-xl font-semibold px-4 py-2"
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
                                        Download ZIP
                                    </>
                                )}
                            </Button>
                            {isOwner && (
                                <Button 
                                    variant="destructive" 
                                    onClick={handleDelete} 
                                    className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transform hover:scale-105 transition-all duration-300 rounded-xl font-semibold px-4 py-2"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                <div className={`grid gap-8 lg:grid-cols-3 transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    {/* Map Image Section */}
                    <div className="lg:col-span-2">
                        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl shadow-emerald-100/20 rounded-2xl overflow-hidden transform hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-200/30">
                            <CardHeader className="bg-gradient-to-r from-emerald-100/50 to-teal-100/50 border-b border-emerald-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-emerald-100">
                                        <Eye className="h-5 w-5 text-emerald-700" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-emerald-800 font-bold text-xl">Map Preview</CardTitle>
                                        <CardDescription className="text-emerald-600 font-medium">Click to view in full size</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                {map.map_image_url ? (
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <div className="group relative cursor-pointer rounded-2xl overflow-hidden">
                                                <img
                                                    src={map.map_image_url}
                                                    alt={map.title}
                                                    className="h-auto w-full rounded-2xl border-2 border-emerald-200 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-200/50 transform group-hover:scale-[1.02]"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/20 group-hover:opacity-100">
                                                    <div className="rounded-full bg-white/95 p-4 shadow-lg transform scale-75 group-hover:scale-100 transition-all duration-300">
                                                        <ZoomIn className="h-8 w-8 text-emerald-700" />
                                                    </div>
                                                </div>
                                                <div className="absolute top-3 right-3">
                                                    <Badge className="bg-emerald-600 text-white backdrop-blur-sm font-semibold border-0 shadow-lg">
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

                    {/* Map Details Sidebar */}
                    <div className="space-y-6">
                        {/* Map Information */}
                        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl shadow-teal-100/20 rounded-2xl overflow-hidden transform hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-teal-200/30">
                            <CardHeader className="bg-gradient-to-r from-teal-100/50 to-green-100/50 border-b border-teal-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-teal-100">
                                        <MapPin className="h-5 w-5 text-teal-700" />
                                    </div>
                                    <CardTitle className="text-teal-800 font-bold text-xl">Map Details</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div>
                                    <label className="text-sm font-bold text-teal-800 flex items-center gap-2 mb-2">
                                        <Layers className="h-4 w-4" />
                                        Description
                                    </label>
                                    <p className="text-slate-700 font-medium bg-gradient-to-r from-teal-50 to-green-50 p-4 rounded-xl border border-teal-200">
                                        {map.description || 'No description provided'}
                                    </p>
                                </div>

                                {/* Barangay Location */}
                                {map.barangay && (
                                    <div>
                                        <label className="text-sm font-bold text-emerald-800 flex items-center gap-2 mb-2">
                                            <MapPin className="h-4 w-4" />
                                            Barangay Location
                                        </label>
                                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 px-4 py-3 rounded-xl border border-emerald-200">
                                            <MapPin className="w-5 h-5 text-emerald-700 animate-pulse" />
                                            <span className="text-emerald-800 font-bold text-lg">{map.barangay} Barangay</span>
                                        </div>
                                    </div>
                                )}

                                <Separator className="bg-teal-200" />

                                {/* Google Sheets Integration */}
                                {map.barangay && (
                                    <div>
                                        <label className="text-sm font-bold text-green-800 flex items-center gap-2 mb-3">
                                            <GoogleSheetsIcon className="h-4 w-4" />
                                            Data Management
                                        </label>
                                        <a
                                            href={`/maps/${map.id}/google-sheets-redirect`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={handleGoogleSheetsClick}
                                            className="w-full inline-flex items-center justify-center bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-green-200/50 rounded-xl font-semibold px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                            style={{ 
                                                pointerEvents: isGoogleSheetsLoading ? 'none' : 'auto',
                                                opacity: isGoogleSheetsLoading ? 0.5 : 1 
                                            }}
                                        >
                                            <GoogleSheetsIcon className="mr-2 h-5 w-5" />
                                            {isGoogleSheetsLoading ? 'Opening...' : `Open ${map.barangay} Data Sheet`}
                                            <ExternalLink className="ml-2 h-4 w-4" />
                                        </a>
                                        <p className="text-xs text-green-600 mt-2 text-center">
                                            View and manage crop mapping data for {map.barangay} Barangay
                                        </p>
                                    </div>
                                )}

                                <Separator className="bg-teal-200" />

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-teal-50 to-green-50 rounded-xl border border-teal-200">
                                        <div className="p-2 rounded-lg bg-teal-100">
                                            <Calendar className="h-4 w-4 text-teal-700" />
                                        </div>
                                        <div>
                                            <span className="text-sm font-semibold text-teal-800">Created:</span>
                                            <p className="text-sm text-teal-700 font-medium">{formatDate(map.created_at)}</p>
                                        </div>
                                    </div>
                                    {map.updated_at !== map.created_at && (
                                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-teal-50 to-green-50 rounded-xl border border-teal-200">
                                            <div className="p-2 rounded-lg bg-teal-100">
                                                <Calendar className="h-4 w-4 text-teal-700" />
                                            </div>
                                            <div>
                                                <span className="text-sm font-semibold text-teal-800">Updated:</span>
                                                <p className="text-sm text-teal-700 font-medium">{formatDate(map.updated_at)}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* GIS Files */}
                        {map.gis_file_paths && map.gis_file_paths.length > 0 && (
                            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl shadow-green-100/20 rounded-2xl overflow-hidden transform hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-green-200/30">
                                <CardHeader className="bg-gradient-to-r from-green-100/50 to-emerald-100/50 border-b border-green-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-green-100">
                                            <FileText className="h-5 w-5 text-green-700" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-green-800 font-bold text-xl">GIS Files</CardTitle>
                                            <CardDescription className="text-green-600 font-medium">
                                                {map.gis_file_paths.length} file{map.gis_file_paths.length !== 1 ? 's' : ''} attached
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-3">
                                        {map.gis_file_paths.map((file, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between rounded-2xl border-2 border-green-200 p-4 transition-all duration-300 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:shadow-lg hover:shadow-green-200/30 hover:scale-[1.02] group"
                                            >
                                                <div className="flex min-w-0 flex-1 items-center gap-4">
                                                    <div className="p-2 rounded-xl bg-green-100 group-hover:bg-green-200 transition-colors">
                                                        <FileText className="h-5 w-5 flex-shrink-0 text-green-700" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm font-bold text-green-800 group-hover:text-green-900 transition-colors" title={file.original_name}>
                                                            {file.original_name}
                                                        </p>
                                                        <div className="mt-2 flex items-center gap-3">
                                                            <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-semibold border-0">
                                                                {file.extension.toUpperCase()}
                                                            </Badge>
                                                            <span className="text-xs text-green-600 font-semibold bg-green-100 px-2 py-1 rounded-lg">
                                                                {formatFileSize(file.size)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <a href={file.url} download={file.original_name} className="ml-3 flex-shrink-0">
                                                    <Button className="h-10 w-10 p-0 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl transform hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-green-200/50">
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Statistics */}
                        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl shadow-emerald-100/20 rounded-2xl overflow-hidden transform hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-200/30">
                            <CardHeader className="bg-gradient-to-r from-emerald-100/50 via-teal-100/50 to-green-100/50 border-b border-emerald-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-emerald-100">
                                        <Activity className="h-5 w-5 text-emerald-700" />
                                    </div>
                                    <CardTitle className="text-emerald-800 font-bold text-xl">Statistics</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                                    <span className="text-sm font-semibold text-emerald-800 flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        Total Files:
                                    </span>
                                    <span className="text-lg font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-lg">
                                        {(map.gis_file_paths?.length || 0) + (map.map_image_path ? 1 : 0)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-teal-50 to-green-50 rounded-xl border border-teal-200">
                                    <span className="text-sm font-semibold text-teal-800 flex items-center gap-2">
                                        <FileText className="h-4 w-4" />
                                        GIS Files:
                                    </span>
                                    <span className="text-lg font-bold text-teal-700 bg-teal-100 px-3 py-1 rounded-lg">
                                        {map.gis_file_paths?.length || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                                    <span className="text-sm font-semibold text-green-800 flex items-center gap-2">
                                        <Sparkles className="h-4 w-4" />
                                        Total Size:
                                    </span>
                                    <span className="text-lg font-bold text-green-700 bg-green-100 px-3 py-1 rounded-lg">
                                        {formatFileSize(map.gis_file_paths?.reduce((total, file) => total + file.size, 0) || 0)}
                                    </span>
                                </div>
                                {(map.gis_file_paths?.length || 0) + (map.map_image_path ? 1 : 0) > 0 && (
                                    <div className="border-t border-emerald-200 pt-4">
                                        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 p-4 rounded-xl border border-emerald-200">
                                            <p className="text-sm text-emerald-700 font-semibold flex items-center gap-2">
                                                <Download className="h-4 w-4" />
                                                All files can be downloaded as a ZIP archive using the "Download ZIP" button.
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
