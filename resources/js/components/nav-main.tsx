import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    return (
        <SidebarGroup className="px-3 py-2">
            <SidebarGroupLabel className="text-emerald-800 font-bold text-sm tracking-wide uppercase bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent flex items-center gap-2 mb-2">
                Platform
            </SidebarGroupLabel>
            <SidebarMenu className="space-y-2">
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                            asChild 
                            isActive={page.url.startsWith(item.href)} 
                            tooltip={{ children: item.title }}
                            className="hover:bg-gradient-to-r hover:from-emerald-200/70 hover:to-teal-200/70 hover:text-emerald-900 hover:shadow-lg hover:shadow-emerald-200/30 data-[active=true]:bg-gradient-to-r data-[active=true]:from-emerald-300/80 data-[active=true]:to-teal-300/80 data-[active=true]:text-emerald-900 data-[active=true]:font-bold data-[active=true]:shadow-lg data-[active=true]:shadow-emerald-200/50 text-emerald-700 font-medium transition-all duration-300 rounded-xl transform hover:scale-105 hover:translate-x-1 group"
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon className="transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />}
                                <span className="font-semibold">{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
