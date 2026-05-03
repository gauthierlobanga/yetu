/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/components/home/daily-offers.tsx

import { Link } from '@inertiajs/react';
import { ArrowRight, Package, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import DailyOfferProductCard from '@/components/ecommerce/products/DailyOfferProductCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Product } from '@/types/ecommerce/products';

import 'swiper/css';
import 'swiper/css/navigation';

interface DailyOffersProps {
    bestSellers: Product[];
    dealOfTheDay: Product[];
}

export default function DailyOffers({
    bestSellers,
    dealOfTheDay,
}: DailyOffersProps) {
    const [slidesPerView, setSlidesPerView] = useState(1);

    // ✅ Détection responsive robuste
    useEffect(() => {
        const updateSlides = () => {
            if (window.innerWidth >= 1024) {
                setSlidesPerView(3);
            } else if (window.innerWidth >= 768) {
                setSlidesPerView(2);
            } else {
                setSlidesPerView(1);
            }
        };

        updateSlides();
        window.addEventListener('resize', updateSlides);

        return () => window.removeEventListener('resize', updateSlides);
    }, []);

    // ✅ Loop intelligent (clé de la solution)
    const shouldLoop = (items: Product[]) => items.length > slidesPerView;

    return (
        <section className="bg-muted/30 py-10 lg:py-14">
            <div className="mx-auto max-w-7xl px-4">
                <h2 className="mb-5 text-center font-heading text-3xl font-bold">
                    Offres du jour
                </h2>

                <div className="grid gap-5 lg:grid-cols-2">
                    {/* ================= BEST SELLERS ================= */}
                    <Card className="overflow-hidden">
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
                                    link={route('product.index')}
                                    linkText="Voir tous les produits"
                                />
                            )}
                        </CardContent>
                    </Card>

                    {/* ================= DEAL OF THE DAY ================= */}
                    <Card className="overflow-hidden bg-linear-to-br from-red-50/50 to-orange-50/50 dark:from-red-950/10 dark:to-orange-950/10">
                        <CardContent className="p-4">
                            <div className="mb-3 flex items-center justify-between">
                                <Header
                                    title="Deal du Jour"
                                    subtitle="Offres exceptionnelles"
                                />

                                {dealOfTheDay.length > 0 && (
                                    <Button
                                        variant="link"
                                        size="sm"
                                        className="p-0"
                                        asChild
                                    >
                                        <Link href={route('promotions.index')}>
                                            Voir plus
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
                                    description="Les offres apparaîtront ici."
                                    link={route('promotions.index')}
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

//////////////////////////////////////////////////////////////////
// COMPONENT CAROUSEL RÉUTILISABLE (clé pro)
//////////////////////////////////////////////////////////////////

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
        <div className="group relative">
            <Swiper
                modules={[Navigation]}
                spaceBetween={12}
                slidesPerView={1}
                loop={loop}
                navigation={{
                    prevEl: `.${prevClass}`,
                    nextEl: `.${nextClass}`,
                }}
                breakpoints={{
                    768: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                }}
                className="w-full"
            >
                {items.map((product) => (
                    <SwiperSlide key={product.id}>
                        <DailyOfferProductCard
                            product={product}
                            showDiscountBadge={showDiscount}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Navigation */}
            <NavButton className={prevClass} left />
            <NavButton className={nextClass} />
        </div>
    );
}

//////////////////////////////////////////////////////////////////
//  NAV BUTTON
//////////////////////////////////////////////////////////////////

function NavButton({
    className,
    left = false,
}: {
    className: string;
    left?: boolean;
}) {
    return (
        <button
            className={`absolute top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/80 p-2 opacity-0 shadow-lg backdrop-blur transition-all group-hover:opacity-100 ${
                left ? 'left-2' : 'right-2'
            }`}
        >
            <ArrowRight className={`h-5 w-5 ${left ? 'rotate-180' : ''}`} />
        </button>
    );
}

//////////////////////////////////////////////////////////////////
//  HEADER
//////////////////////////////////////////////////////////////////

function Header({ title, subtitle }: { title: string; subtitle: string }) {
    return (
        <div className="mb-5 text-center">
            <h3 className="font-heading text-xl font-semibold">{title}</h3>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
    );
}

//////////////////////////////////////////////////////////////////
//  EMPTY STATE
//////////////////////////////////////////////////////////////////

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
        <div className="flex min-h-40 flex-col items-center justify-center gap-4 text-center">
            <Icon className="h-8 w-8 text-muted-foreground" />
            <div>
                <h4 className="font-medium">{title}</h4>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <Button variant="outline" asChild>
                <Link href={link}>{linkText}</Link>
            </Button>
        </div>
    );
}
