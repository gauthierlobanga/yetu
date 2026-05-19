import { useGSAP } from '@gsap/react';
import { Link, usePage } from '@inertiajs/react';
import { motion, useAnimation, useInView } from 'framer-motion';
import gsap from 'gsap';
import { ArrowRight, Flame, Sparkles, Star, Truck } from 'lucide-react';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import type { Category } from '@/types/ecommerce/products';

interface HeroSectionProps {
    categories: Category[];
}

export default function HeroSection({ categories }: HeroSectionProps) {
    const containerRef = useRef(null);
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

    const { productsCount } = usePage<{ productsCount: number }>().props;
    useGSAP(
        () => {
            if (!isInView) {
                return;
            }

            const tl = gsap.timeline();

            tl.from('.hero-badge', {
                y: 30,
                opacity: 0,
                duration: 0.7,
                ease: 'power3.out',
            })
                .from('.hero-title', {
                    y: 60,
                    opacity: 0,
                    duration: 0.9,
                    ease: 'power4.out',
                })
                .from(
                    '.hero-subtitle',
                    {
                        y: 40,
                        opacity: 0,
                        duration: 0.8,
                    },
                    '-=0.5',
                )
                .from(
                    '.hero-cta',
                    {
                        y: 30,
                        opacity: 0,
                        duration: 0.7,
                        stagger: 0.1,
                    },
                    '-=0.4',
                )
                .from(
                    '.hero-categories',
                    {
                        y: 20,
                        opacity: 0,
                        duration: 0.5,
                        stagger: 0.05,
                    },
                    '-=0.3',
                )
                .from(
                    '.hero-image',
                    {
                        scale: 0.85,
                        opacity: 0,
                        duration: 1.2,
                        ease: 'power3.out',
                    },
                    '-=0.7',
                )
                .from(
                    '.floating-card',
                    {
                        x: 20,
                        opacity: 0,
                        duration: 0.6,
                        ease: 'back.out(1.4)',
                    },
                    '-=0.8',
                );
        },
        { scope: containerRef, dependencies: [isInView] },
    );

    return (
        <section
            ref={containerRef}
            className="relative overflow-hidden bg-white dark:bg-slate-950"
        >
            {/* Arrière‑plan animé avec des blobs */}
            <div className="absolute inset-0 z-0">
                <motion.div
                    animate={{ x: [0, 20, -10, 0], y: [0, 15, -15, 0] }}
                    transition={{
                        repeat: Infinity,
                        duration: 25,
                        ease: 'linear',
                    }}
                    className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-400/10"
                />
                <motion.div
                    animate={{ x: [0, -30, 20, 0], y: [0, -20, 30, 0] }}
                    transition={{
                        repeat: Infinity,
                        duration: 30,
                        ease: 'linear',
                    }}
                    className="absolute top-1/3 -right-40 h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-400/10"
                />
                <motion.div
                    animate={{ x: [0, 10, -20, 0], y: [0, -10, 10, 0] }}
                    transition={{
                        repeat: Infinity,
                        duration: 20,
                        ease: 'linear',
                    }}
                    className="absolute bottom-0 left-1/2 h-[300px] w-[300px] rounded-full bg-amber-500/5 blur-3xl dark:bg-amber-400/5"
                />
            </div>

            {/* Grille subtile pour la texture */}
            <div className="absolute inset-0 z-[1] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjY2NjY2NjMjAiLz48L3N2Zz4=')] opacity-30 dark:opacity-20" />

            <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                    {/* Colonne gauche – Texte & CTA */}
                    <div className="space-y-8">
                        {/* Badge avec icône et animation */}
                        <div className="hero-badge inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50/80 px-4 py-1.5 text-sm font-medium text-emerald-800 backdrop-blur dark:border-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200">
                            <Sparkles className="mr-1.5 h-4 w-4 text-emerald-500" />
                            Nouvelle collection 2025
                        </div>

                        {/* Titre avec gradient animé */}
                        <h1 className="hero-title font-heading text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
                            <span className="block">Découvrez</span>
                            <span className="block bg-gradient-to-r from-emerald-600 via-violet-600 to-amber-500 bg-clip-text text-transparent dark:from-emerald-400 dark:via-violet-400 dark:to-amber-300">
                                l’exceptionnel
                            </span>
                        </h1>

                        {/* Sous‑titre */}
                        <p className="hero-subtitle max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                            Des pièces rares, sélectionnées pour leur caractère
                            unique. Livraison rapide et expérience premium.
                        </p>

                        {/* Boutons d’action */}
                        <div className="hero-cta flex flex-col gap-4 sm:flex-row">
                            <Button
                                asChild
                                size="lg"
                                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-8 py-6 text-base font-semibold text-white shadow-lg shadow-emerald-200 transition-all hover:shadow-xl hover:shadow-emerald-300 dark:shadow-emerald-900/30 dark:hover:shadow-emerald-800/40"
                            >
                                <Link href={route('tenant.product.index')}>
                                    <span className="relative z-10 flex items-center gap-2">
                                        Acheter maintenant
                                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </span>
                                    {/* Effet de brillance au survol */}
                                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="rounded-xl border-slate-300 bg-white/80 px-8 py-6 text-base font-medium backdrop-blur transition-all hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-slate-700 dark:bg-slate-800/80 dark:hover:border-emerald-700 dark:hover:bg-emerald-900/30"
                            >
                                <Link
                                    href={route(
                                        'tenant.product.category.index',
                                    )}
                                >
                                    Explorer les catégories
                                </Link>
                            </Button>
                        </div>

                        {/* Catégories rapides */}
                        <div className="hero-categories flex flex-wrap gap-2 pt-4">
                            {categories.slice(0, 5).map((cat) => (
                                <Link
                                    key={cat.id}
                                    href={cat.url}
                                    className="group rounded-full border border-slate-200 bg-white/70 px-4 py-1.5 text-sm font-medium text-slate-700 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50/80 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300 dark:hover:border-emerald-700 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-300"
                                >
                                    {cat.nom}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Colonne droite – Image & carte flottante */}
                    <div className="hero-image relative hidden lg:block">
                        <div className="relative mx-auto max-w-md">
                            {/* Décoration : cercle flouté en fond */}
                            <div className="absolute inset-0 -z-10 scale-110 rounded-3xl bg-gradient-to-br from-emerald-300/30 via-violet-300/20 to-amber-300/20 blur-3xl dark:from-emerald-600/20 dark:via-violet-600/20 dark:to-amber-600/20" />

                            {/* Image principale avec bordure soft */}
                            <div className="overflow-hidden rounded-3xl border border-white/40 shadow-2xl shadow-slate-300/30 backdrop-blur dark:border-slate-700/50 dark:shadow-slate-900/50">
                                <motion.img
                                    src="storage/images/shopping-basket.jpg"
                                    alt="Collection premium"
                                    className="aspect-[4/5] w-full object-cover"
                                    whileHover={{ scale: 1.03 }}
                                    transition={{
                                        duration: 0.5,
                                        ease: 'easeOut',
                                    }}
                                />
                                {/* Overlay de dégradé pour l’ambiance */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                            </div>

                            {/* Carte flottante avec stats dynamiques */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={isInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ delay: 0.5, type: 'spring' }}
                                className="floating-card absolute -bottom-6 -left-6 rounded-2xl border border-white/60 bg-white/90 p-4 shadow-xl backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/90"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                                        <Flame className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-lg font-bold text-slate-900 dark:text-white">
                                            +{productsCount}{' '}
                                            <span className="text-sm font-normal text-slate-500">
                                                produits
                                            </span>
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Disponibles maintenant
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-3 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                                    <Star className="h-3 w-3 fill-current" />
                                    <Star className="h-3 w-3 fill-current" />
                                    <Star className="h-3 w-3 fill-current" />
                                    <Star className="h-3 w-3 fill-current" />
                                    <Star className="h-3 w-3 fill-current" />
                                    <span className="ml-1 font-medium">
                                        4.9/5
                                    </span>
                                </div>
                                <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                                    <Truck className="h-3 w-3" />
                                    Livraison express
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
