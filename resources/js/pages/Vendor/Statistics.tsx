/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/Pages/Vendor/Statistics.tsx
import { Head, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    BarChart3,
    TrendingUp,
    Package,
    ShoppingCart,
    DollarSign,
    Users,
    Sparkles,
    Lock,
    ArrowUpRight,
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend,
} from 'recharts';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { VendorSidebar } from '@/components/VendorSidebar';
import { cn } from '@/lib/utils';

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

interface Props {
    tenant: Tenant;
    salesOverTime: { month: string; revenue: number; orders: number }[];
    topProducts: {
        id: number;
        nom: string;
        total_sales: number;
        quantity: number;
    }[];
    categoryBreakdown: { name: string; percentage: number }[];
    customerMetrics: {
        total_customers: number;
        new_this_month: number;
        retention_rate: number;
    };
    planAllowsAdvancedStats: boolean; // selon le plan
}

export default function VendorStatistics({
    tenant,
    salesOverTime,
    topProducts,
    categoryBreakdown,
    customerMetrics,
    planAllowsAdvancedStats,
}: Props) {
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
                <div className="min-h-screen bg-white dark:bg-slate-950">
                    <Head title={`Statistiques - ${tenant.raison_sociale}`} />
                    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                        <div className="mb-8 flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                                    Statistiques
                                </h1>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Aperçu de vos performances
                                </p>
                            </div>
                            {!planAllowsAdvancedStats && (
                                <Badge
                                    variant="outline"
                                    className="gap-1 border-amber-200 text-amber-700 dark:border-amber-800 dark:text-amber-400"
                                >
                                    <Lock className="h-4 w-4" /> Certaines
                                    données sont limitées à votre plan
                                </Badge>
                            )}
                        </div>

                        {/* Cartes de résumé */}
                        <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <StatSummaryCard
                                icon={DollarSign}
                                label="Revenu total (CDF)"
                                value={salesOverTime.reduce(
                                    (sum, x) => sum + x.revenue,
                                    0,
                                )}
                                format="currency"
                            />
                            <StatSummaryCard
                                icon={ShoppingCart}
                                label="Commandes"
                                value={salesOverTime.reduce(
                                    (sum, x) => sum + x.orders,
                                    0,
                                )}
                            />
                            <StatSummaryCard
                                icon={Users}
                                label="Clients"
                                value={customerMetrics.total_customers}
                            />
                            <StatSummaryCard
                                icon={TrendingUp}
                                label="Produits vendus"
                                value={topProducts.reduce(
                                    (sum, x) => sum + x.quantity,
                                    0,
                                )}
                            />
                        </div>

                        {/* Graphique d'évolution (accessible à tous) */}
                        <Card className="mb-12 border-slate-200 dark:border-slate-700">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                                    <TrendingUp className="h-5 w-5" /> Évolution
                                    des ventes
                                </CardTitle>
                                <CardDescription>
                                    Revenu et commandes par mois
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <AreaChart data={salesOverTime}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            className="stroke-slate-200 dark:stroke-slate-700"
                                        />
                                        <XAxis
                                            dataKey="month"
                                            className="text-xs"
                                        />
                                        <YAxis className="text-xs" />
                                        <Tooltip />
                                        <Area
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#10b981"
                                            fill="#10b98120"
                                            name="Revenu (CDF)"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="orders"
                                            stroke="#6366f1"
                                            fill="#6366f120"
                                            name="Commandes"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Top produits (accessible à tous) */}
                        <Card className="mb-12 border-slate-200 dark:border-slate-700">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                                    <Package className="h-5 w-5" /> Meilleurs
                                    produits
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-700">
                                            <tr>
                                                <th className="py-2 pr-4">
                                                    Produit
                                                </th>
                                                <th className="py-2 pr-4 text-right">
                                                    Ventes
                                                </th>
                                                <th className="py-2 text-right">
                                                    Quantité
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {topProducts.map((p) => (
                                                <tr
                                                    key={p.id}
                                                    className="border-b border-slate-50 dark:border-slate-800"
                                                >
                                                    <td className="py-3 pr-4 font-medium text-slate-800 dark:text-slate-200">
                                                        {p.nom}
                                                    </td>
                                                    <td className="py-3 pr-4 text-right text-emerald-600 dark:text-emerald-400">
                                                        {new Intl.NumberFormat(
                                                            'fr-CD',
                                                            {
                                                                style: 'currency',
                                                                currency: 'CDF',
                                                            },
                                                        ).format(p.total_sales)}
                                                    </td>
                                                    <td className="py-3 text-right text-slate-600 dark:text-slate-300">
                                                        {p.quantity}
                                                    </td>
                                                </tr>
                                            ))}
                                            {topProducts.length === 0 && (
                                                <tr>
                                                    <td
                                                        colSpan={3}
                                                        className="py-6 text-center text-slate-400"
                                                    >
                                                        Aucune donnée disponible
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Bloc avancé (conditionnel selon le plan) */}
                        {planAllowsAdvancedStats ? (
                            <Card className="mb-12 border-slate-200 dark:border-slate-700">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                                        <Sparkles className="h-5 w-5" /> Analyse
                                        avancée
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                                        <div>
                                            <h4 className="mb-4 text-sm font-semibold text-slate-600 dark:text-slate-400">
                                                Répartition par catégorie
                                            </h4>
                                            <ResponsiveContainer
                                                width="100%"
                                                height={200}
                                            >
                                                <BarChart
                                                    data={categoryBreakdown}
                                                >
                                                    <CartesianGrid
                                                        strokeDasharray="3 3"
                                                        className="stroke-slate-200 dark:stroke-slate-700"
                                                    />
                                                    <XAxis
                                                        dataKey="name"
                                                        className="text-xs"
                                                    />
                                                    <YAxis className="text-xs" />
                                                    <Tooltip />
                                                    <Bar
                                                        dataKey="percentage"
                                                        fill="#10b981"
                                                        radius={[4, 4, 0, 0]}
                                                    />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="rounded-xl bg-emerald-50 p-4 dark:bg-emerald-900/10">
                                                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                                                    Taux de rétention :{' '}
                                                    {
                                                        customerMetrics.retention_rate
                                                    }
                                                    %
                                                </p>
                                                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                                                    Nouveaux clients ce mois :{' '}
                                                    {
                                                        customerMetrics.new_this_month
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="mb-12 border-dashed border-slate-300 bg-slate-50/50 dark:border-slate-600 dark:bg-slate-900/50">
                                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                    <Lock className="mb-4 h-12 w-12 text-slate-300 dark:text-slate-600" />
                                    <h3 className="text-lg font-semibold text-slate-500 dark:text-slate-400">
                                        Fonctionnalité avancée
                                    </h3>
                                    <p className="mt-2 max-w-md text-sm text-slate-400 dark:text-slate-500">
                                        Passez à un plan supérieur pour
                                        débloquer les analyses avancées, la
                                        répartition par catégorie et les
                                        indicateurs de rétention.
                                    </p>
                                    <Button className="mt-6 bg-emerald-600 hover:bg-emerald-700">
                                        <a
                                            href={route('vendor.payment')}
                                            className="inline-flex items-center gap-2"
                                        >
                                            <Sparkles className="h-4 w-4" />
                                            Changer de plan
                                            <ArrowUpRight className="h-4 w-4" />
                                        </a>
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

function StatSummaryCard({
    icon: Icon,
    label,
    value,
    format = 'number',
}: {
    icon: React.ElementType;
    label: string;
    value: number;
    format?: 'number' | 'currency';
}) {
    const formattedValue =
        format === 'currency'
            ? new Intl.NumberFormat('fr-CD', {
                  style: 'currency',
                  currency: 'CDF',
              }).format(value)
            : new Intl.NumberFormat('fr-FR').format(value);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="border-slate-200 transition-shadow hover:shadow-md dark:border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        {label}
                    </CardTitle>
                    <Icon className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {formattedValue}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
