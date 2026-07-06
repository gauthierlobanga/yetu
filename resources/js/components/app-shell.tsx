import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import type { AppVariant } from '@/types';
import { AnnouncementBanner } from '@/components/global/AnnouncementBanner';

type Props = {
    children: ReactNode;
    variant?: AppVariant;
};

export function AppShell({ children, variant = 'sidebar' }: Props) {
    const isOpen = usePage().props.sidebarOpen;

    // Variant "header" : mise en page sans sidebar, par exemple pour l'authentification
    if (variant === 'header') {
        return (
            <div
                className={cn(
                    'flex h-screen overflow-hidden w-full flex-col',
                    'bg-linear-to-b from-emerald-50/50 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20',
                )}
            >
                <AnnouncementBanner />
                {children}
            </div>
        );
    }

    return (
        <SidebarProvider defaultOpen={isOpen}>
            <div
                className={cn(
                    'flex h-screen overflow-hidden w-full flex-col',
                    'bg-linear-to-b from-emerald-50/50 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20',
                )}
            >
                <AnnouncementBanner />
                <div className="flex flex-1 overflow-hidden">
                    {children}
                </div>
            </div>
        </SidebarProvider>
    );
}
