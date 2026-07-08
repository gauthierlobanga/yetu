// resources/js/pages/Shop/Returns/Create.tsx
import type { PageProps } from '@inertiajs/core';
import { useForm, usePage, Head } from '@inertiajs/react';
import {
    RotateCcw,
    Package,
    Send,
    ArrowLeft,
    Info,
    ShoppingBag,
} from 'lucide-react';
import CountUp from 'react-countup';
import { toast } from 'sonner';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Textarea } from '@/components/ui/textarea';

// Types
interface CommandeLine {
    id: string;
    quantite: number;
    prix_total: number | string;
    produit?: { nom?: string } | null;
}

interface Props extends PageProps {
    commande: {
        id: string;
        numero_commande: string;
        total?: number | string;
        date_commande?: string | null;
        lignes: CommandeLine[];
    };
    stats?: {
        total_returns: number;
        accepted_returns: number;
    };
}

function formatCurrency(amount: number | string): string {
    const value = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (isNaN(value)) {
        return String(amount);
    }

    return new Intl.NumberFormat('fr-CD', {
        style: 'currency',
        currency: 'CDF',
        minimumFractionDigits: 0,
    }).format(value);
}

export default function ShopReturnCreatePage() {
    const { commande, stats } = usePage<Props>().props;
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
            etat: 'conforme' as const,
        })),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(route('return.store'), {
            preserveScroll: true,
            onSuccess: () => toast.success('Demande de retour envoyée'),
            onError: () => toast.error('Veuillez vérifier les champs'),
        });
    };

    const totalReturnedItems = form.data.lignes.reduce(
        (sum, l) => sum + l.quantite,
        0,
    );

    return (
        <SidebarProvider
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 72)',
                    '--header-height': 'calc(var(--spacing) * 12)',
                } as React.CSSProperties
            }
        >
            <Head title={`Retour - ${commande.numero_commande}`} />
            <AppSidebar />
            <SidebarInset>
                <SiteHeader />
                <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                    <div className="flex flex-1 flex-col gap-6 p-4 pt-0 md:p-6 md:pt-0">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-fit rounded-xl"
                            asChild
                        >
                            <a href={route('tenant.orders.show', commande.id)}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Retour à la commande
                            </a>
                        </Button>

                        {/* En-tête premium */}
                        <div className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white/80 p-8 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/70">
                            <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-transparent" />
                            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <Badge className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400">
                                        <RotateCcw className="h-4 w-4" />
                                        Demande de retour
                                    </Badge>
                                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl dark:text-white">
                                        {commande.numero_commande}
                                    </h1>
                                    <p className="mt-2 text-slate-500 dark:text-slate-400">
                                        Sélectionnez les articles concernés et
                                        précisez le motif.
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
                                        <ShoppingBag className="h-5 w-5 text-emerald-500" />
                                        <div>
                                            <p className="text-xs text-slate-500">
                                                Articles
                                            </p>
                                            <p className="font-semibold text-slate-900 dark:text-white">
                                                {commande.lignes.length}
                                            </p>
                                        </div>
                                    </div>
                                    {commande.total && (
                                        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
                                            <Package className="h-5 w-5 text-emerald-500" />
                                            <div>
                                                <p className="text-xs text-slate-500">
                                                    Total commande
                                                </p>
                                                <p className="font-semibold text-slate-900 dark:text-white">
                                                    {formatCurrency(
                                                        commande.total,
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Stats rapides (optionnelles) */}
                        {stats && (
                            <div className="grid grid-cols-2 gap-4">
                                <Card className="rounded-2xl border-0 bg-white/60 shadow-sm backdrop-blur-md dark:bg-slate-900/60">
                                    <CardContent className="flex items-center gap-3 p-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/30">
                                            <RotateCcw className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500">
                                                Total retours
                                            </p>
                                            <p className="text-xl font-bold text-slate-900 dark:text-white">
                                                <CountUp
                                                    start={0}
                                                    end={stats.total_returns}
                                                    duration={1}
                                                />
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="rounded-2xl border-0 bg-white/60 shadow-sm backdrop-blur-md dark:bg-slate-900/60">
                                    <CardContent className="flex items-center gap-3 p-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/30">
                                            <Send className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500">
                                                Retours acceptés
                                            </p>
                                            <p className="text-xl font-bold text-slate-900 dark:text-white">
                                                <CountUp
                                                    start={0}
                                                    end={stats.accepted_returns}
                                                    duration={1}
                                                />
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <Card className="rounded-2xl border-0 bg-white/60 shadow-lg shadow-slate-200/20 backdrop-blur-md dark:bg-slate-900/60 dark:shadow-black/20">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                                        <Package className="h-5 w-5 text-emerald-500" />
                                        Produits concernés
                                    </CardTitle>
                                    <CardDescription>
                                        Sélectionnez la quantité à retourner et
                                        l'état pour chaque article.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    {commande.lignes.map((line, index) => (
                                        <div
                                            key={line.id}
                                            className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 md:grid-cols-[minmax(0,1fr)_100px_180px] dark:border-slate-800 dark:bg-slate-900/60"
                                        >
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-white">
                                                    {line.produit?.nom ??
                                                        'Produit'}
                                                </p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                                    Qté commandée :{' '}
                                                    {line.quantite} ·{' '}
                                                    {formatCurrency(
                                                        line.prix_total,
                                                    )}
                                                </p>
                                            </div>
                                            <Input
                                                type="number"
                                                min="1"
                                                max={line.quantite}
                                                value={
                                                    form.data.lignes[index]
                                                        ?.quantite ?? 1
                                                }
                                                onChange={(event) => {
                                                    const lignes = [
                                                        ...form.data.lignes,
                                                    ];
                                                    lignes[index] = {
                                                        ...lignes[index],
                                                        quantite: Number(
                                                            event.target.value,
                                                        ),
                                                    };
                                                    form.setData(
                                                        'lignes',
                                                        lignes,
                                                    );
                                                }}
                                                className="h-10 rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800/80"
                                            />
                                            <Select
                                                value={
                                                    form.data.lignes[index]
                                                        ?.etat
                                                }
                                                onValueChange={(value) => {
                                                    const lignes = [
                                                        ...form.data.lignes,
                                                    ];
                                                    lignes[index] = {
                                                        ...lignes[index],
                                                        etat: value as any,
                                                    };
                                                    form.setData(
                                                        'lignes',
                                                        lignes,
                                                    );
                                                }}
                                            >
                                                <SelectTrigger className="h-10 rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800/80">
                                                    <SelectValue placeholder="État" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="conforme">
                                                        Conforme
                                                    </SelectItem>
                                                    <SelectItem value="defectueux">
                                                        Défectueux
                                                    </SelectItem>
                                                    <SelectItem value="endommage">
                                                        Endommagé
                                                    </SelectItem>
                                                    <SelectItem value="incomplet">
                                                        Incomplet
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    ))}

                                    <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-700 dark:bg-amber-950/20 dark:text-amber-400">
                                        <Info className="h-4 w-4 shrink-0" />
                                        <span>
                                            {totalReturnedItems} article(s)
                                            sélectionné(s) pour le retour.
                                        </span>
                                    </div>

                                    <Textarea
                                        value={form.data.motif}
                                        onChange={(e) =>
                                            form.setData(
                                                'motif',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Expliquez le motif du retour"
                                        className="min-h-25 rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800/80"
                                    />

                                    <Button
                                        type="submit"
                                        disabled={form.processing}
                                        className="w-full rounded-xl bg-linear-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-700 hover:to-emerald-600"
                                    >
                                        <Send className="mr-2 h-4 w-4" />
                                        Envoyer la demande
                                    </Button>
                                </CardContent>
                            </Card>
                        </form>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
