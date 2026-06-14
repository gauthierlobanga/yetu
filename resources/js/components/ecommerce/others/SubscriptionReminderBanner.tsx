import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Sparkles, ArrowRight, ShieldAlert, X } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
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
    if (total <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    return {
        days: Math.floor(total / (1000 * 60 * 60 * 24)),
        hours: Math.floor((total / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((total / (1000 * 60)) % 60),
        seconds: Math.floor((total / 1000) % 60),
    };
}

export function SubscriptionReminderBanner({ trial, subscription }: Props) {
    const [isVisible, setIsVisible] = useState(false);
    const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

    // Déterminer si on doit afficher le bandeau
    const shouldShow = useMemo(() => {
        // Si déjà abonné à un plan payant et actif, pas besoin de rappel
        if (subscription?.is_paid && subscription?.is_active && subscription?.status === 'active') {
            return false;
        }

        // Si en période d'essai ou pas d'abonnement du tout
        return true;
    }, [subscription]);

    useEffect(() => {
        if (!shouldShow) {
            setIsVisible(false);
            return;
        }

        // Petit délai pour l'effet d'apparition après le chargement
        const timer = setTimeout(() => setIsVisible(true), 1500);

        // Gestion du countdown si date de fin d'essai disponible
        const endTrialDate = trial?.end || subscription?.trial_ends_at;

        if (endTrialDate) {
            setTimeLeft(calculateTimeLeft(endTrialDate));
            const interval = setInterval(() => {
                setTimeLeft(calculateTimeLeft(endTrialDate));
            }, 1000);
            return () => {
                clearInterval(interval);
                clearTimeout(timer);
            };
        }

        return () => clearTimeout(timer);
    }, [shouldShow, trial, subscription]);

    if (!isVisible || !shouldShow) return null;

    const isExpiringSoon = trial ? trial.remaining_days <= 3 : true;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-6 left-6 right-6 z-50 flex justify-center pointer-events-none"
            >
                <div className="w-full max-w-4xl pointer-events-auto">
                    <div className={`relative overflow-hidden rounded-3xl border shadow-2xl backdrop-blur-xl p-5 sm:p-6 ${
                        isExpiringSoon
                        ? 'border-amber-200 bg-white/90 dark:border-amber-900/50 dark:bg-slate-950/90'
                        : 'border-emerald-200 bg-white/90 dark:border-emerald-900/50 dark:bg-slate-950/90'
                    }`}>
                        {/* Background Decoration */}
                        <div className={`absolute -top-24 -right-24 h-48 w-48 rounded-full blur-3xl opacity-20 ${
                            isExpiringSoon ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} />

                        <div className="relative flex flex-col md:flex-row items-center gap-6">
                            {/* Icon & Message */}
                            <div className="flex items-center gap-4 flex-1">
                                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                                    isExpiringSoon
                                    ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                                    : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                                }`}>
                                    {isExpiringSoon ? <ShieldAlert className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
                                </div>

                                <div>
                                    <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        {isExpiringSoon ? 'Action requise : Essai bientôt terminé' : 'Sécurisez votre boutique'}
                                        {trial && (
                                            <span className="hidden sm:inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                                Version d'essai
                                            </span>
                                        )}
                                    </h4>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                        {isExpiringSoon
                                            ? "Pour éviter toute interruption de service, choisissez un plan adapté avant la fin de votre essai."
                                            : "Vous n'avez pas encore d'abonnement actif. Choisissez un plan pour débloquer tout le potentiel de Yetu."}
                                    </p>
                                </div>
                            </div>

                            {/* Countdown & CTA */}
                            <div className="flex flex-wrap items-center gap-6">
                                {timeLeft && (timeLeft.days > 0 || timeLeft.hours > 0 || timeLeft.minutes > 0) && (
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col items-center">
                                            <span className="text-lg font-black text-slate-900 dark:text-white tabular-nums">
                                                {String(timeLeft.days).padStart(2, '0')}
                                            </span>
                                            <span className="text-[10px] font-bold uppercase text-slate-400">Jours</span>
                                        </div>
                                        <span className="text-slate-300 dark:text-slate-700 font-bold">:</span>
                                        <div className="flex flex-col items-center">
                                            <span className="text-lg font-black text-slate-900 dark:text-white tabular-nums">
                                                {String(timeLeft.hours).padStart(2, '0')}
                                            </span>
                                            <span className="text-[10px] font-bold uppercase text-slate-400">H</span>
                                        </div>
                                        <span className="text-slate-300 dark:text-slate-700 font-bold">:</span>
                                        <div className="flex flex-col items-center">
                                            <span className="text-lg font-black text-slate-900 dark:text-white tabular-nums">
                                                {String(timeLeft.minutes).padStart(2, '0')}
                                            </span>
                                            <span className="text-[10px] font-bold uppercase text-slate-400">Min</span>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-3">
                                    <Button asChild className={`rounded-2xl px-6 font-bold shadow-lg transition-all hover:scale-105 active:scale-95 ${
                                        isExpiringSoon
                                        ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/20'
                                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
                                    }`}>
                                        <Link href={route('subscription.show')}>
                                            Choisir un plan
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>

                                    <button
                                        onClick={() => setIsVisible(false)}
                                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                        title="Ignorer pour le moment"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
