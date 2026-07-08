/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/Pages/Products/Show.tsx
import { Head, Link, useForm, router } from '@inertiajs/react';
import {
    motion,
    AnimatePresence,
    useScroll,
    useTransform,
} from 'framer-motion';
import {
    Heart,
    Share2,
    ShoppingCart,
    Star,
    ChevronRight,
    Minus,
    Plus,
    Package,
    Truck,
    ShieldCheck,
    CheckCircle2,
    AlertCircle,
    X,
    ChevronLeft,
    Expand,
    Tag,
    Ruler,
    Layers,
    Info,
} from 'lucide-react';
import { useState, useMemo, useRef } from 'react';
import { toast } from 'sonner';
import ProductCard from '@/components/ecommerce/products/ProductCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogOverlay,
    DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MainLayout from '@/layouts/main-layout';
import { handleImageFallback, resolveImageUrl } from '@/lib/media';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/ecommerce/products';
import { ReviewsSection } from './avis/avis-clients';

interface Props extends Record<string, unknown> {
    product: Product;
    similarProducts: Product[];
    breadcrumbs: Array<{ name: string; url: string }>;
    vendorSettings: any;
    isInWishlist: boolean;
}

export default function ProductShow({
    product,
    similarProducts,
    breadcrumbs = [],
    vendorSettings,
    isInWishlist: initialWishlistStatus,
}: Props) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [isInWishlist, setIsInWishlist] = useState(initialWishlistStatus);
    const [isWishlistLoading, setIsWishlistLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end start'],
    });

    const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    const { data, setData, post, processing } = useForm({
        product_id: product.id,
        quantite: 1,
        attributs: {},
    });

    const quantity = data.quantite;
    const setQuantity = (updater: number | ((prev: number) => number)) => {
        setData(
            'quantite',
            typeof updater === 'function' ? updater(data.quantite) : updater,
        );
    };

    const addToCart = () => {
        post(route('tenant.cart.add', product.id), {
            preserveScroll: true,
            preserveState: true,
            showProgress: false,
            onSuccess: () =>
                toast.success('Produit ajouté au panier', {
                    icon: '🛍️',
                    className:
                        'bg-emerald-50 text-emerald-900 border-emerald-200',
                }),
            onError: () => toast.error("Erreur lors de l'ajout au panier"),
        });
    };

    const toggleWishlist = () => {
        if (isWishlistLoading) {
            return;
        }

        setIsWishlistLoading(true);
        const routeName = isInWishlist
            ? 'tenant.wishlist.remove'
            : 'tenant.wishlist.add';
        router.post(
            route(routeName),
            { product_id: product.id },
            {
                preserveScroll: true,
                preserveState: true,
                showProgress: false,
                onSuccess: () => {
                    setIsInWishlist(!isInWishlist);
                    toast.success(
                        isInWishlist
                            ? 'Retiré des favoris'
                            : 'Ajouté aux favoris',
                        { icon: isInWishlist ? '💔' : '❤️' },
                    );
                    setIsWishlistLoading(false);
                },
                onError: () => {
                    toast.error('Une erreur est survenue');
                    setIsWishlistLoading(false);
                },
            },
        );
    };

    const inStock = (product.quantite_stock ?? 0) > 0;
    const isLowStock = (product.quantite_stock ?? 0) <= 5 && inStock;

    const discountPercentage = useMemo(() => {
        if (
            !product.prix_ttc ||
            !product.prix_actuel ||
            product.prix_actuel >= product.prix_ttc
        ) {
            return 0;
        }

        return Math.round(
            ((product.prix_ttc - product.prix_actuel) / product.prix_ttc) * 100,
        );
    }, [product.prix_ttc, product.prix_actuel]);

    // Images uniques (sans doublon)
    const images = useMemo(() => {
        const urls = new Set<string>();
        const result: string[] = [];
        const add = (img: any) => {
            if (!img) {
                return;
            }

            const url = resolveImageUrl(img);

            if (url && !urls.has(url)) {
                urls.add(url);
                result.push(url);
            }
        };
        add(product.image_principale);

        if (product.images && Array.isArray(product.images)) {
            product.images.forEach((img) => {
                if (typeof img === 'string') {
                    add(img);
                } else if (img.large || img.medium) {
                    add(img.large || img.medium);
                }
            });
        }

        return result.length > 0 ? result : ['/placeholder.png'];
    }, [product]);

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };
    const nextImage = () =>
        setLightboxIndex((prev) => (prev + 1) % images.length);
    const prevImage = () =>
        setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);

    return (
        <MainLayout>
            <Head title={product.nom} />
            <div className="bg-slate-50 dark:bg-slate-950" ref={containerRef}>
                {/* Breadcrumb */}
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <nav className="flex flex-wrap items-center text-sm font-medium text-slate-500 dark:text-slate-400">
                        <Link
                            href="/"
                            className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
                        >
                            Accueil
                        </Link>
                        {breadcrumbs.map((item, idx) => (
                            <span key={idx} className="flex items-center">
                                <ChevronRight className="mx-2 h-4 w-4 text-slate-300 dark:text-slate-600" />
                                {idx === breadcrumbs.length - 1 ? (
                                    <span className="max-w-50 truncate text-slate-900 dark:text-white">
                                        {item.name}
                                    </span>
                                ) : (
                                    <Link
                                        href={item.url}
                                        className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
                                    >
                                        {item.name}
                                    </Link>
                                )}
                            </span>
                        ))}
                    </nav>
                </div>

                {/* Product Section */}
                <div className="mx-auto max-w-7xl px-6 pb-16 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
                        {/* Galerie moderne */}
                        <div className="relative mb-10 lg:mb-0">
                            <motion.div
                                style={{ y, opacity }}
                                className="sticky top-24"
                            >
                                <div className="flex gap-4 lg:gap-6">
                                    {/* Colonne de miniatures */}
                                    {images.length > 1 && (
                                        <div className="hidden max-h-125 scrollbar-thin p-3 scrollbar-thumb-slate-300 scrollbar-track-slate-100 flex-col gap-3 overflow-y-auto pr-2 md:flex dark:scrollbar-thumb-slate-700 dark:scrollbar-track-slate-900">
                                            {images.map((img, idx) => (
                                                <button
                                                    key={idx}
                                                    onMouseEnter={() =>
                                                        setSelectedImage(idx)
                                                    }
                                                    onClick={() =>
                                                        openLightbox(idx)
                                                    }
                                                    className={cn(
                                                        'relative h-20 w-20 shrink-0 overflow-hidden rounded-xl transition-all duration-300',
                                                        selectedImage === idx
                                                            ? 'scale-105 opacity-100 ring-1 ring-emerald-300 ring-offset-1 dark:ring-offset-slate-950'
                                                            : 'opacity-60 hover:scale-105 hover:opacity-90',
                                                    )}
                                                >
                                                    <img
                                                        src={img}
                                                        alt={`${product.nom} ${idx + 1}`}
                                                        className="h-full w-full object-cover"
                                                        onError={handleImageFallback()}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {/* Image principale */}
                                    <div className="flex-1">
                                        <div
                                            onClick={() =>
                                                openLightbox(selectedImage)
                                            }
                                            className="group relative aspect-square w-full cursor-pointer overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-900 dark:shadow-none"
                                            style={{ perspective: '1000px' }}
                                        >
                                            <AnimatePresence mode="wait">
                                                <motion.img
                                                    key={selectedImage}
                                                    initial={{
                                                        opacity: 0,
                                                        scale: 1.05,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        scale: 1,
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        scale: 1.05,
                                                    }}
                                                    transition={{
                                                        duration: 0.3,
                                                    }}
                                                    src={images[selectedImage]}
                                                    alt={product.nom}
                                                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                                    onError={handleImageFallback()}
                                                />
                                            </AnimatePresence>
                                            <div className="absolute right-4 bottom-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-slate-700 opacity-0 shadow-lg backdrop-blur-md transition-opacity group-hover:opacity-100 dark:bg-slate-900/80 dark:text-slate-300">
                                                <Expand className="h-5 w-5" />
                                            </div>
                                            <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
                                                {discountPercentage > 0 && (
                                                    <Badge className="border-transparent bg-rose-500 px-3 py-1.5 text-sm font-bold text-white shadow-lg shadow-rose-500/30">
                                                        -{discountPercentage}%
                                                    </Badge>
                                                )}
                                                {product.is_nouveau && (
                                                    <Badge className="border-transparent bg-emerald-500 px-3 py-1.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/30">
                                                        Nouveau
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="absolute top-6 right-6 z-10 flex flex-col gap-3">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleWishlist();
                                                    }}
                                                    disabled={isWishlistLoading}
                                                    className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow-xl backdrop-blur-md transition-colors hover:bg-white hover:text-rose-500 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:text-rose-400"
                                                >
                                                    <Heart
                                                        className={cn(
                                                            'h-5 w-5',
                                                            isInWishlist &&
                                                                'fill-rose-500 text-rose-500',
                                                        )}
                                                    />
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow-xl backdrop-blur-md transition-colors hover:bg-white hover:text-sky-500 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:text-sky-400"
                                                >
                                                    <Share2 className="h-5 w-5" />
                                                </motion.button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Miniatures mobiles */}
                                {images.length > 1 && (
                                    <div className="scrollbar-hide mt-4 flex gap-3 overflow-x-auto pb-2 md:hidden">
                                        {images.map((img, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() =>
                                                    setSelectedImage(idx)
                                                }
                                                className={cn(
                                                    'h-16 w-16 shrink-0 overflow-hidden rounded-xl',
                                                    selectedImage === idx
                                                        ? 'ring-2 ring-emerald-500 ring-offset-1'
                                                        : 'opacity-60',
                                                )}
                                            >
                                                <img
                                                    src={img}
                                                    alt=""
                                                    className="h-full w-full object-cover"
                                                    onError={handleImageFallback()}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        </div>

                        {/* Lightbox élargie */}
                        <Dialog
                            open={lightboxOpen}
                            onOpenChange={setLightboxOpen}
                        >
                            <DialogOverlay className="bg-black/60 backdrop-blur-lg" />
                            <DialogContent className="flex h-[95vh] w-[95vw] max-w-[95vw] items-center justify-center border-0 bg-transparent p-0">
                                <DialogTitle className="sr-only">
                                    Galerie d'images
                                </DialogTitle>
                                <div className="relative flex h-full w-full items-center justify-center">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setLightboxOpen(false)}
                                        className="absolute top-4 right-4 z-50 h-10 w-10 rounded-full bg-white/20 text-white hover:bg-white/40"
                                    >
                                        <X className="h-6 w-6" />
                                    </Button>
                                    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
                                        <AnimatePresence mode="wait">
                                            <motion.img
                                                key={lightboxIndex}
                                                initial={{
                                                    opacity: 0,
                                                    rotateY: 90,
                                                    scale: 0.9,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    rotateY: 0,
                                                    scale: 1,
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    rotateY: -90,
                                                    scale: 0.9,
                                                }}
                                                transition={{
                                                    type: 'spring',
                                                    stiffness: 200,
                                                    damping: 24,
                                                }}
                                                src={images[lightboxIndex]}
                                                alt={`Image ${lightboxIndex + 1}`}
                                                className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl"
                                                onError={handleImageFallback()}
                                            />
                                        </AnimatePresence>
                                    </div>
                                    {images.length > 1 && (
                                        <>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={prevImage}
                                                className="absolute top-1/2 left-4 h-12 w-12 -translate-y-1/2 rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-white/30"
                                            >
                                                <ChevronLeft className="h-8 w-8" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={nextImage}
                                                className="absolute top-1/2 right-4 h-12 w-12 -translate-y-1/2 rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-white/30"
                                            >
                                                <ChevronRight className="h-8 w-8" />
                                            </Button>
                                        </>
                                    )}
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-md">
                                        {lightboxIndex + 1} / {images.length}
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>

                        {/* Product Info */}
                        <div className="flex flex-col pt-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                {product.brand && (
                                    <Link
                                        href={route('tenant.product.index', {
                                            brand: product.brand.id,
                                        })}
                                        className="mb-2 inline-block font-semibold tracking-wider text-emerald-600 uppercase hover:underline dark:text-emerald-400"
                                    >
                                        {product.brand.nom}
                                    </Link>
                                )}
                                <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl lg:text-3xl dark:text-white">
                                    {product.nom}
                                </h1>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="mt-4 flex flex-wrap items-center gap-4"
                            >
                                {(product.note_moyenne ?? 0) > 0 && (
                                    <div className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">
                                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                        <span className="font-bold text-slate-900 dark:text-white">
                                            {product.note_moyenne}
                                        </span>
                                        <span className="text-sm text-slate-500 dark:text-slate-400">
                                            ({product.nombre_avis} avis)
                                        </span>
                                    </div>
                                )}
                                {product.sku && (
                                    <div className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                                        Ref:{' '}
                                        <span className="font-mono">
                                            {product.sku}
                                        </span>
                                    </div>
                                )}
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="mt-8 flex items-end gap-4"
                            >
                                <span className="text-2xl font-semibold text-slate-900 sm:text-2xl dark:text-white">
                                    {product.prix_actuel?.toLocaleString(
                                        'fr-CD',
                                    )}{' '}
                                    CDF
                                </span>
                                {product.prix_ttc &&
                                    product.prix_actuel &&
                                    product.prix_actuel < product.prix_ttc && (
                                        <span className="mb-1 text-2xl font-medium text-slate-400 line-through dark:text-slate-500">
                                            {product.prix_ttc.toLocaleString(
                                                'fr-CD',
                                            )}{' '}
                                            CDF
                                        </span>
                                    )}
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="mt-6"
                            >
                                {inStock ? (
                                    <div className="flex items-center gap-2">
                                        <span className="relative flex h-3 w-3">
                                            <span
                                                className={cn(
                                                    'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
                                                    isLowStock
                                                        ? 'bg-amber-400'
                                                        : 'bg-emerald-400',
                                                )}
                                            />
                                            <span
                                                className={cn(
                                                    'relative inline-flex h-3 w-3 rounded-full',
                                                    isLowStock
                                                        ? 'bg-amber-500'
                                                        : 'bg-emerald-500',
                                                )}
                                            />
                                        </span>
                                        <span
                                            className={cn(
                                                'font-medium',
                                                isLowStock
                                                    ? 'text-amber-600 dark:text-amber-400'
                                                    : 'text-emerald-600 dark:text-emerald-400',
                                            )}
                                        >
                                            {isLowStock
                                                ? `Plus que ${product.quantite_stock} en stock !`
                                                : 'En stock et prêt à être expédié'}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="h-5 w-5 text-rose-500" />
                                        <span className="font-medium text-rose-600 dark:text-rose-400">
                                            Rupture de stock temporaire
                                        </span>
                                    </div>
                                )}
                            </motion.div>

                            <hr className="my-8 border-slate-200 dark:border-slate-800" />

                            {inStock && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="space-y-6"
                                >
                                    <div>
                                        <label className="text-sm font-semibold text-slate-900 dark:text-white">
                                            Quantité
                                        </label>
                                        <div className="mt-2 flex items-center">
                                            <div className="flex items-center rounded-full border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
                                                <button
                                                    onClick={() =>
                                                        setQuantity(
                                                            (q: number) =>
                                                                Math.max(
                                                                    1,
                                                                    q - 1,
                                                                ),
                                                        )
                                                    }
                                                    disabled={quantity <= 1}
                                                    className="flex h-14 w-14 items-center justify-center rounded-l-full text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:hover:bg-slate-800"
                                                >
                                                    <Minus className="h-5 w-5" />
                                                </button>
                                                <div className="flex h-14 w-16 items-center justify-center text-xl font-semibold text-slate-900 dark:text-white">
                                                    {quantity}
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        setQuantity(
                                                            (q: number) =>
                                                                Math.min(
                                                                    product.quantite_stock ??
                                                                        99,
                                                                    q + 1,
                                                                ),
                                                        )
                                                    }
                                                    disabled={
                                                        quantity >=
                                                        (product.quantite_stock ??
                                                            99)
                                                    }
                                                    className="flex h-14 w-14 items-center justify-center rounded-r-full text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:hover:bg-slate-800"
                                                >
                                                    <Plus className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={addToCart}
                                        disabled={processing}
                                        className="relative h-16 w-full overflow-hidden rounded-full bg-slate-900 text-xl font-bold text-white transition-transform active:scale-95 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
                                    >
                                        <div className="absolute inset-0 flex items-center justify-center bg-white/20 transition-transform group-hover:translate-x-full" />
                                        <ShoppingCart className="mr-2 h-6 w-6" />
                                        Ajouter au panier
                                    </Button>
                                </motion.div>
                            )}

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2"
                            >
                                {[
                                    {
                                        icon: Truck,
                                        title: 'Livraison rapide',
                                        desc: 'Expédition sous 24h',
                                    },
                                    {
                                        icon: ShieldCheck,
                                        title: 'Paiement sécurisé',
                                        desc: 'Transactions chiffrées',
                                    },
                                    {
                                        icon: Package,
                                        title: 'Retours faciles',
                                        desc: 'Sous 14 jours',
                                    },
                                    {
                                        icon: CheckCircle2,
                                        title: 'Qualité garantie',
                                        desc: 'Testé et approuvé',
                                    },
                                ].map((feature, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-xs dark:bg-slate-900"
                                    >
                                        <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                            <feature.icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900 dark:text-white">
                                                {feature.title}
                                            </h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                {feature.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Tabs avec détails modernisés */}
                <div className="mx-auto max-w-7xl border-t border-slate-200/50 px-4 py-16 sm:px-6 lg:px-8 dark:border-slate-800/50">
                    <Tabs defaultValue="description" className="w-full">
                        <TabsList className="mb-8 w-full justify-start rounded-full bg-slate-100 p-1 sm:w-auto dark:bg-slate-900">
                            <TabsTrigger
                                value="description"
                                className="rounded-full px-6 py-2 text-base font-medium data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-emerald-400"
                            >
                                Description
                            </TabsTrigger>
                            <TabsTrigger
                                value="details"
                                className="rounded-full px-6 py-2 text-base font-medium data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-emerald-400"
                            >
                                Spécifications
                            </TabsTrigger>
                            <TabsTrigger
                                value="reviews"
                                className="rounded-full px-6 py-2 text-base font-medium data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-emerald-400"
                            >
                                Avis ({product.nombre_avis ?? 0})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent
                            value="description"
                            className="mt-0 outline-none"
                        >
                            <div className="prose prose-sm max-w-none rounded-[2rem] bg-white p-8 shadow-xs sm:p-12 dark:bg-slate-900 dark:prose-invert prose-p:leading-relaxed prose-a:text-emerald-600">
                                {product.description ? (
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: product.description,
                                        }}
                                    />
                                ) : (
                                    <p className="text-slate-500 italic">
                                        Aucune description disponible pour ce
                                        produit.
                                    </p>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent
                            value="details"
                            className="mt-0 outline-none"
                        >
                            <div className="rounded-[2rem] bg-white p-8 shadow-xs sm:p-12 dark:bg-slate-900">
                                <h3 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
                                    Caractéristiques techniques
                                </h3>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                                        <div className="mt-0.5 rounded-xl bg-blue-50 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                            <Tag className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <dt className="text-xs font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                                Marque
                                            </dt>
                                            <dd className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-white">
                                                {product.brand && (
                                                    <Link
                                                        href={route(
                                                            'tenant.product.index',
                                                            {
                                                                brand: product
                                                                    .brand.id,
                                                            },
                                                        )}
                                                        className="mb-2 inline-block font-semibold tracking-wider text-emerald-600 uppercase hover:underline dark:text-emerald-400"
                                                    >
                                                        {product.brand.nom}
                                                    </Link>
                                                )}
                                            </dd>
                                        </div>
                                    </div>
                                    {product.sku && (
                                        <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                                            <div className="mt-0.5 rounded-xl bg-purple-50 p-2 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                                                <Ruler className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <dt className="text-xs font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                                    SKU
                                                </dt>
                                                <dd className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-white">
                                                    {product.sku}
                                                </dd>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                                        <div className="mt-0.5 rounded-xl bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                            <CheckCircle2 className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <dt className="text-xs font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                                Disponibilité
                                            </dt>
                                            <dd className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-white">
                                                {inStock
                                                    ? 'En stock'
                                                    : 'Rupture'}
                                            </dd>
                                        </div>
                                    </div>
                                    {product.poids && (
                                        <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
                                            <div className="mt-0.5 rounded-xl bg-amber-50 p-2 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                                                <Layers className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <dt className="text-xs font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                                    Poids
                                                </dt>
                                                <dd className="mt-0.5 text-sm font-semibold text-slate-900 dark:text-white">
                                                    {product.poids} kg
                                                </dd>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent
                            value="reviews"
                            className="mt-0 outline-none"
                        >
                            <div className="rounded-[2rem] bg-white p-8 shadow-xs sm:p-12 dark:bg-slate-900">
                                <ReviewsSection
                                    productId={product.id}
                                    avis={product.avis || []}
                                />
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Similar Products */}
                {similarProducts && similarProducts.length > 0 && (
                    <div className="border-t border-slate-200/50 bg-white py-16 dark:border-slate-800/50 dark:bg-slate-900">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="mb-10 flex items-end justify-between">
                                <div>
                                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                        Vous aimerez aussi
                                    </h2>
                                    <p className="mt-2 text-slate-500 dark:text-slate-400">
                                        Découvrez d'autres articles similaires
                                        de notre collection.
                                    </p>
                                </div>
                                <Link
                                    href={route('tenant.product.index')}
                                    className="hidden text-sm font-semibold text-emerald-600 hover:text-emerald-500 sm:block dark:text-emerald-400 dark:hover:text-emerald-300"
                                >
                                    Voir tout &rarr;
                                </Link>
                            </div>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
                                {similarProducts.slice(0, 4).map((item) => (
                                    <motion.div
                                        key={item.id}
                                        whileHover={{ y: -5 }}
                                    >
                                        <ProductCard product={item} />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
