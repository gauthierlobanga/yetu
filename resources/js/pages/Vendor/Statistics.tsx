/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/Pages/Vendor/Statistics.tsx
import { Head, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { SectionCards as CardsSection } from '@/components/section-cards-post';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { VendorSidebar } from '@/components/VendorSidebar';
import type {
    FreightDataItem,
    SatisfactionDataItem,
    StockDataItem,
    Summary,
    SummaryCardsData,
    Tenant,
} from '@/types/tenants/products/vendor/tenant';
import { AreaInteractive } from './Statistics/Avanced/AreaChartInteractive';
import { BarHorizontal } from './Statistics/Avanced/BarChartHorizontal';
import { ChartBarInteractive } from './Statistics/Avanced/BarChartInteractive';
import { DataTableCommandes } from './Statistics/Avanced/data-table-commandes';
import { DataTablePaiements } from './Statistics/Avanced/data-table-payments';
import { ChartOrderStatuses } from './Statistics/Partials/ChartOrderStatuses';
import { ChartRevenueOverTime } from './Statistics/Partials/ChartRevenueOverTime';
import { FreightChart } from './Statistics/Partials/FreightChart';
import { SatisfactionChart } from './Statistics/Partials/SatisfactionChart';
import { SectionCard } from './Statistics/Partials/SectionCard';
import { SectionCards } from './Statistics/Partials/SectionCards';
import { StockChart } from './Statistics/Partials/StockChart';
import { SummaryCards } from './Statistics/Partials/SummaryCards';
import { TopClientsChart } from './Statistics/Partials/TopClientsChart';
import { TopProductsChart } from './Statistics/Partials/TopProductsChart';
import { ChartBarMixed } from './stats/BarChartMixed';
import { BarStacked } from './stats/BarChartStackedLegend';
import { ChartAreaInteractive } from './stats/chart-area-interactive';
import { ChartCategoryPerformance } from './stats/chart-category-performance';
import { ChartHourlyPosts } from './stats/chart-hourly-posts';
import { ChartMonthlyPosts } from './stats/chart-monthly-posts';
import { ChartTopAuthors } from './stats/chart-top-authors';
import { ChartTopTags } from './stats/chart-top-tags';
import { ChartWeeklyActivity } from './stats/chart-weekly-activity';
import { AreaLegend } from './stats/ChartAreaLegend';
import { ChartBarLabel } from './stats/ChartBarLabelPost';
import { TooltipAdvanced } from './stats/ChartTooltipAdvanced';
import { LineMultiple } from './stats/LineChartMultiple';
import { PieDonutText } from './stats/PieChartDonutWithText';
import { ChartPieInteractive } from './stats/PieChartInteractive';
import { PieInteractive } from './stats/PieChartInteractivePost';

interface Props {
    tenant: Tenant;
    summary: Summary;
    salesOverTime: { date: string; revenue: number; orders: number }[];
    topProducts: any[];
    topClients: any[];
    orderStatuses: any[];
    weeklyActivity: any[];
    monthlyOrders: any[];
    hourlyOrders: any[];
    categoryPerformance: any[];
    topCategories: any[];
    cartStats: { active: number; abandoned: number };
    customerMetrics: any;
    recentMovements: any[];
    planAllowsAdvancedStats: boolean;
    recentCommandes: any[];
    recentPaiements: any[];
    summaryCards: SummaryCardsData;
    stockData: StockDataItem[];
    satisfactionData: SatisfactionDataItem[];
    totalReviews: number;
    averageRating: number;
    freightData: FreightDataItem[];
}

export default function VendorStatistics({
    tenant,
    summary,
    salesOverTime,
    topProducts,
    topClients,
    orderStatuses,
    weeklyActivity,
    monthlyOrders,
    hourlyOrders,
    categoryPerformance,
    recentCommandes,
    recentPaiements,
    summaryCards,
    stockData,
    satisfactionData,
    totalReviews,
    averageRating,
    freightData,
}: Props) {
    // Transformations mineures pour les composants
    const chartStats = salesOverTime.map((s) => ({
        date: s.date,
        revenue: s.revenue,
        orders: s.orders,
    }));

    return (
        <SidebarProvider
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 72)',
                    '--header-height': 'calc(var(--spacing) * 12)',
                } as React.CSSProperties
            }
        >
            <VendorSidebar tenant={tenant} />
            <SidebarInset>
                <SiteHeader />
                <div className="min-h-screen bg-white py-10 dark:bg-slate-950">
                    <Head title={`Statistiques - ${tenant.raison_sociale}`} />
                    <div className="@container/main flex flex-1 flex-col gap-4">
                        {/* Graphique d'évolution principale */}
                        <div className="space-y-3">
                            <SectionCard summary={summary} />
                            <SectionCards summary={summary} />
                        </div>
                        <div className="mt-8 px-6 lg:px-6">
                            <SummaryCards summary={summaryCards} />
                        </div>

                        <div className="mt-8 grid grid-cols-1 gap-6 px-4 lg:grid-cols-2 lg:px-6">
                            <AreaInteractive />
                            <AreaInteractive />
                        </div>
                        <div className="mt-8 grid grid-cols-1 gap-6 px-4 lg:grid-cols-2 lg:px-6">
                            <BarHorizontal />
                            <BarStacked />
                        </div>

                        <div className="mt-8 grid grid-cols-1 gap-6 px-4 lg:grid-cols-2 lg:px-6">
                            <LineMultiple />
                            <PieDonutText />
                        </div>

                        <div className="mt-8 grid grid-cols-1 gap-6 px-4 lg:grid-cols-2 lg:px-6">
                            <AreaLegend />
                            <FreightChart data={freightData} />
                        </div>

                        <div className="mt-8 grid grid-cols-1 gap-6 px-4 lg:grid-cols-2 lg:px-6">
                            <ChartRevenueOverTime data={salesOverTime} />
                            <ChartOrderStatuses data={orderStatuses} />
                        </div>

                        <div className="mt-8 grid grid-cols-1 gap-6 px-4 lg:grid-cols-2 lg:px-6">
                            <TopClientsChart data={topClients} />
                            <TopProductsChart data={topProducts} />
                        </div>

                        <div className="px-4 lg:px-6">
                            {/* Graphiques Stocks + Satisfaction */}
                            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                                <StockChart data={stockData} />
                                <SatisfactionChart
                                    data={satisfactionData}
                                    totalReviews={totalReviews}
                                    averageRating={averageRating}
                                />
                            </div>
                        </div>

                        {/* Tables de données récentes */}
                        <div className="mt-8 space-y-6 px-4 lg:px-6">
                            <div>
                                <h2 className="mb-4 text-xl font-semibold text-slate-800 dark:text-white">
                                    Dernières commandes
                                </h2>
                                <DataTableCommandes
                                    commandes={{
                                        data: recentCommandes,
                                        current_page: 1,
                                        last_page: 1,
                                        total: recentCommandes.length,
                                        per_page: 10,
                                    }}
                                />
                            </div>
                            <div>
                                <h2 className="mb-4 text-xl font-semibold text-slate-800 dark:text-white">
                                    Derniers paiements
                                </h2>
                                <DataTablePaiements
                                    paiements={{
                                        data: recentPaiements,
                                        current_page: 1,
                                        last_page: 1,
                                        total: recentPaiements.length,
                                        per_page: 10,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
