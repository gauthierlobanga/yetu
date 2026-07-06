/* eslint-disable react-hooks/static-components */
// resources/js/components/ecommerce/notifications/NotificationItem.tsx
import { Link } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';
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
    // Le parent se charge de la suppression effective et met à jour la liste.
    // En cas d'échec, l'élément reste affiché mais le spinner reste actif.
    // Une amélioration possible serait de gérer le retour du parent pour réinitialiser l'état.
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
          'group relative flex items-start gap-4 p-4 transition-all duration-200 hover:bg-slate-50/80 dark:hover:bg-slate-800/40',
          isUnread &&
            'bg-linear-to-r from-primary/5 via-transparent to-transparent dark:from-primary/10',
          variant === 'compact' && 'p-3 gap-3'
        )}
      >
        {/* Accent bar for unread */}
        {isUnread && (
          <div className="absolute inset-y-0 left-0 w-1 rounded-r-full bg-primary" />
        )}

        {/* Icon */}
        <div
          className={cn(
            'flex shrink-0 items-center justify-center rounded-full border shadow-sm transition-transform duration-200 group-hover:scale-105',
            variant === 'compact' ? 'h-9 w-9' : 'h-11 w-11',
            colorClass
          )}
        >
          <Icon
            className={cn(
              'shrink-0',
              variant === 'compact' ? 'h-4 w-4' : 'h-5 w-5'
            )}
          />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <h4
              className={cn(
                'truncate text-sm',
                isUnread
                  ? 'font-bold text-slate-900 dark:text-white'
                  : 'font-medium text-slate-700 dark:text-slate-300'
              )}
            >
              {notification.title}
            </h4>
            {isUnread && (
              <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
            )}
          </div>
          <p
            className={cn(
              'line-clamp-2 text-sm leading-relaxed',
              isUnread
                ? 'text-slate-600 dark:text-slate-300'
                : 'text-slate-500 dark:text-slate-400',
              variant === 'compact' && 'line-clamp-1'
            )}
          >
            {notification.message}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {formatDistanceToNow(new Date(notification.created_at), {
              addSuffix: true,
              locale: fr,
            })}
          </p>
        </div>

        {/* Actions */}
        {showActions && (
          <div
            className={cn(
              'flex shrink-0 items-center gap-0.5 transition-opacity duration-200',
              isHovered ? 'opacity-100' : 'opacity-0'
            )}
          >
            {isUnread && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleMarkAsRead}
                className="h-8 w-8 rounded-lg text-slate-400 hover:text-primary"
                title="Marquer comme lu"
              >
                <Check className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="h-8 w-8 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40"
              title="Supprimer"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </Link>
    </motion.div>
  );
}