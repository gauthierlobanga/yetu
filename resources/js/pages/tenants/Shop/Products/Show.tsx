// resources/js/Pages/Shop/Products/Show.tsx
import { Head, Link, usePage, router } from '@inertiajs/react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import {
    Star,
    ShoppingCart,
    Heart,
    Share2,
    ChevronRight,
    Check,
    ThumbsUp,
    MessageCircle,
    Minus,
    Plus,
    ZoomIn,
} from 'lucide-react';
import { useState, useRef } from 'react';
import ProductCard from '@/components/tenants/shop/products/ProductCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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

    // État pour l'image sélectionnée (utilisé dans l'affichage principal)
    const [selectedImage, setSelectedImage] = useState(
        product.images[0]?.large ||
        product.images[0]?.medium ||
        product.image_principale,
    );
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState<string>('');
    const [activeBulkOption, setActiveBulkOption] = useState<number | null>(
        null,
    );
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isZoomed, setIsZoomed] = useState(false);
    const zoomRef = useRef<HTMLDivElement>(null);

    // Offres groupées par défaut
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

    // Statistiques d'avis
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
                className={`${starSize} ${i < Math.floor(rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : i < rating
                        ? 'fill-yellow-400/50 text-yellow-400'
                        : 'fill-gray-200 text-gray-200'
                    }`}
            />
        ));
    };

    const handleAddToCart = () => {
        const totalQuantity = activeBulkOption || quantity;
        const variantId = selectedVariant ? Number(selectedVariant) : undefined;
        addToCart(product.id, totalQuantity, variantId);
    };

    const handleSubmitReview = () => {
        router.post(`/shop/product/${product.id}/review`, {
            note: reviewRating,
            commentaire: reviewComment,
        });
    };

    // Effet de zoom au survol
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!zoomRef.current) {
            return;
        }

        const { left, top, width, height } =
            zoomRef.current.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        zoomRef.current.style.transformOrigin = `${x}% ${y}%`;
    };

    return (
        <MainLayout>
            <Head title={product.nom} />
            <div className="mx-auto max-w-7xl px-4 py-8">
                {/* Fil d'Ariane */}
                <nav className="mb-6 flex items-center space-x-2 text-sm text-muted-foreground">
                    <Link href={route('tenant.home')} className="hover:text-foreground">
                        Home
                    </Link>
                    <ChevronRight className="h-4 w-4" />
                    <Link
                        href={route('tenant.products.index')}
                        className="hover:text-foreground"
                    >
                        Products
                    </Link>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-foreground">Product Details</span>
                </nav>

                <div className="grid gap-10 lg:grid-cols-2">
                    {/* Galerie images modernisée */}
                    <div className="space-y-4">
                        <Dialog>
                            <DialogTrigger asChild>
                                <div className="group relative aspect-square cursor-zoom-in overflow-hidden rounded-xl bg-muted">
                                    {selectedImage ? (
                                        <img
                                            src={selectedImage}
                                            alt={product.nom}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="img-fallback flex h-full w-full items-center justify-center text-6xl">
                                            {product.nom
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>
                                    )}
                                    {product.est_en_promotion && (
                                        <Badge className="absolute top-4 left-4 bg-red-500 px-3 py-1 text-sm text-white">
                                            -{product.reduction_pourcentage}%
                                        </Badge>
                                    )}
                                    <div className="absolute right-4 bottom-4 rounded-full bg-background/80 p-2 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                                        <ZoomIn className="h-5 w-5" />
                                    </div>
                                </div>
                            </DialogTrigger>
                            <DialogContent
                                aria-describedby={undefined}
                                className="max-w-4xl border-none bg-transparent p-0"
                            >
                                <img
                                    src={selectedImage}
                                    alt={product.nom}
                                    className="max-h-[90vh] w-full rounded-lg object-contain"
                                />
                            </DialogContent>
                        </Dialog>

                        {product.images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() =>
                                            setSelectedImage(
                                                img.large || img.medium,
                                            )
                                        }
                                        className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${selectedImage ===
                                            (img.large || img.medium)
                                            ? 'border-primary shadow-md'
                                            : 'border-transparent hover:border-gray-300'
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
                            <h1 className="font-heading text-2xl leading-tight font-bold md:text-3xl">
                                {product.nom}
                            </h1>
                            <div className="mt-2 flex items-center gap-2">
                                <div className="flex">
                                    {renderStars(product.note_moyenne)}
                                </div>
                                <span className="text-sm font-medium">
                                    {product.note_moyenne.toFixed(1)}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                    ({product.nombre_avis} Reviews)
                                </span>
                            </div>
                        </div>
                        <p className="text-muted-foreground">
                            {product.short_description}
                        </p>
                        <div className="flex items-baseline gap-3">
                            <span className="text-2xl font-bold text-primary">
                                €{product.prix_actuel.toFixed(2)}
                            </span>
                            {product.est_en_promotion && (
                                <span className="text-lg text-muted-foreground line-through">
                                    €{Number(product.prix_ttc).toFixed(2)}
                                </span>
                            )}
                        </div>

                        {/* Offres groupées */}
                        <div className="space-y-3 rounded-lg bg-muted/50 p-4">
                            <h3 className="text-sm font-semibold">
                                Offres groupées
                            </h3>
                            <div className="space-y-2">
                                {bulkDiscounts.map((option) => (
                                    <label
                                        key={option.quantity}
                                        className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-all ${activeBulkOption === option.quantity
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border hover:bg-muted'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="bulk"
                                                value={option.quantity}
                                                checked={
                                                    activeBulkOption ===
                                                    option.quantity
                                                }
                                                onChange={() =>
                                                    setActiveBulkOption(
                                                        option.quantity,
                                                    )
                                                }
                                                className="h-4 w-4 accent-primary"
                                            />
                                            <div>
                                                <p className="font-medium">
                                                    Acheter {option.quantity}
                                                </p>
                                                {option.discount_percentage >
                                                    0 && (
                                                        <p className="text-sm text-green-600">
                                                            Économisez{' '}
                                                            {
                                                                option.discount_percentage
                                                            }
                                                            %
                                                        </p>
                                                    )}
                                            </div>
                                        </div>
                                        <span className="text-lg font-bold">
                                            €{option.price.toFixed(2)}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Variantes */}
                        {product.variantes.length > 0 && (
                            <div>
                                <h3 className="mb-2 text-sm font-medium">
                                    Options
                                </h3>
                                <div className="space-y-3">
                                    {Object.entries(
                                        product.variantes.reduce(
                                            (acc, v) => {
                                                if (!acc[v.nom]) {
                                                    acc[v.nom] = [];
                                                }

                                                acc[v.nom].push(v);

                                                return acc;
                                            },
                                            {} as Record<
                                                string,
                                                typeof product.variantes
                                            >,
                                        ),
                                    ).map(([nom, variantes]) => (
                                        <div key={nom}>
                                            <label className="mb-1 block text-xs text-muted-foreground">
                                                {nom}
                                            </label>
                                            <Select
                                                onValueChange={
                                                    setSelectedVariant
                                                }
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue
                                                        placeholder={`Choisir ${nom.toLowerCase()}`}
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {variantes.map((v) => (
                                                        <SelectItem
                                                            key={v.id}
                                                            value={String(v.id)}
                                                        >
                                                            {v.valeur}{' '}
                                                            {v.supplement_prix >
                                                                0 &&
                                                                `(+€${v.supplement_prix.toFixed(2)})`}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="text-sm">
                            {product.stock_disponible > 0 ? (
                                <span className="flex items-center gap-1 text-green-600">
                                    <Check className="h-4 w-4" /> En stock (
                                    {product.stock_disponible} disponible(s))
                                </span>
                            ) : (
                                <span className="text-red-600">
                                    Rupture de stock
                                </span>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center rounded-lg border">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                        setQuantity(Math.max(1, quantity - 1))
                                    }
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-10 text-center text-sm">
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
                            >
                                <Heart className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-11 w-11"
                            >
                                <Share2 className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="border-t pt-4 text-xs text-muted-foreground">
                            <p>SKU: {product.id}</p>
                            <p>
                                Catégorie:{' '}
                                {product.categories
                                    .map((c) => c.nom)
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
                                Recommandations
                            </span>
                            <h2 className="mt-2 font-heading text-2xl font-bold md:text-3xl">
                                Articles similaires
                            </h2>
                            <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
                                Découvrez d'autres produits qui pourraient vous
                                plaire
                            </p>
                        </div>
                        <div className="relative">
                            <Carousel
                                opts={{
                                    align: 'start',
                                    loop: true,
                                    dragFree: true,
                                }}
                                className="w-full"
                            >
                                <CarouselContent className="-ml-2 md:-ml-4">
                                    {relatedProducts.map((product) => (
                                        <CarouselItem
                                            key={product.id}
                                            className="pl-2 sm:basis-1/2 md:basis-1/3 md:pl-4 lg:basis-1/4 xl:basis-1/5"
                                        >
                                            <ProductCard product={product} />
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious className="absolute top-1/2 left-0 z-10 -translate-y-1/2 rounded-full bg-background/80 shadow-lg backdrop-blur-sm transition-all hover:bg-background hover:shadow-xl" />
                                <CarouselNext className="absolute top-1/2 right-0 z-10 -translate-y-1/2 rounded-full bg-background/80 shadow-lg backdrop-blur-sm transition-all hover:bg-background hover:shadow-xl" />
                            </Carousel>
                        </div>
                    </motion.div>
                )}

                {/* Section Avis */}
                <div className="mt-16 grid gap-10 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <h2 className="mb-6 font-heading text-2xl font-bold">
                            Reviews
                        </h2>
                        {product.avis.length === 0 ? (
                            <p className="text-muted-foreground">
                                No reviews yet. Be the first to write one!
                            </p>
                        ) : (
                            <div className="space-y-6">
                                {product.avis.map((avis) => (
                                    <div
                                        key={avis.id}
                                        className="border-b pb-6"
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
                                                    <span className="font-medium">
                                                        {avis.client}
                                                    </span>
                                                </div>
                                                <p className="mt-2">
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
                        <div className="mt-10">
                            <h3 className="mb-4 text-xl font-semibold">
                                Questions and Answers
                            </h3>
                            <div className="flex items-center gap-4">
                                <MessageCircle className="h-10 w-10 text-muted-foreground" />
                                <p className="text-muted-foreground">
                                    No questions yet. Ask the first question!
                                </p>
                            </div>
                            <Button variant="outline" className="mt-4">
                                Ask a question
                            </Button>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="rounded-lg border p-6">
                            <h3 className="font-semibold">Overall Rating</h3>
                            <div className="mt-3 flex items-baseline gap-2">
                                <span className="text-4xl font-bold">
                                    {ratingStats.average.toFixed(1)}
                                </span>
                                <span className="text-muted-foreground">
                                    out of 5
                                </span>
                            </div>
                            <div className="mt-1 flex">
                                {renderStars(ratingStats.average)}
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {ratingStats.total} verified reviews
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
                                            className="flex items-center gap-2 text-sm"
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
                        <div className="rounded-lg border p-6">
                            <h3 className="font-semibold">Write a review</h3>
                            <div className="mt-4 space-y-4">
                                <div>
                                    <label className="mb-1 block text-sm">
                                        Your Rating
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
                                                    className={`h-6 w-6 ${star <= reviewRating
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'text-gray-300'
                                                        }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <Textarea
                                    placeholder="Share your experience..."
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
                                    Submit Review
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
