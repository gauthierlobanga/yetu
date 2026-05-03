// resources/js/Pages/Shop/Categories/Show.tsx
// import { Head, Link, usePage, router } from '@inertiajs/react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ChevronRight, Filter, Grid3x3, List, ArrowUpDown } from 'lucide-react';
// import { useState } from 'react';
// import ProductCard from '@/components/ecommerce/products/ProductCard';
// import { Button } from '@/components/ui/button';
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from '@/components/ui/select';
// import {
//     Sheet,
//     SheetContent,
//     SheetHeader,
//     SheetTitle,
//     SheetTrigger,
// } from '@/components/ui/sheet';
// import MainLayout from '@/layouts/main-layout';
// import { home } from '@/routes';
// import type { PageProps, Category, Product } from '@/types/ecommerce/products';

// interface Props extends PageProps {
//     category: Category & {
//         description?: string;
//         products_count?: number;
//         banner?: string;
//     };
//     products: {
//         data: Product[];
//         current_page: number;
//         last_page: number;
//         total?: number;
//     };
//     subcategories: Category[];
//     breadcrumb: Array<{ name: string; url: string }>;
//     filters?: { sort?: string };
// }

// export default function CategoryShow() {
//     const { props } = usePage<Props>();
//     const {
//         category,
//         products,
//         subcategories,
//         breadcrumb,
//         filters = {},
//     } = props;
//     const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
//     const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

//     const updateSort = (value: string) => {
//         router.get(
//             window.location.pathname,
//             { sort: value },
//             {
//                 preserveState: true,
//                 preserveScroll: true,
//                 only: ['products'],
//                 showProgress: false,
//             },
//         );
//     };

//     return (
//         <MainLayout>
//             <Head title={category.nom} />

//             <div className="mx-auto min-h-150 max-w-7xl px-4 py-8">
//                 {/* Fil d'Ariane */}
//                 <nav className="mb-6 flex flex-wrap items-center text-sm text-muted-foreground">
//                     <Link href={home()} className="hover:text-foreground">
//                         Accueil
//                     </Link>
//                     {breadcrumb.map((item, idx) => (
//                         <span key={idx} className="flex items-center">
//                             <ChevronRight className="mx-1 h-4 w-4" />
//                             {idx === breadcrumb.length - 1 ? (
//                                 <span className="font-medium text-foreground">
//                                     {item.name}
//                                 </span>
//                             ) : (
//                                 <Link
//                                     href={item.url}
//                                     className="hover:text-foreground"
//                                 >
//                                     {item.name}
//                                 </Link>
//                             )}
//                         </span>
//                     ))}
//                 </nav>

//                 {/* Bannière de catégorie */}
//                 <motion.div
//                     initial={{ opacity: 0, y: 30 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="relative mb-12 overflow-hidden rounded-3xl bg-linear-to-br from-primary/10 via-secondary/5 to-background"
//                 >
//                     {category.banner && (
//                         <img
//                             src={category.banner}
//                             alt={category.nom}
//                             className="absolute inset-0 h-full w-full object-cover opacity-20"
//                         />
//                     )}
//                     <div className="relative p-8 md:p-12">
//                         <h1 className="font-heading text-4xl font-bold md:text-5xl">
//                             {category.nom}
//                         </h1>
//                         {category.description && (
//                             <p className="mt-3 max-w-2xl text-muted-foreground md:text-lg">
//                                 {category.description}
//                             </p>
//                         )}
//                         <div className="mt-4 flex items-center gap-4">
//                             <span className="text-sm font-medium">
//                                 {products.total ?? products.data.length}{' '}
//                                 produits disponibles
//                             </span>
//                         </div>
//                     </div>
//                 </motion.div>

//                 {/* Sous-catégories - Carrousel élégant */}
//                 {subcategories.length > 0 && (
//                     <div className="mb-12">
//                         <h2 className="mb-4 text-xl font-semibold">
//                             Explorer les sous-catégories
//                         </h2>
//                         <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-4">
//                             {subcategories.map((sub) => (
//                                 <Link
//                                     key={sub.id}
//                                     href={sub.url}
//                                     className="group flex min-w-35 flex-col items-center rounded-2xl border bg-card p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
//                                 >
//                                     <div className="mb-3 h-16 w-16 overflow-hidden rounded-full bg-muted">
//                                         <img
//                                             src={
//                                                 sub.image ||
//                                                 '/images/gold-zipper.jpg'
//                                             }
//                                             alt={sub.nom}
//                                             className="h-full w-full object-cover transition group-hover:scale-110"
//                                         />
//                                     </div>
//                                     <span className="text-center text-sm font-medium">
//                                         {sub.nom}
//                                     </span>
//                                 </Link>
//                             ))}
//                         </div>
//                     </div>
//                 )}

//                 {/* Barre d'outils */}
//                 <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b pb-4">
//                     <h2 className="text-lg font-semibold">
//                         {products.total ?? products.data.length} produit
//                         {(products.total ?? products.data.length) > 1
//                             ? 's'
//                             : ''}
//                     </h2>

//                     <div className="flex items-center gap-2">
//                         {/* Tri */}
//                         <Select
//                             value={filters.sort || 'newest'}
//                             onValueChange={updateSort}
//                         >
//                             <SelectTrigger className="w-45 rounded-full">
//                                 <ArrowUpDown className="mr-2 h-4 w-4" />
//                                 <SelectValue placeholder="Trier par" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 <SelectItem value="newest">
//                                     Nouveautés
//                                 </SelectItem>
//                                 <SelectItem value="popular">
//                                     Popularité
//                                 </SelectItem>
//                                 <SelectItem value="price_asc">
//                                     Prix croissant
//                                 </SelectItem>
//                                 <SelectItem value="price_desc">
//                                     Prix décroissant
//                                 </SelectItem>
//                             </SelectContent>
//                         </Select>

//                         {/* Vue (grid/list) */}
//                         <div className="hidden rounded-full border p-1 md:flex">
//                             <Button
//                                 variant={
//                                     viewMode === 'grid' ? 'default' : 'ghost'
//                                 }
//                                 size="icon"
//                                 className="h-8 w-8 rounded-full"
//                                 onClick={() => setViewMode('grid')}
//                             >
//                                 <Grid3x3 className="h-4 w-4" />
//                             </Button>
//                             <Button
//                                 variant={
//                                     viewMode === 'list' ? 'default' : 'ghost'
//                                 }
//                                 size="icon"
//                                 className="h-8 w-8 rounded-full"
//                                 onClick={() => setViewMode('list')}
//                             >
//                                 <List className="h-4 w-4" />
//                             </Button>
//                         </div>

//                         {/* Filtres mobile */}
//                         <Sheet
//                             open={mobileFiltersOpen}
//                             onOpenChange={setMobileFiltersOpen}
//                         >
//                             <SheetTrigger asChild>
//                                 <Button
//                                     variant="outline"
//                                     size="icon"
//                                     className="rounded-full lg:hidden"
//                                 >
//                                     <Filter className="h-4 w-4" />
//                                 </Button>
//                             </SheetTrigger>
//                             <SheetContent side="left" className="w-75">
//                                 <SheetHeader>
//                                     <SheetTitle>Filtres</SheetTitle>
//                                 </SheetHeader>
//                                 <div className="py-4">
//                                     <p className="text-sm text-muted-foreground">
//                                         Filtres avancés à venir...
//                                     </p>
//                                 </div>
//                             </SheetContent>
//                         </Sheet>
//                     </div>
//                 </div>

//                 {/* Grille produits */}
//                 {products.data.length === 0 ? (
//                     <div className="flex min-h-100 items-center justify-center">
//                         <motion.div
//                             initial={{ opacity: 0, y: 10 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ duration: 0.4 }}
//                             className="flex flex-col items-center justify-center text-center"
//                         >
//                             {/* Illustration */}
//                             <div className="mb-6 text-muted-foreground/40">
//                                 <svg
//                                     width="120"
//                                     height="120"
//                                     viewBox="0 0 24 24"
//                                     fill="none"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                 >
//                                     <path
//                                         d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z"
//                                         stroke="currentColor"
//                                         strokeWidth="1.5"
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                     />
//                                     <path
//                                         d="M16 21V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V21"
//                                         stroke="currentColor"
//                                         strokeWidth="1.5"
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                     />
//                                     <path
//                                         d="M2 12H22"
//                                         stroke="currentColor"
//                                         strokeWidth="1.5"
//                                         strokeLinecap="round"
//                                     />
//                                 </svg>
//                             </div>
//                             <h3 className="mb-2 text-xl font-semibold">
//                                 Aucun produit trouvé
//                             </h3>
//                             <p className="mb-6 max-w-md text-muted-foreground">
//                                 Il n'y a pas encore de produits dans cette
//                                 catégorie. Découvrez nos autres collections ou
//                                 revenez plus tard.
//                             </p>
//                             <div className="flex flex-wrap justify-center gap-3">
//                                 <Button asChild>
//                                     <Link href={route('product.index')}>
//                                         Voir tous les produits
//                                         <ChevronRight className="ml-2 h-4 w-4" />
//                                     </Link>
//                                 </Button>
//                                 <Button variant="outline" asChild>
//                                     <Link
//                                         href={route('product.category.index')}
//                                     >
//                                         Explorer les catégories
//                                     </Link>
//                                 </Button>
//                             </div>
//                         </motion.div>
//                     </div>
//                 ) : (
//                     <>
//                         <AnimatePresence mode="wait">
//                             <motion.div
//                                 key={products.current_page}
//                                 initial={{ opacity: 0 }}
//                                 animate={{ opacity: 1 }}
//                                 exit={{ opacity: 0 }}
//                                 className={`grid gap-4 ${
//                                     viewMode === 'grid'
//                                         ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
//                                         : 'grid-cols-1'
//                                 }`}
//                             >
//                                 {products.data.map((product) => (
//                                     <motion.div
//                                         key={product.id}
//                                         layout
//                                         className="w-full" // ← Ajout
//                                         initial={{ opacity: 0, scale: 0.95 }}
//                                         animate={{ opacity: 1, scale: 1 }}
//                                         exit={{ opacity: 0 }}
//                                         transition={{ duration: 0.3 }}
//                                     >
//                                         <ProductCard
//                                             product={product}
//                                             viewMode={viewMode}
//                                         />
//                                     </motion.div>
//                                 ))}
//                             </motion.div>
//                         </AnimatePresence>

//                         {/* Pagination stylisée */}
//                         {products.last_page > 1 && (
//                             <div className="mt-12 flex justify-center">
//                                 <div className="flex gap-2 rounded-full border bg-card p-1 shadow-sm">
//                                     {Array.from(
//                                         { length: products.last_page },
//                                         (_, i) => i + 1,
//                                     ).map((page) => (
//                                         <button
//                                             key={page}
//                                             onClick={() =>
//                                                 router.get(
//                                                     window.location.pathname,
//                                                     {
//                                                         page,
//                                                         sort: filters.sort,
//                                                     },
//                                                     {
//                                                         preserveState: true,
//                                                         preserveScroll: true,
//                                                         only: ['products'],
//                                                         showProgress: false,
//                                                     },
//                                                 )
//                                             }
//                                             className={`h-10 w-10 rounded-full text-sm font-medium transition-all ${
//                                                 page === products.current_page
//                                                     ? 'bg-primary text-primary-foreground shadow-md'
//                                                     : 'hover:bg-muted'
//                                             }`}
//                                         >
//                                             {page}
//                                         </button>
//                                     ))}
//                                 </div>
//                             </div>
//                         )}
//                     </>
//                 )}
//             </div>
//         </MainLayout>
//     );
// }
// resources/js/Pages/Shop/Categories/Show.tsx
import { Head, Link, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRight,
    Filter,
    Grid3x3,
    List,
    ArrowUpDown,
    Search,
    SlidersHorizontal,
    Star,
    X,
    Package,
    TrendingUp,
    Sparkles,
} from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
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
import { home } from '@/routes';
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

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Filtres avancés simulés (à connecter au backend)
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

    // Pagination améliorée
    const totalPages = products.last_page;
    const currentPage = products.current_page;
    const totalProducts = products.total ?? products.data.length;

    // Affichage des pages avec ellipsis
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

    return (
        <MainLayout>
            <Head title={category.nom} />

            <div className="mx-auto max-w-7xl px-4 py-8">
                {/* Fil d'Ariane */}
                <nav className="mb-6 flex flex-wrap items-center text-sm text-muted-foreground">
                    <Link href={home()} className="hover:text-foreground">
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

                {/* Bannière de catégorie améliorée */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative mb-12 overflow-hidden rounded-3xl bg-linear-to-br from-primary/10 via-secondary/5 to-background shadow-sm"
                >
                    {category.banner && (
                        <img
                            src={category.banner}
                            alt={category.nom}
                            className="absolute inset-0 h-full w-full object-cover opacity-25"
                        />
                    )}
                    <div className="relative p-8 md:p-12">
                        <div className="flex flex-wrap items-center gap-4">
                            <div>
                                <h1 className="font-heading text-4xl font-bold tracking-tight md:text-5xl">
                                    {category.nom}
                                </h1>
                                {category.description && (
                                    <p className="mt-3 max-w-2xl text-muted-foreground md:text-lg">
                                        {category.description}
                                    </p>
                                )}
                            </div>
                            <div className="ml-auto flex items-center gap-3">
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
                    </div>
                </motion.div>

                {/* Sous-catégories en chips */}
                {subcategories.length > 0 && (
                    <div className="mb-10">
                        <h2 className="mb-4 text-xl font-semibold">
                            Explorer les sous-catégories
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {subcategories.map((sub) => (
                                <Link
                                    key={sub.id}
                                    href={sub.url}
                                    className="group flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm font-medium shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
                                >
                                    <div className="h-8 w-8 overflow-hidden rounded-full bg-muted">
                                        <img
                                            src={
                                                sub.image ||
                                                '/storage/images/getting-business.jpg'
                                            }
                                            alt={sub.nom}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <span>{sub.nom}</span>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Barre d'outils flottante */}
                <div className="sticky top-16 z-20 mb-6 rounded-2xl border bg-card/80 p-3 shadow-sm backdrop-blur-md">
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Recherche rapide */}
                        <div className="relative max-w-md min-w-50 flex-1">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher dans cette catégorie..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-10 rounded-full pl-9"
                            />
                        </div>

                        {/* Tri */}
                        <Select
                            value={filters.sort || 'newest'}
                            onValueChange={updateSort}
                        >
                            <SelectTrigger className="w-40 rounded-full">
                                <ArrowUpDown className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Trier" />
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
                                <SelectItem value="rating">
                                    Meilleure note
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Vue */}
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

                        {/* Filtres (panneau latéral) */}
                        <Sheet
                            open={mobileFiltersOpen}
                            onOpenChange={setMobileFiltersOpen}
                        >
                            <SheetTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2 rounded-full"
                                >
                                    <SlidersHorizontal className="h-4 w-4" />
                                    Filtres
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-80 sm:w-96">
                                <SheetHeader>
                                    <SheetTitle>Filtres</SheetTitle>
                                </SheetHeader>
                                <div className="space-y-6 py-6">
                                    {/* Prix */}
                                    <div>
                                        <label className="text-sm font-medium">
                                            Prix (€)
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

                                    {/* Note minimum */}
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
                                                    className={`rounded-full p-1 transition ${
                                                        star <= minRating
                                                            ? 'text-yellow-400'
                                                            : 'text-gray-300'
                                                    }`}
                                                >
                                                    <Star className="h-6 w-6 fill-current" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* En stock uniquement */}
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
                                        className="w-full rounded-full"
                                        onClick={() =>
                                            setMobileFiltersOpen(false)
                                        }
                                    >
                                        Appliquer
                                    </Button>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>

                {/* Grille produits avec hauteur stable */}
                <div className="min-h-100">
                    {products.data.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="flex flex-col items-center justify-center py-20 text-center"
                        >
                            <div className="mb-6 text-muted-foreground/40">
                                <Package className="mx-auto h-20 w-20" />
                            </div>
                            <h3 className="mb-2 text-2xl font-semibold">
                                Aucun produit trouvé
                            </h3>
                            <p className="mb-8 max-w-md text-muted-foreground">
                                Il n'y a pas encore de produits dans cette
                                catégorie. Découvrez nos autres collections ou
                                revenez plus tard.
                            </p>
                            <div className="flex flex-wrap justify-center gap-3">
                                <Button asChild className="rounded-full">
                                    <Link href={route('product.index')}>
                                        Voir tous les produits
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    asChild
                                    className="rounded-full"
                                >
                                    <Link
                                        href={route('product.category.index')}
                                    >
                                        Explorer les catégories
                                    </Link>
                                </Button>
                            </div>
                        </motion.div>
                    ) : (
                        <>
                            <div
                                className={`grid gap-4 ${
                                    viewMode === 'grid'
                                        ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                                        : 'grid-cols-1'
                                }`}
                            >
                                <AnimatePresence mode="popLayout">
                                    {products.data.map((product) => (
                                        <motion.div
                                            key={product.id}
                                            layout
                                            initial={{
                                                opacity: 0,
                                                scale: 0.95,
                                            }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="w-full"
                                        >
                                            <ProductCard
                                                product={product}
                                                viewMode={viewMode}
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {/* Pagination avancée */}
                            {totalPages > 1 && (
                                <div className="mt-12 flex justify-center">
                                    <nav
                                        className="flex items-center gap-1"
                                        aria-label="Pagination"
                                    >
                                        <button
                                            onClick={() =>
                                                router.get(
                                                    window.location.pathname,
                                                    {
                                                        page: currentPage - 1,
                                                        sort: filters.sort,
                                                    },
                                                    {
                                                        preserveState: true,
                                                        preserveScroll: true,
                                                    },
                                                )
                                            }
                                            disabled={currentPage === 1}
                                            className="rounded-full p-2 hover:bg-muted disabled:opacity-50"
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
                                                        router.get(
                                                            window.location
                                                                .pathname,
                                                            {
                                                                page,
                                                                sort: filters.sort,
                                                            },
                                                            {
                                                                preserveState: true,
                                                                preserveScroll: true,
                                                            },
                                                        )
                                                    }
                                                    className={`h-10 w-10 rounded-full text-sm font-medium transition-all ${
                                                        page === currentPage
                                                            ? 'bg-primary text-primary-foreground shadow-md'
                                                            : 'hover:bg-muted'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            ),
                                        )}
                                        <button
                                            onClick={() =>
                                                router.get(
                                                    window.location.pathname,
                                                    {
                                                        page: currentPage + 1,
                                                        sort: filters.sort,
                                                    },
                                                    {
                                                        preserveState: true,
                                                        preserveScroll: true,
                                                    },
                                                )
                                            }
                                            disabled={
                                                currentPage === totalPages
                                            }
                                            className="rounded-full p-2 hover:bg-muted disabled:opacity-50"
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </button>
                                    </nav>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Section "À ne pas manquer" dans cette catégorie */}
                {products.data.length > 0 && (
                    <div className="mt-16 border-t pt-10">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <span className="text-xs font-semibold tracking-wider text-primary uppercase">
                                    <TrendingUp className="mr-1 inline h-4 w-4" />
                                    Populaires dans {category.nom}
                                </span>
                                <h2 className="mt-1 text-2xl font-bold">
                                    À ne pas manquer
                                </h2>
                            </div>
                        </div>
                        {/* On pourrait afficher les produits les mieux notés ou les plus vendus de la catégorie ici, mais par simplicité, on reprend les 4 premiers produits */}
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
