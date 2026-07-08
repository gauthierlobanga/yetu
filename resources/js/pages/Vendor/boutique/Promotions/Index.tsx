/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/Pages/Shop/Promotions/Index.tsx
import { Head, Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CalendarRange,
    TicketPercent,
    Copy,
    Check,
    Tag,
    ArrowRight,
    Clock,
    Search,
    Filter,
    X,
    Sparkles,
    Percent,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import CountUp from 'react-countup';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import MainLayout from '@/layouts/main-layout';

interface Promotion {
    id: string;
    nom?: string | null;
    description?: string | null;
    code?: string | null;
    type: string;
    valeur: number | string;
    date_fin?: string | null;
    date_debut?: string | null;
    est_active: boolean;
}

interface Props extends Record<string, unknown> {
    promotions: Promotion[];
}

function formatDate(dateStr?: string | null): string {
    if (!dateStr) {
        return 'sans limite';
    }

    const date = new Date(dateStr);

    return isNaN(date.getTime())
        ? dateStr
        : new Intl.DateTimeFormat('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
          }).format(date);
}

function daysRemaining(dateStr?: string | null): number | null {
    if (!dateStr) {
        return null;
    }

    const end = new Date(dateStr);

    if (isNaN(end.getTime())) {
        return null;
    }

    const now = new Date();
    const diff = end.getTime() - now.getTime();

    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function CopiableCode({ code }: { code: string }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            /* ignore */
        }
    };

    return (
        <button
            type="button"
            onClick={handleCopy}
            className="group flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm backdrop-blur transition-all hover:bg-white hover:shadow dark:bg-slate-800/90 dark:text-slate-200 dark:hover:bg-slate-800"
        >
            <span className="font-mono font-bold tracking-wider uppercase">
                {code}
            </span>
            {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
                <Copy className="h-3.5 w-3.5 text-slate-400 group-hover:text-emerald-500" />
            )}
        </button>
    );
}

function PromotionCard({ promotion }: { promotion: Promotion }) {
    const expired =
        !promotion.est_active ||
        (promotion.date_fin
            ? new Date(promotion.date_fin) < new Date()
            : false);
    const remaining = daysRemaining(promotion.date_fin);
    const progressValue =
        remaining !== null ? Math.min(100, (remaining / 30) * 100) : 100; // base 30 jours

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            layout
            className={`group relative overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:shadow-xl dark:bg-slate-900/80 ${
                expired
                    ? 'border-slate-200 opacity-60 dark:border-slate-800'
                    : 'border-slate-200/80 hover:border-emerald-200 dark:border-slate-800 dark:hover:border-emerald-700'
            }`}
        >
            <div
                className={`h-1.5 w-full ${expired ? 'bg-slate-300 dark:bg-slate-700' : 'bg-linear-to-r from-emerald-500 to-teal-500'}`}
            />
            <div className="p-5">
                <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        <div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                                expired
                                    ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                                    : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                            }`}
                        >
                            <TicketPercent className="h-5 w-5" />
                        </div>
                        <div>
                            <span
                                className={`inline-block text-xs font-semibold uppercase ${expired ? 'text-slate-400' : 'text-emerald-600 dark:text-emerald-400'}`}
                            >
                                {expired ? 'Expirée' : 'Active'}
                            </span>
                        </div>
                    </div>
                    {promotion.code && !expired && (
                        <CopiableCode code={promotion.code} />
                    )}
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
                    {promotion.nom ?? 'Promotion'}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    {promotion.description ??
                        'Offre active sur une sélection de produits.'}
                </p>
                <div className="mb-4 flex items-center gap-2">
                    <Badge
                        className={`px-3 py-1 text-sm font-semibold ${
                            expired
                                ? 'bg-slate-100 text-slate-500'
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}
                    >
                        {promotion.type === 'percentage'
                            ? `-${promotion.valeur}%`
                            : `-${promotion.valeur} €`}
                    </Badge>
                </div>
                {promotion.date_fin && (
                    <div className="mb-4 space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                                <CalendarRange className="h-3.5 w-3.5" />{' '}
                                Jusqu'au {formatDate(promotion.date_fin)}
                            </span>
                            {!expired && remaining !== null && (
                                <span className="font-medium text-amber-600 dark:text-amber-400">
                                    <Clock className="mr-1 inline h-3.5 w-3.5" />
                                    {remaining} jour{remaining > 1 ? 's' : ''}{' '}
                                    restant{remaining > 1 ? 's' : ''}
                                </span>
                            )}
                        </div>
                        {!expired && remaining !== null && (
                            <Progress value={progressValue} className="h-1.5" />
                        )}
                    </div>
                )}
                <Link
                    href={route('tenant.product.index', {
                        promo: promotion.id,
                    })}
                    className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                    Explorer les produits concernés{' '}
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </motion.div>
    );
}

export default function PromotionsIndexPage() {
    const { promotions: rawPromotions } = usePage<Props>().props;
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState<
        'all' | 'percentage' | 'fixed'
    >('all');

    const promotions = useMemo(() => {
        let filtered = rawPromotions;

        if (typeFilter !== 'all') {
            filtered = filtered.filter(
                (p) =>
                    p.type ===
                    (typeFilter === 'percentage' ? 'percentage' : 'fixed'),
            );
        }

        if (search.trim()) {
            const q = search.toLowerCase();
            filtered = filtered.filter(
                (p) =>
                    (p.nom ?? '').toLowerCase().includes(q) ||
                    (p.description ?? '').toLowerCase().includes(q) ||
                    (p.code ?? '').toLowerCase().includes(q),
            );
        }

        return filtered;
    }, [rawPromotions, typeFilter, search]);

    const activeCount = rawPromotions.filter((p) => p.est_active).length;
    const maxReduction =
        rawPromotions.length > 0
            ? Math.max(...rawPromotions.map((p) => Number(p.valeur) || 0))
            : 0;

    return (
        <MainLayout>
            <Head title="Promotions" />
            <div className="relative min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">

                <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 lg:py-12">
                    {/* En-tête premium */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative mb-12 overflow-hidden rounded bg-white/60 p-8 dark:bg-slate-900/60"
                    >
                        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <Badge className="mb-3 border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                                    <TicketPercent className="mr-1.5 h-3.5 w-3.5" />
                                    {promotions.length} promotion
                                    {promotions.length > 1 ? 's' : ''}
                                </Badge>
                                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl dark:text-white">
                                    Les meilleures offres du moment
                                </h1>
                                <p className="mt-2 max-w-2xl text-slate-500 dark:text-slate-400">
                                    Profitez de réductions exclusives sur une
                                    sélection de produits.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 rounded-2xl border border-white/40 bg-white/40 px-4 py-3 shadow-sm backdrop-blur-md dark:border-slate-700/30 dark:bg-slate-900/40">
                                    <Sparkles className="h-5 w-5 text-amber-500" />
                                    <div>
                                        <p className="text-xs text-slate-500">
                                            Actives
                                        </p>
                                        <p className="text-xl font-bold text-slate-900 dark:text-white">
                                            <CountUp
                                                start={0}
                                                end={activeCount}
                                                duration={1}
                                            />
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 rounded-2xl border border-white/40 bg-white/40 px-4 py-3 dark:border-slate-700/30 dark:bg-slate-900/40">
                                    <Percent className="h-5 w-5 text-emerald-500" />
                                    <div>
                                        <p className="text-xs text-slate-500">
                                            Jusqu'à
                                        </p>
                                        <p className="text-xl font-bold text-slate-900 dark:text-white">
                                            -{maxReduction}%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Recherche & Filtres */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                        <div className="relative flex-1 sm:max-w-md">
                            <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                type="text"
                                placeholder="Rechercher une promotion..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-10 w-full rounded-2xl border-slate-200/60 bg-white/60 pr-10 pl-10 text-sm shadow-sm backdrop-blur-sm transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700/50 dark:bg-slate-900/60 dark:text-white dark:placeholder:text-slate-500"
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch('')}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                        <div className="flex gap-2">
                            {(['all', 'percentage', 'fixed'] as const).map(
                                (t) => (
                                    <button
                                        key={t}
                                        onClick={() => setTypeFilter(t)}
                                        className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                                            typeFilter === t
                                                ? 'bg-emerald-500 text-white shadow-sm'
                                                : 'border border-slate-200 bg-white/60 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        {t === 'all'
                                            ? 'Toutes'
                                            : t === 'percentage'
                                              ? 'Pourcentages'
                                              : 'Montants fixes'}
                                    </button>
                                ),
                            )}
                        </div>
                    </motion.div>

                    {/* Grille des promotions */}
                    <AnimatePresence mode="wait">
                        {promotions.length === 0 ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-20 text-center dark:border-slate-800 dark:bg-slate-900/30"
                            >
                                <div className="mb-4 rounded-full bg-amber-100 p-4 dark:bg-amber-900/30">
                                    <Tag className="h-10 w-10 text-amber-600 dark:text-amber-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                                    Aucune promotion trouvée
                                </h3>
                                <p className="mt-2 max-w-md text-slate-500 dark:text-slate-400">
                                    Modifiez vos critères de recherche ou
                                    revenez plus tard.
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="grid"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
                            >
                                {promotions.map((promo) => (
                                    <PromotionCard
                                        key={promo.id}
                                        promotion={promo}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </MainLayout>
    );
}
