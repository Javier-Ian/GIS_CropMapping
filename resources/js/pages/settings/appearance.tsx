import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Palette, Sparkles, Monitor } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appearance settings',
        href: '/settings/appearance',
    },
];

export default function Appearance() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appearance settings" />

            <SettingsLayout>
                <div className={`space-y-8 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    {/* Appearance Settings Card */}
                    <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl shadow-green-100/20 rounded-2xl overflow-hidden transform hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-green-200/30">
                        <CardHeader className="bg-gradient-to-r from-green-100/50 to-emerald-100/50 border-b border-green-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-green-100">
                                    <Palette className="h-6 w-6 text-green-700" />
                                </div>
                                <div>
                                    <CardTitle className="text-green-800 font-bold text-2xl flex items-center gap-2">
                                        Appearance Settings
                                        <Sparkles className="h-5 w-5 text-green-600 animate-pulse" />
                                    </CardTitle>
                                    <CardDescription className="text-green-600 font-medium">Customize your visual experience and theme preferences</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <AppearanceTabs />
                        </CardContent>
                    </Card>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
