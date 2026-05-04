import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, Heart, ShoppingBag, Sparkles } from 'lucide-react';
import ShopAccountShell from '@/components/ecommerce/ShopAccountShell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import tenant from '@/routes/tenant';

interface OrderItem {
    id: string;
    numero_commande: string;
    statut: string;
    total: number | string;
    created_at: string;
    lignes_count: number;
}

interface Props extends Record<string, unknown> {
    stats: {
        orders_count: number;
        completed_orders: number;
        addresses_count: number;
        wishlist_items_count: number;
        pending_returns_count: number;
        loyalty_points: number;
        loyalty_level: string;
    };
    recentOrders: OrderItem[];
    wishlist?: {
        nom?: string;
        items_count?: number;
    } | null;
    loyalty?: {
        points?: number;
        niveau_libelle?: string;
    } | null;
}

export default function ShopDashboardPage() {
    const { stats, recentOrders, wishlist, loyalty } = usePage<Props>().props;

    return (
        <ShopAccountShell
            headTitle="Mon compte"
            title="Tableau de bord client"
            description="Retrouvez vos commandes, vos favoris, vos points fidelite et l’ensemble des actions utiles sans sortir de votre espace."
            active="dashboard"
            stats={[
                {
                    label: 'Commandes',
                    value: stats.orders_count,
                    helper: `${stats.completed_orders} terminees`,
                },
                {
                    label: 'Wishlist',
                    value: stats.wishlist_items_count,
                    helper: wishlist?.nom ?? 'Ma liste',
                },
                {
                    label: 'Points',
                    value: stats.loyalty_points,
                    helper: loyalty?.niveau_libelle ?? stats.loyalty_level,
                },
                {
                    label: 'Retours',
                    value: stats.pending_returns_count,
                    helper: `${stats.addresses_count} adresse(s) enregistree(s)`,
                },
            ]}
        >
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                <Card className="py-0">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Commandes recentes</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Les derniers mouvements de votre compte client.
                            </p>
                        </div>
                        <Button variant="outline" asChild>
                            <Link href={tenant.orders.index().url}>
                                Tout voir
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {recentOrders.length > 0 ? (
                            recentOrders.map((order) => (
                                <Link
                                    key={order.id}
                                    href={tenant.orders.show(order.id).url}
                                    className="flex items-center justify-between rounded-2xl border px-4 py-3 transition hover:bg-muted/40"
                                >
                                    <div className="space-y-1">
                                        <p className="font-medium">
                                            {order.numero_commande}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {order.lignes_count} article(s)
                                        </p>
                                    </div>
                                    <div className="space-y-1 text-right">
                                        <Badge variant="secondary">
                                            {order.statut}
                                        </Badge>
                                        <p className="text-sm font-medium">
                                            {order.total} €
                                        </p>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                                Aucune commande recente pour le moment.
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="py-0">
                        <CardHeader>
                            <CardTitle>Raccourcis utiles</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-3">
                            <Link
                                href={tenant.wishlist.index().url}
                                className="flex items-center gap-3 rounded-2xl border px-4 py-3 hover:bg-muted/40"
                            >
                                <Heart className="h-4 w-4 text-primary" />
                                <span>Revoir mes favoris</span>
                            </Link>
                            <Link
                                href={tenant.loyalty.index().url}
                                className="flex items-center gap-3 rounded-2xl border px-4 py-3 hover:bg-muted/40"
                            >
                                <Sparkles className="h-4 w-4 text-primary" />
                                <span>Utiliser mes points fidelite</span>
                            </Link>
                            <Link
                                href={tenant.orders.index().url}
                                className="flex items-center gap-3 rounded-2xl border px-4 py-3 hover:bg-muted/40"
                            >
                                <ShoppingBag className="h-4 w-4 text-primary" />
                                <span>Suivre mes commandes</span>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="py-0">
                        <CardHeader>
                            <CardTitle>Statut du programme</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="rounded-2xl bg-muted/50 p-4">
                                <p className="text-sm text-muted-foreground">
                                    Niveau actuel
                                </p>
                                <p className="text-2xl font-semibold">
                                    {loyalty?.niveau_libelle ??
                                        stats.loyalty_level}
                                </p>
                            </div>
                            <div className="rounded-2xl bg-primary/8 p-4">
                                <p className="text-sm text-muted-foreground">
                                    Solde disponible
                                </p>
                                <p className="text-2xl font-semibold">
                                    {loyalty?.points ?? stats.loyalty_points}{' '}
                                    points
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ShopAccountShell>
    );
}
