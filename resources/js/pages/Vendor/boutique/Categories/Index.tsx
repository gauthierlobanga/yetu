// resources/js/Pages/Shop/Categories/Index.tsx
import { Head, Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight,
    Package,
    Sparkles,
    ShoppingBag,
    Grid3X3,
    Tag,
    Store,
    Search,
    X,
    LayoutGrid,
    Grid2X2,
    LayoutDashboard,
} from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import MainLayout from '@/layouts/main-layout';
import { handleImageFallback, resolveImageUrl } from '@/lib/media';
import { cn } from '@/lib/utils';
import type { Category } from '@/types/ecommerce/products';

interface PageProps extends Record<string, unknown> {
    categories: Category[];
}

type ViewMode = 'comfortable' | 'compact' | 'bento';

export default function CategoriesIndex() {
    const { props } = usePage<PageProps>();
    const { categories } = props;

    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<string>('name_asc');
    const [viewMode, setViewMode] = useState<ViewMode>('comfortable');
    const [isLoading, setIsLoading] = useState(false);

    // Filtrage et tri locaux
    const filteredCategories = useMemo(() => {
        let result = [...categories];

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (cat) =>
                    cat.nom.toLowerCase().includes(query) ||
                    (cat.description?.toLowerCase() ?? '').includes(query),
            );
        }

        switch (sortBy) {
            case 'name_asc':
                result.sort((a, b) => a.nom.localeCompare(b.nom));
                break;
            case 'name_desc':
                result.sort((a, b) => b.nom.localeCompare(a.nom));
                break;
            case 'products_desc':
                result.sort(
                    (a, b) => (b.products_count ?? 0) - (a.products_count ?? 0),
                );
                break;
            case 'products_asc':
                result.sort(
                    (a, b) => (a.products_count ?? 0) - (b.products_count ?? 0),
                );
                break;
        }

        return result;
    }, [categories, searchQuery, sortBy]);

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 300);
        return () => clearTimeout(timer);
    }, [viewMode, searchQuery, sortBy]);

    const clearSearch = () => setSearchQuery('');

    const gridClass = useMemo(() => {
        switch (viewMode) {
            case 'compact':
                return 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6';
            case 'comfortable':
                return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';
            case 'bento':
                return 'grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 auto-rows-[280px] grid-flow-dense';
            default:
                return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';
        }
    }, [viewMode]);

    const getBentoClasses = (index: number) => {
        const pattern = index % 6;
        switch (pattern) {
            case 0: return 'sm:col-span-2 sm:row-span-2';
            case 3: return 'sm:col-span-2 sm:row-span-1';
            case 4: return 'sm:col-span-1 sm:row-span-2';
            default: return 'sm:col-span-1 sm:row-span-1';
        }
    };

    const skeletonCount = viewMode === 'compact' ? categories.length : categories.length;

    return (
        <MainLayout>
            <Head title="Toutes les catégories" />

            {/* Premium Hero Section */}
            <section className="relative overflow-hidden bg-white py-16 md:py-24 dark:bg-slate-950">
                {/* Animated background elements */}
                <div className="absolute inset-0 bg-[url('/img/grid.svg')] bg-center opacity-5 dark:opacity-10" />
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
                    className="pointer-events-none absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-linear-to-bl from-emerald-200/40 via-emerald-100/10 to-transparent blur-3xl dark:from-emerald-900/30 dark:via-emerald-900/10" 
                />
                <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
                    className="pointer-events-none absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-linear-to-tr from-sky-200/40 via-sky-100/10 to-transparent blur-3xl dark:from-sky-900/30 dark:via-sky-900/10" 
                />

                <div className="relative mx-auto max-w-7xl px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        className="mb-6 flex justify-center"
                    >
                        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/50 px-5 py-2 text-sm font-medium text-emerald-700 backdrop-blur-md dark:border-emerald-800/50 dark:bg-emerald-900/30 dark:text-emerald-400">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                            </span>
                            {categories.length} catégorie{categories.length > 1 ? 's' : ''} disponible{categories.length > 1 ? 's' : ''}
                        </span>
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-slate-900 md:text-6xl lg:text-7xl dark:text-white"
                    >
                        Explorez nos{' '}
                        <span className="bg-linear-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-sky-400">
                            univers
                        </span>
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-500 dark:text-slate-400"
                    >
                        Chaque catégorie a été pensée pour vous offrir une expérience unique. Laissez-vous guider à travers notre sélection premium.
                    </motion.p>
                </div>
            </section>

            {/* Category Grid Section */}
            <section className="py-12 md:py-16">
                <div className="mx-auto max-w-7xl px-4">
                    {/* Glassmorphic Toolbar */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-10 flex flex-col gap-4 rounded-2xl border border-slate-200/60 bg-white/60 p-4 shadow-xs backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between dark:border-slate-800/60 dark:bg-slate-900/60"
                    >
                        <div className="relative w-full sm:w-96">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors focus-within:text-emerald-500" />
                            <Input
                                placeholder="Rechercher une catégorie..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-11 rounded-xl border-slate-200/80 bg-white/80 pr-10 pl-10 text-sm shadow-inner transition-all hover:border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500/20 dark:border-slate-700/80 dark:bg-slate-800/80"
                            />
                            {searchQuery && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-slate-100 p-1 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="h-11 w-[160px] rounded-xl border-slate-200/80 bg-white/80 text-sm shadow-inner transition-all hover:border-emerald-300 focus:ring-emerald-500/20 dark:border-slate-700/80 dark:bg-slate-800/80">
                                    <SelectValue placeholder="Trier par" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-800/90">
                                    <SelectItem value="name_asc" className="rounded-lg">Nom A-Z</SelectItem>
                                    <SelectItem value="name_desc" className="rounded-lg">Nom Z-A</SelectItem>
                                    <SelectItem value="products_desc" className="rounded-lg">Plus de produits</SelectItem>
                                    <SelectItem value="products_asc" className="rounded-lg">Moins de produits</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="flex items-center rounded-xl border border-slate-200/80 bg-slate-50/80 p-1.5 shadow-inner backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-800/80">
                                {(
                                    [
                                        'comfortable',
                                        'compact',
                                        'bento',
                                    ] as ViewMode[]
                                ).map((mode) => (
                                    <button
                                        key={mode}
                                        onClick={() => setViewMode(mode)}
                                        className={cn(
                                            "relative rounded-lg p-2 transition-all duration-300",
                                            viewMode === mode
                                                ? 'text-emerald-700 dark:text-emerald-400'
                                                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                                        )}
                                        title={mode === 'bento' ? 'Bento' : mode === 'compact' ? 'Compact' : 'Confortable'}
                                    >
                                        {viewMode === mode && (
                                            <motion.div
                                                layoutId="viewModeBg"
                                                className="absolute inset-0 rounded-lg bg-white shadow-xs dark:bg-slate-700"
                                                initial={false}
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <span className="relative z-10">
                                            {mode === 'comfortable' && <LayoutGrid className="h-4 w-4" />}
                                            {mode === 'compact' && <Grid2X2 className="h-4 w-4" />}
                                            {mode === 'bento' && <LayoutDashboard className="h-4 w-4" />}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {searchQuery && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-6 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"
                        >
                            <span className="flex h-6 items-center justify-center rounded-full bg-emerald-100 px-2.5 font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                                {filteredCategories.length}
                            </span>
                            résultat{filteredCategories.length > 1 ? 's' : ''} pour « <span className="font-semibold text-slate-900 dark:text-white">{searchQuery}</span> »
                        </motion.div>
                    )}

                    {filteredCategories.length > 0 ? (
                        isLoading ? (
                            <div className={cn("grid gap-6", gridClass)}>
                                {Array.from({ length: skeletonCount }).map((_, i) => (
                                    <div key={i} className={cn("group flex flex-col overflow-hidden rounded-2xl bg-white p-2 shadow-xs dark:bg-slate-900", viewMode === 'compact' && "flex-row items-center gap-4")}>
                                        <Skeleton className={cn(viewMode === 'compact' ? "h-16 w-16 rounded-xl" : "aspect-square w-full rounded-xl")} />
                                        <div className={cn("flex-1 space-y-3", viewMode !== 'compact' && "p-4")}>
                                            <Skeleton className="h-5 w-2/3 rounded-full" />
                                            <Skeleton className="h-4 w-1/3 rounded-full" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={viewMode}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={cn("grid gap-6", gridClass)}
                                >
                                    {filteredCategories.map((category, index) => (
                                        <motion.div
                                            key={category.id}
                                            layout
                                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{
                                                delay: index * 0.05,
                                                type: "spring",
                                                stiffness: 300,
                                                damping: 24
                                            }}
                                            className={cn(
                                                viewMode === 'bento' ? getBentoClasses(index) : ''
                                            )}
                                        >
                                            <CategoryCard category={category} viewMode={viewMode} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </AnimatePresence>
                        )
                    ) : (
                        <EmptyState searchQuery={searchQuery} onClear={clearSearch} />
                    )}
                </div>
            </section>

            {/* Premium Advantages Section */}
            <section className="relative overflow-hidden border-t border-slate-200/50 bg-slate-50/50 py-24 dark:border-slate-800/50 dark:bg-slate-900/30">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-slate-50 to-transparent dark:from-slate-900 dark:via-slate-950 dark:to-transparent" />
                <div className="relative mx-auto max-w-7xl px-4">
                    <div className="text-center">
                        <motion.span 
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-5 py-2 text-sm font-medium text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-900/30 dark:text-emerald-400"
                        >
                            <Sparkles className="h-4 w-4" /> L'expérience Yetu
                        </motion.span>
                        <motion.h2 
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="mt-6 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl dark:text-white"
                        >
                            Une navigation pensée pour vous
                        </motion.h2>
                    </div>

                    <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
                        {[
                            {
                                icon: Grid3X3,
                                title: 'Catégories organisées',
                                desc: 'Trouvez facilement ce que vous cherchez grâce à notre arborescence claire.',
                                color: 'from-blue-500 to-cyan-400'
                            },
                            {
                                icon: ShoppingBag,
                                title: 'Produits exclusifs',
                                desc: 'Chaque catégorie propose une sélection unique de produits artisanaux.',
                                color: 'from-emerald-500 to-teal-400'
                            },
                            {
                                icon: Sparkles,
                                title: 'Nouveautés permanentes',
                                desc: 'De nouvelles catégories et produits ajoutés régulièrement.',
                                color: 'from-purple-500 to-pink-400'
                            },
                        ].map(({ icon: Icon, title, desc, color }, idx) => (
                            <motion.div
                                key={title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.15 }}
                                className="group relative flex flex-col items-center rounded-3xl bg-white p-8 text-center shadow-xs transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:bg-slate-900/80 dark:hover:bg-slate-900"
                            >
                                <div className="absolute inset-0 rounded-3xl bg-linear-to-b from-transparent to-slate-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:to-slate-800/50" />
                                <div className={cn("relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-tr text-white shadow-lg", color)}>
                                    <Icon className="h-8 w-8" />
                                </div>
                                <h3 className="relative text-xl font-semibold text-slate-900 dark:text-white">
                                    {title}
                                </h3>
                                <p className="relative mt-3 text-slate-500 leading-relaxed dark:text-slate-400">
                                    {desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}

// -------- Category Card Modernized --------
function CategoryCard({ category, viewMode }: { category: Category; viewMode: ViewMode }) {
    const productsCount = category.products_count ?? 0;

    if (viewMode === 'compact') {
        return (
            <Link
                href={category.url}
                className="group relative flex items-center gap-4 rounded-2xl border border-slate-200/60 bg-white p-3 shadow-xs transition-all duration-300 hover:border-emerald-300 hover:shadow-md dark:border-slate-800/60 dark:bg-slate-900/60 dark:hover:border-emerald-700/60"
            >
                <div className="absolute left-0 top-1/2 h-0 w-1 -translate-y-1/2 rounded-r-full bg-emerald-500 transition-all duration-300 group-hover:h-1/2" />
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                    <img
                        src={resolveImageUrl(category.image)}
                        alt={category.nom}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        onError={handleImageFallback()}
                    />
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-semibold text-slate-800 transition-colors group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                        {category.nom}
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {productsCount} produit{productsCount > 1 ? 's' : ''}
                    </p>
                </div>
            </Link>
        );
    }

    return (
        <Link
            href={category.url}
            className={cn(
                "group relative flex h-full flex-col overflow-hidden rounded-[2rem] bg-slate-100 dark:bg-slate-800",
                viewMode === 'bento' && "min-h-[250px]"
            )}
            style={{ perspective: '1000px' }}
        >
            <div className={cn(
                "relative w-full overflow-hidden",
                viewMode === 'bento' ? "h-full" : "aspect-[4/3] sm:aspect-[3/4]"
            )}>
                <img
                    src={resolveImageUrl(category.image)}
                    alt={category.nom}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    loading="lazy"
                    onError={handleImageFallback()}
                />
                
                {/* Dynamic Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-90" />
                
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-emerald-500/20 opacity-0 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-100" />

                {/* Badges */}
                <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                    <div className="rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md transition-all duration-300 group-hover:bg-emerald-500 group-hover:border-emerald-400 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                        {productsCount} article{productsCount > 1 ? 's' : ''}
                    </div>
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end p-6 md:p-8">
                    <h3 className="text-2xl font-bold tracking-tight text-white transition-transform duration-500 group-hover:-translate-y-1">
                        {category.nom}
                    </h3>
                    {category.description && (
                        <p className="mt-2 line-clamp-2 text-sm text-slate-300 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:-translate-y-4">
                            {category.description}
                        </p>
                    )}
                </div>

                {/* Animated Bottom Bar Indicator */}
                <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20">
                    <div className="h-full w-0 bg-emerald-500 transition-all duration-700 ease-out group-hover:w-full" />
                </div>
            </div>
        </Link>
    );
}

// -------- Empty State Modernized --------
function EmptyState({ searchQuery, onClear }: { searchQuery: string; onClear: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex min-h-[400px] flex-col items-center justify-center rounded-[2.5rem] border border-slate-200/50 bg-linear-to-b from-white to-slate-50/80 p-8 text-center shadow-2xl shadow-slate-200/20 dark:border-slate-800/50 dark:from-slate-900/80 dark:to-slate-950 dark:shadow-none"
        >
            {searchQuery ? (
                <>
                    <motion.div 
                        initial={{ rotate: -10, scale: 0.8 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-tr from-amber-100 to-orange-50 text-amber-600 shadow-inner dark:from-amber-900/40 dark:to-orange-900/20 dark:text-amber-400"
                    >
                        <Search className="h-10 w-10" />
                    </motion.div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Aucune catégorie trouvée
                    </h2>
                    <p className="mt-3 max-w-md text-base text-slate-500 dark:text-slate-400">
                        Nous n’avons trouvé aucune catégorie pour « <span className="font-semibold text-slate-700 dark:text-slate-300">{searchQuery}</span> ».
                    </p>
                    <Button onClick={onClear} variant="outline" className="mt-8 gap-2 rounded-full px-6 transition-all hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                        <X className="h-4 w-4" /> Réinitialiser la recherche
                    </Button>
                </>
            ) : (
                <>
                    <motion.div 
                        initial={{ y: 10, scale: 0.8 }}
                        animate={{ y: 0, scale: 1 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        className="mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-linear-to-tr from-emerald-100 to-sky-100 text-emerald-600 shadow-inner dark:from-emerald-900/40 dark:to-sky-900/20 dark:text-emerald-400"
                    >
                        <Store className="h-12 w-12" />
                    </motion.div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Notre catalogue arrive
                    </h2>
                    <p className="mt-3 max-w-md text-base text-slate-500 dark:text-slate-400">
                        Les catégories sont en cours de préparation pour vous offrir la meilleure sélection.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <Link
                            href={route('tenant.product.index')}
                            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-xl dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
                        >
                            <Sparkles className="h-4 w-4" /> Explorer les produits
                        </Link>
                    </div>
                </>
            )}
        </motion.div>
    );
}
