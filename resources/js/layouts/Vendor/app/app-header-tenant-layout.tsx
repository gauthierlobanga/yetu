import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { AppLayoutProps } from '@/types';

export default function AppHeaderTenantLayout({
    children,
    breadcrumbs,
}: AppLayoutProps) {
    return (
        <AppShell variant="header">
            <AppHeaderTenantLayout
                breadcrumbs={breadcrumbs}
                children={undefined}
            />
            <ScrollArea className="flex-1 min-h-0">
                <AppContent variant="header">{children}</AppContent>
            </ScrollArea>
        </AppShell>
    );
}
