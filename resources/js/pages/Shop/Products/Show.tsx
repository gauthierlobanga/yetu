/* eslint-disable @typescript-eslint/no-unused-vars */
import { Head, Link, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Star,
    ShoppingCart,
    Heart,
    Share2,
    ChevronRight,
    Check,
    ThumbsUp,
    Minus,
    Plus,
    ZoomIn,
    Truck,
    ShieldCheck,
    RotateCcw,
    ChevronLeft,
    ChevronRight as ChevronRightIcon,
    Sparkles,
} from 'lucide-react';
import { useState, useRef } from 'react';
import ProductCard from '@/components/ecommerce/products/ProductCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/hooks/ecommerce/use-cart';
import MainLayout from '@/layouts/main-layout';
import type { Product } from '@/types/ecommerce/products';

interface Review {
    id: number;
    note: number;
    commentaire: string;
    client: string;
    date: string;
    utile?: number;
}

interface Props {
    [key: string]: any;
    product: Product & {
        description: string;
        short_description: string;
        images: Array<{ medium: string; large: string; alt: string }>;
        brand: { nom: string; slug: string } | null;
        categories: Array<{ nom: string; slug: string }>;
        variantes: Array<{
            id: number;
            nom: string;
            valeur: string;
            supplement_prix: number;
            stock: number;
            prix_actuel: number;
        }>;
        avis: Review[];
        stock_disponible: number;
        rating_stats?: {
            average: number;
            total: number;
            distribution: Record<number, number>;
        };
        bulk_discounts?: Array<{
            quantity: number;
            discount_percentage: number;
            price: number;
        }>;
    };
    relatedProducts: Product[];
}

export default function ProductShow() {
    const { addToCart } = useCart();
    const { props } = usePage<Props>();
    const { product, relatedProducts } = props;

    const [selectedImage, setSelectedImage] = useState(
        product.images?.[0]?.large || product.image_principale,
    );
    const [galleryIndex, setGalleryIndex] = useState(0);
    const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
    const [showZoom, setShowZoom] = useState(false);

    const groupedVariants = product.variantes.reduce(
        (acc, variant) => {
            if (!acc[variant.nom]) {
                acc[variant.nom] = [];
            }

            acc[variant.nom].push(variant);

            return acc;
        },
        {} as Record<string, typeof product.variantes>,
    );

    const [selectedVariants, setSelectedVariants] = useState<
        Record<string, string>
    >(() => {
        const initial: Record<string, string> = {};
        Object.keys(groupedVariants).forEach((key) => {
            initial[key] = groupedVariants[key][0]?.valeur || '';
        });

        return initial;
    });

    const [quantity, setQuantity] = useState(1);
    const [activeBulkOption, setActiveBulkOption] = useState<number | null>(
        null,
    );
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [couponApplied, setCouponApplied] = useState(false);
    const zoomRef = useRef<HTMLDivElement>(null);

    const bulkDiscounts = product.bulk_discounts?.length
        ? product.bulk_discounts
        : [
              {
                  quantity: 1,
                  discount_percentage: 0,
                  price: product.prix_actuel,
              },
              {
                  quantity: 2,
                  discount_percentage: 10,
                  price: product.prix_actuel * 2 * 0.9,
              },
              {
                  quantity: 3,
                  discount_percentage: 20,
                  price: product.prix_actuel * 3 * 0.8,
              },
          ];

    const ratingStats = product.rating_stats || {
        average: product.note_moyenne,
        total: product.nombre_avis,
        distribution: {
            5: Math.round(product.nombre_avis * 0.65),
            4: Math.round(product.nombre_avis * 0.15),
            3: Math.round(product.nombre_avis * 0.07),
            2: Math.round(product.nombre_avis * 0.08),
            1: Math.round(product.nombre_avis * 0.05),
        },
    };

    const renderStars = (rating: number, size: 'sm' | 'md' = 'md') => {
        const starSize = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';

        return Array.from({ length: 5 }).map((_, i) => (
            <Star
                key={i}
                className={`${starSize} ${
                    i < Math.floor(rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : i < rating
                          ? 'fill-yellow-400/50 text-yellow-400'
                          : 'fill-muted-foreground/20 text-muted-foreground/20'
                }`}
            />
        ));
    };

    const handleAddToCart = () => {
        const totalQuantity = activeBulkOption || quantity;
        const variantId = Object.values(selectedVariants).length
            ? product.variantes.find(
                  (v) => v.valeur === Object.values(selectedVariants)[0],
              )?.id
            : undefined;
        addToCart(product.id, totalQuantity, variantId);
    };

    const handleSubmitReview = () => {
        router.post(`/product/${product.id}/review`, {
            note: reviewRating,
            commentaire: reviewComment,
        });
    };

    const applyCoupon = () => {
        if (couponCode.trim().toLowerCase() === 'promo10') {
            setCouponApplied(true);
        }
    };

    const nextImage = () => {
        if (!product.images?.length) {
            return;
        }

        const newIndex = (galleryIndex + 1) % product.images.length;
        setGalleryIndex(newIndex);
        setSelectedImage(product.images[newIndex].large);
    };

    const prevImage = () => {
        if (!product.images?.length) {
            return;
        }

        const newIndex =
            (galleryIndex - 1 + product.images.length) % product.images.length;
        setGalleryIndex(newIndex);
        setSelectedImage(product.images[newIndex].large);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!zoomRef.current) {
            return;
        }

        const rect = zoomRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        zoomRef.current.style.transformOrigin = `${x}% ${y}%`;
        setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    function setIsZoomed(arg0: boolean) {
        throw new Error('Function not implemented.');
    }

    return (
        <MainLayout>
            <Head title={product.nom} />
            <div className="mx-auto max-w-7xl px-4 py-8">
                {/* Fil d'Ariane */}
                <nav className="mb-6 flex items-center space-x-2 text-sm text-muted-foreground">
                    <Link
                        href={route('home')}
                        className="hover:text-foreground"
                    >
                        Accueil
                    </Link>
                    <ChevronRight className="h-4 w-4" />
                    <Link
                        href={route('tenant.product.index')}
                        className="hover:text-foreground"
                    >
                        Produits
                    </Link>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-foreground">{product.nom}</span>
                </nav>

                <div className="grid gap-10 lg:grid-cols-2">
                    {/* Galerie */}
                    <div className="space-y-4">
                        <div
                            ref={zoomRef}
                            className="group relative aspect-square cursor-none overflow-hidden rounded-2xl bg-muted"
                            onMouseMove={handleMouseMove}
                            onMouseEnter={() => setShowZoom(true)}
                            onMouseLeave={() => {
                                setIsZoomed(false);
                                setShowZoom(false);
                            }}
                        >
                            <img
                                src={
                                    selectedImage ||
                                    product.image_principale ||
                                    '/storage/images/placeholder-product.jpg'
                                }
                                alt={product.nom}
                                className={`h-full w-full object-cover transition-transform duration-200 ${
                                    showZoom ? 'scale-200' : 'scale-100'
                                }`}
                            />
                            {product.est_en_promotion && (
                                <Badge className="absolute top-4 left-4 z-10 bg-destructive px-3 py-1 text-sm text-destructive-foreground">
                                    -{product.reduction_pourcentage}%
                                </Badge>
                            )}
                            {showZoom && (
                                <div
                                    className="pointer-events-none absolute flex h-24 w-24 items-center justify-center rounded-full border-2 border-white bg-black/30 text-sm font-medium text-white shadow-lg backdrop-blur-sm"
                                    style={{
                                        left: cursorPos.x - 48,
                                        top: cursorPos.y - 48,
                                    }}
                                >
                                    <ZoomIn className="h-6 w-6" />
                                </div>
                            )}
                            <Dialog>
                                <DialogTrigger asChild>
                                    <button className="absolute top-4 right-4 z-10 rounded-full bg-white/80 p-2 shadow backdrop-blur-sm transition hover:bg-white">
                                        <ZoomIn className="h-4 w-4" />
                                    </button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl border-none bg-transparent p-0">
                                    <img
                                        src={selectedImage}
                                        alt={product.nom}
                                        className="max-h-[90vh] w-full rounded-lg object-contain"
                                    />
                                </DialogContent>
                            </Dialog>
                            {product.images?.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-black/20 p-2 text-white opacity-0 transition group-hover:opacity-100 hover:bg-black/40"
                                    >
                                        <ChevronLeft className="h-6 w-6" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-black/20 p-2 text-white opacity-0 transition group-hover:opacity-100 hover:bg-black/40"
                                    >
                                        <ChevronRightIcon className="h-6 w-6" />
                                    </button>
                                </>
                            )}
                        </div>
                        {product.images?.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setGalleryIndex(idx);
                                            setSelectedImage(
                                                img.large || img.medium,
                                            );
                                        }}
                                        className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                                            selectedImage ===
                                            (img.large || img.medium)
                                                ? 'border-primary shadow-md'
                                                : 'border-transparent hover:border-border'
                                        }`}
                                    >
                                        <img
                                            src={img.thumb || img.medium}
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Infos produit */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="font-heading text-2xl leading-tight font-bold text-foreground md:text-3xl">
                                {product.nom}
                            </h1>
                            {product.brand && (
                                <Link
                                    href={`/brand/${product.brand.slug}`}
                                    className="text-sm text-muted-foreground hover:underline"
                                >
                                    par {product.brand.nom}
                                </Link>
                            )}
                            <div className="mt-2 flex items-center gap-2">
                                <div className="flex">
                                    {renderStars(product.note_moyenne)}
                                </div>
                                <span className="text-sm font-medium text-foreground">
                                    {product.note_moyenne.toFixed(1)}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    ({product.nombre_avis} avis)
                                </span>
                            </div>
                        </div>

                        <p className="text-muted-foreground">
                            {product.short_description}
                        </p>

                        <div className="flex items-baseline gap-3">
                            <span className="text-3xl font-bold text-primary">
                                {new Intl.NumberFormat('fr-CD', {
                                    style: 'currency',
                                    currency: 'CDF',
                                }).format(product.prix_actuel)}
                            </span>
                            {product.est_en_promotion && (
                                <span className="text-lg text-muted-foreground line-through">
                                    {new Intl.NumberFormat('fr-CD', {
                                        style: 'currency',
                                        currency: 'CDF',
                                    }).format(product.prix_ttc)}
                                </span>
                            )}
                        </div>

                        {/* Variantes */}
                        {Object.keys(groupedVariants).length > 0 &&
                            Object.entries(groupedVariants).map(
                                ([name, variants]) => (
                                    <div key={name}>
                                        <h3 className="mb-3 text-sm font-semibold text-foreground capitalize">
                                            {name}
                                        </h3>
                                        <div className="flex flex-wrap gap-3">
                                            {variants.map((variant) => {
                                                const isSelected =
                                                    selectedVariants[name] ===
                                                    variant.valeur;
                                                const outOfStock =
                                                    variant.stock === 0;

                                                return (
                                                    <button
                                                        key={variant.id}
                                                        onClick={() =>
                                                            !outOfStock &&
                                                            setSelectedVariants(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    [name]: variant.valeur,
                                                                }),
                                                            )
                                                        }
                                                        disabled={outOfStock}
                                                        className={`relative min-w-14 rounded-xl border-2 px-4 py-3 text-center transition-all ${
                                                            isSelected
                                                                ? 'border-primary bg-primary/10 ring-2 ring-primary'
                                                                : 'border-border hover:border-primary'
                                                        } ${
                                                            outOfStock
                                                                ? 'cursor-not-allowed opacity-40'
                                                                : 'hover:shadow-md'
                                                        }`}
                                                    >
                                                        <span className="block text-base font-bold text-foreground">
                                                            {variant.valeur}
                                                        </span>
                                                        {variant.supplement_prix >
                                                            0 && (
                                                            <span className="block text-xs text-muted-foreground">
                                                                +
                                                                {new Intl.NumberFormat(
                                                                    'fr-CD',
                                                                    {
                                                                        style: 'currency',
                                                                        currency:
                                                                            'CDF',
                                                                    },
                                                                ).format(
                                                                    variant.supplement_prix,
                                                                )}
                                                            </span>
                                                        )}
                                                        {outOfStock && (
                                                            <span className="absolute inset-0 flex items-center justify-center rounded-xl bg-background/60 text-xs font-medium text-destructive backdrop-blur-sm">
                                                                Épuisé
                                                            </span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ),
                            )}

                        {/* Offres groupées */}
                        <div>
                            <h3 className="mb-3 text-sm font-semibold text-foreground">
                                Offres groupées
                            </h3>
                            <div className="grid grid-cols-3 gap-2">
                                {bulkDiscounts.map((option) => {
                                    const isActive =
                                        activeBulkOption === option.quantity;

                                    return (
                                        <button
                                            key={option.quantity}
                                            onClick={() =>
                                                setActiveBulkOption(
                                                    option.quantity,
                                                )
                                            }
                                            className={`flex flex-col items-center rounded-xl border p-3 transition-all ${
                                                isActive
                                                    ? 'border-primary bg-primary/5 shadow-md'
                                                    : 'border-border hover:border-primary/30'
                                            }`}
                                        >
                                            <span className="text-2xl font-bold text-foreground">
                                                {option.quantity}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                unité(s)
                                            </span>
                                            {option.discount_percentage > 0 && (
                                                <Badge
                                                    variant="secondary"
                                                    className="mt-1 bg-primary/10 text-primary"
                                                >
                                                    -
                                                    {option.discount_percentage}
                                                    %
                                                </Badge>
                                            )}
                                            <span className="mt-1 font-semibold text-foreground">
                                                {new Intl.NumberFormat(
                                                    'fr-CD',
                                                    {
                                                        style: 'currency',
                                                        currency: 'CDF',
                                                    },
                                                ).format(option.price)}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                            {activeBulkOption && (
                                <p className="mt-2 text-sm text-primary">
                                    Vous économisez{' '}
                                    {
                                        bulkDiscounts.find(
                                            (o) =>
                                                o.quantity === activeBulkOption,
                                        )?.discount_percentage
                                    }
                                    % sur cet article.
                                </p>
                            )}
                        </div>

                        {/* Stock */}
                        <div className="flex items-center gap-4">
                            {product.stock_disponible > 0 ? (
                                <span className="flex items-center gap-1 text-sm font-medium text-primary">
                                    <Check className="h-4 w-4" /> En stock (
                                    {product.stock_disponible} dispo.)
                                </span>
                            ) : (
                                <span className="text-sm font-medium text-destructive">
                                    Rupture de stock
                                </span>
                            )}
                        </div>

                        {/* Quantité et actions */}
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center rounded-lg border border-border">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                        setQuantity(Math.max(1, quantity - 1))
                                    }
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-10 text-center text-sm font-medium text-foreground">
                                    {quantity}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setQuantity(quantity + 1)}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <Button
                                className="flex-1 gap-2"
                                size="lg"
                                onClick={handleAddToCart}
                                disabled={product.stock_disponible === 0}
                            >
                                <ShoppingCart className="h-5 w-5" />
                                Ajouter au panier
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-11 w-11"
                                onClick={() => setIsWishlisted(!isWishlisted)}
                            >
                                <Heart
                                    className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`}
                                />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-11 w-11"
                            >
                                <Share2 className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Code promo */}
                        <div className="rounded-lg border border-border bg-muted/30 p-4">
                            <p className="text-sm font-medium text-foreground">
                                Vous avez un code promo ?
                            </p>
                            <div className="mt-2 flex gap-2">
                                <Input
                                    placeholder="Entrez votre code"
                                    value={couponCode}
                                    onChange={(e) =>
                                        setCouponCode(e.target.value)
                                    }
                                    className="h-10"
                                />
                                <Button
                                    onClick={applyCoupon}
                                    variant="outline"
                                    className="whitespace-nowrap"
                                >
                                    Appliquer
                                </Button>
                            </div>
                            {couponApplied && (
                                <p className="mt-2 text-sm text-primary">
                                    Code promo10 appliqué : -10% sur votre
                                    commande !
                                </p>
                            )}
                        </div>

                        {/* Infos livraison */}
                        <div className="space-y-3 rounded-lg border border-border bg-card p-4 text-sm">
                            <div className="flex items-center gap-2">
                                <Truck className="h-4 w-4 text-primary" />
                                <span className="text-foreground">
                                    Livraison gratuite à partir de 50 000 CDF
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <RotateCcw className="h-4 w-4 text-primary" />
                                <span className="text-foreground">
                                    Retour sous 30 jours
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-primary" />
                                <span className="text-foreground">
                                    Paiement 100% sécurisé
                                </span>
                            </div>
                        </div>

                        <div className="border-t border-border pt-4 text-xs text-muted-foreground">
                            <p>SKU: {product.id}</p>
                            <p>
                                Catégorie:{' '}
                                {product.categories
                                    ?.map((c) => c.nom)
                                    .join(', ')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Articles similaires */}
                {relatedProducts.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="mt-20 border-t border-border/50 pt-12"
                    >
                        <div className="mb-8 text-center">
                            <span className="text-sm font-semibold tracking-wider text-primary uppercase">
                                <Sparkles className="mr-1 inline h-4 w-4" />
                                Recommandations
                            </span>
                            <h2 className="mt-2 font-heading text-2xl font-bold text-foreground md:text-3xl">
                                Articles similaires
                            </h2>
                            <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
                                Découvrez d'autres produits qui pourraient vous
                                plaire
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                            {relatedProducts.slice(0, 8).map((product) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                >
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Avis */}
                <div className="mt-16 grid gap-10 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <h2 className="mb-6 font-heading text-2xl font-bold text-foreground">
                            Avis clients
                        </h2>
                        {product.avis.length === 0 ? (
                            <p className="text-muted-foreground">
                                Aucun avis pour le moment. Soyez le premier à
                                donner votre avis !
                            </p>
                        ) : (
                            <div className="space-y-6">
                                {product.avis.map((avis) => (
                                    <div
                                        key={avis.id}
                                        className="border-b border-border pb-6"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex">
                                                        {renderStars(
                                                            avis.note,
                                                            'sm',
                                                        )}
                                                    </div>
                                                    <span className="font-medium text-foreground">
                                                        {avis.client}
                                                    </span>
                                                </div>
                                                <p className="mt-2 text-muted-foreground">
                                                    {avis.commentaire}
                                                </p>
                                                <p className="mt-2 text-xs text-muted-foreground">
                                                    {avis.date}
                                                </p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="gap-1"
                                            >
                                                <ThumbsUp className="h-4 w-4" />
                                                {avis.utile || 0}
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="space-y-6">
                        <div className="rounded-lg border border-border p-6">
                            <h3 className="font-semibold text-foreground">
                                Note globale
                            </h3>
                            <div className="mt-3 flex items-baseline gap-2">
                                <span className="text-4xl font-bold text-foreground">
                                    {ratingStats.average.toFixed(1)}
                                </span>
                                <span className="text-muted-foreground">
                                    sur 5
                                </span>
                            </div>
                            <div className="mt-1 flex">
                                {renderStars(ratingStats.average)}
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {ratingStats.total} avis vérifiés
                            </p>
                            <div className="mt-6 space-y-2">
                                {[5, 4, 3, 2, 1].map((star) => {
                                    const count =
                                        ratingStats.distribution[star] || 0;
                                    const percentage =
                                        ratingStats.total > 0
                                            ? (count / ratingStats.total) * 100
                                            : 0;

                                    return (
                                        <div
                                            key={star}
                                            className="flex items-center gap-2 text-sm text-foreground"
                                        >
                                            <span className="w-6">
                                                {star} ★
                                            </span>
                                            <Progress
                                                value={percentage}
                                                className="h-2 flex-1"
                                            />
                                            <span className="w-10 text-right">
                                                {percentage.toFixed(0)}%
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="rounded-lg border border-border p-6">
                            <h3 className="font-semibold text-foreground">
                                Laisser un avis
                            </h3>
                            <div className="mt-4 space-y-4">
                                <div>
                                    <label className="mb-1 block text-sm text-muted-foreground">
                                        Votre note
                                    </label>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() =>
                                                    setReviewRating(star)
                                                }
                                            >
                                                <Star
                                                    className={`h-6 w-6 ${
                                                        star <= reviewRating
                                                            ? 'fill-yellow-400 text-yellow-400'
                                                            : 'text-muted-foreground/20'
                                                    }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <Textarea
                                    placeholder="Partagez votre expérience..."
                                    value={reviewComment}
                                    onChange={(e) =>
                                        setReviewComment(e.target.value)
                                    }
                                    rows={4}
                                />
                                <Button
                                    onClick={handleSubmitReview}
                                    className="w-full"
                                >
                                    Envoyer mon avis
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
