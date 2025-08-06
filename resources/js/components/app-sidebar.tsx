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
        <Sidebar collapsible="icon" variant="inset" className="bg-gradient-to-b from-green-50 to-emerald-50 border-r border-green-200">
            <SidebarHeader className="bg-gradient-to-r from-green-100 to-emerald-100 border-b border-green-200">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="hover:bg-green-200/50">
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="bg-gradient-to-b from-green-50 to-emerald-50">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="bg-gradient-to-r from-green-100 to-emerald-100 border-t border-green-200">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
