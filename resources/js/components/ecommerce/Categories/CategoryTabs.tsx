/* eslint-disable react-hooks/set-state-in-effect */
// resources/js/components/ecommerce/Categories/CategoryTabs.tsx
import { Link } from '@inertiajs/react';
import type { Variants } from 'framer-motion';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Package } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import ProductCardCompact from '@/components/ecommerce/products/ProductCardCompact';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Category, Product } from '@/types/ecommerce/products';

interface CategoryTabsProps {
    categories: Category[];
    productsByCategory: Record<
        string,
        { category: Category; products: Product[] }
    >;
}

export default function CategoryTabs({
    categories,
    productsByCategory,
}: CategoryTabsProps) {
    // Filtrer les catégories qui ont des produits en stock
    const filteredCategories = useMemo(
        () =>
            categories.filter((cat) => {
                const products = productsByCategory[cat.slug]?.products ?? [];

                return products.some((product) => {
                    const inStock = (product.quantite_stock ?? product.stock_disponible ?? 0) > 0;

                    return inStock;
                });
            }),
        [categories, productsByCategory],
    );

    // Gérer la sélection de l'onglet actif
    const [activeTab, setActiveTab] = useState<string>(
        () => filteredCategories[0]?.slug ?? '',
    );

    // S'assurer que l'onglet actif fait toujours partie des catégories filtrées
    useEffect(() => {
        if (
            !filteredCategories.some((c) => c.slug === activeTab) &&
            filteredCategories.length > 0
        ) {
            setActiveTab(filteredCategories[0].slug);
        }
    }, [filteredCategories, activeTab]);

    const activeCategory = useMemo(
        () => categories.find((cat) => cat.slug === activeTab),
        [activeTab, categories],
    );

    const activeProducts = useMemo(() => {
        const products = productsByCategory[activeTab]?.products ?? [];

        return products.filter((product) => {
            const inStock = (product.quantite_stock ?? product.stock_disponible ?? 0) > 0;

            return inStock;
        });
    }, [activeTab, productsByCategory]);

    // Si aucune catégorie n'a de produits, ne rien afficher (ou un message global)
    if (filteredCategories.length === 0) {
        return (
            <section className="py-16 lg:py-24">
                <div className="mx-auto max-w-4xl px-4 text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-900">
                        <Package className="h-10 w-10 text-slate-400" />
                    </div>
                    <h3 className="mt-6 text-xl font-semibold text-slate-900 dark:text-white">
                        Aucune catégorie disponible
                    </h3>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Revenez bientôt, de nouveaux produits arrivent !
                    </p>
                </div>
            </section>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
            },
        },
        exit: {
            opacity: 0,
            transition: { duration: 0.2 },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 300, damping: 24 },
        },
    };

    return (
        <section className="relative overflow-hidden bg-linear-to-b from-slate-50/50 via-white to-slate-50/30 py-16 lg:py-24 dark:from-slate-950/50 dark:via-gray-950 dark:to-slate-950/30">
            {/* Background Decorations */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] h-125 w-125 rounded-full bg-emerald-500/5 blur-[120px] dark:bg-emerald-500/10" />
                <div className="absolute top-[20%] right-[-10%] h-100 w-100 rounded-full bg-teal-500/5 blur-[100px] dark:bg-teal-500/10" />
            </div>

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="font-heading text-3xl font-bold tracking-tight text-slate-900 md:text-4xl dark:text-white"
                    >
                        Acheter par catégorie
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="mx-auto mt-4 max-w-2xl text-base text-slate-600 dark:text-slate-400"
                    >
                        Explorez nos collections soigneusement sélectionnées
                    </motion.p>
                </div>

                {/* Onglets modernes avec Glassmorphism */}
                <div className="relative mb-12">
                    <div className="no-scrollbar flex w-full max-w-full justify-start overflow-x-auto px-4 pb-4 sm:justify-center sm:px-0">
                        <div className="flex w-max gap-2 rounded-full border border-slate-200/50 bg-white/60 p-1.5 shadow-sm backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/60">
                            {filteredCategories.map((category) => {
                                const isActive = activeTab === category.slug;

                                return (
                                    <button
                                        key={category.id}
                                        onClick={() => setActiveTab(category.slug)}
                                        className="relative flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-colors sm:px-6"
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeCategoryTab"
                                                className="absolute inset-0 rounded-full bg-slate-900 shadow-md dark:bg-white"
                                                initial={false}
                                                transition={{
                                                    type: 'spring',
                                                    stiffness: 400,
                                                    damping: 30,
                                                }}
                                            />
                                        )}

                                        <span
                                            className={cn(
                                                'relative z-10 whitespace-nowrap transition-colors duration-200',
                                                isActive
                                                    ? 'text-white dark:text-slate-900'
                                                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white',
                                            )}
                                        >
                                            {category.nom}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Produits ou état vide */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        exit="exit"
                        className="w-full"
                    >
                        {activeProducts.length > 0 ? (
                            <>
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-6">
                                    {activeProducts.slice(0, 12).map((product) => (
                                        <motion.div key={product.id} variants={itemVariants} className="h-full">
                                            <ProductCardCompact product={product} />
                                        </motion.div>
                                    ))}
                                </div>

                                {activeProducts.length > 12 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        className="mt-12 text-center"
                                    >
                                        <Button variant="outline" className="rounded-full px-8 hover:bg-slate-50 dark:hover:bg-slate-900" asChild>
                                            <Link href={activeCategory?.url || route('tenant.product.index')}>
                                                Voir toute la collection
                                                <ChevronRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </motion.div>
                                )}
                            </>
                        ) : (
                            <motion.div
                                variants={itemVariants}
                                className="flex min-h-75 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200/50 bg-white/40 p-8 backdrop-blur-sm dark:border-slate-800/50 dark:bg-slate-900/40"
                            >
                                <motion.div
                                    animate={{
                                        scale: [1, 1.05, 1],
                                        rotate: [0, 2, -2, 0],
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 5,
                                        ease: 'easeInOut',
                                    }}
                                    className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 shadow-inner dark:bg-slate-800"
                                >
                                    <Package className="h-10 w-10 text-slate-400" />
                                </motion.div>

                                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                                    Aucun produit disponible
                                </h3>
                                <p className="mt-2 max-w-md text-center text-sm text-slate-500 dark:text-slate-400">
                                    Les produits de cette catégorie sont actuellement en rupture de stock.
                                    Découvrez nos autres collections en attendant.
                                </p>

                                <Button
                                    variant="outline"
                                    className="mt-8 rounded-full"
                                    asChild
                                >
                                    <Link href={route('tenant.product.index')}>
                                        Voir tous les produits
                                    </Link>
                                </Button>
                            </motion.div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}
