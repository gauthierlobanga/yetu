import { Link, router, usePage } from '@inertiajs/react';
import ShopAccountShell from '@/components/ecommerce/ShopAccountShell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OrderLine {
    id: string;
    quantite: number;
    prix_total: number | string;
    produit?: {
        nom?: string;
        slug?: string;
    } | null;
}

interface Order {
    id: string;
    numero_commande: string;
    statut: string;
    total: number | string;
    sous_total?: number | string;
    taxe?: number | string;
    frais_livraison?: number | string;
    mode_paiement?: string | null;
    date_commande?: string | null;
    lignes: OrderLine[];
    adresse_facturation?: {
        adresse_complete?: string;
    } | null;
    adresse_livraison?: {
        adresse_complete?: string;
    } | null;
}

interface Props extends Record<string, unknown> {
    order: Order;
}

export default function ShopOrderShowPage() {
    const { order } = usePage<Props>().props;

    return (
        <ShopAccountShell
            headTitle={`Commande ${order.numero_commande}`}
            title={order.numero_commande}
            description="Detail complet de votre commande, du contenu panier jusqu’aux adresses et au paiement."
            active="orders"
            stats={[
                {
                    label: 'Statut',
                    value: order.statut,
                    helper: order.date_commande ?? 'Date non disponible',
                },
                {
                    label: 'Total',
                    value: `${order.total} €`,
                    helper: order.mode_paiement ?? 'Mode de paiement',
                },
            ]}
        >
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                <Card className="py-0">
                    <CardHeader>
                        <CardTitle>Articles commandes</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {order.lignes.map((line) => (
                            <div
                                key={line.id}
                                className="flex items-center justify-between rounded-2xl border px-4 py-3"
                            >
                                <div>
                                    <p className="font-medium">
                                        {line.produit?.nom ?? 'Produit'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Quantite: {line.quantite}
                                    </p>
                                </div>
                                <p className="font-medium">
                                    {line.prix_total} €
                                </p>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="py-0">
                        <CardHeader>
                            <CardTitle>Resume</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                    Statut
                                </span>
                                <Badge variant="secondary">
                                    {order.statut}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                    Sous-total
                                </span>
                                <span>{order.sous_total ?? order.total} €</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                    Livraison
                                </span>
                                <span>{order.frais_livraison ?? 0} €</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                    Taxes
                                </span>
                                <span>{order.taxe ?? 0} €</span>
                            </div>
                            <div className="flex items-center justify-between border-t pt-3 font-semibold">
                                <span>Total</span>
                                <span>{order.total} €</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="py-0">
                        <CardHeader>
                            <CardTitle>Adresses</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div>
                                <p className="mb-1 font-medium">Facturation</p>
                                <p className="text-muted-foreground">
                                    {order.adresse_facturation
                                        ?.adresse_complete ?? 'Non renseignee'}
                                </p>
                            </div>
                            <div>
                                <p className="mb-1 font-medium">Livraison</p>
                                <p className="text-muted-foreground">
                                    {order.adresse_livraison
                                        ?.adresse_complete ?? 'Non renseignee'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex flex-wrap gap-3">
                        <Button
                            variant="outline"
                            onClick={() =>
                                router.post(route('orders.cancel', order.id))
                            }
                        >
                            Annuler la commande
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={route('orders.invoice', order.id)}>
                                Demander la facture
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={route('return.create', order.id)}>
                                Demander un retour
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </ShopAccountShell>
    );
}
