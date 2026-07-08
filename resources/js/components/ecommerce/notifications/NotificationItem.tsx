/* eslint-disable react-hooks/static-components */
// resources/js/components/ecommerce/notifications/NotificationItem.tsx
import { Link } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'motion/react';
import { Check, Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { getColorForType, getIconForType } from '@/lib/notification-helpers';
import { cn } from '@/lib/utils';
import type { DashboardNotification } from '@/types/ecommerce/notifications/notification';

interface NotificationItemProps {
    notification: DashboardNotification;
    onMarkAsRead: (id: string) => void;
    onDelete: (id: string) => void;
    showActions?: boolean;
    variant?: 'compact' | 'full';
}

export function NotificationItem({
    notification,
    onMarkAsRead,
    onDelete,
    showActions = true,
    variant = 'full',
}: NotificationItemProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const isUnread = !notification.read_at;
    const Icon = getIconForType(notification.type);
    const colorClass = getColorForType(notification.type);

    const handleMarkAsRead = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isUnread) {
            onMarkAsRead(notification.id);
        }
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDeleting(true);
        onDelete(notification.id);
    };

    const detailHref = notification.url || '#';

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link
                href={detailHref}
                className={cn(
                    'group relative flex items-start gap-4 p-4 transition-all duration-200',
                    'border-b border-slate-100 dark:border-slate-800/50',
                    'hover:bg-slate-50/80 dark:hover:bg-slate-800/40',
                    isUnread &&
                        'bg-linear-to-r from-primary/5 via-transparent to-transparent dark:from-primary/10',
                    variant === 'compact' && 'gap-3 p-3',
                )}
            >
                {/* Barre d'accentuation pour les notifications non lues */}
                {isUnread && (
                    <div className="absolute inset-y-0 left-0 w-1 rounded-r-full bg-primary shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                )}

                {/* Icône avec halo */}
                <div className="relative">
                    <div
                        className={cn(
                            'flex shrink-0 items-center justify-center rounded-full border shadow-sm transition-all duration-300',
                            'group-hover:scale-110 group-hover:shadow-md',
                            variant === 'compact' ? 'h-9 w-9' : 'h-11 w-11',
                            colorClass,
                        )}
                    >
                        <Icon
                            className={cn(
                                'shrink-0',
                                variant === 'compact' ? 'h-4 w-4' : 'h-5 w-5',
                            )}
                        />
                    </div>
                    {isUnread && (
                        <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-primary dark:border-slate-900" />
                    )}
                </div>

                {/* Contenu */}
                <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex items-center gap-2">
                        <h4
                            className={cn(
                                'truncate text-sm leading-snug',
                                isUnread
                                    ? 'font-bold text-slate-900 dark:text-white'
                                    : 'font-medium text-slate-700 dark:text-slate-300',
                            )}
                        >
                            {notification.title}
                        </h4>
                        {isUnread && (
                            <span className="h-2 w-2 shrink-0 rounded-full bg-primary shadow-[0_0_6px_rgba(16,185,129,0.5)]" />
                        )}
                    </div>
                    <p
                        className={cn(
                            'line-clamp-2 text-sm leading-relaxed',
                            isUnread
                                ? 'text-slate-600 dark:text-slate-300'
                                : 'text-slate-500 dark:text-slate-400',
                            variant === 'compact' && 'line-clamp-1',
                        )}
                    >
                        {notification.message}
                    </p>
                    <div className="flex items-center gap-2">
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                            {formatDistanceToNow(
                                new Date(notification.created_at),
                                { addSuffix: true, locale: fr },
                            )}
                        </p>
                        {notification.type && (
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 uppercase dark:bg-slate-800 dark:text-slate-400">
                                {notification.type}
                            </span>
                        )}
                    </div>
                </div>

                {/* Actions */}
                {showActions && (
                    <motion.div
                        initial={false}
                        animate={{
                            opacity: isHovered ? 1 : 0,
                            x: isHovered ? 0 : 5,
                        }}
                        transition={{ duration: 0.2 }}
                        className="flex shrink-0 items-center gap-1"
                    >
                        {isUnread && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleMarkAsRead}
                                className="h-8 w-8 rounded-lg text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-400"
                                title="Marquer comme lu"
                            >
                                <Check className="h-4 w-4" />
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleDelete}
                            className="h-8 w-8 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                            title="Supprimer"
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Trash2 className="h-4 w-4" />
                            )}
                        </Button>
                    </motion.div>
                )}
            </Link>
        </motion.div>
    );
}
