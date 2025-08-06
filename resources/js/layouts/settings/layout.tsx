import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren, useState, useEffect } from 'react';
import { User, Lock, Palette, Settings, Sparkles } from 'lucide-react';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: '/settings/profile',
        icon: User,
    },
    {
        title: 'Password',
        href: '/settings/password',
        icon: Lock,
    },
    {
        title: 'Appearance',
        href: '/settings/appearance',
        icon: Palette,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    return (
        <div className={`px-4 py-6 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {/* Enhanced Header */}
            <div className={`mb-8 transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                <div className="relative group">
                    <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-emerald-700 via-teal-600 to-green-700 bg-clip-text text-transparent flex items-center gap-3">
                        <Settings className="h-10 w-10 text-emerald-600 transform transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 drop-shadow-sm" />
                        Settings
                    </h1>
                    <p className="text-slate-600 mt-2 flex items-center gap-2 font-medium">
                        <Sparkles className="h-4 w-4 text-emerald-500 transform transition-all duration-700 hover:rotate-180" />
                        Manage your profile and account settings
                    </p>
                </div>
            </div>

            <div className={`flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12 transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <aside className="w-full max-w-xl lg:w-64">
                    <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl shadow-emerald-100/20 rounded-2xl overflow-hidden transform hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-200/30">
                        <CardHeader className="bg-gradient-to-r from-emerald-100/50 to-teal-100/50 border-b border-emerald-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-emerald-100">
                                    <Settings className="h-5 w-5 text-emerald-700" />
                                </div>
                                <div>
                                    <CardTitle className="text-emerald-800 font-bold">Navigation</CardTitle>
                                    <CardDescription className="text-emerald-600 font-medium">Account settings</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4">
                            <nav className="flex flex-col space-y-2">
                                {sidebarNavItems.map((item, index) => {
                                    const Icon = item.icon;
                                    const isActive = currentPath === item.href;
                                    return (
                                        <Button
                                            key={`${item.href}-${index}`}
                                            size="sm"
                                            variant="ghost"
                                            asChild
                                            className={cn(
                                                'w-full justify-start h-12 rounded-xl font-medium transition-all duration-300 transform hover:scale-105',
                                                isActive 
                                                    ? 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border-2 border-emerald-200 shadow-lg' 
                                                    : 'hover:bg-emerald-50 hover:text-emerald-700 text-slate-600'
                                            )}
                                        >
                                            <Link href={item.href} prefetch className="flex items-center gap-3">
                                                {Icon && <Icon className={cn("h-4 w-4", isActive ? "text-emerald-700" : "text-slate-500")} />}
                                                {item.title}
                                            </Link>
                                        </Button>
                                    );
                                })}
                            </nav>
                        </CardContent>
                    </Card>
                </aside>

                <Separator className="my-6 md:hidden" />

                <div className="flex-1 md:max-w-2xl">
                    <section className="max-w-2xl space-y-12">{children}</section>
                </div>
            </div>
        </div>
    );
}
