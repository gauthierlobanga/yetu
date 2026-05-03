import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppHeaderTenant } from '@/components/tenants/layouts/header/AppHeaderTenant';
import type { AppLayoutProps } from '@/types';

export default function AppHeaderTenantLayout({
    children,
    breadcrumbs,
}: AppLayoutProps) {
    return (
        <AppShell variant="header">
            <AppHeaderTenant breadcrumbs={breadcrumbs} />
            <AppContent variant="header">{children}</AppContent>
        </AppShell>
    );
}
