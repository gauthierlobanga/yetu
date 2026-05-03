/* eslint-disable @typescript-eslint/no-unused-vars */

import { Head, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Filter,
    X,
    Search,
    Grid2X2,
    LayoutGrid,
    SlidersHorizontal,
    ChevronRight,
    Link,
    Camera,
    Loader2,
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
import MainLayout from '@/layouts/main-layout';
import type { PageProps, Product, Category } from '@/types/ecommerce/products';

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

interface Props extends Omit<
    PageProps,
    'products' | 'categories' | 'brands' | 'filters'
> {
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
    const [localFilters, setLocalFilters] =
        useState<LocalFilters>(initialFilters);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [viewDensity, setViewDensity] = useState<'comfortable' | 'compact'>(
        'comfortable',
    );
    const [searchInput, setSearchInput] = useState(initialFilters.search || '');
    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => {
        setLocalFilters(initialFilters);
        setSearchInput(initialFilters.search || '');
        setPriceRange([
            Number(initialFilters.min_price) || serverPriceRange.min,
            Number(initialFilters.max_price) || serverPriceRange.max,
        ]);
    }, [initialFilters, serverPriceRange]);

    // Dans le composant ProductsIndex :
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isSearchingByImage, setIsSearchingByImage] = useState(false);

    const handleImageSearch = () => {
        fileInputRef.current?.click();
    };

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
            // Envoyer l'image au serveur via Inertia (en utilisant router.post avec FormData)
            // Note : Inertia ne supporte pas nativement FormData, on utilise fetch puis redirection manuelle
            const response = await fetch(route('products.search.by-image'), {
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
            });

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
        } catch (error) {
            toast.error('Erreur lors de la recherche par image');
        } finally {
            setIsSearchingByImage(false);

            // Réinitialiser l'input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };
    const applyFilters = (newFilters: Partial<LocalFilters>) => {
        const updated = { ...localFilters, ...newFilters };
        setLocalFilters(updated);

        const query: Record<string, string | undefined> = { ...updated };
        Object.keys(query).forEach((key) => {
            if (query[key] === undefined) {
                delete query[key];
            }
        });

        router.get('/product', query, {
            preserveState: true,
            preserveScroll: true,
            only: ['products'],
            showProgress: false,
        });
    };

    const clearAllFilters = () => {
        setLocalFilters({});
        setSearchInput('');
        setPriceRange([serverPriceRange.min, serverPriceRange.max]);

        router.get(
            '/product',
            {},
            {
                preserveState: true,
                preserveScroll: true,
                only: ['products'],
                showProgress: false,
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

    return (
        <MainLayout>
            <Head title="Tous les produits" />

            <div className="mx-auto max-w-7xl px-4 py-8">
                {/* En-tête avec titre et recherche */}

                {/* En-tête premium avec titre et recherche avancée */}
                <div className="mb-8 space-y-4">
                    {/* Ligne principale : Titre et recherche */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h1 className="font-heading text-2xl font-bold md:text-3xl">
                                Tous les produits
                                <motion.span
                                    key={totalProducts}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="ml-3 inline-flex items-center rounded-full bg-muted px-3 py-1 text-base font-normal text-muted-foreground"
                                >
                                    {totalProducts} résultat
                                    {totalProducts !== 1 ? 's' : ''}
                                </motion.span>
                            </h1>
                        </motion.div>

                        {/* Zone de recherche enrichie */}
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className="relative w-full sm:w-96"
                        >
                            <div className="group relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                                <Input
                                    placeholder="Rechercher un produit, une marque..."
                                    value={searchInput}
                                    onChange={(e) =>
                                        handleSearchChange(e.target.value)
                                    }
                                    className="h-11 pr-24 pl-9 text-sm shadow-sm transition-all focus:shadow-md"
                                />
                                {searchInput && (
                                    <button
                                        onClick={() => {
                                            setSearchInput('');
                                            applyFilters({ search: undefined });
                                        }}
                                        className="absolute top-1/2 right-20 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                                        aria-label="Effacer la recherche"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                )}
                                <div className="absolute top-1/2 right-1 flex -translate-y-1/2 items-center gap-1">
                                    {/* Recherche par image (placeholder) */}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                        accept="image/*"
                                        className="hidden"
                                    />

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                        aria-label="Recherche par image"
                                        onClick={handleImageSearch}
                                        disabled={isSearchingByImage}
                                    >
                                        {isSearchingByImage ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Camera className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            {/* Suggestions de recherche populaires (affichage conditionnel) */}
                            {searchInput && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    className="absolute top-full right-0 left-0 z-20 mt-1 rounded-lg border bg-card p-2 shadow-lg"
                                >
                                    <p className="px-2 py-1 text-xs font-medium text-muted-foreground">
                                        Suggestions populaires
                                    </p>
                                    <div className="space-y-1">
                                        {[
                                            'Smartphone',
                                            'Ordinateur portable',
                                            'Écouteurs sans fil',
                                        ].map((suggestion) => (
                                            <button
                                                key={suggestion}
                                                onClick={() => {
                                                    setSearchInput(suggestion);
                                                    applyFilters({
                                                        search: suggestion,
                                                    });
                                                }}
                                                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted"
                                            >
                                                <Search className="h-3.5 w-3.5 text-muted-foreground" />
                                                {suggestion}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                </div>

                {/* Filtres actifs */}
                {activeFiltersArray.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 flex flex-wrap items-center gap-2"
                    >
                        <span className="text-sm text-muted-foreground">
                            Filtres actifs :
                        </span>
                        {activeFiltersArray.map(({ key, value }) => (
                            <Badge
                                key={key}
                                variant="secondary"
                                className="gap-1 px-3 py-1"
                            >
                                {key === 'min_price' && 'Prix ≥ '}
                                {key === 'max_price' && 'Prix ≤ '}
                                {key === 'category' && 'Catégorie : '}
                                {key === 'brand' && 'Marque : '}
                                {key === 'search' && 'Recherche : '}
                                {value}
                                <button
                                    onClick={() =>
                                        removeFilter(key as keyof LocalFilters)
                                    }
                                    className="ml-1 rounded-full p-0.5 hover:bg-muted"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearAllFilters}
                            className="h-7 text-xs"
                        >
                            Tout effacer
                        </Button>
                    </motion.div>
                )}

                {searchContext?.query && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 flex flex-wrap items-center gap-2 rounded-2xl border bg-muted/40 px-4 py-3 text-sm"
                    >
                        <Badge variant="secondary">
                            {searchContext.mode === 'image'
                                ? 'Recherche par image'
                                : 'Recherche texte'}
                        </Badge>
                        {searchContext.semantic && (
                            <Badge>Classement intelligent</Badge>
                        )}
                        <span className="text-muted-foreground">
                            Resultats pour
                        </span>
                        <span className="font-medium">
                            {searchContext.query}
                        </span>
                    </motion.div>
                )}

                <div className="mt-6 lg:grid lg:grid-cols-4 lg:gap-8">
                    {/* Filtres desktop */}
                    <div className="hidden lg:block">
                        <div className="sticky top-20">
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
                    </div>

                    {/* Zone principale */}
                    <div className="lg:col-span-3">
                        {/* Barre d'outils */}
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {/* Filtres mobile */}
                                <Sheet
                                    open={mobileFiltersOpen}
                                    onOpenChange={setMobileFiltersOpen}
                                >
                                    <SheetTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="lg:hidden"
                                        >
                                            <SlidersHorizontal className="mr-2 h-4 w-4" />
                                            Filtres
                                            {activeFiltersArray.length > 0 && (
                                                <Badge
                                                    variant="secondary"
                                                    className="ml-2 h-5 min-w-5 px-1"
                                                >
                                                    {activeFiltersArray.length}
                                                </Badge>
                                            )}
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent
                                        aria-describedby={undefined}
                                        side="left"
                                        className="w-80 sm:w-96"
                                    >
                                        <SheetHeader>
                                            <SheetTitle>Filtres</SheetTitle>
                                        </SheetHeader>
                                        <div className="py-4">
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

                                {/* Densité d'affichage */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="hidden cursor-pointer rounded-none shadow-none md:flex"
                                        >
                                            {viewDensity === 'comfortable' ? (
                                                <LayoutGrid className="h-5 w-5" />
                                            ) : (
                                                <Grid2X2 className="h-5 w-5" />
                                            )}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="start"
                                        className="cursor-pointer rounded-none shadow-none"
                                    >
                                        <DropdownMenuItem
                                            className="cursor-pointer"
                                            onClick={() =>
                                                setViewDensity('comfortable')
                                            }
                                        >
                                            <LayoutGrid className="mr-2 h-4 w-4" />
                                            Confortable
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="cursor-pointer"
                                            onClick={() =>
                                                setViewDensity('compact')
                                            }
                                        >
                                            <Grid2X2 className="mr-2 h-4 w-4" />
                                            Compact
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {/* Tri */}
                            <Select
                                value={localFilters.sort || 'newest'}
                                onValueChange={(value) =>
                                    applyFilters({ sort: value })
                                }
                            >
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Trier par" />
                                </SelectTrigger>
                                <SelectContent>
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
                                </SelectContent>
                            </Select>
                        </div>

                        {/* État vide */}
                        {products.data.length === 0 ? (
                            // Composant à ajouter dans ProductsIndex.tsx
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, ease: 'easeOut' }}
                                className="flex flex-col items-center justify-center py-16 text-center"
                            >
                                {/* Illustration premium */}
                                <div className="relative mb-8">
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{
                                            delay: 0.1,
                                            duration: 0.4,
                                        }}
                                        className="text-muted-foreground/60"
                                    >
                                        <svg
                                            width="160"
                                            height="160"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="mx-auto"
                                        >
                                            <path
                                                d="M21 16V8C20.9996 7.6493 20.9071 7.30481 20.7315 7.00117C20.556 6.69754 20.3037 6.44537 20 6.27L13 2.27C12.696 2.09446 12.3511 2.00205 12 2.00205C11.6489 2.00205 11.304 2.09446 11 2.27L4 6.27C3.69626 6.44537 3.44398 6.69754 3.26846 7.00117C3.09294 7.30481 3.00036 7.6493 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73C11.304 21.9055 11.6489 21.9979 12 21.9979C12.3511 21.9979 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16Z"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                            <path
                                                d="M12 11L12 16M12 7V8"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                            />
                                            <circle
                                                cx="12"
                                                cy="18"
                                                r="1"
                                                fill="currentColor"
                                            />
                                        </svg>
                                    </motion.div>
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{
                                            delay: 0.3,
                                            type: 'spring',
                                            stiffness: 200,
                                        }}
                                        className="absolute -right-2 -bottom-2 rounded-full bg-primary/10 p-3 text-primary"
                                    >
                                        <Search className="h-6 w-6" />
                                    </motion.div>
                                </div>

                                {/* Message principal */}
                                <motion.h3
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="mb-2 font-heading text-2xl font-semibold"
                                >
                                    Aucun produit trouvé
                                </motion.h3>

                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="mb-6 max-w-md text-muted-foreground"
                                >
                                    Nous n'avons pas trouvé de produit
                                    correspondant à vos critères. Essayez
                                    d'ajuster vos filtres ou explorez nos
                                    catégories.
                                </motion.p>

                                {/* Actions */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="flex flex-wrap items-center justify-center gap-3"
                                >
                                    <Button
                                        onClick={clearAllFilters}
                                        size="lg"
                                        className="h-10 w-full cursor-pointer gap-2 rounded-full bg-primary/95 text-base font-semibold hover:bg-primary"
                                    >
                                        <X className="h-4 w-4" />
                                        Effacer tous les filtres
                                    </Button>
                                    <Button variant="outline" size="lg" asChild>
                                        <Link
                                            href={route(
                                                'product.category.index',
                                            )}
                                        >
                                            Parcourir les catégories
                                            <ChevronRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </motion.div>

                                {/* Suggestion de contact (optionnel) */}
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="mt-6 text-sm text-muted-foreground"
                                >
                                    Besoin d'aide ?{' '}
                                    <Link
                                        href={route('page.contact')}
                                        className="font-medium text-primary hover:underline"
                                    >
                                        Contactez notre support
                                    </Link>
                                </motion.p>
                            </motion.div>
                        ) : (
                            <>
                                <motion.div
                                    layout
                                    className={`grid gap-4 ${
                                        viewDensity === 'comfortable'
                                            ? 'grid-cols-2 sm:grid-cols-3'
                                            : 'grid-cols-3 sm:grid-cols-4'
                                    }`}
                                >
                                    <AnimatePresence mode="popLayout">
                                        {products.data.map((product) => (
                                            <motion.div
                                                key={product.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.2 }}
                                                layout
                                            >
                                                <ProductCard
                                                    product={product}
                                                />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </motion.div>

                                {/* Pagination */}
                                {products.last_page > 1 && (
                                    <div className="mt-10 flex justify-center">
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="outline"
                                                size="sm"
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
                                            >
                                                Précédent
                                            </Button>
                                            <div className="flex gap-1">
                                                {Array.from(
                                                    {
                                                        length: products.last_page,
                                                    },
                                                    (_, i) => i + 1,
                                                )
                                                    .filter(
                                                        (p) =>
                                                            p === 1 ||
                                                            p ===
                                                                products.last_page ||
                                                            Math.abs(
                                                                p -
                                                                    products.current_page,
                                                            ) <= 1,
                                                    )
                                                    .reduce(
                                                        (acc, p, idx, arr) => {
                                                            if (
                                                                idx > 0 &&
                                                                p -
                                                                    arr[
                                                                        idx - 1
                                                                    ] >
                                                                    1
                                                            ) {
                                                                acc.push('...');
                                                            }

                                                            acc.push(p);

                                                            return acc;
                                                        },
                                                        [] as (
                                                            | number
                                                            | string
                                                        )[],
                                                    )
                                                    .map((page, idx) =>
                                                        page === '...' ? (
                                                            <span
                                                                key={`ellipsis-${idx}`}
                                                                className="px-2"
                                                            >
                                                                ...
                                                            </span>
                                                        ) : (
                                                            <Button
                                                                key={page}
                                                                variant={
                                                                    page ===
                                                                    products.current_page
                                                                        ? 'default'
                                                                        : 'outline'
                                                                }
                                                                size="sm"
                                                                onClick={() =>
                                                                    applyFilters(
                                                                        {
                                                                            page: String(
                                                                                page,
                                                                            ),
                                                                        },
                                                                    )
                                                                }
                                                            >
                                                                {page}
                                                            </Button>
                                                        ),
                                                    )}
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
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
                                            >
                                                Suivant
                                            </Button>
                                        </div>
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
