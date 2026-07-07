/* eslint-disable @typescript-eslint/no-unused-vars */
import type { PageProps } from '@inertiajs/core';
import { useForm, usePage, Head } from '@inertiajs/react';
import {
    Gift,
    History,
    Sparkles,
    Trophy,
    Coins,
    ArrowUpRight,
    ArrowDownRight,
    Info,
    CheckCircle2,
    Ticket,
    ShoppingBag,
    ArrowRight,
    Clock
} from 'lucide-react';

import { toast } from 'sonner';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

// ---------- Types ----------
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

interface LoyaltyProgram {
    nom: string;
    regles: {
        seuils: Record<string, number>;
        gain: {
            type: string;
            valeur: number;
            points: number;
        };
        taux_conversion: number;
    };
}

interface Props extends PageProps {
    compte: LoyaltyAccount;
    programme: LoyaltyProgram;
}

// ---------- Niveaux ----------
const loyaltyLevels: Record<string, { label: string; icon: any; color: string; next: string | null }> = {
    bronze: {
        label: 'Bronze',
        icon: Trophy,
        color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30',
        next: 'argent'
    },
    argent: {
        label: 'Argent',
        icon: Trophy,
        color: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50',
        next: 'or'
    },
    or: {
        label: 'Or',
        icon: Trophy,
        color: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/30',
        next: 'platine'
    },
    platine: {
        label: 'Platine',
        icon: Trophy,
        color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30',
        next: 'diamant'
    },
    diamant: {
        label: 'Diamant',
        icon: Trophy,
        color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30',
        next: null
    },
};

export default function ShopLoyaltyPage() {
    const { compte, programme } = usePage<Props>().props;
    const form = useForm({ points: '' });

    const currentLevelKey = compte.niveau?.toLowerCase() ?? 'bronze';
    const level = loyaltyLevels[currentLevelKey] ?? loyaltyLevels.bronze;
    const LevelIcon = level.icon;

    const seuils = programme?.regles?.seuils ?? {};
    const nextLevelKey = level.next;
    const maxPointsForNextLevel = nextLevelKey ? (seuils[nextLevelKey] ?? 500) : compte.points_cumules;
    const progress = nextLevelKey
        ? Math.min((compte.points_cumules / maxPointsForNextLevel) * 100, 100)
        : 100;

    const gainValue = programme?.regles?.gain?.valeur ?? 1;
    const gainPoints = programme?.regles?.gain?.points ?? 1;
    const conversionRate = programme?.regles?.taux_conversion ?? 100;

    const handleRedeem = (e: React.FormEvent) => {
        e.preventDefault();
        const pointsToRedeem = parseInt(form.data.points, 10);

        if (isNaN(pointsToRedeem) || pointsToRedeem <= 0 || pointsToRedeem > compte.points) {
            toast.error("Veuillez entrer un nombre de points valide.");

            return;
        }

        form.post(route('loyalty.redeem'), {
            onSuccess: () => {
                toast.success(`${pointsToRedeem} points échangés avec succès !`);
                form.reset('points');
            },
            onError: () => toast.error("Une erreur est survenue lors de l'échange.")
        });
    };

    return (
        <SidebarProvider
            className={cn(
                'h-screen overflow-hidden',
                'border-r border-slate-200/70',
                'bg-white/92 backdrop-blur-3xl supports-backdrop-filter:bg-white/88',
                'dark:border-transparent',
                'dark:bg-slate-950/94 dark:supports-backdrop-filter:bg-slate-950/88',
            )}
            style={{
                '--sidebar-width': 'calc(var(--spacing) * 72)',
                '--header-height': 'calc(var(--spacing) * 12)',
            } as React.CSSProperties}
        >
            <Head title="Programme de fidélité" />
            <AppSidebar />
            <SidebarInset className="flex flex-col min-h-0">
                <SiteHeader />
                <div className="flex-1 min-h-0 overflow-y-auto bg-slate-50/50 dark:bg-slate-950/50">
                    <div className="mx-auto max-w-7xl flex flex-col gap-8 p-4 md:p-8">

                        {/* En-tête Premium */}
                        <div className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white/80 shadow-xs backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/80 p-8 sm:p-10 transition-all duration-300 hover:shadow-md">
                            <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl dark:bg-amber-500/5"></div>
                            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl dark:bg-orange-500/5"></div>

                            <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <Badge variant="outline" className="mb-4 inline-flex items-center gap-1.5 rounded-full border-amber-200 bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700 dark:border-amber-800/50 dark:bg-amber-950/30 dark:text-amber-400">
                                        <Sparkles className="h-3.5 w-3.5" />
                                        {programme?.nom ?? 'Programme fidélité'}
                                    </Badge>
                                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                                        Vos avantages fidélité
                                    </h1>
                                    <p className="mt-3 max-w-xl text-lg text-slate-600 dark:text-slate-400">
                                        Cumulez des points à chaque achat et débloquez des récompenses exclusives et des réductions sur vos prochaines commandes.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            {/* Colonne Principale (Statistiques & Récompenses) */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Statistiques Rapides */}
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <Card className="rounded-2xl border-slate-200/60 bg-white/60 backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/60 hover:bg-white/80 dark:hover:bg-slate-900/80 transition-colors">
                                        <CardContent className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-amber-100 to-amber-50 dark:from-amber-900/40 dark:to-amber-900/10 border border-amber-200/50 dark:border-amber-800/50">
                                                    <Coins className="h-7 w-7 text-amber-600 dark:text-amber-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Solde actuel</p>
                                                    <p className="text-4xl font-bold text-slate-900 dark:text-white">{compte.points}</p>
                                                    <p className="text-xs font-medium text-amber-600 dark:text-amber-400 mt-1">
                                                        ≈ {(compte.points / conversionRate).toFixed(2)} € de réduction
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="rounded-2xl border-slate-200/60 bg-white/60 backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/60 hover:bg-white/80 dark:hover:bg-slate-900/80 transition-colors">
                                        <CardContent className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className={cn('flex h-14 w-14 items-center justify-center rounded-2xl border', level.color.replace('bg-', 'from-').replace('text-', 'text-').concat(' bg-linear-to-br to-transparent border-current/20'))}>
                                                    <LevelIcon className="h-7 w-7" />
                                                </div>
                                                <div className="flex-1 w-full">
                                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Niveau {level.label}</p>
                                                    <div className="flex items-baseline gap-2">
                                                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{compte.points_cumules}</p>
                                                        <p className="text-xs text-slate-500">pts cumulés</p>
                                                    </div>
                                                    {nextLevelKey && (
                                                        <div className="mt-2 w-full">
                                                            <div className="flex justify-between text-[10px] font-medium text-slate-500 mb-1">
                                                                <span>Progression</span>
                                                                <span>{maxPointsForNextLevel} pts</span>
                                                            </div>
                                                            <Progress value={progress} className="h-1.5 bg-slate-100 dark:bg-slate-800 [&>div]:bg-slate-800 dark:[&>div]:bg-slate-200" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Comment ça marche & Récompenses (Nouveau) */}
                                <Card className="rounded-2xl border-slate-200/60 bg-white/60 backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/60">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <Info className="h-5 w-5 text-blue-500" />
                                            Comment ça marche ?
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                                <ShoppingBag className="h-8 w-8 text-indigo-500 mb-3" />
                                                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Achetez</h4>
                                                <p className="text-sm text-slate-500">Passez commande sur notre boutique pour déclencher le gain.</p>
                                            </div>
                                            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 relative">
                                                <div className="hidden sm:block absolute top-1/2 -left-3 -translate-y-1/2 text-slate-300 dark:text-slate-700"><ArrowRight className="h-5 w-5" /></div>
                                                <Coins className="h-8 w-8 text-amber-500 mb-3" />
                                                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Cumulez</h4>
                                                <p className="text-sm text-slate-500">Gagnez {gainPoints} point{gainPoints > 1 ? 's' : ''} pour chaque {gainValue}€ dépensé.</p>
                                                <div className="hidden sm:block absolute top-1/2 -right-3 -translate-y-1/2 text-slate-300 dark:text-slate-700"><ArrowRight className="h-5 w-5" /></div>
                                            </div>
                                            <div className="flex flex-col items-center text-center p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                                <Ticket className="h-8 w-8 text-emerald-500 mb-3" />
                                                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Profitez</h4>
                                                <p className="text-sm text-slate-500">Échangez {conversionRate} points contre 1€ de réduction.</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Formulaire d'échange amélioré */}
                                <Card className="rounded-2xl border-slate-200/60 bg-white/60 backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/60 relative overflow-hidden">
                                    <div className="absolute right-0 top-0 w-64 h-full bg-linear-to-l from-amber-500/5 to-transparent pointer-events-none"></div>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <Gift className="h-5 w-5 text-amber-500" />
                                            Convertir en bon d'achat
                                        </CardTitle>
                                        <CardDescription>
                                            Transformez vos points en réduction immédiate pour votre prochaine commande.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleRedeem} className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                                            <div className="flex-1 w-full space-y-2">
                                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    Points à échanger
                                                </label>
                                                <div className="relative">
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        max={compte.points}
                                                        value={form.data.points}
                                                        onChange={(e) => form.setData('points', e.target.value)}
                                                        placeholder={`Ex: ${conversionRate}`}
                                                        className="h-12 rounded-xl border-slate-200 bg-white pr-14 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white focus-visible:ring-amber-500"
                                                    />
                                                    <div className="absolute top-1/2 right-4 -translate-y-1/2 text-sm font-medium text-slate-400">
                                                        pts
                                                    </div>
                                                </div>
                                                {form.data.points && !isNaN(parseInt(form.data.points)) && (
                                                    <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                                        <CheckCircle2 className="h-4 w-4" />
                                                        Soit {(parseInt(form.data.points) / conversionRate).toFixed(2)} € de réduction
                                                    </p>
                                                )}
                                            </div>
                                            <Button
                                                type="submit"
                                                disabled={form.processing || !form.data.points}
                                                className="w-full sm:w-auto h-12 px-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 shadow-lg shadow-slate-900/10 transition-all"
                                            >
                                                Générer la réduction
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Colonne Latérale (Historique) */}
                            <div className="lg:col-span-1">
                                <Card className="rounded-2xl border-slate-200/60 bg-white/60 backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/60 h-full flex flex-col">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <History className="h-5 w-5 text-slate-500" />
                                            Historique
                                        </CardTitle>
                                        <Badge variant="secondary" className="rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                                            {compte.transactions.length}
                                        </Badge>
                                    </CardHeader>
                                    <CardContent className="flex-1 overflow-y-auto pr-2 pb-6 space-y-4 max-h-150 custom-scrollbar">
                                        {compte.transactions.length > 0 ? (
                                            compte.transactions.map((transaction) => {
                                                const isPositive = transaction.points >= 0;

                                                return (
                                                    <div key={transaction.id} className="group relative flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-white dark:hover:bg-slate-900 border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
                                                        <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full border', isPositive ? 'bg-emerald-50 border-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-900/50' : 'bg-amber-50 border-amber-100 dark:bg-amber-950/30 dark:border-amber-900/50')}>
                                                            {isPositive ? (
                                                                <ArrowUpRight className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                                            ) : (
                                                                <ArrowDownRight className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                                                {transaction.raison ?? 'Mouvement de points'}
                                                            </p>
                                                            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                                                <Clock className="h-3 w-3" />
                                                                {transaction.date_transaction
                                                                    ? new Date(transaction.date_transaction).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
                                                                    : transaction.created_at
                                                                        ? new Date(transaction.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
                                                                        : ''}
                                                            </p>
                                                        </div>
                                                        <div className={cn('text-sm font-bold shrink-0 pt-1', isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400')}>
                                                            {isPositive ? '+' : ''}{transaction.points}
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                                <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                                                    <History className="h-8 w-8 text-slate-400" />
                                                </div>
                                                <p className="text-sm font-medium text-slate-900 dark:text-white">Aucune transaction</p>
                                                <p className="text-xs text-slate-500 mt-1 max-w-50">Vos gains et dépenses de points apparaîtront ici.</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
