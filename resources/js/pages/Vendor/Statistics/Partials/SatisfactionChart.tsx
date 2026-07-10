/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/static-components */
// resources/js/Pages/Vendor/Statistics/Partials/SatisfactionChart.tsx

import { Star, MessageCircleMore, TrendingUp } from 'lucide-react';
import { PieChart, Pie, ResponsiveContainer, Tooltip } from 'recharts';

import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';

interface Props {
    data: { name: string; value: number; color: string }[];
    totalReviews: number;
    averageRating: number;
}

export function SatisfactionChart({
    data,
    totalReviews,
    averageRating,
}: Props) {
    const totalVotes = data.reduce((sum, item) => sum + item.value, 0);
    const satisfactionRate =
        totalVotes > 0 ? Math.round((averageRating / 5) * 100) : 0;

    const CustomTooltip = ({ active, payload }: any) => {
        if (!active || !payload?.length) {
            return null;
        }

        const d = payload[0]?.payload;
        const percentage =
            totalVotes > 0 ? ((d.value / totalVotes) * 100).toFixed(1) : 0;

        return (
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-center gap-2">
                    <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: d.color }}
                    />
                    <span className="font-medium text-slate-900 dark:text-white">
                        {d.name}
                    </span>
                </div>
                <div className="mt-1 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>{d.value} avis</span>
                    <span>{percentage}%</span>
                </div>
            </div>
        );
    };

    return (
        <Card className="border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
            <CardHeader className="border-b border-slate-100 px-4 pt-4 pb-2 dark:border-slate-800">
                <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950">
                            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                        </div>
                        <div>
                            <CardTitle className="text-sm font-medium text-slate-900 dark:text-white">
                                Satisfaction client
                            </CardTitle>
                            <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                                Répartition des évaluations
                            </CardDescription>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400">
                            <TrendingUp className="mr-1 h-3 w-3" />
                            {satisfactionRate}%
                        </Badge>
                        <Badge className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                            <MessageCircleMore className="mr-1 h-3 w-3" />
                            {totalReviews}
                        </Badge>
                    </div>
                </div>

                <div className="mt-3 flex items-end gap-2 rounded-md border border-slate-100 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-900">
                    <span className="text-lg font-semibold text-slate-900 dark:text-white">
                        {averageRating.toFixed(1)}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                        /5
                    </span>
                    <div className="ml-auto flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`h-3 w-3 ${
                                    star <= Math.round(averageRating)
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-slate-300 dark:text-slate-700'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="px-4 py-5">
                {/* Légende à gauche + Graphique à droite */}
                <div className="flex flex-row items-center gap-4">
                    {/* Légende verticale à gauche (un peu plus large) */}
                    <div className="flex flex-col gap-2 min-w-35">
                        {data.map((item, index) => {
                            const percentage =
                                totalVotes > 0
                                    ? ((item.value / totalVotes) * 100).toFixed(1)
                                    : '0';

                            return (
                                <div
                                    key={index}
                                    className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-900"
                                >
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="h-2.5 w-2.5 rounded-full"
                                            style={{ backgroundColor: item.color }}
                                        />
                                        <span className="text-sm text-slate-700 dark:text-slate-300">
                                            {item.name}
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                                        {item.value}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Graphique centré à droite (agrandi) */}
                    <div className="flex-1 flex justify-center items-center">
                        <div className="relative h-52 w-52">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        innerRadius={50}
                                        paddingAngle={2}
                                        stroke="none"
                                    >
                                        {data.map((entry, index) => (
                                            <rect key={index} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-xl font-semibold text-slate-900 dark:text-white">
                                    {averageRating.toFixed(1)}
                                </span>
                                <span className="text-[11px] text-slate-500 uppercase dark:text-slate-400">
                                    Note
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
