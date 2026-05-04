// resources/js/Pages/Shop/Categories/Index.tsx
import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    Package,
    Sparkles,
    ShoppingBag,
    Grid3X3,
    Tag,
    Store,
} from 'lucide-react';
import { useState } from 'react';
import MainLayout from '@/layouts/main-layout';
import type { Category } from '@/types/ecommerce/products';

interface PageProps {
    categories: Category[];
}

export default function CategoriesIndex() {
    const { props } = usePage<PageProps>();
    const { categories } = props;
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

    return (
        <MainLayout>
            <Head title="Toutes les catégories" />

            {/* Hero Section épurée */}
            <section className="relative overflow-hidden bg-linear-to-b from-emerald-50/50 via-white to-white py-14 md:py-20 dark:from-emerald-950/20 dark:via-gray-950 dark:to-gray-950">
                {/* Formes décoratives statiques */}
                <div className="pointer-events-none absolute -top-20 -right-20 h-96 w-96 rounded-full bg-emerald-100/20 blur-3xl dark:bg-emerald-900/10" />
                <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-slate-100/30 blur-3xl dark:bg-slate-800/10" />

                <div className="relative mx-auto max-w-7xl px-4 text-center">
                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <Grid3X3 className="h-4 w-4" />
                        {categories.length} catégorie
                        {categories.length > 1 ? 's' : ''} disponible
                        {categories.length > 1 ? 's' : ''}
                    </span>
                    <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                        Explorez nos{' '}
                        <span className="bg-linear-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent dark:from-emerald-400 dark:to-emerald-600">
                            univers
                        </span>
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                        Chaque catégorie a été pensée pour vous offrir une
                        expérience unique. Laissez-vous guider.
                    </p>
                </div>
            </section>

            {/* Grille de catégories */}
            <section className="py-16">
                <div className="mx-auto max-w-7xl px-4">
                    {categories.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                            {categories.map((category, index) => (
                                <motion.div
                                    key={category.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        delay: index * 0.03,
                                        duration: 0.3,
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
                                        className="group relative flex h-full flex-col overflow-hidden rounded-xl border bg-card transition-colors hover:border-emerald-200 dark:hover:border-emerald-800"
                                    >
                                        {/* Image */}
                                        <div className="relative aspect-square overflow-hidden">
                                            <img
                                                src={
                                                    category.image ||
                                                    '/images/placeholder-category.jpg'
                                                }
                                                alt={category.nom}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                                            {/* Badge nombre de produits */}
                                            <div className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-900 backdrop-blur-sm dark:bg-gray-900/90 dark:text-white">
                                                {category.products_count ?? 0}{' '}
                                                produit
                                                {(category.products_count ??
                                                    0) > 1
                                                    ? 's'
                                                    : ''}
                                            </div>
                                        </div>

                                        {/* Contenu textuel */}
                                        <div className="p-4">
                                            <h3 className="text-sm font-semibold text-foreground transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                                                {category.nom}
                                            </h3>
                                            {category.description && (
                                                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                                                    {category.description}
                                                </p>
                                            )}
                                        </div>

                                        {/* Overlay de survol */}
                                        <div
                                            className={`absolute inset-0 flex items-center justify-center bg-emerald-500/10 backdrop-blur-[1px] transition-opacity duration-300 ${
                                                hoveredCategory ===
                                                category.slug
                                                    ? 'opacity-100'
                                                    : 'opacity-0'
                                            }`}
                                        >
                                            <span className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm dark:bg-gray-900 dark:text-emerald-400">
                                                <Tag className="h-4 w-4" />
                                                Explorer
                                            </span>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="flex min-h-75 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center"
                        >
                            <div className="mb-4 rounded-full bg-emerald-100 p-4 dark:bg-emerald-900/30">
                                <Store className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-foreground">
                                Aucune catégorie pour le moment
                            </h2>
                            <p className="mt-2 max-w-md text-muted-foreground">
                                Notre collection de catégories est en cours de
                                préparation. Revenez bientôt !
                            </p>
                            <div className="mt-6 flex flex-wrap justify-center gap-3">
                                <Link
                                    href={route('tenant.product.index')}
                                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                                >
                                    <Sparkles className="h-4 w-4" />
                                    Voir tous les produits
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                                <Link
                                    href={route('home')}
                                    className="inline-flex items-center gap-2 rounded-xl border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
                                >
                                    <Package className="h-4 w-4" />
                                    Retour à l'accueil
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Section avantages */}
            <section className="border-t bg-muted/30 py-16">
                <div className="mx-auto max-w-7xl px-4 text-center">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">
                        Une navigation pensée pour vous
                    </h2>
                    <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
                        {[
                            {
                                icon: Grid3X3,
                                title: 'Catégories organisées',
                                desc: 'Trouvez facilement ce que vous cherchez grâce à notre arborescence claire.',
                            },
                            {
                                icon: ShoppingBag,
                                title: 'Produits exclusifs',
                                desc: 'Chaque catégorie propose une sélection unique de produits artisanaux.',
                            },
                            {
                                icon: Sparkles,
                                title: 'Nouveautés permanentes',
                                desc: 'De nouvelles catégories et produits ajoutés régulièrement.',
                            },
                        ].map(({ icon: Icon, title, desc }) => (
                            <div
                                key={title}
                                className="flex flex-col items-center gap-3"
                            >
                                <div className="rounded-full bg-emerald-100 p-4 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                    <Icon className="h-8 w-8" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground">
                                    {title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
