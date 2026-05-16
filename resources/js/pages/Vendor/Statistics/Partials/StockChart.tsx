// resources/js/Pages/Vendor/Statistics/Partials/StockChart.tsx
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
    data: { name: string; quantity: number; fill: string }[];
}

export function StockChart({ data }: Props) {
    return (
        <Card className="border-slate-200 shadow-sm dark:border-slate-800">
            <CardHeader>
                <CardTitle className="text-slate-800 dark:text-white">
                    État des stocks
                </CardTitle>
            </CardHeader>
            <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ left: 40 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e2e8f0"
                            horizontal={false}
                        />
                        <XAxis
                            type="number"
                            tick={{ fontSize: 12, fill: '#64748b' }}
                        />
                        <YAxis
                            dataKey="name"
                            type="category"
                            tick={{ fontSize: 12, fill: '#475569' }}
                            width={100}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0',
                                backgroundColor: '#fff',
                            }}
                            formatter={(value: any) => [
                                `${value ?? 0} unités`,
                                'Stock',
                            ]}
                        />
                        <Bar
                            dataKey="quantity"
                            barSize={20}
                            radius={[0, 4, 4, 0]}
                        >
                            {data.map((entry, index) => (
                                <rect key={index} fill={entry.fill} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
