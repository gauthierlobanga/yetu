// resources/js/components/ecommerce/products/FeaturedProducts.tsx
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { PackageSearch, Loader2 } from 'lucide-react';
import { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import type { Product } from '@/types/ecommerce/products';
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
    const [isLoading, setIsLoading] = useState(false);
    const sentinelRef = useRef<HTMLDivElement>(null);

    const handleIntersect = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const [entry] = entries;

            if (entry.isIntersecting && hasMore && !isLoading && loadMore) {
                setIsLoading(true);
                // On laisse loadMore gérer son propre état, on remet isLoading à false après un court délai
                loadMore();
                setTimeout(() => setIsLoading(false), 500); // évite les appels successifs trop rapides
            }
        },
        [hasMore, isLoading, loadMore],
    );

    useEffect(() => {
        const sentinel = sentinelRef.current;

        if (!sentinel || !hasMore) {
            return;
        }

        const observer = new IntersectionObserver(handleIntersect, {
            rootMargin: '200px',
        });
        observer.observe(sentinel);

        return () => observer.disconnect();
    }, [handleIntersect, hasMore]);

    return (
        <section className="py-12 lg:py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <header className="mb-8 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">
                        Nos produits phares
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                        Découvrez notre sélection de produits d'exception
                    </p>
                </header>

                {products.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-8 text-center"
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0],
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 4,
                                ease: 'easeInOut',
                            }}
                            className="mb-4 rounded-full bg-emerald-100 p-4 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                        >
                            <PackageSearch className="h-10 w-10" />
                        </motion.div>
                        <h3 className="text-xl font-semibold text-foreground">
                            Aucun produit mis en avant
                        </h3>
                        <p className="mt-2 max-w-md text-muted-foreground">
                            Nos produits phares seront bientôt disponibles.
                            Explorez notre catalogue complet pour ne rien
                            manquer.
                        </p>
                        <Button asChild className="mt-6 rounded-lg">
                            <Link href={route('tenant.product.index')}>
                                Découvrir tous les produits
                            </Link>
                        </Button>
                    </motion.div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                            {products.map((product) => (
                                <ProductCardCompact
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>

                        {hasMore && (
                            <div
                                ref={sentinelRef}
                                className="mt-8 flex justify-center"
                            >
                                {isLoading && (
                                    <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}
