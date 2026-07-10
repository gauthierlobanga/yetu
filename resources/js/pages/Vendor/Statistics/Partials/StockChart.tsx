/* eslint-disable react-hooks/static-components */
// resources/js/Pages/Vendor/Statistics/Partials/StockChart.tsx

import { PackageCheck, AlertTriangle } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';

import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';

interface Props {
    data: { name: string; quantity: number; fill: string }[];
}

export function StockChart({ data }: Props) {
    const totalStock = data.reduce((sum, item) => sum + item.quantity, 0);
    const lowStock = data.filter((item) => item.quantity <= 10).length;

    const chartData = [...data]
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 8);

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const d = payload[0].payload;

            return (
                <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex items-center gap-2">
                        <div
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: d.fill }}
                        />
                        <span className="font-medium text-slate-900 dark:text-white">
                            {d.name}
                        </span>
                    </div>
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        {d.quantity} unités
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <Card className="border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
            <CardHeader className="flex flex-row items-start justify-between gap-4 border-b border-slate-100 px-4 pb-2 dark:border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-50 dark:bg-cyan-950">
                        <PackageCheck className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <div>
                        <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                            État des stocks
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                            Analyse des quantités disponibles
                        </CardDescription>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400">
                        <PackageCheck className="mr-1 h-3 w-3" />
                        {totalStock}
                    </Badge>
                    <Badge className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400">
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        {lowStock}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="px-4 py-10">
                <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            layout="vertical"
                            margin={{ top: 5, right: 10, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#e2e8f0"
                                horizontal={false}
                            />
                            <XAxis
                                type="number"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 11, fill: '#94a3b8' }}
                            />
                            <YAxis
                                dataKey="name"
                                type="category"
                                width={110}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#94a3b8' }}
                            />
                            <Tooltip
                                cursor={{
                                    fill: 'rgba(148,163,184,0.06)',
                                    radius: 8,
                                }}
                                content={<CustomTooltip />}
                            />
                            <Bar
                                dataKey="quantity"
                                radius={[0, 4, 4, 0]}
                                barSize={40}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={index} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
