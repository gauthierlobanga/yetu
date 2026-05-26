// resources/js/pages/customs/dashboard-acheteurs.tsx
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import CustomerDashboard from './Index';

export default function DashboardCustomer() {
    return (
        <SidebarProvider
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 72)',
                    '--header-height': 'calc(var(--spacing) * 12)',
                } as React.CSSProperties
            }
        >
            <AppSidebar />
            <SidebarInset>
                <SiteHeader />
                {/* Hero Section moderne */}
                <CustomerDashboard />
            </SidebarInset>
        </SidebarProvider>
    );
}

// Dashboard.layout = {
//     breadcrumbs: [
//         {
//             title: 'Dashboard',
//             href: route('dashboard'),
//         },
//     ],
// };
