// resources/js/Pages/Shop/Categories/Show.tsx
import { Head, Link, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Filter, Grid3x3, List, ArrowUpDown } from 'lucide-react';
import { useState } from 'react';
import ProductCard from '@/components/ecommerce/products/ProductCard';
import { Button } from '@/components/ui/button';
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
import type { PageProps, Category, Product } from '@/types/ecommerce/products';

interface Props extends PageProps {
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

export default function CategoryShow() {
    const { props } = usePage<Props>();
    const {
        category,
        products,
        subcategories,
        breadcrumb,
        filters = {},
    } = props;
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

    return (
        <MainLayout>
            <Head title={category.nom} />

            <div className="mx-auto min-h-150 max-w-7xl px-4 py-8">
                {/* Fil d'Ariane */}
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

                {/* Bannière de catégorie */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative mb-12 overflow-hidden rounded-3xl bg-linear-to-br from-primary/10 via-secondary/5 to-background"
                >
                    {category.banner && (
                        <img
                            src={category.banner}
                            alt={category.nom}
                            className="absolute inset-0 h-full w-full object-cover opacity-20"
                        />
                    )}
                    <div className="relative p-8 md:p-12">
                        <h1 className="font-heading text-4xl font-bold md:text-5xl">
                            {category.nom}
                        </h1>
                        {category.description && (
                            <p className="mt-3 max-w-2xl text-muted-foreground md:text-lg">
                                {category.description}
                            </p>
                        )}
                        <div className="mt-4 flex items-center gap-4">
                            <span className="text-sm font-medium">
                                {products.total ?? products.data.length}{' '}
                                produits disponibles
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Sous-catégories - Carrousel élégant */}
                {subcategories.length > 0 && (
                    <div className="mb-12">
                        <h2 className="mb-4 text-xl font-semibold">
                            Explorer les sous-catégories
                        </h2>
                        <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-4">
                            {subcategories.map((sub) => (
                                <Link
                                    key={sub.id}
                                    href={sub.url}
                                    className="group flex min-w-35 flex-col items-center rounded-2xl border bg-card p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <div className="mb-3 h-16 w-16 overflow-hidden rounded-full bg-muted">
                                        <img
                                            src={sub.image || undefined}
                                            alt={sub.nom}
                                            className="h-full w-full object-cover transition group-hover:scale-110"
                                        />
                                    </div>
                                    <span className="text-center text-sm font-medium">
                                        {sub.nom}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Barre d'outils */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b pb-4">
                    <h2 className="text-lg font-semibold">
                        {products.total ?? products.data.length} produit
                        {(products.total ?? products.data.length) > 1
                            ? 's'
                            : ''}
                    </h2>

                    <div className="flex items-center gap-2">
                        {/* Tri */}
                        <Select
                            value={filters.sort || 'newest'}
                            onValueChange={updateSort}
                        >
                            <SelectTrigger className="w-45 rounded-full">
                                <ArrowUpDown className="mr-2 h-4 w-4" />
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

                        {/* Vue (grid/list) */}
                        <div className="hidden rounded-full border p-1 md:flex">
                            <Button
                                variant={
                                    viewMode === 'grid' ? 'default' : 'ghost'
                                }
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() => setViewMode('grid')}
                            >
                                <Grid3x3 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={
                                    viewMode === 'list' ? 'default' : 'ghost'
                                }
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() => setViewMode('list')}
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Filtres mobile */}
                        <Sheet
                            open={mobileFiltersOpen}
                            onOpenChange={setMobileFiltersOpen}
                        >
                            <SheetTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="rounded-full lg:hidden"
                                >
                                    <Filter className="h-4 w-4" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-75">
                                <SheetHeader>
                                    <SheetTitle>Filtres</SheetTitle>
                                </SheetHeader>
                                <div className="py-4">
                                    <p className="text-sm text-muted-foreground">
                                        Filtres avancés à venir...
                                    </p>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>

                {/* Grille produits */}
                {products.data.length === 0 ? (
                    <div className="flex min-h-100 items-center justify-center">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="flex flex-col items-center justify-center text-center"
                        >
                            {/* Illustration */}
                            <div className="mb-6 text-muted-foreground/40">
                                <svg
                                    width="120"
                                    height="120"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M16 21V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V21"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M2 12H22"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </div>
                            <h3 className="mb-2 text-xl font-semibold">
                                Aucun produit trouvé
                            </h3>
                            <p className="mb-6 max-w-md text-muted-foreground">
                                Il n'y a pas encore de produits dans cette
                                catégorie. Découvrez nos autres collections ou
                                revenez plus tard.
                            </p>
                            <div className="flex flex-wrap justify-center gap-3">
                                <Button asChild>
                                    <Link href={route('tenant.products.index')}>
                                        Voir tous les produits
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link
                                        href={route('tenant.categories.index')}
                                    >
                                        Explorer les catégories
                                    </Link>
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                ) : (
                    <>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={products.current_page}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
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
                                        className="w-full" // ← Ajout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <ProductCard
                                            product={product}
                                            viewMode={viewMode}
                                        />
                                    </motion.div>
                                ))}
                            </motion.div>
                        </AnimatePresence>

                        {/* Pagination stylisée */}
                        {products.last_page > 1 && (
                            <div className="mt-12 flex justify-center">
                                <div className="flex gap-2 rounded-full border bg-card p-1 shadow-sm">
                                    {Array.from(
                                        { length: products.last_page },
                                        (_, i) => i + 1,
                                    ).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() =>
                                                router.get(
                                                    window.location.pathname,
                                                    {
                                                        page,
                                                        sort: filters.sort,
                                                    },
                                                    {
                                                        preserveState: true,
                                                        preserveScroll: true,
                                                        only: ['products'],
                                                        showProgress: false,
                                                    },
                                                )
                                            }
                                            className={`h-10 w-10 rounded-full text-sm font-medium transition-all ${
                                                page === products.current_page
                                                    ? 'bg-primary text-primary-foreground shadow-md'
                                                    : 'hover:bg-muted'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </MainLayout>
    );
}
