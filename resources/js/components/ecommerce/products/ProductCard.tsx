// resources/js/components/ecommerce/products/ProductCard.tsx
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/ecommerce/use-cart';
import type { Product } from '@/types/ecommerce/products';

interface ProductCardProps {
    product: Product;
    viewMode?: 'grid' | 'list';
}

function getImageUrl(image: string | null | undefined): string {
    if (!image) {
        return '/storage/images/getting-business.jpg';
    } // fallback

    // Si l'image commence déjà par http ou /storage, on la garde telle quelle
    if (image.startsWith('http') || image.startsWith('/storage')) {
        return image;
    }

    // Sinon, on ajoute le préfixe storage
    return `/storage/${image.replace(/^\//, '')}`;
}

export default function ProductCard({
    product,
    viewMode = 'grid',
}: ProductCardProps) {
    const noteMoyenne = Number(product.note_moyenne) || 0;
    const soldCount = Number(product.sold_count) || 0;
    const { addToCart } = useCart();

    // Formatage du nombre de ventes
    const formatSoldCount = (count: number) => {
        if (count >= 1000) {
            return `${Math.floor(count / 1000)}k+ vendus`;
        }

        return `${count} vendu${count > 1 ? 's' : ''}`;
    };

    // Étoiles
    const renderStars = (size: 'sm' | 'md' = 'sm') => {
        const iconClass = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';

        return Array.from({ length: 5 }).map((_, i) => (
            <Star
                key={i}
                className={`${iconClass} ${
                    i < Math.floor(noteMoyenne)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200'
                }`}
            />
        ));
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product.id, 1);
    };

    // Mode LISTE
    if (viewMode === 'list') {
        const ordersThisWeek = product.orders_this_week ?? 0;
        const sellerName = product.seller_name ?? 'Boutique officielle';
        const oldPrice =
            product.old_price ??
            (product.est_en_promotion ? product.prix_ttc : null);
        const currentPrice = product.prix_actuel;
        const discountPercentage = oldPrice
            ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100)
            : (product.reduction_pourcentage ?? null);

        return (
            <motion.div
                whileHover={{ y: -2 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="group relative flex w-full flex-col gap-4 rounded-none border bg-card p-4 transition-shadow hover:shadow-md sm:flex-row"
            >
                {/* Image */}
                <Link href={product.url} className="block shrink-0 sm:w-48">
                    <img
                        src={
                            product.image_principale ||
                            '/storage/images/getting-business.jpg'
                        }
                        alt={product.nom}
                        className="h-48 w-full rounded-lg bg-muted object-cover sm:h-32"
                        loading="lazy"
                    />
                </Link>

                {/* Détails */}
                <div className="min-w-0 flex-1 space-y-2">
                    <Link href={product.url} className="block">
                        <h3 className="line-clamp-2 text-lg font-semibold hover:text-primary">
                            {product.nom}
                        </h3>
                    </Link>

                    {/* Prix et promotion */}
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-2xl font-bold">
                            {new Intl.NumberFormat('fr-FR', {
                                style: 'currency',
                                currency: 'USD',
                            }).format(currentPrice)}
                        </span>
                        {oldPrice && (
                            <>
                                <span className="text-muted-foreground line-through">
                                    {new Intl.NumberFormat('fr-FR', {
                                        style: 'currency',
                                        currency: 'USD',
                                    }).format(oldPrice)}
                                </span>
                                {discountPercentage && (
                                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                        -{discountPercentage}%
                                    </Badge>
                                )}
                            </>
                        )}
                    </div>

                    {/* Notes et commandes */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                            {renderStars('md')}
                            <span className="ml-1 font-medium text-foreground">
                                {noteMoyenne.toFixed(1)}
                            </span>
                        </div>
                        <span>·</span>
                        <span>
                            {ordersThisWeek > 0
                                ? `${ordersThisWeek} commandes cette semaine`
                                : formatSoldCount(soldCount)}
                        </span>
                    </div>

                    {/* Vendeur */}
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <span className="mr-1 text-base">📩</span>
                        Vendeur : {sellerName}
                    </div>

                    {/* Badges */}
                    {product.badge && (
                        <div className="mt-1">
                            <Badge className="bg-primary/90">
                                {product.badge}
                            </Badge>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 sm:w-36 sm:flex-col">
                    <Button onClick={handleAddToCart} className="flex-1 gap-2">
                        <ShoppingCart className="h-4 w-4" />
                        Ajouter
                    </Button>
                    <Button variant="outline" size="icon" className="sm:w-full">
                        <Heart className="h-4 w-4" />
                        <span className="ml-2 sm:hidden">Favoris</span>
                    </Button>
                </div>
            </motion.div>
        );
    }

    // Mode GRILLE (inchangé)
    return (
        <motion.div
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="group relative h-full"
        >
            <Link href={product.url} className="block h-full">
                <div className="relative aspect-square overflow-hidden rounded-none bg-muted">
                    <img
                        src={getImageUrl(product.image_principale)}
                        alt={product.nom}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />

                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {product.badge && (
                            <Badge className="bg-primary/90 text-primary-foreground">
                                {product.badge}
                            </Badge>
                        )}
                        {product.est_en_promotion && (
                            <Badge className="bg-red-500 text-white">
                                -{product.reduction_pourcentage}%
                            </Badge>
                        )}
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <Button
                            onClick={handleAddToCart}
                            size="sm"
                            className="w-full gap-2 bg-black/80 text-white backdrop-blur-sm hover:bg-black"
                        >
                            <ShoppingCart className="h-4 w-4" />
                            Ajouter au panier
                        </Button>
                    </div>
                </div>

                <div className="mt-2 space-y-1">
                    <h3 className="line-clamp-2 text-sm leading-tight font-medium">
                        {product.nom}
                    </h3>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <div className="flex">{renderStars()}</div>
                        <span className="ml-0.5">{noteMoyenne.toFixed(1)}</span>
                        <span className="mx-1">•</span>
                        <span>{formatSoldCount(soldCount)}</span>
                    </div>

                    <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold">
                            {new Intl.NumberFormat('fr-FR', {
                                style: 'currency',
                                currency: 'eur',
                            }).format(product.prix_actuel)}
                        </span>
                        {product.est_en_promotion && (
                            <span className="text-sm text-muted-foreground line-through">
                                {new Intl.NumberFormat('fr-FR', {
                                    style: 'currency',
                                    currency: 'eur',
                                }).format(product.prix_ttc)}
                            </span>
                        )}
                    </div>

                    {product.discount_label && (
                        <div className="mt-1 flex items-center gap-1 text-xs">
                            <Badge
                                variant="outline"
                                className="border-orange-400 bg-orange-50 text-orange-700"
                            >
                                Promo
                            </Badge>
                            <span className="text-muted-foreground">
                                {product.discount_label}
                            </span>
                        </div>
                    )}
                </div>
            </Link>
        </motion.div>
    );
}
