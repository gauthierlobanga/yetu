import { usePage } from '@inertiajs/react';
import ShopAccountShell from '@/components/shop/ShopAccountShell';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ReturnLine {
    id: string;
    quantite: number;
    montant: number | string;
    etat_label?: string;
    etat?: string;
    ligne_commande?: {
        produit?: {
            nom?: string;
        } | null;
    } | null;
}

interface Props extends Record<string, unknown> {
    return: {
        id: string;
        statut: string;
        motif_label?: string;
        motif?: string;
        commentaire?: string | null;
        commande?: {
            numero_commande: string;
        } | null;
        lignes: ReturnLine[];
    };
}

export default function ShopReturnShowPage() {
    const { return: returnRequest } = usePage<Props>().props;

    return (
        <ShopAccountShell
            headTitle="Detail du retour"
            title={`Retour ${returnRequest.commande?.numero_commande ?? ''}`}
            description="Consultez le statut courant du dossier et le detail des lignes retournees."
            active="returns"
            stats={[
                {
                    label: 'Statut',
                    value: returnRequest.statut,
                    helper:
                        returnRequest.motif_label ??
                        returnRequest.motif ??
                        'Motif',
                },
            ]}
        >
            <Card className="py-0">
                <CardHeader>
                    <CardTitle>Produits retournes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {returnRequest.lignes.map((line) => (
                        <div
                            key={line.id}
                            className="flex items-center justify-between rounded-2xl border px-4 py-3"
                        >
                            <div>
                                <p className="font-medium">
                                    {line.ligne_commande?.produit?.nom ??
                                        'Produit'}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {line.quantite} article(s) -{' '}
                                    {line.etat_label ??
                                        line.etat ??
                                        'Etat non precise'}
                                </p>
                            </div>
                            <Badge variant="secondary">
                                {line.montant} €
                            </Badge>
                        </div>
                    ))}

                    {returnRequest.commentaire && (
                        <div className="rounded-2xl bg-muted/50 p-4 text-sm text-muted-foreground">
                            {returnRequest.commentaire}
                        </div>
                    )}
                </CardContent>
            </Card>
        </ShopAccountShell>
    );
}
