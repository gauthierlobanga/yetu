/* eslint-disable react-hooks/static-components */
// resources/js/Pages/Vendor/Statistics/Partials/TopProductsChart.tsx

import { TrendingUp, Package2 } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from 'recharts';

import { Badge } from '@/components/ui/badge';
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
    '#06b6d4',
    '#3b82f6',
    '#8b5cf6',
    '#14b8a6',
    '#f59e0b',
    '#ec4899',
    '#6366f1',
    '#0ea5e9',
    '#22c55e',
];

export function TopProductsChart({ data }: Props) {
    if (!data || data.length === 0) {
        return (
            <Card className="border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                <CardHeader className="border-b border-slate-100 px-4 pt-4 pb-2 dark:border-slate-800">
                    <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                        Produits les plus vendus
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
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

    const totalViews = sorted.reduce(
        (sum, product) => sum + product.views_count,
        0,
    );

    const chartData = sorted.map((product, idx) => ({
        name:
            product.title.length > 18
                ? `${product.title.substring(0, 18)}…`
                : product.title,
        fullName: product.title,
        value: product.views_count,
        fill: COLORS[idx % COLORS.length],
    }));

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const d = payload[0].payload;

            return (
                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
                    <p className="mb-1 font-medium text-slate-900 dark:text-white">
                        {d.fullName}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
                        <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: d.fill }}
                        />
                        {d.value} ventes
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <Card className="border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
            <CardHeader className="flex flex-row items-start justify-between gap-4 border-b border-slate-100 px-4 pt-4 pb-2 dark:border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-50 dark:bg-cyan-950">
                        <Package2 className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <div>
                        <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                            Produits les plus vendus
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                            Top 10 par quantités vendues
                        </CardDescription>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
                        {totalViews} ventes
                    </Badge>
                    <Badge className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400">
                        <TrendingUp className="mr-1 h-3 w-3" />
                        {average}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="px-10 py-10">
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{ top: 30, right: 40, left: -2, bottom: 20 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#e2e8f0"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="name"
                                tick={{ fontSize: 14, fill: '#94a3b8' }}
                                axisLine={false}
                                tickLine={false}
                                interval={0}
                                angle={-28}
                                textAnchor="end"
                                height={60}
                            />
                            <YAxis
                                tick={{ fontSize: 14, fill: '#94a3b8' }}
                                axisLine={false}
                                tickLine={false}
                                width={40}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(148,163,184,0.06)', radius: 4 }}
                                content={<CustomTooltip />}
                            />
                            <ReferenceLine
                                y={average}
                                stroke="#f59e0b"
                                strokeDasharray="4 4"
                                strokeOpacity={0.7}
                                label={{
                                    value: 'Moy.',
                                    fill: '#f59e0b',
                                    fontSize: 10,
                                    position: 'right',
                                }}
                            />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={70}>
                                {chartData.map((entry, idx) => (
                                    <rect key={idx} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
