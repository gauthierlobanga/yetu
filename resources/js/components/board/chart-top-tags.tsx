/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { usePage } from '@inertiajs/react';
import { TrendingUp, Hash } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState, useMemo, useEffect } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    LabelList,
    XAxis,
    YAxis,
} from 'recharts';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface TopTag {
    id: number;
    name: string;
    slug: string;
    posts_count: number;
}

interface ChartTopTagsProps {
    topTags?: TopTag[];
}

export function ChartTopTags({ topTags: propTopTags }: ChartTopTagsProps) {
    const { props } = usePage<{ topTags?: TopTag[] }>();
    const topTags = propTopTags || props.topTags;
    const [sortBy, setSortBy] = useState<'count' | 'name'>('count');
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';
    const gridColor = isDark ? 'rgba(148,163,184,0.2)' : '#e2e8f0';

    // Préparer les données
    const chartData = useMemo(() => {
        if (!topTags || topTags.length === 0) {
return [];
}

        const sorted = [...topTags].sort((a, b) => {
            if (sortBy === 'count') {
return b.posts_count - a.posts_count;
}

            return a.name.localeCompare(b.name);
        });

        return sorted.slice(0, 15).map((tag) => ({
            name: tag.name.length > 15 ? tag.name.substring(0, 15) + '...' : tag.name,
            fullName: tag.name,
            count: tag.posts_count,
            id: tag.id,
        }));
    }, [topTags, sortBy]);

    const totalTags = topTags ? topTags.reduce((sum, tag) => sum + tag.posts_count, 0) : 0;
    const averageTags = topTags && topTags.length > 0 ? Math.round(totalTags / topTags.length) : 0;

    const chartConfig = {
        count: { label: "Nombre d'articles", color: '#10b981' },
    } satisfies ChartConfig;

    if (!topTags || topTags.length === 0) {
        return (
            <Card className="border-0 bg-slate-50/60 dark:bg-slate-900/40">
                <CardHeader className="px-4 pt-4 pb-2">
                    <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                        Tags populaires
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                        Aucun tag trouvé
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex h-48 items-center justify-center text-sm text-slate-400">
                        <Hash className="mx-auto h-10 w-10 opacity-40" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-0 bg-slate-50/60 dark:bg-slate-900/40">
            <CardHeader className="flex flex-row items-start justify-between gap-4 border-b border-slate-200/60 px-4 pt-4 pb-2 dark:border-slate-800/60">
                <div>
                    <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                        Tags populaires
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                        Top {Math.min(15, topTags.length)} tags les plus utilisés
                    </CardDescription>
                </div>
                <ToggleGroup
                    type="single"
                    value={sortBy}
                    onValueChange={(value) => value && setSortBy(value as 'count' | 'name')}
                    variant="outline"
                    className="hidden gap-0 rounded-xl bg-slate-100 p-0.5 sm:flex dark:bg-slate-800"
                >
                    <ToggleGroupItem value="count" className="rounded-lg px-3 py-1 text-xs">
                        Popularité
                    </ToggleGroupItem>
                    <ToggleGroupItem value="name" className="rounded-lg px-3 py-1 text-xs">
                        A-Z
                    </ToggleGroupItem>
                </ToggleGroup>
            </CardHeader>
            <CardContent className="px-4 py-3">
                <ChartContainer config={chartConfig} className="h-80 w-full">
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ left: 90, right: 30, top: 5, bottom: 5 }}
                    >
                        <CartesianGrid horizontal={false} stroke={gridColor} strokeDasharray="2 2" strokeWidth={0.5} />
                        <YAxis
                            dataKey="name"
                            type="category"
                            tickLine={false}
                            tickMargin={8}
                            axisLine={false}
                            width={90}
                            tick={{ fontSize: 11, fill: '#94a3b8' }}
                        />
                        <XAxis
                            dataKey="count"
                            type="number"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 11, fill: '#94a3b8' }}
                            tickFormatter={(value) => value?.toLocaleString() || '0'}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs shadow-sm dark:border-slate-700 dark:bg-slate-900"
                                    labelFormatter={(label, payload) => {
                                        const data = payload[0]?.payload;

                                        return (
                                            <div className="space-y-0.5">
                                                <p className="font-medium">{data?.fullName || label}</p>
                                                <p className="text-slate-500">ID: #{data?.id}</p>
                                            </div>
                                        );
                                    }}
                                    formatter={(value) => [
                                        `${value} article${value !== 1 ? 's' : ''}`,
                                        '',
                                    ]}
                                />
                            }
                        />
                        <Bar dataKey="count" fill={chartConfig.count.color} radius={[0, 4, 4, 0]} barSize={18}>
                            <LabelList
                                dataKey="count"
                                position="right"
                                offset={6}
                                className="fill-slate-500 text-[11px]"
                                formatter={(value: any) => Number(value).toLocaleString()}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-1 border-t border-slate-200/60 px-4 py-2 text-xs text-slate-500 dark:border-slate-800/60">
                <div className="flex gap-2 font-medium">
                    Moyenne : {averageTags.toLocaleString()} articles par tag
                    <TrendingUp className="h-3.5 w-3.5" />
                </div>
                <div>Total de {totalTags} articles tagués dans {topTags.length} tags</div>
            </CardFooter>
        </Card>
    );
}
