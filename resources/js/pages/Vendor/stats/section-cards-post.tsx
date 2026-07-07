/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/components/section-cards-post.tsx

import { usePage } from '@inertiajs/react';
import {
    IconTrendingDown,
    IconTrendingUp,
    IconEye,
    IconHeart,
    IconMessage,
    IconFileText,
    IconCalendar,
    IconUser,
    IconRocket,
    IconClock,
    IconChartBar,
    IconPencil,
    IconAlertTriangle,
} from '@tabler/icons-react';
import { useEffect, useState, useMemo } from 'react';
import CountUp from 'react-countup';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

interface PostStats {
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
    avg_engagement: number;
    max_engagement: number;
    old_drafts_count: number;
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
    stats: PostStats;
    [key: string]: unknown;
}

/**
 * Génère des données synthétiques pour le mini graphique en aires.
 * @param trend - pourcentage de changement (ex: +12.5 ou -5.2)
 * @param points - nombre de points (par défaut 6)
 * @returns tableau d'objets { name: string, value: number }
 */
function generateTrendData(trend: number, points: number = 6) {
    const baseValue = 50; // valeur de base arbitraire
    const direction = trend >= 0 ? 1 : -1;
    const amplitude = Math.min(Math.abs(trend), 30); // limiter l'amplitude

    return Array.from({ length: points }, (_, i) => {
        // progression linéaire avec un peu d'aléatoire
        const progress = (i + 1) / points;
        const randomFactor = 0.7 + Math.random() * 0.6; // entre 0.7 et 1.3
        const value =
            baseValue + direction * amplitude * progress * randomFactor;

        return {
            name: `J${i + 1}`,
            value: Math.max(0, Math.round(value * 10) / 10),
        };
    });
}

export function SectionCards() {
    const { props } = usePage<PageProps>();
    const stats = props.stats;

    if (!stats) {
        return (
            <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @3xl/main:grid-cols-4">
                {[...Array(12)].map((_, i) => (
                    <Card key={i} className="@container/card animate-pulse">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="h-4 w-24 rounded bg-muted" />
                                <div className="h-6 w-12 rounded bg-muted" />
                            </div>
                            <div className="mt-2 h-8 w-32 rounded bg-muted" />
                        </CardHeader>
                        <CardFooter>
                            <div className="h-4 w-40 rounded bg-muted" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        );
    }

    const safeDays = () => {
        const d = stats.days_since_last_post;

        return d !== null && d !== undefined && !isNaN(d) && d >= 0 && d < 10000
            ? d
            : null;
    };
    const daysValue = safeDays();

    const cards = [
        {
            title: 'Articles publiés',
            value: stats.published_posts,
            trend: stats.posts_change,
            trendUp: stats.posts_change >= 0,
            icon: <IconFileText className="size-5 text-emerald-500" />,
            sub: `${stats.draft_posts} brouillons · ${stats.scheduled_posts} programmés`,
            strokeColor: '#10b981',
            gradientId: 'publishedGradient',
        },
        {
            title: 'Vues totales',
            value: stats.total_views,
            trend: stats.views_change,
            trendUp: stats.views_change >= 0,
            icon: <IconEye className="size-5 text-blue-500" />,
            sub: 'Audience cumulée',
            strokeColor: '#3b82f6',
            gradientId: 'viewsGradient',
        },
        {
            title: 'Likes',
            value: stats.total_likes,
            trend: stats.likes_change,
            trendUp: stats.likes_change >= 0,
            icon: <IconHeart className="size-5 text-red-500" />,
            sub: `Ratio : ${stats.total_views > 0 ? ((stats.total_likes / stats.total_views) * 100).toFixed(1) : 0}%`,
            strokeColor: '#ef4444',
            gradientId: 'likesGradient',
        },
        {
            title: 'Commentaires',
            value: stats.total_comments,
            trend:
                stats.total_views > 0
                    ? (stats.total_comments / stats.total_views) * 100
                    : 0,
            trendUp: true,
            icon: <IconMessage className="size-5 text-violet-500" />,
            sub: `${stats.avg_engagement.toFixed(1)}% d'engagement`,
            strokeColor: '#8b5cf6',
            gradientId: 'commentsGradient',
        },
        {
            title: 'Taux de conversion',
            value: stats.conversion_rate,
            trend: stats.conversion_rate,
            trendUp: stats.conversion_rate >= 0,
            icon: <IconRocket className="size-5 text-amber-500" />,
            sub: 'Ratio vs période précédente',
            strokeColor: '#f59e0b',
            gradientId: 'conversionGradient',
        },
        {
            title: 'Auteurs actifs',
            value: stats.active_authors,
            trend: stats.active_authors_change,
            trendUp: stats.active_authors_change >= 0,
            icon: <IconUser className="size-5 text-cyan-500" />,
            sub: `${stats.active_authors_change >= 0 ? '+' : ''}${stats.active_authors_change}%`,
            strokeColor: '#06b6d4',
            gradientId: 'authorsGradient',
        },
        {
            title: 'Articles ce mois',
            value: stats.posts_this_month,
            trend: stats.posts_this_month_change,
            trendUp: stats.posts_this_month_change >= 0,
            icon: <IconCalendar className="size-5 text-indigo-500" />,
            sub: `${stats.posts_this_month_change >= 0 ? '+' : ''}${stats.posts_this_month_change}%`,
            strokeColor: '#6366f1',
            gradientId: 'monthlyGradient',
        },
        {
            title: 'Brouillons en attente',
            value: stats.pending_drafts,
            trend: stats.pending_drafts_change ?? 0,
            trendUp: (stats.pending_drafts_change ?? 0) >= 0,
            icon: <IconPencil className="size-5 text-orange-500" />,
            sub: `${stats.old_drafts_count} anciens (30j+)`,
            strokeColor: '#f97316',
            gradientId: 'draftsGradient',
        },
        {
            title: 'Dernière publication',
            value: daysValue ?? 999,
            trend: daysValue !== null ? -daysValue : 0,
            trendUp: false,
            icon: <IconClock className="size-5 text-slate-500" />,
            sub:
                daysValue === 0
                    ? "Aujourd'hui"
                    : daysValue !== null
                      ? `Il y a ${daysValue} jour(s)`
                      : 'Aucune',
            strokeColor: '#64748b',
            gradientId: 'lastPostGradient',
        },
        {
            title: 'Tendance vues 7j',
            value: stats.views_trend,
            trend: stats.views_trend,
            trendUp: stats.views_trend >= 0,
            icon: <IconChartBar className="size-5 text-purple-500" />,
            sub: 'vs semaine précédente',
            strokeColor: '#a855f7',
            gradientId: 'trendGradient',
        },
        {
            title: 'Anciens brouillons',
            value: stats.old_drafts_count,
            trend: 0,
            trendUp: false,
            icon: <IconAlertTriangle className="size-5 text-rose-500" />,
            sub: 'Non modifiés depuis 30 jours',
            strokeColor: '#f43f5e',
            gradientId: 'oldDraftsGradient',
        },
        {
            title: 'Taux d’engagement',
            value: stats.avg_engagement,
            trend: stats.avg_engagement,
            trendUp: stats.avg_engagement >= 0,
            icon: <IconChartBar className="size-5 text-teal-500" />,
            sub: `Max ${stats.max_engagement.toFixed(1)}%`,
            strokeColor: '#14b8a6',
            gradientId: 'engagementGradient',
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @3xl/main:grid-cols-4">
            {cards.map((card, index) => {
                const data = useMemo(
                    () => generateTrendData(card.trend, 6),
                    [card.trend],
                );

                return (
                    <Card
                        key={index}
                        className="group @container/card relative overflow-hidden border-0 bg-linear-to-br from-white to-slate-50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:from-slate-900 dark:to-slate-950"
                    >
                        <CardHeader className="pb-2">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="flex size-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                                        {card.icon}
                                    </span>
                                    <div>
                                        <CardDescription className="text-xs font-medium text-slate-500">
                                            {card.title}
                                        </CardDescription>
                                        <CardTitle className="text-2xl font-bold tracking-tight tabular-nums">
                                            <CountUp
                                                start={0}
                                                end={card.value}
                                                duration={1.5}
                                                separator=" "
                                                decimals={
                                                    typeof card.value ===
                                                        'number' &&
                                                    card.value % 1 !== 0
                                                        ? 1
                                                        : 0
                                                }
                                            />
                                        </CardTitle>
                                    </div>
                                </div>
                                <CardAction>
                                    <Badge
                                        variant="outline"
                                        className={`flex items-center gap-1 px-2 py-0.5 text-xs ${
                                            card.trendUp
                                                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400'
                                                : 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400'
                                        }`}
                                    >
                                        {card.trendUp ? (
                                            <IconTrendingUp className="size-3.5" />
                                        ) : (
                                            <IconTrendingDown className="size-3.5" />
                                        )}
                                        {Math.abs(card.trend).toFixed(1)}%
                                    </Badge>
                                </CardAction>
                            </div>
                        </CardHeader>
                        <CardFooter className="flex-col items-start gap-1.5 pt-0">
                            <p className="text-xs text-slate-500">{card.sub}</p>
                            {/* Mini graphique en aires */}
                            <div className="h-16 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={data}
                                        margin={{
                                            top: 0,
                                            right: 0,
                                            left: 0,
                                            bottom: 0,
                                        }}
                                    >
                                        <defs>
                                            <linearGradient
                                                id={`${card.gradientId}`}
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor={card.strokeColor}
                                                    stopOpacity={0.3}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor={card.strokeColor}
                                                    stopOpacity={0}
                                                />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="#e2e8f0"
                                            strokeOpacity={0.3}
                                        />
                                        <XAxis dataKey="name" hide />
                                        <YAxis
                                            hide
                                            domain={[
                                                'dataMin - 5',
                                                'dataMax + 5',
                                            ]}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                background:
                                                    'rgba(255,255,255,0.9)',
                                                border: 'none',
                                                borderRadius: '12px',
                                                boxShadow:
                                                    '0 4px 12px rgba(0,0,0,0.1)',
                                                fontSize: '12px',
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke={card.strokeColor}
                                            strokeWidth={2}
                                            fill={`url(#${card.gradientId})`}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    );
}
