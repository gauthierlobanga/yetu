/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/Pages/Shop/Categories/Show.tsx
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ChevronRight,
    ArrowUpDown,
    Search,
    SlidersHorizontal,
    Star,
    Package,
    TrendingUp,
    Sparkles,
    Grid3X3,
    List,
    X,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import ProductCard from '@/components/ecommerce/products/ProductCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
    filters?: { sort?: string };
}

export default function CategoryShow({
    category,
    products,
    subcategories,
    breadcrumb,
    filters = {},
}: Props) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Filtres (à connecter plus tard)
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
    const [minRating, setMinRating] = useState(0);
    const [inStockOnly, setInStockOnly] = useState(false);

    const updateSort = (value: string) => {
        router.get(
            window.location.pathname,
            { sort: value },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['products'],
                showProgress: false,
            },
        );
    };

    const totalPages = products.last_page;
    const currentPage = products.current_page;
    const totalProducts = products.total ?? products.data.length;

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
            { page, sort: filters.sort },
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <MainLayout>
            <Head title={category.nom} />

            <div className="mx-auto max-w-7xl px-4 py-8">
                {/* Fil d’Ariane */}
                <nav className="mb-6 flex flex-wrap items-center text-sm text-muted-foreground">
                    <Link href="/" className="hover:text-foreground">
                        Accueil
                    </Link>
                    {breadcrumb.map((item, idx) => (
                        <span key={idx} className="flex items-center">
                            <ChevronRight className="mx-1 h-4 w-4" />
                            {idx === breadcrumb.length - 1 ? (
                                <span className="font-medium text-foreground">
                                    {item.name}
                                </span>
                            ) : (
                                <Link
                                    href={item.url}
                                    className="hover:text-foreground"
                                >
                                    {item.name}
                                </Link>
                            )}
                        </span>
                    ))}
                </nav>

                {/* En‑tête catégorie épuré */}
                <div className="mb-12 rounded-xl border bg-linear-to-r from-emerald-50 via-white to-white p-6 dark:from-emerald-950/20 dark:via-gray-900 dark:to-gray-900">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                {category.nom}
                            </h1>
                            {category.description && (
                                <p className="mt-2 max-w-2xl text-muted-foreground">
                                    {category.description}
                                </p>
                            )}
                        </div>
                        <Badge
                            variant="secondary"
                            className="px-4 py-1.5 text-sm"
                        >
                            <Package className="mr-1 h-4 w-4" />
                            {totalProducts} produit
                            {totalProducts > 1 ? 's' : ''}
                        </Badge>
                    </div>
                </div>

                {/* Sous‑catégories */}
                {subcategories.length > 0 && (
                    <div className="mb-10">
                        <h2 className="mb-4 text-lg font-semibold text-foreground">
                            Explorer les sous‑catégories
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {subcategories.map((sub) => (
                                <Link
                                    key={sub.id}
                                    href={sub.url}
                                    className="flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm font-medium transition hover:border-emerald-200"
                                >
                                    <div className="h-8 w-8 overflow-hidden rounded-full bg-muted">
                                        {sub.image && (
                                            <img
                                                src={sub.image}
                                                alt={sub.nom}
                                                className="h-full w-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <span>{sub.nom}</span>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Barre d’outils */}
                <div className="sticky top-16 z-20 mb-6 flex flex-wrap items-center gap-3 rounded-xl border bg-card p-3">
                    <div className="relative max-w-md flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher dans cette catégorie..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-10 rounded-lg border-0 bg-muted pl-9"
                        />
                    </div>

                    <Select
                        value={filters.sort || 'newest'}
                        onValueChange={updateSort}
                    >
                        <SelectTrigger className="w-40 rounded-lg">
                            <ArrowUpDown className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Trier" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Nouveautés</SelectItem>
                            <SelectItem value="popular">Popularité</SelectItem>
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

                    <div className="hidden rounded-lg border p-1 md:flex">
                        <Button
                            variant={viewMode === 'grid' ? 'default' : 'ghost'}
                            size="icon"
                            className="h-8 w-8 rounded-md"
                            onClick={() => setViewMode('grid')}
                        >
                            <Grid3X3 className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewMode === 'list' ? 'default' : 'ghost'}
                            size="icon"
                            className="h-8 w-8 rounded-md"
                            onClick={() => setViewMode('list')}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>

                    <Sheet
                        open={mobileFiltersOpen}
                        onOpenChange={setMobileFiltersOpen}
                    >
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 rounded-lg"
                            >
                                <SlidersHorizontal className="h-4 w-4" />{' '}
                                Filtres
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-80 sm:w-96">
                            <SheetHeader>
                                <SheetTitle>Filtres</SheetTitle>
                            </SheetHeader>
                            <div className="space-y-6 py-6">
                                <div>
                                    <label className="text-sm font-medium">
                                        Prix (CDF)
                                    </label>
                                    <div className="mt-2 flex gap-2">
                                        <Input
                                            type="number"
                                            placeholder="Min"
                                            value={priceRange[0]}
                                            onChange={(e) =>
                                                setPriceRange([
                                                    +e.target.value,
                                                    priceRange[1],
                                                ])
                                            }
                                            className="h-9"
                                        />
                                        <Input
                                            type="number"
                                            placeholder="Max"
                                            value={priceRange[1]}
                                            onChange={(e) =>
                                                setPriceRange([
                                                    priceRange[0],
                                                    +e.target.value,
                                                ])
                                            }
                                            className="h-9"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium">
                                        Note minimum
                                    </label>
                                    <div className="mt-2 flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() =>
                                                    setMinRating(star)
                                                }
                                                className={`rounded-full p-1 transition ${star <= minRating ? 'text-yellow-400' : 'text-gray-300'}`}
                                            >
                                                <Star className="h-6 w-6 fill-current" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={inStockOnly}
                                        onChange={(e) =>
                                            setInStockOnly(e.target.checked)
                                        }
                                        className="rounded border-gray-300"
                                    />
                                    <label className="text-sm">
                                        En stock uniquement
                                    </label>
                                </div>
                                <Button
                                    className="w-full rounded-lg"
                                    onClick={() => setMobileFiltersOpen(false)}
                                >
                                    Appliquer
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Grille produits */}
                <div className="min-h-75">
                    {products.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <Package className="mx-auto h-16 w-16 text-muted-foreground" />
                            <h3 className="mt-4 text-xl font-semibold">
                                Aucun produit trouvé
                            </h3>
                            <p className="mt-2 max-w-md text-muted-foreground">
                                Il n’y a pas encore de produits dans cette
                                catégorie.
                            </p>
                            <div className="mt-6 flex gap-3">
                                <Button asChild className="rounded-lg">
                                    <Link href={route('tenant.product.index')}>
                                        Voir tous les produits{' '}
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    asChild
                                    className="rounded-lg"
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
                        </div>
                    ) : (
                        <>
                            <div
                                className={`grid gap-4 ${
                                    viewMode === 'grid'
                                        ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                                        : 'grid-cols-1'
                                }`}
                            >
                                {products.data.map((product) => (
                                    <motion.div
                                        key={product.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ProductCard
                                            product={product}
                                            viewMode={viewMode}
                                        />
                                    </motion.div>
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="mt-10 flex justify-center">
                                    <nav
                                        className="flex items-center gap-1"
                                        aria-label="Pagination"
                                    >
                                        <button
                                            onClick={() =>
                                                goToPage(currentPage - 1)
                                            }
                                            disabled={currentPage === 1}
                                            className="rounded-lg p-2 hover:bg-muted disabled:opacity-50"
                                        >
                                            <ChevronRight className="h-5 w-5 rotate-180" />
                                        </button>
                                        {pagesToShow.map((page, idx) =>
                                            page === '...' ? (
                                                <span
                                                    key={`dots-${idx}`}
                                                    className="px-2 text-muted-foreground"
                                                >
                                                    ...
                                                </span>
                                            ) : (
                                                <button
                                                    key={page}
                                                    onClick={() =>
                                                        goToPage(page as number)
                                                    }
                                                    className={`h-10 w-10 rounded-lg text-sm font-medium transition ${
                                                        page === currentPage
                                                            ? 'bg-emerald-600 text-white'
                                                            : 'hover:bg-muted'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            ),
                                        )}
                                        <button
                                            onClick={() =>
                                                goToPage(currentPage + 1)
                                            }
                                            disabled={
                                                currentPage === totalPages
                                            }
                                            className="rounded-lg p-2 hover:bg-muted disabled:opacity-50"
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </button>
                                    </nav>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Section "À ne pas manquer" */}
                {products.data.length > 0 && (
                    <div className="mt-16 border-t pt-10">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                                    <TrendingUp className="h-4 w-4" />
                                    Populaires dans {category.nom}
                                </span>
                                <h2 className="mt-2 text-2xl font-bold text-foreground">
                                    À ne pas manquer
                                </h2>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            {products.data.slice(0, 4).map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
