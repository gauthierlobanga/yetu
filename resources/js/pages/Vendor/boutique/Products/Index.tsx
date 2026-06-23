/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
// resources/js/Pages/Products/Index.tsx
import { Head, usePage, router, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Search,
    LayoutGrid,
    SlidersHorizontal,
    ChevronRight,
    Camera,
    Loader2,
    Sparkles,
    PackageSearch,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import FiltersPanel from '@/components/ecommerce/products/FiltersPanel';
import ProductCard from '@/components/ecommerce/products/ProductCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
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
import { Skeleton } from '@/components/ui/skeleton';
import MainLayout from '@/layouts/main-layout';
import { cn } from '@/lib/utils';
import type { Product, Category } from '@/types/ecommerce/products';

interface LocalFilters {
    category?: string;
    brand?: string;
    min_price?: string;
    max_price?: string;
    search?: string;
    sort?: string;
    page?: string;
}

interface BrandSimple {
    id: number;
    name: string;
}

interface Props extends Record<string, unknown> {
    products: {
        data: Product[];
        current_page: number;
        last_page: number;
        total?: number;
    };
    categories: Category[];
    brands: BrandSimple[];
    filters: LocalFilters;
    priceRange: { min: number; max: number };
    searchContext?: {
        query: string;
        mode: 'text' | 'image';
        semantic: boolean;
    };
}

export default function ProductsIndex() {
    const { props } = usePage<Props>();
    const {
        products,
        categories,
        brands,
        filters: initialFilters,
        priceRange: serverPriceRange,
        searchContext,
    } = props;

    const [priceRange, setPriceRange] = useState<[number, number]>([
        Number(initialFilters.min_price) || serverPriceRange.min,
        Number(initialFilters.max_price) || serverPriceRange.max,
    ]);

    const [isFocused, setIsFocused] = useState(false);

    const [localFilters, setLocalFilters] =
        useState<LocalFilters>(initialFilters);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [viewDensity, setViewDensity] = useState<'comfortable' | 'compact'>(
        'compact',
    );
    const [searchInput, setSearchInput] = useState(initialFilters.search || '');
    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isSearchingByImage, setIsSearchingByImage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setLocalFilters(initialFilters);
        setSearchInput(initialFilters.search || '');
        setPriceRange([
            Number(initialFilters.min_price) || serverPriceRange.min,
            Number(initialFilters.max_price) || serverPriceRange.max,
        ]);
    }, [initialFilters, serverPriceRange]);

    const applyFilters = (newFilters: Partial<LocalFilters>) => {
        const updated = { ...localFilters, ...newFilters };
        setLocalFilters(updated);

        const query: Record<string, string | undefined> = { ...updated };
        Object.keys(query).forEach((key) => {
            if (query[key] === undefined) {
                delete query[key];
            }
        });

        setIsLoading(true);
        router.get(route('tenant.product.index'), query, {
            preserveState: true,
            preserveScroll: true,
            showProgress: false,
            only: ['products'],
            onFinish: () => setIsLoading(false),
        });
    };

    const clearAllFilters = () => {
        setLocalFilters({});
        setSearchInput('');
        setPriceRange([serverPriceRange.min, serverPriceRange.max]);
        setIsLoading(true);
        router.get(
            route('tenant.product.index'),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                showProgress: false,
                only: ['products'],
                onFinish: () => setIsLoading(false),
            },
        );
    };

    const applyPriceFilter = () => {
        applyFilters({
            min_price: String(priceRange[0]),
            max_price: String(priceRange[1]),
        });
    };

    const handleSearchChange = (value: string) => {
        setSearchInput(value);

        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        searchTimeout.current = setTimeout(() => {
            applyFilters({ search: value || undefined });
        }, 500);
    };

    const removeFilter = (key: keyof LocalFilters) => {
        applyFilters({ [key]: undefined });
    };

    const activeFiltersArray = Object.entries(localFilters)
        .filter(
            ([key, value]) =>
                key !== 'sort' &&
                key !== 'page' &&
                value !== undefined &&
                value !== '',
        )
        .map(([key, value]) => ({ key, value: value as string }));

    const totalProducts = products.total ?? products.data.length;

    const handleImageSearch = () => fileInputRef.current?.click();

    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        setIsSearchingByImage(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch(
                route('tenant.product.search.by-image'),
                {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN': (
                            document.querySelector(
                                'meta[name="csrf-token"]',
                            ) as HTMLMetaElement
                        )?.content,
                    },
                },
            );

            if (response.redirected) {
                window.location.href = response.url;
            } else {
                const data = await response.json();

                if (data.redirect_url) {
                    window.location.href = data.redirect_url;
                } else if (data.error) {
                    toast.error(data.error);
                }
            }
        } catch {
            toast.error('Erreur lors de la recherche par image');
        } finally {
            setIsSearchingByImage(false);

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <MainLayout>
            <Head title="Tous les produits" />

            <div className="mx-auto max-w-350 px-4 py-8">
                {/*  Page Header - version améliorée */}
                <div className="relative mb-10 rounded-3xl bg-white p-8 shadow-xl ring-1 shadow-slate-200/20 ring-slate-100/80 sm:p-10 dark:bg-slate-950 dark:shadow-none dark:ring-slate-800/50">
                    {/* Effets de fond */}
                    <div className="pointer-events-none absolute inset-0">
                        <div className="absolute inset-0 bg-[url('/images/cart.jpg')] bg-center opacity-[0.02] dark:opacity-[0.03] dark:invert-0" />
                        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-[80px] dark:bg-emerald-500/20" />
                        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-sky-500/10 blur-[80px] dark:bg-sky-500/20" />
                    </div>

                    <div className="relative z-10 flex flex-col gap-6">
                        {/* Première ligne : Titre + compteur (seul) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-wrap items-center justify-between gap-4"
                        >
                            <div>
                                <div className="mb-2 flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold tracking-wider text-emerald-600 ring-1 ring-emerald-200/50 backdrop-blur-md dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20">
                                        <Sparkles className="h-3.5 w-3.5" /> Nos
                                        meilleures collections pour vous
                                    </span>
                                </div>
                                <h1 className="text-3xl font-medium tracking-tight text-slate-700 md:text-4xl dark:text-white/90">
                                    Tous les produits
                                    <motion.span
                                        key={totalProducts}
                                        initial={{
                                            opacity: 0,
                                            scale: 0.8,
                                            filter: 'blur(4px)',
                                        }}
                                        animate={{
                                            opacity: 1,
                                            scale: 1,
                                            filter: 'blur(0px)',
                                        }}
                                        className="ml-4 inline-flex items-center justify-center rounded-full bg-slate-100 px-4 py-1.5 align-middle text-xl font-semibold text-slate-900 ring-1 ring-slate-200/50 backdrop-blur-md dark:bg-slate-800/50 dark:text-white dark:ring-white/10"
                                    >
                                        {totalProducts}
                                    </motion.span>
                                </h1>
                            </div>
                            {/* On peut ajouter un élément à droite si besoin, mais on laisse vide pour que la recherche soit en dessous */}
                        </motion.div>

                        {/* Deuxième ligne : Barre de recherche large avec zone "Recherche par image" et bouton "Recherche" */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="relative w-full"
                        >
                            <div className="relative z-10 overflow-visible">
                                {/* La barre elle-même, plus large */}
                                <div className="group relative flex items-center rounded-2xl border-2 border-emerald-400 bg-white/80 p-1 transition-all duration-300 ease-out focus-within:border-emerald-400/60 focus-within:shadow-[0_12px_40px_rgba(16,185,129,0.15)] focus-within:ring-2 focus-within:ring-emerald-400/20 hover:shadow-[0_4px_10px_rgb(0,0,0,0.10)] dark:border-slate-700/60 dark:bg-slate-900/70 dark:backdrop-blur-md dark:focus-within:border-emerald-400/40 dark:focus-within:ring-emerald-400/20">
                                    {/* Zone "Recherche par image" (à gauche) */}
                                    <div className="flex items-center gap-1.5 pr-3 pl-2">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImageUpload}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleImageSearch}
                                            disabled={isSearchingByImage}
                                            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-slate-600 transition-all hover:bg-emerald-50/60 hover:text-emerald-600 dark:text-slate-300 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400"
                                        >
                                            {isSearchingByImage ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Camera className="h-5 w-5" />
                                            )}
                                            <span className="hidden sm:inline">
                                                Recherche par image
                                            </span>
                                        </Button>
                                        <div className="h-8 w-px bg-slate-200/60 dark:bg-slate-700/60" />
                                    </div>

                                    {/* Champ de recherche (occupe tout l'espace restant) */}
                                    <div className="min-w-0 flex-1">
                                        <Input
                                            placeholder="Que cherchez-vous ? (bijoux, boucles d'oreilles...)"
                                            value={searchInput}
                                            onChange={(e) =>
                                                handleSearchChange(
                                                    e.target.value,
                                                )
                                            }
                                            onFocus={() => setIsFocused(true)}
                                            onBlur={() =>
                                                setTimeout(
                                                    () => setIsFocused(false),
                                                    200,
                                                )
                                            } // délai pour permettre le clic sur suggestions
                                            className="h-12 w-full border-0 bg-transparent px-2 text-base text-slate-800 placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 dark:text-slate-100 dark:placeholder:text-slate-500"
                                        />
                                    </div>

                                    {/* Bouton "Recherche" (à droite) */}
                                    <div className="flex items-center gap-1.5 pr-1.5 pl-2">
                                        <div className="h-8 w-px bg-slate-200/60 dark:bg-slate-700/60" />
                                        <Button
                                            size="sm"
                                            onClick={() =>
                                                applyFilters({
                                                    search:
                                                        searchInput ||
                                                        undefined,
                                                })
                                            }
                                            className="flex items-center gap-1.5 rounded-3xl bg-linear-to-r from-emerald-500 to-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:scale-105 dark:from-emerald-400 dark:to-emerald-500"
                                        >
                                            <Search className="h-4 w-4" />
                                            <span>Rechercher</span>
                                        </Button>
                                    </div>
                                </div>

                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Active Filters */}
                <AnimatePresence>
                    {activeFiltersArray.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-6 flex flex-wrap items-center gap-2 overflow-hidden"
                        >
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                Filtres actifs :
                            </span>
                            <AnimatePresence>
                                {activeFiltersArray.map(({ key, value }) => (
                                    <motion.div
                                        key={key}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        layout
                                    >
                                        <Badge
                                            variant="secondary"
                                            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm shadow-xs transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
                                        >
                                            <span className="text-slate-500 dark:text-slate-400">
                                                {key === 'min_price' &&
                                                    'Prix ≥ '}
                                                {key === 'max_price' &&
                                                    'Prix ≤ '}
                                                {key === 'category' &&
                                                    'Catégorie: '}
                                                {key === 'brand' && 'Marque: '}
                                                {key === 'search' &&
                                                    'Recherche: '}
                                            </span>
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                {value}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    removeFilter(
                                                        key as keyof LocalFilters,
                                                    )
                                                }
                                                className="ml-1 rounded-full p-0.5 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-600 dark:hover:text-white"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </button>
                                        </Badge>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            <Button
                                variant="ghost"
                                onClick={clearAllFilters}
                                className="h-8 rounded-full text-xs font-semibold text-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30"
                            >
                                Tout effacer
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {searchContext?.query && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 overflow-hidden rounded-2xl bg-linear-to-r from-emerald-50 to-sky-50 p-1 dark:from-emerald-900/20 dark:to-sky-900/20"
                    >
                        <div className="flex flex-wrap items-center gap-3 rounded-xl bg-white/60 px-5 py-4 backdrop-blur-md dark:bg-slate-900/60">
                            <Badge className="bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                                {searchContext.mode === 'image'
                                    ? 'Recherche visuelle'
                                    : 'Recherche texte'}
                            </Badge>
                            {searchContext.semantic && (
                                <Badge
                                    variant="secondary"
                                    className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                                >
                                    <Sparkles className="mr-1 h-3 w-3" /> IA
                                </Badge>
                            )}
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                Résultats pour
                            </span>
                            <span className="font-semibold text-slate-900 dark:text-white">
                                "{searchContext.query}"
                            </span>
                        </div>
                    </motion.div>
                )}

                <div className="mt-8 lg:grid lg:grid-cols-4 lg:gap-10">
                    {/* Filtres desktop */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-24 rounded-3xl border border-slate-200/60 bg-white/40 p-6 shadow-xs backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/40">
                            <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
                                <SlidersHorizontal className="h-5 w-5 text-emerald-500" />{' '}
                                Affiner
                            </h2>
                            <FiltersPanel
                                categories={categories}
                                brands={brands}
                                localFilters={localFilters}
                                priceRange={priceRange}
                                setPriceRange={setPriceRange}
                                applyFilters={applyFilters}
                                clearAllFilters={clearAllFilters}
                                applyPriceFilter={applyPriceFilter}
                                minPossiblePrice={serverPriceRange.min}
                                maxPossiblePrice={serverPriceRange.max}
                            />
                        </div>
                    </aside>

                    {/* Liste des produits */}
                    <div className="lg:col-span-3">
                        {/* Barre d'outils */}
                        <div className="mb-6 flex items-center justify-between rounded-2xl border border-slate-200/60 bg-white/40 p-2 shadow-xs backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/40">
                            <div className="flex items-center gap-2 pl-2">
                                <Sheet
                                    open={mobileFiltersOpen}
                                    onOpenChange={setMobileFiltersOpen}
                                >
                                    <SheetTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="rounded-xl lg:hidden"
                                        >
                                            <SlidersHorizontal className="mr-2 h-4 w-4" />
                                            Filtres
                                            {activeFiltersArray.length > 0 && (
                                                <Badge className="ml-2 bg-emerald-500 px-1.5">
                                                    {activeFiltersArray.length}
                                                </Badge>
                                            )}
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent
                                        side="left"
                                        className="w-full p-3 sm:w-96"
                                    >
                                        <SheetHeader>
                                            <SheetTitle className="flex items-center gap-2 text-xl">
                                                <SlidersHorizontal className="h-5 w-5 text-emerald-500" />{' '}
                                                Filtres
                                            </SheetTitle>
                                        </SheetHeader>
                                        <div className="mt-6">
                                            <FiltersPanel
                                                categories={categories}
                                                brands={brands}
                                                localFilters={localFilters}
                                                priceRange={priceRange}
                                                setPriceRange={setPriceRange}
                                                applyFilters={applyFilters}
                                                clearAllFilters={
                                                    clearAllFilters
                                                }
                                                applyPriceFilter={
                                                    applyPriceFilter
                                                }
                                                minPossiblePrice={
                                                    serverPriceRange.min
                                                }
                                                maxPossiblePrice={
                                                    serverPriceRange.max
                                                }
                                            />
                                        </div>
                                    </SheetContent>
                                </Sheet>

                                <div className="hidden rounded-xl border border-slate-200 bg-white p-1 md:flex dark:border-slate-700 dark:bg-slate-800">
                                    <button
                                        onClick={() =>
                                            setViewDensity('comfortable')
                                        }
                                        className={cn(
                                            'flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all',
                                            viewDensity === 'comfortable'
                                                ? 'bg-slate-100 text-slate-900 shadow-inner dark:bg-slate-700 dark:text-white'
                                                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white',
                                        )}
                                    >
                                        <LayoutGrid className="h-4 w-4" />{' '}
                                        Confort
                                    </button>
                                    <button
                                        onClick={() =>
                                            setViewDensity('compact')
                                        }
                                        className={cn(
                                            'flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all',
                                            viewDensity === 'compact'
                                                ? 'bg-slate-100 text-slate-900 shadow-inner dark:bg-slate-700 dark:text-white'
                                                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white',
                                        )}
                                    >
                                        <LayoutGrid className="h-4 w-4 scale-75" />{' '}
                                        Compact
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Select
                                    value={localFilters.sort || 'newest'}
                                    onValueChange={(value) =>
                                        applyFilters({ sort: value })
                                    }
                                >
                                    <SelectTrigger
                                        className={cn(
                                            'h-11 w-56 rounded border px-3 text-sm font-normal transition-all duration-200',
                                            'border-slate-200 bg-white/80 text-slate-700',
                                            'hover:border-emerald-300 hover:bg-white',
                                            'focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20',
                                            'dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300',
                                            'dark:hover:border-emerald-700 dark:hover:bg-slate-900',
                                            'dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20',
                                        )}
                                    >
                                        <SelectValue placeholder="Trier" />
                                    </SelectTrigger>
                                    <SelectContent
                                        position="popper"
                                        side="bottom"
                                        align="start"
                                        sideOffset={1}
                                        className={cn(
                                            'rounded border border-slate-200/80 bg-white/95 p-1',
                                            'dark:border-slate-800/80 dark:bg-slate-950/90',
                                        )}
                                    >
                                        <SelectItem
                                            value="newest"
                                            className="cursor-pointer px-3 py-2 text-sm font-normal text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700 dark:text-slate-300 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400"
                                        >
                                            Nouveautés
                                        </SelectItem>
                                        <SelectItem
                                            className="cursor-pointer px-3 py-2 text-sm font-normal text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700 dark:text-slate-300 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400"
                                            value="popular"
                                        >
                                            Popularité
                                        </SelectItem>
                                        <SelectItem
                                            value="price_asc"
                                            className="cursor-pointer px-3 py-2 text-sm font-normal text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700 dark:text-slate-300 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400"
                                        >
                                            Prix croissant
                                        </SelectItem>
                                        <SelectItem
                                            value="price_desc"
                                            className="cursor-pointer px-3 py-2 text-sm font-normal text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-700 dark:text-slate-300 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400"
                                        >
                                            Prix décroissant
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Chargement */}
                        {isLoading && (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="flex flex-col gap-4"
                                    >
                                        <Skeleton className="aspect-4/5 w-full rounded-3xl" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-5 w-2/3 rounded-full" />
                                            <Skeleton className="h-4 w-1/2 rounded-full" />
                                            <Skeleton className="h-6 w-1/3 rounded-full" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* État vide */}
                        {!isLoading && products.data.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center rounded-[3rem] border border-slate-200/50 bg-slate-50/50 py-24 text-center dark:border-slate-800/50 dark:bg-slate-900/30"
                            >
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                    }}
                                    className="mb-8 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-linear-to-br from-emerald-100 to-sky-100 shadow-inner dark:from-emerald-900/40 dark:to-sky-900/20"
                                >
                                    <PackageSearch className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
                                </motion.div>
                                <h3 className="mb-3 text-3xl font-bold text-slate-900 dark:text-white">
                                    Aucun trésor trouvé
                                </h3>
                                <p className="mb-8 max-w-md text-lg text-slate-500 dark:text-slate-400">
                                    Il semble que vos critères soient très
                                    précis. Essayez d'élargir votre recherche.
                                </p>
                                <div className="flex flex-wrap justify-center gap-4">
                                    <Button
                                        onClick={clearAllFilters}
                                        size="lg"
                                        className="gap-2 rounded-full px-8"
                                    >
                                        <X className="h-4 w-4" /> Réinitialiser
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="rounded-full px-8"
                                        asChild
                                    >
                                        <Link
                                            href={route(
                                                'tenant.product.category.index',
                                            )}
                                        >
                                            Voir les catégories
                                        </Link>
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* Grille de produits */}
                        {!isLoading && products.data.length > 0 && (
                            <>
                                <motion.div
                                    layout
                                    className={cn(
                                        'grid gap-6',
                                        viewDensity === 'comfortable'
                                            ? 'grid-cols-2 sm:grid-cols-3'
                                            : 'grid-cols-2 sm:grid-cols-4',
                                    )}
                                >
                                    <AnimatePresence mode="popLayout">
                                        {products.data.map((product, index) => (
                                            <motion.div
                                                key={product.id}
                                                initial={{ opacity: 0, y: 30 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{
                                                    opacity: 0,
                                                    scale: 0.9,
                                                }}
                                                transition={{
                                                    duration: 0.4,
                                                    delay: index * 0.05,
                                                }}
                                                layout
                                            >
                                                <ProductCard
                                                    product={product}
                                                />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </motion.div>

                                {/* Modern Pagination */}
                                {products.last_page > 1 && (
                                    <div className="mt-16 flex justify-center">
                                        <nav className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 p-2 shadow-xs backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                disabled={
                                                    products.current_page === 1
                                                }
                                                onClick={() =>
                                                    applyFilters({
                                                        page: String(
                                                            products.current_page -
                                                                1,
                                                        ),
                                                    })
                                                }
                                                className="h-10 w-10 rounded-full"
                                            >
                                                <ChevronRight className="h-5 w-5 rotate-180" />
                                            </Button>

                                            <div className="flex items-center gap-1">
                                                {Array.from(
                                                    {
                                                        length: products.last_page,
                                                    },
                                                    (_, i) => i + 1,
                                                ).map((page) => (
                                                    <button
                                                        key={page}
                                                        onClick={() =>
                                                            applyFilters({
                                                                page: String(
                                                                    page,
                                                                ),
                                                            })
                                                        }
                                                        className={cn(
                                                            'h-10 min-w-10 rounded-full px-4 text-sm font-semibold transition-all',
                                                            page ===
                                                                products.current_page
                                                                ? 'bg-slate-900 text-white shadow-md dark:bg-white dark:text-slate-900'
                                                                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                                                        )}
                                                    >
                                                        {page}
                                                    </button>
                                                ))}
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                disabled={
                                                    products.current_page ===
                                                    products.last_page
                                                }
                                                onClick={() =>
                                                    applyFilters({
                                                        page: String(
                                                            products.current_page +
                                                                1,
                                                        ),
                                                    })
                                                }
                                                className="h-10 w-10 rounded-full"
                                            >
                                                <ChevronRight className="h-5 w-5" />
                                            </Button>
                                        </nav>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
