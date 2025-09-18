import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren, useState, useEffect } from 'react';
import { User, Lock, Settings } from 'lucide-react';

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
            {/* Clean Header */}
            <div className={`mb-8 transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                <div className="group">
                    <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                        <Settings className="h-8 w-8 text-teal-600 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
                        Settings
                    </h1>
                    <p className="text-slate-600 mt-2 font-medium">
                        Manage your profile and account settings
                    </p>
                </div>
            </div>

            <div className={`flex flex-col space-y-6 lg:flex-row lg:space-y-0 lg:space-x-8 transition-all duration-700 delay-400 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <aside className="w-full lg:w-64">
                    <Card className="border border-slate-200/60 bg-white/95 backdrop-blur-sm shadow-sm rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md hover:border-teal-200/80">
                        <CardHeader className="bg-gradient-to-r from-slate-50/80 to-teal-50/60 border-b border-slate-100/80 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-lg bg-teal-100/80 border border-teal-200/50">
                                    <Settings className="h-5 w-5 text-teal-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-slate-800 font-semibold">Navigation</CardTitle>
                                    <CardDescription className="text-slate-600 font-medium">Account settings</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4">
                            <nav className="flex flex-col space-y-1">
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
                                                'w-full justify-start h-10 rounded-lg font-medium transition-all duration-200',
                                                isActive 
                                                    ? 'bg-teal-100/80 text-teal-800 border border-teal-200/60 shadow-sm' 
                                                    : 'hover:bg-slate-100/70 hover:text-slate-700 text-slate-600'
                                            )}
                                        >
                                            <Link href={item.href} prefetch className="flex items-center gap-3">
                                                {Icon && <Icon className={cn("h-4 w-4", isActive ? "text-teal-700" : "text-slate-500")} />}
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
