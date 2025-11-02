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
import { Eye, FileText, MapPin, MoreHorizontal, Pencil, Plus, Trash2, Users, Globe, Sprout, BarChart, Map, Calendar, Clock, Upload, Download, Layers, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

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
    
    const [isVisible, setIsVisible] = useState(false);
    const [currentMetric, setCurrentMetric] = useState(0);

    useEffect(() => {
        setIsVisible(true);
        const interval = setInterval(() => {
            setCurrentMetric((prev) => (prev + 1) % 3);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

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
        <>
            <Head title="Dashboard">
                <style>{`
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-20px); }
                    }
                    
                    @keyframes float-delayed {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-30px); }
                    }
                    
                    @keyframes float-slow {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-15px); }
                    }
                    
                    @keyframes slide-in-left {
                        0% { opacity: 0; transform: translateX(-20px); }
                        100% { opacity: 1; transform: translateX(0px); }
                    }
                    
                    @keyframes slide-in-right {
                        0% { opacity: 0; transform: translateX(20px); }
                        100% { opacity: 1; transform: translateX(0px); }
                    }
                    
                    @keyframes fade-up {
                        0% { opacity: 0; transform: translateY(20px); }
                        100% { opacity: 1; transform: translateY(0px); }
                    }
                    
                    @keyframes scale-in {
                        0% { opacity: 0; transform: scale(0.8); }
                        100% { opacity: 1; transform: scale(1); }
                    }
                    
                    @keyframes pulse-green {
                        0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
                        50% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
                    }
                    
                    .animate-float {
                        animation: float 6s ease-in-out infinite;
                    }
                    
                    .animate-float-delayed {
                        animation: float-delayed 8s ease-in-out infinite;
                    }
                    
                    .animate-float-slow {
                        animation: float-slow 10s ease-in-out infinite;
                    }
                    
                    .animate-slide-in-left {
                        animation: slide-in-left 0.6s ease-out forwards;
                    }
                    
                    .animate-slide-in-right {
                        animation: slide-in-right 0.6s ease-out forwards;
                    }
                    
                    .animate-fade-up {
                        animation: fade-up 0.8s ease-out forwards;
                    }
                    
                    .animate-scale-in {
                        animation: scale-in 0.5s ease-out forwards;
                    }
                    
                    .animate-pulse-green {
                        animation: pulse-green 2s infinite;
                    }
                `}</style>
            </Head>
            
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="animate-float absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-green-200/20 mix-blend-multiply blur-xl filter"></div>
                    <div className="animate-float-delayed absolute top-3/4 right-1/4 h-96 w-96 rounded-full bg-emerald-200/20 mix-blend-multiply blur-xl filter"></div>
                    <div className="animate-float-slow absolute bottom-1/4 left-1/3 h-80 w-80 rounded-full bg-teal-200/20 mix-blend-multiply blur-xl filter"></div>
                </div>

                {/* Header Section */}
                <div className={`relative z-10 px-6 py-8 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
                    <div className="mx-auto max-w-7xl">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg animate-pulse-green">
                                        <Globe className="h-7 w-7 text-white" />
                                    </div>
                                    <div className="absolute -top-1 -right-1 h-4 w-4 animate-ping rounded-full bg-amber-400"></div>
                                </div>
                                <div>
                                    <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
                                        Welcome back, {auth.user.name}!
                                    </h1>
                                    <p className="text-green-600/70 font-medium">
                                        Manage your agricultural GIS data and mapping projects
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                                <Link href="/maps/upload">
                                    <Button className="group relative bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-500/30">
                                        <Upload className="h-5 w-5 mr-2 transition-transform duration-300 group-hover:-translate-y-1" />
                                        Upload New Map
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        
                        {/* Animated Feature Badge */}
                        <div className={`inline-flex items-center rounded-full bg-green-100/80 backdrop-blur-sm px-4 py-2 text-sm font-medium text-green-700 transition-all duration-500 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}>
                            <Sprout className="mr-2 h-4 w-4 animate-bounce" />
                            Advanced GIS Data Management Platform
                        </div>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className={`relative z-10 px-6 mb-8 transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                    <div className="mx-auto max-w-7xl">
                        <div className="grid gap-6 md:grid-cols-3">
                            {/* Total Maps Card */}
                            <div className="group relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-sm border border-green-200/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 group-hover:bg-green-200 transition-colors duration-300">
                                            <Map className="h-6 w-6" />
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-gray-800">{maps.length}</div>
                                            <div className="text-sm text-green-600 font-medium">Total Maps</div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600">Maps in your collection</p>
                                    <div className="mt-2 flex items-center text-xs text-green-600">
                                        <TrendingUp className="h-3 w-3 mr-1" />
                                        Active projects
                                    </div>
                                </div>
                            </div>

                            {/* GIS Files Card */}
                            <div className="group relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-sm border border-emerald-200/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 group-hover:bg-emerald-200 transition-colors duration-300">
                                            <Layers className="h-6 w-6" />
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-gray-800">
                                                {maps.reduce((total, map) => total + (map.gis_file_paths?.length || 0), 0)}
                                            </div>
                                            <div className="text-sm text-emerald-600 font-medium">GIS Files</div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600">Uploaded data files</p>
                                    <div className="mt-2 flex items-center text-xs text-emerald-600">
                                        <FileText className="h-3 w-3 mr-1" />
                                        Multiple formats
                                    </div>
                                </div>
                            </div>

                            {/* Data Size Card */}
                            <div className="group relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-sm border border-teal-200/50 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-600 group-hover:bg-teal-200 transition-colors duration-300">
                                            <BarChart className="h-6 w-6" />
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-gray-800">
                                                {formatFileSize(maps.reduce((total, map) => total + (map.gis_file_paths?.reduce((fileTotal, file) => fileTotal + file.size, 0) || 0), 0))}
                                            </div>
                                            <div className="text-sm text-teal-600 font-medium">Total Size</div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600">Storage utilized</p>
                                    <div className="mt-2 flex items-center text-xs text-teal-600">
                                        <Download className="h-3 w-3 mr-1" />
                                        Optimized storage
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Maps Grid */}

                {/* Maps Feed */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">Your Maps</h2>
                        <p className="text-sm text-muted-foreground">
                            {maps.length} {maps.length === 1 ? 'map' : 'maps'} in your collection
                        </p>
                    </div>

                    {maps.length === 0 ? (
                        <div className="mx-auto max-w-2xl">
                            <Card className="border-2 border-dashed p-8">
                                <div className="text-center">
                                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted/50">
                                        <MapPin className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold">No maps yet</h3>
                                    <p className="mx-auto mb-4 max-w-sm text-muted-foreground">
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
                        <div className="mx-auto max-w-2xl space-y-4">
                            {maps.map((map) => (
                                <Card
                                    key={map.id}
                                    className="overflow-hidden border-0 bg-card/50 shadow-sm backdrop-blur-sm transition-shadow duration-200 hover:shadow-md"
                                >
                                    {/* Map Header - Like a social media post header */}
                                    <CardHeader className="pb-2">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-3">
                                                {/* User Avatar */}
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
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
                                                            onClick={() => handleViewMap(map)}
                                                            className="flex cursor-pointer items-center gap-2"
                                                        >
                                                            <Eye className="h-3 w-3" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => handleEditMap(map)}
                                                            className="flex cursor-pointer items-center gap-2"
                                                        >
                                                            <Pencil className="h-3 w-3" />
                                                            Edit Map
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleDeleteMap(map)}
                                                            className="flex cursor-pointer items-center gap-2 text-destructive"
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                            Delete Map
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </div>
                                        {map.description && (
                                            <CardDescription className="ml-13 pt-2 text-sm leading-relaxed">{map.description}</CardDescription>
                                        )}
                                    </CardHeader>

                                    {/* Map Image - Full width like social media */}
                                    <div className="relative">
                                        <div className="relative aspect-[16/9] bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/50 dark:to-green-950/50">
                                            {map.map_image_url ? (
                                                <img
                                                    src={map.map_image_url}
                                                    alt={map.title}
                                                    className="absolute inset-0 h-full w-full rounded-none object-cover"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <PlaceholderPattern className="size-full stroke-neutral-900/10 dark:stroke-neutral-100/10" />
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="space-y-1 text-center">
                                                            <MapPin className="mx-auto h-8 w-8 text-muted-foreground/60" />
                                                            <p className="text-xs font-medium text-muted-foreground/80">Map Preview</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {/* Overlay gradient for better text readability */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                                        </div>
                                    </div>

                                    {/* Map Details & Actions - Like social media engagement section */}
                                    <CardContent className="space-y-3 p-3">
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
                                                            className="bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary hover:bg-primary/20"
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
        </>
    );
}
