import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppHeaderTenant } from '@/components/tenants/layouts/header/AppHeaderTenant';
import { Toaster } from '@/components/ui/sonner';
import type { AppLayoutProps } from '@/types';
import TenantFooterSection from './app/app-footer-tenant';

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => (
    <AppShell variant="header">
        <AppHeaderTenant breadcrumbs={breadcrumbs} {...props} />
        <AppContent variant="header">{children}</AppContent>
        {/* Toaster pour les notifications */}
        <Toaster
            position="top-right"
            richColors
            closeButton
            expand={true}
            duration={5000}
        />
        <TenantFooterSection />
    </AppShell>
);
