/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Head, router, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Eye,
    Clock,
    Percent,
    TrendingUp,
    Smartphone,
    Monitor,
    Tablet,
    Globe,
    Activity,
    ArrowUpRight,
    Sparkles,
    BarChart3,
    Zap,
    DollarSign,
    ShoppingCart,
    Package,
    MapPin,
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    Link as LinkIcon,
    Loader2,
    RefreshCw,
    AlertCircle,
    CheckCircle2,
    XCircle,
    TrendingDown,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import CountUp from 'react-countup';
import {
    FaChrome,
    FaEdge,
    FaFacebook,
    FaFirefox,
    FaInstagram,
    FaSafari,
    FaTiktok,
    FaTwitter,
} from 'react-icons/fa';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    LineChart,
    Line,
    ComposedChart,
} from 'recharts';

import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { VendorSidebar } from '@/components/VendorSidebar';
import { useEcho } from '@/hooks/use-echo';
import { cn } from '@/lib/utils';
import type { Tenant } from '@/types/tenants/products/vendor/tenant';

interface RevenueStats {
    today_revenue: number;
    weekly_revenue: number;
    monthly_revenue: number;
    yearly_revenue: number;
    growth_rate: number;
    average_order_value: number;
    revenue_chart: Array<{ date: string; revenue: number; orders: number }>;
}

interface ConversionFunnel {
    visitors: number;
    product_views: number;
    add_to_cart: number;
    begin_checkout: number;
    purchases: number;
    losses: {
        visitors_to_views: number;
        views_to_cart: number;
        cart_to_checkout: number;
        checkout_to_purchase: number;
    };
}

interface TopProduct {
    product_id: string;
    views?: number;
    sold?: number;
}

interface TrafficSource {
    source: string;
    visits: number;
}

interface GeographicStat {
    country: string;
    visits: number;
    city?: string;
}

interface RealTimeStats {
    active_visitors: number;
    recent_pages: Array<{ path: string; visited_at: string }>;
}

interface VisitorStats {
    total_visits: number;
    unique_visitors: number;
    avg_duration: number;
    bounce_rate: number;
    top_pages: Array<{ path: string; views: number }>;
    devices: Array<{ device: string; count: number }>;
    browsers: Array<{ browser: string; count: number }>;
    daily: Array<{ date: string; visits: number; uniques: number }>;
}

interface AnalyticsProps {
    tenant: Tenant;
    period: string;
    visitorStats: VisitorStats;
    revenueStats: RevenueStats;
    conversionFunnel: ConversionFunnel;
    topProducts: {
        top_viewed: TopProduct[];
        top_sold: TopProduct[];
    };
    trafficSources: Array<{ source: string; visits: number }>;
    geographicStats: {
        countries: GeographicStat[];
        cities: GeographicStat[];
    };
    realTimeStats: RealTimeStats;
    aiInsights: string[];
}

export default function AnalyticsDashboard(props: AnalyticsProps) {
    const {
        tenant,
        period: initialPeriod,
        visitorStats,
        revenueStats,
        conversionFunnel,
        topProducts,
        trafficSources,
        geographicStats,
        realTimeStats: initialRealTime,
        aiInsights,
    } = props;

    const [period, setPeriod] = useState<'week' | 'month' | 'year'>(
        initialPeriod as any,
    );
    const [realTime, setRealTime] = useState(initialRealTime);
    const [loading, setLoading] = useState(false);
    // Écouter les événements temps réel via Laravel Echo
    useEcho(`tenant.${tenant.id}`, 'VisitorActivity', (event) => {
        setRealTime((prev) => ({
            active_visitors: event.active_visitors,
            recent_pages: [event.page, ...prev.recent_pages.slice(0, 9)],
        }));
    });

    const refreshData = () => {
        setLoading(true);
        router.reload({
            only: [
                'visitorStats',
                'revenueStats',
                'conversionFunnel',
                'trafficSources',
                'geographicStats',
                'realTimeStats',
                'aiInsights',
            ],
        });
        setTimeout(() => setLoading(false), 1000);
    };

    // Couleurs
    const COLORS = {
        primary: '#10b981',
        secondary: '#64748b',
        accent: '#059669',
        highlight: '#14b8a6',
        chart: [
            '#10b981',
            '#14b8a6',
            '#06b6d4',
            '#8b5cf6',
            '#f59e0b',
            '#ef4444',
            '#3b82f6',
        ],
    };

    // Formatage
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('fr-CD', {
            style: 'currency',
            currency: 'CDF',
        }).format(value);
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getDeviceIcon = (device: string) => {
        const d = device.toLowerCase();

        if (d.includes('mobile')) {
            return <Smartphone className="h-4 w-4" />;
        }

        if (d.includes('tablet')) {
            return <Tablet className="h-4 w-4" />;
        }

        return <Monitor className="h-4 w-4" />;
    };

    const getBrowserIcon = (browser: string) => {
        const b = browser.toLowerCase();

        if (b.includes('chrome')) {
            return <FaChrome className="h-4 w-4" />;
        }

        if (b.includes('firefox')) {
            return <FaFirefox className="h-4 w-4" />;
        }

        if (b.includes('edge')) {
            return <FaEdge className="h-4 w-4" />;
        }

        if (b.includes('safari')) {
            return <FaSafari className="h-4 w-4" />;
        }

        return <Globe className="h-4 w-4" />;
    };

    const getSourceIcon = (source: string) => {
        const s = source.toLowerCase();

        if (s.includes('facebook')) {
            return <FaFacebook className="h-4 w-4" />;
        }

        if (s.includes('instagram')) {
            return <FaInstagram className="h-4 w-4" />;
        }

        if (s.includes('tiktok')) {
            return <FaTiktok className="h-4 w-4" />;
        }

        if (s.includes('twitter')) {
            return <FaTwitter className="h-4 w-4" />;
        }

        if (s.includes('google')) {
            return <Globe className="h-4 w-4" />;
        }

        return <LinkIcon className="h-4 w-4" />;
    };

    // Extraire les données de visitorStats
    const { top_pages, devices, browsers, daily } = visitorStats;

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
                <Head title={`Analytique - ${tenant.raison_sociale}`} />

                <div className="relative min-h-screen overflow-hidden bg-[#f8fafc] dark:bg-[#020617]">
                    {/* Glow décoratif */}
                    <div className="absolute top-0 left-0 h-125 w-125 rounded-full bg-emerald-500/10 blur-[120px]" />
                    <div className="absolute right-0 bottom-0 h-125 w-125 rounded-full bg-cyan-500/10 blur-[120px]" />

                    <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                        {/* Header avec titre et filtres */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative mb-10 overflow-hidden rounded-[32px] border border-white/20 bg-white/70 p-8 backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-900/70"
                        >
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.18),transparent_35%)]" />
                            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                        <Sparkles className="h-3.5 w-3.5" />
                                        Analytics Premium
                                    </div>
                                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                                        Tableau de bord analytique
                                    </h1>
                                    <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400">
                                        Mesures avancées du trafic, conversions,
                                        revenus et insights IA pour optimiser
                                        votre boutique.
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={refreshData}
                                        disabled={loading}
                                        className="rounded-xl border-slate-200/70 bg-white/50 backdrop-blur-sm"
                                    >
                                        {loading ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <RefreshCw className="h-4 w-4" />
                                        )}
                                    </Button>
                                    <Tabs
                                        value={period}
                                        onValueChange={(v) =>
                                            setPeriod(v as any)
                                        }
                                    >
                                        <TabsList className="h-12 rounded-2xl border border-slate-200/70 bg-white/70 p-1 shadow-sm backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/70">
                                            <TabsTrigger
                                                value="week"
                                                className="rounded-xl"
                                            >
                                                7 jours
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="month"
                                                className="rounded-xl"
                                            >
                                                30 jours
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="year"
                                                className="rounded-xl"
                                            >
                                                12 mois
                                            </TabsTrigger>
                                        </TabsList>
                                    </Tabs>
                                </div>
                            </div>
                        </motion.div>

                        {/* Real-time bar */}
                        <div className="mb-8 flex items-center justify-between rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-6 py-3 backdrop-blur-sm">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500 opacity-75"></div>
                                    <div className="relative h-3 w-3 rounded-full bg-emerald-500"></div>
                                </div>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {realTime.active_visitors} visiteurs actifs
                                    maintenant
                                </span>
                            </div>
                            <div className="flex gap-3 text-xs text-slate-500">
                                {realTime.recent_pages
                                    .slice(0, 3)
                                    .map((page, idx) => (
                                        <span
                                            key={idx}
                                            className="max-w-37.5 truncate"
                                        >
                                            {page.path}
                                        </span>
                                    ))}
                            </div>
                        </div>

                        {/* KPIs revenus et conversion */}
                        <div className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                            {/* Revenus aujourd'hui */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05 }}
                            >
                                <Card className="group relative overflow-hidden rounded-[28px] border border-white/20 bg-white/70 backdrop-blur-2xl transition-all hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/70">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-sm text-slate-500">
                                                    Revenus aujourd'hui
                                                </p>
                                                <h3 className="mt-3 text-3xl font-black text-slate-900 dark:text-white">
                                                    <CountUp
                                                        end={
                                                            revenueStats.today_revenue
                                                        }
                                                        duration={1}
                                                        suffix=" FC"
                                                    />
                                                </h3>
                                            </div>
                                            <div className="rounded-2xl bg-linear-to-br from-emerald-500 to-teal-500 p-3 text-white shadow-lg">
                                                <DollarSign className="h-6 w-6" />
                                            </div>
                                        </div>
                                        <div className="mt-4 flex items-center gap-2">
                                            <Badge
                                                variant="outline"
                                                className="rounded-full bg-emerald-500/10 text-emerald-600"
                                            >
                                                <TrendingUp className="mr-1 h-3 w-3" />
                                                {revenueStats.growth_rate > 0
                                                    ? '+'
                                                    : ''}
                                                {revenueStats.growth_rate}%
                                            </Badge>
                                            <span className="text-xs text-slate-500">
                                                vs période précédente
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Panier moyen */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <Card className="group relative overflow-hidden rounded-[28px] border border-white/20 bg-white/70 backdrop-blur-2xl transition-all hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/70">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-sm text-slate-500">
                                                    Panier moyen
                                                </p>
                                                <h3 className="mt-3 text-3xl font-black text-slate-900 dark:text-white">
                                                    <CountUp
                                                        end={
                                                            revenueStats.average_order_value
                                                        }
                                                        duration={1}
                                                        suffix=" FC"
                                                    />
                                                </h3>
                                            </div>
                                            <div className="rounded-2xl bg-linear-to-br from-cyan-500 to-blue-500 p-3 text-white shadow-lg">
                                                <ShoppingCart className="h-6 w-6" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Taux de conversion global */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                            >
                                <Card className="group relative overflow-hidden rounded-[28px] border border-white/20 bg-white/70 backdrop-blur-2xl transition-all hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/70">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-sm text-slate-500">
                                                    Conversion globale
                                                </p>
                                                <h3 className="mt-3 text-3xl font-black text-slate-900 dark:text-white">
                                                    {conversionFunnel.visitors >
                                                    0
                                                        ? (
                                                              (conversionFunnel.purchases /
                                                                  conversionFunnel.visitors) *
                                                              100
                                                          ).toFixed(1)
                                                        : 0}
                                                    %
                                                </h3>
                                            </div>
                                            <div className="rounded-2xl bg-linear-to-br from-purple-500 to-pink-500 p-3 text-white shadow-lg">
                                                <Percent className="h-6 w-6" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Visiteurs uniques */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Card className="group relative overflow-hidden rounded-[28px] border border-white/20 bg-white/70 backdrop-blur-2xl transition-all hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/70">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-sm text-slate-500">
                                                    Visiteurs uniques
                                                </p>
                                                <h3 className="mt-3 text-3xl font-black text-slate-900 dark:text-white">
                                                    <CountUp
                                                        end={
                                                            visitorStats.unique_visitors
                                                        }
                                                        duration={1}
                                                    />
                                                </h3>
                                            </div>
                                            <div className="rounded-2xl bg-linear-to-br from-emerald-500 to-teal-500 p-3 text-white shadow-lg">
                                                <Users className="h-6 w-6" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>

                        {/* Graphique revenus */}
                        <Card className="mb-8 overflow-hidden rounded-[32px] border border-white/20 bg-white/70 backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-900/70">
                            <div className="border-b border-slate-200/50 p-6 dark:border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-500">
                                        <DollarSign className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                            Évolution des revenus
                                        </h3>
                                        <p className="text-sm text-slate-500">
                                            Tendance des ventes sur la période
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <CardContent className="p-6">
                                <ResponsiveContainer width="100%" height={350}>
                                    <AreaChart
                                        data={revenueStats.revenue_chart}
                                    >
                                        <defs>
                                            <linearGradient
                                                id="revenueGradient"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor="#10b981"
                                                    stopOpacity={0.4}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="#10b981"
                                                    stopOpacity={0}
                                                />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid
                                            strokeDasharray="4 4"
                                            stroke="rgba(148,163,184,0.12)"
                                        />
                                        <XAxis
                                            dataKey="date"
                                            stroke="#94a3b8"
                                        />
                                        <YAxis
                                            stroke="#94a3b8"
                                            tickFormatter={(v) =>
                                                formatCurrency(v)
                                            }
                                        />
                                        <RechartsTooltip
                                            formatter={(value) =>
                                                formatCurrency(value as number)
                                            }
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#10b981"
                                            strokeWidth={3}
                                            fill="url(#revenueGradient)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Funnel de conversion */}
                        <div className="mb-8 grid gap-6 lg:grid-cols-2">
                            <Card className="rounded-[32px] border border-white/20 bg-white/70 backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-900/70">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold">
                                        Tunnel de conversion
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {/* Dans la carte Tunnel de conversion */}
                                    {[
                                        {
                                            label: 'Visiteurs',
                                            value: conversionFunnel.visitors,
                                            color: 'bg-slate-500',
                                        },
                                        {
                                            label: 'Pages produits',
                                            value: conversionFunnel.product_views,
                                            color: 'bg-blue-500',
                                        },
                                        {
                                            label: 'Ajouts panier',
                                            value: conversionFunnel.add_to_cart,
                                            color: 'bg-cyan-500',
                                        },
                                        {
                                            label: 'Checkout',
                                            value: conversionFunnel.begin_checkout,
                                            color: 'bg-teal-500',
                                        },
                                        {
                                            label: 'Achats',
                                            value: conversionFunnel.purchases,
                                            color: 'bg-emerald-500',
                                        },
                                    ].map((step, idx) => {
                                        const percent =
                                            conversionFunnel.visitors > 0
                                                ? (step.value /
                                                      conversionFunnel.visitors) *
                                                  100
                                                : 0;
                                        const lossValues = [
                                            conversionFunnel.losses
                                                .visitors_to_views,
                                            conversionFunnel.losses
                                                .views_to_cart,
                                            conversionFunnel.losses
                                                .cart_to_checkout,
                                            conversionFunnel.losses
                                                .checkout_to_purchase,
                                        ];

                                        return (
                                            <div key={idx}>
                                                <div className="mb-1 flex justify-between text-sm">
                                                    <span className="font-medium text-slate-700 dark:text-slate-300">
                                                        {step.label}
                                                    </span>
                                                    <span className="text-slate-500">
                                                        {step.value}
                                                    </span>
                                                </div>
                                                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                                    <div
                                                        className={`h-full rounded-full ${step.color}`}
                                                        style={{
                                                            width: `${percent}%`,
                                                        }}
                                                    />
                                                </div>
                                                {idx < 4 && (
                                                    <div className="mt-1 text-right text-xs text-red-500">
                                                        Perte: {lossValues[idx]}
                                                        %
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                    {/* <div className="space-y-5">
                                        {[
                                            {
                                                label: 'Visiteurs',
                                                value: conversionFunnel.visitors,
                                                color: 'bg-slate-500',
                                            },
                                            {
                                                label: 'Pages produits',
                                                value: conversionFunnel.product_views,
                                                color: 'bg-blue-500',
                                            },
                                            {
                                                label: 'Ajouts panier',
                                                value: conversionFunnel.add_to_cart,
                                                color: 'bg-cyan-500',
                                            },
                                            {
                                                label: 'Checkout',
                                                value: conversionFunnel.begin_checkout,
                                                color: 'bg-teal-500',
                                            },
                                            {
                                                label: 'Achats',
                                                value: conversionFunnel.purchases,
                                                color: 'bg-emerald-500',
                                            },
                                        ].map((step, idx) => {
                                            const percent =
                                                conversionFunnel.visitors > 0
                                                    ? (step.value /
                                                          conversionFunnel.visitors) *
                                                      100
                                                    : 0;

                                            return (
                                                <div key={idx}>
                                                    <div className="mb-1 flex justify-between text-sm">
                                                        <span className="font-medium text-slate-700 dark:text-slate-300">
                                                            {step.label}
                                                        </span>
                                                        <span className="text-slate-500">
                                                            {step.value}
                                                        </span>
                                                    </div>
                                                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                                        <div
                                                            className={`h-full rounded-full ${step.color}`}
                                                            style={{
                                                                width: `${percent}%`,
                                                            }}
                                                        />
                                                    </div>
                                                    {idx < 4 && (
                                                        <div className="mt-1 text-right text-xs text-red-500">
                                                            Perte:{' '}
                                                            {lossValues[idx]}%
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div> */}
                                </CardContent>
                            </Card>

                            {/* Sources de trafic */}
                            <Card className="rounded-[32px] border border-white/20 bg-white/70 backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-900/70">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold">
                                        Sources de trafic
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {trafficSources.map((source, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center justify-between"
                                            >
                                                <div className="flex items-center gap-3">
                                                    {getSourceIcon(
                                                        source.source,
                                                    )}
                                                    <span className="text-sm text-slate-700 dark:text-slate-300">
                                                        {source.source}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                                                        {source.visits}
                                                    </span>
                                                    <div className="h-2 w-24 rounded-full bg-slate-100 dark:bg-slate-800">
                                                        <div
                                                            className="h-full rounded-full bg-emerald-500"
                                                            style={{
                                                                width: `${(source.visits / trafficSources.reduce((acc, s) => acc + s.visits, 0)) * 100}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Top produits et géographie */}
                        <div className="mb-8 grid gap-6 lg:grid-cols-2">
                            <Card className="rounded-[32px] border border-white/20 bg-white/70 backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-900/70">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold">
                                        Produits les plus vendus
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {topProducts.top_sold.map(
                                            (product, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800"
                                                >
                                                    <span className="max-w-50 truncate text-sm">
                                                        Produit{' '}
                                                        {product.product_id.slice(
                                                            0,
                                                            8,
                                                        )}
                                                    </span>
                                                    <span className="font-semibold text-emerald-600">
                                                        {product.sold} vendus
                                                    </span>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="rounded-[32px] border border-white/20 bg-white/70 backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-900/70">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold">
                                        Géolocalisation
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {geographicStats.countries.map(
                                            (country, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center justify-between"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-4 w-4 text-emerald-500" />
                                                        <span className="text-sm">
                                                            {country.country}
                                                        </span>
                                                    </div>
                                                    <span className="text-sm font-semibold">
                                                        {country.visits} visites
                                                    </span>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* AI Insights */}
                        <Card className="mb-8 overflow-hidden rounded-[32px] border border-amber-200/50 bg-amber-50/50 backdrop-blur-2xl dark:border-amber-900/30 dark:bg-amber-950/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                                    <Sparkles className="h-5 w-5" />
                                    Insights IA
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {aiInsights.map((insight, idx) => (
                                        <li
                                            key={idx}
                                            className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-200"
                                        >
                                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                                            <span>{insight}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Graphique évolution des visites */}
                        <Card className="mb-8 overflow-hidden rounded-[32px] border border-white/20 bg-white/70 backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-900/70">
                            <div className="border-b border-slate-200/50 p-6 dark:border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-500">
                                        <BarChart3 className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                            Évolution des visites
                                        </h3>
                                        <p className="text-sm text-slate-500">
                                            Tendances des visiteurs et sessions
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <CardContent className="p-6">
                                <ResponsiveContainer width="100%" height={400}>
                                    <AreaChart data={daily}>
                                        <defs>
                                            <linearGradient
                                                id="colorVisits"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor="#10b981"
                                                    stopOpacity={0.4}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="#10b981"
                                                    stopOpacity={0}
                                                />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid
                                            strokeDasharray="4 4"
                                            stroke="rgba(148,163,184,0.12)"
                                        />
                                        <XAxis
                                            dataKey="date"
                                            stroke="#94a3b8"
                                        />
                                        <YAxis stroke="#94a3b8" />
                                        <RechartsTooltip />
                                        <Area
                                            type="monotone"
                                            dataKey="visits"
                                            stroke="#10b981"
                                            strokeWidth={4}
                                            fill="url(#colorVisits)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Top pages et appareils */}
                        <div className="grid gap-8 lg:grid-cols-2">
                            {/* TOP PAGES */}
                            <Card className="rounded-[32px] border border-white/20 bg-white/70 backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-900/70">
                                <CardContent className="p-6">
                                    <div className="mb-6 flex items-center justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                                Pages populaires
                                            </h3>
                                            <p className="text-sm text-slate-500">
                                                Les pages les plus consultées
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {top_pages
                                            ?.slice(0, 5)
                                            .map((page, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/70 p-4 transition-all hover:bg-slate-100/70 dark:border-slate-800 dark:bg-slate-800/40"
                                                >
                                                    <div>
                                                        <p className="font-medium text-slate-900 dark:text-white">
                                                            {page.path}
                                                        </p>
                                                    </div>
                                                    <div className="rounded-xl bg-emerald-500/10 px-3 py-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                                        {page.views}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* DEVICES */}
                            <Card className="rounded-[32px] border border-white/20 bg-white/70 shadow-xl backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-900/70">
                                <CardContent className="p-6">
                                    <div className="mb-6">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                            Répartition appareils
                                        </h3>
                                        <p className="text-sm text-slate-500">
                                            Utilisation selon les appareils
                                        </p>
                                    </div>
                                    <ResponsiveContainer
                                        width="100%"
                                        height={280}
                                    >
                                        <PieChart>
                                            <Pie
                                                data={devices}
                                                dataKey="count"
                                                nameKey="device"
                                                innerRadius={70}
                                                outerRadius={100}
                                                paddingAngle={3}
                                            >
                                                {devices?.map((_, index) => (
                                                    <Cell
                                                        key={index}
                                                        fill={
                                                            COLORS.chart[
                                                                index %
                                                                    COLORS.chart
                                                                        .length
                                                            ]
                                                        }
                                                    />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="mt-6 grid grid-cols-2 gap-3">
                                        {devices?.map((device, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/40"
                                            >
                                                <div className="text-emerald-500">
                                                    {getDeviceIcon(
                                                        device.device,
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                        {device.device}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {device.count} visites
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* BROWSERS */}
                        <Card className="mt-8 rounded-[32px] border border-white/20 bg-white/70 backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-900/70">
                            <CardContent className="p-6">
                                <div className="mb-6 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                            Navigateurs utilisés
                                        </h3>
                                        <p className="text-sm text-slate-500">
                                            Répartition des visiteurs
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-5">
                                    {browsers?.map((browser, idx) => (
                                        <div key={idx}>
                                            <div className="mb-2 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="text-emerald-500">
                                                        {getBrowserIcon(
                                                            browser.browser,
                                                        )}
                                                    </div>
                                                    <span className="font-medium text-slate-900 dark:text-white">
                                                        {browser.browser}
                                                    </span>
                                                </div>
                                                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                                    {browser.count} visites
                                                </span>
                                            </div>
                                            <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                                <div
                                                    className="h-full rounded-full bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500"
                                                    style={{
                                                        width: `${
                                                            (browser.count /
                                                                browsers.reduce(
                                                                    (acc, b) =>
                                                                        acc +
                                                                        b.count,
                                                                    0,
                                                                )) *
                                                            100
                                                        }%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
