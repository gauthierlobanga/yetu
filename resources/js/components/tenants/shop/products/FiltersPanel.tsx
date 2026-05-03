// resources/js/components/ecommerce/products/FiltersPanel.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import type { Category } from '@/types/tenants/products';

interface LocalFilters {
    category?: string;
    brand?: string;
    min_price?: string;
    max_price?: string;
    search?: string;
    sort?: string;
    page?: string;
}

interface FiltersPanelProps {
    categories: Category[];
    brands: { id: number; name: string }[];
    localFilters: LocalFilters;
    priceRange: [number, number];
    setPriceRange: React.Dispatch<React.SetStateAction<[number, number]>>;
    applyFilters: (newFilters: Partial<LocalFilters>) => void;
    clearAllFilters: () => void;
    applyPriceFilter: () => void;
    minPossiblePrice: number;
    maxPossiblePrice: number;
}

export default function FiltersPanel({
    categories,
    brands,
    localFilters,
    priceRange,
    setPriceRange,
    applyFilters,
    clearAllFilters,
    applyPriceFilter,
    minPossiblePrice,
    maxPossiblePrice,
}: FiltersPanelProps) {
    const [searchInput, setSearchInput] = useState(localFilters.search || '');
    const [categorySearch, setCategorySearch] = useState('');
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
    const [isPriceOpen, setIsPriceOpen] = useState(true);

    // Filtrer les catégories par recherche
    const filteredCategories = useMemo(() => {
        if (!categorySearch) {
            return categories;
        }

        return categories.filter((cat) =>
            cat.nom.toLowerCase().includes(categorySearch.toLowerCase()),
        );
    }, [categories, categorySearch]);

    const handleSearchSubmit = () => {
        applyFilters({ search: searchInput || undefined });
    };

    const clearSearch = () => {
        setSearchInput('');
        applyFilters({ search: undefined });
    };

    // Supprimer un filtre individuel
    const removeFilter = (key: keyof LocalFilters) => {
        applyFilters({ [key]: undefined });
    };

    // Filtres actifs sous forme de badges
    const activeFilters = useMemo(() => {
        const filters: {
            key: keyof LocalFilters;
            label: string;
            value: string;
        }[] = [];

        if (localFilters.category) {
            const cat = categories.find(
                (c) => c.slug === localFilters.category,
            );

            if (cat) {
                filters.push({
                    key: 'category',
                    label: 'Catégorie',
                    value: cat.nom,
                });
            }
        }

        if (localFilters.brand) {
            const brand = brands.find(
                (b) => String(b.id) === localFilters.brand,
            );

            if (brand) {
                filters.push({
                    key: 'brand',
                    label: 'Marque',
                    value: brand.name,
                });
            }
        }

        if (localFilters.min_price || localFilters.max_price) {
            const min = localFilters.min_price || minPossiblePrice;
            const max = localFilters.max_price || maxPossiblePrice;
            filters.push({
                key: 'min_price',
                label: 'Prix',
                value: `€${min} - €${max}`,
            });
        }

        if (localFilters.search) {
            filters.push({
                key: 'search',
                label: 'Recherche',
                value: localFilters.search,
            });
        }

        return filters;
    }, [localFilters, categories, brands, minPossiblePrice, maxPossiblePrice]);

    return (
        <div className="relative z-0 space-y-5 rounded-xs border bg-card/80 p-5 backdrop-blur-sm">
            {/* En-tête avec compteur et bouton reset */}
            <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5 text-primary" />
                    <h2 className="text-base font-semibold">Filtres</h2>
                </div>
                {activeFilters.length > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="h-8 text-xs text-muted-foreground hover:text-foreground"
                    >
                        Tout effacer
                    </Button>
                )}
            </div>
            {/* Badges des filtres actifs */}
            {activeFilters.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-wrap gap-2"
                >
                    {activeFilters.map((filter) => (
                        <Badge
                            key={filter.key}
                            variant="secondary"
                            className="gap-1.5 py-1.5 pr-2 pl-3 text-xs font-normal"
                        >
                            <span className="text-muted-foreground">
                                {filter.label}:
                            </span>
                            <span className="max-w-32 truncate font-medium">
                                {filter.value}
                            </span>
                            <button
                                onClick={() => removeFilter(filter.key)}
                                className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
                                aria-label={`Supprimer le filtre ${filter.label}`}
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                </motion.div>
            )}
            {/* Recherche */}
            <div className="space-y-2">
                <Label className="text-sm font-medium">Recherche</Label>
                <div className="relative">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Nom du produit..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={(e) =>
                            e.key === 'Enter' && handleSearchSubmit()
                        }
                        className="pr-16 pl-9"
                    />
                    {searchInput && (
                        <button
                            onClick={clearSearch}
                            className="absolute top-1/2 right-12 -translate-y-1/2 rounded-full p-1 hover:bg-muted"
                        >
                            <X className="h-3.5 w-3.5 text-muted-foreground" />
                        </button>
                    )}
                    <Button
                        size="sm"
                        onClick={handleSearchSubmit}
                        className="absolute top-1/2 right-1 h-7 -translate-y-1/2 px-3 text-xs"
                    >
                        OK
                    </Button>
                </div>
            </div>
            {/* Catégories avec recherche et accordéon */}
            <Collapsible
                open={isCategoriesOpen}
                onOpenChange={setIsCategoriesOpen}
            >
                <CollapsibleTrigger className="flex w-full items-center justify-between py-1">
                    <Label className="text-sm font-medium">Catégories</Label>
                    <ChevronDown
                        className={`h-4 w-4 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`}
                    />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-3 overflow-hidden pt-3">
                    <div className="relative mb-3">
                        <Search className="absolute top-1/2 left-2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Filtrer les catégories..."
                            value={categorySearch}
                            onChange={(e) => setCategorySearch(e.target.value)}
                            className="h-8 pl-8 text-xs"
                        />
                    </div>
                    <ScrollArea className="max-h-60 pr-2">
                        <div className="space-y-1">
                            <AnimatePresence>
                                {filteredCategories.map((cat) => (
                                    <motion.div
                                        key={cat.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex items-center space-x-2 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/50"
                                    >
                                        <Checkbox
                                            id={`cat-${cat.slug}`}
                                            checked={
                                                localFilters.category ===
                                                cat.slug
                                            }
                                            onCheckedChange={(checked) =>
                                                applyFilters({
                                                    category: checked
                                                        ? cat.slug
                                                        : undefined,
                                                })
                                            }
                                        />
                                        <Label
                                            htmlFor={`cat-${cat.slug}`}
                                            className="flex-1 cursor-pointer text-xs"
                                        >
                                            {cat.nom}
                                        </Label>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {filteredCategories.length === 0 && (
                                <p className="py-4 text-center text-xs text-muted-foreground">
                                    Aucune catégorie trouvée
                                </p>
                            )}
                        </div>
                    </ScrollArea>
                </CollapsibleContent>
            </Collapsible>
            {/* Marques */}
            {brands.length > 0 && (
                <div className="space-y-2">
                    <Label className="text-sm font-medium">Marque</Label>
                    <Select
                        value={localFilters.brand || 'all'}
                        onValueChange={(value) =>
                            applyFilters({
                                brand: value === 'all' ? undefined : value,
                            })
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Toutes les marques" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                Toutes les marques
                            </SelectItem>
                            {brands.map((brand) => (
                                <SelectItem
                                    key={brand.id}
                                    value={String(brand.id)}
                                >
                                    {brand.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}
            {/* Prix avec accordéon */}
            <Collapsible open={isPriceOpen} onOpenChange={setIsPriceOpen}>
                <CollapsibleTrigger className="flex w-full items-center justify-between py-1">
                    <Label className="text-sm font-medium">Prix (€)</Label>
                    <ChevronDown
                        className={`h-4 w-4 transition-transform ${isPriceOpen ? 'rotate-180' : ''}`}
                    />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-4 overflow-visible pt-3">
                    <div className="relative px-1 py-2">
                        <Slider
                            min={minPossiblePrice}
                            max={maxPossiblePrice}
                            step={Math.max(
                                1,
                                Math.floor(
                                    (maxPossiblePrice - minPossiblePrice) / 50,
                                ),
                            )}
                            value={priceRange}
                            onValueChange={(value: number[]) =>
                                setPriceRange([value[0], value[1]])
                            }
                            className="my-6"
                        />
                    </div>
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex-1">
                            <Label className="text-xs text-muted-foreground">
                                Min
                            </Label>
                            <div className="mt-1 rounded-md border bg-background px-3 py-1.5 text-sm tabular-nums">
                                €{priceRange[0]}
                            </div>
                        </div>
                        <div className="flex-1">
                            <Label className="text-xs text-muted-foreground">
                                Max
                            </Label>
                            <div className="mt-1 rounded-md border bg-background px-3 py-1.5 text-sm tabular-nums">
                                €{priceRange[1]}
                            </div>
                        </div>
                    </div>
                    <Button
                        size="sm"
                        className="w-full"
                        onClick={applyPriceFilter}
                        disabled={
                            priceRange[0] === minPossiblePrice &&
                            priceRange[1] === maxPossiblePrice
                        }
                    >
                        Appliquer la fourchette
                    </Button>
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
}
