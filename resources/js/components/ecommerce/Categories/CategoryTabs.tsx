// resources/js/components/home/CategoryTabs.tsx
import { Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Package } from 'lucide-react';
import { useState } from 'react';
import ProductCardCompact from '@/components/ecommerce/products/ProductCardCompact';
import { Button } from '@/components/ui/button';
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
    const [activeTab, setActiveTab] = useState(categories[0]?.slug || '');

    const activeCategory = categories.find((cat) => cat.slug === activeTab);
    const activeProducts = productsByCategory[activeTab]?.products || [];

    return (
        <section className="py-12 lg:py-16">
            <div className="mx-auto max-w-480 px-4 sm:px-6 lg:px-8">
                <div className="mb-8 text-center">
                    <h2 className="font-heading text-2xl font-bold md:text-3xl">
                        Acheter par catégorie
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Explorez nos collections soigneusement sélectionnées
                    </p>
                </div>

                {/* Onglets modernes */}
                <div className="relative mb-10">
                    <div className="no-scrollbar flex w-full justify-center overflow-x-auto">
                        <div className="flex gap-2 rounded-full border bg-white/60 p-1 backdrop-blur dark:bg-white/5">
                            {categories.map((category) => {
                                const isActive = activeTab === category.slug;

                                return (
                                    <button
                                        key={category.id}
                                        onClick={() =>
                                            setActiveTab(category.slug)
                                        }
                                        className="relative cursor-pointer px-4 py-2 text-sm font-medium transition-all"
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 rounded-xs bg-linear-to-r from-orange-500 to-red-500 shadow-md"
                                                transition={{
                                                    type: 'spring',
                                                    stiffness: 300,
                                                    damping: 30,
                                                }}
                                            />
                                        )}

                                        <span
                                            className={`relative z-10 whitespace-nowrap ${
                                                isActive
                                                    ? 'text-white'
                                                    : 'text-muted-foreground hover:text-foreground'
                                            }`}
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
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeProducts.length > 0 ? (
                            <>
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                                    {activeProducts
                                        .slice(0, 12)
                                        .map((product) => (
                                            <ProductCardCompact
                                                key={product.id}
                                                product={product}
                                            />
                                        ))}
                                </div>

                                {activeProducts.length > 12 && (
                                    <div className="mt-8 text-center">
                                        <Button variant="outline" asChild>
                                            <Link
                                                href={
                                                    activeCategory?.url ||
                                                    route('shop.products.index')
                                                }
                                            >
                                                Voir toute la collection
                                                <ChevronRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="flex min-h-62.5 flex-col items-center justify-center rounded-2xl border border-dashed border-border/50 bg-white/40 p-8 backdrop-blur-sm dark:bg-black/20"
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
                                    className="mb-4 rounded-full bg-primary/10 p-4"
                                >
                                    <Package className="h-10 w-10 text-primary" />
                                </motion.div>

                                <h3 className="text-xl font-semibold">
                                    Aucun produit trouvé
                                </h3>
                                <p className="mt-2 max-w-md text-center text-sm text-muted-foreground">
                                    Aucun produit n’est disponible dans cette
                                    catégorie. Découvrez nos autres collections
                                    ou revenez bientôt.
                                </p>

                                <Button
                                    variant="outline"
                                    className="mt-6"
                                    asChild
                                >
                                    <Link href={route('shop.products.index')}>
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
