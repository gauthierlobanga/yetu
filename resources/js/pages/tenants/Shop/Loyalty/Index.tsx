import { useForm, usePage } from '@inertiajs/react';
import ShopAccountShell from '@/components/tenants/shop/ShopAccountShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface Transaction {
    id: string;
    type: string;
    points: number;
    raison?: string | null;
    created_at?: string;
    date_transaction?: string;
}

interface LoyaltyAccount {
    points: number;
    points_cumules: number;
    niveau?: string | null;
    transactions: Transaction[];
}

interface Props extends Record<string, unknown> {
    compte: LoyaltyAccount;
}

export default function ShopLoyaltyPage() {
    const { compte } = usePage<Props>().props;
    const form = useForm({
        points: '',
    });
    const loyaltyLabel =
        {
            bronze: 'Bronze',
            argent: 'Argent',
            or: 'Or',
            platine: 'Platine',
            diamant: 'Diamant',
        }[compte.niveau ?? 'bronze'] ?? 'Bronze';

    return (
        <ShopAccountShell
            headTitle="Fidelite"
            title="Programme de fidelite"
            description="Suivez votre solde, visualisez vos mouvements et transformez vos points en avantages concrets."
            active="loyalty"
            stats={[
                {
                    label: 'Points',
                    value: compte.points,
                    helper: `${compte.points_cumules} cumules`,
                },
                {
                    label: 'Niveau',
                    value: loyaltyLabel,
                    helper: 'Niveau actuel du programme',
                },
            ]}
        >
            <div className="grid gap-6 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
                <Card className="py-0">
                    <CardHeader>
                        <CardTitle>Utiliser mes points</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input
                            type="number"
                            min="1"
                            value={form.data.points}
                            onChange={(event) =>
                                form.setData('points', event.target.value)
                            }
                            placeholder="Nombre de points"
                        />
                        <Button
                            disabled={form.processing}
                            onClick={() =>
                                form.post(route('tenant.loyalty.redeem'))
                            }
                        >
                            Echanger mes points
                        </Button>
                    </CardContent>
                </Card>

                <Card className="py-0">
                    <CardHeader>
                        <CardTitle>Historique des transactions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {compte.transactions.length > 0 ? (
                            compte.transactions.map((transaction) => (
                                <div
                                    key={transaction.id}
                                    className="flex items-center justify-between rounded-2xl border px-4 py-3"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {transaction.raison ??
                                                'Mouvement de points'}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {transaction.date_transaction ??
                                                transaction.created_at}
                                        </p>
                                    </div>
                                    <p
                                        className={`font-semibold ${
                                            transaction.points >= 0
                                                ? 'text-emerald-600'
                                                : 'text-rose-600'
                                        }`}
                                    >
                                        {transaction.points > 0 ? '+' : ''}
                                        {transaction.points}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                                Aucune transaction fidelite pour l’instant.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </ShopAccountShell>
    );
}
