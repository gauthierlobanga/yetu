/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/components/home/daily-offers.tsx

import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    Package,
    Sparkles,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Navigation, Autoplay, EffectFade } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import DailyOfferProductCard from '@/components/ecommerce/products/DailyOfferProductCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Product } from '@/types/ecommerce/products';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
// eslint-disable-next-line import/order
import { motion } from 'framer-motion';

interface DailyOffersProps {
    bestSellers: Product[];
    dealOfTheDay: Product[];
}

export default function DailyOffers({
    bestSellers,
    dealOfTheDay,
}: DailyOffersProps) {
    // Détection responsive pour le nombre de slides
    const [slidesPerView, setSlidesPerView] = useState(3);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setSlidesPerView(3);
            } else if (window.innerWidth >= 768) {
                setSlidesPerView(2);
            } else {
                setSlidesPerView(1);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const shouldLoop = (items: Product[]) => items.length > slidesPerView;

    return (
        <section className="relative overflow-hidden py-14">
            {/* Dégradé d'arrière‑plan */}
            <div className="absolute inset-0 bg-linear-to-b from-emerald-50/40 via-white to-emerald-50/20 dark:from-emerald-950/20 dark:via-gray-950 dark:to-emerald-950/10" />

            <div className="relative mx-auto max-w-7xl px-4">
                <div className="mb-10 text-center">
                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <Sparkles className="h-4 w-4" />
                        Offres du jour
                    </span>
                    <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground">
                        Nos meilleures offres
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                        Sélectionnées pour vous
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Best Sellers */}
                    <Card className="overflow-hidden border-0 bg-card/70 backdrop-blur-sm">
                        <CardContent className="p-4">
                            <Header
                                title="Meilleures ventes"
                                subtitle="De super prix et choix de qualité"
                            />

                            {bestSellers.length > 0 ? (
                                <Carousel
                                    items={bestSellers}
                                    slidesPerView={slidesPerView}
                                    shouldLoop={shouldLoop}
                                    prevClass="best-prev"
                                    nextClass="best-next"
                                />
                            ) : (
                                <EmptyState
                                    icon={Package}
                                    title="Aucune meilleure vente"
                                    description="Les produits populaires apparaîtront ici."
                                    link={route('tenant.product.index')}
                                    linkText="Voir tous les produits"
                                />
                            )}
                        </CardContent>
                    </Card>

                    {/* Deal of the Day */}
                    <Card className="overflow-hidden border-0 bg-linear-to-br from-rose-50/70 to-amber-50/70 backdrop-blur-sm dark:from-rose-950/20 dark:to-amber-950/20">
                        <CardContent className="p-4">
                            <div className="mb-3 flex items-center justify-between">
                                <Header
                                    title="Deal du Jour"
                                    subtitle="Offres exceptionnelles, quantités limitées"
                                />
                                {dealOfTheDay.length > 0 && (
                                    <Button
                                        variant="link"
                                        size="sm"
                                        className="p-0"
                                        asChild
                                    >
                                        <Link
                                            href={route(
                                                'tenant.promotions.index',
                                            )}
                                            className="text-emerald-600 dark:text-emerald-400"
                                        >
                                            Voir plus{' '}
                                            <ArrowRight className="ml-1 h-3 w-3" />
                                        </Link>
                                    </Button>
                                )}
                            </div>

                            {dealOfTheDay.length > 0 ? (
                                <Carousel
                                    items={dealOfTheDay}
                                    slidesPerView={slidesPerView}
                                    shouldLoop={shouldLoop}
                                    prevClass="deal-prev"
                                    nextClass="deal-next"
                                    showDiscount
                                />
                            ) : (
                                <EmptyState
                                    icon={Sparkles}
                                    title="Pas de deal en cours"
                                    description="Les offres exceptionnelles seront disponibles ici."
                                    link={route('tenant.promotions.index')}
                                    linkText="Voir les promotions"
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}

// ----------------------------------------------------------------------
// Carousel amélioré
// ----------------------------------------------------------------------
function Carousel({
    items,
    slidesPerView,
    shouldLoop,
    prevClass,
    nextClass,
    showDiscount = false,
}: {
    items: Product[];
    slidesPerView: number;
    shouldLoop: (items: Product[]) => boolean;
    prevClass: string;
    nextClass: string;
    showDiscount?: boolean;
}) {
    const loop = shouldLoop(items);

    return (
        <div className="group/carousel relative">
            <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={16}
                slidesPerView={1}
                loop={loop}
                speed={600}
                autoplay={
                    items.length > 2
                        ? {
                              delay: 4000,
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
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                }}
                className="w-full pb-2!"
            >
                {items.map((product) => (
                    <SwiperSlide key={product.id}>
                        <motion.div
                            whileHover={{ y: -2, scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                            className="h-full"
                        >
                            <DailyOfferProductCard
                                product={product}
                                showDiscountBadge={showDiscount}
                            />
                        </motion.div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Boutons de navigation professionnels */}
            <NavButton className={prevClass} direction="prev" />
            <NavButton className={nextClass} direction="next" />
        </div>
    );
}

// ----------------------------------------------------------------------
// Bouton de navigation amélioré
// ----------------------------------------------------------------------
function NavButton({
    className,
    direction,
}: {
    className: string;
    direction: 'prev' | 'next';
}) {
    const Icon = direction === 'prev' ? ChevronLeft : ChevronRight;
    const position = direction === 'prev' ? 'left-1' : 'right-1';

    return (
        <button
            className={`${className} absolute top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/90 text-foreground opacity-0 shadow-sm backdrop-blur-sm transition-all duration-300 group-hover/carousel:opacity-100 hover:bg-card hover:shadow-md ${position}`}
            aria-label={direction === 'prev' ? 'Précédent' : 'Suivant'}
        >
            <Icon className="h-5 w-5 transition-transform group-hover/carousel:scale-110" />
        </button>
    );
}

// ----------------------------------------------------------------------
// En-tête
// ----------------------------------------------------------------------
function Header({ title, subtitle }: { title: string; subtitle: string }) {
    return (
        <div className="mb-4">
            <h3 className="font-heading text-lg font-semibold text-foreground">
                {title}
            </h3>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
    );
}

// ----------------------------------------------------------------------
// État vide
// ----------------------------------------------------------------------
function EmptyState({
    icon: Icon,
    title,
    description,
    link,
    linkText,
}: {
    icon: React.ElementType;
    title: string;
    description: string;
    link: string;
    linkText: string;
}) {
    return (
        <div className="flex min-h-45 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted/30 px-4 py-8 text-center">
            <Icon className="h-10 w-10 text-muted-foreground" />
            <div>
                <h4 className="font-medium text-foreground">{title}</h4>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <Button variant="outline" size="sm" asChild>
                <Link href={link}>{linkText}</Link>
            </Button>
        </div>
    );
}
