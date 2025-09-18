import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { RefreshCw, Database, FileSpreadsheet, CheckCircle, AlertCircle, Info, Search } from 'lucide-react';

interface SyncStatistics {
    [key: string]: {
        total_records: number;
        recently_synced: number;
        last_sync: string | null;
    };
}

interface CropData {
    id: number;
    name: string;
    place: string;
    crop: string;
    planting_date: string;
    harvest_date: string;
    total_area: string;
    total_yield: string;
    synced_at: string;
    created_at: string;
}

export default function SheetsSync() {
    const [isLoading, setIsLoading] = useState(false);
    const [statistics, setStatistics] = useState<SyncStatistics>({});
    const [syncResults, setSyncResults] = useState<any>(null);
    const [selectedBarangay, setSelectedBarangay] = useState<string>('Brgy. Butong');
    const [cropData, setCropData] = useState<CropData[]>([]);
    const [filteredCropData, setFilteredCropData] = useState<CropData[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [loadingData, setLoadingData] = useState(false);
    const [viewMode, setViewMode] = useState<'overview' | 'data'>('overview');

    const barangays = ['Brgy. Butong', 'Brgy. Salawagan', 'Brgy. San Jose'];

    useEffect(() => {
        fetchStatistics();
        if (viewMode === 'data') {
            fetchCropData(selectedBarangay);
        }
    }, [selectedBarangay, viewMode]);

    // Filter crop data based on search query
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredCropData(cropData);
        } else {
            const filtered = cropData.filter((crop) => {
                const query = searchQuery.toLowerCase();
                return (
                    crop.name.toLowerCase().includes(query) ||
                    crop.place.toLowerCase().includes(query) ||
                    crop.crop.toLowerCase().includes(query) ||
                    crop.planting_date.toLowerCase().includes(query) ||
                    crop.harvest_date.toLowerCase().includes(query) ||
                    crop.total_area.toLowerCase().includes(query) ||
                    crop.total_yield.toLowerCase().includes(query)
                );
            });
            setFilteredCropData(filtered);
        }
    }, [cropData, searchQuery]);

    const fetchStatistics = async () => {
        console.log('Fetching statistics...');
        try {
            const response = await fetch('/sync/statistics');
            const data = await response.json();
            console.log('Statistics response:', data);
            if (data.success) {
                setStatistics(data.statistics);
                console.log('Statistics updated:', data.statistics);
            } else {
                console.error('Failed to fetch statistics:', data);
            }
        } catch (error) {
            console.error('Failed to fetch statistics:', error);
        }
    };

    const fetchCropData = async (barangay: string) => {
        setLoadingData(true);
        try {
            const response = await fetch(`/barangay/crop-data?barangay=${encodeURIComponent(barangay)}`);
            const data = await response.json();
            if (data.success) {
                setCropData(data.data);
                // Clear search when switching barangays
                setSearchQuery('');
            }
        } catch (error) {
            console.error('Failed to fetch crop data:', error);
        } finally {
            setLoadingData(false);
        }
    };

    const syncAllBarangays = async () => {
        setIsLoading(true);
        setSyncResults(null); // Clear previous results
        console.log('Starting sync all barangays...');
        
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            console.log('CSRF Token found:', !!csrfToken);
            
            if (!csrfToken) {
                throw new Error('CSRF token not found. Please refresh the page.');
            }

            const response = await fetch('/sync/sheets-to-database', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
            });

            console.log('Sync response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Response error:', errorText);
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            const data = await response.json();
            console.log('Sync response data:', data);
            setSyncResults(data);
            
            if (data.success) {
                console.log('Sync successful, refreshing data...');
                await fetchStatistics();
                if (viewMode === 'data') {
                    await fetchCropData(selectedBarangay);
                }
                console.log('Data refresh completed');
            } else {
                console.error('Sync failed:', data.message || data.error);
            }
        } catch (error) {
            console.error('Sync failed:', error);
            setSyncResults({
                success: false,
                message: `Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            });
        } finally {
            setIsLoading(false);
        }
    };

    const syncSpecificBarangay = async (barangay: string) => {
        setIsLoading(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            if (!csrfToken) {
                throw new Error('CSRF token not found. Please refresh the page.');
            }

            const response = await fetch('/sync/barangay-to-database', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ barangay }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            const data = await response.json();
            setSyncResults(data);
            
            if (data.success) {
                await fetchStatistics();
                if (barangay === selectedBarangay && viewMode === 'data') {
                    await fetchCropData(selectedBarangay);
                }
            }
        } catch (error) {
            console.error('Sync failed:', error);
            setSyncResults({
                success: false,
                message: `Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`
            });
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const highlightSearchTerm = (text: string, searchTerm: string) => {
        if (!searchTerm.trim()) return text;
        
        const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        const parts = text.split(regex);
        
        return parts.map((part, index) => 
            regex.test(part) ? (
                <span key={index} className="bg-yellow-200 text-yellow-800 px-1 rounded">
                    {part}
                </span>
            ) : part
        );
    };

    const getStatusBadge = (barangay: string) => {
        const stats = statistics[barangay];
        if (!stats) return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Unknown</span>;
        
        if (stats.total_records === 0) return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">No Data</span>;
        if (stats.recently_synced > 0) return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Recently Synced</span>;
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">Synced</span>;
    };

    return (
        <AppLayout>
            <Head title="Google Sheets Sync" />

            <div className="space-y-8 p-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Google Sheets Sync</h1>
                            <p className="text-gray-600">Sync crop data from Google Sheets to local database tables</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex bg-gray-50 rounded-xl p-1 border border-gray-100">
                                <button
                                    onClick={() => setViewMode('overview')}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                        viewMode === 'overview' 
                                        ? 'bg-white shadow-sm text-gray-900 border border-gray-200' 
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                                >
                                    Overview
                                </button>
                                <button
                                    onClick={() => setViewMode('data')}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                                        viewMode === 'data' 
                                        ? 'bg-white shadow-sm text-gray-900 border border-gray-200' 
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                                >
                                    Crop Data
                                </button>
                            </div>
                            <button 
                                onClick={syncAllBarangays} 
                                disabled={isLoading}
                                className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 disabled:bg-gray-300 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-sm disabled:hover:scale-100 disabled:cursor-not-allowed"
                            >
                                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                                {isLoading ? 'Syncing...' : 'Sync All'}
                            </button>
                        </div>
                    </div>
                </div>

                {syncResults && (
                    <div className={`bg-white rounded-xl shadow-sm border p-6 ${
                        syncResults.success 
                        ? 'border-emerald-200 bg-emerald-50' 
                        : 'border-red-200 bg-red-50'
                    }`}>
                        <div className="flex items-center gap-3">
                            {syncResults.success ? (
                                <div className="p-2 bg-emerald-100 rounded-full">
                                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                                </div>
                            ) : (
                                <div className="p-2 bg-red-100 rounded-full">
                                    <AlertCircle className="h-5 w-5 text-red-600" />
                                </div>
                            )}
                            <div>
                                <div className={`font-semibold ${
                                    syncResults.success ? 'text-emerald-800' : 'text-red-800'
                                }`}>
                                    {syncResults.success ? 'Sync Completed Successfully!' : 'Sync Failed'}
                                </div>
                                <div className={`text-sm ${
                                    syncResults.success ? 'text-emerald-700' : 'text-red-700'
                                }`}>
                                    {syncResults.message}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {viewMode === 'overview' && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {barangays.map((barangay) => (
                                <div key={barangay} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900">{barangay}</h3>
                                        {getStatusBadge(barangay)}
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-50 rounded-lg">
                                                <Database className="h-5 w-5 text-gray-600" />
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-gray-900">
                                                    {statistics[barangay]?.total_records || 0}
                                                </div>
                                                <div className="text-sm text-gray-500">records</div>
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                            <strong>Last sync:</strong><br />
                                            {statistics[barangay]?.last_sync || 'Never'}
                                        </div>
                                        <button 
                                            onClick={() => syncSpecificBarangay(barangay)}
                                            disabled={isLoading}
                                            className="w-full inline-flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 disabled:bg-gray-300 text-white font-semibold px-4 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed"
                                        >
                                            <FileSpreadsheet className="h-4 w-4" />
                                            {isLoading ? 'Syncing...' : `Sync ${barangay}`}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {syncResults && syncResults.details && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Sync Results</h3>
                                    <p className="text-gray-600">Details from the last sync operation</p>
                                </div>
                                <div className="space-y-3">
                                    {syncResults.details.map((detail: any, index: number) => (
                                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                                            <div className="flex items-center gap-3">
                                                {detail.status === 'success' ? (
                                                    <div className="p-1 bg-emerald-50 rounded-full">
                                                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                                                    </div>
                                                ) : (
                                                    <div className="p-1 bg-red-50 rounded-full">
                                                        <AlertCircle className="h-4 w-4 text-red-600" />
                                                    </div>
                                                )}
                                                <span className="font-medium text-gray-900">{detail.barangay}</span>
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {detail.status === 'success' 
                                                    ? `${detail.synced} synced, ${detail.errors} errors`
                                                    : detail.message
                                                }
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {viewMode === 'data' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <label className="text-sm font-medium text-gray-700">Select Barangay:</label>
                                    <select 
                                        value={selectedBarangay} 
                                        onChange={(e) => setSelectedBarangay(e.target.value)}
                                        className="border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                                    >
                                        {barangays.map((barangay) => (
                                            <option key={barangay} value={barangay}>{barangay}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                                    <span className="text-sm font-medium text-gray-700">
                                        {filteredCropData.length} of {cropData.length} records
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Crop Data for {selectedBarangay}</h3>
                                        <p className="text-gray-600">Data synced from Google Sheets to local database</p>
                                    </div>
                                    
                                    {/* Search Bar - Aligned with description */}
                                    <div className="relative w-80">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Search className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search by name, place, crop, area, yield..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                                        />
                                        {searchQuery && (
                                            <button
                                                onClick={() => setSearchQuery('')}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                            >
                                                <span className="text-lg">&times;</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                {loadingData ? (
                                    <div className="flex items-center justify-center py-12">
                                        <RefreshCw className="h-6 w-6 animate-spin text-teal-600" />
                                        <span className="ml-3 text-gray-600">Loading crop data...</span>
                                    </div>
                                ) : filteredCropData.length === 0 && cropData.length > 0 ? (
                                    <div className="text-center py-12">
                                        <div className="p-3 bg-gray-50 rounded-full inline-block mb-4">
                                            <Search className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <p className="text-gray-700 font-medium mb-2">No results found for "{searchQuery}"</p>
                                        <p className="text-sm text-gray-500">Try adjusting your search terms</p>
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="mt-3 text-teal-600 hover:text-teal-700 text-sm font-medium"
                                        >
                                            Clear search
                                        </button>
                                    </div>
                                ) : filteredCropData.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="p-3 bg-gray-50 rounded-full inline-block mb-4">
                                            <Info className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <p className="text-gray-700 font-medium mb-2">No crop data found for {selectedBarangay}</p>
                                        <p className="text-sm text-gray-500">Add data to the Google Sheet and sync to see it here</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="bg-gray-50 border-b border-gray-100">
                                                    <th className="text-left p-4 font-semibold text-gray-700">Name</th>
                                                    <th className="text-left p-4 font-semibold text-gray-700">Place</th>
                                                    <th className="text-left p-4 font-semibold text-gray-700">Crop</th>
                                                    <th className="text-left p-4 font-semibold text-gray-700">Planting Date</th>
                                                    <th className="text-left p-4 font-semibold text-gray-700">Harvest Date</th>
                                                    <th className="text-left p-4 font-semibold text-gray-700">Total Area</th>
                                                    <th className="text-left p-4 font-semibold text-gray-700">Total Yield</th>
                                                    <th className="text-left p-4 font-semibold text-gray-700">Synced At</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredCropData.map((crop) => (
                                                    <tr key={crop.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors duration-150">
                                                        <td className="p-4 text-gray-800">{highlightSearchTerm(crop.name, searchQuery)}</td>
                                                        <td className="p-4 text-gray-800">{highlightSearchTerm(crop.place, searchQuery)}</td>
                                                        <td className="p-4 text-gray-800">{highlightSearchTerm(crop.crop, searchQuery)}</td>
                                                        <td className="p-4 text-gray-800">{highlightSearchTerm(crop.planting_date, searchQuery)}</td>
                                                        <td className="p-4 text-gray-800">{highlightSearchTerm(crop.harvest_date, searchQuery)}</td>
                                                        <td className="p-4 text-gray-800">{highlightSearchTerm(crop.total_area, searchQuery)}</td>
                                                        <td className="p-4 text-gray-800">{highlightSearchTerm(crop.total_yield, searchQuery)}</td>
                                                        <td className="p-4 text-gray-800">{formatDate(crop.synced_at)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
