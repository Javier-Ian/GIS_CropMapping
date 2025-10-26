import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { useFlashNotifications } from '@/hooks/use-flash-notifications';
import AppLayout from '@/layouts/app-layout';
import { notify } from '@/lib/notifications';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Eye, FileText, MapPin, MoreHorizontal, Pencil, Plus, Trash2, Users, Heart, MessageCircle, Share2, Download, Calendar, Clock, Sparkles, TrendingUp, Activity, Filter, X, LayoutDashboard } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';

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
    barangay: string;
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
    
    // Filter states
    const [filterType, setFilterType] = useState<'all' | 'yearly' | 'monthly'>('all');
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [selectedMonth, setSelectedMonth] = useState<string>('');
    const [showFilters, setShowFilters] = useState(false);

    // Get available years and months from maps
    const availableYears = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const mapYears = maps.map(map => new Date(map.created_at).getFullYear());
        
        // Create a range from 5 years before the earliest map year to current year + 1
        // Or from 2020 to current year + 1 if no maps exist
        const minYear = mapYears.length > 0 ? Math.min(...mapYears, 2020) : 2020;
        const maxYear = currentYear + 1;
        
        const yearRange = [];
        for (let year = maxYear; year >= minYear; year--) {
            yearRange.push(year);
        }
        
        return yearRange;
    }, [maps]);

    const availableMonths = useMemo(() => {
        if (!selectedYear) return [];
        
        // Return all 12 months (0-11) instead of only months that have maps
        return Array.from({ length: 12 }, (_, index) => index);
    }, [selectedYear]);

    // Filter maps based on selected filters
    const filteredMaps = useMemo(() => {
        if (filterType === 'all') return maps;
        
        return maps.filter(map => {
            const mapDate = new Date(map.created_at);
            
            if (filterType === 'yearly' && selectedYear) {
                return mapDate.getFullYear() === parseInt(selectedYear);
            }
            
            if (filterType === 'monthly' && selectedYear && selectedMonth) {
                return mapDate.getFullYear() === parseInt(selectedYear) && 
                       mapDate.getMonth() === parseInt(selectedMonth);
            }
            
            return true;
        });
    }, [maps, filterType, selectedYear, selectedMonth]);

    useEffect(() => {
        setIsLoaded(true);
        // Stagger card animations
        filteredMaps.forEach((_, index) => {
            setTimeout(() => {
                setVisibleCards(prev => [...prev, index]);
            }, index * 150);
        });
    }, [filteredMaps]);

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
                            <h1 className="text-4xl font-bold tracking-tight text-teal-800 flex items-center gap-3">
                                <LayoutDashboard className="h-10 w-10 text-teal-600 transform transition-all duration-300 group-hover:scale-110 drop-shadow-sm" />
                                Dashboard
                            </h1>
                            <p className="text-teal-600 mt-2 flex items-center gap-2 font-medium">
                                <Activity className="h-4 w-4 text-teal-500 transform transition-all duration-700 hover:rotate-180" />
                                Welcome to your GIS mapping workspace
                            </p>
                        </div>
                    </div>
                    <Link href="/maps/upload">
                        <Button className="flex items-center gap-3 bg-teal-600 hover:bg-teal-700 text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-teal-200/50 group px-6 py-3 rounded-xl font-semibold">
                            <Plus className="h-5 w-5 transform transition-all duration-300 group-hover:rotate-90" />
                            Upload New Map
                        </Button>
                    </Link>
                </div>

                {/* Animated Stats Cards */}
                <div className={`grid gap-8 md:grid-cols-2 transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <Card className="border border-teal-200 bg-white transform hover:scale-[1.02] hover:z-10 transition-all duration-300 hover:shadow-xl group cursor-pointer rounded-2xl relative">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-semibold text-teal-800 group-hover:text-teal-900 transition-colors">Total Maps</CardTitle>
                            <div className="p-2 rounded-xl bg-teal-100 group-hover:bg-teal-200 transition-colors">
                                <MapPin className="h-5 w-5 text-teal-700 group-hover:text-teal-800 group-hover:animate-bounce transition-all" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-teal-800 group-hover:scale-105 transition-all duration-300 origin-left">{filteredMaps.length}</div>
                            <p className="text-sm text-teal-600 flex items-center gap-2 mt-2 font-medium">
                                <TrendingUp className="h-4 w-4 text-teal-600 animate-pulse" />
                                Maps in your collection
                            </p>
                        </CardContent>
                    </Card>
                    
                    <Card className="border border-teal-200 bg-white transform hover:scale-[1.02] hover:z-10 transition-all duration-300 hover:shadow-xl group cursor-pointer rounded-2xl relative">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                            <CardTitle className="text-sm font-semibold text-teal-800 group-hover:text-teal-900 transition-colors">Your Total Posts</CardTitle>
                            <div className="p-2 rounded-xl bg-teal-100 group-hover:bg-teal-200 transition-colors">
                                <Users className="h-5 w-5 text-teal-700 group-hover:text-teal-800 group-hover:animate-bounce transition-all" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-teal-800 group-hover:scale-105 transition-all duration-300 origin-left">
                                {maps.filter(map => map.user.id === auth.user.id).length}
                            </div>
                            <p className="text-sm text-teal-600 flex items-center gap-2 mt-2 font-medium">
                                <Sparkles className="h-4 w-4 text-teal-600 animate-pulse" />
                                Maps you've created
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Maps Section */}
                <div className={`space-y-6 transition-all duration-700 delay-600 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-teal-800 flex items-center gap-3">
                            <MapPin className="h-7 w-7 text-teal-600 animate-pulse drop-shadow-sm" />
                            Your Maps
                        </h2>
                        <Button
                            onClick={() => setShowFilters(!showFilters)}
                            variant="outline"
                            className="flex items-center gap-2 bg-white border-2 border-teal-300 text-teal-700 hover:bg-teal-50 hover:border-teal-400 transition-all duration-300 shadow-md hover:shadow-lg rounded-xl font-semibold"
                        >
                            <Filter className="h-4 w-4" />
                            Filters
                        </Button>
                    </div>

                    {/* Filter Panel */}
                    {showFilters && (
                        <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border-2 border-teal-200 shadow-lg hover:shadow-xl transition-all duration-500 group">
                            <div className="flex items-center gap-2 text-sm font-semibold text-teal-800 group-hover:text-teal-900 transition-colors">
                                <div className="p-1.5 rounded-lg bg-teal-100 group-hover:bg-teal-200 transition-colors">
                                    <Filter className="h-4 w-4 text-teal-700" />
                                </div>
                                <span className="hidden sm:inline">Filter Maps</span>
                                <span className="sm:hidden">Filter</span>
                            </div>
                            
                            <div className="h-6 w-px bg-teal-200"></div>
                            
                            <Select value={filterType} onValueChange={(value: 'all' | 'yearly' | 'monthly') => {
                                setFilterType(value);
                                if (value === 'all') {
                                    setSelectedYear('');
                                    setSelectedMonth('');
                                } else if (value === 'yearly') {
                                    setSelectedMonth(''); // Clear month when switching to yearly
                                }
                                // When switching to monthly, keep the year if it's set
                            }}>
                                <SelectTrigger className="w-36 h-9 text-sm font-semibold border-2 border-teal-200 bg-white hover:bg-teal-50 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 rounded-lg shadow-sm transition-all duration-200 text-gray-900">
                                    <SelectValue className="text-gray-900 font-semibold" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-2 border-teal-200 shadow-xl bg-white">
                                    <SelectItem value="all" className="text-gray-900 font-semibold hover:bg-green-100 hover:text-black focus:bg-green-200 focus:text-black rounded-lg cursor-pointer">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                                            All Maps
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="yearly" className="text-gray-900 font-semibold hover:bg-green-100 hover:text-black focus:bg-green-200 focus:text-black rounded-lg cursor-pointer">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-3 w-3 text-teal-600" />
                                            By Year
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="monthly" className="text-gray-900 font-semibold hover:bg-green-100 hover:text-black focus:bg-green-200 focus:text-black rounded-lg cursor-pointer">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-3 w-3 text-teal-600" />
                                            By Month
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            {filterType !== 'all' && (
                                <>
                                    <div className="h-6 w-px bg-teal-200"></div>
                                    <Select value={selectedYear} onValueChange={(value) => {
                                        setSelectedYear(value);
                                        // Only clear month if we're in monthly mode
                                        if (filterType === 'monthly') {
                                            setSelectedMonth('');
                                        }
                                    }}>
                                        <SelectTrigger className="w-28 h-9 text-sm font-semibold border-2 border-teal-200 bg-white hover:bg-teal-50 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 rounded-lg shadow-sm transition-all duration-200 text-gray-900">
                                            <SelectValue placeholder="Year" className="text-gray-900 font-semibold" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-2 border-teal-200 shadow-xl bg-white">
                                            {availableYears.map((year) => (
                                                <SelectItem key={year} value={year.toString()} className="text-gray-900 font-semibold hover:bg-green-100 hover:text-black focus:bg-green-200 focus:text-black rounded-lg cursor-pointer">
                                                    {year}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </>
                            )}

                            {filterType === 'monthly' && selectedYear && (
                                <>
                                    <div className="h-6 w-px bg-teal-200"></div>
                                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                                        <SelectTrigger className="w-36 h-9 text-sm font-semibold border-2 border-teal-200 bg-white hover:bg-teal-50 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 rounded-lg shadow-sm transition-all duration-200 text-gray-900">
                                            <SelectValue placeholder="Month" className="text-gray-900 font-semibold" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-2 border-teal-200 shadow-xl bg-white">
                                            {availableMonths.map((month) => (
                                                <SelectItem key={month} value={month.toString()} className="text-gray-900 font-semibold hover:bg-green-100 hover:text-black focus:bg-green-200 focus:text-black rounded-lg cursor-pointer">
                                                    {new Date(2000, month, 1).toLocaleString('default', { month: 'long' })}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </>
                            )}

                            <div className="flex-1"></div>

                            <Button
                                onClick={() => {
                                    setFilterType('all');
                                    setSelectedYear('');
                                    setSelectedMonth('');
                                }}
                                variant="ghost"
                                size="sm"
                                className="h-9 px-4 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg border-2 border-gray-300 bg-white hover:border-gray-400 shadow-md hover:shadow-lg transition-all duration-200 font-semibold"
                            >
                                <X className="h-4 w-4 mr-2" />
                                Clear
                            </Button>
                        </div>
                    )}

                    {filteredMaps.length === 0 ? (
                        <div className={`max-w-3xl mx-auto transition-all duration-1000 delay-800 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                            <Card className="border border-teal-200 bg-white hover:shadow-lg transition-all duration-500 hover:scale-105 rounded-3xl">
                                <CardContent className="flex flex-col items-center justify-center py-16 px-8">
                                    <div className="relative mb-6">
                                        <PlaceholderPattern className="h-20 w-20 text-teal-300 animate-bounce drop-shadow-lg" />
                                        <div className="absolute -inset-4 bg-teal-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
                                    </div>
                                    {maps.length === 0 ? (
                                        <>
                                            <h3 className="mb-4 text-2xl font-bold text-teal-800 text-center">No maps uploaded yet</h3>
                                            <p className="mb-8 text-center text-teal-600 font-medium leading-relaxed max-w-md">
                                                Start by uploading your first GIS map to begin your agricultural data analysis journey and unlock powerful insights.
                                            </p>
                                            <Link href="/maps/upload">
                                                <Button className="bg-teal-600 hover:bg-teal-700 text-white transform hover:scale-110 transition-all duration-300 shadow-xl hover:shadow-2xl px-8 py-4 rounded-2xl font-semibold text-lg">
                                                    <Plus className="mr-3 h-6 w-6 animate-spin hover:animate-none" />
                                                    Upload Your First Map
                                                </Button>
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <h3 className="mb-4 text-2xl font-bold text-teal-800 text-center">No maps found</h3>
                                            <p className="mb-8 text-center text-teal-600 font-medium leading-relaxed max-w-md">
                                                No maps match your current filter criteria. Try adjusting your filters or clear them to see all maps.
                                            </p>
                                            <Button 
                                                onClick={() => {
                                                    setFilterType('all');
                                                    setSelectedYear('');
                                                    setSelectedMonth('');
                                                }}
                                                className="bg-teal-600 hover:bg-teal-700 text-white transform hover:scale-110 transition-all duration-300 shadow-xl hover:shadow-2xl px-8 py-4 rounded-2xl font-semibold text-lg"
                                            >
                                                <X className="mr-3 h-6 w-6" />
                                                Clear All Filters
                                            </Button>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    ) : (
                        <div className="space-y-8 max-w-3xl mx-auto">
                            {filteredMaps.map((map, index) => (
                                <Card 
                                    key={map.id} 
                                    className={`border border-teal-100 bg-gradient-to-br from-white to-teal-50/30 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden transform hover:scale-[1.02] hover:-translate-y-2 group ${
                                        visibleCards.includes(index) 
                                            ? 'opacity-100 translate-y-0' 
                                            : 'opacity-0 translate-y-8'
                                    }`}
                                    style={{ 
                                        transitionDelay: `${800 + index * 150}ms`
                                    }}
                                >
                                    {/* Post Header - User Info */}
                                    <div className="p-6 pb-4 relative">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 group-hover:h-2 transition-all duration-300"></div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold text-base transform group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                                                    {getUserInitials(map.user.name)}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-800 group-hover:text-teal-800 transition-colors text-lg">{map.user.name}</h3>
                                                    <div className="flex items-center text-slate-500 group-hover:text-teal-600 transition-colors font-medium">
                                                        <Clock className="w-4 h-4 mr-2 animate-pulse text-teal-500" />
                                                        {formatDate(map.created_at)}
                                                        {map.user.id === auth.user.id && (
                                                            <Badge className="ml-3 bg-gradient-to-r from-teal-100 to-emerald-100 text-teal-800 text-xs animate-pulse hover:animate-none border border-teal-200 font-semibold">
                                                                Your Map
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-10 w-10 rounded-full hover:bg-teal-50 transform hover:scale-110 transition-all duration-200 border border-transparent hover:border-teal-200">
                                                        <MoreHorizontal className="h-5 w-5 text-slate-600 hover:text-teal-600" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 animate-in slide-in-from-top-2 duration-200 rounded-xl shadow-xl border-teal-100">
                                                    <DropdownMenuItem onClick={() => handleViewMap(map)} className="hover:bg-gray-100 transition-colors rounded-lg">
                                                        <Eye className="mr-2 h-4 w-4 text-gray-600" />
                                                        View Details
                                                    </DropdownMenuItem>
                                                    {map.user.id === auth.user.id && (
                                                        <>
                                                            <DropdownMenuItem onClick={() => handleEditMap(map)} className="hover:bg-teal-50 transition-colors rounded-lg">
                                                                <Pencil className="mr-2 h-4 w-4 text-teal-600" />
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
                                        <h4 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-teal-800 transition-colors leading-tight">{map.title}</h4>
                                        <p className="text-slate-600 mb-3 group-hover:text-slate-700 transition-colors leading-relaxed font-medium">{map.description}</p>
                                        
                                        {/* Barangay Location */}
                                        {map.barangay && (
                                            <div className="mb-4">
                                                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-100 to-emerald-100 px-3 py-2 rounded-xl border border-teal-200 transform hover:scale-105 transition-all duration-300 shadow-sm">
                                                    <MapPin className="w-4 h-4 text-teal-600 animate-pulse" />
                                                    <span className="text-teal-800 font-semibold text-sm">{map.barangay} Barangay</span>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* GIS File Info */}
                                        <div className="flex items-center space-x-6 text-sm text-slate-500 mb-4 group-hover:text-slate-600 transition-colors">
                                            <div className="flex items-center transform hover:scale-105 transition-transform bg-gradient-to-r from-slate-50 to-teal-50 px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
                                                <FileText className="w-4 h-4 mr-2 text-teal-600 animate-pulse" />
                                                <span className="font-semibold text-slate-700">{map.gis_file_paths?.length || 0} files</span>
                                            </div>
                                            {map.gis_file_paths && map.gis_file_paths.length > 0 && (
                                                <div className="flex items-center transform hover:scale-105 transition-transform bg-gradient-to-r from-slate-50 to-emerald-50 px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
                                                    <Download className="w-4 h-4 mr-2 text-emerald-600 group-hover:animate-bounce" />
                                                    <span className="font-semibold text-slate-700">{formatFileSize(map.gis_file_paths.reduce((total, file) => total + file.size, 0))}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center transform hover:scale-105 transition-transform bg-gradient-to-r from-slate-50 to-cyan-50 px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
                                                <MapPin className="w-4 h-4 mr-2 text-cyan-600 animate-pulse" />
                                                <span className="font-semibold text-slate-700">GIS Data</span>
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
                                                <Badge className="bg-gradient-to-r from-teal-600/90 to-emerald-600/90 text-white backdrop-blur-sm animate-pulse hover:animate-none hover:from-teal-700 hover:to-emerald-700 transition-all border-0 font-semibold shadow-lg">
                                                    <MapPin className="w-3 h-3 mr-1" />
                                                    Map Preview
                                                </Badge>
                                            </div>
                                            <div className="absolute bottom-3 left-3 right-3 z-20 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300">
                                                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 text-sm text-slate-800 shadow-lg border border-teal-100">
                                                    <div className="flex items-center gap-2 font-medium">
                                                        <Eye className="w-4 h-4 text-teal-600" />
                                                        Click to view full details
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Post Footer */}
                                    <div className="px-6 py-4 border-t border-teal-100 bg-gradient-to-r from-slate-50/50 to-teal-50/50 transition-all duration-300">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <span className="text-sm text-slate-500 group-hover:text-teal-600 transition-colors font-medium flex items-center">
                                                    <Calendar className="w-4 h-4 mr-2 text-teal-500" />
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
                                                    className="group/btn flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-white bg-gray-600 hover:bg-gray-700 rounded-xl border border-gray-500 hover:border-gray-600 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
                                                >
                                                    <Eye className="w-4 h-4 group-hover/btn:animate-pulse" />
                                                    <span>View Details</span>
                                                </button>
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
