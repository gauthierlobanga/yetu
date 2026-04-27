// resources/js/Pages/Shop/Categories/Index.tsx
import { Head, Link, usePage } from '@inertiajs/react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Package, Search, Sparkles } from 'lucide-react';
import { useRef } from 'react';
import MainLayout from '@/layouts/main-layout';
import type { PageProps, Category } from '@/types/ecommerce/products';

interface Props extends PageProps {
    categories: Category[];
}

export default function CategoriesIndex() {
    const { props } = usePage<Props>();
    const { categories } = props;
    const headerRef = useRef(null);
    const isHeaderInView = useInView(headerRef, { once: true });

    return (
        <MainLayout>
            <Head title="Toutes les catégories" />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-linear-to-br from-primary/5 via-background to-secondary/5 py-16 md:py-24">
                <div className="absolute top-0 -right-40 h-150 rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute -bottom-40 -left-40 h-150 rounded-full bg-secondary/5 blur-3xl" />

                <div className="relative mx-auto max-w-7xl px-4 text-center">
                    <motion.div
                        ref={headerRef}
                        initial={{ opacity: 0, y: 30 }}
                        animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
                            Explorez par catégorie
                        </span>
                        <h1 className="mt-6 font-heading text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                            Trouvez exactement{' '}
                            <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                                ce que vous cherchez
                            </span>
                        </h1>
                        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground md:text-lg">
                            Parcourez nos collections soigneusement organisées
                            pour découvrir des produits d'exception.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Section : Grille ou état vide */}
            <section className="py-16">
                <div className="mx-auto max-w-7xl px-4">
                    {categories.length > 0 ? (
                        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                            {categories.map((category, index) => (
                                <motion.div
                                    key={category.id}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-50px' }}
                                    transition={{
                                        delay: index * 0.03,
                                        duration: 0.5,
                                    }}
                                >
                                    <Link
                                        href={category.url}
                                        className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-card shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                                    >
                                        {/* Image avec zoom */}
                                        <div className="relative aspect-square overflow-hidden">
                                            <img
                                                src={
                                                    category.image ||
                                                    '/images/placeholder-category.jpg'
                                                }
                                                alt={category.nom}
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                                        </div>

                                        {/* Contenu */}
                                        <div className="absolute right-0 bottom-0 left-0 p-5">
                                            <h3 className="text-lg font-bold text-white drop-shadow-md">
                                                {category.nom}
                                            </h3>
                                            <div className="mt-2 flex items-center gap-1 text-sm text-white/80">
                                                <Package className="h-3.5 w-3.5" />
                                                <span>
                                                    {category.products_count ||
                                                        0}{' '}
                                                    produits
                                                </span>
                                            </div>
                                        </div>

                                        {/* Overlay de survol */}
                                        <div className="absolute inset-0 flex items-center justify-center bg-primary/15 opacity-0 backdrop-blur-sm transition-all duration-200 group-hover:opacity-100">
                                            <span className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-primary shadow-lg">
                                                Explorer
                                                <ArrowRight className="h-4 w-4" />
                                            </span>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="flex min-h-100 flex-col items-center justify-center rounded-3xl border border-dashed border-border/50 bg-white/40 p-8 backdrop-blur-sm dark:bg-black/20"
                        >
                            <motion.div
                                animate={{
                                    scale: [1, 1.05, 1],
                                    rotate: [0, 1, -1, 0],
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 4,
                                    ease: 'easeInOut',
                                }}
                                className="mb-6 rounded-full bg-primary/10 p-6"
                            >
                                <Search className="h-12 w-12 text-primary" />
                            </motion.div>

                            <h2 className="mb-2 text-2xl font-bold tracking-tight">
                                Aucune catégorie pour le moment
                            </h2>
                            <p className="mb-8 max-w-md text-center text-muted-foreground">
                                Notre collection de catégories est en cours de
                                préparation. Revenez bientôt ou explorez
                                directement tous nos produits disponibles.
                            </p>

                            <div className="flex flex-wrap justify-center gap-4">
                                <Link
                                    href={route('shop.products.index')}
                                    className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
                                >
                                    <Sparkles className="h-4 w-4" />
                                    Voir tous les produits
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                                <Link
                                    href="#" //{accueil()} <-- correction ici
                                    className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-white/50 px-6 py-3 font-medium text-foreground backdrop-blur-sm transition-all hover:bg-white hover:shadow-md dark:bg-black/30 dark:hover:bg-black/50"
                                >
                                    <Package className="h-4 w-4" />
                                    Retour à l'accueil
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </div>
            </section>
        </MainLayout>
    );
}
