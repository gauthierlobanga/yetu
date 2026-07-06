import { Link } from '@inertiajs/react';
import { LogIn } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { login } from '@/routes/tenant';
import type { User } from '@/types';

interface UserNavigationProps {
    user: User | null;
}

export function UserNavigation({ user }: UserNavigationProps) {
    const getInitials = useInitials();

    if (!user) {
        return (
            <Button
                variant="ghost"
                size="sm"
                asChild
                className={cn(
                    'group h-10 rounded-full border px-4 text-[13.5px] font-medium tracking-tight',
                    'border-slate-200/80 bg-white/80 text-slate-700 shadow-xs backdrop-blur-sm',
                    'transition-all duration-300',
                    'hover:border-emerald-300 hover:bg-white hover:text-emerald-700 hover:shadow-sm',
                    'dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-300',
                    'dark:hover:border-emerald-600/50 dark:hover:text-emerald-400',
                )}
            >
                <Link href={login()}>
                    <LogIn className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
                    Connexion
                </Link>
            </Button>
        );
    }

    const avatarUrl =
        user.avatar_url?.startsWith('http') || user.avatar_url?.startsWith('/')
            ? user.avatar_url
            : undefined;
    const userName = user.name || 'Utilisateur';
    const userInitials = getInitials(userName);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className={cn(
                        'group relative size-10 rounded-full p-1',
                        'transition-all duration-300',
                        'hover:ring-2 hover:ring-slate-200',
                        'dark:hover:ring-slate-700',
                    )}
                >
                    <Avatar className="size-8 border border-slate-200/50 shadow-xs transition-transform duration-300 group-hover:scale-105 dark:border-slate-800">
                        {avatarUrl ? (
                            <AvatarImage src={avatarUrl} alt={userName} className="object-cover" />
                        ) : (
                            <AvatarFallback className="bg-linear-to-br from-emerald-50 to-teal-100 text-xs font-semibold text-emerald-800 dark:from-emerald-950 dark:to-teal-900 dark:text-emerald-300">
                                {userInitials}
                            </AvatarFallback>
                        )}
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                sideOffset={8}
                className={cn(
                    'w-80 overflow-hidden rounded-2xl',
                    'border border-slate-200/70 bg-white/95 shadow-xl shadow-slate-900/5 backdrop-blur-xl',
                    'dark:border-slate-800/70 dark:bg-slate-950/95 dark:shadow-slate-950/50',
                    'animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200',
                )}
            >
                <UserMenuContent user={user} />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
