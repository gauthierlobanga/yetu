/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/Pages/Vendor/Statistics/Partials/ChartRevenueOverTime.tsx

import { TrendingUp, Wallet, ShoppingCart, Activity } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from 'recharts';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface SalesPoint {
    date: string;
    revenue: number;
    orders: number;
}

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

export function ChartRevenueOverTime({ data }: { data: SalesPoint[] }) {
    const [range, setRange] = useState('90d');

    const filtered = useMemo(() => {
        const now = new Date();
        const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;

        return data.filter((d) => {
            const dDate = new Date(d.date);

            return dDate >= new Date(now.getTime() - days * 86400000);
        });
    }, [data, range]);

    const totalRevenue = filtered.reduce((sum, item) => sum + item.revenue, 0);
    const totalOrders = filtered.reduce((sum, item) => sum + item.orders, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const growth =
        filtered.length >= 2
            ? (
                  ((filtered[filtered.length - 1]?.revenue -
                      filtered[0]?.revenue) /
                      Math.max(filtered[0]?.revenue, 1)) *
                  100
              ).toFixed(1)
            : '0';

    return (
        <Card className="border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
            <CardHeader className="flex flex-row items-start justify-between gap-4 border-b border-slate-100 px-4 dark:border-slate-800">
                <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
                        <Activity className="h-3 w-3" />
                        Analytics temps réel
                    </div>
                    <CardTitle className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">
                        Chiffre d'affaires
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                        Évolution des revenus et commandes
                    </CardDescription>
                </div>
                <ToggleGroup
                    type="single"
                    value={range}
                    onValueChange={(value) => {
                        if (value) {
                            setRange(value);
                        }
                    }}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-700 dark:bg-slate-900"
                >
                    <ToggleGroupItem
                        value="7d"
                        className="rounded-md px-3 py-1 text-xs font-medium data-[state=on]:bg-emerald-500 data-[state=on]:text-white"
                    >
                        7j
                    </ToggleGroupItem>
                    <ToggleGroupItem
                        value="30d"
                        className="rounded-md px-3 py-1 text-xs font-medium data-[state=on]:bg-emerald-500 data-[state=on]:text-white"
                    >
                        30j
                    </ToggleGroupItem>
                    <ToggleGroupItem
                        value="90d"
                        className="rounded-md px-3 py-1 text-xs font-medium data-[state=on]:bg-emerald-500 data-[state=on]:text-white"
                    >
                        3m
                    </ToggleGroupItem>
                </ToggleGroup>
            </CardHeader>

            {/* Stats rapides */}
            <div className="grid grid-cols-3 gap-2 border-b border-slate-100 px-4 dark:border-slate-800">
                <div className="flex flex-col items-center rounded-md bg-slate-50 px-2 py-1.5 dark:bg-slate-900">
                    <Wallet className="h-3.5 w-3.5 text-emerald-500" />
                    <span className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                        {formatCompactCurrency(totalRevenue)}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        Revenus
                    </span>
                </div>
                <div className="flex flex-col items-center rounded-md bg-slate-50 px-2 py-1.5 dark:bg-slate-900">
                    <ShoppingCart className="h-3.5 w-3.5 text-cyan-500" />
                    <span className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                        {totalOrders}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        Commandes
                    </span>
                </div>
                <div className="flex flex-col items-center rounded-md bg-slate-50 px-2 py-1.5 dark:bg-slate-900">
                    <TrendingUp className="h-3.5 w-3.5 text-violet-500" />
                    <span className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                        {formatCompactCurrency(averageOrderValue)}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        Panier moy.
                    </span>
                </div>
            </div>

            <CardContent className="px-2 pt-4 pb-2 sm:px-4">
                <ChartContainer
                    config={{
                        revenue: { label: 'Revenus', color: '#10b981' },
                    }}
                    className="h-64 w-full"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={filtered}
                            margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient
                                    id="fillRevenue"
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
                                vertical={false}
                                strokeDasharray="3 3"
                                stroke="#e2e8f0"
                            />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tick={{ fontSize: 11, fill: '#94a3b8' }}
                                tickFormatter={(value) =>
                                    new Date(value).toLocaleDateString(
                                        'fr-FR',
                                        {
                                            day: '2-digit',
                                            month: 'short',
                                        },
                                    )
                                }
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                width={60}
                                tick={{ fontSize: 11, fill: '#94a3b8' }}
                                tickFormatter={(value) =>
                                    formatCompactCurrency(value)
                                }
                            />
                            <ChartTooltip
                                cursor={{
                                    stroke: '#10b981',
                                    strokeWidth: 1,
                                    strokeDasharray: '4 4',
                                }}
                                content={
                                    <ChartTooltipContent
                                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-900"
                                        formatter={(value) => [
                                            formatCurrency(Number(value)),
                                            'Revenus',
                                        ]}
                                        labelFormatter={(label) =>
                                            new Date(label).toLocaleDateString(
                                                'fr-FR',
                                                {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                },
                                            )
                                        }
                                    />
                                }
                            />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stroke="#10b981"
                                strokeWidth={2}
                                fill="url(#fillRevenue)"
                                activeDot={{
                                    r: 4,
                                    strokeWidth: 2,
                                    fill: '#10b981',
                                    stroke: '#fff',
                                }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
