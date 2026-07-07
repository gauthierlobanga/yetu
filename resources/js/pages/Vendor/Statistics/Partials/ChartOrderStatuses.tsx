// resources/js/Pages/Vendor/Statistics/Partials/ChartOrderStatuses.tsx

import { ShoppingBag } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

import { Badge } from '@/components/ui/badge';
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

interface StatusItem {
    name: string;
    value: number;
    color: string;
}

export function ChartOrderStatuses({ data }: { data: StatusItem[] }) {
    const total = data.reduce((sum, item) => sum + (Number(item.value) || 0), 0);


    return (
        <Card className="border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
            <CardHeader className="flex flex-row items-start justify-between gap-4 border-b border-slate-100 px-4 pt-4 pb-2 dark:border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950">
                        <ShoppingBag className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                        <CardTitle className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">
                            Statuts des commandes
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                            Répartition globale des commandes
                        </CardDescription>
                    </div>
                </div>
                <Badge className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
                    {total} total
                </Badge>
            </CardHeader>

            <CardContent className="flex flex-col gap-4 px-4 py-6">
                {/* Graphique compact */}
                <div className="relative mx-auto h-48 w-48">
                    <ChartContainer config={{}} className="h-full w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <ChartTooltip
                                    cursor={false}
                                    content={
                                        <ChartTooltipContent className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-900" />
                                    }
                                />
                                <Pie
                                    data={data}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={55}
                                    outerRadius={75}
                                    paddingAngle={3}
                                    strokeWidth={3}
                                    stroke="transparent"
                                    cornerRadius={8}
                                >
                                    {data.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                        />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                    {/* Centre */}
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-bold text-slate-900 dark:text-white">
                            {total}
                        </span>
                        <span className="text-[10px] text-slate-500 uppercase dark:text-slate-400">
                            Commandes
                        </span>
                    </div>
                </div>

                {/* Légende épurée en colonne unique pour plus de clarté */}
                <div className="flex flex-col gap-2">
                    {data.map((item, index) => {
                        const percentage =
                            total > 0
                                ? ((item.value / total) * 100).toFixed(1)
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
                                    <span className="text-xs text-slate-400 dark:text-slate-500">
                                        ({percentage}%)
                                    </span>
                                </div>
                                <span className="text-sm font-medium text-slate-900 dark:text-white">
                                    {item.value}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
