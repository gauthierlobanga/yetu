/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/Pages/Vendor/Dashboard.tsx
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import {
    BarChart3,
    Ban,
    Box,
    CheckCircle,
    ClipboardList,
    Clock,
    Clock3,
    CreditCard,
    DollarSign,
    Globe,
    Package,
    PenLine,
    Percent,
    Receipt,
    Rocket,
    Settings,
    ShoppingBag,
    ShoppingCart,
    Sparkles,
    ThumbsUp,
    Trash2,
    Truck,
    Users,
    ArrowDownRight,
    ArrowUpRight,
} from 'lucide-react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { VendorSidebar } from '@/components/VendorSidebar';

interface Tenant {
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
    } | null;
}

interface Stats {
    products_count: number;
    orders_count: number;
    revenue: number;
    customers_count: number;
    abandoned_carts: number;
    inventory_count: number;
    growth_percent: number;
}

interface Trial {
    start: string;
    end: string;
    remaining_days: number;
}

interface RecentProduct {
    id: string;
    nom: string;
    slug: string;
    prix: number;
    stock: number;
    statut: string;
    image: string;
    edit_url: string;
    delete_url?: string;
}

interface Props {
    tenant: Tenant;
    stats: Stats;
    trial?: Trial;
    recentProducts: RecentProduct[];
    currentPlanFeatures: string[];
    allPlansFeatures: Record<string, string[]>;
}

export default function VendorDashboard({
    tenant,
    stats,
    trial,
    recentProducts,
    currentPlanFeatures,
    allPlansFeatures,
}: Props) {
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

    const handleDeleteProduct = async (productId: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            router.delete(route('tenant.product.delete', productId), {
                onSuccess: () => toast.success('Produit supprimé'),
                onError: () => toast.error('Erreur lors de la suppression'),
            });
        }
    };

    const avgOrderValue =
        stats.orders_count > 0 ? stats.revenue / stats.orders_count : 0;
    const outOfStock = stats.products_count - stats.inventory_count;
    const pendingOrders = Math.max(0, stats.orders_count - 3);
    const returnRate = 2.4;
    const conversionRate =
        stats.customers_count > 0
            ? (stats.orders_count / stats.customers_count) * 100
            : 0;

    return (
        <SidebarProvider
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 72)',
                    '--header-height': 'calc(var(--spacing) * 12)',
                } as React.CSSProperties
            }
        >
            <VendorSidebar tenant={tenant} />
            <SidebarInset>
                <SiteHeader />
                <div ref={containerRef} className="bg-white dark:bg-slate-950">
                    <Head title={`Gérer ${tenant.raison_sociale}`} />
                    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                        {/* En-tête */}
                        <div className="dashboard-section mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {tenant.raison_sociale}
                                </h1>
                                <p className="mt-1 text-slate-500 dark:text-slate-400">
                                    {tenant.description ||
                                        'Bienvenue dans votre espace de gestion'}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <span
                                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                                        tenant.is_active
                                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                    }`}
                                >
                                    {tenant.is_active
                                        ? 'Boutique active'
                                        : 'Inactive'}
                                </span>
                                {tenant.plan && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                        <CreditCard className="h-4 w-4" />
                                        {tenant.plan.name}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Période d'essai (emerald/slate) */}
                        {trial && (
                            <div className="dashboard-section mb-8">
                                <Card className="border-emerald-200 bg-linear-to-r from-emerald-50 to-white dark:border-emerald-800 dark:from-emerald-950/40 dark:to-slate-900">
                                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                            <Clock3 className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg font-semibold text-emerald-800 dark:text-emerald-200">
                                                Période d'essai
                                            </CardTitle>
                                            <CardDescription className="text-slate-500 dark:text-slate-400">
                                                Du {trial.start} au {trial.end}
                                            </CardDescription>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                                                {trial.remaining_days > 0
                                                    ? trial.remaining_days
                                                    : 0}
                                            </span>
                                            <span className="text-sm text-slate-600 dark:text-slate-400">
                                                jours restants
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* 12 cartes Vue d'ensemble */}
                        <div className="dashboard-section mb-12">
                            <h2 className="mb-4 text-xl font-semibold text-slate-800 dark:text-white">
                                Vue d'ensemble
                            </h2>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                <StatCard
                                    title="Produits"
                                    value={stats.products_count}
                                    icon={Package}
                                    trend={stats.growth_percent}
                                    description="en catalogue"
                                />
                                <StatCard
                                    title="Commandes"
                                    value={stats.orders_count}
                                    icon={ShoppingCart}
                                    trend={8.3}
                                    description="ce mois"
                                />
                                <StatCard
                                    title="Revenus (CDF)"
                                    value={stats.revenue}
                                    icon={DollarSign}
                                    format="currency"
                                    trend={-2.1}
                                    description="vs mois dernier"
                                />
                                <StatCard
                                    title="Clients"
                                    value={stats.customers_count}
                                    icon={Users}
                                    trend={5.4}
                                    description="nouveaux"
                                />
                                <StatCard
                                    title="Paniers abandonnés"
                                    value={stats.abandoned_carts}
                                    icon={ShoppingBag}
                                    trend={-3.2}
                                    description="à relancer"
                                />
                                <StatCard
                                    title="Stock total"
                                    value={stats.inventory_count}
                                    icon={Box}
                                    description="unités"
                                />
                                <StatCard
                                    title="Panier moyen"
                                    value={avgOrderValue}
                                    icon={Receipt}
                                    format="currency"
                                    description="par commande"
                                />
                                <StatCard
                                    title="En attente"
                                    value={pendingOrders}
                                    icon={Clock}
                                    description="commandes"
                                />
                                <StatCard
                                    title="Taux de conversion"
                                    value={conversionRate}
                                    icon={Percent}
                                    format="percent"
                                    description="visiteurs → clients"
                                />
                                <StatCard
                                    title="Retours"
                                    value={returnRate}
                                    icon={Truck}
                                    format="percent"
                                    description="taux de retour"
                                />
                                <StatCard
                                    title="Ruptures"
                                    value={outOfStock}
                                    icon={Ban}
                                    description="produits épuisés"
                                />
                                <StatCard
                                    title="Avis positifs"
                                    value={
                                        stats.revenue > 0
                                            ? Math.round(stats.revenue * 0.05)
                                            : 0
                                    }
                                    icon={ThumbsUp}
                                    description="ce mois"
                                />
                            </div>
                        </div>

                        {/* 8 actions rapides animées */}
                        <div className="dashboard-section mb-12">
                            <h2 className="mb-4 text-xl font-semibold text-slate-800 dark:text-white">
                                Actions rapides
                            </h2>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
                                <QuickActionCard
                                    href={tenant.admin_url}
                                    icon={Rocket}
                                    label="Gérer ma boutique"
                                    external
                                />
                                <QuickActionCard
                                    href={route('vendor.configure')}
                                    icon={Settings}
                                    label="Paramètres"
                                />
                                <QuickActionCard
                                    href={tenant.url}
                                    icon={Globe}
                                    label="Voir le site"
                                    external
                                />
                                <QuickActionCard
                                    href={route('vendor.payment')}
                                    icon={CreditCard}
                                    label="Abonnement"
                                />
                                <QuickActionCard
                                    href={`${tenant.admin_url}/produits/create`}
                                    icon={PenLine}
                                    label="Nouveau produit"
                                    external
                                />
                                <QuickActionCard
                                    href={`${tenant.admin_url}/commandes`}
                                    icon={ClipboardList}
                                    label="Commandes"
                                    external
                                />
                                <QuickActionCard
                                    href={`${tenant.admin_url}/clients`}
                                    icon={Users}
                                    label="Clients"
                                    external
                                />
                                <QuickActionCard
                                    href={`${tenant.admin_url}/statistiques`}
                                    icon={BarChart3}
                                    label="Statistiques"
                                    external
                                />
                            </div>
                        </div>

                        {/* Produits récents */}
                        <div className="dashboard-section mb-12">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
                                    Produits récents
                                </h2>
                                <Link
                                    href={`${tenant.admin_url}/produits`}
                                    className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                                >
                                    Voir tous les produits
                                </Link>
                            </div>
                            <Card className="border-slate-200 dark:border-slate-700">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-25">
                                                Image
                                            </TableHead>
                                            <TableHead>Nom</TableHead>
                                            <TableHead>Prix</TableHead>
                                            <TableHead>Stock</TableHead>
                                            <TableHead>Statut</TableHead>
                                            <TableHead className="text-right">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {recentProducts.map((product) => (
                                            <TableRow key={product.id}>
                                                <TableCell>
                                                    <img
                                                        src={product.image}
                                                        alt={product.nom}
                                                        className="h-12 w-12 rounded-lg object-cover"
                                                    />
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {product.nom}
                                                </TableCell>
                                                <TableCell>
                                                    {new Intl.NumberFormat(
                                                        'fr-CD',
                                                        {
                                                            style: 'currency',
                                                            currency: 'CDF',
                                                        },
                                                    ).format(product.prix)}
                                                </TableCell>
                                                <TableCell>
                                                    <span
                                                        className={
                                                            product.stock > 0
                                                                ? 'text-emerald-600'
                                                                : 'text-red-600'
                                                        }
                                                    >
                                                        {product.stock}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={
                                                            product.statut ===
                                                            'publie'
                                                                ? 'border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-400'
                                                                : 'border-slate-300 text-slate-700 dark:border-slate-700 dark:text-slate-400'
                                                        }
                                                    >
                                                        {product.statut ===
                                                        'publie'
                                                            ? 'Publié'
                                                            : 'Brouillon'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        asChild
                                                    >
                                                        <a
                                                            href={
                                                                product.edit_url
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <PenLine className="h-4 w-4" />
                                                        </a>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            handleDeleteProduct(
                                                                product.id,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {recentProducts.length === 0 && (
                                            <TableRow>
                                                <TableCell
                                                    colSpan={6}
                                                    className="py-6 text-center text-muted-foreground"
                                                >
                                                    Aucun produit pour le moment
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </Card>
                        </div>

                        {/* Plans : un bloc par plan */}
                        <div className="dashboard-section mb-12">
                            <h2 className="mb-4 text-xl font-semibold text-slate-800 dark:text-white">
                                Plans disponibles
                            </h2>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {Object.entries(allPlansFeatures).map(
                                    ([planName, features]) => {
                                        const isCurrentPlan =
                                            (tenant.plan?.name ?? 'gratuit') ===
                                            planName;

                                        return (
                                            <Card
                                                key={planName}
                                                className={`relative overflow-hidden transition-all hover:shadow-lg ${
                                                    isCurrentPlan
                                                        ? 'border-emerald-400 bg-emerald-50/50 dark:border-emerald-600 dark:bg-emerald-950/30'
                                                        : 'border-slate-200 dark:border-slate-700'
                                                }`}
                                            >
                                                {isCurrentPlan && (
                                                    <div className="absolute top-0 right-0 rounded-bl-xl bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                                                        Actif
                                                    </div>
                                                )}
                                                <CardHeader>
                                                    <CardTitle className="text-lg font-bold text-slate-800 capitalize dark:text-white">
                                                        {planName}
                                                    </CardTitle>
                                                    <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                                                        {features
                                                            .slice(0, 3)
                                                            .join(', ')}
                                                        ...
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    <ul className="space-y-2">
                                                        {features
                                                            .slice(0, 5)
                                                            .map((f, i) => (
                                                                <li
                                                                    key={i}
                                                                    className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"
                                                                >
                                                                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                                                                    {f}
                                                                </li>
                                                            ))}
                                                        {features.length >
                                                            5 && (
                                                            <li className="text-xs text-slate-400 dark:text-slate-500">
                                                                +
                                                                {features.length -
                                                                    5}{' '}
                                                                autres
                                                                fonctionnalités
                                                            </li>
                                                        )}
                                                    </ul>
                                                </CardContent>
                                                <CardFooter>
                                                    {isCurrentPlan ? (
                                                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                            Votre plan
                                                        </Badge>
                                                    ) : (
                                                        <Button
                                                            asChild
                                                            size="sm"
                                                            className="w-full bg-emerald-600 hover:bg-emerald-700"
                                                        >
                                                            <Link
                                                                href={route(
                                                                    'vendor.payment',
                                                                )}
                                                            >
                                                                <Sparkles className="mr-2 h-4 w-4" />
                                                                Choisir
                                                            </Link>
                                                        </Button>
                                                    )}
                                                </CardFooter>
                                            </Card>
                                        );
                                    },
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

function StatCard({
    title,
    value,
    icon: Icon,
    trend,
    description,
    format = 'number',
}: {
    title: string;
    value: number;
    icon: React.ElementType;
    trend?: number;
    description?: string;
    format?: 'number' | 'currency' | 'percent';
}) {
    const formattedValue =
        format === 'currency'
            ? new Intl.NumberFormat('fr-CD', {
                  style: 'currency',
                  currency: 'CDF',
              }).format(value)
            : format === 'percent'
              ? value.toFixed(1) + '%'
              : new Intl.NumberFormat('fr-FR').format(value);

    return (
        <Card className="dashboard-card border-slate-200 bg-white p-5 transition-all hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-emerald-700 dark:hover:shadow-emerald-900/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {title}
                </CardTitle>
                <Icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {formattedValue}
                </div>
                {trend !== undefined && (
                    <p className="mt-1 flex items-center text-xs">
                        {trend >= 0 ? (
                            <ArrowUpRight className="mr-1 h-3 w-3 text-emerald-500" />
                        ) : (
                            <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
                        )}
                        <span
                            className={
                                trend >= 0 ? 'text-emerald-600' : 'text-red-600'
                            }
                        >
                            {Math.abs(trend)}%
                        </span>
                        {description && (
                            <span className="ml-1 text-slate-500">
                                {description}
                            </span>
                        )}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

function QuickActionCard({
    href,
    icon: Icon,
    label,
    external = false,
}: {
    href: string;
    icon: React.ElementType;
    label: string;
    external?: boolean;
}) {
    return (
        <motion.a
            href={href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="dashboard-card group flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-emerald-700 dark:hover:shadow-emerald-900/20"
        >
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600 transition-colors group-hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400">
                <Icon className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {label}
            </span>
        </motion.a>
    );
}
