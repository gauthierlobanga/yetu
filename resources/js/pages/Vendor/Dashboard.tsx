// resources/js/Pages/Vendor/Dashboard.tsx
import { Head, Link } from '@inertiajs/react';
import { gsap } from 'gsap';
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    BarChart3,
    Settings,
    Rocket,
    CheckCircle,
    XCircle,
    Globe,
    Mail,
    Phone,
    Store,
    CreditCard,
    HelpCircle,
} from 'lucide-react';
import { useEffect, useRef } from 'react';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { VendorSidebar } from '@/components/VendorSidebar';

interface Props {
    tenant: {
        id: string;
        raison_sociale: string;
        slug: string;
        description: string | null;
        email: string;
        telephone: string | null;
        statut: string;
        is_active: boolean;
        domain: string | null;
        url: string;
        admin_url: string;
        plan: {
            name: string;
            price: number;
            currency: string;
            features: string[];
            limits: Record<string, string>;
        } | null;
    };
    freeFeatures: string[];
    paidFeatures: string[];
}

// Navigation principale du vendeur – résolue dans le composant
const vendorMainNavItems = (tenant: Props['tenant']) => [
    {
        title: 'Tableau de bord',
        href: route('vendor.dashboard'),
        icon: LayoutDashboard,
    },
    {
        title: 'Mes produits',
        href: `${tenant.admin_url}/produits`,
        icon: Package,
    },
    {
        title: 'Commandes',
        href: `${tenant.admin_url}/commandes`,
        icon: ShoppingCart,
    },
    {
        title: 'Statistiques',
        href: `${tenant.admin_url}/statistiques`,
        icon: BarChart3,
    },
    { title: 'Paramètres', href: route('vendor.configure'), icon: Settings },
    {
        title: 'Mon abonnement',
        href: route('vendor.dashboard') + '#plan',
        icon: CreditCard,
    },
    { title: 'Aide', href: route('page.help'), icon: HelpCircle },
];

const vendorFooterNavItems = [
    { title: 'CGV', href: route('page.terms') },
    { title: 'Confidentialité', href: route('page.privacy') },
    { title: 'Contact', href: route('page.contact') },
];

export default function VendorDashboard({
    tenant,
    freeFeatures,
    paidFeatures,
}: Props) {
    const mainNavItems = vendorMainNavItems(tenant);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                '.dashboard-card',
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    stagger: 0.1,
                    ease: 'power2.out',
                },
            );
            gsap.fromTo(
                '.dashboard-section',
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    delay: 0.3,
                    stagger: 0.1,
                    ease: 'power2.out',
                },
            );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <SidebarProvider
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 72)',
                    '--header-height': 'calc(var(--spacing) * 12)',
                } as React.CSSProperties
            }
        >
            <VendorSidebar
                mainNavItems={mainNavItems}
                footerNavItems={vendorFooterNavItems}
            />
            <SidebarInset>
                <SiteHeader />
                <div ref={containerRef}>
                    <Head title={`Gérer ${tenant.raison_sociale}`} />
                    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                {tenant.raison_sociale}
                            </h1>
                            <p className="mt-1 text-muted-foreground">
                                Bienvenue dans votre espace de gestion
                            </p>
                        </div>

                        {/* Cartes d'informations */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            <InfoCard
                                icon={Store}
                                label="Statut"
                                value={tenant.is_active ? 'Active' : 'Inactive'}
                                color={
                                    tenant.is_active
                                        ? 'text-emerald-500'
                                        : 'text-red-500'
                                }
                            />
                            <InfoCard
                                icon={Globe}
                                label="Domaine"
                                value={
                                    tenant.domain ||
                                    `${tenant.slug}.${window.location.hostname}`
                                }
                            />
                            <InfoCard
                                icon={Mail}
                                label="Email"
                                value={tenant.email}
                            />
                            {tenant.telephone && (
                                <InfoCard
                                    icon={Phone}
                                    label="Téléphone"
                                    value={tenant.telephone}
                                />
                            )}
                        </div>

                        {/* Actions rapides */}
                        <div className="dashboard-section mt-10">
                            <h2 className="mb-4 text-xl font-semibold text-foreground">
                                Actions rapides
                            </h2>
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    href={tenant.admin_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                                >
                                    <Rocket className="h-5 w-5" /> Gérer ma
                                    boutique (panel vendeur)
                                </Link>
                                <Link
                                    href={route('vendor.configure')}
                                    className="inline-flex items-center gap-2 rounded-xl bg-muted px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted/80"
                                >
                                    <Settings className="h-5 w-5" /> Modifier
                                    les informations
                                </Link>
                                <Link
                                    href={tenant.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-xl bg-muted px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted/80"
                                >
                                    <Globe className="h-5 w-5" /> Voir ma
                                    boutique
                                </Link>
                            </div>
                        </div>

                        {/* Fonctionnalités */}
                        <div className="dashboard-section mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
                            <div>
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-emerald-700 dark:text-emerald-400">
                                    <CheckCircle className="h-5 w-5" />{' '}
                                    Fonctionnalités incluses (gratuit)
                                </h3>
                                <ul className="mt-4 space-y-2">
                                    {freeFeatures.map((f, i) => (
                                        <li
                                            key={i}
                                            className="flex items-start gap-2 text-sm text-muted-foreground"
                                        >
                                            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />{' '}
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-muted-foreground">
                                    <XCircle className="h-5 w-5" />{' '}
                                    Fonctionnalités payantes (débloquées sur
                                    abonnement)
                                </h3>
                                <ul className="mt-4 space-y-2">
                                    {paidFeatures.map((f, i) => (
                                        <li
                                            key={i}
                                            className="flex items-start gap-2 text-sm text-muted-foreground"
                                        >
                                            <XCircle className="mt-0.5 h-4 w-4 shrink-0" />{' '}
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                {tenant.plan && tenant.plan.price > 0 && (
                                    <p className="mt-4 text-sm text-emerald-600 dark:text-emerald-400">
                                        Passez au plan supérieur pour débloquer
                                        ces fonctionnalités.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

function InfoCard({
    icon: Icon,
    label,
    value,
    color = 'text-foreground',
}: {
    icon: React.ElementType;
    label: string;
    value: string;
    color?: string;
}) {
    return (
        <div className="dashboard-card rounded-xl border bg-card p-6">
            <dt className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Icon className="h-5 w-5" /> {label}
            </dt>
            <dd className={`mt-2 text-lg font-semibold ${color}`}>{value}</dd>
        </div>
    );
}
