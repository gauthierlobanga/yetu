// resources/js/components/ecommerce/products/avis/avis-clients.tsx
import { router } from '@inertiajs/react';
import { motion } from 'framer-motion';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Star, Sparkles, Send, MessageCircle, ArrowRight } from 'lucide-react';
import type { Key } from 'react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import getToastStyle from '@/lib/toast-style';
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

export function ReviewsSection({ productId, avis, ratingStats }: Props) {
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const formRef = useRef<HTMLDivElement>(null);

    const stats = ratingStats ?? {
        average:
            avis.length > 0
                ? avis.reduce((sum: any, r: { note: any }) => sum + r.note, 0) /
                  avis.length
                : 0,
        total: avis.length,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };

    const handleSubmitReview = () => {
        if (!reviewComment.trim()) {
            return;
        }

        setSubmitting(true);

        router.post(
            `/product/${productId}/review`,
            { note: reviewRating, commentaire: reviewComment },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setReviewComment('');
                    setReviewRating(5);
                    setSubmitting(false);
                    toast.success('Merci pour votre avis !', {
                        description: 'Votre avis a été publié avec succès.',
                        icon: <Star className="h-5 w-5 text-amber-400" />,
                        duration: 3000,
                        style: getToastStyle('success'),
                    });
                    router.get(
                        window.location.href,
                        {},
                        {
                            only: ['product'],
                            preserveState: true,
                            preserveScroll: true,
                            replace: true,
                        },
                    );
                },
                onError: () => {
                    setSubmitting(false);
                    toast.error('Erreur', {
                        description: "Impossible de publier l'avis.",
                        style: getToastStyle('error'),
                    });
                },
            },
        );
    };

    const scrollToForm = () => {
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="mt-20 grid gap-12 lg:grid-cols-3">
            {/* Colonne gauche : liste des avis */}
            <div className="lg:col-span-2">
                {/* En‑tête avec séparateur décoratif */}
                <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <div className="mb-2 flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                <Sparkles className="h-5 w-5" />
                            </span>
                            <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                                Avis clients
                            </h2>
                        </div>
                        <p className="max-w-md text-sm text-muted-foreground">
                            {avis.length > 0
                                ? 'Des avis authentiques pour vous guider dans votre choix.'
                                : 'Soyez le premier à partager votre expérience.'}
                        </p>
                    </div>
                    {avis.length > 0 && (
                        <div className="flex items-center gap-2 rounded-full bg-muted/80 px-4 py-1.5 text-sm backdrop-blur-sm">
                            <span className="font-semibold text-foreground">
                                {avis.length}
                            </span>
                            <span className="text-muted-foreground">avis</span>
                        </div>
                    )}
                </div>

                {/* État vide */}
                {avis.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 px-8 py-20 text-center dark:border-emerald-800 dark:bg-emerald-950/20"
                    >
                        <div className="mb-6 rounded-full bg-emerald-100 p-4 dark:bg-emerald-900/40">
                            <MessageCircle className="h-10 w-10 text-emerald-500 dark:text-emerald-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">
                            Aucun avis pour le moment
                        </h3>
                        <p className="mt-2 max-w-md text-sm text-muted-foreground">
                            Ce produit n’a pas encore été évalué. Votre opinion
                            compte ! Prenez une minute pour aider les autres
                            acheteurs.
                        </p>
                        <button
                            onClick={scrollToForm}
                            className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700 dark:bg-emerald-500 dark:shadow-emerald-900/30 dark:hover:bg-emerald-600"
                        >
                            <Star className="h-4 w-4" />
                            Donner mon avis
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </button>
                    </motion.div>
                ) : (
                    <div className="divide-y divide-border/60">
                        {avis.map(
                            (review: {
                                id: Key | null | undefined;
                                client: string;
                                note: number;
                                date: string;
                                commentaire: string;
                            }) => (
                                <ReviewCard
                                    key={review.id}
                                    customerName={review.client}
                                    rating={review.note}
                                    reviewDate={review.date}
                                    reviewText={review.commentaire}
                                />
                            ),
                        )}
                    </div>
                )}
            </div>

            {/* Colonne droite : résumé + formulaire */}
            <div className="space-y-6" ref={formRef}>
                {/* Carte Note globale */}
                <div className="rounded-2xl border border-border bg-linear-to-br from-card to-card/50 p-6 shadow-sm backdrop-blur-sm">
                    <div className="mb-4 flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                            <Star className="h-4 w-4" fill="currentColor" />
                        </span>
                        <h3 className="font-semibold text-foreground">
                            Note globale
                        </h3>
                    </div>

                    <div className="mb-4 flex items-end justify-between">
                        <div className="flex items-baseline gap-1">
                            <span className="text-6xl font-extrabold tracking-tight text-foreground">
                                {Number(stats.average).toFixed(1)}
                            </span>
                            <span className="text-base text-muted-foreground">
                                /5
                            </span>
                        </div>
                        <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-5 w-5 ${
                                        i < Math.floor(stats.average)
                                            ? 'fill-amber-400 text-amber-400'
                                            : i < stats.average
                                              ? 'fill-amber-400/50 text-amber-400'
                                              : 'text-muted-foreground/20'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    <p className="mb-6 text-sm text-muted-foreground">
                        Basé sur {stats.total} avis
                    </p>

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
                                    <div className="flex w-12 items-center gap-1 text-sm font-medium text-foreground">
                                        <span>{star}</span>
                                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                    </div>
                                    <Progress
                                        value={percentage}
                                        className="h-2.5 flex-1 bg-muted"
                                    />
                                    <span className="w-10 text-right text-xs text-muted-foreground">
                                        {Number(percentage).toFixed(0)}%
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Formulaire */}
                <div className="rounded-2xl border border-border bg-linear-to-br from-card to-card/50 p-6 shadow-sm backdrop-blur-sm">
                    <div className="mb-5 flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                            <MessageCircle className="h-4 w-4" />
                        </span>
                        <h3 className="font-semibold text-foreground">
                            Laisser un avis
                        </h3>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-foreground">
                                Votre note
                            </label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setReviewRating(star)}
                                        className="group rounded-full p-1 transition hover:scale-110 focus:outline-none"
                                    >
                                        <Star
                                            className={`h-8 w-8 transition-all duration-150 ${
                                                star <= reviewRating
                                                    ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                                                    : 'text-muted-foreground/20 group-hover:text-amber-400/40'
                                            }`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-foreground">
                                Votre avis
                            </label>
                            <Textarea
                                placeholder="Partagez votre expérience avec ce produit..."
                                value={reviewComment}
                                onChange={(e) =>
                                    setReviewComment(e.target.value)
                                }
                                rows={4}
                                className="resize-none rounded-xl border-border bg-muted/40 placeholder:text-muted-foreground/60 focus:border-emerald-500 focus:ring-emerald-500"
                            />
                            <p className="mt-1 text-xs text-muted-foreground">
                                {reviewComment.length}/500 (minimum 10
                                caractères)
                            </p>
                        </div>

                        <Button
                            onClick={handleSubmitReview}
                            disabled={
                                submitting || reviewComment.trim().length < 10
                            }
                            className="w-full rounded-xl bg-emerald-600 py-5 text-base font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-emerald-500 dark:shadow-emerald-900/30 dark:hover:bg-emerald-600"
                        >
                            {submitting ? (
                                <span className="flex items-center gap-2">
                                    <svg
                                        className="h-5 w-5 animate-spin"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="none"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                        />
                                    </svg>
                                    Envoi...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <MessageCircle className="h-5 w-5" />
                                    Publier mon avis
                                </span>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
