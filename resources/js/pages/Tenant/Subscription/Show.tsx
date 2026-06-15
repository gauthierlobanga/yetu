/* eslint-disable @typescript-eslint/no-unused-vars */
import { Head, Link, router, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
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
    ArrowRight,
    ShieldCheck,
    Zap,
    BadgeCheck,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { VendorSidebar } from '@/components/VendorSidebar';
import getToastStyle from '@/lib/toast-style';

interface Plan {
    id: string;
    name: string;
    price: number | string;
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
    tenant: any;
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
    tenant,
}: Props) {
    const { flash } = usePage().props as any;
    const [cancelModal, setCancelModal] = useState(false);
    const [planModal, setPlanModal] = useState<Plan | null>(null);
    const [cancelReason, setCancelReason] = useState('');
    const [loading, setLoading] = useState(false);

    const graceDaysLeft = daysUntil(subscription.grace_period_ends_at);
    const trialDaysLeft = daysUntil(subscription.trial_ends_at);

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success, {
                style: getToastStyle('success'),
            });
        }

        if (flash.error) {
            toast.error(flash.error, {
                style: getToastStyle('error'),
            });
        }
    }, [flash]);

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
            },
        );
    };

    const handlePause = () => {
        router.post(
            route('subscription.pause'),
            {},
            {
                onSuccess: () => {
                    toast.success('Abonnement mis en pause', {
                        style: getToastStyle('success'),
                    });
                },
            },
        );
    };

    const handleResume = () => {
        router.post(
            route('subscription.resume'),
            {},
            {
                onSuccess: () => {
                    toast.success('Abonnement réactivé', {
                        style: getToastStyle('success'),
                    });
                },
            },
        );
    };

    const handlePlanChange = () => {
        if (!planModal) {
            return;
        }

        setLoading(true);
        const currentPrice = Number(plan.price);
        const nextPrice = Number(planModal.price);
        const isUpgrade = nextPrice > currentPrice;
        const actionRoute = isUpgrade
            ? 'subscription.upgrade'
            : 'subscription.downgrade';

        router.post(
            route(actionRoute),
            { plan_id: planModal.id },
            {
                onFinish: () => {
                    setLoading(false);
                    setPlanModal(null);
                },
                onSuccess: () => {
                    toast.success('Changement de plan effectué', {
                        style: getToastStyle('success'),
                    });
                },
                onError: (errors) => {
                    toast.error('Erreur lors du changement de plan', {
                        description: Object.values(errors)[0],
                        style: getToastStyle('error'),
                    });
                },
            },
        );
    };

    return (
        <SidebarProvider
            style={
                {
                    '--sidebar-width': '280px',
                } as React.CSSProperties
            }
        >
            <VendorSidebar tenant={tenant} />
            <SidebarInset>
                <SiteHeader />
                <div className="min-h-screen bg-linear-to-br from-slate-50 to-emerald-50/30 dark:from-slate-950 dark:to-emerald-950/10">
                    <Head title="Mon abonnement" />

                    <div className="mx-auto max-w-7xl space-y-10 p-6 lg:p-10">
                        {/* En-tête premium avec animation */}
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                            <div className="space-y-2">
                                <motion.h1
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-4xl font-black tracking-tight text-slate-900 dark:text-white"
                                >
                                    Mon abonnement
                                </motion.h1>
                                <p className="text-slate-500 dark:text-slate-400 font-medium">
                                    Gérez votre offre et suivez votre facturation.
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center">
                                    <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                                    Profitez de tous vos avantages
                                </span>
                            </div>
                        </div>

                        {/* Alertes avec cartes vitrées */}
                        <AnimatePresence>
                            {subscription.is_blocked && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className="rounded-3xl border border-red-200/60 bg-red-50/70 backdrop-blur-md p-6 text-red-800 shadow-lg shadow-red-500/5 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
                                >
                                    <div className="flex items-start gap-5">
                                        <div className="rounded-2xl bg-red-100 p-3 dark:bg-red-500/10">
                                            <XCircle className="h-6 w-6 shrink-0" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black">Votre accès est bloqué</h3>
                                            <p className="mt-2 text-sm opacity-90 leading-relaxed">
                                                Votre abonnement a expiré et la période de grâce est terminée. Veuillez choisir un plan pour réactiver votre boutique.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {subscription.is_expired && !subscription.is_blocked && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className="rounded-3xl border border-amber-200/60 bg-amber-50/70 backdrop-blur-md p-6 text-amber-800 shadow-lg shadow-amber-500/5 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300"
                                >
                                    <div className="flex items-start gap-5">
                                        <div className="rounded-2xl bg-amber-100 p-3 dark:bg-amber-500/10">
                                            <AlertCircle className="h-6 w-6 shrink-0" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black">Abonnement expiré</h3>
                                            <p className="mt-2 text-sm opacity-90 leading-relaxed">
                                                Votre accès est actuellement maintenu en période de grâce jusqu'au{' '}
                                                <strong className="font-bold">
                                                    {formatDate(subscription.grace_period_ends_at)}
                                                </strong>
                                                . Activez un plan pour éviter toute interruption.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Plan actuel & Résumé dans une carte vitrée */}
                        <div className="grid gap-8 lg:grid-cols-3">
                            <div className="lg:col-span-2">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="rounded-3xl border border-white/20 bg-white/80 backdrop-blur-2xl p-8 shadow-xl shadow-slate-200/30 dark:border-slate-800/50 dark:bg-slate-900/60 dark:shadow-slate-900/30"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-8 dark:border-slate-800">
                                        <div>
                                            <p className="text-sm font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">
                                                Plan actuel
                                            </p>
                                            <h2 className="mt-3 text-5xl font-black text-emerald-600 dark:text-emerald-400 bg-linear-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text">
                                                {plan.name}
                                            </h2>
                                        </div>
                                        <div className="text-right mt-4 sm:mt-0">
                                            <p className="text-sm font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400">
                                                Prix
                                            </p>
                                            <p className="mt-3 text-4xl font-black text-slate-900 dark:text-white">
                                                {plan.formatted_price}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-8 grid gap-8 sm:grid-cols-2">
                                        <div className="space-y-6">
                                            <div>
                                                <p className="text-xs font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500">
                                                    Statut
                                                </p>
                                                <div className="mt-3 flex items-center gap-2.5">
                                                    <span
                                                        className={`h-2.5 w-2.5 rounded-full ${
                                                            subscription.is_active
                                                                ? 'animate-pulse bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                                                                : 'bg-red-500'
                                                        }`}
                                                    />
                                                    <span className="font-bold text-slate-900 dark:text-white">
                                                        {subscription.is_active ? 'Actif' : 'Inactif'}
                                                        {subscription.status === 'paused' && ' (En pause)'}
                                                    </span>
                                                </div>
                                            </div>

                                            {subscription.trial_ends_at && trialDaysLeft && trialDaysLeft > 0 && (
                                                <div>
                                                    <p className="text-xs font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500">
                                                        Essai
                                                    </p>
                                                    <p className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
                                                        {trialDaysLeft} jour(s) restant(s)
                                                    </p>
                                                    <p className="text-sm text-slate-500">
                                                        Finit le {formatDate(subscription.trial_ends_at)}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-6">
                                            {subscription.current_period_end && (
                                                <div>
                                                    <p className="text-xs font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500">
                                                        Prochaine échéance
                                                    </p>
                                                    <p className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                                                        {formatDate(subscription.current_period_end)}
                                                    </p>
                                                    <p className="text-sm text-slate-500">
                                                        Renouvellement :{' '}
                                                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                                                            {subscription.auto_renewal ? 'Activé' : 'Désactivé'}
                                                        </span>
                                                    </p>
                                                </div>
                                            )}

                                            {subscription.is_expired && subscription.grace_period_ends_at && (
                                                <div className="rounded-2xl border border-red-100 bg-red-50/50 p-4 dark:border-red-900/30 dark:bg-red-950/20">
                                                    <p className="text-xs font-bold tracking-widest text-red-500 uppercase">
                                                        Suspension prévue le
                                                    </p>
                                                    <p className="mt-2 text-xl font-black text-red-600 dark:text-red-400">
                                                        {formatDate(subscription.grace_period_ends_at)}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions rapides */}
                                    <div className="mt-10 flex flex-wrap gap-4 border-t border-slate-100 pt-8 dark:border-slate-800">
                                        <button
                                            onClick={() => router.get(route('subscription.portal'))}
                                            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                                        >
                                            <CreditCard className="h-4 w-4" /> Gérer mes paiements
                                        </button>

                                        {subscription.status !== 'paused' && (
                                            <button
                                                onClick={handlePause}
                                                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-6 py-3 text-sm font-bold text-slate-700 backdrop-blur-sm transition-all hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:bg-slate-800"
                                            >
                                                <Pause className="h-4 w-4" /> Mettre en pause
                                            </button>
                                        )}

                                        {subscription.status === 'paused' && (
                                            <button
                                                onClick={handleResume}
                                                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-700 hover:shadow-emerald-500/30 active:scale-95"
                                            >
                                                <Play className="h-4 w-4" /> Réactiver l'abonnement
                                            </button>
                                        )}

                                        <button
                                            onClick={() => setCancelModal(true)}
                                            className="inline-flex items-center gap-2 rounded-2xl border border-red-100 bg-red-50/80 px-6 py-3 text-sm font-bold text-red-600 backdrop-blur-sm transition-all hover:border-red-200 hover:bg-red-100 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50"
                                        >
                                            <XCircle className="h-4 w-4" /> Annuler l'abonnement
                                        </button>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Fonctionnalités du plan */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="rounded-3xl border border-white/20 bg-white/80 backdrop-blur-2xl p-8 shadow-xl shadow-slate-200/30 dark:border-slate-800/50 dark:bg-slate-900/60 dark:shadow-slate-900/30"
                            >
                                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                                    Inclus dans votre plan
                                </h3>
                                <ul className="mt-8 space-y-5">
                                    {plan.features.map((feature, i) => (
                                        <li
                                            key={i}
                                            className="flex items-start gap-4 text-sm font-medium text-slate-600 dark:text-slate-400"
                                        >
                                            <div className="rounded-full bg-emerald-100 p-1 dark:bg-emerald-500/10">
                                                <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        </div>

                        {/* Plans disponibles avec cartes interactives */}
                        <div className="space-y-8">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                                        Faire évoluer votre boutique
                                    </h2>
                                    <Badge
                                        variant="outline"
                                        className="rounded-full border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-400"
                                    >
                                        <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Sans frais de changement
                                    </Badge>
                                </div>
                                <p className="text-slate-500 dark:text-slate-400 font-medium">
                                    Choisissez une offre plus adaptée à votre croissance.
                                </p>
                            </div>

                            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                {availablePlans.map((p) => {
                                    const isUpgrade = Number(p.price) > Number(plan.price);
                                    const isCurrent = p.id === plan.id;

                                    return (
                                        <motion.div
                                            key={p.id}
                                            whileHover={{ y: -5, scale: 1.02 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                            className={`relative rounded-3xl border p-8 backdrop-blur-xl transition-all duration-300 ${
                                                isCurrent
                                                    ? 'border-emerald-500/50 bg-emerald-50/30 shadow-xl shadow-emerald-500/5 dark:border-emerald-500/30 dark:bg-emerald-500/5'
                                                    : 'border-white/20 bg-white/80 shadow-xl shadow-slate-200/30 hover:border-emerald-500/30 dark:border-slate-800/50 dark:bg-slate-900/60 dark:hover:border-emerald-500/20'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                                                    {p.name}
                                                </h3>
                                                {isCurrent && (
                                                    <span className="rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-black uppercase text-white shadow-md">
                                                        Actuel
                                                    </span>
                                                )}
                                                {!isCurrent && isUpgrade && (
                                                    <span className="rounded-full bg-amber-500 px-3 py-1 text-[10px] font-black uppercase text-white shadow-md">
                                                        Upgrade
                                                    </span>
                                                )}
                                            </div>
                                            <div className="mt-4 flex items-baseline gap-1">
                                                <p className="text-4xl font-black text-slate-900 dark:text-white">
                                                    {p.formatted_price}
                                                </p>
                                            </div>
                                            <p className="text-xs font-bold tracking-widest uppercase text-slate-400">
                                                {p.interval === 'month' ? 'Mensuel' : 'Annuel'}
                                            </p>

                                            <ul className="mt-8 space-y-4 border-t border-slate-100 pt-8 dark:border-slate-800">
                                                {p.features.slice(0, 4).map((f, i) => (
                                                    <li
                                                        key={i}
                                                        className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-400"
                                                    >
                                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> {f}
                                                    </li>
                                                ))}
                                            </ul>

                                            <button
                                                onClick={() => !isCurrent && setPlanModal(p)}
                                                disabled={isCurrent}
                                                className={`mt-10 w-full rounded-2xl py-4 text-sm font-black tracking-wide uppercase transition-all active:scale-95 ${
                                                    isCurrent
                                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600'
                                                        : isUpgrade
                                                        ? 'bg-slate-900 text-white shadow-lg hover:bg-emerald-600 dark:bg-white dark:text-slate-950 dark:hover:bg-emerald-500 dark:hover:text-white'
                                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                                                }`}
                                            >
                                                {isCurrent
                                                    ? 'Plan actuel'
                                                    : isUpgrade
                                                    ? 'Passer à ce plan'
                                                    : 'Choisir ce plan'}
                                            </button>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Historique des factures avec tableau premium */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="rounded-3xl border border-white/20 bg-white/80 backdrop-blur-2xl p-8 shadow-xl shadow-slate-200/30 dark:border-slate-800/50 dark:bg-slate-900/60 dark:shadow-slate-900/30"
                        >
                            <div className="mb-8 flex items-center justify-between">
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                                    Historique de facturation
                                </h2>
                                <Link
                                    href={route('subscription.invoices')}
                                    className="flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-500"
                                >
                                    Voir tout <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                                            <th className="px-4 py-4 text-left text-[10px] font-bold tracking-widest uppercase">
                                                Numéro
                                            </th>
                                            <th className="px-4 py-4 text-left text-[10px] font-bold tracking-widest uppercase">
                                                Date d'émission
                                            </th>
                                            <th className="px-4 py-4 text-left text-[10px] font-bold tracking-widest uppercase">
                                                Montant
                                            </th>
                                            <th className="px-4 py-4 text-left text-[10px] font-bold tracking-widest uppercase">
                                                Statut
                                            </th>
                                            <th className="px-4 py-4 text-right text-[10px] font-bold tracking-widest uppercase">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {invoices.map((invoice) => (
                                            <tr
                                                key={invoice.id}
                                                className="text-slate-700 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/30"
                                            >
                                                <td className="px-4 py-5 font-bold">{invoice.number}</td>
                                                <td className="px-4 py-5">{formatDate(invoice.issued_at)}</td>
                                                <td className="px-4 py-5 font-black text-slate-900 dark:text-white">
                                                    {invoice.amount_paid || invoice.amount_due} {plan.currency}
                                                </td>
                                                <td className="px-4 py-5">
                                                    <span
                                                        className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black tracking-widest uppercase ${
                                                            invoice.status === 'paid'
                                                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                                                                : 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                                                        }`}
                                                    >
                                                        {invoice.status === 'paid' ? 'Payée' : 'En attente'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-5 text-right">
                                                    {invoice.pdf_url && (
                                                        <a
                                                            href={invoice.pdf_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-2 font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                                                        >
                                                            PDF <FileText className="h-4 w-4" />
                                                        </a>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </SidebarInset>

            {/* Modal de changement de plan avec glassmorphisme */}
            <AnimatePresence>
                {planModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-md rounded-[2.5rem] border border-white/20 bg-white/90 backdrop-blur-2xl p-10 shadow-2xl dark:border-slate-800/50 dark:bg-slate-900/90"
                        >
                            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                                <Sparkles className="h-8 w-8" />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white">
                                Changer de plan ?
                            </h3>
                            <p className="mt-4 leading-relaxed font-medium text-slate-500 dark:text-slate-400">
                                Vous allez passer du plan{' '}
                                <span className="font-bold text-slate-900 dark:text-white">{plan.name}</span> au plan{' '}
                                <span className="font-bold text-emerald-600 dark:text-emerald-400">{planModal.name}</span>
                                .
                                <br /><br />
                                Le nouveau tarif de{' '}
                                <span className="font-bold text-slate-900 dark:text-white">{planModal.formatted_price}</span>{' '}
                                s'appliquera dès la validation.
                            </p>

                            <div className="mt-10 flex gap-4">
                                <button
                                    onClick={() => setPlanModal(null)}
                                    className="flex-1 rounded-2xl border-2 border-slate-100 bg-white px-6 py-4 text-sm font-black text-slate-500 transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handlePlanChange}
                                    disabled={loading}
                                    className="flex-1 rounded-2xl bg-emerald-600 px-6 py-4 text-sm font-black text-white shadow-xl shadow-emerald-500/20 transition-all hover:bg-emerald-700 active:scale-95 disabled:opacity-50"
                                >
                                    {loading ? 'Traitement...' : 'Confirmer'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal d'annulation avec glassmorphisme */}
            <AnimatePresence>
                {cancelModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-md rounded-[2.5rem] border border-white/20 bg-white/90 backdrop-blur-2xl p-10 shadow-2xl dark:border-slate-800/50 dark:bg-slate-900/90"
                        >
                            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-3xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                                <AlertCircle className="h-8 w-8" />
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white">
                                Annuler ?
                            </h3>
                            <p className="mt-4 leading-relaxed font-medium text-slate-500 dark:text-slate-400">
                                Votre boutique restera active pendant la période de grâce. Vous pouvez réactiver votre abonnement à tout moment avant la suspension définitive.
                            </p>

                            <div className="mt-8">
                                <label className="mb-2 block text-[10px] font-black tracking-widest text-slate-400 uppercase dark:text-slate-500">
                                    Raison de votre départ
                                </label>
                                <textarea
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                    className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 p-4 text-sm text-slate-900 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                                    rows={3}
                                    placeholder="Aidez-nous à nous améliorer..."
                                />
                            </div>

                            <div className="mt-10 flex gap-4">
                                <button
                                    onClick={() => setCancelModal(false)}
                                    className="flex-1 rounded-2xl border-2 border-slate-100 bg-white px-6 py-4 text-sm font-black text-slate-500 transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900"
                                >
                                    Rester
                                </button>
                                <button
                                    onClick={handleCancel}
                                    disabled={loading}
                                    className="flex-1 rounded-2xl bg-red-600 px-6 py-4 text-sm font-black text-white shadow-xl shadow-red-500/20 transition-all hover:bg-red-700 active:scale-95 disabled:opacity-50"
                                >
                                    {loading ? 'Traitement...' : 'Confirmer'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </SidebarProvider>
    );
}
