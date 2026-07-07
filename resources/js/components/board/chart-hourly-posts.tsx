'use client';

import { useTheme } from 'next-themes';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, Cell } from 'recharts';
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

interface HourlyPost {
    hour: number;
    count: number;
}

export function ChartHourlyPosts({ data }: { data: HourlyPost[] }) {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';
    const gridColor = isDark ? 'rgba(148,163,184,0.2)' : '#e2e8f0';
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);

    const formattedData = data.map((item) => ({
        hour: `${item.hour}h`,
        count: item.count,
    }));

    const bestHour = data.reduce(
        (best, d) => (d.count > best.count ? d : best),
        data[0] || { hour: 0, count: 0 },
    );

    const chartConfig = {
        count: { label: 'Articles', color: '#10b981' },
    };

    // Couleurs pour les barres (normale et survolée)
    const normalColor = chartConfig.count.color;
    const hoverColor = '#059669'; // teinte plus foncée

    if (!data || data.length === 0) {
        return (
            <Card className="border-0 bg-slate-50/60 dark:bg-slate-900/40">
                <CardHeader className="px-4 pt-4 pb-2">
                    <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                        Heures de publication
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
                            Heures de publication
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                            Pic à {bestHour.hour}h ({bestHour.count} article{bestHour.count > 1 ? 's' : ''})
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-4 py-3">
                <ChartContainer config={chartConfig} className="h-56 w-full">
                    <BarChart
                        data={formattedData}
                        margin={{ top: 5, right: 5, bottom: 0, left: 0 }}
                        onMouseLeave={() => setHoverIndex(null)}
                    >
                        <defs>
                            {/* Filtre d'ombre portée pour les barres survolées */}
                            <filter id="barShadow" x="-20%" y="-20%" width="140%" height="140%">
                                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#10b981" floodOpacity="0.3" />
                            </filter>
                        </defs>
                        <CartesianGrid
                            vertical={false}
                            stroke={gridColor}
                            strokeDasharray="2 2"
                            strokeWidth={0.5}
                        />
                        <XAxis
                            dataKey="hour"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 11, fill: '#94a3b8' }}
                        />
                        <ChartTooltip
                            cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', radius: 8 }}
                            content={
                                <ChartTooltipContent
                                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs shadow-sm dark:border-slate-700 dark:bg-slate-900"
                                    formatter={(value) => [`${value} article${value !== 1 ? 's' : ''}`, '']}
                                />
                            }
                        />
                        <Bar
                            dataKey="count"
                            radius={[4, 4, 0, 0]}
                            barSize={32}
                            onMouseEnter={(_, index) => setHoverIndex(index)}
                        >
                            {formattedData.map((entry, index) => {
                                const isHovered = hoverIndex === index;

                                return (
                                    <Cell
                                        key={index}
                                        fill={isHovered ? hoverColor : normalColor}
                                        filter={isHovered ? 'url(#barShadow)' : undefined}
                                        className="transition-all duration-200"
                                    />
                                );
                            })}
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
