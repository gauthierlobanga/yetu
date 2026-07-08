// resources/js/pages/Shop/Orders/Show.tsx
import type { PageProps } from '@inertiajs/core';
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'motion/react';
import {
    ArrowLeft,
    Package,
    CreditCard,
    MapPin,
    Receipt,
    RotateCcw,
    ShoppingBag,
    Truck,
    CheckCircle,
    Clock,
    XCircle,
    AlertCircle,
    Calendar,
    DollarSign,
} from 'lucide-react';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import tenant from '@/routes/tenant';

// ---------- Types ----------
interface OrderLine {
    id: string;
    quantite: number;
    prix_total: number | string;
    produit?: {
        nom?: string;
        slug?: string;
        image?: string;
    } | null;
}

interface Address {
    adresse_complete?: string;
    rue?: string;
    complement?: string;
    code_postal?: string;
    ville?: string;
    pays?: string;
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
    adresse_facturation?: Address | null;
    adresse_livraison?: Address | null;
}

interface Props extends PageProps {
    order: Order;
}

// Statuts avec icônes, couleurs et labels
const statusConfig: Record<
    string,
    { label: string; icon: any; color: string; borderColor: string }
> = {
    en_attente: {
        label: 'En attente',
        icon: Clock,
        color: 'text-amber-600 dark:text-amber-400',
        borderColor: 'border-amber-200 dark:border-amber-800',
    },
    confirmee: {
        label: 'Confirmée',
        icon: CheckCircle,
        color: 'text-blue-600 dark:text-blue-400',
        borderColor: 'border-blue-200 dark:border-blue-800',
    },
    en_preparation: {
        label: 'En préparation',
        icon: Package,
        color: 'text-purple-600 dark:text-purple-400',
        borderColor: 'border-purple-200 dark:border-purple-800',
    },
    expédiée: {
        label: 'Expédiée',
        icon: Truck,
        color: 'text-indigo-600 dark:text-indigo-400',
        borderColor: 'border-indigo-200 dark:border-indigo-800',
    },
    livree: {
        label: 'Livrée',
        icon: CheckCircle,
        color: 'text-emerald-600 dark:text-emerald-400',
        borderColor: 'border-emerald-200 dark:border-emerald-800',
    },
    annulee: {
        label: 'Annulée',
        icon: XCircle,
        color: 'text-red-600 dark:text-red-400',
        borderColor: 'border-red-200 dark:border-red-800',
    },
    remboursee: {
        label: 'Remboursée',
        icon: AlertCircle,
        color: 'text-slate-600 dark:text-slate-400',
        borderColor: 'border-slate-200 dark:border-slate-700',
    },
};

// Fonction utilitaire
const formatCurrency = (value: number | string | undefined) => {
    if (value === undefined || value === null) {
        return '0,00 €';
    }

    const num = typeof value === 'string' ? parseFloat(value) : value;

    return num.toFixed(2) + ' €';
};

export default function ShopOrderShowPage() {
    const { order } = usePage<Props>().props;
    const status = statusConfig[order.statut] ?? statusConfig.en_attente;
    const StatusIcon = status.icon;

    // Calcul du nombre total d'articles
    const totalItems = order.lignes.reduce((acc, l) => acc + l.quantite, 0);

    return (
        <SidebarProvider
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 72)',
                    '--header-height': 'calc(var(--spacing) * 12)',
                } as React.CSSProperties
            }
        >
            <Head title={`Commande ${order.numero_commande}`} />
            <AppSidebar />
            <SidebarInset>
                <SiteHeader />
                <div className="min-h-screen bg-linear-to-br from-slate-50/80 via-white to-emerald-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                    <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 lg:py-10">
                        {/* Bouton retour */}
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6"
                        >
                            <Button
                                variant="ghost"
                                size="sm"
                                className="gap-1.5 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                asChild
                            >
                                <Link href={tenant.orders.index().url}>
                                    <ArrowLeft className="h-4 w-4" />
                                    Retour aux commandes
                                </Link>
                            </Button>
                        </motion.div>

                        {/* En-tête avec commande et statut */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 flex flex-wrap items-start justify-between gap-4"
                        >
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {order.numero_commande}
                                </h1>
                                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="h-4 w-4" />
                                        {order.date_commande
                                            ? new Date(
                                                  order.date_commande,
                                              ).toLocaleDateString('fr-FR', {
                                                  day: 'numeric',
                                                  month: 'long',
                                                  year: 'numeric',
                                              })
                                            : 'Date inconnue'}
                                    </span>
                                    <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                                    <span>
                                        {totalItems} article
                                        {totalItems > 1 ? 's' : ''}
                                    </span>
                                    <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                                    <span className="flex items-center gap-1.5">
                                        <DollarSign className="h-4 w-4" />
                                        {formatCurrency(order.total)}
                                    </span>
                                </div>
                            </div>
                            <Badge
                                className={cn(
                                    'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium',
                                    status.borderColor,
                                    status.color,
                                )}
                            >
                                <StatusIcon className="h-4 w-4" />
                                {status.label}
                            </Badge>
                        </motion.div>

                        {/* Grille principale : commande + sidebar */}
                        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
                            {/* Colonne gauche : articles */}
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.05 }}
                            >
                                <Card className="overflow-hidden rounded-3xl border-0 bg-white/80 shadow-lg shadow-slate-200/30 backdrop-blur-xl dark:bg-slate-900/80 dark:shadow-slate-950/30">
                                    <CardHeader className="border-b border-slate-100/60 px-6 py-4 dark:border-slate-800/60">
                                        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                                            <ShoppingBag className="h-5 w-5 text-emerald-500" />
                                            Détail de la commande
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="divide-y divide-slate-100/60 px-0 dark:divide-slate-800/60">
                                        {order.lignes.map((line) => (
                                            <div
                                                key={line.id}
                                                className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                                            >
                                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                                                    {line.produit?.image ? (
                                                        <img
                                                            src={
                                                                line.produit
                                                                    .image
                                                            }
                                                            alt=""
                                                            className="h-full w-full rounded-xl object-cover"
                                                        />
                                                    ) : (
                                                        <Package className="h-6 w-6 text-slate-400" />
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate font-medium text-slate-900 dark:text-white">
                                                        {line.produit?.nom ??
                                                            'Produit indisponible'}
                                                    </p>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                                        Quantité :{' '}
                                                        {line.quantite}
                                                    </p>
                                                </div>
                                                <div className="text-right font-semibold text-slate-900 dark:text-white">
                                                    {formatCurrency(
                                                        line.prix_total,
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Colonne droite : résumé + adresses + actions */}
                            <motion.div
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="space-y-6"
                            >
                                {/* Résumé */}
                                <Card className="rounded-3xl border-0 bg-white/80 shadow-lg shadow-slate-200/30 backdrop-blur-xl dark:bg-slate-900/80 dark:shadow-slate-950/30">
                                    <CardHeader className="border-b border-slate-100/60 px-6 py-4 dark:border-slate-800/60">
                                        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                                            <Receipt className="h-5 w-5 text-emerald-500" />
                                            Résumé
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3 px-6 py-5">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500 dark:text-slate-400">
                                                Sous-total
                                            </span>
                                            <span className="font-medium text-slate-900 dark:text-white">
                                                {formatCurrency(
                                                    order.sous_total,
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500 dark:text-slate-400">
                                                Livraison
                                            </span>
                                            <span className="font-medium text-slate-900 dark:text-white">
                                                {formatCurrency(
                                                    order.frais_livraison,
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500 dark:text-slate-400">
                                                Taxes
                                            </span>
                                            <span className="font-medium text-slate-900 dark:text-white">
                                                {formatCurrency(order.taxe)}
                                            </span>
                                        </div>
                                        <Separator className="bg-slate-200/60 dark:bg-slate-800/60" />
                                        <div className="flex justify-between text-base font-bold">
                                            <span className="text-slate-900 dark:text-white">
                                                Total
                                            </span>
                                            <span className="text-emerald-600 dark:text-emerald-400">
                                                {formatCurrency(order.total)}
                                            </span>
                                        </div>
                                        {order.mode_paiement && (
                                            <div className="flex items-center gap-2 pt-2 text-sm text-slate-500 dark:text-slate-400">
                                                <CreditCard className="h-4 w-4" />
                                                <span>
                                                    Payé par{' '}
                                                    {order.mode_paiement}
                                                </span>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Adresses */}
                                <Card className="rounded-3xl border-0 bg-white/80 shadow-lg shadow-slate-200/30 backdrop-blur-xl dark:bg-slate-900/80 dark:shadow-slate-950/30">
                                    <CardHeader className="border-b border-slate-100/60 px-6 py-4 dark:border-slate-800/60">
                                        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                                            <MapPin className="h-5 w-5 text-emerald-500" />
                                            Adresses
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid gap-4 px-6 py-5 sm:grid-cols-2">
                                        <div>
                                            <p className="mb-1 text-xs font-medium tracking-wider text-slate-400 uppercase dark:text-slate-500">
                                                Facturation
                                            </p>
                                            <p className="text-sm text-slate-700 dark:text-slate-300">
                                                {order.adresse_facturation
                                                    ?.adresse_complete ??
                                                    'Non renseignée'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="mb-1 text-xs font-medium tracking-wider text-slate-400 uppercase dark:text-slate-500">
                                                Livraison
                                            </p>
                                            <p className="text-sm text-slate-700 dark:text-slate-300">
                                                {order.adresse_livraison
                                                    ?.adresse_complete ??
                                                    'Non renseignée'}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Actions */}
                                <div className="flex flex-wrap gap-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/20"
                                        asChild
                                    >
                                        <Link
                                            href={
                                                tenant.orders.cancel(order.id)
                                                    .url
                                            }
                                            method="post"
                                            as="button"
                                        >
                                            <RotateCcw className="mr-2 h-4 w-4" />
                                            Annuler
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="rounded-xl"
                                        asChild
                                    >
                                        <Link
                                            href={
                                                tenant.orders.invoice(order.id)
                                                    .url
                                            }
                                            target="_blank"
                                        >
                                            <Receipt className="mr-2 h-4 w-4" />
                                            Facture
                                        </Link>
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                                        asChild
                                    >
                                        <Link
                                            href={
                                                tenant.return.create(order.id)
                                                    .url
                                            }
                                        >
                                            <RotateCcw className="mr-2 h-4 w-4" />
                                            Retour
                                        </Link>
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
