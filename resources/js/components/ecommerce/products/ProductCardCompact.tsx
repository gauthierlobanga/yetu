// resources/js/components/ecommerce/products/ProductCardCompact.tsx
import { Link } from '@inertiajs/react';
import { Star, ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/ecommerce/use-cart';
import type { Product } from '@/types/ecommerce/products';

interface ProductCardCompactProps {
    product: Product;
}

export default function ProductCardCompact({
    product,
}: ProductCardCompactProps) {
    const noteMoyenne = Number(product.note_moyenne) || 0;
    const soldCount = Number(product.sold_count) || 0;
    const { addToCart } = useCart();

    const formatSoldCount = (count: number) => {
        if (count >= 1000) {
            return `${Math.floor(count / 1000)}k+`;
        }

        return `${count}`;
    };

    const renderStars = () => (
        <div className="flex items-center">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="ml-0.5 text-xs">
                {Number(noteMoyenne).toFixed(1)}
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
            <div className="relative overflow-hidden rounded-md bg-muted">
                <div className="aspect-square w-full">
                    <img
                        src={product.image_principale || undefined}
                        alt={product.nom}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                    />
                </div>

                {/* Badges */}
                <div className="absolute top-1 left-1 flex flex-col gap-0.5">
                    {product.est_en_promotion && (
                        <Badge className="bg-red-500 px-1.5 py-0 text-xs text-white">
                            -{product.reduction_pourcentage}%
                        </Badge>
                    )}
                    {product.badge && (
                        <Badge className="bg-primary/90 px-1.5 py-0 text-xs text-primary-foreground">
                            {product.badge}
                        </Badge>
                    )}
                </div>

                {/* Bouton panier au survol */}
                <div className="absolute inset-x-0 bottom-0 w-1/4 p-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <Button
                        onClick={handleAddToCart}
                        size="sm"
                        className="mx-auto h-8 cursor-pointer gap-1 rounded-none bg-black/80 p-4 text-xs text-white backdrop-blur-sm hover:bg-black"
                    >
                        <ShoppingCart className="h-5 w-5" />
                        Ajouter
                    </Button>
                </div>
            </div>

            <div className="mt-1.5 space-y-0.5">
                <h3 className="line-clamp-2 text-xs leading-tight font-medium">
                    {product.nom}
                </h3>

                <div className="flex items-center gap-1 text-muted-foreground">
                    {renderStars()}
                    <span className="text-xs">•</span>
                    <span className="text-xs">
                        {formatSoldCount(soldCount)} vendus
                    </span>
                </div>

                <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-bold">
                        €{Number(product.prix_actuel).toFixed(2)}
                    </span>
                    {product.est_en_promotion && (
                        <span className="text-xs text-muted-foreground line-through">
                            €{Number(product.prix_ttc).toFixed(2)}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
