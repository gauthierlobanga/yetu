/* eslint-disable import/order */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Head, Link, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import DOMPurify from 'dompurify';
import {
    Clock1Icon,
    EyeIcon,
    HeartIcon,
    MessageCircleIcon,
    SearchIcon,
    XIcon,
    BookOpenIcon,
    CalendarIcon,
    TrendingUpIcon,
    FilterIcon,
    SparklesIcon,
    Loader2Icon,
    RefreshCw,
} from 'lucide-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import 'swiper/css';
import 'swiper/css/navigation';
import MainLayout from '@/layouts/main-layout';
import type { BreadcrumbItem } from '@/types';
import type { Category } from '@/types/posts/category';
import type { Post, PostsResponse } from '@/types/posts/posts';
import { AnimatedPostGrid } from './AnimatedPostGrid';
import tenant from '@/routes/tenant';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Blog', href: tenant.blog.index().url },
];

interface Props {
    posts: PostsResponse;
    categories: { data: Category[] };
    tags?: Array<{ id: number; name: string; slug: string; count?: number }>;
    filters: {
        search?: string;
        tag?: string;
        category_id?: string;
        sort?: string;
        direction?: string;
        page?: number;
    };
}

const DEFAULT_SORT = 'published_at';
const DEFAULT_DIRECTION = 'desc';
const DEFAULT_SORT_VALUE = `${DEFAULT_SORT}:${DEFAULT_DIRECTION}`;

const sortOptions = [
    { value: 'published_at:desc', label: 'Plus récents', icon: TrendingUpIcon },
    { value: 'published_at:asc', label: 'Plus anciens', icon: TrendingUpIcon },
    { value: 'views_count:desc', label: 'Les plus vus', icon: EyeIcon },
    { value: 'likes_count:desc', label: 'Les plus aimés', icon: HeartIcon },
    {
        value: 'comments_count:desc',
        label: 'Les plus commentés',
        icon: MessageCircleIcon,
    },
    { value: 'title:asc', label: 'Titre A-Z', icon: BookOpenIcon },
    { value: 'title:desc', label: 'Titre Z-A', icon: BookOpenIcon },
];

type ProcessedPost = Post & {
    cleanExcerpt: string;
    formattedDate: string;
    readingTime: number;
};

export default function List({
    posts: initialPosts,
    categories,
    filters: initialFilters,
}: Props) {
    const cleanFilters = useCallback(
        (filters: Props['filters']) => ({
            search:
                filters.search && typeof filters.search === 'string'
                    ? filters.search
                    : '',
            tag:
                filters.tag && typeof filters.tag === 'string'
                    ? filters.tag
                    : filters.category_id &&
                        typeof filters.category_id === 'string'
                      ? filters.category_id
                      : 'all',
            sort:
                filters.sort && typeof filters.sort === 'string'
                    ? filters.sort
                    : DEFAULT_SORT,
            direction:
                filters.direction &&
                typeof filters.direction === 'string' &&
                (filters.direction === 'asc' || filters.direction === 'desc')
                    ? filters.direction
                    : DEFAULT_DIRECTION,
        }),
        [],
    );

    const cleanedFilters = cleanFilters(initialFilters);

    const [posts, setPosts] = useState<PostsResponse>(initialPosts);
    const [isChangingPage, setIsChangingPage] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [searchTerm, setSearchTerm] = useState(() =>
        cleanedFilters.search && cleanedFilters.search.trim() !== ''
            ? cleanedFilters.search.trim()
            : '',
    );
    const [selectedCategory, setSelectedCategory] = useState(() =>
        cleanedFilters.tag !== 'all' ? cleanedFilters.tag : 'all',
    );
    const [selectedSort, setSelectedSort] = useState(() => {
        const sort = cleanedFilters.sort;
        const direction = cleanedFilters.direction;

        return sort === DEFAULT_SORT && direction === DEFAULT_DIRECTION
            ? DEFAULT_SORT_VALUE
            : `${sort}:${direction}`;
    });

    const searchInputRef = useRef<HTMLInputElement>(null);
    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isNavigatingRef = useRef(false);
    const previousFiltersRef = useRef<string>('');

    useEffect(() => {
        setPosts(initialPosts);
        setIsChangingPage(false);
    }, [initialPosts]);

    const getPlainExcerpt = (
        excerpt: Record<string, unknown> | string | null | undefined,
        maxLength = 120,
    ): string => {
        if (!excerpt) {
            return '';
        }

        let text = '';

        if (typeof excerpt === 'string') {
            if (excerpt.trim().startsWith('{')) {
                try {
                    const parsed = JSON.parse(excerpt) as Record<
                        string,
                        unknown
                    >;
                    text = (parsed.html ||
                        parsed.content ||
                        parsed.text ||
                        excerpt) as string;
                } catch {
                    text = excerpt;
                }
            } else {
                text = excerpt;
            }
        } else if (typeof excerpt === 'object') {
            text = (excerpt.html ||
                excerpt.content ||
                excerpt.text ||
                JSON.stringify(excerpt)) as string;
        } else {
            text = String(excerpt);
        }

        const cleanText = DOMPurify.sanitize(text, {
            ALLOWED_TAGS: [],
            ALLOWED_ATTR: [],
        });

        return cleanText.length > maxLength
            ? cleanText.substring(0, maxLength) + '...'
            : cleanText;
    };

    const processedPosts = useMemo<ProcessedPost[]>(() => {
        return posts.data.map((post) => ({
            ...post,
            cleanExcerpt: getPlainExcerpt(post.excerpt || post.content, 120),
            formattedDate: post.published_at
                ? format(new Date(post.published_at), 'dd MMMM yyyy', {
                      locale: fr,
                  })
                : 'Date non définie',
            readingTime:
                Math.ceil(
                    (post.content
                        ? JSON.stringify(post.content).length / 1000
                        : 0) / 200,
                ) || 3,
        }));
    }, [posts.data]);

    const buildFilterParams = useCallback(
        (
            overrides: {
                search?: string;
                category?: string;
                sort?: string;
                page?: number;
            } = {},
        ): Record<string, unknown> => {
            const params: Record<string, unknown> = {};
            const search =
                overrides.search !== undefined ? overrides.search : searchTerm;
            const category =
                overrides.category !== undefined
                    ? overrides.category
                    : selectedCategory;
            const sort =
                overrides.sort !== undefined ? overrides.sort : selectedSort;

            if (search && search.trim() !== '') {
                params.search = search.trim();
            }

            if (category !== 'all') {
                params.tag = category;
            }

            const [sortField, direction] = sort.split(':');

            if (sortField !== DEFAULT_SORT || direction !== DEFAULT_DIRECTION) {
                params.sort = sortField;
                params.direction = direction;
            }

            if (overrides.page && overrides.page > 1) {
                params.page = overrides.page;
            }

            return params;
        },
        [searchTerm, selectedCategory, selectedSort],
    );

    const applyFilters = useCallback(
        (params: Record<string, unknown>, isPageChange = false) => {
            const filterKey = JSON.stringify(params);

            if (filterKey === previousFiltersRef.current) {
                return;
            }

            if (isNavigatingRef.current) {
                return;
            }

            isNavigatingRef.current = true;

            if (isPageChange) {
                setIsChangingPage(true);
            }

            previousFiltersRef.current = filterKey;
            router.get(tenant.blog.index().url, params as any, {
                async: true,
                preserveState: true,
                preserveScroll: true,
                replace: true,
                showProgress: false,
                only: ['posts', 'filters'],
                onSuccess: (page) => {
                    const pageProps = page.props as unknown as {
                        posts: PostsResponse;
                        filters: Props['filters'];
                    };
                    setPosts(pageProps.posts);
                    setIsChangingPage(false);
                    isNavigatingRef.current = false;
                },
                onError: () => {
                    setIsChangingPage(false);
                    isNavigatingRef.current = false;
                },
            });
        },
        [],
    );

    const handleSearchChange = useCallback(
        (value: string) => {
            setSearchTerm(value);

            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }

            if (value.trim() === '') {
                const params = buildFilterParams({ search: '', page: 1 });
                applyFilters(params, false);
                setIsSearching(false);

                return;
            }

            setIsSearching(true);
            searchTimeoutRef.current = setTimeout(() => {
                const params = buildFilterParams({ search: value, page: 1 });
                applyFilters(params, false);
                setIsSearching(false);
            }, 500);
        },
        [buildFilterParams, applyFilters],
    );

    const handleSearchKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
                if (searchTimeoutRef.current) {
                    clearTimeout(searchTimeoutRef.current);
                }

                const params = buildFilterParams({
                    search: searchTerm,
                    page: 1,
                });
                applyFilters(params, false);
                setIsSearching(false);
                searchInputRef.current?.blur();
            } else if (e.key === 'Escape') {
                setSearchTerm('');

                if (searchTimeoutRef.current) {
                    clearTimeout(searchTimeoutRef.current);
                }

                const params = buildFilterParams({ search: '', page: 1 });
                applyFilters(params, false);
                setIsSearching(false);
                searchInputRef.current?.blur();
            }
        },
        [buildFilterParams, applyFilters, searchTerm],
    );

    const handleClearSearch = useCallback(() => {
        setSearchTerm('');

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        const params = buildFilterParams({ search: '', page: 1 });
        applyFilters(params, false);
        setIsSearching(false);
        searchInputRef.current?.focus();
    }, [buildFilterParams, applyFilters]);

    const handleCategoryChange = useCallback(
        (value: string) => {
            setSelectedCategory(value);
            const params = buildFilterParams({ category: value, page: 1 });
            applyFilters(params, false);
        },
        [buildFilterParams, applyFilters],
    );

    const handleSortChange = useCallback(
        (value: string) => {
            setSelectedSort(value);
            const params = buildFilterParams({ sort: value, page: 1 });
            applyFilters(params, false);
        },
        [buildFilterParams, applyFilters],
    );

    const handlePageChange = useCallback(
        (page: number) => {
            if (page === posts.current_page) {
                return;
            }

            const params = buildFilterParams({ page });
            applyFilters(params, true);
        },
        [posts.current_page, buildFilterParams, applyFilters],
    );

    const clearFilters = useCallback(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        setSearchTerm('');
        setSelectedCategory('all');
        setSelectedSort(DEFAULT_SORT_VALUE);
        applyFilters({}, false);
    }, [applyFilters]);

    const hasActiveFilters = useMemo(() => {
        return (
            searchTerm.trim() !== '' ||
            selectedCategory !== 'all' ||
            selectedSort !== DEFAULT_SORT_VALUE
        );
    }, [searchTerm, selectedCategory, selectedSort]);

    const activeSortLabel = useMemo(() => {
        const found = sortOptions.find((opt) => opt.value === selectedSort);

        return found?.label || 'Plus récents';
    }, [selectedSort]);

    useEffect(() => {
        const urlSearch = initialFilters.search || '';
        const urlCategory =
            initialFilters.tag || initialFilters.category_id || 'all';
        const urlSort = initialFilters.sort || DEFAULT_SORT;
        const urlDirection = initialFilters.direction || DEFAULT_DIRECTION;
        const urlSortValue = `${urlSort}:${urlDirection}`;

        if (urlSearch !== searchTerm) {
            setSearchTerm(urlSearch);
        }

        if (urlCategory !== selectedCategory) {
            setSelectedCategory(urlCategory);
        }

        if (urlSortValue !== selectedSort) {
            setSelectedSort(urlSortValue);
        }
    }, [initialFilters, searchTerm, selectedCategory, selectedSort]);

    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    // PostCard – stable, sans ombre, avec animation rapide
    const PostCard = ({ post }: { post: ProcessedPost }) => {
        const category = post.categories?.[0];

        return (
            <Link
                href={tenant.blog.show(post.slug).url}
                className="group block h-full focus:outline-none"
            >
                <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/40 bg-white/70 backdrop-blur-xl transition-transform duration-200 ease-out hover:-translate-y-1 dark:border-slate-700/40 dark:bg-slate-900/70">
                    {/* Image – stable, sans tremblement */}
                    <div className="relative overflow-hidden">
                        {post.featured_image_url ? (
                            <img
                                src={post.featured_image_url}
                                alt={post.title}
                                className="aspect-16/10 w-full object-cover transition-transform duration-300 ease-out will-change-transform group-hover:scale-[1.03]"
                                style={{ backfaceVisibility: 'hidden' }}
                            />
                        ) : (
                            <div className="flex aspect-16/10 items-center justify-center bg-linear-to-br from-emerald-100 to-teal-50 dark:from-emerald-900/40 dark:to-teal-900/20">
                                <BookOpenIcon className="h-10 w-10 text-emerald-400/60 dark:text-emerald-600/40" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <div className="absolute right-3 bottom-3">
                            <Badge className="border-0 bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
                                {post.readingTime} min
                            </Badge>
                        </div>
                        {category && (
                            <div className="absolute top-3 left-3">
                                <Badge
                                    className="border-0 px-2.5 py-1 text-xs font-medium"
                                    style={{
                                        backgroundColor:
                                            category.color || '#10b981',
                                        color: '#fff',
                                    }}
                                >
                                    {category.nom}
                                </Badge>
                            </div>
                        )}
                    </div>
                    {/* Contenu */}
                    <div className="flex flex-1 flex-col p-5">
                        <h3 className="mb-2 line-clamp-2 text-lg leading-tight font-bold text-slate-900 transition-colors group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                            {post.title}
                        </h3>
                        <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                            {post.cleanExcerpt}
                        </p>
                        <div className="mb-4 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                            <span className="flex items-center gap-1">
                                <CalendarIcon className="h-3.5 w-3.5" />
                                {post.formattedDate}
                            </span>
                            <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1">
                                    <EyeIcon className="h-3.5 w-3.5" />
                                    {post.views_count}
                                </span>
                                <span className="flex items-center gap-1">
                                    <HeartIcon className="h-3.5 w-3.5" />
                                    {post.likes_count}
                                </span>
                            </div>
                        </div>
                        <div className="mt-auto flex items-center gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                            <Avatar className="h-7 w-7 ring-2 ring-white dark:ring-slate-900">
                                <AvatarImage src={post.user?.avatar_url} />
                                <AvatarFallback className="bg-emerald-100 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                                    {post.user?.name
                                        ?.charAt(0)
                                        ?.toUpperCase() || '?'}
                                </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                {post.user?.name}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        );
    };

    return (
        <MainLayout breadcrumbs={breadcrumbs}>
            <Head title="Blog" />
            <div className="relative min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                {/* Cercles décoratifs */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <div className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-emerald-200/20 blur-3xl dark:bg-emerald-900/20" />
                    <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-teal-100/30 blur-3xl dark:bg-teal-900/20" />
                </div>

                <div className="relative z-10">
                    {/* Hero Section */}
                    <section className="py-16 md:py-24">
                        <div className="mx-auto max-w-6xl px-4 text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Badge className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200/60 bg-emerald-50/80 px-4 py-1.5 text-sm font-medium text-emerald-700 backdrop-blur-sm dark:border-emerald-800/40 dark:bg-emerald-950/30 dark:text-emerald-300">
                                    <SparklesIcon className="h-4 w-4" />
                                    Blog & Insights
                                </Badge>
                                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
                                    Explorez des contenus{' '}
                                    <span className="bg-linear-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400">
                                        inspirants & modernes
                                    </span>
                                </h1>
                                <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-500 dark:text-slate-400">
                                    Découvrez des articles de qualité sur le
                                    développement, l&apos;e-commerce et les
                                    technologies modernes.
                                </p>
                            </motion.div>

                            {/* Recherche premium */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="mx-auto mt-10 max-w-xl"
                            >
                                <div className="relative">
                                    <Input
                                        ref={searchInputRef}
                                        value={searchTerm}
                                        onChange={(e) =>
                                            handleSearchChange(e.target.value)
                                        }
                                        onKeyDown={handleSearchKeyDown}
                                        placeholder="Rechercher un article..."
                                        className="h-14 rounded-full border border-slate-200/60 bg-white/60 pr-12 pl-12 text-base shadow-lg backdrop-blur-xl transition-all placeholder:text-slate-400 hover:border-emerald-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700/50 dark:bg-slate-900/60 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-emerald-700 dark:focus:border-emerald-500"
                                    />
                                    <SearchIcon className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                                    {searchTerm && (
                                        <button
                                            onClick={handleClearSearch}
                                            className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full p-1 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
                                        >
                                            <XIcon className="h-4 w-4" />
                                        </button>
                                    )}
                                    {isSearching && (
                                        <div className="absolute top-1/2 right-14 -translate-y-1/2">
                                            <Loader2Icon className="h-4 w-4 animate-spin text-emerald-500" />
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </section>

                    {/* Filtres + Grille */}
                    <section className="pb-16">
                        <div className="mx-auto max-w-7xl px-4">
                            {/* Barre de filtres agrandie, sans bordures colorées */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="mb-10 rounded-2xl border border-slate-200/50 bg-white/60 p-5 backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/60"
                            >
                                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                                    {/* Catégories */}
                                    <div className="flex items-center gap-3">
                                        <FilterIcon className="h-5 w-5 shrink-0 text-slate-400 dark:text-slate-500" />
                                        <div className="relative w-full sm:max-w-2xl">
                                            <Swiper
                                                modules={[Navigation]}
                                                spaceBetween={10}
                                                slidesPerView="auto"
                                                freeMode={true}
                                                navigation={{
                                                    prevEl: '.custom-prev',
                                                    nextEl: '.custom-next',
                                                }}
                                                className="flex items-center"
                                            >
                                                <SwiperSlide className="w-auto!">
                                                    <Badge
                                                        variant={
                                                            selectedCategory ===
                                                            'all'
                                                                ? 'default'
                                                                : 'outline'
                                                        }
                                                        className="cursor-pointer rounded-full px-5 py-2.5 text-sm font-medium transition-all hover:scale-105"
                                                        onClick={() =>
                                                            handleCategoryChange(
                                                                'all',
                                                            )
                                                        }
                                                    >
                                                        Tous
                                                    </Badge>
                                                </SwiperSlide>
                                                {categories.data.map(
                                                    (category) => (
                                                        <SwiperSlide
                                                            key={category.id}
                                                            className="w-auto!"
                                                        >
                                                            <Badge
                                                                variant={
                                                                    selectedCategory ===
                                                                    category.slug
                                                                        ? 'default'
                                                                        : 'outline'
                                                                }
                                                                className="cursor-pointer rounded-full px-5 py-2.5 text-sm font-medium transition-all hover:scale-105"
                                                                style={
                                                                    selectedCategory ===
                                                                    category.slug
                                                                        ? {
                                                                              backgroundColor:
                                                                                  category.color ||
                                                                                  '#10b981',
                                                                              color: '#fff',
                                                                              borderColor:
                                                                                  'transparent',
                                                                          }
                                                                        : {
                                                                              borderColor:
                                                                                  'transparent',
                                                                              color:
                                                                                  category.color ||
                                                                                  '#64748b',
                                                                          }
                                                                }
                                                                onClick={() =>
                                                                    handleCategoryChange(
                                                                        category.slug,
                                                                    )
                                                                }
                                                            >
                                                                {category.nom}
                                                            </Badge>
                                                        </SwiperSlide>
                                                    ),
                                                )}
                                            </Swiper>
                                            <button className="custom-prev absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200 bg-white/90 p-1.5 text-slate-500 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-400 dark:hover:text-emerald-400">
                                                <ChevronLeft className="h-4 w-4" />
                                            </button>
                                            <button className="custom-next absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200 bg-white/90 p-1.5 text-slate-500 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-400 dark:hover:text-emerald-400">
                                                <ChevronRight className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Tri + Réinitialisation */}
                                    <div className="flex items-center gap-3">
                                        <Select
                                            value={selectedSort}
                                            onValueChange={handleSortChange}
                                        >
                                            <SelectTrigger className="h-10 w-48 rounded-full border border-slate-200 bg-white/60 text-sm shadow-sm backdrop-blur-sm transition-all hover:border-emerald-300 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-emerald-700">
                                                <SelectValue>
                                                    {activeSortLabel}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent
                                                position="popper"
                                                className="rounded-xl"
                                            >
                                                {sortOptions.map((option) => {
                                                    const IconComponent =
                                                        option.icon;

                                                    return (
                                                        <SelectItem
                                                            key={option.value}
                                                            value={option.value}
                                                            className="cursor-pointer"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <IconComponent className="h-3.5 w-3.5" />
                                                                {option.label}
                                                            </div>
                                                        </SelectItem>
                                                    );
                                                })}
                                            </SelectContent>
                                        </Select>
                                        {hasActiveFilters && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={clearFilters}
                                                className="h-9 gap-1.5 rounded-full text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                                            >
                                                <RefreshCw className="h-4 w-4" />
                                                <span className="hidden sm:inline">
                                                    Réinitialiser
                                                </span>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Stats & état */}
                            <div className="mb-6 flex items-center justify-between">
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    <span className="font-semibold text-slate-900 dark:text-white">
                                        {posts.total || 0}
                                    </span>
                                    {posts.total > 1 ? ' articles' : ' article'}
                                </p>
                                {isChangingPage && (
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <Loader2Icon className="h-4 w-4 animate-spin" />
                                        Chargement...
                                    </div>
                                )}
                            </div>

                            {/* Grille d'articles */}
                            {processedPosts.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/60 py-20 text-center backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/60"
                                >
                                    <div className="mb-4 rounded-full bg-slate-100 p-4 dark:bg-slate-800">
                                        <BookOpenIcon className="h-10 w-10 text-slate-400 dark:text-slate-500" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                                        Aucun article trouvé
                                    </h3>
                                    <p className="mt-2 text-slate-500 dark:text-slate-400">
                                        Essayez de modifier vos filtres ou
                                        revenez plus tard.
                                    </p>
                                    {hasActiveFilters && (
                                        <Button
                                            variant="outline"
                                            className="mt-6 rounded-full"
                                            onClick={clearFilters}
                                        >
                                            Réinitialiser les filtres
                                        </Button>
                                    )}
                                </motion.div>
                            ) : (
                                <AnimatedPostGrid
                                    posts={processedPosts}
                                    renderItem={(post) => (
                                        <PostCard post={post} />
                                    )}
                                />
                            )}

                            {/* Pagination */}
                            {posts.last_page > 1 && (
                                <Pagination className="mt-12">
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();

                                                    if (
                                                        posts.current_page > 1
                                                    ) {
                                                        handlePageChange(
                                                            posts.current_page -
                                                                1,
                                                        );
                                                    }
                                                }}
                                                className={cn(
                                                    posts.current_page === 1
                                                        ? 'pointer-events-none opacity-50'
                                                        : 'cursor-pointer rounded-full transition-all hover:bg-emerald-50 dark:hover:bg-emerald-950/30',
                                                )}
                                            />
                                        </PaginationItem>
                                        {Array.from(
                                            {
                                                length: Math.min(
                                                    5,
                                                    posts.last_page,
                                                ),
                                            },
                                            (_, i) => {
                                                let pageNum;

                                                if (posts.last_page <= 5) {
                                                    pageNum = i + 1;
                                                } else if (
                                                    posts.current_page <= 3
                                                ) {
                                                    pageNum = i + 1;
                                                } else if (
                                                    posts.current_page >=
                                                    posts.last_page - 2
                                                ) {
                                                    pageNum =
                                                        posts.last_page - 4 + i;
                                                } else {
                                                    pageNum =
                                                        posts.current_page -
                                                        2 +
                                                        i;
                                                }

                                                return (
                                                    <PaginationItem
                                                        key={pageNum}
                                                    >
                                                        <PaginationLink
                                                            href="#"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handlePageChange(
                                                                    pageNum,
                                                                );
                                                            }}
                                                            isActive={
                                                                posts.current_page ===
                                                                pageNum
                                                            }
                                                            className="rounded-full transition-all hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                                                        >
                                                            {pageNum}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                );
                                            },
                                        )}
                                        <PaginationItem>
                                            <PaginationNext
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();

                                                    if (
                                                        posts.current_page <
                                                        posts.last_page
                                                    ) {
                                                        handlePageChange(
                                                            posts.current_page +
                                                                1,
                                                        );
                                                    }
                                                }}
                                                className={cn(
                                                    posts.current_page ===
                                                        posts.last_page
                                                        ? 'pointer-events-none opacity-50'
                                                        : 'cursor-pointer rounded-full transition-all hover:bg-emerald-50 dark:hover:bg-emerald-950/30',
                                                )}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </MainLayout>
    );
}
