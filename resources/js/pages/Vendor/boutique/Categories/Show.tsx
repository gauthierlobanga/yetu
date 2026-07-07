// resources/js/Pages/Shop/Categories/Show.tsx
import { Head, Link, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRight,
    ArrowUpDown,
    Search,
    SlidersHorizontal,
    Star,
    Package,
    TrendingUp,
    Grid3X3,
    List,
    LayoutDashboard,
    X,
    Sparkles,
} from 'lucide-react';
import { useState, useMemo, useCallback } from 'react';
import ProductCard from '@/components/ecommerce/products/ProductCard';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import MainLayout from '@/layouts/main-layout';
import { handleImageFallback, resolveImageUrl } from '@/lib/media';
import { cn } from '@/lib/utils';
import type { Category, Product } from '@/types/ecommerce/products';

interface Props {
    category: Category & {
        description?: string;
        products_count?: number;
        banner?: string;
    };
    products: {
        data: Product[];
        current_page: number;
        last_page: number;
        total?: number;
    };
    subcategories: Category[];
    breadcrumb: Array<{ name: string; url: string }>;
    filters?: { sort?: string; search?: string };
}

type ViewMode = 'grid' | 'list' | 'bento';

export default function CategoryShow({
    category,
    products,
    subcategories,
    breadcrumb,
    filters = {},
}: Props) {
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
    const [minRating, setMinRating] = useState(0);
    const [inStockOnly, setInStockOnly] = useState(false);

    // Filtrage local
    const filteredProducts = useMemo(() => {
        let result = products.data;

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (p) =>
                    p.nom.toLowerCase().includes(q) ||
                    (p.description && p.description.toLowerCase().includes(q)),
            );
        }

        if (inStockOnly) {
            result = result.filter((p) => (p.quantite_stock ?? 0) > 0);
        }

        if (minRating > 0) {
            result = result.filter((p) => (p.note_moyenne ?? 0) >= minRating);
        }

        result = result.filter((p) => {
            const price = p.prix_actuel ?? p.prix_ttc ?? 0;

            return price >= priceRange[0] && price <= priceRange[1];
        });

        return result;
    }, [products.data, searchQuery, inStockOnly, minRating, priceRange]);

    const updateSort = useCallback(
        (value: string) => {
            router.get(
                window.location.pathname,
                { sort: value, search: searchQuery || undefined },
                {
                    preserveState: true,
                    preserveScroll: true,
                    showProgress: false,
                    only: ['products'],
                },
            );
        },
        [searchQuery],
    );

    const applySearch = useCallback(() => {
        router.get(
            window.location.pathname,
            { search: searchQuery || undefined, sort: filters.sort },
            {
                preserveState: true,
                preserveScroll: true,
                showProgress: false,
                only: ['products'],
            },
        );
    }, [searchQuery, filters.sort]);

    const clearSearch = () => {
        setSearchQuery('');
        router.get(
            window.location.pathname,
            { sort: filters.sort },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['products'],
                showProgress: false,
            },
        );
    };

    const totalProducts = products.total ?? products.data.length;
    const totalPages = products.last_page;
    const currentPage = products.current_page;

    const pagesToShow = useMemo(() => {
        const pages: (number | string)[] = [];

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            if (currentPage > 3) {
                pages.push('...');
            }

            for (
                let i = Math.max(2, currentPage - 1);
                i <= Math.min(totalPages - 1, currentPage + 1);
                i++
            ) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push('...');
            }

            pages.push(totalPages);
        }

        return pages;
    }, [totalPages, currentPage]);

    const goToPage = (page: number) => {
        router.get(
            window.location.pathname,
            { page, sort: filters.sort, search: searchQuery || undefined },
            { preserveState: true, preserveScroll: true, showProgress: false },
        );
    };

    const gridClass = {
        grid: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
        list: 'grid-cols-1',
        bento: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    }[viewMode];

    return (
        <MainLayout>
            <Head title={category.nom} />
            <div className="relative min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                {/* Cercles décoratifs */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-emerald-200/20 blur-3xl dark:bg-emerald-900/20" />
                    <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-teal-100/30 blur-3xl dark:bg-teal-900/20" />
                </div>

                <div className="relative z-10 mx-auto max-w-7xl px-4 py-8">
                    {/* Fil d'Ariane */}
                    <nav className="mb-8 flex flex-wrap items-center text-sm font-medium text-slate-500 dark:text-slate-400">
                        <Link
                            href={route('tenant.home')}
                            className="transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
                        >
                            Accueil
                        </Link>
                        {breadcrumb.map((item, idx) => (
                            <span key={idx} className="flex items-center">
                                <ChevronRight className="mx-2 h-4 w-4 text-slate-300 dark:text-slate-600" />
                                {idx === breadcrumb.length - 1 ? (
                                    <span className="text-slate-900 dark:text-white">
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

                    {/* En-tête de catégorie premium – light & dark */}
                    <div className="relative mb-12 overflow-hidden rounded-[3rem] bg-white/80 p-8 shadow-2xl shadow-slate-200/40 backdrop-blur-xl md:p-12 dark:bg-slate-900/80 dark:shadow-black/20">
                        {/* Overlay de fond */}
                        <div className="absolute inset-0">
                            {category.banner ? (
                                <>
                                    <img
                                        src={resolveImageUrl(category.banner)}
                                        alt=""
                                        className="h-full w-full object-cover opacity-30 mix-blend-overlay"
                                        onError={handleImageFallback()}
                                    />
                                    {/* Overlay semi-transparent adapté */}
                                    <div className="absolute inset-0 bg-linear-to-r from-white/95 via-white/70 to-white/40 dark:from-slate-950/90 dark:via-slate-950/60 dark:to-transparent" />
                                </>
                            ) : (
                                /* Dégradé décoratif light / dark */
                                <div className="absolute inset-0 bg-linear-to-br from-emerald-200/80 via-white to-sky-100/70 dark:from-emerald-900/80 dark:via-slate-950 dark:to-slate-950" />
                            )}
                            {/* Cercles animés */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.15, 1],
                                    rotate: [0, 8, 0],
                                }}
                                transition={{
                                    duration: 25,
                                    repeat: Infinity,
                                    ease: 'linear',
                                }}
                                className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-emerald-500/20 blur-[120px] dark:bg-emerald-500/20"
                            />
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    rotate: [0, -8, 0],
                                }}
                                transition={{
                                    duration: 30,
                                    repeat: Infinity,
                                    ease: 'linear',
                                }}
                                className="absolute -bottom-40 left-20 h-96 w-96 rounded-full bg-sky-500/20 blur-[120px] dark:bg-sky-500/20"
                            />
                        </div>

                        {/* Contenu */}
                        <div className="relative z-10 flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
                            <div className="max-w-2xl">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <span className="mb-2 inline-flex items-center gap-1 rounded-full border border-emerald-300/50 bg-emerald-100/80 px-3 py-1 text-xs font-medium text-emerald-700 backdrop-blur-md dark:border-white/20 dark:bg-white/10 dark:text-emerald-300">
                                        <Sparkles className="h-3.5 w-3.5" />{' '}
                                        Collection
                                    </span>
                                    <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl lg:text-6xl dark:text-white">
                                        {category.nom}
                                    </h1>
                                </motion.div>
                                {category.description && (
                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.5,
                                            delay: 0.1,
                                        }}
                                        className="mt-4 text-lg leading-relaxed text-slate-600 dark:text-slate-300"
                                    >
                                        {category.description}
                                    </motion.p>
                                )}
                            </div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="shrink-0"
                            >
                                <div className="flex items-center gap-3 rounded-full border border-slate-300/50 bg-white/70 px-6 py-3 shadow-sm backdrop-blur-lg dark:border-white/20 dark:bg-white/10">
                                    <Package className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
                                    <span className="font-semibold text-slate-800 dark:text-white">
                                        {totalProducts} produit
                                        {totalProducts > 1 ? 's' : ''}
                                    </span>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Sous-catégories */}
                    {subcategories.length > 0 && (
                        <div className="mb-12">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                                    Explorer les sous‑catégories
                                </h2>
                            </div>
                            <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-4">
                                {subcategories.map((sub, idx) => (
                                    <motion.div
                                        key={sub.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="shrink-0"
                                    >
                                        <Link
                                            href={sub.url}
                                            className="group flex items-center gap-3 rounded-full border border-slate-200/60 bg-white py-2 pr-5 pl-2 shadow-sm transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-md dark:border-slate-700 dark:bg-slate-800/80 dark:hover:border-emerald-700 dark:hover:bg-emerald-900/30"
                                        >
                                            <div className="h-9 w-9 overflow-hidden rounded-full border border-slate-100 bg-slate-100 transition-transform duration-300 group-hover:scale-110 dark:border-slate-700 dark:bg-slate-700">
                                                {sub.image ? (
                                                    <img
                                                        src={resolveImageUrl(
                                                            sub.image,
                                                        )}
                                                        alt={sub.nom}
                                                        className="h-full w-full object-cover"
                                                        onError={handleImageFallback()}
                                                    />
                                                ) : (
                                                    <Grid3X3 className="m-auto mt-2.5 h-4 w-4 text-slate-400" />
                                                )}
                                            </div>
                                            <span className="text-sm font-medium text-slate-700 transition-colors group-hover:text-emerald-700 dark:text-slate-300 dark:group-hover:text-emerald-400">
                                                {sub.nom}
                                            </span>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Barre d'outils flottante */}
                    <div className="sticky top-16 z-20 mb-8 rounded-2xl border border-white/40 bg-white/70 p-4 shadow-lg backdrop-blur-xl transition-all dark:border-slate-700/30 dark:bg-slate-900/70">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div className="relative flex-1 sm:max-w-md">
                                <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    placeholder="Rechercher dans cette catégorie..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    onKeyDown={(e) =>
                                        e.key === 'Enter' && applySearch()
                                    }
                                    className="h-12 rounded-xl border-slate-200 bg-white/80 pr-12 pl-11 text-sm shadow-sm transition-all hover:border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900/50 dark:text-white"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={clearSearch}
                                        className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-slate-100 p-1.5 text-slate-400 transition-colors hover:text-slate-600 dark:bg-slate-800 dark:hover:text-slate-300"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                )}
                            </div>
                            <div className="flex items-center gap-3">
                                <Select
                                    value={filters.sort || 'newest'}
                                    onValueChange={updateSort}
                                >
                                    <SelectTrigger className="h-12 w-44 rounded-xl border-slate-200 bg-white/80 text-sm shadow-sm transition-all hover:border-emerald-300 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200">
                                        <ArrowUpDown className="mr-2 h-4 w-4 text-slate-500" />
                                        <SelectValue placeholder="Trier" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/90">
                                        <SelectItem value="newest">
                                            Nouveautés
                                        </SelectItem>
                                        <SelectItem value="popular">
                                            Popularité
                                        </SelectItem>
                                        <SelectItem value="price_asc">
                                            Prix croissant
                                        </SelectItem>
                                        <SelectItem value="price_desc">
                                            Prix décroissant
                                        </SelectItem>
                                        <SelectItem value="rating">
                                            Meilleure note
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                <div className="hidden items-center rounded-xl border border-white/40 bg-slate-50/70 p-1 backdrop-blur-md md:flex dark:border-slate-700/30 dark:bg-slate-800/70">
                                    {(
                                        ['grid', 'list', 'bento'] as ViewMode[]
                                    ).map((mode) => (
                                        <button
                                            key={mode}
                                            onClick={() => setViewMode(mode)}
                                            className={cn(
                                                'relative rounded-lg p-2 transition-all duration-300',
                                                viewMode === mode
                                                    ? 'text-emerald-700 dark:text-emerald-400'
                                                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200',
                                            )}
                                        >
                                            {viewMode === mode && (
                                                <motion.div
                                                    layoutId="viewModeBgCatShow"
                                                    className="absolute inset-0 rounded-lg bg-white shadow-sm dark:bg-slate-700"
                                                    initial={false}
                                                    transition={{
                                                        type: 'spring',
                                                        bounce: 0.2,
                                                        duration: 0.6,
                                                    }}
                                                />
                                            )}
                                            <span className="relative z-10">
                                                {mode === 'grid' && (
                                                    <Grid3X3 className="h-4 w-4" />
                                                )}
                                                {mode === 'list' && (
                                                    <List className="h-4 w-4" />
                                                )}
                                                {mode === 'bento' && (
                                                    <LayoutDashboard className="h-4 w-4" />
                                                )}
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                <Sheet
                                    open={mobileFiltersOpen}
                                    onOpenChange={setMobileFiltersOpen}
                                >
                                    <SheetTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="h-12 rounded-xl md:hidden"
                                        >
                                            <SlidersHorizontal className="mr-2 h-4 w-4" />{' '}
                                            Filtres
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent
                                        side="right"
                                        className="w-full sm:w-96"
                                    >
                                        <SheetHeader>
                                            <SheetTitle>Filtres</SheetTitle>
                                        </SheetHeader>
                                        <div className="mt-6 space-y-8">
                                            <div>
                                                <Label className="text-sm font-semibold">
                                                    Prix (CDF)
                                                </Label>
                                                <div className="mt-4 flex items-center gap-4">
                                                    <span className="w-16 rounded-lg bg-slate-100 p-2 text-center text-xs font-medium dark:bg-slate-800">
                                                        {priceRange[0]}
                                                    </span>
                                                    <Slider
                                                        min={0}
                                                        max={5000}
                                                        step={10}
                                                        value={priceRange}
                                                        onValueChange={(v) =>
                                                            setPriceRange([
                                                                v[0],
                                                                v[1],
                                                            ])
                                                        }
                                                        className="flex-1"
                                                    />
                                                    <span className="w-16 rounded-lg bg-slate-100 p-2 text-center text-xs font-medium dark:bg-slate-800">
                                                        {priceRange[1]}
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <Label className="text-sm font-semibold">
                                                    Note minimum
                                                </Label>
                                                <div className="mt-3 flex gap-2">
                                                    {[1, 2, 3, 4, 5].map(
                                                        (star) => (
                                                            <button
                                                                key={star}
                                                                onClick={() =>
                                                                    setMinRating(
                                                                        star ===
                                                                            minRating
                                                                            ? 0
                                                                            : star,
                                                                    )
                                                                }
                                                                className={cn(
                                                                    'rounded-full p-2 transition-all hover:bg-slate-100 dark:hover:bg-slate-800',
                                                                    star <=
                                                                        minRating
                                                                        ? 'text-amber-400'
                                                                        : 'text-slate-300 dark:text-slate-600',
                                                                )}
                                                            >
                                                                <Star className="h-6 w-6 fill-current" />
                                                            </button>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                                                <Checkbox
                                                    id="inStock"
                                                    checked={inStockOnly}
                                                    onCheckedChange={(c) =>
                                                        setInStockOnly(!!c)
                                                    }
                                                />
                                                <Label
                                                    htmlFor="inStock"
                                                    className="cursor-pointer font-medium"
                                                >
                                                    En stock uniquement
                                                </Label>
                                            </div>
                                            <Button
                                                className="w-full rounded-xl bg-emerald-600 py-6 text-base font-semibold text-white hover:bg-emerald-700"
                                                onClick={() =>
                                                    setMobileFiltersOpen(false)
                                                }
                                            >
                                                Appliquer les filtres
                                            </Button>
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>
                        </div>
                    </div>

                    {/* Résultats */}
                    <div className="min-h-120">
                        {filteredProducts.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center rounded-[3rem] border border-dashed border-slate-300 bg-white/60 py-20 text-center backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/60"
                            >
                                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                                    <Package className="h-12 w-12 text-slate-400 dark:text-slate-500" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    Aucun produit trouvé
                                </h3>
                                <p className="mt-2 max-w-md text-slate-500 dark:text-slate-400">
                                    Essayez d'ajuster vos filtres ou votre
                                    recherche pour trouver ce que vous cherchez.
                                </p>
                                <div className="mt-8 flex gap-3">
                                    <Link
                                        href={route('tenant.product.index')}
                                        className="inline-flex h-12 items-center justify-center rounded-full bg-emerald-600 px-6 font-medium text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-700 hover:shadow-xl"
                                    >
                                        Voir tous les produits{' '}
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Link>
                                    <Button
                                        variant="outline"
                                        asChild
                                        className="h-12 rounded-full px-6"
                                    >
                                        <Link
                                            href={route(
                                                'tenant.product.category.index',
                                            )}
                                        >
                                            Explorer les catégories
                                        </Link>
                                    </Button>
                                </div>
                            </motion.div>
                        ) : (
                            <>
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={viewMode}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={`grid gap-4 sm:gap-6 ${gridClass}`}
                                    >
                                        {filteredProducts.map(
                                            (product, index) => (
                                                <motion.div
                                                    key={product.id}
                                                    initial={{
                                                        opacity: 0,
                                                        y: 20,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    transition={{
                                                        delay: index * 0.05,
                                                        duration: 0.4,
                                                    }}
                                                    className={
                                                        viewMode === 'bento' &&
                                                        (index === 0 ||
                                                            index === 4)
                                                            ? 'sm:col-span-2 sm:row-span-2'
                                                            : ''
                                                    }
                                                >
                                                    <ProductCard
                                                        product={product}
                                                        viewMode={
                                                            viewMode === 'list'
                                                                ? 'list'
                                                                : 'grid'
                                                        }
                                                    />
                                                </motion.div>
                                            ),
                                        )}
                                    </motion.div>
                                </AnimatePresence>

                                {totalPages > 1 && (
                                    <div className="mt-16 flex justify-center">
                                        <nav
                                            className="flex items-center gap-2"
                                            aria-label="Pagination"
                                        >
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() =>
                                                    goToPage(currentPage - 1)
                                                }
                                                disabled={currentPage === 1}
                                                className="h-12 w-12 rounded-full border-slate-200 transition-all hover:border-emerald-300 hover:text-emerald-600 dark:border-slate-700 dark:hover:border-emerald-700"
                                            >
                                                <ChevronRight className="h-5 w-5 rotate-180" />
                                            </Button>
                                            <div className="flex items-center gap-1">
                                                {pagesToShow.map((page, idx) =>
                                                    page === '...' ? (
                                                        <span
                                                            key={`dots-${idx}`}
                                                            className="px-3 text-slate-400"
                                                        >
                                                            ...
                                                        </span>
                                                    ) : (
                                                        <button
                                                            key={page}
                                                            onClick={() =>
                                                                goToPage(
                                                                    page as number,
                                                                )
                                                            }
                                                            className={cn(
                                                                'h-12 min-w-12 rounded-full px-4 text-sm font-medium transition-all',
                                                                page ===
                                                                    currentPage
                                                                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                                                                    : 'bg-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                                                            )}
                                                        >
                                                            {page}
                                                        </button>
                                                    ),
                                                )}
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() =>
                                                    goToPage(currentPage + 1)
                                                }
                                                disabled={
                                                    currentPage === totalPages
                                                }
                                                className="h-12 w-12 rounded-full border-slate-200 transition-all hover:border-emerald-300 hover:text-emerald-600 dark:border-slate-700 dark:hover:border-emerald-700"
                                            >
                                                <ChevronRight className="h-5 w-5" />
                                            </Button>
                                        </nav>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Section "À ne pas manquer" */}
                    {products.data.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-100px' }}
                            className="mt-24 overflow-hidden rounded-[3rem] bg-white/60 p-8 shadow-lg backdrop-blur-xl sm:p-12 dark:bg-slate-900/60"
                        >
                            <div className="mb-10 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold tracking-wider text-emerald-700 uppercase dark:border-emerald-800/50 dark:bg-emerald-900/30 dark:text-emerald-400">
                                        <TrendingUp className="h-4 w-4" />{' '}
                                        Populaires
                                    </span>
                                    <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                        À ne pas manquer
                                    </h2>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
                                {products.data
                                    .slice(0, 4)
                                    .map((product, idx) => (
                                        <motion.div
                                            key={product.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: idx * 0.1 }}
                                        >
                                            <ProductCard product={product} />
                                        </motion.div>
                                    ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
