import { Link, router, usePage } from '@inertiajs/react';
import ShopAccountShell from '@/components/tenants/shop/ShopAccountShell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WishlistItem {
    id: string;
    quantite: number;
    note?: string | null;
    produit: {
        id: string;
        nom: string;
        slug: string;
        prix_actuel: number | string;
        image_principale?: string | null;
        url: string;
    };
}

interface Props extends Record<string, unknown> {
    wishlist: {
        nom: string;
        est_publique: boolean;
    };
    items: WishlistItem[];
}

export default function ShopWishlistPage() {
    const { wishlist, items } = usePage<Props>().props;

    return (
        <ShopAccountShell
            headTitle="Wishlist"
            title={wishlist.nom}
            description="Retrouvez vos produits favoris, retirez ceux qui ne vous interessent plus et revenez dessus en un clic."
            active="wishlist"
            stats={[
                {
                    label: 'Articles',
                    value: items.length,
                    helper: wishlist.est_publique
                        ? 'Liste partageable'
                        : 'Liste privee',
                },
            ]}
        >
            <div className="grid gap-4 md:grid-cols-2">
                {items.length > 0 ? (
                    items.map((item) => (
                        <Card key={item.id} className="py-0">
                            <CardContent className="flex gap-4 p-4">
                                <div className="h-24 w-24 overflow-hidden rounded-2xl bg-muted">
                                    {item.produit.image_principale ? (
                                        <img
                                            src={item.produit.image_principale}
                                            alt={item.produit.nom}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : null}
                                </div>
                                <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                                    <div className="space-y-1">
                                        <Link
                                            href={item.produit.url}
                                            className="font-medium hover:text-primary"
                                        >
                                            {item.produit.nom}
                                        </Link>
                                        <p className="text-sm text-muted-foreground">
                                            {item.produit.prix_actuel} €
                                        </p>
                                        <Badge variant="secondary">
                                            Quantite souhaitée: {item.quantite}
                                        </Badge>
                                        {item.note && (
                                            <p className="text-sm text-muted-foreground">
                                                {item.note}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button asChild>
                                            <Link href={item.produit.url}>
                                                Voir le produit
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                router.delete(
                                                    route(
                                                        'tenant.wishlist.remove',
                                                        item.produit.id,
                                                    ),
                                                )
                                            }
                                        >
                                            Retirer
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card className="py-0 md:col-span-2">
                        <CardHeader>
                            <CardTitle>Votre wishlist est vide</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            Ajoutez des produits a votre wishlist depuis le
                            catalogue pour les retrouver ici.
                        </CardContent>
                    </Card>
                )}
            </div>
        </ShopAccountShell>
    );
}
