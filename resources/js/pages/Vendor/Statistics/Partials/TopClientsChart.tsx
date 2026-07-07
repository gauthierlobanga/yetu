/* eslint-disable react-hooks/static-components */
// resources/js/Pages/Vendor/Statistics/Partials/TopClientsChart.tsx

import { Crown, TrendingUp, Users } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';

import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';

interface TopClient {
    id: number | string;
    name: string;
    avatar_url?: string | null;
    total_spent: number;
    orders_count: number;
}

interface Props {
    data: TopClient[];
}

const GRADIENT_COLORS = [
    ['#10b981', '#34d399'],
    ['#3b82f6', '#60a5fa'],
    ['#8b5cf6', '#a78bfa'],
    ['#f59e0b', '#fbbf24'],
    ['#06b6d4', '#22d3ee'],
];

const safeNumber = (v: any) => Number(v ?? 0) || 0;

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('fr-CD', {
        style: 'currency',
        currency: 'CDF',
        maximumFractionDigits: 0,
    }).format(value);

const formatCompactCurrency = (value: number) =>
    new Intl.NumberFormat('fr-CD', {
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(value);

export function TopClientsChart({ data }: Props) {
    if (!data || data.length === 0) {
        return (
            <Card className="border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                <CardHeader className="px-4 pt-4 pb-2">
                    <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                        Meilleurs clients
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                        Aucune donnée disponible
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    const sorted = [...data]
        .map((client) => ({
            ...client,
            total_spent: safeNumber(client.total_spent),
            orders_count: safeNumber(client.orders_count),
        }))
        .sort((a, b) => b.total_spent - a.total_spent)
        .slice(0, 8);

    const totalRevenue = sorted.reduce(
        (sum, client) => sum + client.total_spent,
        0,
    );
    const totalOrders = sorted.reduce(
        (sum, client) => sum + client.orders_count,
        0,
    );
    const bestClient = sorted[0];

    const chartData = sorted
        .map((client, idx) => ({
            name:
                client.name.length > 16
                    ? `${client.name.slice(0, 16)}…`
                    : client.name,
            fullName: client.name,
            value: client.total_spent,
            orders: client.orders_count,
            gradientId: `gradient-client-${idx}`,
            gradientColors: GRADIENT_COLORS[idx % GRADIENT_COLORS.length],
        }))
        .reverse();

    const CustomTooltip = ({ active, payload }: any) => {
        if (!active || !payload?.length) {
            return null;
        }

        const d = payload[0].payload;

        return (
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
                <p className="font-medium text-slate-900 dark:text-white">
                    {d.fullName}
                </p>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(d.value)}
                    </span>{' '}
                    · {d.orders} commandes
                </div>
            </div>
        );
    };

    return (
        <Card className="border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
            <CardHeader className="flex flex-row items-start justify-between gap-4 border-b border-slate-100 px-4 pb-2 dark:border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950">
                        <Crown className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                        <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                            Meilleurs clients
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                            Clients générant le plus de revenus
                        </CardDescription>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
                        <TrendingUp className="mr-1 h-3 w-3" />
                        {formatCompactCurrency(totalRevenue)}
                    </Badge>
                    <Badge className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                        <Users className="mr-1 h-3 w-3" />
                        {totalOrders}
                    </Badge>
                </div>
            </CardHeader>

            {/* Meilleur client */}
            <div className="flex items-center gap-3 border-b border-slate-100 px-4 dark:border-slate-800">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950">
                    <Crown className="h-4 w-4 text-amber-500" />
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {bestClient?.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Meilleur client
                    </p>
                </div>
            </div>

            <CardContent className="px-4 py-3">
                <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            layout="vertical"
                            margin={{ top: 5, right: 10, left: 20, bottom: 5 }}
                            barCategoryGap={8}
                        >
                            <defs>
                                {chartData.map((entry) => (
                                    <linearGradient
                                        key={entry.gradientId}
                                        id={entry.gradientId}
                                        x1="0"
                                        y1="0"
                                        x2="1"
                                        y2="0"
                                    >
                                        <stop
                                            offset="0%"
                                            stopColor={entry.gradientColors[0]}
                                            stopOpacity={0.9}
                                        />
                                        <stop
                                            offset="100%"
                                            stopColor={entry.gradientColors[1]}
                                            stopOpacity={1}
                                        />
                                    </linearGradient>
                                ))}
                            </defs>
                            <CartesianGrid
                                horizontal={false}
                                stroke="#e2e8f0"
                            />
                            <XAxis
                                type="number"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: '#94a3b8' }}
                                tickFormatter={formatCompactCurrency}
                            />
                            <YAxis
                                dataKey="name"
                                type="category"
                                width={110}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: '#94a3b8' }}
                            />
                            <Tooltip
                                cursor={{
                                    fill: 'rgba(148,163,184,0.06)',
                                    radius: 8,
                                }}
                                content={<CustomTooltip />}
                            />
                            <Bar
                                dataKey="value"
                                radius={[0, 8, 8, 0]}
                                barSize={18}
                            >
                                {chartData.map((entry, idx) => (
                                    <Cell
                                        key={idx}
                                        fill={`url(#${entry.gradientId})`}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
