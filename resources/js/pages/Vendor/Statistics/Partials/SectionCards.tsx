// resources/js/Pages/Vendor/Statistics/Partials/SectionCards.tsx
import { motion } from 'framer-motion';
import {
    TrendingUp,
    TrendingDown,
    Users,
    ShoppingBag,
    Clock,
    ArrowUpRight,
    Tag,
    UserCheck,
    DollarSign,
    ImageOff,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import type { Summary } from '@/types/tenants/products/vendor/tenant';

// ----------------------------------------------------------------------
// Petite sparkline SVG (minimaliste)
// ----------------------------------------------------------------------
const SparkLine = ({ values, color }: { values: number[]; color: string }) => {
    // Filtrer les valeurs non numériques ou undefined/null
    const safeValues = values.filter(v => typeof v === 'number' && !Number.isNaN(v));

    if (safeValues.length < 2) {
        // Rendu minimal pour éviter les erreurs
        return <svg width={64} height={32} className="shrink-0" />;
    }

    const max = Math.max(...safeValues, 1);
    const min = Math.min(...safeValues, 0);
    const height = 32;
    const width = 64;
    const points = safeValues
        .map(
            (v, i) =>
                `${(i / (safeValues.length - 1)) * width},${height - ((v - min) / (max - min || 1)) * (height - 4) - 2}`
        )
        .join(' ');

    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="shrink-0">
            <polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

// ----------------------------------------------------------------------
// Composant principal
// ----------------------------------------------------------------------
export function SectionCards({ summary }: { summary: Summary | null }) {
    if (!summary) {
        return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                    <Card
                        key={i}
                        className="animate-pulse border-0 bg-slate-50/50 dark:bg-slate-900/50"
                    >
                        <CardHeader>
                            <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800" />
                            <div className="mt-2 h-8 w-32 rounded bg-slate-200 dark:bg-slate-800" />
                        </CardHeader>
                    </Card>
                ))}
            </div>
        );
    }

    const {
        sales_today = 0,
        customers = 0,
        abandoned_carts = 0,
        pending_orders = 0,
        returning_customers = 0,
        revenue_per_customer = 0,
        products_without_image = 0,
        active_promotions = 0,
        customers_change = 0,
        carts_change = 0,
        pending_change = 0,
        sales_today_change = 0,
        promo_change = 0,
        returning_change = 0,
    } = summary ?? {};

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('fr-CD', {
            style: 'currency',
            currency: 'CDF',
        }).format(value);

    // Génération de données factices pour les sparklines (à remplacer par les vraies)
    const getRandomSparkData = () =>
        Array.from({ length: 8 }, () => Math.floor(Math.random() * 40) + 10);

    const cards = [
        {
            title: 'Clients',
            value: customers.toLocaleString(),
            icon: <Users className="h-5 w-5 text-purple-500" />,
            trend: customers_change,
            sub: 'nouveaux ce mois',
            sparkColor: '#8b5cf6',
            sparkValues: (
                summary.sparkline_customers ?? getRandomSparkData()
            ).map((d: any) => d.value),
        },
        {
            title: 'Paniers abandonnés',
            value: abandoned_carts.toLocaleString(),
            icon: <ShoppingBag className="h-5 w-5 text-orange-500" />,
            trend: carts_change,
            sub: 'à relancer',
            sparkColor: '#f97316',
            sparkValues: (summary.sparkline_carts ?? getRandomSparkData()).map(
                (d: any) => d.value,
            ),
        },
        {
            title: 'En attente',
            value: pending_orders.toLocaleString(),
            icon: <Clock className="h-5 w-5 text-amber-500" />,
            trend: pending_change,
            sub: 'commandes en cours',
            sparkColor: '#f59e0b',
            sparkValues: (
                summary.sparkline_pending ?? getRandomSparkData()
            ).map((d: any) => d.value),
        },
        {
            title: 'Ventes du jour',
            value: formatCurrency(sales_today),
            icon: <ArrowUpRight className="h-5 w-5 text-yellow-500" />,
            trend: sales_today_change,
            sub: "aujourd'hui",
            sparkColor: '#eab308',
            sparkValues: (
                summary.sparkline_sales_today ?? getRandomSparkData()
            ).map((d: any) => d.value),
        },
        {
            title: 'Promotions actives',
            value: (active_promotions ?? 0).toLocaleString(),
            icon: <Tag className="h-5 w-5 text-pink-500" />,
            trend: promo_change,
            sub: 'promotions en cours',
            sparkColor: '#ec4899',
            sparkValues: (
                summary.sparkline_promotions ?? getRandomSparkData()
            ).map((d: any) => d.value),
        },
        {
            title: 'Clients récurrents',
            value: returning_customers.toLocaleString(),
            icon: <UserCheck className="h-5 w-5 text-teal-500" />,
            trend: returning_change,
            sub: '≥ 2 commandes',
            sparkColor: '#14b8a6',
            sparkValues: (
                summary.sparkline_returning ?? getRandomSparkData()
            ).map((d: any) => d.value),
        },
        {
            title: 'Revenu / client',
            value: formatCurrency(revenue_per_customer),
            icon: <DollarSign className="h-5 w-5 text-emerald-500" />,
            trend: 0,
            sub: 'chiffre d’affaires par client',
            sparkColor: '#10b981',
            sparkValues: (
                summary.sparkline_revenue_per_customer ?? getRandomSparkData()
            ).map((d: any) => d.value),
        },
        {
            title: 'Sans image',
            value: products_without_image.toLocaleString(),
            icon: <ImageOff className="h-5 w-5 text-slate-500" />,
            trend: 0,
            sub: 'produits sans photo',
            sparkColor: '#64748b',
            sparkValues: (
                summary.sparkline_no_image ?? getRandomSparkData()
            ).map((d: any) => d.value),
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, index) => (
                <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                >
                    <Card className="group relative overflow-hidden border-0 bg-slate-50/60 transition-colors duration-200 hover:bg-white dark:bg-slate-900/40 dark:hover:bg-slate-900/80">
                        <CardHeader className="flex flex-row items-start justify-between space-y-0 p-4 pb-2">
                            <div>
                                <CardDescription className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                                    {card.icon}
                                    {card.title}
                                </CardDescription>
                                <CardTitle className="mt-1 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {card.value}
                                </CardTitle>
                            </div>
                            <div className="flex flex-col items-end gap-1.5">
                                <Badge
                                    variant="outline"
                                    className={`flex items-center gap-0.5 px-1.5 py-0 text-[10px] leading-none ${
                                        card.trend >= 0
                                            ? 'border-emerald-200 text-emerald-700 dark:border-emerald-800 dark:text-emerald-400'
                                            : 'border-red-200 text-red-700 dark:border-red-800 dark:text-red-400'
                                    }`}
                                >
                                    {card.trend >= 0 ? (
                                        <TrendingUp className="h-3 w-3" />
                                    ) : (
                                        <TrendingDown className="h-3 w-3" />
                                    )}
                                    {Math.abs(card.trend)}%
                                </Badge>
                                <SparkLine
                                    values={card.sparkValues}
                                    color={card.sparkColor}
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="px-4 pb-3">
                            <p className="text-xs text-slate-400 dark:text-slate-500">
                                {card.sub}
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}
