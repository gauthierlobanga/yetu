/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/components/ecommerce/products/FeaturedProducts.tsx
import { Link } from '@inertiajs/react';
import { useInView, motion } from 'framer-motion';
import { PackageSearch } from 'lucide-react';
import { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import type { Product } from '@/types/tenants/products';
import ProductCardCompact from './ProductCardCompact';

interface FeaturedProductsProps {
    products: Product[];
    loadMore?: () => void;
    hasMore?: boolean;
}

export default function FeaturedProducts({
    products,
    loadMore,
    hasMore = false,
}: FeaturedProductsProps) {
    const loadMoreRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(loadMoreRef, { once: false, margin: '200px' });

    useEffect(() => {
        if (isInView && hasMore && loadMore) {
            loadMore();
        }
    }, [isInView, hasMore, loadMore]);

    return (
        <section className="py-12 lg:py-16">
            <div className="mx-auto max-w-480 px-3 sm:px-4 lg:px-6">
                <header className="mb-6 text-center">
                    <h2 className="font-heading text-2xl font-bold md:text-3xl">
                        Nos produits phares
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Découvrez notre sélection de produits d'exception
                    </p>
                </header>

                {products.length === 0 ? (
                    /* ÉTAT VIDE PREMIUM AVEC SVG ANIMÉ */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex min-h-75 flex-col items-center justify-center rounded-2xl border border-dashed border-border/50 bg-white/40 p-8 backdrop-blur-sm dark:bg-black/20"
                    >
                        {/* Illustration SVG animée */}
                        <motion.div
                            animate={{
                                rotate: [0, 10, -10, 0],
                                scale: [1, 1.05, 1],
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 5,
                                ease: 'easeInOut',
                            }}
                            className="mb-6"
                        >
                            <svg
                                width="100"
                                height="100"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="text-primary"
                            >
                                <motion.path
                                    d="M21 7V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V7M21 7L12 12L3 7M21 7L12 12M3 7L12 12M12 12V19"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{
                                        duration: 1.5,
                                        ease: 'easeInOut',
                                        repeat: Infinity,
                                        repeatType: 'loop',
                                    }}
                                />
                            </svg>
                        </motion.div>

                        <h3 className="text-xl font-semibold">
                            Aucun produit mis en avant
                        </h3>
                        <p className="mt-2 max-w-md text-center text-sm text-muted-foreground">
                            Nos produits phares seront bientôt disponibles.
                            Explorez notre catalogue complet pour ne rien
                            manquer.
                        </p>

                        <Button variant="outline" className="mt-6" asChild>
                            <Link href={route('tenant.products.index')}>
                                Découvrir tous les produits
                            </Link>
                        </Button>
                    </motion.div>
                ) : (
                    <>
                        {/* Grille à 6 colonnes sur écrans larges */}
                        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                            {products.map((product) => (
                                <ProductCardCompact
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>

                        {/* Trigger de chargement infini */}
                        {hasMore && (
                            <div
                                ref={loadMoreRef}
                                className="mt-8 flex justify-center"
                            >
                                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}
