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
import { Eye, FileText, MapPin, MoreHorizontal, Pencil, Plus, Trash2, Users, Heart, MessageCircle, Share2, Download, Calendar, Clock, Sparkles, TrendingUp, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';

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

    // Animation states
    const [isLoaded, setIsLoaded] = useState(false);
    const [visibleCards, setVisibleCards] = useState<number[]>([]);

    useEffect(() => {
        setIsLoaded(true);
        // Stagger card animations
        maps.forEach((_, index) => {
            setTimeout(() => {
                setVisibleCards(prev => [...prev, index]);
            }, index * 150);
        });
    }, [maps]);

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
            <div className={`flex h-full flex-1 flex-col gap-6 rounded-xl p-6 bg-white transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                {/* Animated Header */}
                <div className={`flex items-center justify-between transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                    <div className="relative">
                        <div className="relative group">
                            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-emerald-700 via-teal-600 to-green-700 bg-clip-text text-transparent flex items-center gap-3">
                                <Sparkles className="h-10 w-10 text-emerald-600 transform transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 drop-shadow-sm" />
                                Dashboard
                            </h1>
                            <p className="text-slate-600 mt-2 flex items-center gap-2 font-medium">
                                <Activity className="h-4 w-4 text-emerald-500 transform transition-all duration-700 hover:rotate-180" />
                                Welcome to your GIS mapping workspace
                            </p>
                        </div>
                    </div>
                    <Link href="/maps/upload">
                        <Button className="flex items-center gap-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:via-teal-700 hover:to-green-700 text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-emerald-200/50 group px-6 py-3 rounded-xl font-semibold">
                            <Plus className="h-5 w-5 transform transition-all duration-300 group-hover:rotate-90" />
                            Upload New Map
                        </Button>
                    </Link>
                </div>

                {/* Animated Stats Cards */}
                <div className={`grid gap-6 md:grid-cols-3 transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <Card className="border-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-200/30 group cursor-pointer rounded-2xl backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-semibold text-emerald-800 group-hover:text-emerald-900 transition-colors">Total Maps</CardTitle>
                            <div className="p-2 rounded-xl bg-emerald-100 group-hover:bg-emerald-200 transition-colors">
                                <MapPin className="h-5 w-5 text-emerald-700 group-hover:text-emerald-800 group-hover:animate-bounce transition-all" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent group-hover:scale-110 transition-all duration-300">{maps.length}</div>
                            <p className="text-sm text-slate-600 flex items-center gap-2 mt-2 font-medium">
                                <TrendingUp className="h-4 w-4 text-emerald-600 animate-pulse" />
                                Maps in your collection
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card className="border-0 bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-teal-200/30 group cursor-pointer rounded-2xl backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-semibold text-teal-800 group-hover:text-teal-900 transition-colors">GIS Files</CardTitle>
                            <div className="p-2 rounded-xl bg-teal-100 group-hover:bg-teal-200 transition-colors">
                                <FileText className="h-5 w-5 text-teal-700 group-hover:text-teal-800 group-hover:animate-pulse transition-all" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold bg-gradient-to-r from-teal-700 to-cyan-700 bg-clip-text text-transparent group-hover:scale-110 transition-all duration-300">{maps.reduce((total, map) => total + (map.gis_file_paths?.length || 0), 0)}</div>
                            <p className="text-sm text-slate-600 flex items-center gap-2 mt-2 font-medium">
                                <Activity className="h-4 w-4 text-teal-600 animate-spin" />
                                Total uploaded files
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card className="border-0 bg-gradient-to-br from-green-50 via-lime-50 to-yellow-50 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-green-200/30 group cursor-pointer rounded-2xl backdrop-blur-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-semibold text-green-800 group-hover:text-green-900 transition-colors">Storage Used</CardTitle>
                            <div className="p-2 rounded-xl bg-green-100 group-hover:bg-green-200 transition-colors">
                                <Users className="h-5 w-5 text-green-700 group-hover:text-green-800 group-hover:animate-bounce transition-all" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold bg-gradient-to-r from-green-700 to-lime-700 bg-clip-text text-transparent group-hover:scale-110 transition-all duration-300">
                                {formatFileSize(maps.reduce((total, map) => total + (map.gis_file_paths?.reduce((fileTotal, file) => fileTotal + file.size, 0) || 0), 0))}
                            </div>
                            <p className="text-sm text-slate-600 flex items-center gap-2 mt-2 font-medium">
                                <Sparkles className="h-4 w-4 text-green-600 animate-pulse" />
                                Across all maps
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Maps Section */}
                <div className={`space-y-6 transition-all duration-700 delay-600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 via-teal-600 to-green-700 bg-clip-text text-transparent flex items-center gap-3">
                            <MapPin className="h-7 w-7 text-emerald-600 animate-pulse drop-shadow-sm" />
                            Your Maps
                        </h2>
                        <div className="text-sm text-slate-600 flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-2 rounded-full border border-emerald-100 shadow-sm">
                            <Activity className="h-4 w-4 text-emerald-600 animate-spin" />
                            <span className="font-medium">{maps.length} maps in your collection</span>
                        </div>
                    </div>

                    {maps.length === 0 ? (
                        <div className={`max-w-3xl mx-auto transition-all duration-1000 delay-800 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                            <Card className="border-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 hover:shadow-2xl transition-all duration-500 hover:scale-105 rounded-3xl backdrop-blur-sm">
                                <CardContent className="flex flex-col items-center justify-center py-16 px-8">
                                    <div className="relative mb-6">
                                        <PlaceholderPattern className="h-20 w-20 text-emerald-300 animate-bounce drop-shadow-lg" />
                                        <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
                                    </div>
                                    <h3 className="mb-4 text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent text-center">No maps uploaded yet</h3>
                                    <p className="mb-8 text-center text-slate-600 font-medium leading-relaxed max-w-md">
                                        Start by uploading your first GIS map to begin your agricultural data analysis journey and unlock powerful insights.
                                    </p>
                                    <Link href="/maps/upload">
                                        <Button className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:via-teal-700 hover:to-green-700 text-white transform hover:scale-110 transition-all duration-300 shadow-xl hover:shadow-2xl px-8 py-4 rounded-2xl font-semibold text-lg">
                                            <Plus className="mr-3 h-6 w-6 animate-spin hover:animate-none" />
                                            Upload Your First Map
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        <div className="space-y-8 max-w-3xl mx-auto">
                            {maps.map((map, index) => (
                                <Card 
                                    key={map.id} 
                                    className={`border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden transform hover:scale-[1.02] hover:-translate-y-2 group ${
                                        visibleCards.includes(index) 
                                            ? 'opacity-100 translate-y-0' 
                                            : 'opacity-0 translate-y-8'
                                    }`}
                                    style={{ 
                                        transitionDelay: `${800 + index * 150}ms`,
                                        backgroundImage: 'linear-gradient(135deg, rgba(16, 185, 129, 0.03) 0%, rgba(20, 184, 166, 0.03) 50%, rgba(34, 197, 94, 0.03) 100%)'
                                    }}
                                >
                                    {/* Post Header - User Info */}
                                    <div className="p-6 pb-4 relative">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-500 group-hover:h-2 transition-all duration-300"></div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-600 via-teal-600 to-green-600 flex items-center justify-center text-white font-bold text-base transform group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                                                    {getUserInitials(map.user.name)}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-800 group-hover:text-emerald-800 transition-colors text-lg">{map.user.name}</h3>
                                                    <div className="flex items-center text-slate-500 group-hover:text-emerald-600 transition-colors font-medium">
                                                        <Clock className="w-4 h-4 mr-2 animate-pulse" />
                                                        {formatDate(map.created_at)}
                                                        {map.user.id === auth.user.id && (
                                                            <Badge className="ml-3 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 text-xs animate-pulse hover:animate-none border border-emerald-200 font-semibold">
                                                                Your Map
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-10 w-10 rounded-full hover:bg-emerald-50 transform hover:scale-110 transition-all duration-200 border border-transparent hover:border-emerald-200">
                                                        <MoreHorizontal className="h-5 w-5 text-slate-600" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 animate-in slide-in-from-top-2 duration-200 rounded-xl shadow-xl border-emerald-100">
                                                    <DropdownMenuItem onClick={() => handleViewMap(map)} className="hover:bg-emerald-50 transition-colors rounded-lg">
                                                        <Eye className="mr-2 h-4 w-4 text-emerald-600" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                    {map.user.id === auth.user.id && (
                                                        <>
                                                            <DropdownMenuItem onClick={() => handleEditMap(map)} className="hover:bg-emerald-50 transition-colors rounded-lg">
                                                                <Pencil className="mr-2 h-4 w-4 text-emerald-600" />
                                                                Edit Map
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                onClick={() => handleDeleteMap(map)}
                                                                className="text-red-600 focus:text-red-600 hover:bg-red-50 transition-colors rounded-lg"
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
                                    <div className="px-6 py-4">
                                        <h4 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-emerald-800 transition-colors leading-tight">{map.title}</h4>
                                        <p className="text-slate-600 mb-4 group-hover:text-slate-700 transition-colors leading-relaxed font-medium">{map.description}</p>
                                        
                                        {/* GIS File Info */}
                                        <div className="flex items-center space-x-6 text-sm text-slate-500 mb-4 group-hover:text-emerald-600 transition-colors">
                                            <div className="flex items-center transform hover:scale-105 transition-transform bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-100">
                                                <FileText className="w-4 h-4 mr-2 text-emerald-600 animate-pulse" />
                                                <span className="font-semibold">{map.gis_file_paths?.length || 0} files</span>
                                            </div>
                                            {map.gis_file_paths && map.gis_file_paths.length > 0 && (
                                                <div className="flex items-center transform hover:scale-105 transition-transform bg-teal-50 px-3 py-2 rounded-xl border border-teal-100">
                                                    <Download className="w-4 h-4 mr-2 text-teal-600 group-hover:animate-bounce" />
                                                    <span className="font-semibold">{formatFileSize(map.gis_file_paths.reduce((total, file) => total + file.size, 0))}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center transform hover:scale-105 transition-transform bg-green-50 px-3 py-2 rounded-xl border border-green-100">
                                                <MapPin className="w-4 h-4 mr-2 text-green-600 animate-pulse" />
                                                <span className="font-semibold">GIS Data</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Map Image */}
                                    {map.map_image_url && (
                                        <div className="relative overflow-hidden group/image">
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 z-10"></div>
                                            <img 
                                                src={map.map_image_url} 
                                                alt={map.title} 
                                                className="w-full object-contain cursor-pointer hover:opacity-95 transition-all duration-500 bg-gray-50 transform group-hover/image:scale-105"
                                                onClick={() => handleViewMap(map)}
                                                style={{ maxHeight: '500px' }}
                                            />
                                            <div className="absolute top-3 right-3 z-20">
                                                <Badge className="bg-black/50 text-white backdrop-blur-sm animate-pulse hover:animate-none hover:bg-emerald-600 transition-all border-0 font-semibold">
                                                    <MapPin className="w-3 h-3 mr-1" />
                                                    Map Preview
                                                </Badge>
                                            </div>
                                            <div className="absolute bottom-3 left-3 right-3 z-20 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300">
                                                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-3 text-sm text-slate-800 shadow-lg border border-emerald-100">
                                                    <div className="flex items-center gap-2 font-medium">
                                                        <Eye className="w-4 h-4 text-emerald-700" />
                                                        Click to view full details
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Post Footer */}
                                    <div className="px-6 py-4 border-t border-emerald-100 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 backdrop-blur-sm group-hover:from-emerald-100/60 group-hover:to-teal-100/60 transition-all duration-300">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <span className="text-sm text-slate-500 group-hover:text-emerald-700 transition-colors font-medium flex items-center">
                                                    <Calendar className="w-4 h-4 mr-2 text-emerald-600" />
                                                    {new Date(map.created_at).toLocaleDateString('en-US', { 
                                                        year: 'numeric', 
                                                        month: 'long', 
                                                        day: 'numeric' 
                                                    })}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <button 
                                                    onClick={() => handleViewMap(map)}
                                                    className="group/btn flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-emerald-700 hover:text-white hover:bg-emerald-600 rounded-xl border border-emerald-200 hover:border-emerald-600 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
                                                >
                                                    <Eye className="w-4 h-4 group-hover/btn:animate-pulse" />
                                                    <span>View Details</span>
                                                </button>
                                                {map.gis_file_paths && map.gis_file_paths.length > 0 && (
                                                    <button className="group/btn flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-teal-700 hover:text-white hover:bg-teal-600 rounded-xl border border-teal-200 hover:border-teal-600 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md">
                                                        <Download className="w-4 h-4 group-hover/btn:animate-bounce" />
                                                        <span>Download</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
