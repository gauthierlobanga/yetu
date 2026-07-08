// resources/js/Pages/Vendor/Statistics/Partials/SummaryCards.tsx
import { motion } from 'motion/react';
import {
    TrendingUp,
    TrendingDown,
    Users,
    Banknote,
    Package,
    Eye,
} from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';

// ----------------------------------------------------------------------
// Carte individuelle (design épuré)
// ----------------------------------------------------------------------
function SummaryCard({
    title,
    value,
    change,
    sub,
    icon,
    sparklineData,
    color,
}: {
    title: string;
    value: string;
    change: number;
    sub: string;
    icon: React.ReactNode;
    sparklineData: { value: number }[];
    color: string;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="group relative overflow-hidden border-0 bg-slate-50/60 transition-colors duration-200 hover:bg-white dark:bg-slate-900/40 dark:hover:bg-slate-900/80">
                <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                                {icon}
                                {title}
                            </div>
                            <div className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                {value}
                            </div>
                            <div className="flex items-center gap-1 text-xs">
                                {change >= 0 ? (
                                    <TrendingUp className="h-3 w-3 text-emerald-500" />
                                ) : (
                                    <TrendingDown className="h-3 w-3 text-red-500" />
                                )}
                                <span
                                    className={
                                        change >= 0
                                            ? 'font-medium text-emerald-600'
                                            : 'font-medium text-red-600'
                                    }
                                >
                                    {change}%
                                </span>
                                <span className="text-slate-400 dark:text-slate-500">
                                    {sub}
                                </span>
                            </div>
                        </div>
                        {/* Sparkline */}
                        <div className="h-12 w-20">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={sparklineData}
                                    margin={{
                                        top: 0,
                                        right: 0,
                                        bottom: 0,
                                        left: 0,
                                    }}
                                >
                                    <defs>
                                        <linearGradient
                                            id={`grad-${title.replace(/\s/g, '')}`}
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor={color}
                                                stopOpacity={0.3}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor={color}
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <Area
                                        dataKey="value"
                                        type="monotone"
                                        stroke={color}
                                        fill={`url(#grad-${title.replace(/\s/g, '')})`}
                                        strokeWidth={1.5}
                                        dot={false}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

// ----------------------------------------------------------------------
// Composant principal
// ----------------------------------------------------------------------
interface Props {
    summary: {
        total_visitors: number;
        total_sales: number;
        total_customers: number;
        total_products: number;
        visitors_change: number;
        sales_change: number;
        customers_change: number;
        products_change: number;
        sparkline_visitors: { value: number }[];
        sparkline_sales: { value: number }[];
        sparkline_customers: { value: number }[];
        sparkline_products: { value: number }[];
    };
}

export function SummaryCards({ summary }: Props) {
    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('fr-CD', {
            style: 'currency',
            currency: 'CDF',
        }).format(val);

    const cards = [
        {
            title: 'Visiteur total',
            value: summary.total_visitors.toLocaleString(),
            change: summary.visitors_change,
            sub: "Par rapport à l'année dernière",
            icon: <Eye className="h-4 w-4 text-blue-500" />,
            sparklineData: summary.sparkline_visitors,
            color: '#3b82f6',
        },
        {
            title: 'Ventes totales',
            value: formatCurrency(summary.total_sales),
            change: summary.sales_change,
            sub: "Par rapport à l'année dernière",
            icon: <Banknote className="h-4 w-4 text-emerald-500" />,
            sparklineData: summary.sparkline_sales,
            color: '#10b981',
        },
        {
            title: 'Client total',
            value: summary.total_customers.toLocaleString(),
            change: summary.customers_change,
            sub: "Par rapport à l'année dernière",
            icon: <Users className="h-4 w-4 text-purple-500" />,
            sparklineData: summary.sparkline_customers,
            color: '#8b5cf6',
        },
        {
            title: 'Produit total',
            value: summary.total_products.toLocaleString(),
            change: summary.products_change,
            sub: "Par rapport à l'année dernière",
            icon: <Package className="h-4 w-4 text-emerald-500" />,
            sparklineData: summary.sparkline_products,
            color: '#059669',
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
                <SummaryCard key={card.title} {...card} />
            ))}
        </div>
    );
}
