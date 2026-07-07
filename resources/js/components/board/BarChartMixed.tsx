/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { usePage } from '@inertiajs/react';
import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';

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

interface CategoryStats {
    id: number;
    nom: string;
    slug: string;
    color: string | null;
    posts_count: number;
}

interface ChartBarMixedProps {
    categoriesData?: CategoryStats[];
    totalCategoriesCount?: number; // ajouté
}

const COLORS = [
    '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#06b6d4',
    '#ef4444', '#ec4899', '#6366f1', '#14b8a6', '#84cc16',
];

export function ChartBarMixed({
    categoriesData: propCategoriesData,
    totalCategoriesCount,
}: ChartBarMixedProps) {
    const { props } = usePage<{
        categoriesStats?: CategoryStats[];
        totalCategoriesCount?: number;
    }>();
    const categoriesStats = props.categoriesStats;
    const totalCount = totalCategoriesCount ?? props.totalCategoriesCount ?? 0;
    const chartData = propCategoriesData || categoriesStats || [];

    if (!chartData || chartData.length === 0) {
        return (
            <Card className="border-0 bg-slate-50/60 dark:bg-slate-900/40">
                <CardHeader className="px-4 pt-4 pb-2">
                    <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                        Articles par catégorie
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                        Aucune catégorie trouvée
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex h-48 items-center justify-center text-sm text-slate-400">
                        Aucune catégorie avec des articles
                    </div>
                </CardContent>
            </Card>
        );
    }

    const barData = chartData.map((category, idx) => ({
        category: category.nom,
        posts: category.posts_count,
        fill: category.color || COLORS[idx % COLORS.length],
    }));

    const totalPosts = chartData.reduce((sum, cat) => sum + cat.posts_count, 0);
    const shownCategories = chartData.length; // <=10
    const otherCategories = totalCount - shownCategories;

    const chartConfig = {
        posts: { label: 'Articles' },
        ...Object.fromEntries(
            barData.map((item) => [
                item.category,
                { label: item.category, color: item.fill },
            ])
        ),
    } satisfies ChartConfig;

    return (
        <Card className="border-0 bg-slate-50/60 dark:bg-slate-900/40">
            <CardHeader className="border-b border-slate-200/60 px-4 pt-4 pb-2 dark:border-slate-800/60">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                            Articles par catégorie
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                            {totalPosts} articles dans {totalCount} catégorie{totalCount > 1 ? 's' : ''}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-4 py-3">
                {/* Hauteur augmentée pour plus de lisibilité */}
                <ChartContainer config={chartConfig} className="h-80 w-full">
                    <BarChart
                        data={barData}
                        layout="vertical"
                        margin={{ left: 0 }}
                    >
                        <YAxis
                            dataKey="category"
                            type="category"
                            tickLine={false}
                            tickMargin={8}
                            axisLine={false}
                            width={140}
                            tick={{ fontSize: 11, fill: '#94a3b8' }}
                        />
                        <XAxis dataKey="posts" type="number" hide />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs shadow-sm dark:border-slate-700 dark:bg-slate-900"
                                    formatter={(value, name) => [
                                        `${value} article${value !== 1 ? 's' : ''}`,
                                        name,
                                    ]}
                                />
                            }
                        />
                        <Bar dataKey="posts" radius={[0, 4, 4, 0]} barSize={16}>
                            {barData.map((entry, idx) => (
                                <rect key={idx} fill={entry.fill} />
                            ))}
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-1 border-t border-slate-200/60 px-4 py-2 text-xs text-slate-500 dark:border-slate-800/60">
                <div className="flex gap-2 font-medium">
                    {shownCategories} catégories affichées
                    {otherCategories > 0 && (
                        <span className="text-slate-400">
                            · {otherCategories} autre{otherCategories > 1 ? 's' : ''} catégorie{otherCategories > 1 ? 's' : ''}
                        </span>
                    )}
                </div>
                <div>Nombre d'articles par catégorie</div>
            </CardFooter>
        </Card>
    );
}
