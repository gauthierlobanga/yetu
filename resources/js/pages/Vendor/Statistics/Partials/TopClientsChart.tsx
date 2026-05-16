/* eslint-disable react-hooks/static-components */
// resources/js/Pages/Vendor/Statistics/Partials/TopClientsChart.tsx
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
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';

interface TopClient {
    id: number | string;
    name: string;
    avatar_url?: string | null;
    total_spent: number;
    orders_count: number;
}

interface Props {
    data: TopClient[];
}

const GRADIENT_COLORS = [
    ['#10b981', '#34d399'],
    ['#3b82f6', '#60a5fa'],
    ['#8b5cf6', '#a78bfa'],
    ['#f59e0b', '#fbbf24'],
    ['#06b6d4', '#22d3ee'],
];

export function TopClientsChart({ data }: Props) {
    if (!data || data.length === 0) {
        return (
            <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader>
                    <CardTitle className="text-slate-800 dark:text-white">
                        Meilleurs clients
                    </CardTitle>
                    <CardDescription className="text-slate-500 dark:text-slate-400">
                        Aucune donnée disponible
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    const sorted = [...data]
        .sort((a, b) => b.total_spent - a.total_spent)
        .slice(0, 10);
    const chartData = sorted
        .map((client, idx) => ({
            name: client.name,
            value: client.total_spent,
            orders: client.orders_count,
            gradientId: `gradient-client-${idx}`,
            gradientColors: GRADIENT_COLORS[idx % GRADIENT_COLORS.length],
        }))
        .reverse();

    const totalRevenue = sorted.reduce((sum, c) => sum + c.total_spent, 0);

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const d = payload[0].payload;

            return (
                <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                    <p className="font-medium text-slate-800 dark:text-white">
                        {d.name}
                    </p>
                    <p className="text-emerald-600 dark:text-emerald-400">
                        {new Intl.NumberFormat('fr-CD', {
                            style: 'currency',
                            currency: 'CDF',
                        }).format(d.value)}
                    </p>
                    <p className="text-sm text-slate-500">
                        {d.orders} commandes
                    </p>
                </div>
            );
        }

        return null;
    };

    return (
        <Card className="border-slate-200 shadow-sm dark:border-slate-800">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white">
                    Meilleurs clients
                </CardTitle>
                <CardDescription className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span>Top 10 par chiffre d'affaires</span>
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        Total :{' '}
                        {new Intl.NumberFormat('fr-CD', {
                            style: 'currency',
                            currency: 'CDF',
                        }).format(totalRevenue)}
                    </span>
                </CardDescription>
            </CardHeader>
            <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ left: 10, right: 20 }}
                    >
                        <defs>
                            {chartData.map((entry) => (
                                <linearGradient
                                    key={entry.gradientId}
                                    id={entry.gradientId}
                                    x1="0"
                                    y1="0"
                                    x2="1"
                                    y2="0"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor={entry.gradientColors[0]}
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="100%"
                                        stopColor={entry.gradientColors[1]}
                                        stopOpacity={0.9}
                                    />
                                </linearGradient>
                            ))}
                        </defs>
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
                            width={120}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="value" barSize={22} radius={[0, 6, 6, 0]}>
                            {chartData.map((entry, idx) => (
                                <Cell
                                    key={idx}
                                    fill={`url(#${entry.gradientId})`}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
