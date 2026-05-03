// resources/js/Pages/Shop/Categories/Index.tsx
import { Head, Link, usePage } from '@inertiajs/react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
    ArrowRight,
    Package,
    Search,
    Sparkles,
    ShoppingBag,
    Grid3X3,
    Tag,
} from 'lucide-react';
import { useRef, useState } from 'react';
import MainLayout from '@/layouts/main-layout';
import { home } from '@/routes';
import type { PageProps, Category } from '@/types/ecommerce/products';

interface Props extends PageProps {
    categories: Category[];
}

export default function CategoriesIndex() {
    const { props } = usePage<Props>();
    const { categories } = props;
    const headerRef = useRef(null);
    const isHeaderInView = useInView(headerRef, { once: true });
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

    return (
        <MainLayout>
            <Head title="Toutes les catégories" />

            {/* Hero Section améliorée */}
            <section className="relative overflow-hidden bg-linear-to-br from-primary/5 via-background to-secondary/5 py-14 md:py-18">
                {/* Cercles décoratifs animés */}
                <motion.div
                    className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
                <motion.div
                    className="absolute -bottom-32 -left-32 h-128 w-lg rounded-full bg-secondary/5 blur-3xl"
                    animate={{ scale: [1, 1.1, 1], rotate: [0, -10, 0] }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

                <div className="relative mx-auto max-w-7xl px-4 text-center">
                    <motion.div
                        ref={headerRef}
                        initial={{ opacity: 0, y: 30 }}
                        animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
                            <Grid3X3 className="h-4 w-4" />
                            {categories.length} catégories disponibles
                        </span>
                        <h1 className="mt-6 font-heading text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
                            Explorez nos{' '}
                            <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                                univers
                            </span>
                        </h1>
                        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                            Chaque catégorie a été pensée pour vous offrir une
                            expérience unique. Laissez-vous guider.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Grille de catégories */}
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
                                        delay: index * 0.02,
                                        duration: 0.4,
                                    }}
                                    onMouseEnter={() =>
                                        setHoveredCategory(category.slug)
                                    }
                                    onMouseLeave={() =>
                                        setHoveredCategory(null)
                                    }
                                >
                                    <Link
                                        href={category.url}
                                        className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-card shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                                    >
                                        {/* Image avec effet parallaxe */}
                                        <div className="relative aspect-square overflow-hidden">
                                            <img
                                                src={
                                                    category.image ||
                                                    '/storage/images/getting-business.jpg'
                                                }
                                                alt={category.nom}
                                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

                                            {/* Badge nombre de produits */}
                                            <div className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-900 shadow backdrop-blur-sm">
                                                {category.products_count ?? 0}
                                            </div>
                                        </div>

                                        {/* Contenu textuel */}
                                        <div className="absolute right-0 bottom-0 left-0 p-4">
                                            <h3 className="text-lg font-bold text-white drop-shadow-md">
                                                {category.nom}
                                            </h3>
                                            <p className="mt-1 line-clamp-2 text-xs text-white/70">
                                                {category.description ||
                                                    'Découvrez notre sélection'}
                                            </p>
                                        </div>

                                        {/* Overlay de survol amélioré */}
                                        <motion.div
                                            className="absolute inset-0 flex items-center justify-center bg-primary/20 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100"
                                            initial={false}
                                            animate={{
                                                opacity:
                                                    hoveredCategory ===
                                                    category.slug
                                                        ? 1
                                                        : 0,
                                            }}
                                        >
                                            <motion.span
                                                initial={{ scale: 0.8 }}
                                                animate={{
                                                    scale:
                                                        hoveredCategory ===
                                                        category.slug
                                                            ? 1
                                                            : 0.8,
                                                }}
                                                className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-primary shadow-xl"
                                            >
                                                <Tag className="h-4 w-4" />
                                                Explorer
                                            </motion.span>
                                        </motion.div>
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
                                    href={route('product.index')}
                                    className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
                                >
                                    <Sparkles className="h-4 w-4" />
                                    Voir tous les produits
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                                <Link
                                    href={home()}
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

            {/* Section « Pourquoi choisir nos catégories » */}
            <section className="border-t border-border/50 bg-muted/30 py-16">
                <div className="mx-auto max-w-7xl px-4 text-center">
                    <h2 className="text-3xl font-bold tracking-tight">
                        Une navigation pensée pour vous
                    </h2>
                    <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
                        <div className="flex flex-col items-center gap-3">
                            <div className="rounded-full bg-primary/10 p-4 text-primary">
                                <Grid3X3 className="h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-semibold">
                                Catégories organisées
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Trouvez facilement ce que vous cherchez grâce à
                                notre arborescence claire.
                            </p>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            <div className="rounded-full bg-primary/10 p-4 text-primary">
                                <ShoppingBag className="h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-semibold">
                                Produits exclusifs
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Chaque catégorie propose une sélection unique de
                                produits artisanaux.
                            </p>
                        </div>
                        <div className="flex flex-col items-center gap-3">
                            <div className="rounded-full bg-primary/10 p-4 text-primary">
                                <Sparkles className="h-8 w-8" />
                            </div>
                            <h3 className="text-lg font-semibold">
                                Nouveautés permanentes
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                De nouvelles catégories et produits ajoutés
                                régulièrement.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
