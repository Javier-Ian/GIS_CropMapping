import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
import { RefreshCw, Database, FileSpreadsheet, CheckCircle, AlertCircle, Info } from 'lucide-react';

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
    const [loadingData, setLoadingData] = useState(false);
    const [viewMode, setViewMode] = useState<'overview' | 'data'>('overview');

    const barangays = ['Brgy. Butong', 'Brgy. Salawagan', 'Brgy. San Jose'];

    useEffect(() => {
        fetchStatistics();
        if (viewMode === 'data') {
            fetchCropData(selectedBarangay);
        }
    }, [selectedBarangay, viewMode]);

    const fetchStatistics = async () => {
        try {
            const response = await fetch('/sync/statistics');
            const data = await response.json();
            if (data.success) {
                setStatistics(data.statistics);
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
            }
        } catch (error) {
            console.error('Failed to fetch crop data:', error);
        } finally {
            setLoadingData(false);
        }
    };

    const syncAllBarangays = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/sync/sheets-to-database', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const data = await response.json();
            setSyncResults(data);
            
            if (data.success) {
                await fetchStatistics();
                if (viewMode === 'data') {
                    await fetchCropData(selectedBarangay);
                }
            }
        } catch (error) {
            console.error('Sync failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const syncSpecificBarangay = async (barangay: string) => {
        setIsLoading(true);
        try {
            const response = await fetch('/sync/barangay-to-database', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ barangay }),
            });

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
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const getStatusBadge = (barangay: string) => {
        const stats = statistics[barangay];
        if (!stats) return <Badge variant="secondary">Unknown</Badge>;
        
        if (stats.total_records === 0) return <Badge variant="secondary">No Data</Badge>;
        if (stats.recently_synced > 0) return <Badge className="bg-green-100 text-green-800">Recently Synced</Badge>;
        return <Badge variant="outline">Synced</Badge>;
    };

    return (
        <AppLayout>
            <Head title="Google Sheets Sync" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Google Sheets Database Sync</h1>
                        <p className="text-gray-600">Sync crop data from Google Sheets to local database tables</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('overview')}
                                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                    viewMode === 'overview' 
                                    ? 'bg-white shadow-sm text-gray-900' 
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setViewMode('data')}
                                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                    viewMode === 'data' 
                                    ? 'bg-white shadow-sm text-gray-900' 
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Crop Data
                            </button>
                        </div>
                        <Button 
                            onClick={syncAllBarangays} 
                            disabled={isLoading}
                            className="flex items-center gap-2"
                        >
                            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                            Sync All Barangays
                        </Button>
                    </div>
                </div>

                {syncResults && (
                    <Alert className="border-l-4 border-l-blue-500">
                        <div className="flex items-center gap-2">
                            {syncResults.success ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                                <AlertCircle className="h-4 w-4 text-red-600" />
                            )}
                            <span>{syncResults.message}</span>
                        </div>
                    </Alert>
                )}

                {viewMode === 'overview' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {barangays.map((barangay) => (
                                <Card key={barangay}>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">{barangay}</CardTitle>
                                        {getStatusBadge(barangay)}
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Database className="h-4 w-4 text-gray-500" />
                                                <span className="text-2xl font-bold">
                                                    {statistics[barangay]?.total_records || 0}
                                                </span>
                                                <span className="text-gray-500">records</span>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Last sync: {statistics[barangay]?.last_sync || 'Never'}
                                            </div>
                                            <Button 
                                                size="sm" 
                                                variant="outline" 
                                                onClick={() => syncSpecificBarangay(barangay)}
                                                disabled={isLoading}
                                                className="w-full flex items-center gap-2"
                                            >
                                                <FileSpreadsheet className="h-3 w-3" />
                                                Sync {barangay}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {syncResults && syncResults.details && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Sync Results</CardTitle>
                                    <CardDescription>Details from the last sync operation</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {syncResults.details.map((detail: any, index: number) => (
                                            <div key={index} className="flex items-center justify-between p-3 border rounded">
                                                <div className="flex items-center gap-2">
                                                    {detail.status === 'success' ? (
                                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                                    ) : (
                                                        <AlertCircle className="h-4 w-4 text-red-600" />
                                                    )}
                                                    <span className="font-medium">{detail.barangay}</span>
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
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}

                {viewMode === 'data' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <label className="text-sm font-medium">Select Barangay:</label>
                                <select 
                                    value={selectedBarangay} 
                                    onChange={(e) => setSelectedBarangay(e.target.value)}
                                    className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                                >
                                    {barangays.map((barangay) => (
                                        <option key={barangay} value={barangay}>{barangay}</option>
                                    ))}
                                </select>
                            </div>
                            <Badge variant="outline" className="text-sm">
                                {cropData.length} records
                            </Badge>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Crop Data for {selectedBarangay}</CardTitle>
                                <CardDescription>
                                    Data synced from Google Sheets to local database
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {loadingData ? (
                                    <div className="flex items-center justify-center py-8">
                                        <RefreshCw className="h-6 w-6 animate-spin" />
                                        <span className="ml-2">Loading crop data...</span>
                                    </div>
                                ) : cropData.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <Info className="h-8 w-8 mx-auto mb-2" />
                                        <p>No crop data found for {selectedBarangay}</p>
                                        <p className="text-sm">Add data to the Google Sheet and sync to see it here</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="text-left p-3 font-medium">Name</th>
                                                    <th className="text-left p-3 font-medium">Place</th>
                                                    <th className="text-left p-3 font-medium">Crop</th>
                                                    <th className="text-left p-3 font-medium">Planting Date</th>
                                                    <th className="text-left p-3 font-medium">Harvest Date</th>
                                                    <th className="text-left p-3 font-medium">Total Area</th>
                                                    <th className="text-left p-3 font-medium">Total Yield</th>
                                                    <th className="text-left p-3 font-medium">Synced At</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cropData.map((crop) => (
                                                    <tr key={crop.id} className="border-t hover:bg-gray-50">
                                                        <td className="p-3">{crop.name}</td>
                                                        <td className="p-3">{crop.place}</td>
                                                        <td className="p-3">{crop.crop}</td>
                                                        <td className="p-3">{crop.planting_date}</td>
                                                        <td className="p-3">{crop.harvest_date}</td>
                                                        <td className="p-3">{crop.total_area}</td>
                                                        <td className="p-3">{crop.total_yield}</td>
                                                        <td className="p-3">{formatDate(crop.synced_at)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
