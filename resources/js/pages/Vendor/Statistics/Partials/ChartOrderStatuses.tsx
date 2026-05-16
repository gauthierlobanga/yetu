// resources/js/Pages/Vendor/Statistics/Partials/ChartOrderStatuses.tsx
import { Cell, Pie, PieChart } from 'recharts';
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

export function ChartOrderStatuses({
    data,
}: {
    data: { name: string; value: number; color: string }[];
}) {
    return (
        <Card className="border-slate-200 shadow-sm dark:border-slate-800">
            <CardHeader>
                <CardTitle className="text-slate-800 dark:text-white">
                    Statuts des commandes
                </CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400">
                    Répartition actuelle
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={{}}
                    className="mx-auto aspect-square max-h-64"
                >
                    <PieChart>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
