// resources/js/components/chart-top-authors.tsx
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

interface TopAuthor {
    id: number;
    name: string;
    avatar_url: string | null;
    posts_count: number;
    total_views: number;
}

export function ChartTopAuthors({ authors }: { authors: TopAuthor[] }) {
    if (!authors || authors.length === 0) {
        return (
            <Card className="border-0 bg-slate-50/60 dark:bg-slate-900/40">
                <CardHeader className="px-4 pt-4 pb-2">
                    <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                        Top Contributeurs
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                        Aucun auteur trouvé
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card className="border-0 bg-slate-50/60 dark:bg-slate-900/40">
            <CardHeader className="border-b border-slate-200/60 px-4 pt-4 pb-2 dark:border-slate-800/60">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-base font-semibold text-slate-900 dark:text-white">
                            Top Contributeurs
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                            {authors.length} auteur
                            {authors.length > 1 ? 's' : ''} les plus actifs
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-4 py-3">
                <div className="space-y-3">
                    {authors.map((author, index) => (
                        <div
                            key={author.id}
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-center gap-2">
                                <span className="w-5 text-center text-xs font-medium text-slate-400 dark:text-slate-500">
                                    #{index + 1}
                                </span>
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage
                                        src={author.avatar_url || undefined}
                                    />
                                    <AvatarFallback className="text-xs">
                                        {author.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                        {author.name}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        {author.posts_count} article
                                        {author.posts_count > 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>
                            <Badge
                                variant="outline"
                                className="rounded-full border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                            >
                                {author.total_views.toLocaleString()} vues
                            </Badge>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="border-t border-slate-200/60 px-4 py-2 text-xs text-slate-500 dark:border-slate-800/60">
                Classement par nombre d'articles
            </CardFooter>
        </Card>
    );
}
