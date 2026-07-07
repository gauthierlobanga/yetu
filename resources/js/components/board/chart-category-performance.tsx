'use client';

import { Eye, Heart, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

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
import type { ChartConfig } from '@/components/ui/chart';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface CategoryPerf {
    nom: string;
    posts_count: number;
    total_views: number;
    total_likes: number;
    total_comments: number;
}

type MetricType = 'vues' | 'likes' | 'commentaires';

const metricLabels: Record<MetricType, string> = {
    vues: 'Vues',
    likes: 'Likes',
    commentaires: 'Commentaires',
};

const metricColors: Record<MetricType, string> = {
    vues: '#10b981',
    likes: '#3b82f6',
    commentaires: '#f59e0b',
};

export function ChartCategoryPerformance({ data }: { data: CategoryPerf[] }) {
    const [activeMetric, setActiveMetric] = useState<MetricType>('vues');

    const chartData = data.slice(0, 10).map((cat) => ({
        category: cat.nom.length > 15 ? cat.nom.substring(0, 15) + '...' : cat.nom,
        vues: cat.total_views,
        likes: cat.total_likes,
        commentaires: cat.total_comments,
        fullName: cat.nom,
        posts_count: cat.posts_count,
    }));

    const chartConfig = {
        [activeMetric]: {
            label: metricLabels[activeMetric],
            color: metricColors[activeMetric],
        },
    } satisfies ChartConfig;

    return (
        <Card className="border-0 bg-slate-50/60 dark:bg-slate-900/40">
            <CardHeader className="flex flex-row items-start justify-between gap-4 border-b border-slate-200/60 px-4 pt-4 pb-2 dark:border-slate-800/60">
                <div>
                    <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                        Performance des catégories
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                        Top 10 catégories par activité
                    </CardDescription>
                </div>
                <ToggleGroup
                    type="single"
                    value={activeMetric}
                    onValueChange={(value) => value && setActiveMetric(value as MetricType)}
                    variant="outline"
                    className="hidden gap-0 rounded-xl bg-slate-100 p-0.5 sm:flex dark:bg-slate-800"
                >
                    <ToggleGroupItem value="vues" className="rounded-lg px-3 py-1 text-xs">
                        <Eye className="mr-1 h-3 w-3" />
                        Vues
                    </ToggleGroupItem>
                    <ToggleGroupItem value="likes" className="rounded-lg px-3 py-1 text-xs">
                        <Heart className="mr-1 h-3 w-3" />
                        Likes
                    </ToggleGroupItem>
                    <ToggleGroupItem value="commentaires" className="rounded-lg px-3 py-1 text-xs">
                        <MessageCircle className="mr-1 h-3 w-3" />
                        Comm.
                    </ToggleGroupItem>
                </ToggleGroup>
            </CardHeader>
            <CardContent className="px-4 py-3">
                <ChartContainer config={chartConfig} className="h-72 w-full">
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ left: 100, right: 20, top: 5, bottom: 5 }}
                    >
                        <CartesianGrid horizontal={false} stroke="#e2e8f0" strokeDasharray="2 2" />
                        <YAxis
                            dataKey="category"
                            type="category"
                            width={100}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tick={{ fontSize: 11, fill: '#94a3b8' }}
                        />
                        <XAxis
                            type="number"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 11, fill: '#94a3b8' }}
                            tickFormatter={(value) => value.toLocaleString()}
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
                                                <p className="text-slate-500">{data?.posts_count || 0} article(s)</p>
                                            </div>
                                        );
                                    }}
                                    formatter={(value) => [
                                        `${value.toLocaleString()} ${metricLabels[activeMetric].toLowerCase()}`,
                                        '',
                                    ]}
                                />
                            }
                        />
                        <Bar
                            dataKey={activeMetric}
                            fill={metricColors[activeMetric]}
                            radius={[0, 4, 4, 0]}
                            barSize={16}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
