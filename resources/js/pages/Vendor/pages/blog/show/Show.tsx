/* eslint-disable import/order */
/* eslint-disable react-hooks/set-state-in-effect */

import { Head, Link, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import DOMPurify from 'dompurify';
import {
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
import tenant from '@/routes/tenant';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Blog', href: tenant.blog.index().url },
];

interface Props {
    posts: PostsResponse;
    categories: { data: Category[] };
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
    const [posts, setPosts] = useState<PostsResponse>(initialPosts);
    const [isLoading, setIsLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState(initialFilters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(
        initialFilters.tag || initialFilters.category_id || 'all',
    );
    const [selectedSort, setSelectedSort] = useState(
        initialFilters.sort && initialFilters.direction
            ? `${initialFilters.sort}:${initialFilters.direction}`
            : DEFAULT_SORT_VALUE,
    );

    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        setPosts(initialPosts);
    }, [initialPosts]);

    useEffect(() => {
        setSearchTerm(initialFilters.search || '');
        setSelectedCategory(
            initialFilters.tag || initialFilters.category_id || 'all',
        );
        const sortValue =
            initialFilters.sort && initialFilters.direction
                ? `${initialFilters.sort}:${initialFilters.direction}`
                : DEFAULT_SORT_VALUE;
        setSelectedSort(sortValue);
    }, [initialFilters]);

    const buildParams = useCallback(
        (overrides?: {
            search?: string;
            category?: string;
            sort?: string;
            page?: number;
        }) => {
            const params: Record<string, unknown> = {};
            const search = overrides?.search ?? searchTerm;
            const category = overrides?.category ?? selectedCategory;
            const sort = overrides?.sort ?? selectedSort;
            const page = overrides?.page;

            if (search.trim()) {
                params.search = search.trim();
            }

            if (category !== 'all') {
                params.tag = category;
            }

            const [field, dir] = sort.split(':');

            if (field !== DEFAULT_SORT || dir !== DEFAULT_DIRECTION) {
                params.sort = field;
                params.direction = dir;
            }

            if (page && page > 1) {
                params.page = page;
            }

            return params;
        },
        [searchTerm, selectedCategory, selectedSort],
    );

    const navigate = useCallback((params: Record<string, unknown>) => {
        router.get(tenant.blog.index().url, params as any, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            showProgress: false,
            only: ['posts', 'filters'],
            onStart: () => setIsLoading(true),
            onSuccess: (page) => {
                setPosts((page.props as any).posts);
                setIsLoading(false);
            },
            onError: () => setIsLoading(false),
        });
    }, []);

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (value.trim() === '') {
            navigate(buildParams({ search: '' }));

            return;
        }

        searchTimeoutRef.current = setTimeout(() => {
            navigate(buildParams({ search: value }));
        }, 400);
    };

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value);
        navigate(buildParams({ category: value }));
    };

    const handleSortChange = (value: string) => {
        setSelectedSort(value);
        navigate(buildParams({ sort: value }));
    };

    const handlePageChange = (page: number) => {
        navigate(buildParams({ page }));
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('all');
        setSelectedSort(DEFAULT_SORT_VALUE);
        navigate({});
    };

    const hasActiveFilters =
        searchTerm.trim() !== '' ||
        selectedCategory !== 'all' ||
        selectedSort !== DEFAULT_SORT_VALUE;
    const activeSortLabel =
        sortOptions.find((o) => o.value === selectedSort)?.label ||
        'Plus récents';

    const processedPosts = useMemo<ProcessedPost[]>(() => {
        return posts.data.map((post) => {
            const rawExcerpt = post.excerpt || post.content || '';
            const cleanExcerpt =
                DOMPurify.sanitize(
                    typeof rawExcerpt === 'string'
                        ? rawExcerpt
                        : JSON.stringify(rawExcerpt),
                    { ALLOWED_TAGS: [] },
                ).substring(0, 120) + '...';

            return {
                ...post,
                cleanExcerpt,
                formattedDate: post.published_at
                    ? format(new Date(post.published_at), 'dd MMMM yyyy', {
                          locale: fr,
                      })
                    : 'Date non définie',
                readingTime: Math.max(
                    1,
                    Math.ceil((post.content?.length || 1000) / 2000),
                ),
            };
        });
    }, [posts.data]);

    // Carte article – stable, sans ombre, avec animation rapide
    const PostCard = ({ post }: { post: ProcessedPost }) => {
        const category = post.categories?.[0] ?? (post as any).category;

        return (
            <Link
                href={tenant.blog.show(post.slug).url}
                className="group block h-full focus:outline-none"
            >
                <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/40 bg-white/70 backdrop-blur-xl transition-transform duration-200 ease-out hover:-translate-y-1 dark:border-slate-700/40 dark:bg-slate-900/70">
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
                            <div className="flex aspect-16/10 items-center justify-center bg-linear-to-br from-emerald-100 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/10">
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
                    {/* Hero */}
                    <section className="py-16 md:py-24">
                        <div className="mx-auto max-w-6xl px-4 text-center">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
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

                            {/* Recherche */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="mx-auto mt-10 max-w-xl"
                            >
                                <div className="relative">
                                    <Input
                                        value={searchTerm}
                                        onChange={(e) =>
                                            handleSearchChange(e.target.value)
                                        }
                                        placeholder="Rechercher un article..."
                                        className="h-14 rounded-full border border-slate-200/60 bg-white/60 pr-12 pl-12 text-base shadow-lg backdrop-blur-xl transition-all placeholder:text-slate-400 hover:border-emerald-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700/50 dark:bg-slate-900/60 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-emerald-700 dark:focus:border-emerald-500"
                                    />
                                    <SearchIcon className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                                    {searchTerm && (
                                        <button
                                            onClick={() =>
                                                handleSearchChange('')
                                            }
                                            className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                        >
                                            <XIcon className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </section>

                    {/* Filtres + Grille */}
                    <section className="pb-16">
                        <div className="mx-auto max-w-7xl px-4">
                            {/* Barre de filtres agrandie et élégante */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="mb-10 rounded-2xl border border-slate-200/50 bg-white/60 p-5 backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/60"
                            >
                                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                                    {/* Catégories avec Swiper */}
                                    <div className="flex items-center gap-3">
                                        <FilterIcon className="h-5 w-5 shrink-0 text-slate-400" />
                                        <div className="relative w-full sm:max-w-2xl">
                                            <Swiper
                                                modules={[Navigation]}
                                                spaceBetween={10}
                                                slidesPerView="auto"
                                                freeMode={true}
                                                navigation={{
                                                    prevEl: '.cat-prev',
                                                    nextEl: '.cat-next',
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
                                                {categories.data.map((cat) => (
                                                    <SwiperSlide
                                                        key={cat.id}
                                                        className="w-auto!"
                                                    >
                                                        <Badge
                                                            variant={
                                                                selectedCategory ===
                                                                cat.slug
                                                                    ? 'default'
                                                                    : 'outline'
                                                            }
                                                            className="cursor-pointer rounded-full px-5 py-2.5 text-sm font-medium transition-all hover:scale-105"
                                                            style={
                                                                selectedCategory ===
                                                                cat.slug
                                                                    ? {
                                                                          backgroundColor:
                                                                              cat.color ||
                                                                              '#10b981',
                                                                          color: '#fff',
                                                                          borderColor:
                                                                              'transparent',
                                                                      }
                                                                    : {
                                                                          color:
                                                                              cat.color ||
                                                                              '#64748b',
                                                                          borderColor:
                                                                              'transparent',
                                                                      }
                                                            }
                                                            onClick={() =>
                                                                handleCategoryChange(
                                                                    cat.slug,
                                                                )
                                                            }
                                                        >
                                                            {cat.nom}
                                                        </Badge>
                                                    </SwiperSlide>
                                                ))}
                                            </Swiper>
                                            <button className="cat-prev absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200 bg-white p-1.5 text-slate-500 shadow-sm hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-900 dark:hover:text-emerald-400">
                                                <ChevronLeft className="h-4 w-4" />
                                            </button>
                                            <button className="cat-next absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-200 bg-white p-1.5 text-slate-500 shadow-sm hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-900 dark:hover:text-emerald-400">
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
                                            <SelectTrigger className="h-10 w-48 rounded-full border border-slate-200 bg-white/60 text-sm shadow-sm backdrop-blur-sm transition-all hover:border-emerald-300 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300">
                                                <SelectValue>
                                                    {activeSortLabel}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent
                                                position="popper"
                                                className="rounded-xl"
                                            >
                                                {sortOptions.map((opt) => (
                                                    <SelectItem
                                                        key={opt.value}
                                                        value={opt.value}
                                                        className="cursor-pointer"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <opt.icon className="h-3.5 w-3.5" />
                                                            {opt.label}
                                                        </div>
                                                    </SelectItem>
                                                ))}
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

                            {/* Compteur + État de chargement */}
                            <div className="mb-6 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                                <span>
                                    <strong className="text-slate-900 dark:text-white">
                                        {posts.total || 0}
                                    </strong>{' '}
                                    article{posts.total > 1 ? 's' : ''}
                                </span>
                                {isLoading && (
                                    <span className="flex items-center gap-2">
                                        <Loader2Icon className="h-4 w-4 animate-spin" />
                                        Mise à jour...
                                    </span>
                                )}
                            </div>

                            {/* Grille d'articles */}
                            {processedPosts.length === 0 ? (
                                <div className="flex flex-col items-center rounded-3xl border border-dashed border-slate-300 bg-white/60 py-20 text-center backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/60">
                                    <BookOpenIcon className="h-10 w-10 text-slate-400" />
                                    <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                                        Aucun article
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Modifiez vos filtres ou revenez plus
                                        tard.
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
                                </div>
                            ) : (
                                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {processedPosts.map((post, idx) => (
                                        <motion.div
                                            key={post.id}
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                duration: 0.2,
                                                delay: idx * 0.04,
                                            }}
                                        >
                                            <PostCard post={post} />
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            {/* Pagination */}
                            {posts.last_page > 1 && (
                                <Pagination className="mt-12">
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={() =>
                                                    handlePageChange(
                                                        posts.current_page - 1,
                                                    )
                                                }
                                                className={cn(
                                                    posts.current_page === 1 &&
                                                        'pointer-events-none opacity-50',
                                                    'cursor-pointer rounded-full',
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
                                                let page;

                                                if (posts.last_page <= 5) {
                                                    page = i + 1;
                                                } else if (
                                                    posts.current_page <= 3
                                                ) {
                                                    page = i + 1;
                                                } else if (
                                                    posts.current_page >=
                                                    posts.last_page - 2
                                                ) {
                                                    page =
                                                        posts.last_page - 4 + i;
                                                } else {
                                                    page =
                                                        posts.current_page -
                                                        2 +
                                                        i;
                                                }

                                                return (
                                                    <PaginationItem key={page}>
                                                        <PaginationLink
                                                            onClick={() =>
                                                                handlePageChange(
                                                                    page,
                                                                )
                                                            }
                                                            isActive={
                                                                page ===
                                                                posts.current_page
                                                            }
                                                            className="rounded-full"
                                                        >
                                                            {page}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                );
                                            },
                                        )}
                                        <PaginationItem>
                                            <PaginationNext
                                                onClick={() =>
                                                    handlePageChange(
                                                        posts.current_page + 1,
                                                    )
                                                }
                                                className={cn(
                                                    posts.current_page ===
                                                        posts.last_page &&
                                                        'pointer-events-none opacity-50',
                                                    'cursor-pointer rounded-full',
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
