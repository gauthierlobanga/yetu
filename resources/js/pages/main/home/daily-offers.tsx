/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/components/home/daily-offers.tsx
import { Link } from '@inertiajs/react';
import { ArrowRight, XCircle, Package, Sparkles } from 'lucide-react';
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
    return (
        <section className="bg-muted/30 py-10 lg:py-14">
            <div className="mx-auto max-w-7xl px-4">
                <h2 className="mb-5 flex items-center justify-center font-heading text-3xl font-bold">
                    Offres du jour
                </h2>

                <div className="grid gap-5 lg:grid-cols-2">
                    {/* Colonne Meilleures ventes */}
                    <Card className="overflow-hidden rounded-none">
                        <CardContent className="p-4">
                            <div className="mb-5 flex items-center justify-center">
                                <div>
                                    <h3 className="text-center font-heading text-2xl font-semibold">
                                        Meilleures ventes
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        De super prix et choix de qualité
                                    </p>
                                </div>
                            </div>

                            {bestSellers.length > 0 ? (
                                <div className="group relative">
                                    <Swiper
                                        modules={[Navigation]}
                                        spaceBetween={8}
                                        slidesPerView={1}
                                        loop={true}
                                        navigation={{
                                            prevEl: '.best-prev',
                                            nextEl: '.best-next',
                                        }}
                                        breakpoints={{
                                            768: { slidesPerView: 2 },
                                            1024: { slidesPerView: 3 },
                                        }}
                                        className="w-full"
                                    >
                                        {bestSellers.map((product) => (
                                            <SwiperSlide key={product.id}>
                                                <DailyOfferProductCard
                                                    product={product}
                                                />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>

                                    {/* Flèches personnalisées */}
                                    <button className="best-prev absolute top-1/2 left-2 z-10 -translate-x-2 -translate-y-1/2 rounded-full bg-background/80 p-2 opacity-0 shadow-lg backdrop-blur-sm transition-all group-hover:translate-x-0 group-hover:opacity-100 hover:bg-background hover:shadow-xl">
                                        <ArrowRight className="h-5 w-5 rotate-180" />
                                    </button>
                                    <button className="best-next absolute top-1/2 right-2 z-10 translate-x-2 -translate-y-1/2 rounded-full bg-background/80 p-2 opacity-0 shadow-lg backdrop-blur-sm transition-all group-hover:translate-x-0 group-hover:opacity-100 hover:bg-background hover:shadow-xl">
                                        <ArrowRight className="h-5 w-5" />
                                    </button>
                                </div>
                            ) : (
                                <EmptyState
                                    icon={Package}
                                    title="Aucune meilleure vente"
                                    description="Les produits les plus populaires apparaîtront ici. Revenez bientôt !"
                                    link={route('shop.products.index')}
                                    linkText="Voir tous les produits"
                                />
                            )}
                        </CardContent>
                    </Card>

                    {/* Colonne Deal du jour */}
                    <Card className="overflow-hidden rounded-none bg-linear-to-br from-red-50/50 to-orange-50/50 dark:from-red-950/10 dark:to-orange-950/10">
                        <CardContent className="p-4">
                            <div className="mb-3 flex items-center justify-between">
                                <div>
                                    <h3 className="flex items-center gap-2 font-heading text-lg font-semibold">
                                        Deal du Jour
                                        <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-medium text-white">
                                            JUSQU'À -80%
                                        </span>
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        Offres exceptionnelles, quantités
                                        limitées
                                    </p>
                                </div>
                                {dealOfTheDay.length > 0 && (
                                    <Button
                                        variant="link"
                                        size="sm"
                                        className="h-auto p-0"
                                        asChild
                                    >
                                        <Link
                                            href={route(
                                                'shop.promotions.index',
                                            )}
                                        >
                                            Voir plus
                                            <ArrowRight className="ml-1 h-3 w-3" />
                                        </Link>
                                    </Button>
                                )}
                            </div>

                            {dealOfTheDay.length > 0 ? (
                                <div className="group/carousel relative">
                                    <Swiper
                                        modules={[Navigation]}
                                        spaceBetween={8}
                                        slidesPerView={1}
                                        loop={true}
                                        navigation={{
                                            prevEl: '.deal-prev',
                                            nextEl: '.deal-next',
                                        }}
                                        breakpoints={{
                                            768: { slidesPerView: 2 },
                                            1024: { slidesPerView: 3 },
                                        }}
                                        className="w-full"
                                    >
                                        {dealOfTheDay.map((product) => (
                                            <SwiperSlide key={product.id}>
                                                <DailyOfferProductCard
                                                    product={product}
                                                    showDiscountBadge
                                                />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>

                                    <button className="deal-prev absolute top-1/2 left-0 z-10 -translate-y-1/2 rounded-full bg-background/80 p-2 opacity-0 shadow-lg backdrop-blur-sm transition-opacity group-hover/carousel:opacity-100 hover:bg-background">
                                        <ArrowRight className="h-5 w-5 rotate-180" />
                                    </button>
                                    <button className="deal-next absolute top-1/2 right-0 z-10 -translate-y-1/2 rounded-full bg-background/80 p-2 opacity-0 shadow-lg backdrop-blur-sm transition-opacity group-hover/carousel:opacity-100 hover:bg-background">
                                        <ArrowRight className="h-5 w-5" />
                                    </button>
                                </div>
                            ) : (
                                <EmptyState
                                    icon={Sparkles}
                                    title="Pas de deal en cours"
                                    description="Les offres exceptionnelles seront disponibles ici. Restez à l'affût !"
                                    link={route('shop.promotions.index')}
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

// Composant réutilisable pour les états vides
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
        <div className="flex min-h-50 flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border bg-background/50 p-6 text-center backdrop-blur-sm">
            <div className="rounded-full bg-muted p-3">
                <Icon className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
                <h4 className="text-lg font-medium">{title}</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                    {description}
                </p>
            </div>
            <Button variant="outline" className="mt-2" asChild>
                <Link href={link}>{linkText}</Link>
            </Button>
        </div>
    );
}
