import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { type User } from '@/types';

export function UserInfo({ user, showEmail = false, variant = 'light' }: { user: User; showEmail?: boolean; variant?: 'light' | 'dark' }) {
    const getInitials = useInitials();

    const isDark = variant === 'dark';

    return (
        <>
            <Avatar className={`h-9 w-9 overflow-hidden rounded-full shadow-lg ring-2 transition-all duration-300 group-hover:scale-110 ${
                isDark 
                    ? 'ring-white/20 group-hover:ring-white/30' 
                    : 'ring-emerald-200 ring-offset-2 ring-offset-emerald-50 group-hover:ring-emerald-300'
            }`} style={isDark ? { '--tw-ring-offset-color': '#00786f' } as React.CSSProperties : undefined}>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className={`rounded-full font-bold text-sm shadow-inner ${
                    isDark 
                        ? 'text-white' 
                        : 'bg-gradient-to-br from-emerald-600 via-teal-600 to-green-600 text-white'
                }`} style={isDark ? { backgroundColor: '#00786f' } : undefined}>
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className={`truncate font-bold transition-colors ${
                    isDark 
                        ? 'text-white group-hover:text-white/90' 
                        : 'text-emerald-800 group-hover:text-emerald-900'
                }`}>{user.name}</span>
                {showEmail && <span className={`truncate text-xs transition-colors font-medium ${
                    isDark 
                        ? 'text-white/80 group-hover:text-white/70' 
                        : 'text-emerald-600 group-hover:text-emerald-700'
                }`}>{user.email}</span>}
            </div>
        </>
    );
}
