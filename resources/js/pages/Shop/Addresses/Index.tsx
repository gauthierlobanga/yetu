import { router, useForm, usePage } from '@inertiajs/react';
import ShopAccountShell from '@/components/shop/ShopAccountShell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface Address {
    id: string;
    rue: string;
    complement?: string | null;
    code_postal: string;
    ville: string;
    pays: string;
    telephone?: string | null;
    type: 'facturation' | 'livraison';
    est_defaut: boolean;
    adresse_complete?: string;
}

interface Props extends Record<string, unknown> {
    addresses: Address[];
}

export default function ShopAddressesPage() {
    const { addresses } = usePage<Props>().props;
    const form = useForm({
        rue: '',
        complement: '',
        code_postal: '',
        ville: '',
        pays: '',
        telephone: '',
        type: 'livraison',
        est_defaut: false,
    });

    return (
        <ShopAccountShell
            headTitle="Adresses"
            title="Mes adresses"
            description="Ajoutez et organisez vos adresses de facturation et de livraison pour accelerer vos prochains achats."
            active="addresses"
            stats={[
                {
                    label: 'Adresses',
                    value: addresses.length,
                    helper: 'Facturation et livraison',
                },
            ]}
        >
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                <Card className="py-0">
                    <CardHeader>
                        <CardTitle>Adresses enregistrees</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        {addresses.length > 0 ? (
                            addresses.map((address) => (
                                <div
                                    key={address.id}
                                    className="rounded-2xl border p-4"
                                >
                                    <div className="mb-3 flex items-center gap-2">
                                        <Badge variant="secondary">
                                            {address.type}
                                        </Badge>
                                        {address.est_defaut && (
                                            <Badge>Par defaut</Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {address.adresse_complete ??
                                            `${address.rue}, ${address.code_postal} ${address.ville}, ${address.pays}`}
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                router.post(
                                                    route(
                                                        'shop.addresses.default',
                                                        address.id,
                                                    ),
                                                )
                                            }
                                        >
                                            Definir par defaut
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                router.delete(
                                                    route(
                                                        'shop.addresses.destroy',
                                                        address.id,
                                                    ),
                                                )
                                            }
                                        >
                                            Supprimer
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground md:col-span-2">
                                Aucune adresse disponible pour l’instant.
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="py-0">
                    <CardHeader>
                        <CardTitle>Ajouter une adresse</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Input
                            value={form.data.rue}
                            onChange={(event) =>
                                form.setData('rue', event.target.value)
                            }
                            placeholder="Rue"
                        />
                        <Input
                            value={form.data.complement}
                            onChange={(event) =>
                                form.setData('complement', event.target.value)
                            }
                            placeholder="Complement"
                        />
                        <Input
                            value={form.data.code_postal}
                            onChange={(event) =>
                                form.setData('code_postal', event.target.value)
                            }
                            placeholder="Code postal"
                        />
                        <Input
                            value={form.data.ville}
                            onChange={(event) =>
                                form.setData('ville', event.target.value)
                            }
                            placeholder="Ville"
                        />
                        <Input
                            value={form.data.pays}
                            onChange={(event) =>
                                form.setData('pays', event.target.value)
                            }
                            placeholder="Pays"
                        />
                        <Input
                            value={form.data.telephone}
                            onChange={(event) =>
                                form.setData('telephone', event.target.value)
                            }
                            placeholder="Telephone"
                        />
                        <div className="flex gap-2">
                            <Button
                                variant={
                                    form.data.type === 'livraison'
                                        ? 'default'
                                        : 'outline'
                                }
                                onClick={() =>
                                    form.setData('type', 'livraison')
                                }
                            >
                                Livraison
                            </Button>
                            <Button
                                variant={
                                    form.data.type === 'facturation'
                                        ? 'default'
                                        : 'outline'
                                }
                                onClick={() =>
                                    form.setData('type', 'facturation')
                                }
                            >
                                Facturation
                            </Button>
                        </div>
                        <Button
                            disabled={form.processing}
                            onClick={() =>
                                form.post(route('shop.addresses.store'))
                            }
                        >
                            Enregistrer l’adresse
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </ShopAccountShell>
    );
}
