/* eslint-disable react-hooks/set-state-in-effect */
import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertCircle,
    ArrowDown,
    ArrowUp,
    Camera,
    CornerDownLeft,
    FolderTree,
    Loader2,
    PackageSearch,
    SearchIcon,
    X,
} from 'lucide-react';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from '@/hooks/use-debounce';
import { useKeyboardNavigation } from '@/hooks/use-keyboard-navigation-app';
import { handleImageFallback, resolveImageUrl } from '@/lib/media';
import { cn } from '@/lib/utils';
import { api as searchApi, search as searchPage } from '@/routes/tenant';
import {
    index as productIndex,
    show as productShow,
} from '@/routes/tenant/product';
import { show as categoryShow } from '@/routes/tenant/product/category';
import { byImage as searchByImage } from '@/routes/tenant/product/search';

type SearchResultType = 'product' | 'category';

export interface SearchResult {
    id: number | string;
    nom?: string;
    name?: string;
    slug: string;
    description?: string | null;
    excerpt?: string | null;
    url?: string;
    image_principale?: string | null;
    prix_actuel?: number | null;
    prix_ttc?: number | null;
    badge?: string | null;
    produits_count?: number;
    type: SearchResultType;
    _type?: SearchResultType;
}

export interface SearchConfig {
    placeholder?: string;
    hitsPerPage?: number;
    buttonText?: string;
    buttonProps?: React.ComponentProps<typeof SearchButton>;
    openResultsInNewTab?: boolean;
    onResultClick?: (result: SearchResult) => void;
    searchEndpoint?: string;
    showImageSearch?: boolean;
    onImageSearch?: (file: File) => void;
}

interface ImageSearchResponse {
    redirect_url?: string;
    query?: string;
    analysis?: Record<string, unknown>;
    error?: string;
    message?: string;
}

type ImageSearchState =
    | { status: 'idle' }
    | { status: 'loading'; fileName: string; previewUrl: string }
    | {
          status: 'error';
          fileName?: string;
          message: string;
          previewUrl?: string;
      };

const MAX_IMAGE_SEARCH_SIZE = 5 * 1024 * 1024;
const IMAGE_SEARCH_ACCEPT = 'image/jpeg,image/png,image/webp';

function resultType(result: SearchResult): SearchResultType {
    return result._type ?? result.type;
}

function resultTitle(result: SearchResult): string {
    return result.nom ?? result.name ?? 'Résultat';
}

function resultUrl(result: SearchResult): string {
    if (resultType(result) === 'product') {
        return productShow.url(result.slug);
    }

    return categoryShow.url(result.slug);
}

function formatPrice(price?: number | null): string | null {
    if (typeof price !== 'number' || !Number.isFinite(price)) {
        return null;
    }

    return new Intl.NumberFormat('fr-CD', {
        style: 'currency',
        currency: 'CDF',
        maximumFractionDigits: 0,
    }).format(price);
}

function openUrl(url: string, newTab: boolean): void {
    if (newTab) {
        window.open(url, '_blank', 'noopener,noreferrer');

        return;
    }

    window.location.assign(url);
}

function csrfToken(): string {
    return (
        document
            .querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
            ?.getAttribute('content') ?? ''
    );
}

function revokeImagePreview(state: ImageSearchState): void {
    if ('previewUrl' in state && state.previewUrl) {
        URL.revokeObjectURL(state.previewUrl);
    }
}

function imageValidationMessage(file: File): string | null {
    if (!file.type.startsWith('image/')) {
        return 'Sélectionnez une image valide.';
    }

    if (file.size > MAX_IMAGE_SEARCH_SIZE) {
        return 'L’image doit peser 5 Mo maximum.';
    }

    return null;
}

function imageErrorMessage(payload: unknown, fallback: string): string {
    if (payload && typeof payload === 'object') {
        const response = payload as ImageSearchResponse;

        return response.error ?? response.message ?? fallback;
    }

    return fallback;
}

async function uploadImageSearch(file: File): Promise<ImageSearchResponse> {
    const formData = new FormData();
    formData.append('image', file);

    const token = csrfToken();
    const response = await fetch(searchByImage.url(), {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            ...(token ? { 'X-CSRF-TOKEN': token } : {}),
        },
        body: formData,
    });

    const payload = (await response
        .json()
        .catch(() => ({}))) as ImageSearchResponse;

    if (!response.ok) {
        throw new Error(
            imageErrorMessage(
                payload,
                'Impossible d’analyser cette image pour le moment.',
            ),
        );
    }

    return payload;
}

interface SearchButtonProps extends React.ComponentProps<typeof Button> {
    showImageSearch?: boolean;
    onImageSearch?: (file: File) => void;
    isImageSearching?: boolean;
}

export const SearchButton: React.FC<SearchButtonProps> = ({
    className,
    children,
    showImageSearch,
    onImageSearch,
    isImageSearching,
    ...buttonProps
}) => {
    const [modifierLabel, setModifierLabel] = useState('Ctrl');

    useEffect(() => {
        if (typeof navigator === 'undefined') {
            return;
        }

        setModifierLabel(
            /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform) ? 'Cmd' : 'Ctrl',
        );
    }, []);

    return (
        <Button
            variant="outline"
            type="button"
            className={cn(
                'h-auto w-full cursor-pointer justify-between gap-2 rounded-xl border border-emerald-400 bg-white/80 px-4 py-2.5 text-sm font-medium text-slate-700 transition-all hover:border-emerald-300 hover:bg-white dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:border-emerald-600 dark:hover:bg-slate-800',
                className,
            )}
            aria-label="Ouvrir la recherche produits"
            {...buttonProps}
        >
            <span className="flex min-w-0 items-center gap-2">
                <SearchIcon
                    size={18}
                    className="shrink-0 text-slate-400 dark:text-slate-500"
                />
                <span className="hidden truncate sm:inline">{children}</span>
            </span>
            <span className="flex items-center gap-2">
                {showImageSearch && (
                    <label
                        onClick={(event) => event.stopPropagation()}
                        className={cn(
                            'cursor-pointer rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-emerald-600 dark:hover:bg-slate-700 dark:hover:text-emerald-400',
                            isImageSearching &&
                                'pointer-events-none text-emerald-600 dark:text-emerald-400',
                        )}
                        title="Recherche par image"
                    >
                        {isImageSearching ? (
                            <Loader2 className="h-4.5 w-4.5 animate-spin" />
                        ) : (
                            <Camera size={18} />
                        )}
                        <span className="sr-only">Recherche par image</span>
                        <input
                            type="file"
                            accept={IMAGE_SEARCH_ACCEPT}
                            className="hidden"
                            disabled={isImageSearching}
                            onChange={(event) => {
                                const file = event.target.files?.[0];

                                if (file) {
                                    onImageSearch?.(file);
                                    event.target.value = '';
                                }
                            }}
                        />
                    </label>
                )}
                <span className="hidden gap-0.5 md:flex">
                    <kbd className="grid h-5 min-w-5 place-items-center rounded bg-slate-100 px-1 text-xs text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                        {modifierLabel}
                    </kbd>
                    <kbd className="grid h-5 min-w-5 place-items-center rounded bg-slate-100 px-1 text-xs text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                        K
                    </kbd>
                </span>
            </span>
        </Button>
    );
};

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const previousOverflow = document.body.style.overflow;
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm md:pt-[10vh] dark:bg-black/60"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.97, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: -8 }}
                transition={{ duration: 0.18 }}
                className="flex h-full w-full max-w-full flex-col overflow-hidden bg-white shadow-2xl shadow-emerald-500/10 md:h-auto md:max-h-[80vh] md:w-[90%] md:max-w-2xl md:rounded-2xl dark:bg-slate-900 dark:shadow-emerald-900/20"
                onClick={(event) => event.stopPropagation()}
            >
                {children}
            </motion.div>
        </div>,
        document.body,
    );
};

interface SearchInputFieldProps {
    query: string;
    setQuery: (query: string) => void;
    placeholder?: string;
    inputRef: React.RefObject<HTMLInputElement | null>;
    onClose: () => void;
    onArrowDown?: () => void;
    onArrowUp?: () => void;
    onEnter?: () => void;
    isLoading?: boolean;
    showImageSearch?: boolean;
    onImageSearch?: (file: File) => void;
    isImageSearching?: boolean;
}

const SearchInputField = memo(function SearchInputField({
    query,
    setQuery,
    placeholder,
    inputRef,
    onClose,
    onArrowDown,
    onArrowUp,
    onEnter,
    isLoading,
    showImageSearch,
    onImageSearch,
    isImageSearching,
}: SearchInputFieldProps) {
    return (
        <div className="flex items-center gap-3 border-b border-slate-200/80 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
            <SearchIcon className="h-5 w-5 shrink-0 text-slate-400 dark:text-slate-500" />
            <input
                ref={inputRef}
                type="search"
                inputMode="search"
                className="min-w-0 flex-1 bg-transparent text-base font-medium text-slate-800 outline-none placeholder:text-slate-400 sm:text-lg dark:text-slate-100 dark:placeholder:text-slate-500"
                placeholder={
                    placeholder ?? 'Rechercher un produit, une catégorie...'
                }
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                    if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        onArrowDown?.();
                    } else if (event.key === 'ArrowUp') {
                        event.preventDefault();
                        onArrowUp?.();
                    } else if (event.key === 'Enter') {
                        event.preventDefault();
                        onEnter?.();
                    }
                }}
                autoFocus
            />
            <div className="flex items-center gap-1.5">
                {isLoading && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                )}
                {showImageSearch && (
                    <label
                        className={cn(
                            'cursor-pointer rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-emerald-600 dark:hover:bg-slate-800 dark:hover:text-emerald-400',
                            isImageSearching &&
                                'pointer-events-none text-emerald-600 dark:text-emerald-400',
                        )}
                        title="Recherche par image"
                    >
                        {isImageSearching ? (
                            <Loader2 className="h-4.5 w-4.5 animate-spin" />
                        ) : (
                            <Camera size={18} />
                        )}
                        <span className="sr-only">Recherche par image</span>
                        <input
                            type="file"
                            accept={IMAGE_SEARCH_ACCEPT}
                            className="hidden"
                            disabled={isImageSearching}
                            onChange={(event) => {
                                const file = event.target.files?.[0];

                                if (file) {
                                    onImageSearch?.(file);
                                    event.target.value = '';
                                }
                            }}
                        />
                    </label>
                )}
                {query && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                        onClick={() => {
                            setQuery('');
                            inputRef.current?.focus();
                        }}
                        aria-label="Effacer la recherche"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-lg border-slate-200 bg-white px-2 text-xs font-medium text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                    onClick={onClose}
                >
                    ESC
                </Button>
            </div>
        </div>
    );
});

const ImageSearchPanel = memo(function ImageSearchPanel({
    state,
    onClear,
}: {
    state: ImageSearchState;
    onClear: () => void;
}) {
    if (state.status === 'idle') {
        return null;
    }

    const isLoading = state.status === 'loading';

    return (
        <div className="border-b border-slate-200/80 bg-emerald-50/60 p-4 dark:border-slate-700 dark:bg-emerald-950/20">
            <div className="flex items-center gap-3">
                {state.previewUrl ? (
                    <img
                        src={state.previewUrl}
                        alt={state.fileName ?? 'Image recherchée'}
                        className="h-14 w-14 shrink-0 rounded-xl object-cover shadow-sm"
                    />
                ) : (
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm dark:bg-slate-800">
                        <Camera className="h-6 w-6" />
                    </div>
                )}

                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 shrink-0 animate-spin text-emerald-600 dark:text-emerald-400" />
                        ) : (
                            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                        )}
                        <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                            {isLoading
                                ? 'Analyse de l’image en cours'
                                : 'Recherche image interrompue'}
                        </p>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                        {state.status === 'loading'
                            ? 'Nous détectons les caractéristiques du produit pour ouvrir le catalogue filtré.'
                            : state.message}
                    </p>
                </div>

                {!isLoading && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onClear}
                    >
                        Fermer
                    </Button>
                )}
            </div>
        </div>
    );
});

interface ResultsPanelProps {
    results: SearchResult[];
    selectedIndex: number;
    onResultClick: (result: SearchResult) => void;
    onHoverIndex?: (index: number) => void;
}

const ResultsPanel = memo(function ResultsPanel({
    results,
    selectedIndex,
    onResultClick,
    onHoverIndex,
}: ResultsPanelProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        const selectedElement = container?.querySelector(
            '[aria-selected="true"]',
        ) as HTMLElement | null;

        selectedElement?.scrollIntoView({
            block: 'nearest',
        });
    }, [selectedIndex]);

    return (
        <div
            ref={containerRef}
            className="flex flex-1 flex-col gap-1 overflow-y-auto bg-slate-50/80 p-2 dark:bg-slate-800/30"
            role="listbox"
        >
            {results.map((result, index) => {
                const type = resultType(result);
                const isSelected = selectedIndex === index;
                const price = formatPrice(result.prix_actuel);

                return (
                    <button
                        key={`${type}-${result.id}`}
                        type="button"
                        className={cn(
                            'w-full cursor-pointer rounded-xl p-3 text-left transition-all duration-150',
                            isSelected &&
                                'bg-emerald-50/90 shadow-sm dark:bg-emerald-900/20',
                            !isSelected &&
                                'hover:bg-white dark:hover:bg-slate-800/80',
                        )}
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => onResultClick(result)}
                        onMouseEnter={() => onHoverIndex?.(index)}
                    >
                        {type === 'product' ? (
                            <div className="flex items-start gap-3">
                                <img
                                    src={resolveImageUrl(
                                        result.image_principale,
                                    )}
                                    alt={resultTitle(result)}
                                    onError={handleImageFallback()}
                                    className="h-12 w-12 shrink-0 rounded-xl object-cover shadow-sm"
                                />
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="truncate font-medium text-slate-800 dark:text-slate-200">
                                            {resultTitle(result)}
                                        </p>
                                        {result.badge && (
                                            <Badge className="rounded-full bg-emerald-500 px-2 py-0 text-[10px] font-bold text-white">
                                                {result.badge}
                                            </Badge>
                                        )}
                                    </div>
                                    {result.description && (
                                        <p className="line-clamp-1 text-sm text-slate-500 dark:text-slate-400">
                                            {result.description}
                                        </p>
                                    )}
                                    {price && (
                                        <p className="mt-0.5 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                                            {price}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                    <FolderTree className="h-5 w-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate font-medium text-slate-800 dark:text-slate-200">
                                        {resultTitle(result)}
                                    </p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        Catégorie produit •{' '}
                                        {result.produits_count ?? 0} produit
                                        {result.produits_count !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
    );
});

const NoResults = memo(function NoResults({
    query,
    onClear,
}: {
    query: string;
    onClear: () => void;
}) {
    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-slate-50/80 p-8 text-center dark:bg-slate-800/30">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700">
                <PackageSearch className="h-6 w-6 text-slate-500 dark:text-slate-400" />
            </div>
            <div>
                <p className="text-lg font-medium text-slate-700 dark:text-slate-200">
                    Aucun résultat pour « {query} »
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Essayez un autre mot-clé ou parcourez les catégories.
                </p>
            </div>
            <Button variant="outline" onClick={onClear}>
                Effacer la recherche
            </Button>
        </div>
    );
});

const Footer = memo(function Footer({
    resultsCount,
}: {
    resultsCount: number;
}) {
    return (
        <div className="flex items-center justify-between border-t border-slate-200/80 bg-white px-4 py-3 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            <div className="hidden items-center gap-4 sm:flex">
                <div className="flex items-center gap-1.5">
                    <kbd className="flex h-6 items-center justify-center rounded-md bg-slate-100 px-2 font-medium dark:bg-slate-800">
                        <CornerDownLeft size={14} />
                    </kbd>
                    <span>Ouvrir</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <kbd className="flex h-6 items-center justify-center rounded-md bg-slate-100 px-2 font-medium dark:bg-slate-800">
                        <ArrowUp size={14} />
                    </kbd>
                    <kbd className="flex h-6 items-center justify-center rounded-md bg-slate-100 px-2 font-medium dark:bg-slate-800">
                        <ArrowDown size={14} />
                    </kbd>
                    <span>Naviguer</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <kbd className="flex h-6 items-center justify-center rounded-md bg-slate-100 px-2 font-medium dark:bg-slate-800">
                        ESC
                    </kbd>
                    <span>Fermer</span>
                </div>
            </div>
            <div className="flex-1 text-right sm:flex-none">
                {resultsCount} résultat{resultsCount !== 1 && 's'}
            </div>
        </div>
    );
});

interface SearchModalProps {
    onClose: () => void;
    config: SearchConfig;
    imageSearchState: ImageSearchState;
    onImageSearch: (file: File) => void;
    onClearImageSearch: () => void;
}

function normalizeResults(results: SearchResult[]): SearchResult[] {
    return results
        .map((result) => ({
            ...result,
            type: result._type ?? result.type,
            _type: result._type ?? result.type,
        }))
        .filter(
            (result) =>
                result._type === 'product' || result._type === 'category',
        );
}

function SearchModal({
    onClose,
    config,
    imageSearchState,
    onImageSearch,
    onClearImageSearch,
}: SearchModalProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const debouncedQuery = useDebounce(query, 250);
    const trimmedQuery = query.trim();

    useEffect(() => {
        if (trimmedQuery.length < 2) {
            setResults([]);
            setIsLoading(false);
        }
    }, [trimmedQuery]);

    useEffect(() => {
        const searchTerm = debouncedQuery.trim();

        if (searchTerm.length < 2) {
            return;
        }

        const controller = new AbortController();

        async function fetchResults() {
            setIsLoading(true);

            try {
                const endpoint = config.searchEndpoint ?? searchApi.url();
                const url = new URL(endpoint, window.location.origin);
                url.searchParams.set('q', searchTerm);
                url.searchParams.set('limit', String(config.hitsPerPage ?? 8));

                const response = await fetch(url.toString(), {
                    headers: {
                        Accept: 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error(`Search failed with ${response.status}`);
                }

                const payload = await response.json();
                setResults(normalizeResults(payload.results ?? []));
            } catch (error) {
                if (
                    error instanceof DOMException &&
                    error.name === 'AbortError'
                ) {
                    return;
                }

                setResults([]);
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        }

        fetchResults();

        return () => controller.abort();
    }, [debouncedQuery, config.hitsPerPage, config.searchEndpoint]);

    const { selectedIndex, moveDown, moveUp, hoverIndex } =
        useKeyboardNavigation<SearchResult>(
            results,
            query,
            config.openResultsInNewTab ?? false,
        );

    const handleResultClick = useCallback(
        (result: SearchResult) => {
            if (config.onResultClick) {
                config.onResultClick(result);
                onClose();

                return;
            }

            openUrl(resultUrl(result), config.openResultsInNewTab ?? false);
        },
        [config, onClose],
    );

    const handleActivateSelection = useCallback(() => {
        if (selectedIndex >= 0 && selectedIndex < results.length) {
            handleResultClick(results[selectedIndex]);

            return;
        }

        if (trimmedQuery.length >= 2) {
            openUrl(
                searchPage.url({ query: { q: trimmedQuery } }),
                config.openResultsInNewTab ?? false,
            );
        }
    }, [
        config.openResultsInNewTab,
        handleResultClick,
        results,
        selectedIndex,
        trimmedQuery,
    ]);

    const showResults = results.length > 0 && trimmedQuery.length >= 2;
    const noResults =
        !isLoading && results.length === 0 && trimmedQuery.length >= 2;
    const isImageSearching = imageSearchState.status === 'loading';

    return (
        <div className="flex h-full max-h-[80vh] flex-col">
            <SearchInputField
                query={query}
                setQuery={setQuery}
                placeholder={config.placeholder}
                inputRef={inputRef}
                onClose={onClose}
                onArrowDown={moveDown}
                onArrowUp={moveUp}
                onEnter={handleActivateSelection}
                isLoading={isLoading}
                showImageSearch={config.showImageSearch}
                onImageSearch={onImageSearch}
                isImageSearching={isImageSearching}
            />

            <ImageSearchPanel
                state={imageSearchState}
                onClear={onClearImageSearch}
            />

            {isLoading && !isImageSearching && (
                <div className="flex-1 space-y-3 p-4">
                    <Skeleton className="h-16 w-full rounded-xl" />
                    <Skeleton className="h-16 w-full rounded-xl" />
                    <Skeleton className="h-16 w-full rounded-xl" />
                </div>
            )}

            {showResults && !isLoading && !isImageSearching && (
                <ResultsPanel
                    results={results}
                    selectedIndex={selectedIndex}
                    onResultClick={handleResultClick}
                    onHoverIndex={hoverIndex}
                />
            )}

            {noResults && !isImageSearching && (
                <NoResults
                    query={trimmedQuery}
                    onClear={() => {
                        setQuery('');
                        inputRef.current?.focus();
                    }}
                />
            )}

            {!isLoading && !isImageSearching && (
                <Footer resultsCount={results.length} />
            )}
        </div>
    );
}

export default function SearchExperience(config: SearchConfig) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [imageSearchState, setImageSearchState] = useState<ImageSearchState>({
        status: 'idle',
    });
    const imageSearchStateRef = useRef(imageSearchState);
    const { onClick: buttonOnClick, ...buttonProps } = config.buttonProps ?? {};

    const clearImageSearch = useCallback(() => {
        setImageSearchState((current) => {
            revokeImagePreview(current);

            return { status: 'idle' };
        });
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (
                (event.metaKey || event.ctrlKey) &&
                event.key.toLowerCase() === 'k'
            ) {
                event.preventDefault();
                setIsModalOpen(true);
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        imageSearchStateRef.current = imageSearchState;
    }, [imageSearchState]);

    useEffect(() => {
        return () => revokeImagePreview(imageSearchStateRef.current);
    }, []);

    const handleImageSearch = useCallback(
        async (file: File) => {
            config.onImageSearch?.(file);

            const validationMessage = imageValidationMessage(file);

            if (validationMessage) {
                setIsModalOpen(true);
                setImageSearchState((current) => {
                    revokeImagePreview(current);

                    return {
                        status: 'error',
                        fileName: file.name,
                        message: validationMessage,
                    };
                });

                return;
            }

            const previewUrl = URL.createObjectURL(file);
            setIsModalOpen(true);
            setImageSearchState((current) => {
                revokeImagePreview(current);

                return {
                    status: 'loading',
                    fileName: file.name,
                    previewUrl,
                };
            });

            try {
                const response = await uploadImageSearch(file);
                const redirectUrl =
                    response.redirect_url ??
                    (response.query
                        ? productIndex.url({
                              query: {
                                  search: response.query,
                                  image_search: '1',
                              },
                          })
                        : null);

                if (!redirectUrl) {
                    throw new Error(
                        'Aucun terme exploitable n’a été trouvé dans cette image.',
                    );
                }

                setImageSearchState((current) => {
                    revokeImagePreview(current);

                    return { status: 'idle' };
                });

                openUrl(redirectUrl, config.openResultsInNewTab ?? false);
            } catch (error) {
                setImageSearchState((current) => {
                    if (
                        'previewUrl' in current &&
                        current.previewUrl &&
                        current.previewUrl !== previewUrl
                    ) {
                        URL.revokeObjectURL(current.previewUrl);
                    }

                    return {
                        status: 'error',
                        fileName: file.name,
                        previewUrl,
                        message:
                            error instanceof Error
                                ? error.message
                                : 'Impossible d’analyser cette image pour le moment.',
                    };
                });
            }
        },
        [config],
    );

    return (
        <>
            <SearchButton
                {...buttonProps}
                onClick={(event) => {
                    buttonOnClick?.(event);

                    if (!event.defaultPrevented) {
                        setIsModalOpen(true);
                    }
                }}
                showImageSearch={config.showImageSearch}
                onImageSearch={handleImageSearch}
                isImageSearching={imageSearchState.status === 'loading'}
            >
                {config.buttonText ?? 'Rechercher'}
            </SearchButton>
            <AnimatePresence>
                {isModalOpen && (
                    <Modal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                    >
                        <SearchModal
                            onClose={() => setIsModalOpen(false)}
                            config={config}
                            imageSearchState={imageSearchState}
                            onImageSearch={handleImageSearch}
                            onClearImageSearch={clearImageSearch}
                        />
                    </Modal>
                )}
            </AnimatePresence>
        </>
    );
}
