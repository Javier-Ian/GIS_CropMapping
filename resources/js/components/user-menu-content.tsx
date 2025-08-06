import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type User } from '@/types';
import { Link, router } from '@inertiajs/react';
import { LogOut, Settings } from 'lucide-react';

interface UserMenuContentProps {
    user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-3 px-3 py-3 text-left text-sm bg-gradient-to-r from-emerald-100/80 to-teal-100/80 rounded-t-xl border-b border-emerald-200/50">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-emerald-200/50" />
            <DropdownMenuGroup className="p-2">
                <DropdownMenuItem asChild>
                    <Link className="block w-full hover:bg-gradient-to-r hover:from-emerald-100/70 hover:to-teal-100/70 hover:text-emerald-900 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold text-emerald-800" href={route('profile.edit')} as="button" prefetch onClick={cleanup}>
                        <Settings className="mr-3 h-4 w-4 text-emerald-600 transition-all duration-300 group-hover:rotate-90" />
                        Settings
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-emerald-200/50" />
            <div className="p-2">
                <DropdownMenuItem asChild>
                    <Link className="block w-full hover:bg-gradient-to-r hover:from-red-100/70 hover:to-pink-100/70 hover:text-red-900 rounded-lg transition-all duration-300 transform hover:scale-105 font-semibold text-red-700" method="post" href={route('logout')} as="button" onClick={handleLogout}>
                        <LogOut className="mr-3 h-4 w-4 text-red-600 transition-all duration-300 group-hover:translate-x-1" />
                        Log out
                    </Link>
                </DropdownMenuItem>
            </div>
        </>
    );
}
