'use client';

import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export interface ChartDataPoint {
    date: string;
    views: number;
    likes: number;
    comments: number;
}

const chartConfig = {
    views: {
        label: 'Vues',
        color: '#10b981',
    },
    likes: {
        label: "J'aime",
        color: '#3b82f6',
    },
    comments: {
        label: 'Commentaires',
        color: '#f59e0b',
    },
} satisfies ChartConfig;

export function ChartAreaInteractive({
    chartData,
}: {
    chartData: ChartDataPoint[];
}) {
    const [timeRange, setTimeRange] = React.useState('90d');

    const filteredData = chartData.filter((item) => {
        const date = new Date(item.date);
        const maxDate =
            chartData.length > 0
                ? new Date(
                      Math.max(
                          ...chartData.map((d) => new Date(d.date).getTime()),
                      ),
                  )
                : new Date();
        const referenceDate = maxDate;
        let daysToSubtract = 90;

        if (timeRange === '30d') {
            daysToSubtract = 30;
        } else if (timeRange === '7d') {
            daysToSubtract = 7;
        }

        const startDate = new Date(referenceDate);
        startDate.setDate(startDate.getDate() - daysToSubtract);

        return date >= startDate;
    });

    return (
        <Card className="border-0 bg-slate-50/60 dark:bg-slate-900/40">
            <CardHeader className="flex flex-row items-start justify-between gap-4 border-b border-slate-200/60 px-4 pt-4 pb-3 dark:border-slate-800/60">
                <div>
                    <CardTitle className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">
                        Statistiques du blog
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                        Évolution des vues, likes et commentaires
                    </CardDescription>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-30 rounded-xl border-slate-200 bg-white/90 text-xs dark:border-slate-700 dark:bg-slate-900/90">
                        <SelectValue placeholder="Période" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="90d" className="rounded-lg text-xs">
                            3 mois
                        </SelectItem>
                        <SelectItem value="30d" className="rounded-lg text-xs">
                            30 jours
                        </SelectItem>
                        <SelectItem value="7d" className="rounded-lg text-xs">
                            7 jours
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-4">
                <ChartContainer config={chartConfig} className="h-64 w-full">
                    <AreaChart
                        data={filteredData}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                        <defs>
                            {(['views', 'likes', 'comments'] as const).map(
                                (key) => (
                                    <linearGradient
                                        key={key}
                                        id={`fill${key}`}
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor={chartConfig[key].color}
                                            stopOpacity={0.3}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor={chartConfig[key].color}
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                ),
                            )}
                        </defs>
                        <CartesianGrid
                            vertical={false}
                            stroke="#e2e8f0"
                            strokeDasharray="2 2"
                            strokeOpacity={0.6}
                            strokeWidth={0.5}
                        />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tick={{ fontSize: 11, fill: '#94a3b8' }}
                            tickFormatter={(value) =>
                                new Date(value).toLocaleDateString('fr-FR', {
                                    day: '2-digit',
                                    month: 'short',
                                })
                            }
                        />
                        <ChartTooltip
                            cursor={{
                                stroke: '#cbd5e1',
                                strokeWidth: 1,
                                strokeDasharray: '4 4',
                            }}
                            content={
                                <ChartTooltipContent
                                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs shadow-sm dark:border-slate-700 dark:bg-slate-900"
                                    labelFormatter={(value) =>
                                        new Date(value).toLocaleDateString(
                                            'fr-FR',
                                            {
                                                weekday: 'long',
                                                day: '2-digit',
                                                month: 'long',
                                            },
                                        )
                                    }
                                    indicator="dot"
                                />
                            }
                        />
                        <Area
                            dataKey="views"
                            type="monotone"
                            fill="url(#fillviews)"
                            stroke={chartConfig.views.color}
                            strokeWidth={2}
                        />
                        <Area
                            dataKey="likes"
                            type="monotone"
                            fill="url(#filllikes)"
                            stroke={chartConfig.likes.color}
                            strokeWidth={2}
                        />
                        <Area
                            dataKey="comments"
                            type="monotone"
                            fill="url(#fillcomments)"
                            stroke={chartConfig.comments.color}
                            strokeWidth={2}
                        />
                        <ChartLegend
                            content={
                                <ChartLegendContent
                                    className="flex flex-row justify-center gap-4 pt-2 text-xs text-slate-500"
                                    payload={undefined}
                                />
                            }
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
