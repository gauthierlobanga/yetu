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
                only: ['products'],
            },
        );
    }, [searchQuery, filters.sort]);

    const clearSearch = () => {
        setSearchQuery('');
        router.get(
            window.location.pathname,
            { sort: filters.sort },
            { preserveState: true, preserveScroll: true, only: ['products'] },
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
            { preserveState: true, preserveScroll: true },
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

            <div className="mx-auto max-w-7xl px-4 py-8">
                {/* Modernized Breadcrumb */}
                <nav className="mb-8 flex flex-wrap items-center text-sm font-medium text-slate-500 dark:text-slate-400">
                    <Link
                        href="/"
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

                {/* Premium Category Header */}
                <div className="relative mb-12 overflow-hidden rounded-[2.5rem] bg-slate-950 p-8 shadow-2xl shadow-slate-200/50 md:p-12 dark:shadow-none">
                    {/* Background layers */}
                    {category.banner ? (
                        <div className="absolute inset-0">
                            <img
                                src={resolveImageUrl(category.banner)}
                                alt=""
                                className="h-full w-full object-cover opacity-40 mix-blend-overlay"
                                onError={handleImageFallback()}
                            />
                            <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/80 to-transparent" />
                        </div>
                    ) : (
                        <div className="absolute inset-0">
                            <div className="absolute inset-0 bg-linear-to-br from-emerald-900/40 via-slate-950 to-slate-950" />
                            <motion.div
                                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-emerald-500/20 blur-[100px]"
                            />
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 0] }}
                                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                                className="absolute -bottom-40 left-20 h-96 w-96 rounded-full bg-sky-500/20 blur-[100px]"
                            />
                        </div>
                    )}

                    <div className="relative z-10 flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
                        <div className="max-w-2xl">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
                                    {category.nom}
                                </h1>
                            </motion.div>

                            {category.description && (
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    className="mt-4 text-lg leading-relaxed text-slate-300"
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
                            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-5 py-2.5 backdrop-blur-md">
                                <Package className="h-5 w-5 text-emerald-400" />
                                <span className="font-medium text-white">
                                    {totalProducts} produit{totalProducts > 1 ? 's' : ''}
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Subcategories (Pills) */}
                {subcategories.length > 0 && (
                    <div className="mb-12">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
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
                                        className="group flex items-center gap-3 rounded-full border border-slate-200/60 bg-white py-1.5 pr-4 pl-1.5 shadow-xs transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-emerald-800 dark:hover:bg-emerald-900/30"
                                    >
                                        <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full border border-slate-100 bg-slate-100 transition-transform duration-300 group-hover:scale-110 dark:border-slate-700 dark:bg-slate-800">
                                            {sub.image ? (
                                                <img
                                                    src={resolveImageUrl(sub.image)}
                                                    alt={sub.nom}
                                                    className="h-full w-full object-cover"
                                                    onError={handleImageFallback()}
                                                />
                                            ) : (
                                                <Grid3X3 className="m-auto mt-2 h-4 w-4 text-slate-400" />
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

                {/* Sticky Glass Toolbar */}
                <div className="sticky top-16 z-20 mb-8 rounded-2xl border border-slate-200/80 bg-white/80 p-3 shadow-xs backdrop-blur-xl transition-all dark:border-slate-800/80 dark:bg-slate-900/80">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="relative flex-1 sm:max-w-md">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                placeholder="Rechercher dans cette catégorie..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && applySearch()}
                                className="h-10 rounded-xl border-slate-200 bg-white/80 pr-10 pl-9 transition-all hover:border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900/50"
                            />
                            {searchQuery && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-slate-100 p-1 text-slate-400 transition-colors hover:text-slate-600 dark:bg-slate-800 dark:hover:text-slate-300"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <Select value={filters.sort || 'newest'} onValueChange={updateSort}>
                                <SelectTrigger className="h-10 w-40 rounded-xl border-slate-200 bg-white/80 transition-all hover:border-emerald-300 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900/50">
                                    <ArrowUpDown className="mr-2 h-4 w-4 text-slate-500" />
                                    <SelectValue placeholder="Trier" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="newest">Nouveautés</SelectItem>
                                    <SelectItem value="popular">Popularité</SelectItem>
                                    <SelectItem value="price_asc">Prix croissant</SelectItem>
                                    <SelectItem value="price_desc">Prix décroissant</SelectItem>
                                    <SelectItem value="rating">Meilleure note</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="hidden items-center rounded-xl border border-slate-200 bg-slate-50/80 p-1 backdrop-blur-md md:flex dark:border-slate-700 dark:bg-slate-800/80">
                                {(['grid', 'list', 'bento'] as ViewMode[]).map((mode) => (
                                    <button
                                        key={mode}
                                        onClick={() => setViewMode(mode)}
                                        className={cn(
                                            "relative rounded-lg p-2 transition-all duration-300",
                                            viewMode === mode
                                                ? 'text-emerald-700 dark:text-emerald-400'
                                                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                        )}
                                    >
                                        {viewMode === mode && (
                                            <motion.div
                                                layoutId="viewModeBgCatShow"
                                                className="absolute inset-0 rounded-lg bg-white shadow-xs dark:bg-slate-700"
                                                initial={false}
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <span className="relative z-10">
                                            {mode === 'grid' && <Grid3X3 className="h-4 w-4" />}
                                            {mode === 'list' && <List className="h-4 w-4" />}
                                            {mode === 'bento' && <LayoutDashboard className="h-4 w-4" />}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* Mobile Filters */}
                            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="outline" className="h-10 rounded-xl md:hidden">
                                        <SlidersHorizontal className="mr-2 h-4 w-4" /> Filtres
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="w-full sm:w-96">
                                    <SheetHeader>
                                        <SheetTitle>Filtres</SheetTitle>
                                    </SheetHeader>
                                    <div className="mt-6 space-y-8">
                                        <div>
                                            <Label className="text-sm font-semibold">Prix (CDF)</Label>
                                            <div className="mt-4 flex items-center gap-4">
                                                <span className="w-16 rounded-lg bg-slate-100 p-2 text-center text-xs font-medium dark:bg-slate-800">
                                                    {priceRange[0]}
                                                </span>
                                                <Slider
                                                    min={0}
                                                    max={5000}
                                                    step={10}
                                                    value={priceRange}
                                                    onValueChange={(v) => setPriceRange([v[0], v[1]])}
                                                    className="flex-1"
                                                />
                                                <span className="w-16 rounded-lg bg-slate-100 p-2 text-center text-xs font-medium dark:bg-slate-800">
                                                    {priceRange[1]}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-semibold">Note minimum</Label>
                                            <div className="mt-3 flex gap-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        onClick={() => setMinRating(star === minRating ? 0 : star)}
                                                        className={cn(
                                                            "rounded-full p-2 transition-all hover:bg-slate-100 dark:hover:bg-slate-800",
                                                            star <= minRating ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'
                                                        )}
                                                    >
                                                        <Star className="h-6 w-6 fill-current" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-800">
                                            <Checkbox
                                                id="inStock"
                                                checked={inStockOnly}
                                                onCheckedChange={(c) => setInStockOnly(!!c)}
                                            />
                                            <Label htmlFor="inStock" className="cursor-pointer font-medium">
                                                En stock uniquement
                                            </Label>
                                        </div>
                                        <Button
                                            className="w-full rounded-xl bg-slate-900 py-6 text-base font-semibold text-white hover:bg-slate-800 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
                                            onClick={() => setMobileFiltersOpen(false)}
                                        >
                                            Appliquer les filtres
                                        </Button>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>

                {/* Results Grid */}
                <div className="min-h-100">
                    {filteredProducts.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center rounded-[2.5rem] border border-slate-200/50 bg-slate-50/50 py-20 text-center dark:border-slate-800/50 dark:bg-slate-900/30"
                        >
                            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-200/50 dark:bg-slate-800/50">
                                <Package className="h-10 w-10 text-slate-400 dark:text-slate-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                Aucun produit trouvé
                            </h3>
                            <p className="mt-2 max-w-md text-slate-500 dark:text-slate-400">
                                Essayez d'ajuster vos filtres ou votre recherche pour trouver ce que vous cherchez.
                            </p>
                            <div className="mt-8 flex gap-3">
                                <Link
                                    href={route('tenant.product.index')}
                                    className="inline-flex h-11 items-center justify-center rounded-full bg-slate-900 px-6 font-medium text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                                >
                                    Voir tous les produits <ChevronRight className="ml-2 h-4 w-4" />
                                </Link>
                                <Button variant="outline" asChild className="h-11 rounded-full px-6">
                                    <Link href={route('tenant.product.category.index')}>
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
                                    {filteredProducts.map((product, index) => (
                                        <motion.div
                                            key={product.id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05, duration: 0.4 }}
                                            className={
                                                viewMode === 'bento' && (index === 0 || index === 4)
                                                    ? 'sm:col-span-2 sm:row-span-2'
                                                    : ''
                                            }
                                        >
                                            <ProductCard
                                                product={product}
                                                viewMode={viewMode === 'list' ? 'list' : 'grid'}
                                            />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </AnimatePresence>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-16 flex justify-center">
                                    <nav className="flex items-center gap-2" aria-label="Pagination">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => goToPage(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="h-11 w-11 rounded-full transition-colors hover:border-emerald-300 hover:text-emerald-600"
                                        >
                                            <ChevronRight className="h-5 w-5 rotate-180" />
                                        </Button>
                                        <div className="flex items-center gap-1">
                                            {pagesToShow.map((page, idx) =>
                                                page === '...' ? (
                                                    <span key={`dots-${idx}`} className="px-3 text-slate-400">...</span>
                                                ) : (
                                                    <button
                                                        key={page}
                                                        onClick={() => goToPage(page as number)}
                                                        className={cn(
                                                            "h-11 min-w-11 rounded-full px-4 text-sm font-medium transition-all",
                                                            page === currentPage
                                                                ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                                                                : "bg-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                                                        )}
                                                    >
                                                        {page}
                                                    </button>
                                                )
                                            )}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => goToPage(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="h-11 w-11 rounded-full transition-colors hover:border-emerald-300 hover:text-emerald-600"
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </Button>
                                    </nav>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* 'À ne pas manquer' Section */}
                {products.data.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="mt-24 rounded-[2.5rem] bg-slate-50/80 p-8 sm:p-12 dark:bg-slate-900/50"
                    >
                        <div className="mb-10 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-900/30 dark:text-emerald-400">
                                    <TrendingUp className="h-4 w-4" /> Populaires
                                </span>
                                <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    À ne pas manquer
                                </h2>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
                            {products.data.slice(0, 4).map((product, idx) => (
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
        </MainLayout>
    );
}
