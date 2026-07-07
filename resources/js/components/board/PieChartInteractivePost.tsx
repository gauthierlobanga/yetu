
/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { usePage } from '@inertiajs/react';
import * as React from 'react';
import { Label, Pie, PieChart, Sector } from 'recharts';

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

// ----------------------------------------------------------------------
// Types et constantes
// ----------------------------------------------------------------------
interface PostStatsData {
    status: string;
    status_label: string;
    count: number;
    fill: string;
}

interface ChartPieInteractiveProps {
    postsStats?: PostStatsData[];
}

const statusColors: Record<string, string> = {
    published: '#10b981',
    draft: '#3b82f6',
    scheduled: '#8b5cf6',
    archived: '#f59e0b',
    expired: '#6b7280',
};

const statusLabels: Record<string, string> = {
    published: 'Publiés',
    draft: 'Brouillons',
    scheduled: 'Programmés',
    archived: 'Archivés',
    expired: 'Expirés',
};

// ----------------------------------------------------------------------
// Composant
// ----------------------------------------------------------------------
export function ChartPieInteractive({
    postsStats: propPostsStats,
}: ChartPieInteractiveProps) {
    const id = 'pie-interactive';
    const { props } = usePage<{ postsStatusStats?: PostStatsData[] }>();

    const rawData = propPostsStats || props.postsStatusStats || [];

    // Mise en forme et couleurs
    const chartData = React.useMemo(() => {
        if (rawData.length === 0) {
return [];
}

        return rawData.map((item) => ({
            ...item,
            fill: statusColors[item.status] || '#10b981',
            status_label: statusLabels[item.status] || item.status,
        }));
    }, [rawData]);

    const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

    // Statut sélectionné via le select (synchronisé avec activeIndex)
    const activeStatus =
        activeIndex !== null
            ? chartData[activeIndex]?.status
            : chartData[0]?.status || '';

    const handleStatusChange = (status: string) => {
        const idx = chartData.findIndex((item) => item.status === status);
        setActiveIndex(idx >= 0 ? idx : null);
    };

    // Configuration des couleurs pour le chart (tooltip, etc.)
    const chartConfig: ChartConfig = React.useMemo(() => {
        const config: ChartConfig = { posts: { label: 'Articles' } };
        chartData.forEach((item) => {
            config[item.status] = {
                label: item.status_label,
                color: item.fill,
            };
        });

        return config;
    }, [chartData]);

    const totalPosts = React.useMemo(
        () => chartData.reduce((sum, item) => sum + item.count, 0),
        [chartData],
    );

    const activeItem = activeIndex !== null ? chartData[activeIndex] : null;

    // État vide
    if (chartData.length === 0) {
        return (
            <Card className="border-0 bg-slate-50/60 dark:bg-slate-900/40">
                <CardHeader className="px-4 pt-4 pb-2">
                    <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                        Répartition des articles
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                        Aucune donnée disponible
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex h-48 items-center justify-center text-sm text-slate-400">
                        Aucun article trouvé
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
                        Répartition des articles
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                        Total : {totalPosts} articles · {chartData.length}{' '}
                        statuts
                    </CardDescription>
                </div>
                <Select
                    value={activeStatus}
                    onValueChange={handleStatusChange}
                >
                    <SelectTrigger
                        className="ml-auto h-7 w-32 rounded-lg border-slate-200 bg-white/90 pl-2.5 text-xs dark:border-slate-700 dark:bg-slate-900/90"
                        aria-label="Sélectionner un statut"
                    >
                        <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent align="end" className="rounded-xl">
                        {chartData.map((item) => (
                            <SelectItem
                                key={item.status}
                                value={item.status}
                                className="rounded-lg [&_span]:flex"
                            >
                                <div className="flex items-center gap-2 text-xs">
                                    <span
                                        className="flex h-3 w-3 shrink-0 rounded-xs"
                                        style={{
                                            backgroundColor: item.fill,
                                        }}
                                    />
                                    {item.status_label}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="flex flex-1 justify-center pt-6 pb-4">
                <ChartContainer
                    id={id}
                    config={chartConfig}
                    className="mx-auto aspect-square w-full max-w-50"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs shadow-sm dark:border-slate-700 dark:bg-slate-900"
                                    hideLabel
                                />
                            }
                        />
                        <Pie
                            data={chartData}
                            dataKey="count"
                            nameKey="status"
                            innerRadius={55}
                            strokeWidth={2}
                            stroke="transparent"
                            onMouseEnter={(_, index) =>
                                setActiveIndex(index)
                            }
                            onMouseLeave={() => setActiveIndex(null)}
                            // Personnalisation de chaque secteur via shape
                            shape={(shapeProps: any) => {
                                const {
                                    cx,
                                    cy,
                                    innerRadius,
                                    outerRadius,
                                    startAngle,
                                    endAngle,
                                    fill,
                                    index,
                                } = shapeProps;
                                const isActive = index === activeIndex;

                                if (isActive) {
                                    return (
                                        <g>
                                            <Sector
                                                cx={cx}
                                                cy={cy}
                                                innerRadius={innerRadius}
                                                outerRadius={outerRadius + 6}
                                                startAngle={startAngle}
                                                endAngle={endAngle}
                                                fill={fill}
                                            />
                                            <Sector
                                                cx={cx}
                                                cy={cy}
                                                innerRadius={
                                                    innerRadius + 8
                                                }
                                                outerRadius={
                                                    outerRadius + 16
                                                }
                                                startAngle={startAngle}
                                                endAngle={endAngle}
                                                fill={fill}
                                            />
                                        </g>
                                    );
                                }

                                return (
                                    <Sector
                                        cx={cx}
                                        cy={cy}
                                        innerRadius={innerRadius}
                                        outerRadius={outerRadius}
                                        startAngle={startAngle}
                                        endAngle={endAngle}
                                        fill={fill}
                                    />
                                );
                            }}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (
                                        viewBox &&
                                        'cx' in viewBox &&
                                        'cy' in viewBox
                                    ) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-slate-900 text-xl font-bold dark:fill-white"
                                                >
                                                    {activeItem?.count?.toLocaleString() ??
                                                        0}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={
                                                        (viewBox.cy || 0) +
                                                        20
                                                    }
                                                    className="fill-slate-500 text-[11px] dark:fill-slate-400"
                                                >
                                                    {activeItem?.status_label ??
                                                        'Statut'}
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
