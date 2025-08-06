import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { useIsMobile } from '@/hooks/use-mobile';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { ChevronsUpDown } from 'lucide-react';

export function NavUser() {
    const { auth } = usePage<SharedData>().props;
    const { state } = useSidebar();
    const isMobile = useIsMobile();

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton 
                            size="lg" 
                            className="group text-emerald-800 hover:bg-gradient-to-r hover:from-emerald-200/70 hover:to-teal-200/70 hover:text-emerald-900 hover:shadow-lg hover:shadow-emerald-200/30 data-[state=open]:bg-gradient-to-r data-[state=open]:from-emerald-300/80 data-[state=open]:to-teal-300/80 data-[state=open]:text-emerald-900 data-[state=open]:shadow-lg data-[state=open]:shadow-emerald-200/50 transition-all duration-300 rounded-xl transform hover:scale-105 font-semibold"
                        >
                            <UserInfo user={auth.user} />
                            <ChevronsUpDown className="ml-auto size-4 transition-all duration-300 group-hover:rotate-180 group-hover:text-emerald-600" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200/50 shadow-xl shadow-emerald-100/30 backdrop-blur-sm"
                        align="end"
                        side={isMobile ? 'bottom' : state === 'collapsed' ? 'left' : 'bottom'}
                    >
                        <UserMenuContent user={auth.user} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
