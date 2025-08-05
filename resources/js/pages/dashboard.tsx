import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Calendar, FileText, MapPin, Plus, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Map {
    id: number;
    title: string;
    description: string;
    map_image_path: string | null;
    map_image_url?: string;
    gis_file_paths: Array<{
        original_name: string;
        path: string;
        size: number;
        extension: string;
    }> | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    maps: Map[];
}

export default function Dashboard({ maps = [] }: Props) {
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
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                        <p className="text-muted-foreground">
                            Welcome to your GIS mapping workspace
                        </p>
                    </div>
                    <Link href="/maps/upload">
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Upload New Map
                        </Button>
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Maps</CardTitle>
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{maps.length}</div>
                            <p className="text-xs text-muted-foreground">
                                Maps in your collection
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">GIS Files</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {maps.reduce((total, map) => total + (map.gis_file_paths?.length || 0), 0)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Total uploaded files
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatFileSize(
                                    maps.reduce((total, map) => 
                                        total + (map.gis_file_paths?.reduce((fileTotal, file) => fileTotal + file.size, 0) || 0), 0
                                    )
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Across all maps
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Maps Grid */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Your Maps</h2>
                    {maps.length === 0 ? (
                        <Card className="p-8">
                            <div className="text-center">
                                <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-semibold">No maps yet</h3>
                                <p className="mt-2 text-muted-foreground">
                                    Get started by uploading your first GIS map
                                </p>
                                <Link href="/maps/upload" className="mt-4 inline-block">
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Upload Map
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {maps.map((map) => (
                                <Card key={map.id} className="overflow-hidden">
                                    <div className="relative aspect-video">
                                        {map.map_image_url ? (
                                            <img
                                                src={map.map_image_url}
                                                alt={map.title}
                                                className="absolute inset-0 h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-muted flex items-center justify-center">
                                                <PlaceholderPattern className="size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                                                <MapPin className="absolute h-8 w-8 text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg">{map.title}</CardTitle>
                                        {map.description && (
                                            <CardDescription className="line-clamp-2">
                                                {map.description}
                                            </CardDescription>
                                        )}
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="h-3 w-3" />
                                            {formatDate(map.created_at)}
                                        </div>
                                        {map.gis_file_paths && map.gis_file_paths.length > 0 && (
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium">GIS Files:</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {map.gis_file_paths.slice(0, 3).map((file, index) => (
                                                        <Badge key={index} variant="secondary" className="text-xs">
                                                            {file.extension.toUpperCase()}
                                                        </Badge>
                                                    ))}
                                                    {map.gis_file_paths.length > 3 && (
                                                        <Badge variant="outline" className="text-xs">
                                                            +{map.gis_file_paths.length - 3} more
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
