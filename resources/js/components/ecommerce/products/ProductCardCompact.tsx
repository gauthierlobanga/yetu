/* eslint-disable @typescript-eslint/no-unused-vars */

// resources/js/components/ecommerce/products/ProductCardCompact.tsx
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Heart,
    ShoppingBag,
    Star,
    Sparkles,
    Eye,
    PackageOpen,
    ShoppingCart,
} from 'lucide-react';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/ecommerce/use-cart';
import { useWishlist } from '@/hooks/ecommerce/use-wishlist';
import { handleImageFallback, resolveImageUrl } from '@/lib/media';
import { getToastStyles } from '@/lib/toast-style';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/ecommerce/products';

interface ProductCardCompactProps {
    product: Product;
    showDiscountBadge?: boolean;
}

function formatPrice(amount: number): string {
    return new Intl.NumberFormat('fr-CD', {
        style: 'currency',
        currency: 'CDF',
        maximumFractionDigits: 0,
    }).format(amount);
}

function compactNumber(value: number): string {
    if (value >= 1000) {
        return `${(value / 1000).toFixed(1).replace('.0', '')}k`;
    }

    return String(value);
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

/** Format devise */
function formatCurrency(amount: number, currency = 'CDF'): string {
    return new Intl.NumberFormat('fr-CD', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
    }).format(amount);
}

export default function ProductCardCompact({
    product,
    showDiscountBadge = false,
}: ProductCardCompactProps) {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    if (!product) {
        return null;
    } // sécurité

    const isWishlisted = isInWishlist(product.id);
    const rating = Number(product.note_moyenne) || 0;
    const sold = Number(product.sold_count) || 0;
    const outOfStock = (product.quantite_stock ?? 0) <= 0;

    const currentPrice = product.prix_actuel ?? product.prix_ttc;
    const oldPrice =
        product.est_en_promotion && product.prix_ttc > currentPrice
            ? product.prix_ttc
            : null;
    const discount = oldPrice
        ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100)
        : product.reduction_pourcentage || 0;

    const formatSoldCount = (count: number) =>
        count >= 1000
            ? `${Math.floor(count / 1000)}k+ vendus`
            : `${count} vendu${count > 1 ? 's' : ''}`;

    // const handleAddToCart = useCallback(
    //     (e: React.MouseEvent) => {
    //         e.preventDefault();
    //         e.stopPropagation();

    //         if (!outOfStock) {
    //             addToCart(product.id, 1);
    //         }
    //     },
    //     [outOfStock, product.id, addToCart],
    // );

    // const handleToggleWishlist = useCallback(
    //     (e: React.MouseEvent) => {
    //         e.preventDefault();
    //         e.stopPropagation();
    //         toggleWishlist(product.id);
    //     },
    //     [product.id, toggleWishlist],
    // );

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product.id, 1);
        toast.success('Ajouté au panier',{style:getToastStyles()});
    };

    const handleToggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product.id);
    };

    return (
        <div className="group relative overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-800 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ring-1 ring-slate-200/50 dark:ring-slate-700/50 h-full">
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
                <div className="absolute left-3 top-3 flex flex-col gap-2">
                    {product.badge && (
                        <Badge className="bg-white/90 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-slate-900 shadow-xs backdrop-blur-md">
                            {product.badge}
                        </Badge>
                    )}
                    {showDiscountBadge && discount !== null && discount > 0 && (
                        <Badge className="bg-rose-500/95 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white shadow-xs backdrop-blur-md">
                            -{discount}%
                        </Badge>
                    )}
                    {outOfStock && (
                        <Badge variant="destructive" className="bg-red-500/95 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white shadow-xs backdrop-blur-md">
                            Rupture
                        </Badge>
                    )}
                </div>

                {/* Wishlist Button */}
                <button
                    onClick={handleToggleWishlist}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/20 text-white shadow-sm backdrop-blur-md transition-all hover:bg-white hover:text-rose-500 hover:scale-110"
                >
                    <Heart className={`h-3.5 w-3.5 transition-colors ${isWishlisted ? "fill-rose-500 text-rose-500" : ""}`} />
                </button>

                {/* Content at Bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col justify-end">
                    <div className="mb-1.5 flex items-center gap-1 opacity-0 -translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                        <StarRating rating={rating} />
                        <span className="text-[10px] font-medium text-slate-300">
                            {rating.toFixed(1)}
                        </span>
                        <span className="mx-1 text-slate-500">•</span>
                        <span className="text-[10px] text-slate-400">{formatSoldCount(sold)}</span>
                    </div>

                    <h3 className="line-clamp-2 text-sm sm:text-base font-semibold leading-snug text-white mb-2 transition-colors group-hover:text-emerald-400">
                        {product.nom}
                    </h3>

                    <div className="flex items-end justify-between">
                        <div className="flex flex-col">
                            {oldPrice && (
                                <span className="text-[10px] text-slate-400 line-through">
                                    {formatCurrency(oldPrice)}
                                </span>
                            )}
                            <span className="text-sm sm:text-base font-bold tracking-tight text-white">
                                {formatCurrency(currentPrice)}
                            </span>
                        </div>

                        {/* Animated Cart Button inside the image */}
                        <Button
                            onClick={handleAddToCart}
                            disabled={outOfStock}
                            className={`group/cart-btn relative flex h-8 w-8 shrink-0 items-center justify-start overflow-hidden rounded-full transition-all duration-300 ease-out shadow-lg ${!outOfStock ? "bg-emerald-500 text-white hover:w-27.5 hover:bg-emerald-400" : "bg-slate-600/80 text-slate-300 cursor-not-allowed"}`}
                        >
                            <div className="absolute left-0 flex h-8 w-8 items-center justify-center">
                                <ShoppingCart className="h-3.5 w-3.5 transition-transform duration-300 group-hover/cart-btn:scale-110" />
                            </div>
                            <span className="ml-8 whitespace-nowrap pr-2 text-[10px] font-bold opacity-0 transition-opacity duration-300 group-hover/cart-btn:opacity-100">
                                Ajouter
                            </span>
                        </Button>
                    </div>
                </div>
            </Link>
        </div>
    );
}
