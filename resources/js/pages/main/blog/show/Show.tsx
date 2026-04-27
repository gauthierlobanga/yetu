'use client';

import { Head, Link, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
    Calendar,
    Clock,
    Eye,
    User,
    ArrowLeft,
    ArrowRight,
    Share2,
    Bookmark,
    Heart,
    MessageCircle,
    Tag,
    Folder,
    List,
    ArrowUp,
    Hash,
    Heading1,
    Heading2,
    Heading3,
    ChevronRight,
} from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import MainLayout from '@/layouts/main-layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { useInitials } from '@/hooks/use-initials';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';
import type { Post, RelatedPost } from '@/types/posts/posts';
import NewsletterSection from '@/layouts/app/app-newsletters-footer';

interface Props {
    post: {
        data: Post;
    };
    previousPost: Post | null;
    nextPost: Post | null;
    relatedPosts: RelatedPost[];
}

// Icône selon le niveau de titre
const HeadingIcon = ({ level }: { level: number }) => {
    switch (level) {
        case 1:
            return <Heading1 className="h-3.5 w-3.5" />;
        case 2:
            return <Heading2 className="h-3.5 w-3.5" />;
        case 3:
            return <Heading3 className="h-3.5 w-3.5" />;
        default:
            return <Hash className="h-3.5 w-3.5" />;
    }
};

// Table des matières
const TableOfContents = ({ content }: { content: string }) => {
    const [headings, setHeadings] = useState<
        Array<{ id: string; text: string; level: number }>
    >([]);
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        if (!content) return;

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        const headingElements = tempDiv.querySelectorAll('h1, h2, h3');

        const generatedHeadings = Array.from(headingElements).map(
            (el, index) => {
                const text = el.textContent || '';
                const id = `heading-${index}-${text
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')}`;
                return { id, text, level: parseInt(el.tagName[1]) };
            },
        );

        setHeadings(generatedHeadings);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-100px 0px -66%', threshold: 0.3 },
        );

        setTimeout(() => {
            const realHeadings = document.querySelectorAll(
                '.prose h1, .prose h2, .prose h3',
            );
            realHeadings.forEach((el, index) => {
                const generatedId = generatedHeadings[index]?.id;
                if (generatedId) {
                    el.id = generatedId;
                    observer.observe(el);
                }
            });
        }, 200);

        return () => observer.disconnect();
    }, [content]);

    if (headings.length === 0) return null;

    return (
        <div className="rounded-lg border bg-card">
            <div className="border-b p-3">
                <div className="flex items-center gap-2">
                    <List className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold">
                        Table des matières
                    </h3>
                </div>
            </div>
            <nav className="p-3">
                <ul className="space-y-0.5">
                    {headings.map((heading) => (
                        <li key={heading.id}>
                            <a
                                href={`#${heading.id}`}
                                className={`group flex items-start gap-2 py-1.5 text-xs transition-all duration-200 hover:text-primary ${
                                    activeId === heading.id
                                        ? 'font-medium text-primary'
                                        : 'text-muted-foreground'
                                }`}
                                style={{
                                    paddingLeft: `${(heading.level - 1) * 12}px`,
                                }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    const element = document.getElementById(
                                        heading.id,
                                    );
                                    if (element) {
                                        const offset = 80;
                                        const elementPosition =
                                            element.getBoundingClientRect().top;
                                        const offsetPosition =
                                            elementPosition +
                                            window.scrollY -
                                            offset;
                                        window.scrollTo({
                                            top: offsetPosition,
                                            behavior: 'smooth',
                                        });
                                    }
                                }}
                            >
                                <span
                                    className={`mt-0.5 shrink-0 ${
                                        activeId === heading.id
                                            ? 'text-primary'
                                            : 'text-muted-foreground/50'
                                    }`}
                                >
                                    <HeadingIcon level={heading.level} />
                                </span>
                                <span className="line-clamp-2">
                                    {heading.text}
                                </span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

// Barre de progression
const ReadingProgressBar = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight =
                document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            setProgress(scrollPercent);
        };

        window.addEventListener('scroll', updateProgress);
        return () => window.removeEventListener('scroll', updateProgress);
    }, []);

    return (
        <div className="fixed top-0 right-0 left-0 z-50 h-0.5 bg-muted">
            <div
                className="h-full bg-linear-to-r from-primary to-primary/60 transition-all duration-150"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
};

// Bouton retour en haut
const ScrollToTop = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            setVisible(window.scrollY > 500);
        };
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    if (!visible) return null;

    return (
        <Button
            className="fixed right-6 bottom-6 z-50 h-9 w-9 rounded-full shadow-lg"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            size="icon"
        >
            <ArrowUp className="h-4 w-4" />
        </Button>
    );
};

// Composant Contenu riche
const RichContentText = ({ content }: { content: string }) => {
    return (
        <div
            className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-medium prose-headings:tracking-tight prose-h1:mt-4 prose-h1:mb-4 prose-h1:text-2xl prose-h2:mt-6 prose-h2:mb-3 prose-h2:pb-1.5 prose-h2:text-xl prose-h3:mt-6 prose-h3:mb-2 prose-h3:text-lg prose-p:mt-3 prose-p:mb-3 prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline prose-blockquote:my-4 prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:text-muted-foreground prose-blockquote:italic prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:text-sm prose-pre:my-4 prose-pre:rounded-lg prose-pre:bg-muted prose-pre:p-4"
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
};

// Composant principal
export default function Show({
    post,
    previousPost,
    nextPost,
    relatedPosts,
}: Props) {
    const getInitials = useInitials();
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [likesCount, setLikesCount] = useState(post.data.likes_count || 0);
    const [showMobileToc, setShowMobileToc] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    if (!post?.data) {
        console.error('Post data is missing');
        return (
            <MainLayout breadcrumbs={[]}>
                <div className="container mx-auto px-4 py-12">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold">
                            Article non trouvé
                        </h1>
                    </div>
                </div>
            </MainLayout>
        );
    }

    const readingTime =
        post.data.reading_time_minutes ||
        Math.ceil((post.data.content?.length || 0) / 1500);

    const breadcrumbs: BreadcrumbItemType[] = [
        { title: 'Accueil', href: '/' },
        { title: 'Blog', href: '/blog' },
        { title: post.data.title, href: `/blog/${post.data.slug}` },
    ];

    const handleLike = async () => {
        setIsLiked(!isLiked);
        setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

        try {
            await router.post(
                `/posts/${post.data.id}/like`,
                {},
                {
                    preserveScroll: true,
                    onError: () => {
                        setIsLiked(!isLiked);
                        setLikesCount((prev) =>
                            isLiked ? prev + 1 : prev - 1,
                        );
                        toast.error('Erreur lors du like');
                    },
                },
            );
        } catch (error) {
            console.error('Error liking post:', error);
        }
    };

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: post.data.title,
                    text:
                        JSON.stringify(post.data.excerpt) ||
                        `Découvrez cet article: ${post.data.title}`,
                    url,
                });
                toast.success('Article partagé avec succès !');
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            await navigator.clipboard.writeText(url);
            toast.success('Lien copié dans le presse-papier !');
        }
    };

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.data.title,
        description: post.data.excerpt,
        author: { '@type': 'Person', name: post.data.user?.name },
        datePublished: post.data.published_at,
        dateModified: post.data.updated_at,
        image: post.data.featured_image_url,
        articleBody: post.data.content,
        url: window.location.href,
    };

    return (
        <MainLayout breadcrumbs={breadcrumbs}>
            <Head title={post.data.title}>
                <meta
                    name="description"
                    content={
                        JSON.stringify(post.data.excerpt) ||
                        post.data.meta_description ||
                        ''
                    }
                />
                <meta property="og:title" content={post.data.title} />
                <meta
                    property="og:description"
                    content={
                        JSON.stringify(post.data.excerpt) ||
                        post.data.meta_description ||
                        ''
                    }
                />
                <meta
                    property="og:image"
                    content={post.data.featured_image_thumb || ''}
                />
                <meta property="og:url" content={window.location.href} />
                <meta property="og:type" content="article" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={post.data.title} />
                <meta
                    name="twitter:description"
                    content={
                        JSON.stringify(post.data.excerpt) ||
                        post.data.meta_description ||
                        ''
                    }
                />
                <meta
                    name="twitter:image"
                    content={post.data.featured_image_thumb || ''}
                />
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd)}
                </script>
            </Head>

            <ReadingProgressBar />
            <ScrollToTop />

            <article className="min-h-screen bg-background">
                {/* Hero section */}
                <div className="border-b">
                    <div className="container mx-auto max-w-6xl px-4 py-10 md:py-12">
                        {post.data.categories &&
                            post.data.categories.length > 0 && (
                                <div className="mb-3 flex flex-wrap gap-1.5">
                                    {post.data.categories.map((category) => (
                                        <Link
                                            key={category.id}
                                            href={route('blog.index', {
                                                tag: category.slug,
                                            })}
                                            className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground transition-colors hover:bg-muted/80"
                                        >
                                            <Folder className="h-3 w-3" />
                                            {category.nom}
                                        </Link>
                                    ))}
                                </div>
                            )}

                        <h1 className="mb-4 text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
                            {post.data.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            {post.data.user && (
                                <div className="flex items-center gap-1.5">
                                    <Avatar className="h-6 w-6">
                                        {post.data.user.avatar_url ? (
                                            <AvatarImage
                                                src={post.data.user.avatar_url}
                                                alt={post.data.user.name}
                                            />
                                        ) : (
                                            <AvatarFallback className="text-[10px]">
                                                {getInitials(
                                                    post.data.user.name,
                                                )}
                                            </AvatarFallback>
                                        )}
                                    </Avatar>
                                    <span>{post.data.user.name}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{post.data.published_at}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{readingTime} min</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                <span>{post.data.views_count} vues</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Image à la une */}
                {post.data.featured_image_url && (
                    <div className="border-b">
                        <div className="container mx-auto h-96 max-w-6xl px-4 py-3">
                            <img
                                src={post.data.featured_image_url}
                                alt={post.data.title}
                                className="h-full w-full rounded-lg object-cover shadow-sm"
                                loading="lazy"
                            />
                        </div>
                    </div>
                )}

                {/* Layout à deux colonnes */}
                <div className="container mx-auto max-w-6xl px-4 py-8">
                    {/* Bouton mobile pour la table des matières */}
                    <div className="mb-4 lg:hidden">
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => setShowMobileToc(!showMobileToc)}
                        >
                            <List className="mr-2 h-4 w-4" />
                            Table des matières
                            <ChevronRight
                                className={`ml-2 h-4 w-4 transition-transform ${
                                    showMobileToc ? 'rotate-90' : ''
                                }`}
                            />
                        </Button>
                        {showMobileToc && (
                            <div className="mt-3">
                                <TableOfContents
                                    content={
                                        JSON.stringify(post.data.content) || ''
                                    }
                                />
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                        {/* Colonne principale - avec hauteur et overflow auto */}
                        <div className="lg:col-span-8">
                            {/* Barre d'actions sticky */}
                            <div className="sticky top-16 z-30 mb-6 flex items-center justify-between rounded-lg border bg-card/95 p-1.5 shadow-sm backdrop-blur-sm">
                                <div className="flex items-center gap-0.5">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 px-2"
                                                    onClick={handleLike}
                                                >
                                                    <Heart
                                                        className={`h-4 w-4 ${
                                                            isLiked
                                                                ? 'fill-current text-red-500'
                                                                : ''
                                                        }`}
                                                    />
                                                    <span className="ml-1 text-xs">
                                                        {likesCount}
                                                    </span>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                J'aime
                                            </TooltipContent>
                                        </Tooltip>

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 px-2"
                                                    onClick={() =>
                                                        setIsBookmarked(
                                                            !isBookmarked,
                                                        )
                                                    }
                                                >
                                                    <Bookmark
                                                        className={`h-4 w-4 ${
                                                            isBookmarked
                                                                ? 'fill-current text-yellow-500'
                                                                : ''
                                                        }`}
                                                    />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                Favoris
                                            </TooltipContent>
                                        </Tooltip>

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 px-2"
                                                    onClick={handleShare}
                                                >
                                                    <Share2 className="h-4 w-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                Partager
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>

                            {/* Extrait */}
                            {post.data.excerpt && (
                                <div className="mb-6 rounded-lg border bg-muted/30 p-4">
                                    <p className="text-sm text-muted-foreground italic">
                                        {JSON.stringify(post.data.excerpt)}
                                    </p>
                                </div>
                            )}

                            {/* Contenu */}
                            <div ref={contentRef}>
                                {post.data.content && (
                                    <RichContentText
                                        content={JSON.stringify(
                                            post.data.content,
                                        )}
                                    />
                                )}
                            </div>

                            {/* Tags */}
                            {post.data.tags && post.data.tags.length > 0 && (
                                <div className="mt-8 pt-6">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                        <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span className="text-xs font-medium text-muted-foreground">
                                            Tags :
                                        </span>
                                        {post.data.tags.map((tag) => (
                                            <Badge
                                                key={tag.id}
                                                variant="secondary"
                                                className="text-xs"
                                            >
                                                {tag.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Navigation précédent/suivant */}
                            {(previousPost || nextPost) && (
                                <div className="mt-8 pt-6">
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        {previousPost && (
                                            <Link
                                                href={`/blog/${previousPost.slug}`}
                                                className="group flex flex-col rounded-lg border p-3 transition-all hover:border-primary hover:shadow-sm"
                                            >
                                                <span className="text-xs text-muted-foreground">
                                                    Article précédent
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                                                    <span className="line-clamp-1 text-sm font-medium">
                                                        {previousPost.title}
                                                    </span>
                                                </div>
                                            </Link>
                                        )}
                                        {nextPost && (
                                            <Link
                                                href={`/blog/${nextPost.slug}`}
                                                className="group flex flex-col rounded-lg border p-3 text-right transition-all hover:border-primary hover:shadow-sm"
                                            >
                                                <span className="text-xs text-muted-foreground">
                                                    Article suivant
                                                </span>
                                                <div className="flex items-center justify-end gap-2">
                                                    <span className="line-clamp-1 text-sm font-medium">
                                                        {nextPost.title}
                                                    </span>
                                                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                                                </div>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Aside - Table des matières FIXE (ne bouge pas) */}
                        <aside className="hidden lg:col-span-4 lg:block">
                            <div className="relative">
                                {/* Conteneur sticky qui reste fixe pendant le scroll */}
                                <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
                                    <div className="space-y-4">
                                        {/* Table des matières */}
                                        <TableOfContents
                                            content={
                                                JSON.stringify(
                                                    post.data.content,
                                                ) || ''
                                            }
                                        />

                                        {/* Carte auteur */}
                                        {post.data.user && (
                                            <div className="rounded-lg border bg-card p-3">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        {post.data.user
                                                            .avatar_url ? (
                                                            <AvatarImage
                                                                src={
                                                                    post.data
                                                                        .user
                                                                        .avatar_url
                                                                }
                                                                alt={
                                                                    post.data
                                                                        .user
                                                                        .name
                                                                }
                                                            />
                                                        ) : (
                                                            <AvatarFallback className="text-xs">
                                                                {getInitials(
                                                                    post.data
                                                                        .user
                                                                        .name,
                                                                )}
                                                            </AvatarFallback>
                                                        )}
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-sm font-medium">
                                                            {
                                                                post.data.user
                                                                    .name
                                                            }
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            Auteur
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>

                {/* Articles similaires */}
                {relatedPosts && relatedPosts.length > 0 && (
                    <div className="border-t bg-muted/30">
                        <div className="container mx-auto max-w-6xl px-4 py-8">
                            <h2 className="mb-5 text-xl font-bold">
                                Articles similaires
                            </h2>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {relatedPosts.map((relatedPost) => (
                                    <Link
                                        key={relatedPost.id}
                                        href={`/blog/${relatedPost.slug}`}
                                        className="group overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md"
                                    >
                                        {relatedPost.featured_image_url && (
                                            <div className="aspect-video w-full overflow-hidden">
                                                <img
                                                    src={
                                                        relatedPost.featured_image_url
                                                    }
                                                    alt={relatedPost.title}
                                                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                                    loading="lazy"
                                                />
                                            </div>
                                        )}
                                        <div className="p-3">
                                            <h3 className="mb-1 line-clamp-2 text-sm font-semibold group-hover:text-primary">
                                                {relatedPost.title}
                                            </h3>
                                            <p className="line-clamp-2 text-xs text-muted-foreground">
                                                {relatedPost.excerpt}
                                            </p>
                                            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                                <Calendar className="h-2.5 w-2.5" />
                                                <span>
                                                    {relatedPost.published_at}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Commentaires */}
                {/* <div className="border-t">
                    <div className="container mx-auto max-w-6xl px-4 py-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold">Commentaires</h2>
                            <Button variant="outline" size="sm">
                                <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
                                {post.data.comments_count || 0} commentaires
                            </Button>
                        </div>
                        <Separator className="my-4" />
                        <div className="rounded-lg border bg-muted/30 p-6 text-center">
                            <MessageCircle className="mx-auto h-8 w-8 text-muted-foreground" />
                            <h3 className="mt-3 text-base font-medium">
                                Laissez un commentaire
                            </h3>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Connectez-vous pour participer à la discussion
                            </p>
                            <Button size="sm" className="mt-3">
                                Se connecter
                            </Button>
                        </div>
                    </div>
                </div> */}
            </article>
            <NewsletterSection />
        </MainLayout>
    );
}
