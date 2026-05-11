import { Star, ThumbsUp, ThumbsDown, User } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface ReviewCardProps {
    customerName: string;
    customerAvatar?: string;
    rating: number;
    reviewDate: string;
    reviewText: string;
}

export function ReviewCard({
    customerName,
    customerAvatar,
    rating,
    reviewDate,
    reviewText,
}: ReviewCardProps) {
    const [helpfulCount, setHelpfulCount] = useState(0);
    const [unhelpfulCount, setUnhelpfulCount] = useState(0);
    const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);

    const handleHelpful = () => {
        if (userVote !== 'up') {
            setHelpfulCount((c) => c + 1);

            if (userVote === 'down') {
                setUnhelpfulCount((c) => c - 1);
            }

            setUserVote('up');
        }
    };

    const handleUnhelpful = () => {
        if (userVote !== 'down') {
            setUnhelpfulCount((c) => c + 1);

            if (userVote === 'up') {
                setHelpfulCount((c) => c - 1);
            }

            setUserVote('down');
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const initials = customerName
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();

    return (
        <div className="flex gap-4 py-4 first:pt-0">
            <Avatar className="h-12 w-12 rounded-full border-2 border-emerald-200 dark:border-emerald-700">
                {customerAvatar ? (
                    <AvatarImage
                        src={customerAvatar}
                        alt={customerName}
                        className="object-cover"
                    />
                ) : (
                    <AvatarFallback className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                        <User className="h-6 w-6" />
                    </AvatarFallback>
                )}
            </Avatar>

            <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-start justify-between gap-4">
                    <div>
                        <h4 className="text-sm font-semibold text-foreground">
                            {customerName}
                        </h4>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-3.5 w-3.5 ${
                                        i < Math.floor(rating)
                                            ? 'fill-amber-400 text-amber-400'
                                            : i < rating
                                              ? 'fill-amber-400/50 text-amber-400'
                                              : 'text-muted-foreground/20'
                                    }`}
                                />
                            ))}
                            <span className="ml-1 text-xs text-muted-foreground">
                                {rating.toFixed(1)}
                            </span>
                        </div>
                    </div>
                    <span className="text-xs whitespace-nowrap text-muted-foreground">
                        {reviewDate}
                    </span>
                </div>

                <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                    {reviewText}
                </p>

                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`gap-1 text-xs ${
                            userVote === 'up'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-muted-foreground'
                        }`}
                        onClick={handleHelpful}
                    >
                        <ThumbsUp className="h-3.5 w-3.5" />
                        {helpfulCount > 0 && helpfulCount}
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`gap-1 text-xs ${
                            userVote === 'down'
                                ? 'text-red-600 dark:text-red-400'
                                : 'text-muted-foreground'
                        }`}
                        onClick={handleUnhelpful}
                    >
                        <ThumbsDown className="h-3.5 w-3.5" />
                        {unhelpfulCount > 0 && unhelpfulCount}
                    </Button>
                </div>
            </div>
        </div>
    );
}
