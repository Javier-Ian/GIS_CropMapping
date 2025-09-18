import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    return (
        <SidebarGroup className="px-3 py-2">
            <SidebarGroupLabel className="text-white font-bold text-sm tracking-wide uppercase flex items-center gap-2 mb-2">
                Platform
            </SidebarGroupLabel>
            <SidebarMenu className="space-y-2">
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                            asChild 
                            isActive={page.url.startsWith(item.href)} 
                            tooltip={{ children: item.title }}
                            className="hover:bg-black/25 hover:text-white data-[active=true]:bg-black/35 data-[active=true]:text-white data-[active=true]:font-bold text-white/90 font-medium transition-all duration-300 rounded-xl transform hover:scale-105 hover:translate-x-1 group"
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
