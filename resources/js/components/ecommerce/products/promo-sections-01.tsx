// resources/js/components/home/promo-section.tsx
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Copy, Calendar, ArrowRight, Check } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
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
export default function PromoSection({ promo }: PromoSectionProps) {
    const targetDate = useMemo(
        () => new Date(promo.end_date),
        [promo.end_date],
    );

    const useNow = () => {
        const [now, setNow] = useState(Date.now());

        useEffect(() => {
            const t = setInterval(() => setNow(Date.now()), 1000);

            return () => clearInterval(t);
        }, []);

        return now;
    };

    const now = useNow();
    const isExpired = targetDate.getTime() < now;

    const coupons = promo.coupons ?? [];

    const [timeLeft, setTimeLeft] = useState<TimeLeft>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    useEffect(() => {
        if (isExpired) {
            return;
        }

        const calculateTimeLeft = () => {
            const diff = targetDate.getTime() - Date.now();

            if (diff > 0) {
                setTimeLeft({
                    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((diff / 1000 / 60) % 60),
                    seconds: Math.floor((diff / 1000) % 60),
                });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [targetDate, isExpired]);

    const formatNumber = (n: number) => String(n).padStart(2, '0');

    const formatDate = (date: Date) =>
        date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit',
        });

    const copyCode = async (code: string) => {
        await navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    return (
        <section className="relative overflow-hidden py-8 md:py-12">
            {/* Fond et glow (inchangé) */}
            <div className="absolute inset-0 bg-linear-to-r from-orange-50 via-amber-50/80 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20" />
            <div className="absolute -top-32 -left-32 h-64 w-64 rounded-full bg-orange-300/20 blur-3xl" />
            <div className="absolute -right-32 -bottom-32 h-64 w-64 rounded-full bg-yellow-300/20 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-4">
                <div className="grid items-start gap-8 lg:grid-cols-2">
                    {/* Colonne gauche */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="space-y-5"
                    >
                        {/* Badge date */}
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
                            <Calendar className="h-4 w-4" />
                            Fin de la promo : {formatDate(targetDate)}
                        </span>

                        {/* Titre */}
                        <h2 className="text-2xl font-bold md:text-3xl">
                            {promo.title}{' '}
                            {promo.discount_percentage && (
                                <span className="bg-linear-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                                    -{promo.discount_percentage}%
                                </span>
                            )}
                        </h2>
                        <p className="max-w-md text-sm text-muted-foreground">
                            {promo.description}
                        </p>

                        {/* Compte à rebours */}
                        <div className="flex gap-3">
                            {Object.entries(timeLeft).map(([unit, value]) => (
                                <motion.div
                                    key={unit}
                                    whileHover={{ scale: 1.05 }}
                                    className="flex flex-col items-center"
                                >
                                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/70 shadow-sm backdrop-blur dark:bg-white/10">
                                        <span className="text-xl font-bold tabular-nums">
                                            {formatNumber(value)}
                                        </span>
                                    </div>
                                    <span className="mt-1 text-xs font-medium text-muted-foreground uppercase">
                                        {unit === 'days'
                                            ? 'J'
                                            : unit === 'hours'
                                              ? 'H'
                                              : unit === 'minutes'
                                                ? 'M'
                                                : 'S'}
                                    </span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Coupons */}
                        {coupons.length > 0 && (
                            <div className="space-y-2">
                                <p className="text-sm font-medium">
                                    Codes promo disponibles :
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    {coupons.map((coupon, idx) => (
                                        <motion.div
                                            key={idx}
                                            whileHover={{ scale: 1.02 }}
                                            className="flex items-center gap-3 rounded-xl border border-dashed border-primary/30 bg-white/60 px-4 py-2.5 backdrop-blur-sm dark:bg-white/10"
                                        >
                                            <div>
                                                <div className="text-lg leading-tight font-bold">
                                                    -{coupon.discount}€
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    dès {coupon.min_amount}€
                                                    d'achat
                                                </div>
                                            </div>
                                            <div className="ml-2 flex items-center gap-1.5">
                                                <code className="rounded-md bg-muted px-2.5 py-1 font-mono text-xs font-semibold">
                                                    {coupon.code}
                                                </code>
                                                <button
                                                    onClick={() =>
                                                        copyCode(coupon.code)
                                                    }
                                                    className={cn(
                                                        'rounded-md p-1.5 transition-all',
                                                        copiedCode ===
                                                            coupon.code
                                                            ? 'bg-green-500 text-white'
                                                            : 'bg-primary/10 hover:bg-primary/20',
                                                    )}
                                                >
                                                    {copiedCode ===
                                                    coupon.code ? (
                                                        <Check className="h-3.5 w-3.5" />
                                                    ) : (
                                                        <Copy className="h-3.5 w-3.5" />
                                                    )}
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Bouton CTA */}
                        <Button size="lg" className="shadow-md" asChild>
                            <Link href={route('tenant.promotions.index')}>
                                Voir toutes les offres
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </motion.div>

                    {/* Colonne droite : Image (inchangée) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative hidden lg:block"
                    >
                        <div className="group relative mx-auto aspect-4/3 w-full max-w-md overflow-hidden rounded-2xl shadow-xl">
                            <img
                                src={promo.image || '/images/promo-default.jpg'}
                                alt={promo.title}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />
                            {promo.discount_percentage && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute bottom-4 left-4 rounded-full bg-red-500 px-4 py-2 text-white shadow-lg"
                                >
                                    <span className="text-lg font-bold">
                                        -{promo.discount_percentage}%
                                    </span>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
