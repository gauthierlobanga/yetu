'use client';

import { useTheme } from 'next-themes';
import { Line, LineChart, CartesianGrid, XAxis } from 'recharts';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';

interface MonthlyPost {
    month_name: string;
    count: number;
}

export function ChartMonthlyPosts({ data }: { data: MonthlyPost[] }) {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';
    const gridColor = isDark ? 'rgba(148,163,184,0.2)' : '#e2e8f0';

    const totalPosts = data.reduce((sum, d) => sum + d.count, 0);

    const chartConfig = {
        count: { label: 'Articles', color: '#10b981' },
    };

    if (!data || data.length === 0) {
        return (
            <Card className="border-0 bg-slate-50/60 dark:bg-slate-900/40">
                <CardHeader className="px-4 pt-4 pb-2">
                    <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                        Publications mensuelles
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                        Aucune donnée disponible
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card className="border-0 bg-slate-50/60 dark:bg-slate-900/40">
            <CardHeader className="border-b border-slate-200/60 dark:border-slate-800/60 px-4 pt-4 pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                            Publications mensuelles
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                            {new Date().getFullYear()} · {totalPosts} article{totalPosts > 1 ? 's' : ''}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-4 py-3">
                <ChartContainer config={chartConfig} className="h-56 w-full">
                    <LineChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                        <defs>
                            {/* Filtre d'ombre pour le point actif */}
                            <filter id="dotShadow" x="-50%" y="-50%" width="200%" height="200%">
                                <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#10b981" floodOpacity="0.4" />
                            </filter>
                        </defs>
                        <CartesianGrid
                            vertical={false}
                            stroke={gridColor}
                            strokeDasharray="2 2"
                            strokeWidth={0.5}
                        />
                        <XAxis
                            dataKey="month_name"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 11, fill: '#94a3b8' }}
                        />
                        <ChartTooltip
                            cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }}
                            content={
                                <ChartTooltipContent
                                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs shadow-sm dark:border-slate-700 dark:bg-slate-900"
                                    formatter={(value) => [`${value} article${value !== 1 ? 's' : ''}`, 'Articles']}
                                />
                            }
                        />
                        <Line
                            dataKey="count"
                            type="monotone"
                            stroke={chartConfig.count.color}
                            strokeWidth={2}
                            dot={{ r: 4, strokeWidth: 0, fill: chartConfig.count.color }}
                            activeDot={{
                                r: 6,
                                strokeWidth: 2,
                                fill: '#ffffff',
                                stroke: chartConfig.count.color,
                                filter: 'url(#dotShadow)', // ajout du filtre
                            }}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
