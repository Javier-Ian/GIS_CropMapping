import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { LayoutGrid, Upload, RefreshCw } from 'lucide-react';
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
    {
        title: 'Sheets Sync',
        href: '/sync',
        icon: RefreshCw,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset" className="border-r shadow-lg" style={{ backgroundColor: '#00786f' }}>
            <SidebarHeader className="border-b border-black/10" style={{ backgroundColor: '#00786f' }}>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-black/20 data-[active=true]:bg-black/30 data-[active=true]:text-white transition-all duration-300 rounded-xl transform hover:scale-105">
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent style={{ backgroundColor: '#00786f' }}>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="border-t border-black/10" style={{ backgroundColor: '#00786f' }}>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
