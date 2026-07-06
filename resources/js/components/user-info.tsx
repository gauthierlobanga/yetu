import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import type { User } from '@/types';

export function UserInfo({
    user,
    showEmail = false,
    className,
}: {
    user: User;
    showEmail?: boolean;
    className?: string;
}) {
    const getInitials = useInitials();

    return (
        <div className={cn('flex items-center gap-3', className)}>
            <Avatar className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-slate-200/50 bg-white shadow-xs transition-transform duration-300 hover:scale-105 dark:border-slate-800 dark:bg-slate-950">
                {user.avatar_url ? (
                    <AvatarImage 
                        src={user.avatar_url} 
                        alt={user.name} 
                        className="object-cover"
                    />
                ) : (
                    <AvatarFallback className="rounded-full bg-linear-to-br from-emerald-50 to-teal-100 font-semibold text-emerald-800 dark:from-emerald-950 dark:to-teal-900 dark:text-emerald-300">
                        {getInitials(user.name)}
                    </AvatarFallback>
                )}
            </Avatar>
            <div className="flex flex-1 flex-col justify-center overflow-hidden text-left">
                <span className="truncate text-[14px] font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                    {user.name}
                </span>
                {showEmail && (
                    <span className="truncate text-[12.5px] font-medium text-slate-500 dark:text-slate-400">
                        {user.email}
                    </span>
                )}
            </div>
        </div>
    );
}
