import { Search, X, Camera, Loader2, Badge, ChevronRight } from 'lucide-react';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import categories from '@/routes/filament/admin/posts/resources/categories';
import { motion, AnimatePresence } from 'framer-motion';

// Composant SearchBar modernisé
export function SearchBarModern() {
    const [searchInput, setSearchInput] = useState('');
    const [isSearchingByImage, setIsSearchingByImage] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSearchChange = (value: string) => {
        setSearchInput(value);
        // Appliquer le filtre ici si besoin
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setIsSearchingByImage(true);
            // Simuler un chargement
            setTimeout(() => setIsSearchingByImage(false), 1500);
        }
    };

    const handleImageSearch = () => {
        fileInputRef.current?.click();
    };

    const clearSearch = () => {
        setSearchInput('');
        // Réinitialiser le filtre
    };

    return (
        <div className="relative mx-auto w-full max-w-2xl">
            {/* Conteneur principal avec effet glassmorphique et ombre sophistiquée */}
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
                                    handleSearchChange(e.target.value)
                                }
                                onFocus={() => setIsFocused(true)}
                                onBlur={() =>
                                    setTimeout(() => setIsFocused(false), 200)
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
                                        search: searchInput || undefined,
                                    })
                                }
                                className="flex items-center gap-1.5 rounded-3xl bg-linear-to-r from-emerald-500 to-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:scale-105 dark:from-emerald-400 dark:to-emerald-500"
                            >
                                <Search className="h-4 w-4" />
                                <span>Rechercher</span>
                            </Button>
                        </div>
                    </div>

                    {/* DROPDOWN DE SUGGESTIONS - s'affiche au focus ou quand il y a du texte */}
                    <AnimatePresence>
                        {(isFocused || searchInput) && (
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: 10,
                                    scale: 0.95,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
                                }}
                                exit={{
                                    opacity: 0,
                                    y: 10,
                                    scale: 0.95,
                                }}
                                transition={{ duration: 0.2 }}
                                className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-2xl border border-slate-200/50 bg-white/95 p-2 shadow-2xl backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/95"
                                style={{ minWidth: '100%' }}
                            >
                                {/* En-tête */}
                                <div className="mb-2 flex items-center justify-between px-3 py-1">
                                    <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                                        {searchInput
                                            ? 'Suggestions'
                                            : 'Recherches populaires'}
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                        {searchInput
                                            ? 'Appuyez sur Entrée pour voir tout'
                                            : 'Essayez ces mots-clés'}
                                    </span>
                                </div>

                                {/* Liste dynamique : catégories + produits populaires */}
                                <div className="space-y-0.5">
                                    {/* Si une recherche est saisie, on affiche les catégories correspondantes (ou toutes) */}
                                    {categories?.slice(0, 3).map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => {
                                                setSearchInput(cat.name);
                                                applyFilters({
                                                    search: cat.name,
                                                    category: String(cat.id),
                                                });
                                                setIsFocused(false);
                                            }}
                                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-emerald-50/50 dark:text-slate-200 dark:hover:bg-slate-800/50"
                                        >
                                            <Search className="h-4 w-4 text-emerald-500" />
                                            <span>{cat.name}</span>
                                            <Badge
                                                variant="outline"
                                                className="ml-auto text-[10px] font-normal text-slate-400"
                                            >
                                                Catégorie
                                            </Badge>
                                        </button>
                                    ))}

                                    {/* Exemples de produits (statiques mais vous pouvez les rendre dynamiques) */}
                                    {[
                                        'Yuminglai',
                                        "Boucles d'oreilles plaquées or",
                                        'Ensembles de bijoux',
                                    ].map((item) => (
                                        <button
                                            key={item}
                                            onClick={() => {
                                                setSearchInput(item);
                                                applyFilters({
                                                    search: item,
                                                });
                                                setIsFocused(false);
                                            }}
                                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-emerald-50/50 dark:text-slate-200 dark:hover:bg-slate-800/50"
                                        >
                                            <Search className="h-4 w-4 text-emerald-500" />
                                            <span>{item}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Lien "Voir tous les résultats" */}
                                <div className="mt-2 border-t border-slate-200/60 pt-2 dark:border-slate-700/60">
                                    <button
                                        onClick={() => {
                                            applyFilters({
                                                search:
                                                    searchInput || undefined,
                                            });
                                            setIsFocused(false);
                                        }}
                                        className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-emerald-600 transition-colors hover:bg-emerald-50/50 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
                                    >
                                        <span>
                                            {searchInput
                                                ? `Voir tous les résultats pour « ${searchInput} »`
                                                : 'Voir tous les produits'}
                                        </span>
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Ligne de texte d'aide (optionnelle) - reprend le "Répondez à des exigences complexes" */}
            <p className="mt-2 text-center text-xs text-slate-400 dark:text-slate-500">
                <span className="inline-flex items-center gap-1">
                    <span className="h-1 w-1 rounded-full bg-emerald-400/60"></span>
                    Répondez à des exigences complexes grâce à la recherche
                    visuelle
                </span>
            </p>
        </div>
    );
}
