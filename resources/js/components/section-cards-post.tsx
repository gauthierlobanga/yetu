/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/components/section-cards-post.tsx
import { usePage } from '@inertiajs/react';
import {
    TrendingUp,
    TrendingDown,
    FileText,
    Calendar,
    Users,
    Eye,
    ThumbsUp,
    MessageCircle,
    Clock,
    BarChart3,
    Zap,
    AlertCircle,
    PencilLine,
    UserPlus,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface BlogStats {
    total_posts: number;
    published_posts: number;
    draft_posts: number;
    scheduled_posts: number;
    archived_posts: number;
    total_views: number;
    total_likes: number;
    total_comments: number;
    views_change: number;
    likes_change: number;
    posts_change: number;
    old_drafts_count: number;
    avg_engagement: number;
    max_engagement: number;
    posts_this_month: number;
    posts_this_month_change: number;
    active_authors: number;
    active_authors_change: number;
    conversion_rate: number;
    days_since_last_post: number | null;
    views_trend: number;
    pending_drafts: number;
    pending_drafts_change: number;
}

interface PageProps {
    stats: Partial<BlogStats>;
    [key: string]: unknown;
}

export function SectionCardsBlog() {
    const { props } = usePage<PageProps>();
    const stats = props.stats;

    if (!stats) {
        return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                    <Card key={i} className="animate-pulse border-0 bg-slate-50/50 dark:bg-slate-900/50">
                        <CardContent className="p-4">
                            <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800" />
                            <div className="mt-2 h-8 w-32 rounded bg-slate-200 dark:bg-slate-800" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    const formatNumber = (value: number) => value.toLocaleString('fr-FR');

    const cards = [
        {
            title: 'Articles publiés',
            value: formatNumber(stats.published_posts ?? 0),
            sub: `${stats.draft_posts ?? 0} brouillons, ${stats.scheduled_posts ?? 0} programmés`,
            trend: stats.posts_change ?? 0,
            icon: <FileText className="h-5 w-5 text-blue-500" />,
        },
        {
            title: 'Vues totales',
            value: formatNumber(stats.total_views ?? 0),
            sub: 'Depuis le début',
            trend: stats.views_change ?? 0,
            icon: <Eye className="h-5 w-5 text-emerald-500" />,
        },
        {
            title: 'Likes',
            value: formatNumber(stats.total_likes ?? 0),
            sub: 'Engagement global',
            trend: stats.likes_change ?? 0,
            icon: <ThumbsUp className="h-5 w-5 text-purple-500" />,
        },
        {
            title: 'Commentaires',
            value: formatNumber(stats.total_comments ?? 0),
            sub: 'Interactions',
            trend: stats.likes_change ?? 0, // ou un changement dédié, à ajuster si besoin
            icon: <MessageCircle className="h-5 w-5 text-orange-500" />,
        },
        {
            title: 'Auteurs actifs',
            value: formatNumber(stats.active_authors ?? 0),
            sub: 'Contributeurs',
            trend: stats.active_authors_change ?? 0,
            icon: <Users className="h-5 w-5 text-cyan-500" />,
        },
        {
            title: 'Taux d\'engagement',
            value: `${(stats.avg_engagement ?? 0).toFixed(1)}%`,
            sub: `Max: ${(stats.max_engagement ?? 0).toFixed(1)}%`,
            trend: stats.avg_engagement ?? 0,
            icon: <BarChart3 className="h-5 w-5 text-yellow-500" />,
        },
        {
            title: 'Articles ce mois',
            value: formatNumber(stats.posts_this_month ?? 0),
            sub: 'vs mois précédent',
            trend: stats.posts_this_month_change ?? 0,
            icon: <Calendar className="h-5 w-5 text-indigo-500" />,
        },
        {
            title: 'Brouillons en attente',
            value: formatNumber(stats.pending_drafts ?? 0),
            sub: 'Mis à jour récemment',
            trend: stats.pending_drafts_change ?? 0,
            icon: <PencilLine className="h-5 w-5 text-rose-500" />,
        },
        {
            title: 'Dernier article',
            value: stats.days_since_last_post !== null ? `${stats.days_since_last_post}j` : 'N/A',
            sub: 'Jours depuis la dernière publication',
            trend: 0,
            icon: <Clock className="h-5 w-5 text-slate-500" />,
        },
        {
            title: 'Tendance vues 7j',
            value: `${stats.views_trend ?? 0}%`,
            sub: 'Par rapport à la semaine précédente',
            trend: stats.views_trend ?? 0,
            icon: <TrendingUp className="h-5 w-5 text-teal-500" />,
        },
        {
            title: 'Taux de conversion*',
            value: `${stats.conversion_rate ?? 0}%`,
            sub: 'Ratio posts actuels / précédents',
            trend: stats.conversion_rate ?? 0,
            icon: <Zap className="h-5 w-5 text-amber-500" />,
        },
        {
            title: 'Brouillons anciens',
            value: formatNumber(stats.old_drafts_count ?? 0),
            sub: 'Non modifiés depuis 30 jours',
            trend: 0,
            icon: <AlertCircle className="h-5 w-5 text-red-400" />,
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, index) => (
                <Card
                    key={index}
                    className="group border-0 bg-slate-50/60 transition-colors duration-200 hover:bg-white dark:bg-slate-900/40 dark:hover:bg-slate-900/80"
                >
                    <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                                    {card.icon}
                                    {card.title}
                                </div>
                                <div className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {card.value}
                                </div>
                            </div>
                            <Badge
                                variant="outline"
                                className={`flex items-center gap-0.5 px-1.5 py-0 text-[10px] leading-none ${
                                    card.trend >= 0
                                        ? 'border-emerald-200 text-emerald-700 dark:border-emerald-800 dark:text-emerald-400'
                                        : 'border-red-200 text-red-700 dark:border-red-800 dark:text-red-400'
                                }`}
                            >
                                {card.trend >= 0 ? (
                                    <TrendingUp className="h-3 w-3" />
                                ) : (
                                    <TrendingDown className="h-3 w-3" />
                                )}
                                {Math.abs(card.trend)}%
                            </Badge>
                        </div>
                        <div className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                            {card.sub}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
