import { useGSAP } from '@gsap/react';
import { Link, usePage } from '@inertiajs/react';
import gsap from 'gsap';
import { ArrowRight, Flame, Sparkles } from 'lucide-react';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import type { Category } from '@/types/ecommerce/products';

interface HeroSectionProps {
    categories: Category[];
}

export default function HeroSection({ categories }: HeroSectionProps) {
    const containerRef = useRef(null);
    const { productsCount } = usePage<{ productsCount: number }>().props;

    useGSAP(
        () => {
            const tl = gsap.timeline();

            tl.from('.hero-badge', {
                y: 20,
                opacity: 0,
                duration: 0.6,
                ease: 'power3.out',
            })
                .from('.hero-title', {
                    y: 60,
                    opacity: 0,
                    duration: 1,
                    ease: 'power4.out',
                })
                .from(
                    '.hero-subtitle',
                    {
                        y: 30,
                        opacity: 0,
                        duration: 0.8,
                    },
                    '-=0.6',
                )
                .from(
                    '.hero-cta',
                    {
                        y: 20,
                        opacity: 0,
                        duration: 0.6,
                    },
                    '-=0.5',
                )
                .from(
                    '.hero-categories',
                    {
                        y: 20,
                        opacity: 0,
                        duration: 0.6,
                        stagger: 0.05,
                    },
                    '-=0.4',
                )
                .from(
                    '.hero-image',
                    {
                        scale: 0.9,
                        opacity: 0,
                        duration: 1,
                        ease: 'power3.out',
                    },
                    '-=0.8',
                );
        },
        { scope: containerRef },
    );

    return (
        <section
            ref={containerRef}
            className="relative overflow-hidden py-24 lg:py-32"
        >
            {/* Fond premium avec dégradé linéaire */}
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-background to-primary/10 dark:from-primary/10 dark:via-background dark:to-primary/5" />

            {/* Glow effects */}
            <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/20 blur-3xl dark:bg-primary/10" />
            <div className="absolute -right-40 -bottom-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl dark:bg-primary/5" />

            {/* Grille subtile */}
            <div className="absolute inset-0 bg-[radial-linear(circle_at_1px_1px,var(--color-border)_1px,transparent_0)] bg-size-[40px_40px] opacity-[0.06] dark:opacity-[0.04]" />

            <div className="relative mx-auto max-w-7xl px-4">
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    {/* CONTENU GAUCHE */}
                    <div className="space-y-8">
                        {/* Badge */}
                        <div className="hero-badge inline-flex items-center rounded-full border border-border bg-card/60 px-4 py-1 text-sm text-foreground backdrop-blur">
                            <Sparkles className="mr-1 h-4 w-4 text-primary" />
                            Nouvelle collection 2025
                        </div>

                        {/* Titre */}
                        <h1 className="hero-title font-heading text-4xl leading-tight font-bold text-foreground md:text-5xl lg:text-6xl">
                            Découvrez la nouvelle
                            <span className="block bg-linear-to-r from-primary to-emerald-400 bg-clip-text text-transparent dark:from-primary dark:to-emerald-300">
                                collection Premium
                            </span>
                        </h1>

                        {/* Sous-titre */}
                        <p className="hero-subtitle max-w-lg text-lg text-muted-foreground md:text-xl">
                            Des produits sélectionnés avec soin pour vous offrir
                            une expérience unique. Livraison rapide et garantie.
                        </p>

                        {/* CTA */}
                        <div className="hero-cta flex flex-wrap gap-4">
                            <Button
                                size="lg"
                                className="group relative overflow-hidden rounded-full bg-primary px-8 py-6 text-lg font-semibold text-primary-foreground shadow-lg transition hover:shadow-xl"
                                asChild
                            >
                                <Link href={route('tenant.product.index')}>
                                    <span className="relative z-10 flex items-center">
                                        Acheter maintenant
                                        <ArrowRight className="ml-2 h-5 w-5 transition group-hover:translate-x-1" />
                                    </span>
                                    {/* Effet de survol brillant */}
                                    <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                                </Link>
                            </Button>

                            <Button
                                size="lg"
                                variant="outline"
                                className="rounded-full px-8 py-6 text-lg backdrop-blur"
                                asChild
                            >
                                <Link
                                    href={route(
                                        'tenant.product.category.index',
                                    )}
                                >
                                    Explorer nos catégories
                                </Link>
                            </Button>
                        </div>

                        {/* Catégories rapides */}
                        <div className="hero-categories flex flex-wrap gap-2 pt-6">
                            {categories.slice(0, 5).map((cat) => (
                                <Link
                                    key={cat.id}
                                    href={cat.url}
                                    className="group rounded-full border border-border bg-card/60 px-4 py-2 text-sm text-foreground backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-primary/10 hover:text-primary"
                                >
                                    {cat.nom}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* IMAGE DROITE */}
                    <div className="hero-image relative hidden lg:block">
                        <div className="relative mx-auto w-full max-w-lg">
                            {/* Glow derrière l'image */}
                            <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-primary/30 to-primary-foreground/10 blur-2xl dark:from-primary/20 dark:to-transparent" />

                            {/* Conteneur image */}
                            <div className="relative overflow-hidden rounded-3xl border border-border/50 shadow-2xl">
                                <img
                                    src="storage/images/shopping-basket.jpg"
                                    alt="Collection"
                                    className="h-full w-full object-cover transition duration-700 hover:scale-105"
                                />
                            </div>

                            {/* Carte flottante avec compteur */}
                            <div className="absolute -bottom-6 -left-6 rounded-xl border border-border bg-card/90 p-4 shadow-lg backdrop-blur">
                                <p className="text-sm font-semibold text-foreground">
                                    <Flame className="inline-block h-4 w-4 text-orange-500" />{' '}
                                    +{productsCount} produits
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Disponible maintenant
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
