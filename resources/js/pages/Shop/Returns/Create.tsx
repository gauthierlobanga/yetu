import { useForm, usePage } from '@inertiajs/react';
import ShopAccountShell from '@/components/shop/ShopAccountShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface CommandeLine {
    id: string;
    quantite: number;
    prix_total: number | string;
    produit?: {
        nom?: string;
    } | null;
}

interface Props extends Record<string, unknown> {
    commande: {
        id: string;
        numero_commande: string;
        lignes: CommandeLine[];
    };
}

export default function ShopReturnCreatePage() {
    const { commande } = usePage<Props>().props;
    const form = useForm<{
        commande_id: string;
        motif: string;
        lignes: Array<{
            ligne_commande_id: string;
            quantite: number;
            etat: 'conforme' | 'defectueux' | 'endommage' | 'incomplet';
        }>;
    }>({
        commande_id: commande.id,
        motif: '',
        lignes: commande.lignes.map((line) => ({
            ligne_commande_id: line.id,
            quantite: 1,
            etat: 'conforme',
        })),
    });

    return (
        <ShopAccountShell
            headTitle="Nouvelle demande de retour"
            title={`Retour ${commande.numero_commande}`}
            description="Selectionnez les lignes concernees et precisez le contexte du retour pour lancer le traitement."
            active="returns"
        >
            <Card className="py-0">
                <CardHeader>
                    <CardTitle>Produits concernes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {commande.lignes.map((line, index) => (
                        <div
                            key={line.id}
                            className="grid gap-3 rounded-2xl border p-4 md:grid-cols-[minmax(0,1fr)_120px_160px]"
                        >
                            <div>
                                <p className="font-medium">
                                    {line.produit?.nom ?? 'Produit'}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Quantite commandee: {line.quantite}
                                </p>
                            </div>
                            <Input
                                type="number"
                                min="1"
                                max={line.quantite}
                                value={form.data.lignes[index]?.quantite ?? 1}
                                onChange={(event) => {
                                    const lignes = [...form.data.lignes];
                                    lignes[index] = {
                                        ...lignes[index],
                                        quantite: Number(event.target.value),
                                    };
                                    form.setData('lignes', lignes);
                                }}
                            />
                            <select
                                className="rounded-md border bg-background px-3 text-sm"
                                value={form.data.lignes[index]?.etat}
                                onChange={(event) => {
                                    const lignes = [...form.data.lignes];
                                    lignes[index] = {
                                        ...lignes[index],
                                        etat: event.target
                                            .value as (typeof form.data.lignes)[number]['etat'],
                                    };
                                    form.setData('lignes', lignes);
                                }}
                            >
                                <option value="conforme">Conforme</option>
                                <option value="defectueux">Defectueux</option>
                                <option value="endommage">Endommage</option>
                                <option value="incomplet">Incomplet</option>
                            </select>
                        </div>
                    ))}

                    <Textarea
                        value={form.data.motif}
                        onChange={(event) =>
                            form.setData('motif', event.target.value)
                        }
                        placeholder="Expliquez le motif de retour"
                    />

                    <Button
                        disabled={form.processing}
                        onClick={() => form.post(route('shop.returns.store'))}
                    >
                        Envoyer la demande
                    </Button>
                </CardContent>
            </Card>
        </ShopAccountShell>
    );
}
