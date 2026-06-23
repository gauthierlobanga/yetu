// resources/js/components/ecommerce/products/FeaturedProducts.tsx
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { PackageSearch, Loader2, ShoppingCart, Heart, Star } from 'lucide-react';
import { useRef, useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/ecommerce/use-cart';
import { useWishlist } from '@/hooks/ecommerce/use-wishlist';
import { handleImageFallback, resolveImageUrl } from '@/lib/media';
import { getToastStyles } from '@/lib/toast-style';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/ecommerce/products';

interface FeaturedProductsProps {
    products?: Product[];
    loadMore?: () => void;
    hasMore?: boolean;
}

function formatCurrency(amount: number, currency = 'CDF'): string {
    return new Intl.NumberFormat('fr-CD', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
    }).format(amount);
}

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }, (_, i) => (
                <Star
                    key={i}
                    className={cn(
                        "h-3.5 w-3.5",
                        i < Math.floor(rating)
                            ? "fill-amber-400 text-amber-400"
                            : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"
                    )}
                />
            ))}
        </div>
    );
}

function FeaturedProductCard({ product }: { product: Product }) {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const isWishlisted = isInWishlist(product.id);
    const rating = Number(product.note_moyenne) || 0;
    
    // Fix out-of-stock check
    const inStock = (product.quantite_stock ?? product.stock_disponible ?? 0) > 0;
    
    const currentPrice = product.prix_actuel ?? product.prix_ttc;
    const oldPrice = product.est_en_promotion && product.prix_ttc > currentPrice ? product.prix_ttc : null;
    const discount = oldPrice ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100) : (product.reduction_pourcentage || 0);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (inStock) {
            addToCart(product.id, 1);
            toast.success('Ajouté au panier', { style: getToastStyles() });
        }
    };

    const handleToggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product.id);
    };

    return (
        <div className="group relative overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-800 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ring-1 ring-slate-200/50 dark:ring-slate-700/50">
            <Link href={product.url || '#'} className="block relative aspect-square">
                {/* Image */}
                <img
                    src={resolveImageUrl(product.image_principale)}
                    alt={product.nom}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    onError={handleImageFallback()}
                />

                {/* Gradient Overlay for text readability */}
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 via-slate-900/20 to-transparent transition-opacity duration-300 group-hover:from-slate-900/95" />

                {/* Badges */}
                <div className="absolute left-4 top-4 flex flex-col gap-2">
                    {product.badge && (
                        <Badge className="bg-white/90 px-2.5 py-1 text-xs font-semibold tracking-wide text-slate-900 shadow-xs backdrop-blur-md">
                            {product.badge}
                        </Badge>
                    )}
                    {discount > 0 && (
                        <Badge className="bg-rose-500/95 px-2.5 py-1 text-xs font-semibold tracking-wide text-white shadow-xs backdrop-blur-md">
                            -{discount}%
                        </Badge>
                    )}
                    {!inStock && (
                        <Badge variant="destructive" className="bg-red-500/95 px-2.5 py-1 text-xs font-semibold tracking-wide text-white shadow-xs backdrop-blur-md">
                            Rupture
                        </Badge>
                    )}
                </div>

                {/* Wishlist Button */}
                <button
                    onClick={handleToggleWishlist}
                    className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/20 text-white shadow-sm backdrop-blur-md transition-all hover:bg-white hover:text-rose-500 hover:scale-110"
                >
                    <Heart className={cn("h-4 w-4 transition-colors", isWishlisted && "fill-rose-500 text-rose-500")} />
                </button>

                {/* Content at Bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col justify-end">
                    <div className="mb-2 flex items-center gap-1.5 opacity-0 -translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                        <StarRating rating={rating} />
                        <span className="text-xs font-medium text-slate-300">
                            {rating.toFixed(1)}
                        </span>
                    </div>

                    <h3 className="line-clamp-2 text-base sm:text-lg font-semibold leading-snug text-white mb-3 transition-colors group-hover:text-emerald-400">
                        {product.nom}
                    </h3>

                    <div className="flex items-end justify-between">
                        <div className="flex flex-col">
                            {oldPrice && (
                                <span className="text-xs text-slate-400 line-through">
                                    {formatCurrency(oldPrice)}
                                </span>
                            )}
                            <span className="text-xl font-bold tracking-tight text-white">
                                {formatCurrency(currentPrice)}
                            </span>
                        </div>

                        {/* Animated Cart Button inside the image */}
                        <Button
                            onClick={handleAddToCart}
                            disabled={!inStock}
                            className={cn(
                                "group/cart-btn relative flex h-10 w-10 shrink-0 items-center justify-start overflow-hidden rounded-full transition-all duration-300 ease-out shadow-lg",
                                inStock 
                                    ? "bg-emerald-500 text-white hover:w-[110px] hover:bg-emerald-400"
                                    : "bg-slate-600/80 text-slate-300 cursor-not-allowed"
                            )}
                        >
                            <div className="absolute left-0 flex h-10 w-10 items-center justify-center">
                                <ShoppingCart className="h-4 w-4 transition-transform duration-300 group-hover/cart-btn:scale-110" />
                            </div>
                            <span className="ml-10 whitespace-nowrap pr-3 text-xs font-bold opacity-0 transition-opacity duration-300 group-hover/cart-btn:opacity-100">
                                Ajouter
                            </span>
                        </Button>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default function FeaturedProducts({
    products = [],
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
                loadMore();
                setTimeout(() => setIsLoading(false), 500);
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
        <section className="py-16 lg:py-24 overflow-hidden relative">
            {/* Background elements for premium feel */}
            <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent" />
            <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[120px] w-[800px] h-[400px] dark:bg-emerald-500/5" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
                <header className="mb-12 flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/50 bg-emerald-50/50 px-4 py-1.5 text-sm font-semibold tracking-wide text-emerald-700 backdrop-blur-sm dark:border-emerald-800/50 dark:bg-emerald-900/20 dark:text-emerald-400">
                            <PackageSearch className="h-4 w-4" /> Sélection
                        </span>
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white"
                    >
                        Nos produits phares
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="mt-4 max-w-2xl text-lg text-slate-500 dark:text-slate-400"
                    >
                        Découvrez notre sélection de produits d'exception, soigneusement choisis pour vous offrir la meilleure expérience.
                    </motion.p>
                </header>

                {products.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex min-h-[400px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center backdrop-blur dark:border-slate-800 dark:bg-slate-900/30"
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
                            className="mb-6 rounded-full bg-emerald-100 p-5 text-emerald-600 shadow-inner dark:bg-emerald-900/30 dark:text-emerald-400"
                        >
                            <PackageSearch className="h-12 w-12" />
                        </motion.div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Aucun produit mis en avant
                        </h3>
                        <p className="mt-3 max-w-md text-slate-500 dark:text-slate-400 text-lg">
                            Nos produits phares seront bientôt disponibles.
                            Explorez notre catalogue complet pour ne rien manquer.
                        </p>
                        <Button asChild className="mt-8 rounded-full h-12 px-8 text-base shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                            <Link href={route('tenant.product.index')}>
                                Découvrir tous les produits
                            </Link>
                        </Button>
                    </motion.div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {products.map((product) => (
                                <FeaturedProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>

                        {hasMore && (
                            <div
                                ref={sentinelRef}
                                className="mt-12 flex justify-center pb-8"
                            >
                                {isLoading && (
                                    <div className="rounded-full bg-white p-3 shadow-md dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                        <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}
