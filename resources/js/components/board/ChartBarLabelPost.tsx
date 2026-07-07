/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import { usePage } from '@inertiajs/react';
import { TrendingUp, Eye, Heart, MessageCircle } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    LabelList,
    XAxis,
    YAxis,
} from 'recharts';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

interface TopPost {
    id: number;
    title: string;
    slug: string;
    views_count: number;
    likes_count: number;
    comments_count: number;
    user: {
        id: number;
        name: string;
        email: string;
        avatar_url: string | null;
    };
    published_at: string | null;
}

interface ChartBarLabelProps {
    topPosts?: TopPost[];
}

type MetricType = 'views_count' | 'likes_count' | 'comments_count';

const metricLabels: Record<MetricType, string> = {
    views_count: 'Vues',
    likes_count: 'Likes',
    comments_count: 'Commentaires',
};

const metricColors: Record<MetricType, string> = {
    views_count: '#10b981',
    likes_count: '#3b82f6',
    comments_count: '#f59e0b',
};

export function ChartBarLabel({ topPosts: propTopPosts }: ChartBarLabelProps) {
    const { props } = usePage<{ topPosts?: TopPost[] }>();
    const topPosts = propTopPosts || props.topPosts;
    const [activeMetric, setActiveMetric] = useState<MetricType>('views_count');

    const chartData = useMemo(() => {
        if (!topPosts || topPosts.length === 0) {
            return [];
        }

        return topPosts.slice(0, 10).map((post) => ({
            title:
                post.title.length > 20
                    ? post.title.substring(0, 20) + '...'
                    : post.title,
            fullTitle: post.title,
            value: (post as any)[activeMetric] || 0,
            author: post.user?.name || 'Anonyme',
            authorAvatar: post.user?.avatar_url || null,
            id: post.id,
            slug: post.slug,
        }));
    }, [topPosts, activeMetric]);

    const totalMetric = useMemo(() => {
        if (!topPosts) {
            return 0;
        }

        return topPosts.reduce(
            (sum, post) => sum + ((post as any)[activeMetric] || 0),
            0,
        );
    }, [topPosts, activeMetric]);

    const averageMetric = useMemo(() => {
        if (!topPosts || topPosts.length === 0) {
            return 0;
        }

        return Math.round(totalMetric / topPosts.length);
    }, [totalMetric, topPosts]);

    if (!topPosts || topPosts.length === 0) {
        return (
            <Card className="border-0 bg-slate-50/60 dark:bg-slate-900/40">
                <CardHeader className="px-4 pt-4 pb-2">
                    <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                        Top des articles
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                        Aucun article trouvé
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    const chartConfig = {
        value: {
            label: metricLabels[activeMetric],
            color: metricColors[activeMetric],
        },
    } satisfies ChartConfig;

    return (
        <Card className="border-0 bg-slate-50/60 dark:bg-slate-900/40">
            <CardHeader className="flex flex-row items-start justify-between gap-4 border-b border-slate-200/60 px-4 pt-4 pb-2 dark:border-slate-800/60">
                <div>
                    <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                        Top {Math.min(10, topPosts.length)} articles
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                        Total : {totalMetric.toLocaleString()}{' '}
                        {metricLabels[activeMetric].toLowerCase()}
                    </CardDescription>
                </div>
                <ToggleGroup
                    type="single"
                    value={activeMetric}
                    onValueChange={(value) =>
                        value && setActiveMetric(value as MetricType)
                    }
                    variant="outline"
                    className="hidden gap-0 rounded-xl bg-slate-100 p-0.5 sm:flex dark:bg-slate-800"
                >
                    <ToggleGroupItem
                        value="views_count"
                        className="rounded-lg px-3 py-1 text-xs"
                    >
                        <Eye className="mr-1 h-3 w-3" /> Vues
                    </ToggleGroupItem>
                    <ToggleGroupItem
                        value="likes_count"
                        className="rounded-lg px-3 py-1 text-xs"
                    >
                        <Heart className="mr-1 h-3 w-3" /> Likes
                    </ToggleGroupItem>
                    <ToggleGroupItem
                        value="comments_count"
                        className="rounded-lg px-3 py-1 text-xs"
                    >
                        <MessageCircle className="mr-1 h-3 w-3" /> Comm.
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
                        <CartesianGrid
                            horizontal={false}
                            stroke="#e2e8f0"
                            strokeDasharray="2 2"
                        />
                        <YAxis
                            dataKey="title"
                            type="category"
                            tickLine={false}
                            tickMargin={8}
                            axisLine={false}
                            width={90}
                            tick={{ fontSize: 11, fill: '#94a3b8' }}
                        />
                        <XAxis
                            dataKey="value"
                            type="number"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 11, fill: '#94a3b8' }}
                            tickFormatter={(value) =>
                                value?.toLocaleString() || '0'
                            }
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
                                                <p className="font-medium">
                                                    {data?.fullTitle || label}
                                                </p>
                                                <div className="flex items-center gap-1 text-slate-500">
                                                    {data?.authorAvatar && (
                                                        <Avatar className="h-4 w-4">
                                                            <AvatarImage
                                                                src={
                                                                    data.authorAvatar
                                                                }
                                                            />
                                                            <AvatarFallback className="text-[10px]">
                                                                {data?.author?.charAt(
                                                                    0,
                                                                ) || '?'}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    )}
                                                    <span>
                                                        Par{' '}
                                                        {data?.author ||
                                                            'Anonyme'}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    }}
                                    formatter={(value) => [
                                        `${(value as number).toLocaleString()} ${metricLabels[activeMetric].toLowerCase()}`,
                                        '',
                                    ]}
                                />
                            }
                        />
                        <Bar
                            dataKey="value"
                            fill={metricColors[activeMetric]}
                            radius={[0, 4, 4, 0]}
                            barSize={18}
                        >
                            <LabelList
                                dataKey="value"
                                position="right"
                                offset={6}
                                className="fill-slate-500 text-[11px]"
                                formatter={(value: any) =>
                                    Number(value).toLocaleString()
                                }
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-1 border-t border-slate-200/60 px-4 py-2 text-xs text-slate-500 dark:border-slate-800/60">
                <div className="flex gap-2 font-medium">
                    Moyenne : {averageMetric.toLocaleString()}{' '}
                    {metricLabels[activeMetric].toLowerCase()} par article
                    <TrendingUp className="h-3.5 w-3.5" />
                </div>
                <div>
                    Top {Math.min(10, topPosts.length)} articles les plus{' '}
                    {metricLabels[activeMetric].toLowerCase()}s
                </div>
            </CardFooter>
        </Card>
    );
}
