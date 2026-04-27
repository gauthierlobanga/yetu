import { Link, usePage } from '@inertiajs/react';
import ShopAccountShell from '@/components/shop/ShopAccountShell';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ReturnItem {
    id: string;
    statut: string;
    motif?: string | null;
    date_demande?: string | null;
    commande?: {
        id: string;
        numero_commande: string;
    } | null;
}

interface Props extends Record<string, unknown> {
    returns: {
        data: ReturnItem[];
        total: number;
    };
}

export default function ShopReturnsIndexPage() {
    const { returns } = usePage<Props>().props;

    return (
        <ShopAccountShell
            headTitle="Retours"
            title="Mes retours"
            description="Suivez toutes vos demandes de retour et verifiez rapidement leur etat de traitement."
            active="returns"
            stats={[
                {
                    label: 'Demandes',
                    value: returns.total,
                    helper: 'retour(s) enregistre(s)',
                },
            ]}
        >
            <div className="grid gap-4">
                {returns.data.length > 0 ? (
                    returns.data.map((returnItem) => (
                        <Card key={returnItem.id} className="py-0">
                            <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
                                <div className="space-y-1">
                                    <p className="font-medium">
                                        {returnItem.commande
                                            ?.numero_commande ??
                                            'Commande'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {returnItem.motif ??
                                            'Motif non precise'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge variant="secondary">
                                        {returnItem.statut}
                                    </Badge>
                                    <Link
                                        href={route(
                                            'shop.returns.show',
                                            returnItem.id,
                                        )}
                                        className="text-sm font-medium text-primary hover:underline"
                                    >
                                        Voir le detail
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card className="py-0">
                        <CardHeader>
                            <CardTitle>Aucun retour</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-muted-foreground">
                            Vos prochaines demandes de retour apparaitront ici.
                        </CardContent>
                    </Card>
                )}
            </div>
        </ShopAccountShell>
    );
}
