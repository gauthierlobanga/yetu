// resources/js/components/chart-scheduled-posts.tsx
'use client';

import { Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

interface ScheduledPost {
    id: number;
    title: string;
    slug: string;
    scheduled_for: string;
}

export function ChartScheduledPosts({ posts }: { posts: ScheduledPost[] }) {
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <Card className="border-0 bg-slate-50/60 dark:bg-slate-900/40">
            <CardHeader className="border-b border-slate-200/60 px-4 pt-4 pb-2 dark:border-slate-800/60">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                            Articles programmés
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                            {posts.length} article{posts.length > 1 ? 's' : ''} prévu{posts.length > 1 ? 's' : ''} (30 jours)
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-4 py-3">
                {posts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-sm text-slate-400">
                        <Calendar className="mx-auto h-10 w-10 opacity-40" />
                        <p className="mt-2">Aucun article programmé</p>
                    </div>
                ) : (
                    <div className="space-y-2.5">
                        {posts.map((post) => (
                            <div
                                key={post.id}
                                className="flex items-start justify-between rounded-xl bg-white/70 px-4 py-3 transition-colors hover:bg-white dark:bg-slate-900/70 dark:hover:bg-slate-900"
                            >
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                        {post.title}
                                    </p>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                        <Calendar className="h-3 w-3" />
                                        <span>{formatDate(post.scheduled_for)}</span>
                                    </div>
                                </div>
                                <Badge
                                    variant="outline"
                                    className="rounded-full border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                                >
                                    Programmé
                                </Badge>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
            {posts.length > 0 && (
                <CardFooter className="border-t border-slate-200/60 px-4 py-2 text-xs text-slate-500 dark:border-slate-800/60">
                    Prochain article : {formatDate(posts[0].scheduled_for)}
                </CardFooter>
            )}
        </Card>
    );
}
