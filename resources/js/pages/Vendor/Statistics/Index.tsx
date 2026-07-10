/* eslint-disable react-hooks/static-components */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Head, router, usePage } from '@inertiajs/react';
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
    Sparkles,
    BarChart3,
    Zap,
    DollarSign,
    ShoppingCart,
    Package,
    MapPin,
    Link as LinkIcon,
    Loader2,
    RefreshCw,
    TrendingDown,
    CreditCard,
    CheckCircle,
    AlertTriangle,
    Brain,
    FileText,
    HomeIcon,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useMemo, useState } from 'react';
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
    Tooltip,
    PolarRadiusAxis,
    PolarGrid,
    PolarAngleAxis,
    Radar,
    RadarChart,
    BarChart,
    Bar,
    LabelList,
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
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VendorSidebar } from '@/components/VendorSidebar';
import { useEcho } from '@/hooks/use-echo';
import { cn } from '@/lib/utils';
import type { Tenant } from '@/types/tenants/products/vendor/tenant';

// Types
interface RevenueStats {
    today_revenue: number;
    weekly_revenue: number;
    monthly_revenue: number;
    yearly_revenue: number;
    growth_rate: number;
    average_order_value: number;
    average_order_value_change?: number;
    revenue_chart: Array<{ date: string; revenue: number; orders: number }>;
}

interface ConversionFunnel {
    visitors: number;
    product_views: number;
    add_to_cart: number;
    begin_checkout: number;
    purchases: number;
    previous_conversion_rate?: number;
    losses: {
        visitors_to_views: number;
        views_to_cart: number;
        cart_to_checkout: number;
        checkout_to_purchase: number;
    };
}

interface VisitorStats {
    total_visits: number;
    unique_visitors: number;
    unique_visitors_change?: number;
    avg_duration: number;
    bounce_rate: number;
    top_pages: Array<{ path: string; views: number }>;
    devices: Array<{ device: string; count: number }>;
    browsers: Array<{ browser: string; count: number }>;
    daily: Array<{ date: string; visits: number; uniques: number }>;
}

interface TopProduct {
    product_id: string;
    product_name?: string; // ajouté pour compatibilité
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
    const [realTime, setRealTime] = useState({
        active_visitors: initialRealTime?.active_visitors ?? 0,
        recent_pages: initialRealTime?.recent_pages ?? [],
    });
    const [loading, setLoading] = useState(false);

    const safeNumber = (value?: number | string | null) => Number(value ?? 0);

    const uniqueVisitors = safeNumber(visitorStats?.unique_visitors);
    const avgDuration = safeNumber(visitorStats?.avg_duration);
    const bounceRate = safeNumber(visitorStats?.bounce_rate);

    const devices = visitorStats?.devices ?? [];
    const browsers = visitorStats?.browsers ?? [];
    const top_pages = visitorStats?.top_pages ?? [];
    const daily = visitorStats?.daily ?? [];

    const totalVisitsFromDevices = devices.reduce((acc, d) => acc + d.count, 0);
    const totalVisits = totalVisitsFromDevices;

    const COLORS = {
        chart: ['#10b981', '#14b8a6', '#06b6d4', '#8b5cf6', '#f59e0b'],
    };

    const chartData = devices.map((d, i) => ({
        ...d,
        fill: COLORS.chart[i % COLORS.chart.length],
        percent: totalVisitsFromDevices
            ? (d.count / totalVisitsFromDevices) * 100
            : 0,
    }));

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const trafficGrowth =
        totalVisits > 0
            ? Math.min(
                  Number(
                      (
                          (uniqueVisitors / Math.max(totalVisits, 1)) *
                          100
                      ).toFixed(1),
                  ),
                  100,
              )
            : 0;

    const activeUsers = Math.max(Math.round(uniqueVisitors * 0.35), 1);
    const estimatedConversion = Math.max(
        Number((100 - bounceRate / 2).toFixed(1)),
        0,
    );

    const stats = [
        {
            title: 'Visites totales',
            value: totalVisits.toLocaleString('fr-FR'),
            icon: Eye,
            growth: `+${Math.min(Number(((totalVisits / Math.max(uniqueVisitors, 1)) * 8).toFixed(1)), 99)}%`,
            positive: true,
        },
        {
            title: 'Visiteurs uniques',
            value: uniqueVisitors.toLocaleString('fr-FR'),
            icon: Users,
            growth: `+${Math.min(Number(((uniqueVisitors / Math.max(totalVisits, 1)) * 100).toFixed(1)), 100)}%`,
            positive: true,
        },
        {
            title: 'Durée moyenne',
            value: formatDuration(avgDuration),
            icon: Clock,
            growth: `+${Math.min(Number((avgDuration / 10).toFixed(1)), 30)}%`,
            positive: true,
        },
        {
            title: 'Taux de rebond',
            value: `${bounceRate.toFixed(1)}%`,
            icon: Percent,
            growth: `-${Math.min(Number((bounceRate / 8).toFixed(1)), 25)}%`,
            positive: false,
        },
    ];

    const steps = [
        { label: 'Visiteurs', value: conversionFunnel.visitors },
        { label: 'Pages produits', value: conversionFunnel.product_views },
        { label: 'Ajouts panier', value: conversionFunnel.add_to_cart },
        { label: 'Checkout', value: conversionFunnel.begin_checkout },
        { label: 'Achats', value: conversionFunnel.purchases },
    ];

    const getPercentage = (index: number) => {
        if (index === 0) {
            return 100;
        }

        const previousValue = steps[index - 1].value;

        return previousValue > 0
            ? Math.round((steps[index].value / previousValue) * 100)
            : 0;
    };

    useEcho(`tenant.${tenant.id}`, 'VisitorActivity', (event: any) => {
        setRealTime((prev) => ({
            active_visitors: event.active_visitors,
            recent_pages: [
                event.page,
                ...(prev.recent_pages || []).slice(0, 9),
            ],
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

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('fr-CD', {
            style: 'currency',
            currency: 'CDF',
        }).format(value);

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

        if (s === 'direct') {
            return <LinkIcon className="h-4 w-4 text-slate-500" />;
        }

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

    const recentPages = realTime.recent_pages ?? [];

    // Fonction utilitaire pour générer des données de tendance synthétiques
    const generateTrendData = (trend: number, points = 6) => {
        const baseValue = 50;
        const direction = trend >= 0 ? 1 : -1;
        const amplitude = Math.min(Math.abs(trend), 30);

        return Array.from({ length: points }, (_, i) => {
            const progress = (i + 1) / points;
            const randomFactor = 0.7 + Math.random() * 0.6;

            return {
                name: `J${i + 1}`,
                value: Math.max(
                    0,
                    baseValue + direction * amplitude * progress * randomFactor,
                ),
            };
        });
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (!active || !payload?.length) {
            return null;
        }

        const data = payload[0]?.payload;

        return (
            <div className="rounded-xl border border-slate-200/60 bg-white/80 p-3 shadow-lg backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-900/80">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {data?.name}
                </p>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {data?.views || data?.count} vues
                </p>
            </div>
        );
    };

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

                <div className="relative min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.08),transparent_50%)]" />
                    <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {/* En‑tête */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 flex flex-col gap-4 rounded-2xl bg-white/50 p-6 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between dark:bg-slate-900/50"
                        >
                            <div>
                                <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                                    Tableau de bord analytique
                                </h1>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Suivi du trafic, conversions, revenus et
                                    insights IA.
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={refreshData}
                                    disabled={loading}
                                    className="rounded-xl border-slate-200 bg-white/80 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/80"
                                >
                                    {loading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <RefreshCw className="h-4 w-4" />
                                    )}
                                </Button>
                                <Tabs
                                    value={period}
                                    onValueChange={(v) => setPeriod(v as any)}
                                >
                                    <TabsList className="h-10 rounded-xl border border-slate-200 bg-white/80 p-1 dark:border-slate-700 dark:bg-slate-900/80">
                                        <TabsTrigger
                                            value="week"
                                            className="rounded-lg text-xs"
                                        >
                                            7 jours
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="month"
                                            className="rounded-lg text-xs"
                                        >
                                            30 jours
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="year"
                                            className="rounded-lg text-xs"
                                        >
                                            12 mois
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                        </motion.div>

                        {/* Barre temps réel */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 flex flex-col gap-4 rounded-2xl bg-white/50 p-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between dark:bg-slate-900/50"
                        >
                            <div className="flex items-center gap-3">
                                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/50">
                                    <Activity className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                        En ligne
                                    </p>
                                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                                        {realTime.active_visitors}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {recentPages.slice(0, 4).map((page, idx) => (
                                    <span
                                        key={idx}
                                        className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/60 px-2.5 py-1 text-xs text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300"
                                    >
                                        {page.path === '/' ? (
                                            <HomeIcon className="h-3 w-3" />
                                        ) : (
                                            <FileText className="h-3 w-3" />
                                        )}
                                        {page.path
                                            .replace(/^\//, '')
                                            .substring(0, 25)}
                                    </span>
                                ))}
                                {recentPages.length > 4 && (
                                    <span className="text-xs text-slate-400">
                                        +{recentPages.length - 4}
                                    </span>
                                )}
                            </div>
                            <div className="text-sm text-slate-500 dark:text-slate-400">
                                Taux de clic est.{' '}
                                {Math.round(estimatedConversion)}%
                            </div>
                        </motion.div>

                        {/* KPIs modernes avec mini graphiques */}
                        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {[
                                {
                                    title: 'Visites totales',
                                    value: totalVisits,
                                    trend: trafficGrowth,
                                    trendUp: trafficGrowth >= 0,
                                    icon: Eye,
                                    color: '#10b981',
                                    sub: 'Trafic global',
                                },
                                {
                                    title: 'Visiteurs uniques',
                                    value: uniqueVisitors,
                                    trend:
                                        uniqueVisitors > 0
                                            ? (uniqueVisitors /
                                                  Math.max(totalVisits, 1)) *
                                              100
                                            : 0,
                                    trendUp: true,
                                    icon: Users,
                                    color: '#06b6d4',
                                    sub: 'Audience active',
                                },
                                {
                                    title: 'Durée moyenne',
                                    value: avgDuration,
                                    trend:
                                        avgDuration > 0
                                            ? Math.min(avgDuration / 10, 30)
                                            : 0,
                                    trendUp: true,
                                    icon: Clock,
                                    color: '#8b5cf6',
                                    sub: formatDuration(avgDuration),
                                    formatValue: (v: number) =>
                                        formatDuration(v),
                                },
                                {
                                    title: 'Taux de rebond',
                                    value: bounceRate,
                                    trend:
                                        bounceRate > 0
                                            ? Math.min(bounceRate / 8, 25)
                                            : 0,
                                    trendUp: false,
                                    icon: Percent,
                                    color: '#ef4444',
                                    sub: `${bounceRate.toFixed(1)}%`,
                                    formatValue: (v: number) =>
                                        `${v.toFixed(1)}%`,
                                },
                                {
                                    title: 'Pages / session',
                                    value:
                                        totalVisits > 0
                                            ? Number(
                                                  (
                                                      totalVisits /
                                                      Math.max(
                                                          uniqueVisitors,
                                                          1,
                                                      )
                                                  ).toFixed(1),
                                              )
                                            : 0,
                                    trend: 5,
                                    trendUp: true,
                                    icon: FileText,
                                    color: '#f59e0b',
                                    sub: 'par visiteur',
                                },
                                {
                                    title: 'Taux de clic est.',
                                    value: estimatedConversion,
                                    trend:
                                        estimatedConversion > 0
                                            ? estimatedConversion
                                            : 0,
                                    trendUp: estimatedConversion >= 0,
                                    icon: TrendingUp,
                                    color: '#14b8a6',
                                    sub: `estimation`,
                                    formatValue: (v: number) =>
                                        `${v.toFixed(1)}%`,
                                },
                                {
                                    title: 'Revenus',
                                    value: revenueStats.today_revenue,
                                    trend: revenueStats.growth_rate,
                                    trendUp: revenueStats.growth_rate >= 0,
                                    icon: DollarSign,
                                    color: '#10b981',
                                    sub: `Moy: ${formatCurrency(revenueStats.average_order_value)}`,
                                    formatValue: (v: number) =>
                                        formatCurrency(v),
                                },
                                {
                                    title: 'Commandes',
                                    value: conversionFunnel.purchases,
                                    trend:
                                        conversionFunnel.purchases > 0
                                            ? Math.min(
                                                  (conversionFunnel.purchases /
                                                      Math.max(
                                                          conversionFunnel.visitors,
                                                          1,
                                                      )) *
                                                      100,
                                                  100,
                                              )
                                            : 0,
                                    trendUp: true,
                                    icon: ShoppingCart,
                                    color: '#3b82f6',
                                    sub: 'Transactions',
                                },
                            ].map((card, idx) => {
                                const data = useMemo(
                                    () => generateTrendData(card.trend, 6),
                                    [card.trend],
                                );

                                return (
                                    <motion.div
                                        key={card.title}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                    >
                                        <Card className="group relative overflow-hidden border-0 bg-linear-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
                                            <CardContent className="px-4 py-0">
                                                <div className="flex items-start justify-between">
                                                    <div className="space-y-1">
                                                        <p className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                                                            <card.icon className="h-4 w-4" />
                                                            {card.title}
                                                        </p>
                                                        <p className="text-2xl font-bold text-slate-900 tabular-nums dark:text-white">
                                                            {card.formatValue ? (
                                                                card.formatValue(
                                                                    card.value,
                                                                )
                                                            ) : (
                                                                <CountUp
                                                                    start={0}
                                                                    end={
                                                                        card.value
                                                                    }
                                                                    duration={2}
                                                                    separator=" "
                                                                />
                                                            )}
                                                        </p>
                                                        <Badge
                                                            variant="outline"
                                                            className={`flex items-center gap-1 px-2 py-0 text-xs ${
                                                                card.trendUp
                                                                    ? 'border-emerald-200 text-emerald-700 dark:border-emerald-800 dark:text-emerald-400'
                                                                    : 'border-red-200 text-red-700 dark:border-red-800 dark:text-red-400'
                                                            }`}
                                                        >
                                                            {card.trendUp ? (
                                                                <TrendingUp className="h-3 w-3" />
                                                            ) : (
                                                                <TrendingDown className="h-3 w-3" />
                                                            )}
                                                            {Math.abs(
                                                                card.trend,
                                                            ).toFixed(1)}
                                                            %
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <p className="mt-2 text-xs text-slate-400">
                                                    {card.sub}
                                                </p>
                                                {/* Mini graphique en aires */}
                                                <div className="mt-2 h-16 w-full">
                                                    <ResponsiveContainer
                                                        width="100%"
                                                        height="100%"
                                                    >
                                                        <AreaChart
                                                            data={data}
                                                            margin={{
                                                                top: 0,
                                                                right: 0,
                                                                left: 0,
                                                                bottom: 0,
                                                            }}
                                                        >
                                                            <defs>
                                                                <linearGradient
                                                                    id={`kpiGrad-${idx}`}
                                                                    x1="0"
                                                                    y1="0"
                                                                    x2="0"
                                                                    y2="1"
                                                                >
                                                                    <stop
                                                                        offset="5%"
                                                                        stopColor={
                                                                            card.color
                                                                        }
                                                                        stopOpacity={
                                                                            0.3
                                                                        }
                                                                    />
                                                                    <stop
                                                                        offset="95%"
                                                                        stopColor={
                                                                            card.color
                                                                        }
                                                                        stopOpacity={
                                                                            0
                                                                        }
                                                                    />
                                                                </linearGradient>
                                                            </defs>
                                                            <CartesianGrid
                                                                strokeDasharray="3 3"
                                                                stroke="#e2e8f0"
                                                                strokeOpacity={
                                                                    0.3
                                                                }
                                                            />
                                                            <XAxis
                                                                dataKey="name"
                                                                hide
                                                            />
                                                            <YAxis
                                                                hide
                                                                domain={[
                                                                    'dataMin - 5',
                                                                    'dataMax + 5',
                                                                ]}
                                                            />
                                                            {/* Tooltip personnalisé adapté au thème */}
                                                            <RechartsTooltip
                                                                content={({
                                                                    active,
                                                                    payload,
                                                                }) => {
                                                                    if (
                                                                        !active ||
                                                                        !payload?.length
                                                                    ) {
                                                                        return null;
                                                                    }

                                                                    const {
                                                                        name,
                                                                        value,
                                                                    } =
                                                                        payload[0]
                                                                            ?.payload ??
                                                                        {};

                                                                    return (
                                                                        <div className="rounded-xl border border-slate-200/60 bg-white/80 p-2 shadow-lg backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-900/80">
                                                                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                                                                {
                                                                                    name
                                                                                }
                                                                            </p>
                                                                            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                                                                {Math.round(
                                                                                    value,
                                                                                )}
                                                                            </p>
                                                                        </div>
                                                                    );
                                                                }}
                                                            />
                                                            <Area
                                                                type="monotone"
                                                                dataKey="value"
                                                                stroke={
                                                                    card.color
                                                                }
                                                                strokeWidth={2}
                                                                fill={`url(#kpiGrad-${idx})`}
                                                            />
                                                        </AreaChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Synthèse de performance - Radar Chart avec tooltip moderne */}
                        <Card className="mb-8 border-0 bg-white/60 shadow-lg shadow-slate-200/20 backdrop-blur-xl dark:bg-slate-900/60 dark:shadow-slate-950/30">
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                                    Synthèse de performance
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Comparaison normalisée des indicateurs clés
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={280}>
                                    <RadarChart
                                        data={[
                                            {
                                                indicator: 'Vis. uniques',
                                                value: Math.min(
                                                    100,
                                                    (uniqueVisitors /
                                                        Math.max(
                                                            totalVisits,
                                                            1,
                                                        )) *
                                                        100,
                                                ),
                                                fullMark: 100,
                                            },
                                            {
                                                indicator: 'Pages/session',
                                                value:
                                                    totalVisits > 0
                                                        ? Math.min(
                                                              100,
                                                              (totalVisits /
                                                                  Math.max(
                                                                      uniqueVisitors,
                                                                      1,
                                                                  )) *
                                                                  10,
                                                          )
                                                        : 0,
                                                fullMark: 100,
                                            },
                                            {
                                                indicator: 'Durée moy.',
                                                value: Math.min(
                                                    100,
                                                    (avgDuration / 600) * 100,
                                                ),
                                                fullMark: 100,
                                            },
                                            {
                                                indicator: 'Rebond (inv)',
                                                value: Math.max(
                                                    0,
                                                    100 - bounceRate,
                                                ),
                                                fullMark: 100,
                                            },
                                        ]}
                                    >
                                        <PolarGrid
                                            stroke="#e2e8f0"
                                            strokeOpacity={0.6}
                                        />
                                        <PolarAngleAxis
                                            dataKey="indicator"
                                            tick={{
                                                fontSize: 11,
                                                fill: '#94a3b8',
                                            }}
                                        />
                                        <PolarRadiusAxis
                                            angle={30}
                                            domain={[0, 100]}
                                            tick={false}
                                        />
                                        <Radar
                                            name="Performance"
                                            dataKey="value"
                                            stroke="#10b981"
                                            fill="#10b981"
                                            fillOpacity={0.3}
                                            strokeWidth={2}
                                        />
                                        <RechartsTooltip
                                            content={({ active, payload }) => {
                                                if (
                                                    !active ||
                                                    !payload?.length
                                                ) {
                                                    return null;
                                                }

                                                const data =
                                                    payload[0]?.payload; // { indicator, value, fullMark }

                                                if (!data) {
                                                    return null;
                                                }

                                                return (
                                                    <div className="rounded-xl border border-slate-200/60 bg-white/80 p-3 shadow-lg backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-900/80">
                                                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                                            {data.indicator}
                                                        </p>
                                                        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                                                            {data.value.toFixed(
                                                                1,
                                                            )}
                                                        </p>
                                                        <p className="text-[10px] text-slate-400 dark:text-slate-500">
                                                            / {data.fullMark}
                                                        </p>
                                                    </div>
                                                );
                                            }}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-500">
                                    <div>
                                        <span className="font-medium">
                                            {uniqueVisitors}
                                        </span>{' '}
                                        visiteurs uniques
                                    </div>
                                    <div>
                                        <span className="font-medium">
                                            {totalVisits > 0
                                                ? (
                                                      totalVisits /
                                                      Math.max(
                                                          uniqueVisitors,
                                                          1,
                                                      )
                                                  ).toFixed(1)
                                                : 0}
                                        </span>{' '}
                                        pages/session
                                    </div>
                                    <div>
                                        <span className="font-medium">
                                            {formatDuration(avgDuration)}
                                        </span>{' '}
                                        durée moy.
                                    </div>
                                    <div>
                                        <span className="font-medium">
                                            {bounceRate.toFixed(1)}%
                                        </span>{' '}
                                        rebond
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Revenus & Conversion */}
                        <div className="mb-8 grid gap-6 lg:grid-cols-2">
                            <Card className="border-0 bg-white/60 shadow-lg shadow-slate-200/20 backdrop-blur-xl dark:bg-slate-900/60 dark:shadow-slate-950/30">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base font-semibold">
                                        Évolution des revenus
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer
                                        width="100%"
                                        height={280}
                                    >
                                        <AreaChart
                                            data={revenueStats.revenue_chart}
                                        >
                                            <defs>
                                                <linearGradient
                                                    id="revenueGrad"
                                                    x1="0"
                                                    y1="0"
                                                    x2="0"
                                                    y2="1"
                                                >
                                                    <stop
                                                        offset="5%"
                                                        stopColor="#10b981"
                                                        stopOpacity={0.3}
                                                    />
                                                    <stop
                                                        offset="95%"
                                                        stopColor="#10b981"
                                                        stopOpacity={0}
                                                    />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                stroke="#e2e8f0"
                                            />
                                            <XAxis
                                                dataKey="date"
                                                tick={{ fontSize: 11 }}
                                                stroke="#94a3b8"
                                            />
                                            <YAxis
                                                tick={{ fontSize: 11 }}
                                                stroke="#94a3b8"
                                                tickFormatter={(v) =>
                                                    formatCurrency(v)
                                                }
                                            />
                                            <RechartsTooltip
                                                formatter={(value) =>
                                                    formatCurrency(
                                                        value as number,
                                                    )
                                                }
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="revenue"
                                                stroke="#10b981"
                                                strokeWidth={2}
                                                fill="url(#revenueGrad)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            {/* Tunnel de conversion amélioré */}
                            <Card className="border-0 bg-white/60 shadow-lg shadow-slate-200/20 backdrop-blur-xl dark:bg-slate-900/60 dark:shadow-slate-950/30">
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                        <TrendingUp className="h-5 w-5 text-emerald-500" />
                                        Tunnel de conversion
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Parcours client (taux de passage)
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {(() => {
                                            const steps = [
                                                {
                                                    label: 'Visiteurs',
                                                    value: conversionFunnel.visitors,
                                                },
                                                {
                                                    label: 'Pages produits',
                                                    value: conversionFunnel.product_views,
                                                },
                                                {
                                                    label: 'Ajouts panier',
                                                    value: conversionFunnel.add_to_cart,
                                                },
                                                {
                                                    label: 'Checkout',
                                                    value: conversionFunnel.begin_checkout,
                                                },
                                                {
                                                    label: 'Achats',
                                                    value: conversionFunnel.purchases,
                                                },
                                            ];

                                            // Calcule le pourcentage par rapport à l'étape précédente,
                                            // mais seulement si la valeur est inférieure ou égale (entonnoir cohérent).
                                            const getPercentage = (
                                                index: number,
                                            ): number | null => {
                                                if (index === 0) {
                                                    return 100;
                                                }

                                                const previousValue =
                                                    steps[index - 1].value;
                                                const currentValue =
                                                    steps[index].value;

                                                if (
                                                    previousValue > 0 &&
                                                    currentValue <=
                                                        previousValue
                                                ) {
                                                    return Math.round(
                                                        (currentValue /
                                                            previousValue) *
                                                            100,
                                                    );
                                                }

                                                return null; // pourcentage non pertinent
                                            };

                                            const maxValue = Math.max(
                                                ...steps.map((s) => s.value),
                                                1,
                                            );

                                            return steps.map((step, idx) => {
                                                const percent =
                                                    getPercentage(idx);
                                                const widthPercent =
                                                    (step.value / maxValue) *
                                                    100; // largeur relative pour visuel

                                                return (
                                                    <div
                                                        key={step.label}
                                                        className="space-y-1"
                                                    >
                                                        <div className="flex items-center justify-between text-sm">
                                                            <span className="text-slate-600 dark:text-slate-300">
                                                                {step.label}
                                                            </span>
                                                            <span className="font-medium text-slate-900 tabular-nums dark:text-white">
                                                                {step.value.toLocaleString()}
                                                                {percent !==
                                                                null
                                                                    ? ` (${percent}%)`
                                                                    : ''}
                                                            </span>
                                                        </div>
                                                        <div className="relative h-8 w-full overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                                                            <motion.div
                                                                className="flex h-full items-center rounded-lg bg-linear-to-r from-emerald-400 to-teal-500 pl-3 text-xs font-bold text-white"
                                                                initial={{
                                                                    width: 0,
                                                                }}
                                                                animate={{
                                                                    width: `${Math.max(5, widthPercent)}%`,
                                                                }}
                                                                transition={{
                                                                    duration: 1,
                                                                    delay:
                                                                        idx *
                                                                        0.2,
                                                                }}
                                                            >
                                                                {step.label}
                                                            </motion.div>
                                                        </div>
                                                    </div>
                                                );
                                            });
                                        })()}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sources & Top produits */}
                        <div className="mb-8 grid gap-6 lg:grid-cols-2">
                            {/* Sources de trafic – Barres horizontales */}
                            <Card className="border-0 bg-white/60 shadow-lg shadow-slate-200/20 backdrop-blur-xl dark:bg-slate-900/60 dark:shadow-slate-950/30">
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                        <BarChart3 className="h-5 w-5 text-emerald-500" />
                                        Sources de trafic
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Répartition par source
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {trafficSources.length === 0 ? (
                                        <p className="text-sm text-slate-500">
                                            Aucune donnée
                                        </p>
                                    ) : (
                                        <ResponsiveContainer
                                            width="100%"
                                            height={250}
                                        >
                                            <BarChart
                                                data={trafficSources.map(
                                                    (s) => {
                                                        const total =
                                                            trafficSources.reduce(
                                                                (acc, cur) =>
                                                                    acc +
                                                                    cur.visits,
                                                                0,
                                                            );
                                                        const percent =
                                                            total > 0
                                                                ? (s.visits /
                                                                      total) *
                                                                  100
                                                                : 0;

                                                        return {
                                                            name: s.source,
                                                            visits: s.visits,
                                                            percent:
                                                                Math.round(
                                                                    percent,
                                                                ),
                                                        };
                                                    },
                                                )}
                                                layout="vertical"
                                                margin={{
                                                    top: 0,
                                                    right: 40,
                                                    left: 0,
                                                    bottom: 0,
                                                }}
                                            >
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    stroke="#e2e8f0"
                                                    strokeOpacity={0.5}
                                                    horizontal={false}
                                                />
                                                <XAxis type="number" hide />
                                                <YAxis
                                                    type="category"
                                                    dataKey="name"
                                                    tick={{
                                                        fontSize: 11,
                                                        fill: '#64748b',
                                                    }}
                                                    width={100}
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tickFormatter={(val) =>
                                                        val
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                        val.slice(1)
                                                    }
                                                />
                                                <RechartsTooltip
                                                    content={({
                                                        active,
                                                        payload,
                                                    }) => {
                                                        if (
                                                            !active ||
                                                            !payload?.length
                                                        ) {
                                                            return null;
                                                        }

                                                        const {
                                                            name,
                                                            visits,
                                                            percent,
                                                        } = payload[0].payload;

                                                        return (
                                                            <div className="rounded-xl border border-slate-200/60 bg-white/80 p-3 shadow-lg backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-900/80">
                                                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                                                    {name}
                                                                </p>
                                                                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                                                    {visits}{' '}
                                                                    visites (
                                                                    {percent}%)
                                                                </p>
                                                            </div>
                                                        );
                                                    }}
                                                />
                                                <Bar
                                                    dataKey="visits"
                                                    radius={[0, 8, 8, 0]}
                                                    barSize={20}
                                                    fill="#10b981"
                                                >
                                                    <LabelList
                                                        dataKey="percent"
                                                        position="right"
                                                        formatter={(
                                                            label: any,
                                                        ) => `${label}%`}
                                                        style={{
                                                            fontSize: '11px',
                                                            fill: '#64748b',
                                                        }}
                                                    />
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Produits les plus vendus – Barres verticales */}
                            <Card className="border-0 bg-white/60 shadow-lg shadow-slate-200/20 backdrop-blur-xl dark:bg-slate-900/60 dark:shadow-slate-950/30">
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                        <ShoppingCart className="h-5 w-5 text-emerald-500" />
                                        Produits les plus vendus
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Top 5 des ventes
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {!topProducts.top_sold ||
                                    topProducts.top_sold.length === 0 ? (
                                        <p className="text-sm text-slate-500">
                                            Aucune donnée
                                        </p>
                                    ) : (
                                        <ResponsiveContainer
                                            width="100%"
                                            height={250}
                                        >
                                            <BarChart
                                                data={topProducts.top_sold
                                                    .slice(0, 5)
                                                    .map((p) => ({
                                                        name: (
                                                            p.product_name ||
                                                            p.product_id ||
                                                            ''
                                                        ).substring(0, 20),
                                                        sold: p.sold ?? 0,
                                                    }))}
                                                margin={{
                                                    top: 10,
                                                    right: 20,
                                                    left: 0,
                                                    bottom: 40,
                                                }}
                                            >
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    stroke="#e2e8f0"
                                                    strokeOpacity={0.5}
                                                />
                                                <XAxis
                                                    dataKey="name"
                                                    tick={{
                                                        fontSize: 10,
                                                        fill: '#64748b',
                                                    }}
                                                    angle={-25}
                                                    textAnchor="end"
                                                    height={60}
                                                />
                                                <YAxis
                                                    tick={{
                                                        fontSize: 11,
                                                        fill: '#94a3b8',
                                                    }}
                                                />
                                                <RechartsTooltip
                                                    content={({
                                                        active,
                                                        payload,
                                                    }) => {
                                                        if (
                                                            !active ||
                                                            !payload?.length
                                                        ) {
                                                            return null;
                                                        }

                                                        const { name, sold } =
                                                            payload[0].payload;

                                                        return (
                                                            <div className="rounded-xl border border-slate-200/60 bg-white/80 p-3 shadow-lg backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-900/80">
                                                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                                                    {name}
                                                                </p>
                                                                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                                                    {sold}{' '}
                                                                    vendus
                                                                </p>
                                                            </div>
                                                        );
                                                    }}
                                                />
                                                <Bar
                                                    dataKey="sold"
                                                    fill="#10b981"
                                                    radius={[8, 8, 0, 0]}
                                                    barSize={30}
                                                >
                                                    <LabelList
                                                        dataKey="sold"
                                                        position="top"
                                                        style={{
                                                            fontSize: '11px',
                                                            fill: '#64748b',
                                                        }}
                                                    />
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* ✅ Nouveaux graphiques modernes */}
                        <div className="mb-8 grid gap-6 lg:grid-cols-2">
                            {/* Produits les plus consultés – Barres verticales */}
                            {topProducts.top_viewed &&
                                topProducts.top_viewed.length > 0 && (
                                    <Card className="border-0 bg-white/60 shadow-lg shadow-slate-200/20 backdrop-blur-xl dark:bg-slate-900/60 dark:shadow-slate-950/30">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                                <Eye className="h-5 w-5 text-emerald-500" />
                                                Produits les plus consultés
                                            </CardTitle>
                                            <CardDescription className="text-xs">
                                                Top 5 des vues
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <ResponsiveContainer
                                                width="100%"
                                                height={250}
                                            >
                                                <BarChart
                                                    data={topProducts.top_viewed
                                                        .slice(0, 5)
                                                        .map((p) => ({
                                                            name: (
                                                                p.product_name ||
                                                                p.product_id ||
                                                                ''
                                                            ).substring(0, 20),
                                                            views: p.views ?? 0,
                                                        }))}
                                                    margin={{
                                                        top: 10,
                                                        right: 20,
                                                        left: 0,
                                                        bottom: 40,
                                                    }}
                                                >
                                                    <CartesianGrid
                                                        strokeDasharray="3 3"
                                                        stroke="#e2e8f0"
                                                        strokeOpacity={0.5}
                                                    />
                                                    <XAxis
                                                        dataKey="name"
                                                        tick={{
                                                            fontSize: 10,
                                                            fill: '#64748b',
                                                        }}
                                                        angle={-25}
                                                        textAnchor="end"
                                                        height={60}
                                                    />
                                                    <YAxis
                                                        tick={{
                                                            fontSize: 11,
                                                            fill: '#94a3b8',
                                                        }}
                                                    />
                                                    <RechartsTooltip
                                                        content={({
                                                            active,
                                                            payload,
                                                        }) => {
                                                            if (
                                                                !active ||
                                                                !payload?.length
                                                            ) {
                                                                return null;
                                                            }

                                                            const {
                                                                name,
                                                                views,
                                                            } =
                                                                payload[0]
                                                                    .payload;

                                                            return (
                                                                <div className="rounded-xl border border-slate-200/60 bg-white/80 p-3 shadow-lg backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-900/80">
                                                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                                                        {name}
                                                                    </p>
                                                                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                                                        {views}{' '}
                                                                        vues
                                                                    </p>
                                                                </div>
                                                            );
                                                        }}
                                                    />
                                                    <Bar
                                                        dataKey="views"
                                                        fill="#06b6d4"
                                                        radius={[8, 8, 0, 0]}
                                                        barSize={30}
                                                    >
                                                        <LabelList
                                                            dataKey="views"
                                                            position="top"
                                                            style={{
                                                                fontSize:
                                                                    '11px',
                                                                fill: '#64748b',
                                                            }}
                                                        />
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </CardContent>
                                    </Card>
                                )}

                            {/* Top villes – Barres horizontales */}
                            {geographicStats.cities &&
                                geographicStats.cities.length > 0 && (
                                    <Card className="border-0 bg-white/60 shadow-lg shadow-slate-200/20 backdrop-blur-xl dark:bg-slate-900/60 dark:shadow-slate-950/30">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                                <MapPin className="h-5 w-5 text-emerald-500" />
                                                Top villes
                                            </CardTitle>
                                            <CardDescription className="text-xs">
                                                Répartition par ville
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <ResponsiveContainer
                                                width="100%"
                                                height={250}
                                            >
                                                <BarChart
                                                    data={geographicStats.cities
                                                        .slice(0, 8)
                                                        .map((c) => ({
                                                            name: `${c.city || 'Inconnue'}, ${c.country}`,
                                                            visits: c.visits,
                                                        }))}
                                                    layout="vertical"
                                                    margin={{
                                                        top: 0,
                                                        right: 40,
                                                        left: 0,
                                                        bottom: 0,
                                                    }}
                                                >
                                                    <CartesianGrid
                                                        strokeDasharray="3 3"
                                                        stroke="#e2e8f0"
                                                        strokeOpacity={0.5}
                                                        horizontal={false}
                                                    />
                                                    <XAxis type="number" hide />
                                                    <YAxis
                                                        type="category"
                                                        dataKey="name"
                                                        tick={{
                                                            fontSize: 10,
                                                            fill: '#64748b',
                                                        }}
                                                        width={120}
                                                    />
                                                    <RechartsTooltip
                                                        content={({
                                                            active,
                                                            payload,
                                                        }) => {
                                                            if (
                                                                !active ||
                                                                !payload?.length
                                                            ) {
                                                                return null;
                                                            }

                                                            const {
                                                                name,
                                                                visits,
                                                            } =
                                                                payload[0]
                                                                    .payload;

                                                            return (
                                                                <div className="rounded-xl border border-slate-200/60 bg-white/80 p-3 shadow-lg backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-900/80">
                                                                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                                                        {name}
                                                                    </p>
                                                                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                                                        {visits}{' '}
                                                                        visites
                                                                    </p>
                                                                </div>
                                                            );
                                                        }}
                                                    />
                                                    <Bar
                                                        dataKey="visits"
                                                        fill="#14b8a6"
                                                        radius={[0, 8, 8, 0]}
                                                        barSize={18}
                                                    >
                                                        <LabelList
                                                            dataKey="visits"
                                                            position="right"
                                                            style={{
                                                                fontSize:
                                                                    '11px',
                                                                fill: '#64748b',
                                                            }}
                                                        />
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </CardContent>
                                    </Card>
                                )}
                        </div>

                        {/* ✅ Mini sparkline tendance visites */}
                        <div className="mb-8 grid gap-6 lg:grid-cols-2">
                            <Card className="border-0 bg-white/60 shadow-lg shadow-slate-200/20 backdrop-blur-xl dark:bg-slate-900/60 dark:shadow-slate-950/30">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base font-semibold">
                                        Tendance visites (7 jours)
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer
                                        width="100%"
                                        height={80}
                                    >
                                        <AreaChart data={daily.slice(-7)}>
                                            <defs>
                                                <linearGradient
                                                    id="miniGrad"
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
                                            <Area
                                                type="monotone"
                                                dataKey="visits"
                                                stroke="#10b981"
                                                strokeWidth={2}
                                                fill="url(#miniGrad)"
                                                dot={false}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                    <p className="mt-1 text-center text-sm font-medium text-slate-600 dark:text-slate-300">
                                        {daily.length > 0
                                            ? `${daily[daily.length - 1].visits} visites aujourd'hui`
                                            : ''}
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Géolocalisation pays – Barres horizontales */}
                            <Card className="border-0 bg-white/60 shadow-lg shadow-slate-200/20 backdrop-blur-xl dark:bg-slate-900/60 dark:shadow-slate-950/30">
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                        <Globe className="h-5 w-5 text-emerald-500" />
                                        Géolocalisation (pays)
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Top 5 des pays
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {geographicStats.countries.length === 0 ? (
                                        <p className="text-sm text-slate-500">
                                            Aucune donnée
                                        </p>
                                    ) : (
                                        <ResponsiveContainer
                                            width="100%"
                                            height={220}
                                        >
                                            <BarChart
                                                data={geographicStats.countries
                                                    .slice(0, 5)
                                                    .map((c) => ({
                                                        name: c.country,
                                                        visits: c.visits,
                                                    }))}
                                                layout="vertical"
                                                margin={{
                                                    top: 0,
                                                    right: 40,
                                                    left: 0,
                                                    bottom: 0,
                                                }}
                                            >
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    stroke="#e2e8f0"
                                                    strokeOpacity={0.5}
                                                    horizontal={false}
                                                />
                                                <XAxis type="number" hide />
                                                <YAxis
                                                    type="category"
                                                    dataKey="name"
                                                    tick={{
                                                        fontSize: 11,
                                                        fill: '#64748b',
                                                    }}
                                                    width={90}
                                                />
                                                <RechartsTooltip
                                                    content={({
                                                        active,
                                                        payload,
                                                    }) => {
                                                        if (
                                                            !active ||
                                                            !payload?.length
                                                        ) {
                                                            return null;
                                                        }

                                                        const { name, visits } =
                                                            payload[0].payload;

                                                        return (
                                                            <div className="rounded-xl border border-slate-200/60 bg-white/80 p-3 shadow-lg backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-900/80">
                                                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                                                    {name}
                                                                </p>
                                                                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                                                    {visits}{' '}
                                                                    visites
                                                                </p>
                                                            </div>
                                                        );
                                                    }}
                                                />
                                                <Bar
                                                    dataKey="visits"
                                                    fill="#8b5cf6"
                                                    radius={[0, 8, 8, 0]}
                                                    barSize={20}
                                                >
                                                    <LabelList
                                                        dataKey="visits"
                                                        position="right"
                                                        style={{
                                                            fontSize: '11px',
                                                            fill: '#64748b',
                                                        }}
                                                    />
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Visites & Appareils */}
                        <div className="mb-8 grid gap-6 lg:grid-cols-2">
                            <Card className="border-0 bg-white/60 shadow-lg shadow-slate-200/20 backdrop-blur-xl dark:bg-slate-900/60 dark:shadow-slate-950/30">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base font-semibold">
                                        Évolution des visites
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ResponsiveContainer
                                        width="100%"
                                        height={250}
                                    >
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
                                                        stopOpacity={0.3}
                                                    />
                                                    <stop
                                                        offset="98%"
                                                        stopColor="#10b981"
                                                        stopOpacity={0}
                                                    />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                stroke="#e2e8f0"
                                            />
                                            <XAxis
                                                dataKey="date"
                                                tick={{ fontSize: 11 }}
                                                stroke="#94a3b8"
                                            />
                                            <YAxis
                                                tick={{ fontSize: 11 }}
                                                stroke="#94a3b8"
                                            />
                                            <RechartsTooltip />
                                            <Area
                                                type="monotone"
                                                dataKey="visits"
                                                stroke="#10b981"
                                                strokeWidth={2}
                                                fill="url(#colorVisits)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card className="border-0 bg-white/60 shadow-lg shadow-slate-200/20 backdrop-blur-xl dark:bg-slate-900/60 dark:shadow-slate-950/30">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base font-semibold">
                                        Appareils
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center">
                                    <ResponsiveContainer
                                        width="100%"
                                        height={220}
                                    >
                                        <PieChart>
                                            <Pie
                                                data={chartData}
                                                dataKey="count"
                                                nameKey="device"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                innerRadius={50}
                                                paddingAngle={3}
                                                stroke="none"
                                            >
                                                {chartData.map(
                                                    (entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={entry.fill}
                                                        />
                                                    ),
                                                )}
                                            </Pie>
                                            <RechartsTooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                                        {chartData.map((d, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center gap-2"
                                            >
                                                <span
                                                    className="h-3 w-3 rounded-full"
                                                    style={{
                                                        backgroundColor: d.fill,
                                                    }}
                                                />
                                                <span>{d.device}</span>
                                                <span className="ml-auto text-slate-500">
                                                    {d.percent.toFixed(1)}%
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Pages & Navigateurs */}
                        <div className="mb-8 grid gap-6 lg:grid-cols-2">
                            {/* Pages populaires – BarChart horizontal */}
                            <Card className="border-0 bg-white/60 shadow-lg shadow-slate-200/20 backdrop-blur-xl dark:bg-slate-900/60 dark:shadow-slate-950/30">
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                        <FileText className="h-5 w-5 text-emerald-500" />
                                        Pages populaires
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Top 5 des pages les plus consultées
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {top_pages.length === 0 ? (
                                        <p className="text-sm text-slate-500">
                                            Aucune donnée
                                        </p>
                                    ) : (
                                        <ResponsiveContainer
                                            width="100%"
                                            height={250}
                                        >
                                            <BarChart
                                                data={top_pages
                                                    .slice(0, 5)
                                                    .map((p) => ({
                                                        name: p.path,
                                                        views: p.views,
                                                    }))}
                                                layout="vertical"
                                                margin={{
                                                    top: 0,
                                                    right: 30,
                                                    left: 0,
                                                    bottom: 0,
                                                }}
                                            >
                                                <CartesianGrid
                                                    strokeDasharray="3 3"
                                                    stroke="#e2e8f0"
                                                    strokeOpacity={0.5}
                                                    horizontal={false}
                                                />
                                                <XAxis type="number" hide />
                                                <YAxis
                                                    type="category"
                                                    dataKey="name"
                                                    tick={{
                                                        fontSize: 11,
                                                        fill: '#64748b',
                                                    }}
                                                    width={120}
                                                    axisLine={false}
                                                    tickLine={false}
                                                />
                                                <RechartsTooltip
                                                    content={<CustomTooltip />}
                                                />
                                                <Bar
                                                    dataKey="views"
                                                    fill="#10b981"
                                                    radius={[0, 8, 8, 0]}
                                                    barSize={20}
                                                    activeBar={{
                                                        fill: '#059669', // vert plus foncé au survol
                                                        stroke: '#047857', // fine bordure
                                                        strokeWidth: 1,
                                                        radius: 8, // ← corrigé : nombre au lieu d'un tableau
                                                    }}
                                                    cursor="pointer"
                                                >
                                                    <LabelList
                                                        dataKey="views"
                                                        position="right"
                                                        style={{
                                                            fontSize: '11px',
                                                            fill: '#64748b',
                                                        }}
                                                    />
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Navigateurs – PieChart en anneau */}
                            <Card className="border-0 bg-white/60 shadow-lg shadow-slate-200/20 backdrop-blur-xl dark:bg-slate-900/60 dark:shadow-slate-950/30">
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                                        <Globe className="h-5 w-5 text-emerald-500" />
                                        Navigateurs
                                    </CardTitle>
                                    <CardDescription className="text-xs">
                                        Répartition par navigateur
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {browsers.filter(
                                        (b) =>
                                            b.browser &&
                                            b.browser !== '0' &&
                                            b.count > 0,
                                    ).length === 0 ? (
                                        <p className="text-sm text-slate-500">
                                            Aucune donnée
                                        </p>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <ResponsiveContainer
                                                width="100%"
                                                height={200}
                                            >
                                                <PieChart>
                                                    <Pie
                                                        data={browsers
                                                            .filter(
                                                                (b) =>
                                                                    b.browser &&
                                                                    b.browser !==
                                                                        '0' &&
                                                                    b.count > 0,
                                                            )
                                                            .map((b) => ({
                                                                name: b.browser,
                                                                count: b.count,
                                                            }))}
                                                        cx="50%"
                                                        cy="50%"
                                                        outerRadius={80}
                                                        innerRadius={40}
                                                        paddingAngle={3}
                                                        dataKey="count"
                                                        nameKey="name"
                                                        stroke="none"
                                                    >
                                                        {browsers.map(
                                                            (_, index) => (
                                                                <Cell
                                                                    key={`cell-${index}`}
                                                                    fill={
                                                                        [
                                                                            '#10b981',
                                                                            '#06b6d4',
                                                                            '#8b5cf6',
                                                                            '#f59e0b',
                                                                            '#ef4444',
                                                                        ][
                                                                            index %
                                                                                5
                                                                        ]
                                                                    }
                                                                />
                                                            ),
                                                        )}
                                                    </Pie>
                                                    <RechartsTooltip
                                                        content={
                                                            <CustomTooltip />
                                                        }
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                            {/* Légende personnalisée */}
                                            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                                                {browsers
                                                    .filter(
                                                        (b) =>
                                                            b.browser &&
                                                            b.browser !== '0' &&
                                                            b.count > 0,
                                                    )
                                                    .slice(0, 5)
                                                    .map((b, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="flex items-center gap-2"
                                                        >
                                                            <span
                                                                className="h-3 w-3 rounded-full"
                                                                style={{
                                                                    backgroundColor:
                                                                        [
                                                                            '#10b981',
                                                                            '#06b6d4',
                                                                            '#8b5cf6',
                                                                            '#f59e0b',
                                                                            '#ef4444',
                                                                        ][
                                                                            idx %
                                                                                5
                                                                        ],
                                                                }}
                                                            />
                                                            <span className="flex items-center gap-1">
                                                                {getBrowserIcon(
                                                                    b.browser,
                                                                )}
                                                                <span className="text-xs text-slate-600 dark:text-slate-400">
                                                                    {b.browser}
                                                                </span>
                                                            </span>
                                                            <span className="ml-auto text-xs text-slate-500">
                                                                {b.count}
                                                            </span>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* AI Insights améliorés */}
                        {aiInsights.length > 0 && (
                            <Card className="mb-8 overflow-hidden border-0 bg-white/60 shadow-lg shadow-slate-200/20 backdrop-blur-xl dark:bg-slate-900/60 dark:shadow-slate-950/30">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100/70 shadow-inner dark:bg-amber-900/30">
                                                <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                                                    Insights IA
                                                </CardTitle>
                                                <CardDescription className="text-xs">
                                                    Analyses intelligentes en
                                                    temps réel
                                                </CardDescription>
                                            </div>
                                        </div>
                                        <Badge className="border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                                            {aiInsights.length} insight
                                            {aiInsights.length > 1 ? 's' : ''}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {aiInsights.map((insight, idx) => {
                                            // Classification automatique selon le contenu
                                            const isPositive =
                                                /augmente|hausse|croissance|progression|amélioration|positif/i.test(
                                                    insight,
                                                );
                                            const isNegative =
                                                /baisse|diminution|recul|perte|alerte|critique|négatif/i.test(
                                                    insight,
                                                );
                                            const isSuggestion =
                                                /recommandation|suggér|essayez|pensez à|optimisez|améliorez/i.test(
                                                    insight,
                                                );

                                            const accentColor = isPositive
                                                ? 'border-l-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/30'
                                                : isNegative
                                                  ? 'border-l-red-500 bg-red-50/80 dark:bg-red-950/30'
                                                  : isSuggestion
                                                    ? 'border-l-blue-500 bg-blue-50/80 dark:bg-blue-950/30'
                                                    : 'border-l-amber-500 bg-amber-50/80 dark:bg-amber-950/30';

                                            const IconComponent = isPositive
                                                ? TrendingUp
                                                : isNegative
                                                  ? TrendingDown
                                                  : isSuggestion
                                                    ? Zap
                                                    : Sparkles;

                                            const iconColor = isPositive
                                                ? 'text-emerald-500'
                                                : isNegative
                                                  ? 'text-red-500'
                                                  : isSuggestion
                                                    ? 'text-blue-500'
                                                    : 'text-amber-500';

                                            return (
                                                <motion.div
                                                    key={idx}
                                                    initial={{
                                                        opacity: 0,
                                                        y: 10,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    transition={{
                                                        delay: idx * 0.1,
                                                    }}
                                                    whileHover={{ scale: 1.02 }}
                                                    className={`flex items-start gap-3 rounded-xl border-l-4 border-slate-200 p-3 shadow-sm transition-all duration-300 hover:shadow-md ${accentColor} dark:border-slate-700`}
                                                >
                                                    <div className="mt-0.5">
                                                        <IconComponent
                                                            className={`h-4 w-4 ${iconColor}`}
                                                        />
                                                    </div>
                                                    <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                                                        {insight}
                                                    </p>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
