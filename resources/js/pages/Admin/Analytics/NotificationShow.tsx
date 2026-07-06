/* eslint-disable @typescript-eslint/no-unused-vars */
import { Head } from '@inertiajs/react';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/Central/site-header';
import { NotificationDetail } from '@/components/ecommerce/notifications/NotificationDetail';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import type { DashboardNotification } from '@/types/ecommerce/notifications/notification';

interface Props {
    notification: DashboardNotification;
    backUrl: string;
}

export default function NotificationShow({ notification, backUrl }: Props) {
    return (
        <SidebarProvider
            style={{
                '--sidebar-width': 'calc(var(--spacing) * 72)',
                '--header-height': 'calc(var(--spacing) * 12)',
            } as React.CSSProperties}
        >
            <Head title="Détail de la notification — Administration" />
            <AppSidebar />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-4">
                        <div className="px-4 py-6 lg:px-6">
                            <NotificationDetail
                                notification={notification}
                                backUrl={backUrl}
                            />
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
