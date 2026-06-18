/* eslint-disable react-hooks/purity */
import { Link } from '@inertiajs/react';
import type { Variants } from 'framer-motion';
import { motion } from 'framer-motion';
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
        <div className="flex min-w-9.5 flex-col items-center">
            <span className="text-lg font-bold tracking-tight text-slate-900 tabular-nums md:text-xl dark:text-white">
                {formatNumber(value)}
            </span>
            <span className="mt-0 text-[9px] font-medium tracking-wider text-slate-400 uppercase dark:text-slate-500">
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
        show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    };

    return (
        <section className="relative w-full overflow-hidden border-y border-slate-100 bg-white py-10 md:py-12 dark:border-slate-900 dark:bg-slate-950">
            {/* Arrière-plan diagonal - image fixe avec fondu */}
            {promo.image && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="pointer-events-none absolute inset-y-0 right-0 z-0 hidden w-7/12 select-none md:block lg:w-1/2"
                    style={{
                        clipPath: 'polygon(25% 0, 100% 0, 100% 100%, 0% 100%)',
                    }}
                >
                    <img
                        src={promo.image}
                        alt=""
                        className="h-full w-full object-cover object-center opacity-40 dark:opacity-25"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-white via-white/30 to-transparent dark:from-slate-950 dark:via-slate-950/30" />
                </motion.div>
            )}

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-50px' }}
                    className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
                >
                    {/* Colonne gauche */}
                    <div className="w-full space-y-4 lg:max-w-4xl">
                        {/* Titre + badges */}
                        <motion.div variants={item} className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl dark:text-white">
                                    {promo.title}
                                </h2>
                                {promo.discount_percentage && (
                                    <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-600 px-2 py-0.5 text-[11px] font-semibold text-white">
                                        <Zap className="h-2.5 w-2.5 fill-current" />
                                        -{promo.discount_percentage}%
                                    </span>
                                )}
                            </div>
                            <div className="ml-0 flex items-center gap-1.5 sm:ml-2">
                                <Badge className="h-5 gap-1 border border-emerald-500/15 bg-emerald-500/10 text-[10px] text-emerald-700 shadow-none hover:bg-emerald-500/15 dark:bg-emerald-500/5 dark:text-emerald-400">
                                    <Sparkles className="h-2.5 w-2.5" /> Exclusif
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className="h-5 gap-1 border-slate-200 text-[10px] font-normal text-slate-400 dark:border-slate-800 dark:text-slate-500"
                                >
                                    <Calendar className="h-2.5 w-2.5" />
                                    Fin : {formatDate(targetDate)}
                                </Badge>
                            </div>
                        </motion.div>

                        {/* Description */}
                        {promo.description && (
                            <motion.p variants={item} className="line-clamp-1 max-w-3xl text-xs text-slate-500 dark:text-slate-400">
                                {promo.description}
                            </motion.p>
                        )}

                        {/* Timer + Codes promo */}
                        {!isExpired && (
                            <motion.div
                                variants={item}
                                className="inline-flex max-w-full flex-col gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-2.5 backdrop-blur-xs sm:flex-row sm:items-center dark:border-slate-900/60 dark:bg-slate-900/20"
                            >
                                {/* Timer */}
                                <div className="flex items-center gap-3">
                                    <div className="flex shrink-0 items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                                        <Clock3
                                            className={cn(
                                                'h-3.5 w-3.5',
                                                isAlmostExpired ? 'animate-pulse text-rose-500' : 'text-emerald-500',
                                            )}
                                        />
                                        Fin de l’offre :
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <CountdownUnit label="j" value={timeLeft.days} />
                                        <span className="-mt-2 font-light text-slate-300 dark:text-slate-800">:</span>
                                        <CountdownUnit label="h" value={timeLeft.hours} />
                                        <span className="-mt-2 font-light text-slate-300 dark:text-slate-800">:</span>
                                        <CountdownUnit label="m" value={timeLeft.minutes} />
                                        <span className="-mt-2 font-light text-slate-300 dark:text-slate-800">:</span>
                                        <CountdownUnit label="s" value={timeLeft.seconds} />
                                    </div>
                                </div>

                                {/* Séparateur */}
                                <div className="hidden h-6 w-px bg-slate-200 sm:block dark:bg-slate-800" />

                                {/* Codes promo */}
                                {coupons.length > 0 && (
                                    <div className="flex min-w-50 items-center gap-2">
                                        <div className="flex shrink-0 items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                                            <Ticket className="h-3.5 w-3.5 text-emerald-500" />
                                            Codes :
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {coupons.map((coupon, idx) => (
                                                <motion.div
                                                    key={`${coupon.code}-${idx}`}
                                                    whileHover={{ y: -0.5 }}
                                                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white py-0.5 pr-0.5 pl-2 text-xs shadow-2xs dark:border-slate-800 dark:bg-slate-950"
                                                >
                                                    <span className="font-mono font-bold tracking-wide text-slate-700 dark:text-slate-300">
                                                        {coupon.code}
                                                    </span>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-5 w-5 rounded-md text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/50"
                                                        onClick={() => copyCode(coupon.code)}
                                                    >
                                                        {copiedCode === coupon.code ? (
                                                            <Check className="h-3 w-3 text-emerald-500" />
                                                        ) : (
                                                            <Copy className="h-3 w-3" />
                                                        )}
                                                    </Button>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>

                    {/* Bloc CTA + éventuels indicateurs */}
                    <motion.div
                        variants={item}
                        className="flex shrink-0 items-center gap-3 pt-1 lg:pt-0"
                    >
                        <Link
                            href={route('tenant.promotions.index')}
                            className="group inline-flex h-14 items-center gap-2 rounded-lg bg-emerald-600 px-8 text-base font-semibold text-white shadow-sm transition-all duration-300 ease-out hover:bg-emerald-700 hover:shadow-md focus-visible:outline focus-visible:outline-emerald-600 active:scale-[0.98]"
                        >
                            Profiter de l’offre
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1" />
                        </Link>

                        {isExpired && (
                            <span className="rounded border border-rose-500/10 bg-rose-500/5 px-2 py-0.5 text-[10px] font-bold tracking-wider text-rose-500 uppercase">
                                Expiré
                            </span>
                        )}
                        {isAlmostExpired && !isExpired && (
                            <span className="animate-pulse text-[11px] font-medium text-amber-500 dark:text-amber-400">
                                ⏰ Fin imminente !
                            </span>
                        )}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
