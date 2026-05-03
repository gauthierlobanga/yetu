import { Link, usePage } from '@inertiajs/react';
import ShopAccountShell from '@/components/ecommerce/ShopAccountShell';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface Order {
    id: string;
    numero_commande: string;
    statut: string;
    total: number | string;
    date_commande?: string | null;
    created_at: string;
}

interface Props extends Record<string, unknown> {
    orders: {
        data: Order[];
        total: number;
    };
}

export default function ShopOrdersIndexPage() {
    const { orders } = usePage<Props>().props;

    return (
        <ShopAccountShell
            headTitle="Mes commandes"
            title="Mes commandes"
            description="Consultez l’historique de vos achats, suivez leur statut et accedez au detail de chaque commande."
            active="orders"
            stats={[
                {
                    label: 'Total',
                    value: orders.total,
                    helper: 'commande(s) enregistree(s)',
                },
            ]}
        >
            <Card className="py-0">
                <CardHeader>
                    <CardTitle>Historique</CardTitle>
                    <CardDescription>
                        Toutes vos commandes centralisees au meme endroit.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Commande</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead />
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.data.length > 0 ? (
                                orders.data.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-medium">
                                            {order.numero_commande}
                                        </TableCell>
                                        <TableCell>
                                            {order.date_commande ??
                                                order.created_at}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">
                                                {order.statut}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{order.total} €</TableCell>
                                        <TableCell className="text-right">
                                            <Link
                                                href={route(
                                                    'orders.show',
                                                    order.id,
                                                )}
                                                className="text-sm font-medium text-primary hover:underline"
                                            >
                                                Voir
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="py-8 text-center text-muted-foreground"
                                    >
                                        Aucune commande trouvee.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </ShopAccountShell>
    );
}
