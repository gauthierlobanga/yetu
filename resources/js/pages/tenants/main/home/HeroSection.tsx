import { useGSAP } from '@gsap/react';
import { Link } from '@inertiajs/react';
import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import type { Category } from '@/types/tenants/products';

interface HeroSectionProps {
    categories: Category[];
}

export default function HeroSection({ categories }: HeroSectionProps) {
    const containerRef = useRef(null);

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
            {/* Background premium */}
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-white to-primary/5 dark:from-primary/10 dark:to-primary/10" />

            {/* Glow effects */}
            <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -right-40 -bottom-40 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />

            {/* Grid subtle */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,black_1px,transparent_0)] bg-size-[40px_40px] opacity-[0.03]" />

            <div className="relative mx-auto max-w-7xl px-4">
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    {/* LEFT CONTENT */}
                    <div className="space-y-8">
                        {/* Badge */}
                        <div className="hero-badge inline-flex items-center rounded-full border bg-white/60 px-4 py-1 text-sm backdrop-blur dark:bg-white/5">
                            ✨ Nouvelle collection 2025
                        </div>

                        {/* Title */}
                        <h1 className="hero-title text-4xl leading-tight font-bold md:text-5xl lg:text-6xl">
                            Découvrez la nouvelle
                            <span className="block bg-linear-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
                                collection Premium
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="hero-subtitle max-w-lg text-lg text-muted-foreground md:text-xl">
                            Des produits sélectionnés avec soin pour vous offrir
                            une expérience unique. Livraison rapide et garantie.
                        </p>

                        {/* CTA */}
                        <div className="hero-cta flex flex-wrap gap-4">
                            <Button
                                size="lg"
                                className="group relative overflow-hidden"
                                asChild
                            >
                                <Link href={route('tenant.products.index')}>
                                    <span className="relative z-10 flex items-center">
                                        Acheter maintenant
                                        <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
                                    </span>

                                    {/* Glow hover */}
                                    <span className="absolute inset-0 bg-linear-to-r from-primary to-primary-foreground opacity-0 transition group-hover:opacity-100" />
                                </Link>
                            </Button>

                            <Button
                                size="lg"
                                variant="outline"
                                className="p-4 backdrop-blur"
                                asChild
                            >
                                <Link href={route('tenant.categories.index')}>
                                    Explorer nos catégories
                                </Link>
                            </Button>
                        </div>

                        {/* Categories */}
                        <div className="hero-categories flex flex-wrap gap-2 pt-6">
                            {categories.slice(0, 5).map((cat) => (
                                <Link
                                    key={cat.id}
                                    href={cat.url}
                                    className="group rounded-full border bg-white/60 px-4 py-2 text-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-primary/10 dark:bg-white/5"
                                >
                                    <span className="transition group-hover:text-primary">
                                        {cat.nom}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT IMAGE */}
                    <div className="hero-image relative hidden lg:block">
                        <div className="relative mx-auto w-full max-w-lg">
                            {/* Glow */}
                            <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-primary/30 to-primary-foreground/30 blur-2xl" />

                            {/* Image */}
                            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                                {/* <img
                                    src={`${import.meta.env.VITE_APP_URL}/images/shopping-basket.jpg`}
                                    alt="Collection"
                                    className="h-full w-full object-cover transition duration-700 hover:scale-105"
                                /> */}
                            </div>

                            {/* Floating card */}
                            <div className="absolute -bottom-6 -left-6 rounded-xl bg-white/80 p-4 shadow-lg backdrop-blur dark:bg-white/10">
                                <p className="text-sm font-semibold">
                                    🔥 +120 produits
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
