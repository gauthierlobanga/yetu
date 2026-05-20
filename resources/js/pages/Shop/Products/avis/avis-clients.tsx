// // resources/js/components/ecommerce/products/avis/avis-clients.tsx
// import { router } from '@inertiajs/react';
// import { motion } from 'framer-motion';
// import { Star, MessageCircle, Send, Sparkles } from 'lucide-react';
// import { useRef, useState, useMemo } from 'react';
// import { toast } from 'sonner';
// import { Button } from '@/components/ui/button';
// import { Textarea } from '@/components/ui/textarea';
// import { ReviewCard } from './review-card';

// interface Review {
//     id: number;
//     note: number;
//     commentaire: string;
//     client: string;
//     date: string;
// }

// interface RatingStats {
//     average: number;
//     total: number;
//     distribution: Record<number, number>;
// }

// interface Props {
//     productId: string | number;
//     avis: Review[];
//     ratingStats?: RatingStats;
// }

// export function ReviewsSection({ productId, avis, ratingStats }: Props) {
//     const [reviewRating, setReviewRating] = useState(5);
//     const [reviewComment, setReviewComment] = useState('');
//     const [submitting, setSubmitting] = useState(false);
//     const formRef = useRef<HTMLDivElement>(null);

//     // Calcul automatique des statistiques si elles ne sont pas fournies
//     const stats = useMemo(() => {
//         if (ratingStats) {
//             return ratingStats;
//         }

//         const total = avis.length;
//         const average =
//             total > 0 ? avis.reduce((sum, r) => sum + r.note, 0) / total : 0;

//         const distribution: Record<number, number> = {
//             5: 0,
//             4: 0,
//             3: 0,
//             2: 0,
//             1: 0,
//         };
//         avis.forEach((r) => {
//             if (distribution[r.note] !== undefined) {
//                 distribution[r.note]++;
//             }
//         });

//         return { average, total, distribution };
//     }, [avis, ratingStats]);

//     const handleSubmitReview = () => {
//         if (!reviewComment.trim() || reviewComment.trim().length < 10) {
//             return;
//         }

//         setSubmitting(true);
//         router.post(
//             route('tenant.products.reviews.store', productId),
//             { note: reviewRating, commentaire: reviewComment },
//             {
//                 preserveScroll: true,
//                 preserveState: true,
//                 onSuccess: () => {
//                     setReviewComment('');
//                     setReviewRating(5);
//                     setSubmitting(false);
//                     toast.success('Merci pour votre avis !', {
//                         description: 'Votre avis a été publié avec succès.',
//                         icon: <Star className="h-5 w-5 text-amber-400" />,
//                         duration: 3000,
//                     });
//                     router.reload({ only: ['product'] });
//                 },
//                 onError: () => {
//                     setSubmitting(false);
//                     toast.error('Erreur', {
//                         description: "Impossible de publier l'avis.",
//                     });
//                 },
//             },
//         );
//     };

//     const scrollToForm = () => {
//         formRef.current?.scrollIntoView({ behavior: 'smooth' });
//     };

//     return (
//         <div className="mt-20 grid gap-12 lg:grid-cols-3">
//             {/* Colonne gauche : liste des avis */}
//             <div className="lg:col-span-2">
//                 <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
//                     <div>
//                         <div className="mb-2 flex items-center gap-3">
//                             <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
//                                 <Sparkles className="h-5 w-5" />
//                             </span>
//                             <h2 className="text-2xl font-bold tracking-tight text-slate-800 md:text-3xl dark:text-white">
//                                 Avis clients
//                             </h2>
//                         </div>
//                         <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">
//                             {avis.length > 0
//                                 ? 'Des avis authentiques pour vous guider dans votre choix.'
//                                 : 'Soyez le premier à partager votre expérience.'}
//                         </p>
//                     </div>
//                     {avis.length > 0 && (
//                         <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5 text-sm backdrop-blur-sm dark:bg-slate-800">
//                             <span className="font-semibold text-slate-700 dark:text-white">
//                                 {avis.length}
//                             </span>
//                             <span className="text-slate-500 dark:text-slate-400">
//                                 avis
//                             </span>
//                         </div>
//                     )}
//                 </div>

//                 {avis.length === 0 ? (
//                     <motion.div
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.4 }}
//                         className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 px-8 py-20 text-center dark:border-emerald-800 dark:bg-emerald-950/20"
//                     >
//                         <div className="mb-6 rounded-full bg-white p-4 shadow-sm dark:bg-slate-800">
//                             <MessageCircle className="h-10 w-10 text-emerald-500 dark:text-emerald-400" />
//                         </div>
//                         <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
//                             Aucun avis pour le moment
//                         </h3>
//                         <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
//                             Ce produit n’a pas encore été évalué. Votre opinion
//                             compte !
//                         </p>
//                         <Button
//                             onClick={scrollToForm}
//                             className="mt-6 gap-2 rounded-full px-6"
//                         >
//                             <Star className="h-4 w-4" /> Donner mon avis
//                         </Button>
//                     </motion.div>
//                 ) : (
//                     <div className="divide-y divide-slate-200 dark:divide-slate-800">
//                         {avis.map((review) => (
//                             <ReviewCard
//                                 key={review.id}
//                                 customerName={review.client}
//                                 rating={review.note}
//                                 reviewDate={review.date}
//                                 reviewText={review.commentaire}
//                             />
//                         ))}
//                     </div>
//                 )}
//             </div>

//             {/* Colonne droite : résumé + formulaire */}
//             <div className="space-y-6" ref={formRef}>
//                 {/* Carte Note globale modernisée */}
//                 <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
//                     <div className="mb-4 flex items-center gap-2">
//                         <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
//                             <Star className="h-4 w-4" fill="currentColor" />
//                         </span>
//                         <h3 className="font-semibold text-slate-800 dark:text-white">
//                             Note globale
//                         </h3>
//                     </div>

//                     <div className="mb-4 flex items-end justify-between">
//                         <div className="flex items-baseline gap-1">
//                             <span className="text-6xl font-extrabold tracking-tight text-slate-800 dark:text-white">
//                                 {stats.average.toFixed(1)}
//                             </span>
//                             <span className="text-base text-slate-500">/5</span>
//                         </div>
//                         <div className="flex gap-0.5">
//                             {Array.from({ length: 5 }).map((_, i) => (
//                                 <Star
//                                     key={i}
//                                     className={`h-5 w-5 ${
//                                         i < Math.floor(stats.average)
//                                             ? 'fill-amber-400 text-amber-400'
//                                             : i < stats.average
//                                               ? 'fill-amber-400/50 text-amber-400'
//                                               : 'text-slate-200 dark:text-slate-700'
//                                     }`}
//                                 />
//                             ))}
//                         </div>
//                     </div>
//                     <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
//                         Basé sur {stats.total} avis
//                     </p>

//                     {/* Barres de progression modernisées – remplacement du composant Progress */}
//                     <div className="space-y-4">
//                         {[5, 4, 3, 2, 1].map((star) => {
//                             const count = stats.distribution[star] || 0;
//                             const percentage =
//                                 stats.total > 0
//                                     ? (count / stats.total) * 100
//                                     : 0;

//                             return (
//                                 <div
//                                     key={star}
//                                     className="flex items-center gap-4"
//                                 >
//                                     <div className="flex w-16 items-center gap-1.5 text-sm font-medium">
//                                         <span className="text-slate-700 dark:text-slate-300">
//                                             {star}
//                                         </span>
//                                         <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
//                                     </div>
//                                     <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
//                                         <motion.div
//                                             className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-emerald-400 to-emerald-600"
//                                             initial={{ width: 0 }}
//                                             animate={{
//                                                 width: `${percentage}%`,
//                                             }}
//                                             transition={{
//                                                 duration: 0.6,
//                                                 ease: 'easeOut',
//                                             }}
//                                         />
//                                     </div>
//                                     <span className="w-12 text-right text-xs font-medium text-slate-500 dark:text-slate-400">
//                                         {count}
//                                     </span>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 </div>
//             </div>

//             {/* Formulaire de dépôt d'avis */}
//             <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
//                 <div className="mb-5 flex items-center gap-2">
//                     <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
//                         <MessageCircle className="h-4 w-4" />
//                     </span>
//                     <h3 className="font-semibold text-slate-800 dark:text-white">
//                         Laisser un avis
//                     </h3>
//                 </div>

//                 <div className="space-y-5">
//                     <div>
//                         <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
//                             Votre note
//                         </label>
//                         <div className="flex gap-2">
//                             {[1, 2, 3, 4, 5].map((star) => (
//                                 <button
//                                     key={star}
//                                     onClick={() => setReviewRating(star)}
//                                     className="group rounded-full p-1 transition hover:scale-110 focus:outline-none"
//                                 >
//                                     <Star
//                                         className={`h-8 w-8 transition-all duration-150 ${
//                                             star <= reviewRating
//                                                 ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
//                                                 : 'text-slate-300 group-hover:text-amber-400/40 dark:text-slate-600'
//                                         }`}
//                                     />
//                                 </button>
//                             ))}
//                         </div>
//                     </div>

//                     <div>
//                         <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
//                             Votre avis
//                         </label>
//                         <Textarea
//                             placeholder="Partagez votre expérience avec ce produit..."
//                             value={reviewComment}
//                             onChange={(e) => setReviewComment(e.target.value)}
//                             rows={4}
//                             className="resize-none rounded-xl border-slate-200 bg-slate-50 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-800/50 dark:placeholder:text-slate-500"
//                         />
//                         <p className="mt-1 text-xs text-slate-400">
//                             {reviewComment.length}/500 (minimum 10 caractères)
//                         </p>
//                     </div>

//                     <Button
//                         onClick={handleSubmitReview}
//                         disabled={
//                             submitting || reviewComment.trim().length < 10
//                         }
//                         className="w-full gap-2 rounded-xl bg-emerald-600 py-5 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 dark:shadow-emerald-900/30 dark:hover:bg-emerald-500"
//                     >
//                         {submitting ? (
//                             <span className="flex items-center gap-2">
//                                 <svg
//                                     className="h-5 w-5 animate-spin"
//                                     viewBox="0 0 24 24"
//                                 >
//                                     <circle
//                                         className="opacity-25"
//                                         cx="12"
//                                         cy="12"
//                                         r="10"
//                                         stroke="currentColor"
//                                         strokeWidth="4"
//                                         fill="none"
//                                     />
//                                     <path
//                                         className="opacity-75"
//                                         fill="currentColor"
//                                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
//                                     />
//                                 </svg>
//                                 Envoi...
//                             </span>
//                         ) : (
//                             <span className="flex items-center gap-2">
//                                 <Send className="h-4 w-4" />
//                                 Publier mon avis
//                             </span>
//                         )}
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     );
// }
// resources/js/components/ecommerce/products/avis/avis-clients.tsx
import { router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    CheckCircle2,
    MessageCircle,
    Send,
    Sparkles,
    Star,
    TrendingUp,
} from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ReviewCard } from './review-card';

interface Review {
    id: number;
    note: number;
    commentaire: string;
    client: string;
    date: string;
}

interface RatingStats {
    average: number;
    total: number;
    distribution: Record<number, number>;
}

interface Props {
    productId: string | number;
    avis: Review[];
    ratingStats?: RatingStats;
}

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: 'easeOut' },
    },
};

export function ReviewsSection({ productId, avis, ratingStats }: Props) {
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const formRef = useRef<HTMLDivElement>(null);

    /**
     * Statistiques des avis
     */
    const stats = useMemo(() => {
        if (ratingStats) {
            return ratingStats;
        }

        const total = avis.length;

        const average =
            total > 0
                ? avis.reduce((sum, review) => sum + review.note, 0) / total
                : 0;

        const distribution: Record<number, number> = {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
        };

        avis.forEach((review) => {
            if (distribution[review.note] !== undefined) {
                distribution[review.note]++;
            }
        });

        return {
            average,
            total,
            distribution,
        };
    }, [avis, ratingStats]);

    /**
     * Pourcentage de satisfaction (4 et 5 étoiles)
     */
    const satisfactionRate = useMemo(() => {
        if (stats.total === 0) {
            return 0;
        }

        const positive =
            (stats.distribution[4] || 0) + (stats.distribution[5] || 0);

        return Math.round((positive / stats.total) * 100);
    }, [stats]);

    /**
     * Libellé de la note
     */
    const ratingLabel = useMemo(() => {
        if (reviewRating === 5) {
            return 'Excellent';
        }

        if (reviewRating === 4) {
            return 'Très satisfait';
        }

        if (reviewRating === 3) {
            return 'Correct';
        }

        if (reviewRating === 2) {
            return 'Décevant';
        }

        return 'Insuffisant';
    }, [reviewRating]);

    /**
     * Scroll vers le formulaire
     */
    const scrollToForm = () => {
        formRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    /**
     * Soumission
     */
    const handleSubmitReview = () => {
        if (reviewComment.trim().length < 10) {
            return;
        }

        setSubmitting(true);

        router.post(
            route('tenant.products.reviews.store', productId),
            {
                note: reviewRating,
                commentaire: reviewComment.trim(),
            },
            {
                preserveScroll: true,
                preserveState: true,

                onSuccess: () => {
                    setReviewComment('');
                    setReviewRating(5);
                    setSubmitting(false);

                    toast.success('Merci pour votre avis !', {
                        description:
                            'Votre commentaire a été publié avec succès.',
                        icon: (
                            <Star
                                className="h-4 w-4 text-amber-400"
                                fill="currentColor"
                            />
                        ),
                    });

                    router.reload({
                        only: ['product'],
                    });
                },

                onError: () => {
                    setSubmitting(false);

                    toast.error('Une erreur est survenue', {
                        description: "Impossible d'enregistrer votre avis.",
                    });
                },
            },
        );
    };

    const canSubmit = reviewComment.trim().length >= 10 && !submitting;

    return (
        <section className="mt-24">
            {/* Header */}
            <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
            >
                <div className="max-w-2xl">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200/60 bg-emerald-50/80 px-4 py-2 text-xs font-semibold tracking-wide text-emerald-700 backdrop-blur-xl dark:border-emerald-800/40 dark:bg-emerald-950/30 dark:text-emerald-300">
                        <Sparkles className="h-3.5 w-3.5" />
                        AVIS CLIENTS
                    </div>

                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl dark:text-white">
                        Ce que pensent nos clients
                    </h2>

                    <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-400">
                        Consultez des retours authentiques et partagez votre
                        expérience avec ce produit.
                    </p>
                </div>

                {stats.total > 0 && (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        <StatCard
                            label="Note moyenne"
                            value={stats.average.toFixed(1)}
                            icon={<Star className="h-4 w-4" />}
                        />
                        <StatCard
                            label="Avis"
                            value={stats.total.toString()}
                            icon={<MessageCircle className="h-4 w-4" />}
                        />
                        <StatCard
                            label="Satisfaction"
                            value={`${satisfactionRate}%`}
                            icon={<TrendingUp className="h-4 w-4" />}
                        />
                    </div>
                )}
            </motion.div>

            <div className="grid gap-10 xl:grid-cols-[1fr_420px]">
                {/* Liste des avis */}
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {avis.length === 0 ? (
                        <div className="relative overflow-hidden rounded-3xl border border-dashed border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-12 text-center shadow-sm dark:border-emerald-800/40 dark:from-emerald-950/20 dark:to-slate-900">
                            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-lg dark:bg-slate-800">
                                <MessageCircle className="h-10 w-10 text-emerald-500" />
                            </div>

                            <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
                                Aucun avis pour le moment
                            </h3>

                            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                                Soyez le premier à partager votre expérience
                                avec ce produit.
                            </p>

                            <Button
                                onClick={scrollToForm}
                                className="mt-8 rounded-full px-6"
                            >
                                <Star className="mr-2 h-4 w-4" />
                                Donner mon avis
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <AnimatePresence mode="popLayout">
                                {avis.map((review, index) => (
                                    <motion.div
                                        key={review.id}
                                        initial={{
                                            opacity: 0,
                                            y: 24,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        transition={{
                                            duration: 0.35,
                                            delay: index * 0.04,
                                        }}
                                    >
                                        <ReviewCard
                                            customerName={review.client}
                                            rating={review.note}
                                            reviewDate={review.date}
                                            reviewText={review.commentaire}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </motion.div>

                {/* Sidebar */}
                <motion.div
                    ref={formRef}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="space-y-6 xl:sticky xl:top-24"
                >
                    {/* Résumé */}
                    <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-xl shadow-slate-200/40 backdrop-blur-2xl dark:border-slate-800/60 dark:bg-slate-900/80 dark:shadow-black/20">
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-100 text-amber-500 dark:bg-amber-900/20 dark:text-amber-400">
                                <Star className="h-5 w-5" fill="currentColor" />
                            </div>

                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white">
                                    Note globale
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Basé sur {stats.total} avis
                                </p>
                            </div>
                        </div>

                        <div className="mb-6 flex items-end justify-between gap-4">
                            <div className="flex items-baseline gap-1">
                                <span className="text-6xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {stats.average.toFixed(1)}
                                </span>
                                <span className="pb-2 text-sm text-slate-500">
                                    /5
                                </span>
                            </div>

                            <div className="flex gap-1">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <Star
                                        key={index}
                                        className={`h-5 w-5 ${
                                            index < Math.round(stats.average)
                                                ? 'fill-amber-400 text-amber-400'
                                                : 'text-slate-300 dark:text-slate-700'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            {[5, 4, 3, 2, 1].map((star) => {
                                const count = stats.distribution[star] || 0;

                                const percentage =
                                    stats.total > 0
                                        ? (count / stats.total) * 100
                                        : 0;

                                return (
                                    <div
                                        key={star}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="flex w-10 items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                                            {star}
                                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                        </div>

                                        <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{
                                                    width: `${percentage}%`,
                                                }}
                                                viewport={{ once: true }}
                                                transition={{
                                                    duration: 0.8,
                                                    ease: 'easeOut',
                                                }}
                                                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
                                            />
                                        </div>

                                        <span className="w-8 text-right text-xs font-medium text-slate-500">
                                            {count}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Formulaire */}
                    <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-xl shadow-slate-200/40 backdrop-blur-2xl dark:border-slate-800/60 dark:bg-slate-900/80 dark:shadow-black/20">
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />

                        <div className="mb-6 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
                                <MessageCircle className="h-5 w-5" />
                            </div>

                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white">
                                    Laisser un avis
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Votre retour aide les autres acheteurs.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Note */}
                            <div>
                                <div className="mb-3 flex items-center justify-between">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        Votre note
                                    </label>

                                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                        {ratingLabel}
                                    </span>
                                </div>

                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() =>
                                                setReviewRating(star)
                                            }
                                            className="transition-transform hover:scale-110"
                                        >
                                            <Star
                                                className={`h-8 w-8 ${
                                                    star <= reviewRating
                                                        ? 'fill-amber-400 text-amber-400'
                                                        : 'text-slate-300 dark:text-slate-600'
                                                }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Commentaire */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                                    Votre avis
                                </label>

                                <Textarea
                                    value={reviewComment}
                                    onChange={(e) =>
                                        setReviewComment(
                                            e.target.value.slice(0, 500),
                                        )
                                    }
                                    rows={5}
                                    placeholder="Partagez votre expérience avec ce produit..."
                                    className="resize-none rounded-2xl border-slate-200 bg-slate-50/70 dark:border-slate-700 dark:bg-slate-800/50"
                                />

                                <div className="mt-2 flex items-center justify-between text-xs">
                                    <span className="text-slate-400">
                                        Minimum 10 caractères
                                    </span>
                                    <span className="font-medium text-slate-500">
                                        {reviewComment.length}/500
                                    </span>
                                </div>
                            </div>

                            {/* CTA */}
                            <Button
                                onClick={handleSubmitReview}
                                disabled={!canSubmit}
                                className="h-12 w-full rounded-2xl bg-emerald-600 font-semibold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700"
                            >
                                {submitting ? (
                                    <span className="flex items-center gap-2">
                                        <svg
                                            className="h-4 w-4 animate-spin"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                                fill="none"
                                                className="opacity-25"
                                            />
                                            <path
                                                fill="currentColor"
                                                className="opacity-75"
                                                d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"
                                            />
                                        </svg>
                                        Publication...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Send className="h-4 w-4" />
                                        Publier mon avis
                                    </span>
                                )}
                            </Button>

                            {canSubmit && (
                                <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Votre avis est prêt à être publié.
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

/**
 * Petite carte de statistique
 */
function StatCard({
    label,
    value,
    icon,
}: {
    label: string;
    value: string;
    icon: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/70">
            <div className="mb-2 flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                {icon}
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">
                {value}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
                {label}
            </div>
        </div>
    );
}
