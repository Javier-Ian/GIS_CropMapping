import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { type User } from '@/types';

export function UserInfo({ user, showEmail = false }: { user: User; showEmail?: boolean }) {
    const getInitials = useInitials();

    return (
        <>
            <Avatar className="h-9 w-9 overflow-hidden rounded-full shadow-lg ring-2 ring-emerald-200 ring-offset-2 ring-offset-emerald-50 transition-all duration-300 group-hover:ring-emerald-300 group-hover:scale-110">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-full bg-gradient-to-br from-emerald-600 via-teal-600 to-green-600 text-white font-bold text-sm shadow-inner">
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-bold text-emerald-800 group-hover:text-emerald-900 transition-colors">{user.name}</span>
                {showEmail && <span className="truncate text-xs text-emerald-600 group-hover:text-emerald-700 transition-colors font-medium">{user.email}</span>}
            </div>
        </>
    );
}
