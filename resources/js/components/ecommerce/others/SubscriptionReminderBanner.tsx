/* eslint-disable react-hooks/set-state-in-effect */
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldAlert, X, Timer } from 'lucide-react';
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
    const [isVisible, setIsVisible] = useState(false);
    const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

    const shouldShow = useMemo(() => {
        if (subscription?.is_paid && subscription?.is_active && subscription?.status === 'active') {
            return false;
        }

        return true;
    }, [subscription]);

    useEffect(() => {
        if (!shouldShow) {
            setIsVisible(false);

            return;
        }

        const timer = setTimeout(() => setIsVisible(true), 600);
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

    const isUrgent = trial ? trial.remaining_days <= 3 : true;

    return (
        <AnimatePresence>
            {/* La condition imbriquée ici permet à l'animation d'exit de se jouer de manière fluide */}
            {isVisible && shouldShow && (
                <motion.div
                    initial={{ y: -40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -40, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 30 }}
                    className="fixed top-4 left-4 right-4 z-50 flex justify-center pointer-events-none"
                >
                    <div className="w-full max-w-5xl pointer-events-auto">
                        {/* Main Container */}
                        <div className={`relative overflow-hidden rounded-2xl border backdrop-blur-xl shadow-lg transition-colors duration-300 ${
                            isUrgent
                                ? 'bg-white/90 border-amber-200/60 shadow-amber-500/5 dark:bg-slate-900/90 dark:border-amber-500/20'
                                : 'bg-white/90 border-slate-200/80 shadow-slate-950/5 dark:bg-slate-900/90 dark:border-slate-800'
                        }`}>

                            {/* Subtle Background Glow Indicator */}
                            <div className={`absolute top-0 left-0 right-0 h-0.5 w-full ${
                                isUrgent ? 'bg-linear-to-r from-amber-400 to-orange-500' : 'bg-linear-to-r from-emerald-400 to-teal-500'
                            }`} />

                            <div className="px-5 py-3.5 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">

                                {/* Left Side: Icon & Context */}
                                <div className="flex items-center gap-4 flex-1 w-full md:w-auto">
                                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                                        isUrgent
                                            ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
                                            : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                                    }`}>
                                        {isUrgent ? (
                                            <ShieldAlert className="h-5 w-5 animate-pulse" />
                                        ) : (
                                            <Sparkles className="h-5 w-5 animate-[spin_6s_linear_infinite]" />
                                        )}
                                    </div>

                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-2.5">
                                            <h4 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                                                {isUrgent ? 'Essai bientôt expiré !' : 'Propulsez votre boutique'}
                                            </h4>
                                        </div>
                                        <p className="text-xs font-normal text-slate-500 dark:text-slate-400 leading-normal max-w-xl">
                                            {isUrgent
                                                ? "Le temps presse. Activez un forfait pour conserver l'accès à vos outils et vos ventes en cours."
                                                : "Votre version d'essai vous donne un aperçu de la puissance de Yetu. Ne laissez pas votre élan s'arrêter."}
                                        </p>
                                    </div>
                                </div>

                                {/* Right Side: Countdown + Actions */}
                                <div className="flex flex-wrap items-center justify-end gap-4 w-full md:w-auto shrink-0">

                                    {/* Countdown Timer */}
                                    {timeLeft && (timeLeft.days > 0 || timeLeft.hours > 0 || timeLeft.minutes > 0) && (
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/60">
                                            <Timer className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                                            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                                                <span>{String(timeLeft.days).padStart(2, '0')}j</span>
                                                <span className="text-slate-300 dark:text-slate-700">:</span>
                                                <span>{String(timeLeft.hours).padStart(2, '0')}h</span>
                                                <span className="text-slate-300 dark:text-slate-700">:</span>
                                                <span>{String(timeLeft.minutes).padStart(2, '0')}m</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Group */}
                                    <div className="flex items-center gap-2">
                                        <Button
                                            asChild
                                            size="sm"
                                            className={`group/btn h-9 rounded-xl px-4 text-xs font-medium shadow-xs transition-all duration-200 active:scale-98 ${
                                                isUrgent
                                                    ? 'bg-amber-600 hover:bg-amber-500 text-white dark:bg-amber-500 dark:hover:bg-amber-400'
                                                    : 'bg-emerald-600 hover:bg-emerald-500 text-white dark:bg-emerald-50 dark:text-slate-950 dark:hover:bg-white'
                                            }`}
                                        >
                                            <Link href={route('subscription.show')} className="flex items-center gap-1.5">
                                                Choisir un plan
                                                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                                            </Link>
                                        </Button>

                                        <button
                                            onClick={() => setIsVisible(false)}
                                            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                            title="Plus tard"
                                        >
                                            <X className="h-4 w-4" />
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
