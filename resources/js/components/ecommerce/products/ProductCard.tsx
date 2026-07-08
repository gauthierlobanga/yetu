// resources/js/components/ecommerce/products/ProductCard.tsx
import { Link } from '@inertiajs/react';
import { motion } from 'motion/react';
import { Star, ShoppingCart, Heart, PackageOpen } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/ecommerce/use-cart';
import { useWishlist } from '@/hooks/ecommerce/use-wishlist';
import { handleImageFallback, resolveImageUrl } from '@/lib/media';
import type { Product } from '@/types/ecommerce/products';

interface ProductCardProps {
    product: Product;
    viewMode?: 'grid' | 'list';
}

/** Format devise */
function formatCurrency(amount: number, currency = 'CDF'): string {
    return new Intl.NumberFormat('fr-CD', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
    }).format(amount);
}

/** Étoiles */
function StarRating({
    rating,
    size = 'sm',
}: {
    rating: number;
    size?: 'sm' | 'md';
}) {
    const iconClass = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';

    return (
        <div className="flex items-center">
            {Array.from({ length: 5 }, (_, i) => (
                <Star
                    key={i}
                    className={`${iconClass} ${
                        i < Math.floor(rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700'
                    }`}
                />
            ))}
        </div>
    );
}

export default function ProductCard({
    product,
    viewMode = 'grid',
}: ProductCardProps) {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

     if (!product) {
        return null;
    } // sécurité

    const isWishlisted = isInWishlist(product.id);
    const note = Number(product.note_moyenne) || 0;
    const sold = Number(product.sold_count) || 0;
    const oldPrice = product.est_en_promotion ? product.prix_ttc : null;
    const currentPrice = product.prix_actuel ?? product.prix_ttc;
    const discountPercent = oldPrice
        ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100)
        : (product.reduction_pourcentage ?? null);
    const outOfStock = (product.quantite_stock ?? 1) <= 0;

    const formatSoldCount = (count: number) =>
        count >= 1000
            ? `${Math.floor(count / 1000)}k+ vendus`
            : `${count} vendu${count > 1 ? 's' : ''}`;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product.id, 1);
        toast.success('Ajouté au panier');
    };

    const handleToggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product.id);
    };

    // ──────── MODE LISTE ────────
    if (viewMode === 'list') {
        return (
            <motion.div
                whileHover={{ y: -2 }}
                className="group flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md sm:flex-row dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-emerald-700"
            >
                {/* Image */}
                <Link href={product.url} className="block shrink-0 sm:w-48">
                    <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-100 sm:aspect-auto sm:h-40 dark:bg-slate-800">
                        <img
                            src={resolveImageUrl(product.image_principale)}
                            alt={product.nom}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                            onError={handleImageFallback()}
                        />
                        {outOfStock && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                                <Badge variant="destructive" className="gap-1">
                                    <PackageOpen className="h-3.5 w-3.5" />{' '}
                                    Rupture
                                </Badge>
                            </div>
                        )}
                    </div>
                </Link>

                {/* Détails */}
                <div className="min-w-0 flex-1 space-y-2">
                    <Link href={product.url} className="block">
                        <h3 className="line-clamp-2 text-base font-semibold text-slate-800 hover:text-emerald-600 dark:text-slate-100 dark:hover:text-emerald-400">
                            {product.nom}
                        </h3>
                    </Link>

                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xl font-bold text-slate-900 dark:text-white">
                            {formatCurrency(currentPrice)}
                        </span>
                        {oldPrice && (
                            <>
                                <span className="text-sm text-slate-400 line-through">
                                    {formatCurrency(oldPrice)}
                                </span>
                                {discountPercent && (
                                    <Badge className="bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">
                                        -{discountPercent}%
                                    </Badge>
                                )}
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <StarRating rating={note} size="md" />
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                            {note.toFixed(1)}
                        </span>
                        <span>·</span>
                        <span>{formatSoldCount(sold)}</span>
                    </div>

                    {product.badge && (
                        <Badge variant="secondary" className="text-xs">
                            {product.badge}
                        </Badge>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 sm:w-32 sm:flex-col">
                    <Button
                        onClick={handleAddToCart}
                        size="sm"
                        className="gap-2"
                        disabled={outOfStock}
                    >
                        <ShoppingCart className="h-4 w-4" />
                        Panier
                    </Button>
                    <Button
                        variant={isWishlisted ? 'default' : 'outline'}
                        size="sm"
                        className="gap-2"
                        onClick={handleToggleWishlist}
                    >
                        <Heart
                            className={`h-4 w-4 ${isWishlisted ? 'fill-white' : ''}`}
                        />
                        <span className="sm:hidden">Favoris</span>
                    </Button>
                </div>
            </motion.div>
        );
    }

    // ──────── MODE GRILLE ────────
    return (
        <div className="group relative overflow-hidden rounded-sm bg-slate-100 dark:bg-slate-800 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ring-1 ring-slate-200/50 dark:ring-slate-700/50">
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
                    {discountPercent !== null && discountPercent > 0 && (
                        <Badge className="bg-rose-500/95 px-2.5 py-1 text-xs font-semibold tracking-wide text-white shadow-xs backdrop-blur-md">
                            -{discountPercent}%
                        </Badge>
                    )}
                    {outOfStock && (
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
                    <Heart className={`h-4 w-4 transition-colors ${isWishlisted ? "fill-rose-500 text-rose-500" : ""}`} />
                </button>

                {/* Content at Bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col justify-end">
                    <div className="mb-2 flex items-center gap-1.5 opacity-0 -translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                        <StarRating rating={note} />
                        <span className="text-xs font-medium text-slate-300">
                            {note.toFixed(1)}
                        </span>
                        <span className="mx-1 text-slate-500">•</span>
                        <span className="text-xs text-slate-400">{formatSoldCount(sold)}</span>
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
                            disabled={outOfStock}
                            className={`group/cart-btn relative flex h-10 w-10 shrink-0 items-center justify-start overflow-hidden rounded-full transition-all duration-300 ease-out shadow-lg ${!outOfStock ? "bg-emerald-500 text-white hover:w-27.5 hover:bg-emerald-400" : "bg-slate-600/80 text-slate-300 cursor-not-allowed"}`}
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
