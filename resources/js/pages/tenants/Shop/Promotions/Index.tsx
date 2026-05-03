import { Head, Link, usePage } from '@inertiajs/react';
import { CalendarRange, TicketPercent } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import MainLayout from '@/layouts/main-layout';

interface Promotion {
    id: string;
    nom?: string | null;
    description?: string | null;
    code?: string | null;
    type: string;
    valeur: number | string;
    date_fin?: string | null;
    est_active: boolean;
}

interface Props extends Record<string, unknown> {
    promotions: Promotion[];
}

export default function PromotionsIndexPage() {
    const { promotions } = usePage<Props>().props;

    return (
        <MainLayout>
            <Head title="Promotions" />

            <div className="mx-auto max-w-7xl px-4 py-8">
                <div className="mb-8 rounded-3xl border bg-linear-to-br from-primary/8 to-secondary/8 p-6">
                    <Badge variant="secondary">Promotions actives</Badge>
                    <h1 className="mt-3 font-heading text-3xl font-semibold">
                        Les meilleures offres du moment
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                        Retrouvez les reductions disponibles et les codes a
                        utiliser sur vos prochaines commandes.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {promotions.map((promotion) => (
                        <Card key={promotion.id} className="py-0">
                            <CardContent className="space-y-4 p-5">
                                <div className="flex items-center justify-between">
                                    <Badge>
                                        <TicketPercent className="mr-2 h-3.5 w-3.5" />
                                        {promotion.valeur}
                                    </Badge>
                                    {promotion.code && (
                                        <Badge variant="secondary">
                                            {promotion.code}
                                        </Badge>
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold">
                                        {promotion.nom ?? 'Promotion'}
                                    </h2>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {promotion.description ??
                                            'Offre active sur une selection de produits.'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <CalendarRange className="h-4 w-4" />
                                    <span>
                                        Jusqu’au{' '}
                                        {promotion.date_fin ?? 'sans limite'}
                                    </span>
                                </div>
                                <Link
                                    href={route('tenant.products.index')}
                                    className="inline-flex text-sm font-medium text-primary hover:underline"
                                >
                                    Explorer les produits
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </MainLayout>
    );
}
