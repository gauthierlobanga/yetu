/* eslint-disable react-hooks/set-state-in-effect */
// resources/js/components/home/daily-offers.tsx
import { Link } from '@inertiajs/react';
import type { Variants } from 'framer-motion';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Clock,
    Package,
    TrendingUp,
    Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import DailyOfferProductCard from '@/components/ecommerce/products/DailyOfferProductCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/ecommerce/products';

import 'swiper/css';
import 'swiper/css/navigation';

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

interface DailyOffersProps {
    bestSellers: Product[];
    dealOfTheDay: Product[];
}

/* -------------------------------------------------------------------------- */
/*                              Animation Variants                            */
/* -------------------------------------------------------------------------- */

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

/* -------------------------------------------------------------------------- */
/*                              Countdown Timer                               */
/* -------------------------------------------------------------------------- */

function CountdownTimer() {
    const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const midnight = new Date();
            midnight.setHours(24, 0, 0, 0);
            const diff = midnight.getTime() - now.getTime();

            if (diff > 0) {
                return {
                    h: Math.floor((diff / (1000 * 60 * 60)) % 24),
                    m: Math.floor((diff / 1000 / 60) % 60),
                    s: Math.floor((diff / 1000) % 60),
                };
            }

            return { h: 0, m: 0, s: 0 };
        };

        setTimeLeft(calculateTimeLeft());
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const format = (val: number) => val.toString().padStart(2, '0');

    return (
        <div className="mt-5 flex items-center gap-3">
            <div className="flex items-center text-xs font-bold uppercase tracking-widest text-rose-600/90 dark:text-rose-400/90">
                <Clock className="mr-1.5 h-4 w-4" />
                Se termine dans
            </div>
            <div className="flex gap-1.5">
                {[
                    { label: 'h', value: format(timeLeft.h) },
                    { label: 'm', value: format(timeLeft.m) },
                    { label: 's', value: format(timeLeft.s) },
                ].map((unit, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                        <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg border border-rose-200/60 bg-white/80 shadow-[0_0_15px_rgba(244,63,94,0.15)] backdrop-blur-md dark:border-rose-900/60 dark:bg-slate-900/80 dark:shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                            <span className="bg-linear-to-b from-rose-500 to-rose-700 bg-clip-text text-base font-bold text-transparent dark:from-rose-400 dark:to-rose-600">
                                {unit.value}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*                              Main Component                                */
/* -------------------------------------------------------------------------- */

export default function DailyOffers({
    bestSellers,
    dealOfTheDay,
}: DailyOffersProps) {
    return (
        <section className="relative overflow-hidden py-16 sm:py-16 lg:py-18">

            <div className="relative mx-auto max-w-350 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    className="mx-auto mb-12 max-w-3xl text-center lg:mb-16"
                >
                    <h2 className="mt-5 bg-linear-to-br from-slate-900 to-slate-600 bg-clip-text text-2xl font-semibold tracking-tight text-transparent sm:text-4xl lg:text-5xl dark:from-white dark:to-slate-400">
                        Les meilleures offres du moment
                    </h2>

                    <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-400">
                        Découvrez nos produits les plus populaires et les
                        promotions du jour sélectionnées pour vous.
                    </p>
                </motion.div>

                {/* Content */}
                <div className="grid gap-8 xl:grid-cols-2">
                    <OfferSection
                        title="Meilleures ventes"
                        description="Les produits les plus appréciés par nos clients."
                        badge="Top ventes"
                        badgeIcon={TrendingUp}
                        badgeClassName="text-emerald-700 dark:text-emerald-300 border-emerald-100 bg-emerald-50/80 dark:border-emerald-900/50 dark:bg-emerald-900/20"
                        link={route('tenant.product.index', {
                            sort: 'popular',
                        })}
                        linkLabel="Voir tout"
                        items={bestSellers}
                        prevClass="best-prev"
                        nextClass="best-next"
                        emptyTitle="Aucune meilleure vente"
                        emptyDescription="Les produits les plus populaires apparaîtront ici."
                        emptyLink={route('tenant.product.index')}
                        emptyLinkLabel="Explorer les produits"
                        colorTheme="emerald"
                    />

                    <OfferSection
                        title="Deal du jour"
                        description="Des réductions exceptionnelles à durée limitée."
                        badge="Flash deal"
                        badgeIcon={Zap}
                        badgeClassName="text-rose-700 dark:text-rose-300 border-rose-100 bg-rose-50/80 dark:border-rose-900/50 dark:bg-rose-900/20"
                        link={route('tenant.promotions.index')}
                        linkLabel="Voir tout"
                        items={dealOfTheDay}
                        prevClass="deal-prev"
                        nextClass="deal-next"
                        showDiscount
                        highlighted
                        isDeal
                        emptyTitle="Aucun deal en cours"
                        emptyDescription="Les promotions du jour apparaîtront ici."
                        emptyLink={route('tenant.promotions.index')}
                        emptyLinkLabel="Voir les promotions"
                        colorTheme="rose"
                    />
                </div>
            </div>
        </section>
    );
}

/* -------------------------------------------------------------------------- */
/*                               Offer Section                                */
/* -------------------------------------------------------------------------- */

interface OfferSectionProps {
    title: string;
    description: string;
    badge: string;
    badgeIcon: React.ElementType;
    badgeClassName?: string;
    link: string;
    linkLabel: string;
    items: Product[];
    prevClass: string;
    nextClass: string;
    showDiscount?: boolean;
    highlighted?: boolean;
    isDeal?: boolean;
    emptyTitle: string;
    emptyDescription: string;
    emptyLink: string;
    emptyLinkLabel: string;
    colorTheme?: 'emerald' | 'rose';
}

function OfferSection({
    title,
    description,
    badge,
    badgeIcon: BadgeIcon,
    badgeClassName,
    link,
    linkLabel,
    items,
    prevClass,
    nextClass,
    showDiscount = false,
    highlighted = false,
    isDeal = false,
    emptyTitle,
    emptyDescription,
    emptyLink,
    emptyLinkLabel,
    colorTheme = 'emerald',
}: OfferSectionProps) {
    return (
        <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className={cn(
                'relative flex flex-col overflow-hidden rounded border',
                'backdrop-blur-2xl transition-all duration-500 hover:shadow',
                highlighted
                    ? 'border-rose-200/60 bg-linear-to-br from-rose-50/90 via-white/95 to-amber-50/80 hover:shadow-rose-500/10 dark:border-rose-900/40 dark:from-rose-950/40 dark:via-slate-950/95 dark:to-amber-950/20 dark:hover:shadow-rose-900/20'
                    : 'border-slate-200/70 bg-white/90 hover:shadow-emerald-500/5 dark:border-slate-800/70 dark:bg-slate-900/80 dark:hover:shadow-emerald-900/10',
            )}
        >
            {/* Glow */}
            {/* <div className="pointer-events-none absolute inset-0">
                <div
                    className={cn(
                        'absolute -top-24 right-0 h-64 w-64 rounded-full blur-[80px] transition-opacity duration-500',
                        highlighted
                            ? 'bg-rose-400/20 dark:bg-rose-600/20'
                            : 'bg-emerald-400/15 dark:bg-emerald-600/15',
                    )}
                />
            </div> */}

            <div className="relative flex flex-1 flex-col p-6 sm:p-8">
                {/* Header */}
                <div className="mb-8 flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                        <Badge
                            variant="secondary"
                            className={cn(
                                'mb-4 rounded-full border px-3 py-1 text-[11px] font-bold tracking-[0.2em] uppercase shadow-xs transition-colors',
                                badgeClassName,
                            )}
                        >
                            <BadgeIcon className="mr-1.5 h-3.5 w-3.5" />
                            {badge}
                        </Badge>

                        <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                            {title}
                        </h3>

                        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                            {description}
                        </p>

                        {isDeal && items.length > 0 && <CountdownTimer />}
                    </div>

                    {items.length > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className={cn(
                                'shrink-0 rounded-full transition-colors',
                                colorTheme === 'rose'
                                    ? 'text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/50 dark:hover:text-rose-300'
                                    : 'text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-300',
                            )}
                        >
                            <Link href={link}>
                                {linkLabel}
                                <ArrowRight className="ml-1.5 h-4 w-4" />
                            </Link>
                        </Button>
                    )}
                </div>

                {/* Content */}
                <div className="mt-auto">
                    {items.length > 0 ? (
                        <Carousel
                            items={items}
                            prevClass={prevClass}
                            nextClass={nextClass}
                            showDiscount={showDiscount}
                            colorTheme={colorTheme}
                        />
                    ) : (
                        <EmptyState
                            icon={Package}
                            title={emptyTitle}
                            description={emptyDescription}
                            link={emptyLink}
                            linkText={emptyLinkLabel}
                        />
                    )}
                </div>
            </div>
        </motion.div>
    );
}

/* -------------------------------------------------------------------------- */
/*                                  Carousel                                  */
/* -------------------------------------------------------------------------- */

interface CarouselProps {
    items: Product[];
    prevClass: string;
    nextClass: string;
    showDiscount?: boolean;
    colorTheme?: 'emerald' | 'rose';
}

function Carousel({
    items,
    prevClass,
    nextClass,
    showDiscount = false,
    colorTheme = 'emerald',
}: CarouselProps) {
    const loop = items.length > 3;
    const isRose = colorTheme === 'rose';

    return (
        <div className="group/carousel relative -mx-2">
            <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={20}
                slidesPerView={1}
                loop={loop}
                speed={650}
                watchOverflow
                autoplay={
                    items.length > 1
                        ? {
                              delay: 4500,
                              disableOnInteraction: false,
                              pauseOnMouseEnter: true,
                          }
                        : false
                }
                navigation={{
                    prevEl: `.${prevClass}`,
                    nextEl: `.${nextClass}`,
                }}
                breakpoints={{
                    768: {
                        slidesPerView: 2,
                    },
                    1280: {
                        slidesPerView: 3,
                    },
                }}
                className="px-2 pt-2 pb-6"
            >
                {items.map((product, idx) => {
                    const inStock =
                        (product.quantite_stock ??
                            product.stock_disponible ??
                            0) > 0;

                    return (
                        <SwiperSlide key={product.id} className="h-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.4,
                                    delay: idx * 0.05,
                                }}
                                className="group relative h-full"
                            >
                                {/* Glow Effect on Hover */}
                                {/* <div
                                    className={cn(
                                        'absolute -inset-1 rounded-2xl opacity-0 blur-lg transition-all duration-500 group-hover:opacity-100',
                                        isRose
                                            ? 'bg-linear-to-br from-rose-500/20 via-orange-400/10 to-rose-600/20 dark:from-rose-500/30 dark:via-orange-400/15 dark:to-rose-600/30'
                                            : 'bg-linear-to-br from-emerald-500/20 via-teal-400/10 to-emerald-600/20 dark:from-emerald-500/30 dark:via-teal-400/15 dark:to-emerald-600/30',
                                    )}
                                ></div> */}

                                <div
                                    className={cn(
                                        'relative h-full overflow-hidden rounded-2xl border bg-white shadow-xs transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-xl dark:bg-slate-900',
                                        isRose
                                            ? 'border-rose-100 group-hover:border-rose-300 group-hover:shadow-rose-500/10 dark:border-rose-900/40 dark:group-hover:border-rose-700/60'
                                            : 'border-slate-200/70 group-hover:border-emerald-300 group-hover:shadow-emerald-500/10 dark:border-slate-800/70 dark:group-hover:border-emerald-700/60',
                                        !inStock &&
                                            'opacity-80 grayscale-[0.4] group-hover:translate-y-0 group-hover:shadow-none',
                                    )}
                                >
                                    <DailyOfferProductCard
                                        product={product}
                                        showDiscountBadge={showDiscount}
                                    />

                                    {!inStock && (
                                        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-[2px] dark:bg-slate-950/50">
                                            <Badge
                                                variant="destructive"
                                                className="scale-110 border-white/20 px-3 py-1.5 text-xs font-bold tracking-widest uppercase shadow-xl dark:border-slate-800"
                                            >
                                                Épuisé
                                            </Badge>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>

            {items.length > 1 && (
                <>
                    <NavButton
                        className={prevClass}
                        direction="prev"
                        colorTheme={colorTheme}
                    />
                    <NavButton
                        className={nextClass}
                        direction="next"
                        colorTheme={colorTheme}
                    />
                </>
            )}
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*                               Nav Button                                   */
/* -------------------------------------------------------------------------- */

function NavButton({
    className,
    direction,
    colorTheme,
}: {
    className: string;
    direction: 'prev' | 'next';
    colorTheme: 'emerald' | 'rose';
}) {
    const Icon = direction === 'prev' ? ChevronLeft : ChevronRight;
    const isRose = colorTheme === 'rose';

    return (
        <button
            type="button"
            className={cn(
                className,
                'absolute top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded border',
                'border-white/80 bg-white/90 text-slate-700 backdrop-blur-xl',
                'shadow-[0_5px_18px_-8px_rgba(15,23,42,0.2)]',
                'opacity-0 transition-all duration-300',
                'group-hover/carousel:opacity-100 xl:flex',
                'hover:scale-110 hover:shadow-[0_8px_25px_-8px_rgba(15,23,42,0.3)]',
                'dark:border-slate-700/80 dark:bg-slate-900/90 dark:text-slate-300',
                isRose
                    ? 'hover:border-rose-200 hover:text-rose-600 dark:hover:border-rose-800 dark:hover:text-rose-400'
                    : 'hover:border-emerald-200 hover:text-emerald-600 dark:hover:border-emerald-800 dark:hover:text-emerald-400',
                direction === 'prev' ? 'left-2' : 'right-2',
            )}
            aria-label={
                direction === 'prev' ? 'Produit précédent' : 'Produit suivant'
            }
        >
            <Icon className="h-5 w-5" />
        </button>
    );
}

/* -------------------------------------------------------------------------- */
/*                                Empty State                                 */
/* -------------------------------------------------------------------------- */

interface EmptyStateProps {
    icon: React.ElementType;
    title: string;
    description: string;
    link: string;
    linkText: string;
}

function EmptyState({
    icon: Icon,
    title,
    description,
    link,
    linkText,
}: EmptyStateProps) {
    return (
        <div className="flex min-h-75 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200/70 bg-slate-50/50 px-6 py-10 text-center backdrop-blur-sm transition-colors hover:bg-slate-50/80 dark:border-slate-800/70 dark:bg-slate-900/30 dark:hover:bg-slate-900/50">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-800 dark:ring-slate-700">
                <Icon className="h-7 w-7 text-slate-400 dark:text-slate-500" />
            </div>

            <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                {title}
            </h4>

            <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {description}
            </p>

            <Button
                variant="outline"
                asChild
                className="mt-6 rounded-full px-6 transition-all hover:scale-105"
            >
                <Link href={link}>{linkText}</Link>
            </Button>
        </div>
    );
}
