/* eslint-disable @typescript-eslint/no-unused-vars */
import { usePage } from '@inertiajs/react';
import { useEffect, useMemo } from 'react';
import { Toaster } from '@/components/ui/sonner';
import AppLayoutTemplate from '@/layouts/app/app-header-layout';
import type { AppLayoutProps } from '@/types';
import FooterSection from './app/app-footer';

export default function MainLayout({
    children,
    breadcrumbs,
    ...props
}: AppLayoutProps) {
    const { subscription, tenantTheme, isTenant } = usePage().props as any;

    useEffect(() => {
        if (subscription?.is_expired) {
            window.location.href = route('tenant.subscription.required');
        }
    }, [subscription]);

    // Appliquer les variables CSS du thème personnalisé sur :root
    // useEffect(() => {
    //     console.log('MainLayout - isTenant:', isTenant);
    //     console.log('MainLayout - tenantTheme:', tenantTheme);

    //     if (!isTenant || !tenantTheme) {
    //         console.log('MainLayout - Pas de thème à appliquer');

    //         return;
    //     }

    //     const root = document.documentElement;

    //     // Enregistrer les valeurs par défaut (optionnel)
    //     const originalValues: Record<string, string> = {};
    //     const properties = [
    //         '--background',
    //         '--foreground',
    //         '--card',
    //         '--card-foreground',
    //         '--popover',
    //         '--popover-foreground',
    //         '--primary',
    //         '--primary-foreground',
    //         '--secondary',
    //         '--secondary-foreground',
    //         '--muted',
    //         '--muted-foreground',
    //         '--accent',
    //         '--accent-foreground',
    //         '--destructive',
    //         '--destructive-foreground',
    //         '--border',
    //         '--input',
    //         '--ring',
    //     ];

    //     properties.forEach((prop) => {
    //         originalValues[prop] = root.style.getPropertyValue(prop);
    //     });

    //     // Appliquer les nouvelles valeurs
    //     console.log(
    //         'MainLayout - Application des variables CSS:',
    //         Object.keys(tenantTheme),
    //     );
    //     Object.entries(tenantTheme).forEach(([key, value]) => {
    //         if (key.startsWith('--') && typeof value === 'string') {
    //             console.log(`MainLayout - Setting ${key} = ${value}`);
    //             root.style.setProperty(key, value);
    //         }
    //     });

    //     return () => {
    //         // Restaurer les valeurs par défaut quand on quitte la boutique
    //         properties.forEach((prop) => {
    //             root.style.setProperty(prop, originalValues[prop] || '');
    //         });
    //     };
    // }, [isTenant, tenantTheme]);

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
            <Toaster
                position="top-right"
                richColors
                closeButton
                expand={true}
                duration={5000}
            />
            <FooterSection />
        </AppLayoutTemplate>
    );
}
