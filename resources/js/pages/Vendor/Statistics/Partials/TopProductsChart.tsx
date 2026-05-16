/* eslint-disable react-hooks/static-components */
// resources/js/Pages/Vendor/Statistics/Partials/TopProductsChart.tsx
import { TrendingUp } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    ReferenceLine,
} from 'recharts';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';

interface TopProduct {
    id: number | string;
    title: string;
    views_count: number;
    slug?: string;
}

interface Props {
    data: TopProduct[];
}

const COLORS = [
    '#10b981',
    '#3b82f6',
    '#8b5cf6',
    '#f59e0b',
    '#06b6d4',
    '#ef4444',
    '#ec4899',
    '#14b8a6',
    '#f97316',
    '#6366f1',
];

export function TopProductsChart({ data }: Props) {
    if (!data || data.length === 0) {
        return (
            <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader>
                    <CardTitle className="text-slate-800 dark:text-white">
                        Produits les plus vendus
                    </CardTitle>
                    <CardDescription className="text-slate-500 dark:text-slate-400">
                        Aucune donnée disponible
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    const sorted = [...data]
        .sort((a, b) => b.views_count - a.views_count)
        .slice(0, 10);
    const average = Math.round(
        sorted.reduce((sum, p) => sum + p.views_count, 0) / sorted.length,
    );

    const chartData = sorted.map((product, idx) => ({
        name:
            product.title.length > 20
                ? product.title.substring(0, 20) + '…'
                : product.title,
        fullName: product.title,
        value: product.views_count,
        fill: COLORS[idx % COLORS.length],
    }));

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const d = payload[0].payload;

            return (
                <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                    <p className="font-medium text-slate-800 dark:text-white">
                        {d.fullName}
                    </p>
                    <p className="text-emerald-600 dark:text-emerald-400">
                        {d.value} vendus
                    </p>
                </div>
            );
        }

        return null;
    };

    return (
        <Card className="border-slate-200 shadow-sm dark:border-slate-800">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white">
                    Produits les plus vendus
                </CardTitle>
                <CardDescription className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span>Top 10 par quantités vendues</span>
                    <span className="flex items-center gap-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        <TrendingUp className="h-4 w-4" />
                        Moyenne : {average}
                    </span>
                </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e2e8f0"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 12, fill: '#64748b' }}
                            angle={-25}
                            textAnchor="end"
                            height={60}
                        />
                        <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                        <Tooltip content={<CustomTooltip />} />
                        <ReferenceLine
                            y={average}
                            stroke="#f59e0b"
                            strokeDasharray="4 4"
                            label={{
                                value: 'Moyenne',
                                fill: '#f59e0b',
                                fontSize: 12,
                            }}
                        />
                        <Bar dataKey="value" barSize={30} radius={[6, 6, 0, 0]}>
                            {chartData.map((entry, idx) => (
                                <Cell key={idx} fill={entry.fill} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
