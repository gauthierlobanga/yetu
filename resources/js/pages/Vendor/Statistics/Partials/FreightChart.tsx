/* eslint-disable react-hooks/static-components */
// resources/js/Pages/Vendor/Statistics/Partials/FreightChart.tsx
import { Truck } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

interface Props {
    data: { name: string; count: number; fill: string }[];
}

export function FreightChart({ data }: Props) {
    const total = data.reduce((sum, item) => sum + item.count, 0);

    const CustomTooltip = ({ active, payload }: any) => {
        if (!active || !payload?.length) {
            return null;
        }

        const d = payload[0]?.payload;

        return (
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-center gap-2">
                    <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: d?.fill }}
                    />
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                        {d?.name}
                    </span>
                </div>
                <div className="mt-1 text-slate-500 dark:text-slate-400">
                    {d?.count ?? 0} commandes
                </div>
            </div>
        );
    };

    return (
        <Card className="border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
            <CardHeader className="border-b border-slate-100 px-4 pt-4 pb-2 dark:border-slate-800">
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <CardTitle className="text-sm font-medium text-slate-900 dark:text-white">
                            État du fret
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                            Répartition des expéditions et livraisons
                        </CardDescription>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950">
                        <Truck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                    <div className="rounded-md border border-slate-100 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-900">
                        <p className="text-[10px] font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
                            Total commandes
                        </p>
                        <p className="text-lg font-semibold text-slate-900 dark:text-white">
                            {total}
                        </p>
                    </div>
                    <div className="rounded-md border border-emerald-100 bg-emerald-50/50 px-3 py-2 dark:border-emerald-900 dark:bg-emerald-950/30">
                        <p className="text-[10px] font-medium tracking-wide text-emerald-700 uppercase dark:text-emerald-400">
                            Statuts actifs
                        </p>
                        <p className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">
                            {data.length}
                        </p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="px-3 py-3">
                <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{ top: 5, right: 5, left: -15, bottom: 0 }}
                        >
                            <CartesianGrid
                                vertical={false}
                                strokeDasharray="3 3"
                                stroke="#e2e8f0"
                            />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#94a3b8' }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#94a3b8' }}
                                width={30}
                            />
                            <Tooltip
                                cursor={{
                                    fill: 'rgba(148,163,184,0.06)',
                                    radius: 8,
                                }}
                                content={<CustomTooltip />}
                            />
                            <Bar
                                dataKey="count"
                                radius={[4, 4, 0, 0]}
                                barSize={24}
                            >
                                {data.map((entry, index) => (
                                    <rect key={index} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                    {data.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                        >
                            <span
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: item.fill }}
                            />
                            <span>{item.name}</span>
                            <span className="text-slate-400 dark:text-slate-500">
                                ({item.count})
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
