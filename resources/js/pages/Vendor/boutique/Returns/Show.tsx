// resources/js/pages/Shop/Returns/Show.tsx
import type { PageProps } from '@inertiajs/core';
import { Head, usePage } from '@inertiajs/react';
import {
    RotateCcw,
    Package,
    CheckCircle,
    Clock,
    XCircle,
    ArrowLeft,
    CircleDot,
    ShoppingBag,
    PackageCheck,
} from 'lucide-react';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

// ---------- Types ----------
interface ReturnLine {
    id: string;
    quantite: number;
    montant: number | string;
    etat_label?: string;
    etat?: string;
    ligne_commande?: { produit?: { nom?: string } | null } | null;
}

interface Props extends PageProps {
    return: {
        id: string;
        statut: string;
        motif_label?: string;
        motif?: string;
        commentaire?: string | null;
        date_demande?: string | null;
        commande?: { numero_commande: string; id?: string } | null;
        lignes: ReturnLine[];
    };
}

// Étapes de progression (hors refus)
const STATUS_STEPS = [
    { key: 'en_attente', label: 'Demande envoyée', icon: Clock },
    { key: 'accepte', label: 'Demande acceptée', icon: CheckCircle },
    { key: 'en_cours', label: 'Traitement en cours', icon: RotateCcw },
    { key: 'termine', label: 'Remboursement effectué', icon: PackageCheck },
];

const statusConfig: Record<
    string,
    { label: string; icon: any; className: string; color: string }
> = {
    en_attente: {
        label: 'En attente',
        icon: Clock,
        className:
            'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        color: '#f59e0b',
    },
    accepte: {
        label: 'Accepté',
        icon: CheckCircle,
        className:
            'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        color: '#10b981',
    },
    en_cours: {
        label: 'En cours',
        icon: RotateCcw,
        className:
            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        color: '#3b82f6',
    },
    termine: {
        label: 'Terminé',
        icon: CheckCircle,
        className:
            'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        color: '#8b5cf6',
    },
    refuse: {
        label: 'Refusé',
        icon: XCircle,
        className:
            'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        color: '#ef4444',
    },
};

function getStatusStepIndex(statut: string): number {
    if (statut === 'refuse') {
        return -1;
    }

    const index = STATUS_STEPS.findIndex((s) => s.key === statut);

    return index >= 0 ? index : STATUS_STEPS.length - 1;
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

export default function ShopReturnShowPage() {
    const { return: returnRequest } = usePage<Props>().props;
    const status =
        statusConfig[returnRequest.statut] ?? statusConfig.en_attente;
    const StatusIcon = status.icon;
    const isRefused = returnRequest.statut === 'refuse';

    const currentStep = getStatusStepIndex(returnRequest.statut);
    const progressPercent = isRefused
        ? 0
        : ((currentStep + 1) / STATUS_STEPS.length) * 100;

    return (
        <SidebarProvider
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 72)',
                    '--header-height': 'calc(var(--spacing) * 12)',
                } as React.CSSProperties
            }
        >
            <Head
                title={`Retour - ${returnRequest.commande?.numero_commande ?? ''}`}
            />
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
                            <a href={route('tenant.return.index')}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Tous les retours
                            </a>
                        </Button>

                        {/* En-tête détaillé */}
                        <div className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white/80 p-8 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/70">
                            <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-transparent" />
                            <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                                <div className="space-y-3">
                                    <Badge
                                        className={cn(
                                            'inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium capitalize',
                                            status.className,
                                        )}
                                    >
                                        <StatusIcon className="h-4 w-4" />
                                        {status.label}
                                    </Badge>
                                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl dark:text-white">
                                        Retour{' '}
                                        {returnRequest.commande
                                            ?.numero_commande ?? ''}
                                    </h1>
                                    <p className="text-slate-500 dark:text-slate-400">
                                        {returnRequest.motif_label ??
                                            returnRequest.motif ??
                                            'Motif non précisé'}
                                    </p>
                                    {returnRequest.date_demande && (
                                        <p className="text-xs text-slate-400">
                                            Demande du{' '}
                                            {new Date(
                                                returnRequest.date_demande,
                                            ).toLocaleDateString('fr-FR', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </p>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
                                        <ShoppingBag className="h-5 w-5 text-emerald-500" />
                                        <div>
                                            <p className="text-xs text-slate-500">
                                                Commande
                                            </p>
                                            <p className="font-semibold text-slate-900 dark:text-white">
                                                {returnRequest.commande
                                                    ?.numero_commande ?? '—'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
                                        <Package className="h-5 w-5 text-emerald-500" />
                                        <div>
                                            <p className="text-xs text-slate-500">
                                                Articles retournés
                                            </p>
                                            <p className="font-semibold text-slate-900 dark:text-white">
                                                {returnRequest.lignes.length}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Progression du retour */}
                        {!isRefused && (
                            <Card className="rounded-2xl border-0 bg-white/60 shadow-lg shadow-slate-200/20 backdrop-blur-md dark:bg-slate-900/60 dark:shadow-black/20">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base font-semibold">
                                        Progression du retour
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        {STATUS_STEPS.map((step, idx) => {
                                            const StepIcon = step.icon;
                                            const isCompleted =
                                                idx <= currentStep;
                                            const isCurrent =
                                                idx === currentStep;

                                            return (
                                                <div
                                                    key={step.key}
                                                    className="flex flex-1 flex-col items-center gap-1"
                                                >
                                                    <div
                                                        className={cn(
                                                            'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors',
                                                            isCompleted
                                                                ? 'border-emerald-500 bg-emerald-500 text-white'
                                                                : 'border-slate-200 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-900',
                                                        )}
                                                    >
                                                        <StepIcon className="h-5 w-5" />
                                                    </div>
                                                    <span
                                                        className={cn(
                                                            'text-center text-[10px] font-medium',
                                                            isCurrent
                                                                ? 'text-slate-900 dark:text-white'
                                                                : 'text-slate-500',
                                                        )}
                                                    >
                                                        {step.label}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <Progress
                                        value={progressPercent}
                                        className="mt-6 h-2"
                                    />
                                </CardContent>
                            </Card>
                        )}

                        {/* Produits retournés */}
                        <Card className="rounded-2xl border-0 bg-white/60 shadow-lg shadow-slate-200/20 backdrop-blur-md dark:bg-slate-900/60 dark:shadow-black/20">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                                    <Package className="h-5 w-5 text-emerald-500" />
                                    Produits retournés
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {returnRequest.lignes.map((line) => (
                                    <div
                                        key={line.id}
                                        className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900/60"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                                                <Package className="h-5 w-5 text-slate-500" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-white">
                                                    {line.ligne_commande
                                                        ?.produit?.nom ??
                                                        'Produit'}
                                                </p>
                                                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                                    <span>
                                                        {line.quantite}{' '}
                                                        article(s)
                                                    </span>
                                                    <CircleDot className="h-3 w-3" />
                                                    <span>
                                                        {line.etat_label ??
                                                            line.etat ??
                                                            'État non précisé'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <Badge
                                            variant="secondary"
                                            className="rounded-full text-sm font-semibold"
                                        >
                                            {formatCurrency(line.montant)}
                                        </Badge>
                                    </div>
                                ))}

                                {returnRequest.commentaire && (
                                    <div className="mt-4 rounded-xl border-l-4 border-emerald-400 bg-emerald-50/50 p-4 text-sm text-slate-700 dark:border-emerald-600 dark:bg-emerald-950/20 dark:text-slate-300">
                                        <p className="mb-1 font-medium">
                                            Commentaire
                                        </p>
                                        {returnRequest.commentaire}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
