/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldAlert, X, Timer } from 'lucide-react';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Trial {
    start: string;
    end: string;
    remaining_days: number;
}

interface Subscription {
    status: string;
    is_active: boolean;
    is_paid: boolean;
    trial_ends_at: string | null;
}

interface Props {
    trial: Trial | null;
    subscription: Subscription | null;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

function calculateTimeLeft(endDate: string): TimeLeft {
    const total = new Date(endDate).getTime() - Date.now();

    if (total <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
        days: Math.floor(total / (1000 * 60 * 60 * 24)),
        hours: Math.floor((total / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((total / (1000 * 60)) % 60),
        seconds: Math.floor((total / 1000) % 60),
    };
}

export function SubscriptionReminderBanner({ trial, subscription }: Props) {
    const { auth, tenant } = usePage().props as any;
    const [isVisible, setIsVisible] = useState(false);
    const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

    const shouldShow = useMemo(() => {
        // Afficher si l'abonnement n'est pas "active" sur Stripe (donc en trialing gratuit ou payant)
        // ou si l'utilisateur est sur un plan gratuit (ID commençant par free_)
        if (subscription?.status === 'active' && subscription?.is_paid) {
            return false;
        }

        return true;
    }, [subscription]);

    const checkFrequencyHours = useCallback(() => {
        if (!shouldShow) {
            return;
        }

        const STORAGE_KEY = `subscription_reminder_${auth?.user?.id || 'guest'}`;
        const now = Date.now();
        const data = JSON.parse(
            localStorage.getItem(STORAGE_KEY) ||
                '{"count": 0, "lastShown": 0, "lastClosed": 0}',
        );

        // Réinitialiser le compteur si on change de jour
        const lastDate = new Date(data.lastShown).toDateString();
        const today = new Date().toDateString();

        if (lastDate !== today) {
            data.count = 0;
        }

        const fourHours = 4 * 60 * 60 * 1000;
        const timeSinceClosed = now - data.lastClosed;

        // Afficher si :
        // 1. N'a jamais été fermé aujourd'hui
        // 2. Ou si fermé il y a plus de 4 heures ET on a montré moins de 6 fois
        if (
            data.lastClosed === 0 ||
            (timeSinceClosed > fourHours && data.count < 6)
        ) {
            setIsVisible(true);
            data.lastShown = now;
            data.count += 1;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
    }, [shouldShow, auth?.user?.id]);

    const checkFrequencyMinutes = useCallback(() => {
        if (!shouldShow) {
            return;
        }

        const STORAGE_KEY = `subscription_reminder_${auth?.user?.id || 'guest'}`;
        const now = Date.now();
        const data = JSON.parse(
            localStorage.getItem(STORAGE_KEY) ||
                '{"count": 0, "lastShown": 0, "lastClosed": 0}',
        );

        // Réinitialiser le compteur si on change de jour
        const lastDate = new Date(data.lastShown).toDateString();
        const today = new Date().toDateString();

        if (lastDate !== today) {
            data.count = 0;
        }

        const uneMinute = 60 * 1000;
        const timeSinceClosed = now - data.lastClosed;

        if (
            data.lastClosed === 0 ||
            (timeSinceClosed > uneMinute && data.count < 6)
        ) {
            setIsVisible(true);
            data.lastShown = now;
            data.count += 1;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
    }, [shouldShow, auth?.user?.id]);

    const handleClose = () => {
        setIsVisible(false);
        const STORAGE_KEY = `subscription_reminder_${auth?.user?.id || 'guest'}`;
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        data.lastClosed = Date.now();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    };

    useEffect(() => {
        if (!shouldShow) {
            setIsVisible(false);

            return;
        }

        // Première vérification après un court délai
        const initialTimer = setTimeout(checkFrequencyMinutes, 1000);

        // Vérifier toutes les minutes pour voir s'il faut le remontrer (sans rechargement)
        const frequencyInterval = setInterval(checkFrequencyMinutes, 60000);

        const endTrialDate = trial?.end || subscription?.trial_ends_at;

        if (endTrialDate) {
            setTimeLeft(calculateTimeLeft(endTrialDate));
            const timerInterval = setInterval(() => {
                setTimeLeft(calculateTimeLeft(endTrialDate));
            }, 1000);

            return () => {
                clearInterval(timerInterval);
                clearInterval(frequencyInterval);
                clearTimeout(initialTimer);
            };
        }

        return () => {
            clearInterval(frequencyInterval);
            clearTimeout(initialTimer);
        };
    }, [shouldShow, trial, subscription, checkFrequencyMinutes]);

    // Temps réel via Echo (si disponible)
    useEffect(() => {
        if (
            typeof window !== 'undefined' &&
            (window as any).Echo &&
            auth?.user &&
            tenant?.id
        ) {
            (window as any).Echo.private(`tenant.${tenant.id}`)
                .listen('.TenantSubscriptionRenewed', () => {
                    // Recharger les données ou masquer le bandeau
                    setIsVisible(false);
                })
                .listen('.TenantSubscriptionBlocked', () => {
                    setIsVisible(true);
                });
        }
    }, [auth?.user, tenant?.id]);

    const isUrgent = trial ? trial.remaining_days <= 3 : true;

    return (
        <AnimatePresence>
            {isVisible && shouldShow && (
                <motion.div
                    initial={{ y: -40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -40, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                    className="pointer-events-none fixed top-4 right-4 left-4 z-50 flex justify-center"
                >
                    <div className="pointer-events-auto w-full max-w-5xl">
                        <div
                            className={`relative overflow-hidden rounded-2xl border shadow-lg backdrop-blur-xl transition-colors duration-300 ${
                                isUrgent
                                    ? 'border-amber-200/60 bg-white/95 shadow-amber-500/10 dark:border-amber-500/20 dark:bg-slate-900/95'
                                    : 'border-slate-200/80 bg-white/95 shadow-slate-950/5 dark:border-slate-800 dark:bg-slate-900/95'
                            }`}
                        >
                            <div
                                className={`absolute top-0 right-0 left-0 h-1 w-full ${
                                    isUrgent
                                        ? 'bg-linear-to-r from-amber-400 via-orange-500 to-amber-400'
                                        : 'bg-linear-to-r from-emerald-400 via-teal-500 to-emerald-400'
                                } animate-pulse`}
                            />

                            <div className="flex flex-col items-center justify-between gap-4 px-5 py-4 sm:px-6 md:flex-row">
                                <div className="flex w-full flex-1 items-center gap-4 md:w-auto">
                                    <div
                                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-300 ${
                                            isUrgent
                                                ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400'
                                                : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                                        }`}
                                    >
                                        {isUrgent ? (
                                            <ShieldAlert className="h-6 w-6 animate-bounce" />
                                        ) : (
                                            <Sparkles className="h-6 w-6 animate-[spin_6s_linear_infinite]" />
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2.5">
                                            <h4 className="text-base font-medium tracking-tight text-slate-900 dark:text-slate-50">
                                                {isUrgent
                                                    ? 'Action requise : Essai bientôt terminé'
                                                    : 'Boostez votre business avec Yetu Pro'}
                                            </h4>
                                            {isUrgent && (
                                                <Badge className="border-amber-200 bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                                                    Urgent
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="max-w-xl text-xs leading-relaxed font-medium text-slate-500 dark:text-slate-400">
                                            {isUrgent
                                                ? "Votre période d'essai se termine bientôt. Activez un forfait pour ne pas perdre l'accès à vos outils."
                                                : 'Profitez de toutes les fonctionnalités premium pour développer vos ventes et fidéliser vos clients.'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex w-full shrink-0 flex-wrap items-center justify-end gap-4 md:w-auto">
                                    {timeLeft &&
                                        (timeLeft.days > 0 ||
                                            timeLeft.hours > 0 ||
                                            timeLeft.minutes > 0) && (
                                            <div className="flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-slate-100 px-4 py-2 dark:border-slate-800 dark:bg-slate-950">
                                                <Timer className="h-4 w-4 animate-pulse text-slate-400" />
                                                <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 tabular-nums dark:text-slate-300">
                                                    <span>
                                                        {String(
                                                            timeLeft.days,
                                                        ).padStart(2, '0')}
                                                        j
                                                    </span>
                                                    <span className="text-slate-300">
                                                        :
                                                    </span>
                                                    <span>
                                                        {String(
                                                            timeLeft.hours,
                                                        ).padStart(2, '0')}
                                                        h
                                                    </span>
                                                    <span className="text-slate-300">
                                                        :
                                                    </span>
                                                    <span>
                                                        {String(
                                                            timeLeft.minutes,
                                                        ).padStart(2, '0')}
                                                        m
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                    <div className="flex items-center gap-3">
                                        <Button
                                            asChild
                                            size="lg"
                                            className={`group/btn h-11 rounded-2xl px-6 text-sm font-bold shadow-lg transition-all duration-300 active:scale-95 ${
                                                isUrgent
                                                    ? 'bg-amber-600 text-white shadow-amber-500/20 hover:bg-amber-700'
                                                    : 'bg-emerald-600 text-white shadow-emerald-500/20 hover:bg-emerald-700'
                                            }`}
                                        >
                                            <Link
                                                href={route(
                                                    'subscription.show',
                                                )}
                                                className="flex items-center gap-2"
                                            >
                                                Choisir un plan
                                                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                                            </Link>
                                        </Button>

                                        <button
                                            onClick={handleClose}
                                            className="rounded-2xl p-2.5 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-600 active:scale-90 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                                            title="Plus tard"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
