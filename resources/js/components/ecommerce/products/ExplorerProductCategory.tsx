import { Link } from '@inertiajs/react';
import type { Variants } from 'framer-motion';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    ChevronRight,
    Globe,
    Grid3X3,
    Layers3,
    Palette,
    Settings,
    ShoppingBag,
    ShoppingCart,
    Smartphone,
    Store,
    Zap,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import { handleImageFallback, resolveImageUrl } from '@/lib/media';
import { cn } from '@/lib/utils';
import { show as productShow } from '@/routes/tenant/product';
import {
    index as categoryIndex,
    show as categoryShow,
} from '@/routes/tenant/product/category';

// ----------------------------------------------------------------------
// Types (inchangés)
// ----------------------------------------------------------------------
interface CategoryProduct {
    id: number;
    nom: string;
    slug: string;
    image_principale?: string | null;
    prix?: number | null;
    prix_actuel?: number | null;
    prix_ttc?: number | null;
    badge?: string | null;
}

export interface MegaMenuCategory {
    id: number;
    nom: string;
    slug: string;
    description?: string | null;
    produits?: CategoryProduct[];
    sous_categories?: string[];
    icone?: string | null;
    image?: string | null;
}

interface Props {
    categories: MegaMenuCategory[];
}

// ----------------------------------------------------------------------
// Variantes d’animation (plus douces)
// ----------------------------------------------------------------------
const panelVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};

const stagger: (index: number) => Variants = (index: number) => ({
    hidden: { opacity: 0, y: 16 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            delay: index * 0.04,
            ease: [0.16, 1, 0.3, 1],
        },
    },
});

// ----------------------------------------------------------------------
// Utilitaires
// ----------------------------------------------------------------------
function formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-CD', {
        style: 'currency',
        currency: 'CDF',
        maximumFractionDigits: 0,
    }).format(price);
}

function getProductPrice(product: CategoryProduct): number | null {
    const price = product.prix_actuel ?? product.prix_ttc ?? product.prix;

    return typeof price === 'number' && Number.isFinite(price) ? price : null;
}

function slugifySegment(value: string): string {
    return value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

function subcategoryUrl(
    category: MegaMenuCategory,
    subcategory: string,
): string {
    const slug = `${category.slug}-${slugifySegment(subcategory)}`;

    return categoryShow.url(slug);
}

// ----------------------------------------------------------------------
// Icône métier
// ----------------------------------------------------------------------
function CategoryIcon({
    icon,
    className,
}: {
    icon?: string | null;
    className?: string;
}) {
    switch (icon) {
        case 'globe':
            return <Globe className={className} />;
        case 'mobile':
            return <Smartphone className={className} />;
        case 'palette':
            return <Palette className={className} />;
        case 'panier':
            return <ShoppingCart className={className} />;
        case 'parametres':
            return <Settings className={className} />;
        case 'boutique':
        default:
            return <Store className={className} />;
    }
}

// ----------------------------------------------------------------------
// Visuel catégorie (revisité avec effets émeraude)
// ----------------------------------------------------------------------
function CategoryVisual({
    category,
    isSelected = false,
    size = 'md',
}: {
    category: MegaMenuCategory;
    isSelected?: boolean;
    size?: 'sm' | 'md' | 'lg';
}) {
    const sizeClasses = {
        sm: 'size-10',
        md: 'size-12',
        lg: 'size-20',
    };

    return (
        <div
            className={cn(
                'relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 transition-all duration-300',
                sizeClasses[size],
                isSelected
                    ? 'border-emerald-400/60 bg-emerald-500/10 text-emerald-600 shadow-lg shadow-emerald-500/10 dark:border-emerald-500/50 dark:bg-emerald-500/20 dark:text-emerald-300 dark:shadow-emerald-500/20'
                    : 'border-slate-200/80 bg-white/70 text-slate-500 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-800/50 dark:text-slate-400 group-hover:border-emerald-300 dark:group-hover:border-emerald-600 group-hover:bg-white/90 dark:group-hover:bg-slate-800/80 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 group-hover:shadow-md',
                category.image && 'p-0',
            )}
        >
            {category.image ? (
                <img
                    src={resolveImageUrl(category.image)}
                    alt={category.nom}
                    loading="lazy"
                    onError={handleImageFallback()}
                    className="size-full object-cover"
                />
            ) : (
                <CategoryIcon icon={category.icone} className="size-5" />
            )}
        </div>
    );
}

// ----------------------------------------------------------------------
// États vides (esthétique émeraude & ardoise)
// ----------------------------------------------------------------------
function EmptyCategories() {
    return (
        <Empty className="min-h-80 rounded-2xl border-2 border-dashed border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-slate-50 to-emerald-50/30 dark:from-slate-900 dark:to-emerald-950/30">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <Store className="text-emerald-500" />
                </EmptyMedia>
                <EmptyTitle>Aucune catégorie disponible</EmptyTitle>
                <EmptyDescription>
                    Les collections seront affichées ici dès qu'elles seront publiées.
                </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <Button
                    variant="outline"
                    asChild
                    className="rounded-full border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-300 dark:hover:bg-emerald-950"
                >
                    <Link href={categoryIndex.url()}>
                        Voir le catalogue
                        <ArrowRight data-icon="inline-end" />
                    </Link>
                </Button>
            </EmptyContent>
        </Empty>
    );
}

function EmptyProducts({ categoryName }: { categoryName: string }) {
    return (
        <Empty className="min-h-88 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <ShoppingBag className="text-emerald-500" />
                </EmptyMedia>
                <EmptyTitle>Aucun produit disponible</EmptyTitle>
                <EmptyDescription>
                    La catégorie « {categoryName} » sera bientôt enrichie avec de nouveaux produits.
                </EmptyDescription>
            </EmptyHeader>
        </Empty>
    );
}

// ----------------------------------------------------------------------
// Carte produit (effet émeraude au survol)
// ----------------------------------------------------------------------
function ProductPreviewCard({
    product,
    index,
}: {
    product: CategoryProduct;
    index: number;
}) {
    const price = getProductPrice(product);

    return (
        <motion.div
            variants={stagger(index)}
            initial="hidden"
            animate="show"
            layout
        >
            <Link
                href={productShow.url(product.slug)}
                prefetch
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/10 dark:border-slate-700 dark:bg-slate-800/80 dark:hover:border-emerald-600 dark:hover:shadow-emerald-500/20"
            >
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-slate-700/50">
                    <img
                        src={resolveImageUrl(product.image_principale)}
                        alt={product.nom}
                        loading="lazy"
                        onError={handleImageFallback()}
                        className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    {/* Superposition dégradée */}
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-emerald-800/30" />

                    {/* Badge promotionnel */}
                    {product.badge && (
                        <span className="absolute left-3 top-3 rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white shadow-lg backdrop-blur-md dark:bg-emerald-600">
                            {product.badge}
                        </span>
                    )}

                    {/* Prix flottant */}
                    {price !== null && (
                        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-sm font-bold text-slate-800 shadow-lg backdrop-blur-md transition-transform duration-300 group-hover:scale-105 dark:bg-slate-900/90 dark:text-slate-100">
                            {formatPrice(price)}
                        </div>
                    )}
                </div>

                {/* Contenu texte */}
                <div className="flex flex-1 flex-col justify-between gap-3 p-4">
                    <h4 className="line-clamp-2 text-sm font-medium leading-snug text-slate-700 transition-colors group-hover:text-emerald-700 dark:text-slate-200 dark:group-hover:text-emerald-300">
                        {product.nom}
                    </h4>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-all group-hover:text-emerald-600 dark:text-slate-400 dark:group-hover:text-emerald-400">
                        Découvrir
                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                </div>
            </Link>
        </motion.div>
    );
}

// ----------------------------------------------------------------------
// Mega composant – Thème émeraude & ardoise
// ----------------------------------------------------------------------
export function ProductCategoriesMega({ categories = [] }: Props) {
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
        categories[0]?.id ?? null,
    );

    const selectedCat = useMemo(
        () =>
            categories.find((category) => category.id === selectedCategoryId) ??
            categories[0] ??
            null,
        [categories, selectedCategoryId],
    );

    const totalProducts = useMemo(
        () =>
            categories.reduce(
                (total, category) => total + (category.produits?.length ?? 0),
                0,
            ),
        [categories],
    );

    if (!categories.length) {
        return <EmptyCategories />;
    }

    if (!selectedCat) {
        return null;
    }

    const products = selectedCat.produits ?? [];
    const previewProducts = products.slice(0, 12);
    const hasProducts = previewProducts.length > 0;
    const subcategories = selectedCat.sous_categories ?? [];
    const selectedDescription =
        selectedCat.description ||
        'Une sélection pensée pour trouver rapidement les bons produits.';

    return (
        <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={panelVariants}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-emerald-50/30 shadow-2xl shadow-emerald-500/5 backdrop-blur-sm dark:border-slate-700 dark:from-slate-900 dark:via-slate-800 dark:to-emerald-950/20 dark:shadow-emerald-500/10"
        >
            <div className="grid min-h-[38rem] grid-cols-1 lg:grid-cols-[22rem_minmax(0,1fr)]">
                {/* -------- Colonne latérale (ardoise clair / sombre) -------- */}
                <aside className="relative border-b border-slate-200 bg-white/60 p-6 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-800/50 lg:border-r lg:border-b-0">
                    {/* En-tête */}
                    <div className="mb-8 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 shadow-sm dark:bg-emerald-500/20 dark:text-emerald-300">
                                <Layers3 className="size-5" />
                            </span>
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                    Collections
                                </p>
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                    {categories.length} catégories
                                </p>
                            </div>
                        </div>
                        <Badge
                            variant="outline"
                            className="rounded-full border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300"
                        >
                            {totalProducts}
                        </Badge>
                    </div>

                    {/* Liste des catégories */}
                    <div className="flex gap-2 overflow-x-auto pb-2 lg:max-h-[28rem] lg:flex-col lg:overflow-x-visible lg:overflow-y-auto lg:pr-2">
                        {categories.map((category) => {
                            const isSelected = selectedCat.id === category.id;
                            const productCount = category.produits?.length ?? 0;

                            return (
                                <motion.button
                                    key={category.id}
                                    type="button"
                                    aria-pressed={isSelected}
                                    onClick={() =>
                                        setSelectedCategoryId(category.id)
                                    }
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={cn(
                                        'group relative flex min-w-72 items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-300 lg:min-w-0',
                                        isSelected
                                            ? 'border-emerald-300 bg-emerald-50/80 shadow-lg shadow-emerald-500/5 dark:border-emerald-600 dark:bg-emerald-500/10 dark:shadow-emerald-500/10'
                                            : 'border-transparent bg-white/40 hover:border-slate-200 hover:bg-white/80 hover:shadow-md dark:bg-slate-800/30 dark:hover:border-slate-600 dark:hover:bg-slate-800/60',
                                    )}
                                >
                                    {/* Indicateur actif animé */}
                                    {isSelected && (
                                        <motion.span
                                            layoutId="activeCategoryIndicator"
                                            className="absolute inset-y-4 left-0 w-1 rounded-r-full bg-emerald-500 dark:bg-emerald-400"
                                            transition={{
                                                type: 'spring',
                                                stiffness: 500,
                                                damping: 30,
                                            }}
                                        />
                                    )}

                                    <CategoryVisual
                                        category={category}
                                        isSelected={isSelected}
                                        size="md"
                                    />

                                    <span className="min-w-0 flex-1">
                                        <span className="block truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                                            {category.nom}
                                        </span>
                                        <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
                                            {productCount} produit{productCount > 1 ? 's' : ''}
                                        </span>
                                    </span>

                                    <ChevronRight
                                        className={cn(
                                            'size-4 shrink-0 text-slate-400 transition-all duration-300 dark:text-slate-500',
                                            isSelected
                                                ? 'translate-x-0 text-emerald-500 opacity-100 dark:text-emerald-400'
                                                : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:text-slate-600 group-hover:opacity-60 dark:group-hover:text-slate-300',
                                        )}
                                    />
                                </motion.button>
                            );
                        })}
                    </div>

                    {/* Fond décoratif */}
                    <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/40 to-transparent dark:from-slate-800/40" />
                </aside>

                {/* -------- Zone contenu -------- */}
                <section className="min-w-0 p-6 lg:p-8">
                    <motion.div
                        key={selectedCat.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="flex min-h-full flex-col"
                    >
                        {/* En-tête catégorie active */}
                        <div className="flex flex-col gap-6 border-b border-slate-200 pb-8 dark:border-slate-700 xl:flex-row xl:items-start xl:justify-between">
                            <div className="flex gap-5">
                                <CategoryVisual
                                    category={selectedCat}
                                    isSelected
                                    size="lg"
                                />

                                <div className="min-w-0">
                                    <Badge
                                        variant="secondary"
                                        className="mb-3 gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                                    >
                                        <Grid3X3 className="size-3.5" />
                                        Collection active
                                    </Badge>
                                    <h3 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100 sm:text-4xl">
                                        {selectedCat.nom}
                                    </h3>
                                    <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
                                        {selectedDescription}
                                    </p>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                size="lg"
                                asChild
                                className="w-full shrink-0 rounded-full border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-600 dark:text-emerald-300 dark:hover:bg-emerald-500/10 sm:w-auto"
                            >
                                <Link
                                    href={categoryShow.url(selectedCat.slug)}
                                    prefetch
                                >
                                    Voir toute la collection
                                    <ArrowRight
                                        data-icon="inline-end"
                                        className="transition-transform group-hover:translate-x-1"
                                    />
                                </Link>
                            </Button>
                        </div>

                        {/* Sous-catégories */}
                        {subcategories.length > 0 && (
                            <div className="-mx-2 flex gap-2 overflow-x-auto border-b border-slate-200 px-2 py-5 dark:border-slate-700">
                                {subcategories.map((subcategory) => (
                                    <Badge
                                        key={subcategory}
                                        variant="outline"
                                        asChild
                                        className="h-9 shrink-0 cursor-pointer rounded-full border-slate-300 bg-white/60 px-4 text-sm font-medium text-slate-600 backdrop-blur-sm transition-all hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-emerald-500 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-300"
                                    >
                                        <Link
                                            href={subcategoryUrl(
                                                selectedCat,
                                                subcategory,
                                            )}
                                            prefetch
                                        >
                                            {subcategory}
                                        </Link>
                                    </Badge>
                                ))}
                            </div>
                        )}

                        {/* Grille produits */}
                        <div className="flex-1 pt-8">
                            {hasProducts ? (
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6">
                                    {previewProducts.map((product, index) => (
                                        <ProductPreviewCard
                                            key={product.id}
                                            product={product}
                                            index={index}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <EmptyProducts categoryName={selectedCat.nom} />
                            )}
                        </div>

                        {/* Footer exploration */}
                        <div className="mt-10 flex flex-col gap-6 rounded-2xl border border-slate-200 bg-slate-50/80 p-6 backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/50 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-start gap-4">
                                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 shadow-sm dark:bg-emerald-500/20 dark:text-emerald-300">
                                    <Zap className="size-5" />
                                </span>
                                <div>
                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                        Explorer toutes les catégories
                                    </p>
                                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                        Parcourez le catalogue complet pour comparer les collections disponibles.
                                    </p>
                                </div>
                            </div>

                            <Button
                                variant="secondary"
                                asChild
                                className="rounded-full bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                            >
                                <Link href={categoryIndex.url()} prefetch>
                                    Toutes les catégories
                                    <ArrowRight data-icon="inline-end" />
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </section>
            </div>
        </motion.div>
    );
}
