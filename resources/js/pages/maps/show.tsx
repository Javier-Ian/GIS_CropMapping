import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Calendar, Download, Edit3, FileText, MapPin, Trash2, ZoomIn } from 'lucide-react';
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
    isOwner: boolean;
}

export default function MapShow({ map, isOwner }: Props) {
    const [isDownloading, setIsDownloading] = useState(false);

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

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <MapPin className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{map.title}</h1>
                            <p className="text-muted-foreground">Created on {formatDate(map.created_at)}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {isOwner && (
                            <Link href={`/maps/${map.id}/edit`}>
                                <Button variant="outline" className="flex items-center gap-2">
                                    <Edit3 className="h-4 w-4" />
                                    Edit Map
                                </Button>
                            </Link>
                        )}
                        <Button
                            variant="outline"
                            onClick={handleDownload}
                            className="flex items-center gap-2"
                            disabled={(map.gis_file_paths?.length || 0) + (map.map_image_path ? 1 : 0) === 0 || isDownloading}
                        >
                            <Download className="h-4 w-4" />
                            {isDownloading ? 'Preparing...' : 'Download ZIP'}
                        </Button>
                        {isOwner && (
                            <Button variant="destructive" onClick={handleDelete} className="flex items-center gap-2">
                                <Trash2 className="h-4 w-4" />
                                Delete
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Map Image Section */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Map View</CardTitle>
                                <CardDescription>Click to view in full size</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {map.map_image_url ? (
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <div className="group relative cursor-pointer">
                                                <img
                                                    src={map.map_image_url}
                                                    alt={map.title}
                                                    className="h-auto w-full rounded-lg border transition-shadow hover:shadow-lg"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/0 opacity-0 transition-colors group-hover:bg-black/10 group-hover:opacity-100">
                                                    <div className="rounded-full bg-white/90 p-3">
                                                        <ZoomIn className="h-6 w-6 text-gray-700" />
                                                    </div>
                                                </div>
                                            </div>
                                        </DialogTrigger>
                                        <DialogContent className="max-h-[90vh] max-w-7xl p-0">
                                            <div className="relative">
                                                <img src={map.map_image_url} alt={map.title} className="h-auto max-h-[90vh] w-full object-contain" />
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                ) : (
                                    <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25">
                                        <div className="text-center">
                                            <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
                                            <p className="mt-2 text-muted-foreground">No preview image available</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Map Details Sidebar */}
                    <div className="space-y-6">
                        {/* Map Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Map Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                                    <p className="mt-1 text-sm">{map.description || 'No description provided'}</p>
                                </div>

                                <Separator />

                                <div className="grid grid-cols-1 gap-3 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Created:</span>
                                        <span>{formatDate(map.created_at)}</span>
                                    </div>
                                    {map.updated_at !== map.created_at && (
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">Updated:</span>
                                            <span>{formatDate(map.updated_at)}</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* GIS Files */}
                        {map.gis_file_paths && map.gis_file_paths.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>GIS Files</CardTitle>
                                    <CardDescription>
                                        {map.gis_file_paths.length} file{map.gis_file_paths.length !== 1 ? 's' : ''} attached
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {map.gis_file_paths.map((file, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                                            >
                                                <div className="flex min-w-0 flex-1 items-center gap-3">
                                                    <FileText className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm font-medium" title={file.original_name}>
                                                            {file.original_name}
                                                        </p>
                                                        <div className="mt-1 flex items-center gap-2">
                                                            <Badge variant="secondary" className="text-xs">
                                                                {file.extension.toUpperCase()}
                                                            </Badge>
                                                            <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <a href={file.url} download={file.original_name} className="ml-2 flex-shrink-0">
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
                        <Card>
                            <CardHeader>
                                <CardTitle>Statistics</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Total Files:</span>
                                    <span className="text-sm font-medium">{(map.gis_file_paths?.length || 0) + (map.map_image_path ? 1 : 0)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">GIS Files:</span>
                                    <span className="text-sm font-medium">{map.gis_file_paths?.length || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Total Size:</span>
                                    <span className="text-sm font-medium">
                                        {formatFileSize(map.gis_file_paths?.reduce((total, file) => total + file.size, 0) || 0)}
                                    </span>
                                </div>
                                {(map.gis_file_paths?.length || 0) + (map.map_image_path ? 1 : 0) > 0 && (
                                    <div className="border-t pt-2">
                                        <p className="text-xs text-muted-foreground">
                                            All files can be downloaded as a ZIP archive using the "Download ZIP" button.
                                        </p>
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
