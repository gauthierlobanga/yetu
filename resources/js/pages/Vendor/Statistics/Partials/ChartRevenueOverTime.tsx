// resources/js/Pages/Vendor/Statistics/Partials/ChartRevenueOverTime.tsx
import { useState } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
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
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface SalesPoint {
    date: string;
    revenue: number;
    orders: number;
}

export function ChartRevenueOverTime({ data }: { data: SalesPoint[] }) {
    const [range, setRange] = useState('90d');

    const filtered = data.filter((d) => {
        const dDate = new Date(d.date);
        const now = new Date();
        const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;

        return dDate >= new Date(now.getTime() - days * 86400000);
    });

    const totalRevenue = filtered.reduce((s, d) => s + d.revenue, 0);

    return (
        <Card className="border-slate-200 shadow-sm dark:border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                    <CardTitle className="text-slate-800 dark:text-white">
                        Chiffre d'affaires
                    </CardTitle>
                    <CardDescription className="text-slate-500 dark:text-slate-400">
                        {new Intl.NumberFormat('fr-CD', {
                            style: 'currency',
                            currency: 'CDF',
                        }).format(totalRevenue)}
                    </CardDescription>
                </div>
                <ToggleGroup
                    type="single"
                    value={range}
                    onValueChange={setRange}
                    variant="outline"
                    className="border-slate-200 dark:border-slate-700"
                >
                    <ToggleGroupItem value="7d" className="text-xs">
                        7j
                    </ToggleGroupItem>
                    <ToggleGroupItem value="30d" className="text-xs">
                        30j
                    </ToggleGroupItem>
                    <ToggleGroupItem value="90d" className="text-xs">
                        3 mois
                    </ToggleGroupItem>
                </ToggleGroup>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6">
                <ChartContainer
                    config={{ revenue: { label: 'CA', color: '#10b981' } }}
                    className="aspect-auto h-64 w-full"
                >
                    <AreaChart data={filtered}>
                        <defs>
                            <linearGradient
                                id="fillRevenue"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#10b981"
                                    stopOpacity={0.3}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#10b981"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e2e8f0"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 12, fill: '#64748b' }}
                            tickMargin={8}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area
                            dataKey="revenue"
                            type="natural"
                            fill="url(#fillRevenue)"
                            stroke="#10b981"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
