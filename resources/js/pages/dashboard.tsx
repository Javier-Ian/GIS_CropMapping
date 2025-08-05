import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { notify } from '@/lib/notifications';
import { useFlashNotifications } from '@/hooks/use-flash-notifications';
import { Head, Link, router } from '@inertiajs/react';
import { Calendar, FileText, MapPin, Plus, Users, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

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
    user: {
        id: number;
        name: string;
        email: string;
    };
}

interface Props {
    maps: Map[];
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
}

export default function Dashboard({ maps = [], auth }: Props) {
    // Handle flash notifications from Laravel
    useFlashNotifications();

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

    const getUserInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .slice(0, 2)
            .join('');
    };

    const handleEditMap = (map: Map) => {
        // Check if current user owns the map
        if (map.user.id !== auth.user.id) {
            notify.permissionDenied(map.user.name.toUpperCase(), 'edit');
            return;
        }
        // If user owns the map, navigate to edit page
        window.location.href = `/maps/${map.id}/edit`;
    };

    const handleDeleteMap = (map: Map) => {
        // Check if current user owns the map
        if (map.user.id !== auth.user.id) {
            notify.permissionDenied(map.user.name.toUpperCase(), 'delete');
            return;
        }
        
        // Show themed confirmation dialog
        notify.mapDeleteConfirm(map.title).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/maps/${map.id}`, {
                    onSuccess: () => {
                        notify.success(
                            '🗑️ Map Deleted Successfully!',
                            `Your map "${map.title}" has been permanently removed.`
                        );
                    },
                    onError: () => {
                        notify.error(
                            '❌ Deletion Failed!',
                            'There was a problem deleting your map. Please try again.'
                        );
                    }
                });
            }
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
                    
                    {/* Notification Demo - Remove in production */}
                    <div className="flex gap-2">
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => notify.permissionDenied('IAN DAVE JAVIER', 'edit')}
                        >
                            Demo Permission
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => notify.mapUploadSuccess('Demo Map')}
                        >
                            Demo Success
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => notify.welcomeToast(auth.user.name)}
                        >
                            Demo Toast
                        </Button>
                    </div>
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

                {/* Maps Feed */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">Your Maps</h2>
                        <p className="text-sm text-muted-foreground">
                            {maps.length} {maps.length === 1 ? 'map' : 'maps'} in your collection
                        </p>
                    </div>
                    
                    {maps.length === 0 ? (
                        <div className="max-w-2xl mx-auto">
                            <Card className="border-dashed border-2 p-8">
                                <div className="text-center">
                                    <div className="mx-auto h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                                        <MapPin className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">No maps yet</h3>
                                    <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
                                        Get started by uploading your first GIS map and begin exploring spatial data
                                    </p>
                                    <Link href="/maps/upload">
                                        <Button className="shadow-md">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Upload Your First Map
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        </div>
                    ) : (
                        <div className="max-w-2xl mx-auto space-y-4">
                            {maps.map((map) => (
                                <Card key={map.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border-0 bg-card/50 backdrop-blur-sm">
                                    {/* Map Header - Like a social media post header */}
                                    <CardHeader className="pb-2">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-3">
                                                {/* User Avatar */}
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                                                    {getUserInitials(map.user.name)}
                                                </div>
                                                {/* Map Info */}
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-semibold text-foreground">{map.user.name.toUpperCase()}</span>
                                                        <span className="text-xs text-muted-foreground">•</span>
                                                        <span className="text-xs text-muted-foreground">uploaded {formatDate(map.created_at)}</span>
                                                    </div>
                                                    <CardTitle className="text-lg font-bold">{map.title}</CardTitle>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                                            <MoreHorizontal className="h-3 w-3" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem 
                                                            onClick={() => handleEditMap(map)}
                                                            className="flex items-center gap-2 cursor-pointer"
                                                        >
                                                            <Pencil className="h-3 w-3" />
                                                            Edit Map
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem 
                                                            onClick={() => handleDeleteMap(map)}
                                                            className="flex items-center gap-2 text-destructive cursor-pointer"
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                            Delete Map
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                        {map.description && (
                                            <CardDescription className="text-sm leading-relaxed pt-2 ml-13">
                                                {map.description}
                                            </CardDescription>
                                        )}
                                    </CardHeader>

                                    {/* Map Image - Full width like social media */}
                                    <div className="relative">
                                        <div className="aspect-[16/9] relative bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/50 dark:to-green-950/50">
                                            {map.map_image_url ? (
                                                <img
                                                    src={map.map_image_url}
                                                    alt={map.title}
                                                    className="absolute inset-0 h-full w-full object-cover rounded-none"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <PlaceholderPattern className="size-full stroke-neutral-900/10 dark:stroke-neutral-100/10" />
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="text-center space-y-1">
                                                            <MapPin className="h-8 w-8 text-muted-foreground/60 mx-auto" />
                                                            <p className="text-xs text-muted-foreground/80 font-medium">Map Preview</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {/* Overlay gradient for better text readability */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                                        </div>
                                    </div>

                                    {/* Map Details & Actions - Like social media engagement section */}
                                    <CardContent className="p-3 space-y-3">
                                        {/* GIS Files Tags */}
                                        {map.gis_file_paths && map.gis_file_paths.length > 0 && (
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-xs font-medium text-muted-foreground">
                                                        {map.gis_file_paths.length} GIS {map.gis_file_paths.length === 1 ? 'file' : 'files'}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatFileSize(map.gis_file_paths.reduce((total, file) => total + file.size, 0))}
                                                    </p>
                                                </div>
                                                <div className="flex flex-wrap gap-1">
                                                    {map.gis_file_paths.slice(0, 4).map((file, index) => (
                                                        <Badge 
                                                            key={index} 
                                                            variant="secondary" 
                                                            className="text-xs font-medium px-2 py-0.5 bg-primary/10 text-primary hover:bg-primary/20"
                                                        >
                                                            {file.extension.toUpperCase()}
                                                        </Badge>
                                                    ))}
                                                    {map.gis_file_paths.length > 4 && (
                                                        <Badge variant="outline" className="text-xs font-medium">
                                                            +{map.gis_file_paths.length - 4} more
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
