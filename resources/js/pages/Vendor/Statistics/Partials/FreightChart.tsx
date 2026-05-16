// resources/js/Pages/Vendor/Statistics/Partials/FreightChart.tsx
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
    data: { name: string; count: number; fill: string }[];
}

export function FreightChart({ data }: Props) {
    return (
        <Card className="border-slate-200 shadow-sm dark:border-slate-800">
            <CardHeader>
                <CardTitle className="text-slate-800 dark:text-white">
                    État du fret
                </CardTitle>
            </CardHeader>
            <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 12, fill: '#64748b' }}
                        />
                        <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                        <Tooltip
                            contentStyle={{
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0',
                                backgroundColor: '#fff',
                            }}
                            formatter={(value: any) => [
                                `${value ?? 0} commandes`,
                                '',
                            ]}
                        />
                        <Legend />
                        <Bar dataKey="count" barSize={40} radius={[4, 4, 0, 0]}>
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
