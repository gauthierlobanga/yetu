import { Head } from '@inertiajs/react';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/Central/site-header';
import { NotificationManager } from '@/components/ecommerce/notifications/NotificationManager';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { DashboardNotification } from '@/types/ecommerce/notifications/notification';

interface PaginatedNotifications {
    data: DashboardNotification[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    notifications: PaginatedNotifications;
    activeTab: 'all' | 'unread';
}

export default function Notifications({ notifications, activeTab }: Props) {
    return (
        <SidebarProvider
            style={{
                '--sidebar-width': 'calc(var(--spacing) * 72)',
                '--header-height': 'calc(var(--spacing) * 12)',
            } as React.CSSProperties}
        >
            <AppSidebar />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-4">
                        <div className="px-4 py-6 lg:px-6">
                            <Head title="Notifications — Administration" />
                            <NotificationManager
                                notifications={notifications}
                                activeTab={activeTab}
                                detailRouteName="admin.notifications.show"
                            />
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
