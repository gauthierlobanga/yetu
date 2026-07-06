import { usePage } from '@inertiajs/react';
import { ChevronsUpDown } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export function NavUser() {
    const { auth } = usePage().props;
    const { state } = useSidebar();
    const isMobile = useIsMobile();

    if (!auth.user) {
        return null;
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className={cn(
                                'h-12 rounded-xl px-3 transition-all duration-300 ease-out',
                                'group text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent',
                                'hover:bg-slate-100/80 hover:text-slate-900',
                                'dark:text-slate-300 dark:hover:bg-slate-800/60 dark:hover:text-slate-100',
                                'data-[state=open]:bg-slate-100/80 dark:data-[state=open]:bg-slate-800/60',
                            )}
                            data-test="sidebar-menu-button"
                        >
                            <UserInfo user={auth.user} />
                            <ChevronsUpDown className="ml-auto size-4 shrink-0 text-slate-400 transition-transform duration-200 group-data-[state=open]:rotate-180 dark:text-slate-500" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className={cn(
                            'w-(--radix-dropdown-menu-trigger-width) min-w-64 rounded-2xl',
                            'border border-slate-200/70 bg-white/95 shadow-xl shadow-slate-900/5 backdrop-blur-xl',
                            'dark:border-slate-800/70 dark:bg-slate-950/95 dark:shadow-slate-950/50',
                            'animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2',
                        )}
                        align="end"
                        sideOffset={8}
                        side={
                            isMobile
                                ? 'bottom'
                                : state === 'collapsed'
                                  ? 'left'
                                  : 'bottom'
                        }
                    >
                        <UserMenuContent user={auth.user} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
