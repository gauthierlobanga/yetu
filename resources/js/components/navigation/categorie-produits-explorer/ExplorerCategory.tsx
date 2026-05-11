// resources/js/components/navigation/ProductsMegaMenu.tsx
import { Link } from '@inertiajs/react';
import gsap from 'gsap';
import {
    Store,
    ShoppingCart,
    Smartphone,
    Globe,
    Palette,
    Settings,
    Sparkles,
    ChevronRight,
    ShoppingBag,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

// Types correspondant à votre modèle Eloquent
interface Product {
    id: number;
    nom: string;
    prix: number;
    image_url: string;
    slug: string;
}

interface Category {
    id: number;
    nom: string;
    slug: string;
    description: string;
    produits: Product[];
    sous_categories?: string[];
    icone?: string;
}

// Mapping d’icônes (à adapter avec vos propres icônes)
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    boutique: Store,
    panier: ShoppingCart,
    mobile: Smartphone,
    globe: Globe,
    palette: Palette,
    parametres: Settings,
};

// Props attendues depuis le contrôleur Inertia
interface Props {
    categories: Category[];
}

// Composant pour l'absence totale de catégories (animé)
function EmptyCategories() {
    const iconRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!iconRef.current) {
            return;
        }

        const ctx = gsap.context(() => {
            gsap.fromTo(
                iconRef.current,
                { scale: 0, rotation: -180, opacity: 0 },
                {
                    scale: 1,
                    rotation: 0,
                    opacity: 1,
                    duration: 0.6,
                    ease: 'back.out(1.7)',
                },
            );
            gsap.fromTo(
                textRef.current,
                { y: 20, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    delay: 0.2,
                    ease: 'power2.out',
                },
            );
        });

        return () => ctx.revert();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div
                ref={iconRef}
                className="mb-6 rounded-full bg-linear-to-br from-emerald-100 to-emerald-200 p-5 shadow-lg shadow-emerald-100/50 dark:from-emerald-900/30 dark:to-emerald-800/20 dark:shadow-emerald-800/20"
            >
                <Store className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div ref={textRef}>
                <h3 className="text-lg font-semibold text-foreground">
                    Aucune catégorie pour le moment
                </h3>
                <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                    Notre marketplace s'anime bientôt. Revenez très vite !
                </p>
            </div>
        </div>
    );
}

// Composant pour une catégorie sans produits (animé)
function EmptyProducts({ categoryName }: { categoryName: string }) {
    const iconRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!iconRef.current) {
            return;
        }

        const ctx = gsap.context(() => {
            gsap.fromTo(
                iconRef.current,
                { scale: 0, rotation: 180, opacity: 0 },
                {
                    scale: 1,
                    rotation: 0,
                    opacity: 1,
                    duration: 0.6,
                    ease: 'back.out(1.7)',
                },
            );
            gsap.fromTo(
                textRef.current,
                { y: 20, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    delay: 0.2,
                    ease: 'power2.out',
                },
            );
        });

        return () => ctx.revert();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div
                ref={iconRef}
                className="mb-6 rounded-full bg-linear-to-br from-amber-100 to-amber-200 p-5 shadow-lg shadow-amber-100/50 dark:from-amber-900/30 dark:to-amber-800/20 dark:shadow-amber-800/20"
            >
                <ShoppingBag className="h-10 w-10 text-amber-600 dark:text-amber-400" />
            </div>
            <div ref={textRef}>
                <h3 className="text-lg font-semibold text-foreground">
                    Pas encore de produits
                </h3>
                <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                    La catégorie « {categoryName} » sera bientôt remplie.
                </p>
            </div>
        </div>
    );
}

export function ProductsMegaMenu({ categories = [] }: Props) {
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(
        categories.length > 0 ? categories[0] : null,
    );
    const productsRef = useRef<HTMLDivElement>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const handleCategoryChange = (cat: Category) => {
        if (productsRef.current && !isTransitioning) {
            setIsTransitioning(true);
            const oldProducts =
                productsRef.current.querySelectorAll('.product-card');
            gsap.to(oldProducts, {
                opacity: 0,
                y: -8,
                duration: 0.15,
                stagger: 0.02,
                onComplete: () => {
                    setSelectedCategory(cat);
                },
            });
        } else if (!isTransitioning) {
            setSelectedCategory(cat);
        }
    };

    // Déclenche l'animation d'entrée après mise à jour du DOM
    useEffect(() => {
        if (productsRef.current && selectedCategory && isTransitioning) {
            const timer = setTimeout(() => {
                const newProducts =
                    productsRef.current?.querySelectorAll('.product-card');

                if (newProducts && newProducts.length > 0) {
                    gsap.fromTo(
                        newProducts,
                        { opacity: 0, y: 10 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.25,
                            stagger: 0.03,
                            ease: 'power2.out',
                            onComplete: () => setIsTransitioning(false),
                        },
                    );
                } else {
                    setIsTransitioning(false);
                }
            }, 50);

            return () => clearTimeout(timer);
        }
    }, [selectedCategory, isTransitioning]);

    const getIcon = (cat: Category) => {
        if (cat.icone && iconMap[cat.icone]) {
            return iconMap[cat.icone];
        }

        return Store;
    };

    // Aucune catégorie → état vide
    if (categories.length === 0) {
        return (
            <div className="p-8">
                <EmptyCategories />
            </div>
        );
    }

    const selectedCat = selectedCategory as Category;
    const hasProducts = selectedCat.produits?.length > 0;

    return (
        <div className="grid grid-cols-[1fr_2fr] gap-6 p-6">
            {/* Colonne des catégories */}
            <div>
                <h4 className="mb-4 flex items-center gap-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    <Sparkles className="h-4 w-4 text-emerald-500" />
                    Catégories
                </h4>
                <div className="max-h-128 space-y-1 overflow-y-auto pr-2">
                    {categories.map((cat) => {
                        const Icon = getIcon(cat);
                        const isSelected = selectedCat?.id === cat.id;

                        return (
                            <button
                                key={cat.id}
                                onClick={() => handleCategoryChange(cat)}
                                disabled={isTransitioning}
                                className={`group flex w-full items-center gap-3 rounded-lg p-3 text-left transition-all duration-200 ${
                                    isSelected
                                        ? 'border border-emerald-200 bg-emerald-50 shadow-sm dark:border-emerald-800 dark:bg-emerald-800/20'
                                        : 'border border-transparent hover:bg-emerald-50/50 dark:hover:bg-emerald-800/10'
                                }`}
                            >
                                <div
                                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition-colors ${
                                        isSelected
                                            ? 'bg-emerald-200 text-emerald-700 dark:bg-emerald-700 dark:text-emerald-200'
                                            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                    }`}
                                >
                                    <Icon className="h-4 w-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h5 className="truncate text-sm font-medium text-foreground">
                                        {cat.nom}
                                    </h5>
                                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                        {cat.description}
                                    </p>
                                </div>
                                {isSelected && (
                                    <ChevronRight className="h-4 w-4 shrink-0 text-emerald-500" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Colonne latérale */}
            <div className="pl-4">
                <h4 className="mb-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Produits dans « {selectedCat.nom} »
                </h4>

                {/* Sous‑catégories */}
                {selectedCat.sous_categories?.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                        {selectedCat.sous_categories.map((sub) => (
                            <Link
                                key={sub}
                                href={`/category/${selectedCat.slug}/${sub.toLowerCase()}`}
                                className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-emerald-100 hover:text-emerald-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400"
                            >
                                {sub}
                            </Link>
                        ))}
                    </div>
                )}

                {/* Produits ou état vide */}
                {hasProducts ? (
                    <div
                        ref={productsRef}
                        className="grid max-h-128 grid-cols-5 gap-3 overflow-y-auto pr-2"
                    >
                        {selectedCat.produits.map((product) => (
                            <Link
                                key={product.id}
                                href={`/product/${product.slug}`}
                                className="product-card group flex flex-col rounded-xl p-2 transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50"
                            >
                                <div className="mb-2 aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                                    <img
                                        src={product.image_url}
                                        alt={product.nom}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                </div>
                                <p className="line-clamp-1 text-xs font-medium text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                                    {product.nom}
                                </p>
                                <p className="mt-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                    {new Intl.NumberFormat('fr-CD', {
                                        style: 'currency',
                                        currency: 'CDF',
                                    }).format(product.prix)}
                                </p>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <EmptyProducts categoryName={selectedCat.nom} />
                )}

                {/* CTA */}
                <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
                    <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                        Boostez votre activité
                    </p>
                    <Link
                        href={route('vendor.register')}
                        className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                    >
                        Créer ma boutique →
                    </Link>
                </div>
            </div>
        </div>
    );
}
