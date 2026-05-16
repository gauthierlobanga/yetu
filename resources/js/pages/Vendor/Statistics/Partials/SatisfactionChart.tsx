// resources/js/Pages/Vendor/Statistics/Partials/SatisfactionChart.tsx
import { Star } from 'lucide-react';
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    return (
        <Card className="border-slate-200 shadow-sm dark:border-slate-800">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-slate-800 dark:text-white">
                        Satisfaction client
                    </CardTitle>
                    <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">
                        {averageRating}
                    </span>
                    <span className="text-sm text-slate-500">/5</span>
                    <span className="ml-auto text-sm text-slate-500">
                        {totalReviews} avis
                    </span>
                </div>
            </CardHeader>
            <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={90}
                            innerRadius={50}
                            paddingAngle={2}
                        >
                            {data.map((entry, index) => (
                                <Cell key={index} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0',
                                backgroundColor: '#fff',
                            }}
                        />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
