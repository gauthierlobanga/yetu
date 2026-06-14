import { Head, Link, router } from '@inertiajs/react';
import {
    CreditCard,
    Calendar,
    AlertCircle,
    CheckCircle,
    Clock,
    FileText,
    Pause,
    Play,
    XCircle,
    Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';

interface Plan {
    id: string;
    name: string;
    price: number;
    currency: string;
    interval: string;
    formatted_price: string;
    description: string;
    features: string[];
}

interface Subscription {
    id: string;
    status: string;
    is_active: boolean;
    is_expired: boolean;
    is_blocked: boolean;
    trial_started_at: string | null;
    trial_ends_at: string | null;
    current_period_start: string | null;
    current_period_end: string | null;
    grace_period_ends_at: string | null;
    auto_renewal: boolean;
    canceled_at: string | null;
}

interface Invoice {
    id: string;
    number: string;
    status: string;
    amount_due: number;
    amount_paid: number;
    issued_at: string;
    paid_at: string | null;
    pdf_url: string | null;
}

type Props = {
    subscription: Subscription;
    plan: Plan;
    availablePlans: Plan[];
    invoices: Invoice[];
};

function formatDate(date: string | null): string {
    if (!date) {
return '—';
}

    return new Date(date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

function daysUntil(date: string | null): number | null {
    if (!date) {
return null;
}

    const diff = new Date(date).getTime() - new Date().getTime();

    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function SubscriptionShow({
    subscription,
    plan,
    availablePlans,
    invoices,
}: Props) {
    const [cancelModal, setCancelModal] = useState(false);
    const [planModal, setPlanModal] = useState<Plan | null>(null);
    const [cancelReason, setCancelReason] = useState('');
    const [loading, setLoading] = useState(false);

    const graceDaysLeft = daysUntil(subscription.grace_period_ends_at);
    const trialDaysLeft = daysUntil(subscription.trial_ends_at);

    const handleCancel = () => {
        setLoading(true);
        router.post(
            route('subscription.cancel'),
            { reason: cancelReason },
            {
                onFinish: () => {
                    setLoading(false);
                    setCancelModal(false);
                },
            }
        );
    };

    const handlePause = () => {
        router.post(route('subscription.pause'));
    };

    const handleResume = () => {
        router.post(route('subscription.resume'));
    };

    const handlePlanChange = () => {
        if (!planModal) {
return;
}
        setLoading(true);

        const isUpgrade = planModal.price > plan.price;
        const actionRoute = isUpgrade ? 'subscription.upgrade' : 'subscription.downgrade';

        router.post(
            route(actionRoute),
            { plan_id: planModal.id },
            {
                onFinish: () => {
                    setLoading(false);
                    setPlanModal(null);
                },
            }
        );
    };

    return (
        <>
            <Head title="Mon abonnement" />

            <div className="mx-auto max-w-7xl space-y-8 p-6">
                {/* En-tête */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Mon abonnement
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Gérez votre offre et suivez votre facturation.
                        </p>
                    </div>
                </div>

                {/* Alertes */}
                <div className="space-y-4">
                    {subscription.is_blocked && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800 shadow-sm dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400">
                            <div className="flex items-start gap-3">
                                <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
                                <div>
                                    <h3 className="font-semibold">Votre accès est bloqué</h3>
                                    <p className="mt-1 text-sm">
                                        Votre abonnement a expiré et la période de grâce est terminée.
                                        Veuillez choisir un plan pour réactiver votre boutique.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {subscription.is_expired && !subscription.is_blocked && (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800 shadow-sm dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-400">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                                <div>
                                    <h3 className="font-semibold">Abonnement expiré</h3>
                                    <p className="mt-1 text-sm">
                                        Votre accès est actuellement maintenu en période de grâce jusqu'au{' '}
                                        <strong>{formatDate(subscription.grace_period_ends_at)}</strong>.
                                        Activez un plan pour éviter toute interruption.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Plan actuel et Résumé */}
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                            <div className="flex items-center justify-between border-b border-border pb-6">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Plan actuel</p>
                                    <h2 className="mt-1 text-3xl font-bold text-primary">{plan.name}</h2>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-muted-foreground">Prix</p>
                                    <p className="mt-1 text-2xl font-bold text-foreground">{plan.formatted_price}</p>
                                </div>
                            </div>

                            <div className="mt-6 grid gap-6 sm:grid-cols-2">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Statut</p>
                                        <div className="mt-1 flex items-center gap-2">
                                            <span className={`h-2 w-2 rounded-full ${subscription.is_active ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                            <span className="font-medium text-foreground">
                                                {subscription.is_active ? 'Actif' : 'Inactif'}
                                                {subscription.status === 'paused' && ' (En pause)'}
                                            </span>
                                        </div>
                                    </div>

                                    {subscription.trial_ends_at && trialDaysLeft && trialDaysLeft > 0 && (
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Période d'essai</p>
                                            <p className="mt-1 font-medium text-foreground">{trialDaysLeft} jour(s) restant(s)</p>
                                            <p className="text-xs text-muted-foreground">Finit le {formatDate(subscription.trial_ends_at)}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    {subscription.current_period_end && (
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Prochaine échéance</p>
                                            <p className="mt-1 font-medium text-foreground">{formatDate(subscription.current_period_end)}</p>
                                            <p className="text-xs text-muted-foreground">Renouvellement automatique : {subscription.auto_renewal ? 'Oui' : 'Non'}</p>
                                        </div>
                                    )}

                                    {subscription.is_expired && subscription.grace_period_ends_at && (
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-red-500">Blocage prévu le</p>
                                            <p className="mt-1 font-bold text-red-600">{formatDate(subscription.grace_period_ends_at)}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions rapides */}
                            <div className="mt-8 flex flex-wrap gap-3 border-t border-border pt-6">
                                {subscription.status !== 'paused' && (
                                    <button
                                        onClick={handlePause}
                                        className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                                    >
                                        <Pause className="h-4 w-4" /> Mettre en pause
                                    </button>
                                )}

                                {subscription.status === 'paused' && (
                                    <button
                                        onClick={handleResume}
                                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
                                    >
                                        <Play className="h-4 w-4" /> Réactiver
                                    </button>
                                )}

                                <button
                                    onClick={() => setCancelModal(true)}
                                    className="inline-flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50"
                                >
                                    <XCircle className="h-4 w-4" /> Annuler l'abonnement
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-foreground">Inclus dans votre plan</h3>
                        <ul className="mt-4 space-y-3">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Plans disponibles */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-foreground">Plans disponibles</h2>
                        <Badge variant="outline" className="rounded-full border-primary/30 text-primary">
                            Évolutif sans frais caché
                        </Badge>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {availablePlans.map((p) => {
                            const isUpgrade = p.price > plan.price;
                            return (
                                <div key={p.id} className="group relative rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/50 hover:shadow-md">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-bold text-foreground">{p.name}</h3>
                                        {isUpgrade && (
                                            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                                                Recommandé
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-2 text-3xl font-extrabold text-foreground">{p.formatted_price}</p>
                                    <p className="text-xs text-muted-foreground">Par {p.interval === 'month' ? 'mois' : 'an'}</p>

                                    <ul className="mt-6 space-y-3">
                                        {p.features.slice(0, 4).map((f, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <div className="h-1 w-1 rounded-full bg-primary" /> {f}
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        onClick={() => setPlanModal(p)}
                                        className={`mt-8 w-full rounded-xl py-3 text-sm font-bold transition-all ${
                                            isUpgrade
                                                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                                : 'bg-muted text-foreground hover:bg-border'
                                        }`}
                                    >
                                        {isUpgrade ? 'Passer à ce plan' : 'Choisir ce plan'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Historique des factures */}
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-foreground">Facturation</h2>
                        <Link href={route('subscription.invoices')} className="text-sm font-medium text-primary hover:underline">
                            Voir tout l'historique
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border text-muted-foreground">
                                    <th className="px-4 py-3 text-left font-semibold">Numéro</th>
                                    <th className="px-4 py-3 text-left font-semibold">Date</th>
                                    <th className="px-4 py-3 text-left font-semibold">Montant</th>
                                    <th className="px-4 py-3 text-left font-semibold">Statut</th>
                                    <th className="px-4 py-3 text-right font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {invoices.map((invoice) => (
                                    <tr key={invoice.id} className="text-foreground transition hover:bg-muted/30">
                                        <td className="px-4 py-4 font-medium">{invoice.number}</td>
                                        <td className="px-4 py-4">{formatDate(invoice.issued_at)}</td>
                                        <td className="px-4 py-4 font-bold">{invoice.amount_paid || invoice.amount_due} {plan.currency}</td>
                                        <td className="px-4 py-4">
                                            <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                                invoice.status === 'paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                {invoice.status === 'paid' ? 'Payée' : 'En attente'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            {invoice.pdf_url && (
                                                <a href={invoice.pdf_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
                                                    PDF <FileText className="h-3 w-3" />
                                                </a>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal de changement de plan */}
            {planModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md rounded-2xl bg-card p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <Sparkles className="h-8 w-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-foreground">Confirmer le nouveau plan</h3>
                        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                            Vous allez passer du plan <strong>{plan.name}</strong> au plan <strong>{planModal.name}</strong>.
                            Le nouveau tarif de <strong>{planModal.formatted_price}</strong> s'appliquera lors de votre prochaine échéance.
                        </p>

                        <div className="mt-8 flex gap-3">
                            <button
                                onClick={() => setPlanModal(null)}
                                className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground transition hover:bg-muted"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handlePlanChange}
                                disabled={loading}
                                className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-primary/90 disabled:opacity-50"
                            >
                                {loading ? 'Traitement...' : 'Confirmer'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal d'annulation */}
            {cancelModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md rounded-2xl bg-card p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <h3 className="text-2xl font-bold text-foreground">Annuler votre abonnement?</h3>
                        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                            Êtes-vous sûr de vouloir annuler? Votre boutique restera active pendant <strong>14 jours</strong> (période de grâce) avant d'être bloquée.
                        </p>

                        <div className="mt-6">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Raison (optionnel)</label>
                            <textarea
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                className="mt-2 w-full rounded-xl border border-border bg-muted/50 p-3 text-sm text-foreground focus:ring-2 focus:ring-primary/20"
                                rows={3}
                                placeholder="Dites-nous comment nous améliorer..."
                            />
                        </div>

                        <div className="mt-8 flex gap-3">
                            <button
                                onClick={() => setCancelModal(false)}
                                className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-sm font-bold text-foreground transition hover:bg-muted"
                            >
                                Rester
                            </button>
                            <button
                                onClick={handleCancel}
                                disabled={loading}
                                className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition hover:bg-red-700 disabled:opacity-50"
                            >
                                {loading ? 'Annulation...' : 'Annuler'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
