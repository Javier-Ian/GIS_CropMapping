import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { LayoutGrid, Upload } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Upload Map',
        href: '/maps/upload',
        icon: Upload,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset" className="bg-gradient-to-b from-emerald-50 via-teal-50 to-green-50 border-r-2 border-emerald-200/50 backdrop-blur-sm shadow-xl shadow-emerald-100/20">
            <SidebarHeader className="bg-gradient-to-br from-emerald-100/80 via-teal-100/80 to-green-100/80 border-b-2 border-emerald-200/50 backdrop-blur-sm">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-gradient-to-r hover:from-emerald-200/70 hover:to-teal-200/70 data-[active=true]:bg-gradient-to-r data-[active=true]:from-emerald-300/80 data-[active=true]:to-teal-300/80 data-[active=true]:text-emerald-900 transition-all duration-300 rounded-xl transform hover:scale-105 hover:shadow-lg hover:shadow-emerald-200/30">
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="bg-gradient-to-b from-emerald-50/70 via-teal-50/70 to-green-50/70 backdrop-blur-sm">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="bg-gradient-to-br from-emerald-100/80 via-teal-100/80 to-green-100/80 border-t-2 border-emerald-200/50 backdrop-blur-sm">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
