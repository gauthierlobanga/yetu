// resources/js/components/search-my-input.tsx

import axios from 'axios';
import {
    ArrowDown,
    ArrowUp,
    CornerDownLeft,
    SearchIcon,
    X,
} from 'lucide-react';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from '@/hooks/use-debounce';
import { useKeyboardNavigation } from '@/hooks/use-keyboard-navigation-app';
import { cn } from '@/lib/utils';

// Types
export interface SearchResult {
    id: number;
    title?: string;
    nom?: string;
    name?: string;
    slug: string;
    excerpt?: string | null;
    content?: string | null;
    featured_image_thumb?: string | null;
    avatar_url?: string | null;
    categories?: Array<{ id: number; nom: string; slug: string }>;
    user?: { id: number; name: string; avatar_url?: string | null };
    _type: 'post' | 'category' | 'user';
    published_at?: string | null;
    views_count?: number;
    posts_count?: number;
}

export interface SearchConfig {
    placeholder?: string;
    hitsPerPage?: number;
    buttonText?: string;
    buttonProps?: React.ComponentProps<typeof SearchButton>;
    openResultsInNewTab?: boolean;
    onResultClick?: (result: SearchResult) => void;
    searchEndpoint?: string; // 🔥 Ajout du endpoint configurable
}

// ============================================================================
// Search Button Component
// ============================================================================

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface SearchButtonProps extends React.ComponentProps<typeof Button> {}

export const SearchButton: React.FC<SearchButtonProps> = ({
    className,
    children,
    ...buttonProps
}) => {
    const [modifierLabel, setModifierLabel] = useState('');
    const [isModifierPressed, setIsModifierPressed] = useState(false);
    const [isKPressed, setIsKPressed] = useState(false);

    useEffect(() => {
        if (typeof navigator === 'undefined') {
            return;
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setModifierLabel(
            /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform) ? '' : '',
            // /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform) ? '⌘' : 'Ctrl',
        );
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.metaKey || event.ctrlKey) {
                setIsModifierPressed(true);
            }

            if (event.key.toLowerCase() === 'k') {
                setIsKPressed(true);
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            if (!event.metaKey && !event.ctrlKey) {
                setIsModifierPressed(false);
            }

            if (event.key.toLowerCase() === 'k') {
                setIsKPressed(false);
            }
        };

        const resetKeys = () => {
            setIsModifierPressed(false);
            setIsKPressed(false);
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        window.addEventListener('blur', resetKeys);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('blur', resetKeys);
        };
    }, []);

    const baseClassName = cn(
        'h-auto cursor-pointer justify-between py-3 transition-all duration-200 md:min-w-[200px]',
        className,
    );

    return (
        <Button
            type="button"
            variant="outline"
            className={baseClassName}
            aria-label="Open search"
            {...buttonProps}
        >
            <span className="flex items-center gap-2 text-muted-foreground opacity-80">
                <SearchIcon size={20} />
                <span className="hidden sm:inline">{children}</span>
            </span>
            <div className="hidden gap-0.5 md:flex">
                <kbd
                    className={cn(
                        'grid h-5 min-w-5 place-items-center rounded bg-muted text-xs text-muted-foreground transition-all duration-200',
                        isModifierPressed && 'inset-shadow-foreground/30',
                    )}
                >
                    {modifierLabel}
                </kbd>
                <kbd
                    className={cn(
                        'grid h-5 min-w-5 place-items-center rounded bg-muted text-xs text-muted-foreground transition-all duration-200',
                        isKPressed &&
                            'inset-shadow-md inset-shadow-foreground/50',
                    )}
                >
                    K
                </kbd>
            </div>
        </Button>
    );
};

// ============================================================================
// Modal Component
// ============================================================================

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm md:pt-[10vh] dark:bg-black/60"
            onClick={onClose}
        >
            <div
                className="h-full w-full max-w-full animate-in overflow-hidden bg-background shadow-2xl fade-in-0 zoom-in-95 md:h-auto md:max-h-[80vh] md:w-[90%] md:max-w-2xl md:rounded-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>,
        document.body,
    );
};

// ============================================================================
// Search Input Component
// ============================================================================

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
}: SearchInputFieldProps) {
    return (
        <div className="flex flex-row items-center rounded-t-sm border-b border-muted bg-background p-3">
            <SearchIcon className="mr-2 h-5 w-5 text-muted-foreground" />
            <input
                ref={inputRef}
                type="text"
                className="flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground"
                placeholder={
                    placeholder || 'Rechercher des articles, catégories...'
                }
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        onArrowDown?.();
                    } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        onArrowUp?.();
                    } else if (e.key === 'Enter') {
                        e.preventDefault();
                        onEnter?.();
                    }
                }}
                autoFocus
            />
            <div className="ml-auto flex items-center gap-2">
                {isLoading && (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                )}
                {query && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setQuery('');
                            inputRef.current?.focus();
                        }}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onClose}
                >
                    esc
                </Button>
            </div>
        </div>
    );
});

// ============================================================================
// Results Panel Component
// ============================================================================

interface ResultsPanelProps {
    results: SearchResult[];
    query: string;
    selectedIndex: number;
    onResultClick: (result: SearchResult) => void;
    onHoverIndex?: (index: number) => void;
    openResultsInNewTab?: boolean;
}

const ResultsPanel = memo(function ResultsPanel({
    results,
    selectedIndex,
    onResultClick,
    onHoverIndex,
}: ResultsPanelProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [hoverEnabled, setHoverEnabled] = useState(false);

    useEffect(() => {
        const container = containerRef.current;

        if (!container) {
            return;
        }

        const selectedEl = container.querySelector(
            '[aria-selected="true"]',
        ) as HTMLElement | null;

        if (!selectedEl) {
            return;
        }

        const padding = 8;
        const cRect = container.getBoundingClientRect();
        const iRect = selectedEl.getBoundingClientRect();

        if (iRect.top < cRect.top + padding) {
            container.scrollTop -= cRect.top + padding - iRect.top;
        } else if (iRect.bottom > cRect.bottom - padding) {
            container.scrollTop += iRect.bottom - (cRect.bottom - padding);
        }
    }, [selectedIndex]);

    useEffect(() => {
        const container = containerRef.current;

        if (!container) {
            return;
        }

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHoverEnabled(false);

        const enable = () => setHoverEnabled(true);
        container.addEventListener('pointermove', enable, { once: true });

        return () =>
            container.removeEventListener('pointermove', enable as any);
    }, []);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const renderResult = (result: SearchResult, isSelected: boolean) => {
        const isPost = result._type === 'post';
        const isCategory = result._type === 'category';
        const isUser = result._type === 'user';

        if (isPost) {
            return (
                <div className="flex items-start gap-3">
                    {result.featured_image_thumb ? (
                        <img
                            src={result.featured_image_thumb}
                            alt={result.title}
                            className="h-12 w-12 rounded-lg object-cover"
                        />
                    ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                            <SearchIcon className="h-5 w-5 text-muted-foreground" />
                        </div>
                    )}
                    <div className="flex-1">
                        <p className="font-medium text-foreground">
                            {result.title}
                        </p>
                        <p className="line-clamp-1 text-sm text-muted-foreground">
                            {result.excerpt || 'Aucun extrait'}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                                Article
                            </Badge>
                            {result.categories &&
                                result.categories.length > 0 && (
                                    <span>{result.categories[0].nom}</span>
                                )}
                            {result.published_at && (
                                <span>
                                    {new Date(
                                        result.published_at,
                                    ).toLocaleDateString('fr-FR')}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        if (isCategory) {
            return (
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                        <span className="text-blue-600 dark:text-blue-400">
                            #
                        </span>
                    </div>
                    <div className="flex-1">
                        <p className="font-medium text-foreground">
                            {result.nom}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Catégorie • {result.posts_count || 0} articles
                        </p>
                    </div>
                </div>
            );
        }

        if (isUser) {
            return (
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        {result.avatar_url ? (
                            <AvatarImage
                                src={result.avatar_url}
                                alt={result.name}
                            />
                        ) : (
                            <AvatarFallback>
                                {result.name?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <div className="flex-1">
                        <p className="font-medium text-foreground">
                            {result.name}
                        </p>
                        <p className="text-sm text-muted-foreground">Auteur</p>
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <div
            ref={containerRef}
            className="flex h-[60vh] flex-col gap-1 overflow-y-auto bg-muted/30 p-2 md:h-[50vh]"
            role="listbox"
        >
            {results.map((result, idx) => {
                const isSelected = selectedIndex === idx;

                return (
                    <div
                        key={`${result._type}-${result.id}`}
                        className={cn(
                            'cursor-pointer rounded-lg p-3 transition-colors',
                            isSelected && 'bg-blue-50 dark:bg-blue-900/30',
                            !isSelected &&
                                'hover:bg-gray-100 dark:hover:bg-gray-800',
                        )}
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => onResultClick(result)}
                        onMouseEnter={() => {
                            if (hoverEnabled) {
                                onHoverIndex?.(idx);
                            }
                        }}
                    >
                        {renderResult(result, isSelected)}
                    </div>
                );
            })}
        </div>
    );
});

// ============================================================================
// No Results Component
// ============================================================================

interface NoResultsProps {
    query: string;
    onClear: () => void;
}

const NoResults = memo(function NoResults({ query, onClear }: NoResultsProps) {
    return (
        <div className="flex h-[60vh] flex-col items-center justify-center gap-4 bg-muted/30 p-8 text-center md:h-[50vh]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <SearchIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
                <p className="text-lg font-medium">
                    Aucun résultat pour "{query}"
                </p>
                <p className="text-sm text-muted-foreground">
                    Essayez une autre recherche ou parcourez nos catégories
                </p>
            </div>
            <Button variant="outline" onClick={onClear}>
                Effacer la recherche
            </Button>
        </div>
    );
});

// ============================================================================
// Footer Component
// ============================================================================

interface FooterProps {
    resultsCount: number;
}

const Footer = memo(function Footer({ resultsCount }: FooterProps) {
    return (
        <div className="flex items-center justify-between rounded-b-sm bg-background p-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <kbd className="flex h-6 items-center justify-center rounded bg-muted px-2 text-muted-foreground">
                        <CornerDownLeft size={16} />
                    </kbd>
                    <span>Sélectionner</span>
                </div>
                <div className="flex items-center gap-2">
                    <kbd className="flex h-6 items-center justify-center rounded bg-muted px-2 text-muted-foreground">
                        <ArrowUp size={16} />
                    </kbd>
                    <kbd className="flex h-6 items-center justify-center rounded bg-muted px-2 text-muted-foreground">
                        <ArrowDown size={16} />
                    </kbd>
                    <span>Naviguer</span>
                </div>
                <div className="flex items-center gap-2">
                    <kbd className="flex h-6 items-center justify-center rounded bg-muted px-2 text-muted-foreground">
                        ESC
                    </kbd>
                    <span>Fermer</span>
                </div>
            </div>
            <div className="text-xs">
                {resultsCount} résultat{resultsCount > 1 ? 's' : ''}
            </div>
        </div>
    );
});

// ============================================================================
// Search Modal Component
// ============================================================================

interface SearchModalProps {
    onClose: () => void;
    config: SearchConfig;
}

function SearchModal({ onClose, config }: SearchModalProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const debouncedQuery = useDebounce(query, 300);

    useEffect(() => {
        const fetchResults = async () => {
            if (!debouncedQuery.trim() || debouncedQuery.trim().length < 2) {
                setResults([]);

                return;
            }

            setIsLoading(true);

            try {
                const response = await axios.get(route('search.api'), {
                    params: {
                        q: debouncedQuery.trim(),
                        limit: config.hitsPerPage || 8,
                    },
                    headers: {
                        Accept: 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                });

                if (response.data && Array.isArray(response.data.results)) {
                    setResults(response.data.results);
                } else {
                    setResults([]);
                }
            } catch (error) {
                console.error('Search error:', error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [debouncedQuery, config.hitsPerPage]);

    const { selectedIndex, moveDown, moveUp, hoverIndex } =
        useKeyboardNavigation<SearchResult>(
            results,
            query,
            config.openResultsInNewTab ?? false,
        );

    const handleResultClick = useCallback((result: SearchResult) => {
        const url = `/blog/${result.slug}`;
        window.location.href = url;
    }, []);

    const handleActivateSelection = useCallback(() => {
        if (selectedIndex >= 0 && selectedIndex < results.length) {
            handleResultClick(results[selectedIndex]);

            return true;
        }

        return false;
    }, [selectedIndex, results, handleResultClick]);

    const showResults = results.length > 0 && !!query && query.length >= 2;
    const noResults =
        !isLoading && results.length === 0 && !!query && query.length >= 2;

    return (
        <div className="flex flex-col">
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
            />

            {isLoading && (
                <div className="space-y-3 p-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                </div>
            )}

            {showResults && (
                <ResultsPanel
                    results={results}
                    query={query}
                    selectedIndex={selectedIndex}
                    onResultClick={handleResultClick}
                    onHoverIndex={hoverIndex}
                    openResultsInNewTab={config.openResultsInNewTab}
                />
            )}

            {noResults && (
                <NoResults
                    query={query}
                    onClear={() => {
                        setQuery('');
                        inputRef.current?.focus();
                    }}
                />
            )}

            {!isLoading && <Footer resultsCount={results.length} />}
        </div>
    );
}

// ============================================================================
// Search Modal Component SearchExperience
// ============================================================================

export default function SearchExperience(config: SearchConfig) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

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

    const buttonProps = {
        ...config.buttonProps,
        onClick: openModal,
    };

    return (
        <>
            <SearchButton {...buttonProps}>
                {config.buttonText || 'Rechercher'}
            </SearchButton>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <SearchModal onClose={closeModal} config={config} />
            </Modal>
        </>
    );
}
