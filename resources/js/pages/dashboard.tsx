import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { useFlashNotifications } from '@/hooks/use-flash-notifications';
import AppLayout from '@/layouts/app-layout';
import { notify } from '@/lib/notifications';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, FileText, MapPin, MoreHorizontal, Pencil, Plus, Trash2, Users, Heart, MessageCircle, Share2, Download, Calendar, Clock } from 'lucide-react';

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
            .map((word) => word.charAt(0).toUpperCase())
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

    const handleViewMap = (map: Map) => {
        // Navigate to view details page - accessible to all users
        window.location.href = `/maps/${map.id}`;
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
                        notify.success('🗑️ Map Deleted Successfully!', `Your map "${map.title}" has been permanently removed.`);
                    },
                    onError: () => {
                        notify.error('❌ Deletion Failed!', 'There was a problem deleting your map. Please try again.');
                    },
                });
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 bg-white">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-green-800">Dashboard</h1>
                        <p className="text-green-600">Welcome to your GIS mapping workspace</p>
                    </div>
                    <Link href="/maps/upload">
                        <Button className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
                            <Plus className="h-4 w-4" />
                            Upload New Map
                        </Button>
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-green-700">Total Maps</CardTitle>
                            <MapPin className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-800">{maps.length}</div>
                            <p className="text-xs text-green-600">Maps in your collection</p>
                        </CardContent>
                    </Card>
                    <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-emerald-700">GIS Files</CardTitle>
                            <FileText className="h-4 w-4 text-emerald-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-800">{maps.reduce((total, map) => total + (map.gis_file_paths?.length || 0), 0)}</div>
                            <p className="text-xs text-emerald-600">Total uploaded files</p>
                        </CardContent>
                    </Card>
                    <Card className="border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-teal-700">Storage Used</CardTitle>
                            <Users className="h-4 w-4 text-teal-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-teal-800">
                                {formatFileSize(maps.reduce((total, map) => total + (map.gis_file_paths?.reduce((fileTotal, file) => fileTotal + file.size, 0) || 0), 0))}
                            </div>
                            <p className="text-xs text-teal-600">Across all maps</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Maps Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-green-800">Your Maps</h2>
                        <div className="text-sm text-green-600">
                            {maps.length} maps in your collection
                        </div>
                    </div>

                    {maps.length === 0 ? (
                        <div className="max-w-2xl mx-auto">
                            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <PlaceholderPattern className="mb-4 h-16 w-16 text-green-300" />
                                    <h3 className="mb-2 text-lg font-semibold text-green-800">No maps uploaded yet</h3>
                                    <p className="mb-6 text-center text-green-600">
                                        Start by uploading your first GIS map to begin your agricultural data analysis journey.
                                    </p>
                                    <Link href="/maps/upload">
                                        <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Upload Your First Map
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        <div className="space-y-6 max-w-2xl mx-auto">
                            {maps.map((map) => (
                                <Card key={map.id} className="border-green-200 bg-white shadow-md hover:shadow-lg transition-all duration-200 rounded-xl overflow-hidden">
                                    {/* Post Header - User Info */}
                                    <div className="p-4 pb-0">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-semibold text-sm">
                                                    {getUserInitials(map.user.name)}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{map.user.name}</h3>
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        {formatDate(map.created_at)}
                                                        {map.user.id === auth.user.id && (
                                                            <Badge className="ml-2 bg-green-100 text-green-700 text-xs">
                                                                Your Map
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full hover:bg-gray-100">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48">
                                                    <DropdownMenuItem onClick={() => handleViewMap(map)}>
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                    {map.user.id === auth.user.id && (
                                                        <>
                                                            <DropdownMenuItem onClick={() => handleEditMap(map)}>
                                                                <Pencil className="mr-2 h-4 w-4" />
                                                                Edit Map
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() => handleDeleteMap(map)}
                                                                className="text-red-600 focus:text-red-600"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete Map
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>

                                    {/* Post Content */}
                                    <div className="px-4 py-2">
                                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{map.title}</h4>
                                        <p className="text-gray-700 mb-3">{map.description}</p>
                                        
                                        {/* GIS File Info */}
                                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                                            <div className="flex items-center">
                                                <FileText className="w-4 h-4 mr-1 text-green-600" />
                                                <span>{map.gis_file_paths?.length || 0} files</span>
                                            </div>
                                            {map.gis_file_paths && map.gis_file_paths.length > 0 && (
                                                <div className="flex items-center">
                                                    <Download className="w-4 h-4 mr-1 text-green-600" />
                                                    <span>{formatFileSize(map.gis_file_paths.reduce((total, file) => total + file.size, 0))}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center">
                                                <MapPin className="w-4 h-4 mr-1 text-green-600" />
                                                <span>GIS Data</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Map Image */}
                                    {map.map_image_url && (
                                        <div className="relative">
                                            <img 
                                                src={map.map_image_url} 
                                                alt={map.title} 
                                                className="w-full object-contain cursor-pointer hover:opacity-95 transition-opacity bg-gray-50"
                                                onClick={() => handleViewMap(map)}
                                                style={{ maxHeight: '500px' }}
                                            />
                                            <div className="absolute top-3 right-3">
                                                <Badge className="bg-black/50 text-white backdrop-blur-sm">
                                                    <MapPin className="w-3 h-3 mr-1" />
                                                    Map Preview
                                                </Badge>
                                            </div>
                                        </div>
                                    )}

                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
