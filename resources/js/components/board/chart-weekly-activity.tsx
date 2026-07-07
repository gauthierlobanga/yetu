'use client';

import { useTheme } from 'next-themes';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, Cell } from 'recharts';
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

interface WeeklyActivity {
    day: string;
    count: number;
}

const dayAbbr: Record<string, string> = {
    Lundi: 'Lun',
    Mardi: 'Mar',
    Mercredi: 'Mer',
    Jeudi: 'Jeu',
    Vendredi: 'Ven',
    Samedi: 'Sam',
    Dimanche: 'Dim',
};

export function ChartWeeklyActivity({ data }: { data: WeeklyActivity[] }) {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';

    // État pour l'index de la barre survolée
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);

    const totalPosts = data.reduce((sum, d) => sum + d.count, 0);
    const bestDay = data.reduce(
        (best, d) => (d.count > best.count ? d : best),
        data[0] || { day: '', count: 0 },
    );

    const chartConfig = {
        count: { label: 'Articles', color: '#10b981' },
    };

    // Couleur de la grille selon le thème
    const gridStroke = isDark ? 'rgba(148,163,184,0.2)' : '#e2e8f0';

    if (!data || data.length === 0) {
        return (
            <Card className="border-0 bg-slate-50/60 dark:bg-slate-900/40">
                <CardHeader className="px-4 pt-4 pb-2">
                    <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                        Activité hebdomadaire
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
            <CardHeader className="border-b border-slate-200/60 px-4 pt-4 pb-2 dark:border-slate-800/60">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                            Activité hebdomadaire
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                            {totalPosts} article{totalPosts > 1 ? 's' : ''}{' '}
                            cette semaine
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-4 py-3">
                <ChartContainer config={chartConfig} className="h-56 w-full">
                    <BarChart
                        data={data}
                        margin={{ top: 5, right: 5, bottom: 0, left: 0 }}
                        onMouseLeave={() => setHoverIndex(null)}
                    >
                        <CartesianGrid
                            vertical={false}
                            stroke={gridStroke}
                            strokeDasharray="2 2"
                        />
                        <XAxis
                            dataKey="day"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 11, fill: '#94a3b8' }}
                            tickFormatter={(value) => dayAbbr[value] || value}
                        />
                        <ChartTooltip
                            cursor={{
                                fill: isDark
                                    ? 'rgba(255,255,255,0.05)'
                                    : 'rgba(0,0,0,0.05)',
                                radius: 8,
                            }}
                            content={
                                <ChartTooltipContent
                                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs shadow-sm dark:border-slate-700 dark:bg-slate-900"
                                    formatter={(value) => [
                                        `${value} article${value !== 1 ? 's' : ''}`,
                                        '',
                                    ]}
                                />
                            }
                        />
                        <Bar
                            dataKey="count"
                            radius={[4, 4, 0, 0]}
                            barSize={32}
                            onMouseEnter={(_, index) => setHoverIndex(index)}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={index}
                                    fill={chartConfig.count.color}
                                    fillOpacity={
                                        hoverIndex === index ? 1 : 0.85
                                    }
                                    className="transition-opacity duration-150"
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="border-t border-slate-200/60 px-4 py-2 text-xs text-slate-500 dark:border-slate-800/60 dark:text-slate-400">
                Jour le plus actif :{' '}
                <span className="ml-1 font-medium text-slate-700 dark:text-slate-300">
                    {bestDay.day}
                </span>{' '}
                ({bestDay.count} article{bestDay.count > 1 ? 's' : ''})
            </CardFooter>
        </Card>
    );
}
