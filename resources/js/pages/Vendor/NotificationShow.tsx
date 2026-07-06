import { Head, usePage } from '@inertiajs/react';
import { NotificationDetail } from '@/components/ecommerce/notifications/NotificationDetail';
import { SiteHeader } from '@/components/site-header';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { VendorSidebar } from '@/components/VendorSidebar';
import { cn } from '@/lib/utils';
import type { DashboardNotification } from '@/types/ecommerce/notifications/notification';
import type { Tenant } from '@/types/tenants/products/vendor/tenant';

interface Props {
    notification: DashboardNotification;
    backUrl: string;
}

export default function NotificationShow({ notification, backUrl }: Props) {
    const { tenant } = usePage<{ tenant: Tenant }>().props;

    return (
        <SidebarProvider
            className={cn(
                'h-screen overflow-hidden',
                'border-r border-slate-200/70',
                'bg-white/92 backdrop-blur-3xl supports-backdrop-filter:bg-white/88',
                'dark:border-transparent',
                'dark:bg-slate-950/94 dark:supports-backdrop-filter:bg-slate-950/88'
            )}
            style={{
                '--sidebar-width': 'calc(var(--spacing) * 72)',
                '--header-height': 'calc(var(--spacing) * 12)',
            } as React.CSSProperties}
        >
            <Head title="Détail de la notification" />
            <VendorSidebar tenant={tenant} />
            <SidebarInset className="flex min-h-0 flex-col">
                <SiteHeader />
                <ScrollArea className="min-h-0 flex-1">
                    <div className="bg-white dark:bg-slate-950 min-h-full">
                        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                            <NotificationDetail
                                notification={notification}
                                backUrl={backUrl}
                            />
                        </div>
                    </div>
                </ScrollArea>
            </SidebarInset>
        </SidebarProvider>
    );
}
