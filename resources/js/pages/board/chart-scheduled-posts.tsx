// resources/js/components/chart-scheduled-posts.tsx
"use client"

import { Calendar, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
            minute: '2-digit'
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Articles programmés</CardTitle>
                <CardDescription>Prochaines publications (30 jours)</CardDescription>
            </CardHeader>
            <CardContent>
                {posts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        Aucun article programmé
                    </div>
                ) : (
                    <div className="space-y-3">
                        {posts.map((post) => (
                            <div key={post.id} className="flex items-start justify-between p-3 rounded-lg bg-muted/50">
                                <div className="space-y-1">
                                    <p className="font-medium">{post.title}</p>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <Calendar className="h-3 w-3" />
                                        <span>{formatDate(post.scheduled_for)}</span>
                                    </div>
                                </div>
                                <Badge variant="outline">Programmé</Badge>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}