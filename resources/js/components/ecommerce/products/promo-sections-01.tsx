/* eslint-disable react-hooks/purity */
import { Link } from '@inertiajs/react';
import type { Variants } from 'framer-motion';
import {
    ArrowRight,
    Calendar,
    Check,
    Clock3,
    Copy,
    Sparkles,
    Ticket,
    Zap,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { PromoData } from '@/types/ecommerce/products';

interface PromoSectionProps {
    promo: PromoData;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

function formatNumber(value: number): string {
    return String(value).padStart(2, '0');
}

function formatDate(date: Date): string {
    return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

function CountdownUnit({ label, value }: { label: string; value: number }) {
    return (
        <div className="flex min-w-14 flex-col items-center justify-center rounded-xl border border-slate-200/50 bg-white/60 p-2 shadow-xs backdrop-blur-md dark:border-slate-700/50 dark:bg-slate-800/60">
            <span className="text-xl font-bold tracking-tighter text-slate-900 tabular-nums md:text-2xl dark:text-white">
                {formatNumber(value)}
            </span>
            <span className="mt-0.5 text-[10px] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                {label}
            </span>
        </div>
    );
}

export default function PromoSection({ promo }: PromoSectionProps) {
    const targetDate = useMemo(
        () => new Date(promo.end_date),
        [promo.end_date],
    );
    const coupons = promo.coupons ?? [];
    const [now, setNow] = useState(Date.now());
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000);

        return () => clearInterval(interval);
    }, []);

    const diff = Math.max(targetDate.getTime() - now, 0);
    const isExpired = diff <= 0;
    const isAlmostExpired = diff > 0 && diff < 24 * 60 * 60 * 1000;

    const timeLeft: TimeLeft = {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
    };

    const copyCode = useCallback(async (code: string) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopiedCode(code);
            setTimeout(() => setCopiedCode(null), 2000);
        } catch (error) {
            console.error(error);
        }
    }, []);

    // Animation variants
    const container: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const item: Variants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] } },
    };

    return (
        <section className="relative w-full overflow-hidden bg-white py-10 md:py-12 lg:py-14 dark:bg-slate-950">
            {/* Animated Gradient Background */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                        rotate: [0, 90, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: 'linear'
                    }}
                    className="absolute -left-1/4 -top-1/2 h-200 w-200 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.2, 0.4, 0.2],
                        rotate: [0, -90, 0],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: 'linear'
                    }}
                    className="absolute -bottom-1/2 -right-1/4 h-150 w-150 rounded-full bg-linear-to-bl from-cyan-500/20 to-emerald-400/20 blur-[100px] mix-blend-multiply dark:mix-blend-screen"
                />
            </div>

            {/* Promo Image with smooth fade mask */}
            {promo.image && (
                <motion.div
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-full select-none md:block md:w-1/2 lg:w-3/5"
                    style={{
                        maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
                        WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)',
                    }}
                >
                    <img
                        src={promo.image}
                        alt=""
                        className="h-full w-full object-cover object-center opacity-40 mix-blend-overlay dark:opacity-30 dark:mix-blend-lighten"
                        loading="lazy"
                    />
                </motion.div>
            )}

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-50px' }}
                    className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between"
                >
                    {/* Colonne gauche */}
                    <div className="w-full space-y-6 lg:max-w-3xl">
                        {/* Titre + badges */}
                        <motion.div variants={item} className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-3">
                                <h2 className="bg-linear-to-br from-slate-900 to-slate-600 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent md:text-4xl lg:text-5xl dark:from-white dark:to-slate-400">
                                    {promo.title}
                                </h2>
                                {promo.discount_percentage && (
                                    <span className="inline-flex rotate-3 items-center gap-0.5 rounded-xl bg-emerald-500 px-3 py-1 text-sm font-bold text-white shadow-lg shadow-emerald-500/30">
                                        <Zap className="h-4 w-4 fill-current" />
                                        -{promo.discount_percentage}%
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge className="h-7 gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 text-xs font-semibold text-emerald-700 shadow-none backdrop-blur-md transition-colors hover:bg-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
                                    <Sparkles className="h-3.5 w-3.5" /> Exclusif
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className="h-7 gap-1.5 rounded-lg border-slate-200/60 bg-white/50 px-3 text-xs font-medium text-slate-600 backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/50 dark:text-slate-300"
                                >
                                    <Calendar className="h-3.5 w-3.5" />
                                    Fin : {formatDate(targetDate)}
                                </Badge>
                            </div>
                        </motion.div>

                        {/* Description */}
                        {promo.description && (
                            <motion.p variants={item} className="max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg dark:text-slate-300">
                                {promo.description}
                            </motion.p>
                        )}

                        {/* Timer + Codes promo */}
                        {!isExpired && (
                            <motion.div
                                variants={item}
                                className="inline-flex w-full flex-col gap-6 rounded-3xl border border-white/60 bg-white/50 p-6 shadow-xl shadow-slate-200/20 backdrop-blur-xl sm:w-auto sm:flex-row sm:items-center dark:border-slate-800/40 dark:bg-slate-900/40 dark:shadow-none"
                            >
                                {/* Timer */}
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300">
                                        <Clock3
                                            className={cn(
                                                'h-4 w-4',
                                                isAlmostExpired ? 'animate-pulse text-rose-500' : 'text-emerald-500',
                                            )}
                                        />
                                        Fin de l’offre dans
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CountdownUnit label="jours" value={timeLeft.days} />
                                        <span className="text-2xl font-light text-slate-300 dark:text-slate-700">:</span>
                                        <CountdownUnit label="h" value={timeLeft.hours} />
                                        <span className="text-2xl font-light text-slate-300 dark:text-slate-700">:</span>
                                        <CountdownUnit label="m" value={timeLeft.minutes} />
                                        <span className="text-2xl font-light text-slate-300 dark:text-slate-700">:</span>
                                        <CountdownUnit label="s" value={timeLeft.seconds} />
                                    </div>
                                </div>

                                {/* Séparateur */}
                                {coupons.length > 0 && (
                                    <div className="hidden h-20 w-px bg-slate-200/60 sm:block dark:bg-slate-700/60" />
                                )}

                                {/* Codes promo */}
                                {coupons.length > 0 && (
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300">
                                            <Ticket className="h-4 w-4 text-emerald-500" />
                                            Codes promo
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {coupons.map((coupon, idx) => (
                                                <motion.div
                                                    key={`${coupon.code}-${idx}`}
                                                    whileHover={{ y: -2, scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="group flex items-center gap-2 rounded-xl border border-slate-200/60 bg-white p-1.5 pl-4 shadow-xs transition-all hover:border-emerald-500/30 hover:shadow-emerald-500/10 dark:border-slate-700/60 dark:bg-slate-800 dark:hover:border-emerald-500/30"
                                                >
                                                    <span className="font-mono text-sm font-bold tracking-wider text-slate-800 dark:text-slate-100">
                                                        {coupon.code}
                                                    </span>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8 rounded-lg bg-slate-50 text-slate-400 transition-colors group-hover:bg-emerald-50 group-hover:text-emerald-600 dark:bg-slate-900 dark:group-hover:bg-emerald-500/20 dark:group-hover:text-emerald-400"
                                                        onClick={() => copyCode(coupon.code)}
                                                    >
                                                        {copiedCode === coupon.code ? (
                                                            <Check className="h-4 w-4 text-emerald-500" />
                                                        ) : (
                                                            <Copy className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* CTA Block */}
                        <motion.div
                            variants={item}
                            className="flex flex-col items-start gap-4 pt-4 sm:flex-row sm:items-center"
                        >
                            <Link
                                href={route('tenant.promotions.index')}
                                className="group relative inline-flex h-14 items-center justify-center gap-3 overflow-hidden rounded-xl bg-emerald-600 px-8 text-base font-semibold text-white shadow-[0_0_40px_-10px_rgba(16,185,129,0.4)] transition-all duration-300 hover:scale-[1.02] hover:bg-emerald-500 hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.6)] active:scale-[0.98]"
                            >
                                <span className="absolute inset-0 flex h-full w-full justify-center transform-[skew(-13deg)_translateX(-100%)] group-hover:duration-1000 group-hover:transform-[skew(-13deg)_translateX(100%)]">
                                    <div className="relative h-full w-8 bg-white/20" />
                                </span>
                                <span className="relative flex items-center gap-2">
                                    Profiter de l’offre
                                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5" />
                                </span>
                            </Link>

                            {isExpired && (
                                <span className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm font-bold tracking-wider text-rose-600 uppercase dark:text-rose-400">
                                    <Clock3 className="h-4 w-4" /> Expiré
                                </span>
                            )}
                            {isAlmostExpired && !isExpired && (
                                <span className="inline-flex animate-pulse items-center gap-1.5 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-600 dark:text-amber-400">
                                    <Zap className="h-4 w-4" /> Fin imminente !
                                </span>
                            )}
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
