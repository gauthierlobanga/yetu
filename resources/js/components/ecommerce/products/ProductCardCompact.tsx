// resources/js/components/ecommerce/products/ProductCardCompact.tsx
import { Link } from '@inertiajs/react';
import { Star, ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/ecommerce/use-cart';
import type { Product } from '@/types/ecommerce/products';

interface ProductCardCompactProps {
    product: Product;
    showDiscountBadge?: boolean;
}

/** Retourne une URL d’image valide ou un placeholder */
function getImageUrl(image: string | null | undefined): string {
    if (!image) {
        return '/images/getting-business.jpg';
    }

    if (image.startsWith('http') || image.startsWith('/storage')) {
        return image;
    }

    return `/storage/${image.replace(/^\//, '')}`;
}

/** Formate un montant en CDF */
function formatPrice(amount: number): string {
    return new Intl.NumberFormat('fr-CD', {
        style: 'currency',
        currency: 'CDF',
        minimumFractionDigits: 0,
    }).format(amount);
}

export default function ProductCardCompact({
    product,
    showDiscountBadge = false,
}: ProductCardCompactProps) {
    const noteMoyenne = Number(product.note_moyenne) || 0;
    const soldCount = Number(product.sold_count) || 0;
    const { addToCart } = useCart();

    const renderStars = () => (
        <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-foreground">
                {noteMoyenne.toFixed(1)}
            </span>
        </div>
    );

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product.id, 1);
    };

    return (
        <Link href={product.url} className="group block">
            <div className="relative overflow-hidden rounded-lg bg-muted">
                <div className="aspect-square w-full">
                    <img
                        src={getImageUrl(product.image_principale)}
                        alt={product.nom}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                    />
                </div>

                {/* Badges */}
                <div className="absolute top-1.5 left-1.5 flex flex-col gap-1">
                    {showDiscountBadge && product.est_en_promotion && (
                        <Badge className="bg-red-500 px-1.5 py-0 text-[10px] text-white">
                            -{product.reduction_pourcentage}%
                        </Badge>
                    )}
                    {product.badge && (
                        <Badge className="bg-emerald-600 px-1.5 py-0 text-[10px] text-white">
                            {product.badge}
                        </Badge>
                    )}
                </div>

                {/* Bouton panier au survol */}
                <div className="absolute inset-x-0 bottom-0 p-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <Button
                        onClick={handleAddToCart}
                        size="sm"
                        className="w-full gap-1.5 border-0 bg-white/90 text-xs text-foreground backdrop-blur-sm hover:bg-white dark:bg-gray-900/90 dark:hover:bg-gray-900"
                    >
                        <ShoppingCart className="h-3.5 w-3.5" />
                        Ajouter
                    </Button>
                </div>
            </div>

            <div className="mt-1.5 space-y-0.5">
                <h3 className="line-clamp-2 text-xs leading-tight font-medium text-foreground">
                    {product.nom}
                </h3>

                <div className="flex items-center gap-1">
                    {renderStars()}
                    <span className="text-[10px] text-muted-foreground">•</span>
                    <span className="text-[10px] text-muted-foreground">
                        {soldCount >= 1000
                            ? `${Math.floor(soldCount / 1000)}k+`
                            : soldCount}{' '}
                        vendu{soldCount > 1 ? 's' : ''}
                    </span>
                </div>

                <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-bold text-foreground">
                        {formatPrice(product.prix_actuel ?? product.prix_ttc)}
                    </span>
                    {product.est_en_promotion && (
                        <span className="text-xs text-muted-foreground line-through">
                            {formatPrice(product.prix_ttc)}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
