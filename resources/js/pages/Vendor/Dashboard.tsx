// resources/js/Pages/Vendor/Dashboard.tsx
import { Head, Link } from '@inertiajs/react';
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

// Navigation principale du vendeur
const vendorMainNavItems = [
    {
        title: 'Tableau de bord',
        href: route('vendor.dashboard'),
        icon: LayoutDashboard,
    },
    {
        title: 'Mes produits',
        href: 'tenant?.admin_url + "/produits"', // sera résolu dynamiquement
        icon: Package,
    },
    {
        title: 'Commandes',
        href: 'tenant?.admin_url + "/commandes"',
        icon: ShoppingCart,
    },
    {
        title: 'Statistiques',
        href: 'tenant?.admin_url + "/statistiques"',
        icon: BarChart3,
    },
    {
        title: 'Paramètres',
        href: route('vendor.configure'),
        icon: Settings,
    },
    {
        title: 'Mon abonnement',
        href: route('vendor.dashboard') + '#plan',
        icon: CreditCard,
    },
    {
        title: 'Aide',
        href: route('page.help'),
        icon: HelpCircle,
    },
];

// Liens de footer de la sidebar
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
    // Résolution dynamique des liens qui utilisent tenant.admin_url
    const resolvedMainNavItems = vendorMainNavItems.map((item) => ({
        ...item,
        href: item.href.includes('tenant?.admin_url')
            ? item.href.replace('tenant?.admin_url', tenant.admin_url)
            : item.href,
    }));

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
                mainNavItems={resolvedMainNavItems}
                footerNavItems={vendorFooterNavItems}
            />
            <SidebarInset>
                <SiteHeader />
                <Head title={`Gérer ${tenant.raison_sociale}`} />
                <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {tenant.raison_sociale}
                        </h1>
                        <p className="mt-1 text-gray-500 dark:text-gray-400">
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
                                    ? 'text-green-500'
                                    : 'text-red-500'
                            }
                        />
                        <InfoCard
                            icon={Globe}
                            label="Domaine"
                            value={
                                tenant.domain
                                    ? tenant.domain
                                    : `${tenant.slug}.${window.location.hostname}`
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
                    <div className="mt-10">
                        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                            Actions rapides
                        </h2>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                href={tenant.admin_url}
                                className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-6 py-3 text-white shadow transition hover:bg-amber-700"
                            >
                                <Rocket className="h-5 w-5" />
                                Gérer ma boutique (panel vendeur)
                            </Link>
                            <Link
                                href={route('vendor.configure')}
                                className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-6 py-3 text-gray-700 transition hover:bg-gray-200"
                            >
                                <Settings className="h-5 w-5" />
                                Modifier les informations
                            </Link>
                            <Link
                                href={tenant.url}
                                className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-6 py-3 text-gray-700 transition hover:bg-gray-200"
                            >
                                <Globe className="h-5 w-5" />
                                Voir ma boutique
                            </Link>
                        </div>
                    </div>

                    {/* Fonctionnalités */}
                    <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
                        <div>
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-green-700 dark:text-green-400">
                                <CheckCircle className="h-5 w-5" />{' '}
                                Fonctionnalités incluses (gratuit)
                            </h3>
                            <ul className="mt-4 space-y-2">
                                {freeFeatures.map((f, i) => (
                                    <li
                                        key={i}
                                        className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300"
                                    >
                                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-500 dark:text-gray-400">
                                <XCircle className="h-5 w-5" /> Fonctionnalités
                                payantes (débloquées sur abonnement)
                            </h3>
                            <ul className="mt-4 space-y-2">
                                {paidFeatures.map((f, i) => (
                                    <li
                                        key={i}
                                        className="flex items-start gap-2 text-sm text-gray-400"
                                    >
                                        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-gray-300 dark:text-gray-600" />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            {tenant.plan && tenant.plan.price > 0 && (
                                <p className="mt-4 text-sm text-amber-600">
                                    Passez au plan supérieur pour débloquer ces
                                    fonctionnalités.
                                </p>
                            )}
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
    color = 'text-gray-900 dark:text-white',
}: {
    icon: React.ElementType;
    label: string;
    value: string;
    color?: string;
}) {
    return (
        <div className="rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800">
            <dt className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                <Icon className="h-5 w-5" /> {label}
            </dt>
            <dd className={`mt-2 text-lg font-semibold ${color}`}>{value}</dd>
        </div>
    );
}
