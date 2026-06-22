import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppHeader } from '@/components/layouts/header/AppHeader';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { AppLayoutProps } from '@/types';

export default function AppHeaderLayout({
    children,
    breadcrumbs,
}: AppLayoutProps) {
    return (
        <AppShell variant="header">
            <AppHeader breadcrumbs={breadcrumbs} />
            <ScrollArea className="flex-1 min-h-0">
                <AppContent variant="header">{children}</AppContent>
            </ScrollArea>
        </AppShell>
    );
}
