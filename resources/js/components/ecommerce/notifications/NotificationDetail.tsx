/* eslint-disable react-hooks/static-components */
// resources/js/components/ecommerce/notifications/NotificationDetail.tsx
import { Link, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ArrowLeft, Check, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getColorForType, getIconForType, getLabelForType } from '@/lib/notification-helpers';
import { getToastStyles } from '@/lib/toast-style';
import { cn } from '@/lib/utils';
import type { DashboardNotification } from '@/types/ecommerce/notifications/notification';

interface NotificationDetailProps {
  notification: DashboardNotification;
  backUrl: string;
  onDelete?: () => void;
  onMarkAsRead?: () => void;
}

export function NotificationDetail({
  notification,
  backUrl,
  onDelete,
  onMarkAsRead,
}: NotificationDetailProps) {
  const isUnread = !notification.read_at;
  const Icon = getIconForType(notification.type);
  const colorClass = getColorForType(notification.type);
  const label = getLabelForType(notification.type);

  const handleMarkAsRead = () => {
    if (onMarkAsRead) {
      onMarkAsRead();
    } else {
      router.post(
        route('tenant.notifications.mark-as-read', notification.id),
        {},
        { preserveScroll: true, preserveState: true }
      );
      toast.success('Notification marquée comme lue.', { style: getToastStyles() });
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    } else {
      router.delete(route('tenant.notifications.destroy', notification.id), {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Notification supprimée.', { style: getToastStyles() });
          router.visit(backUrl);
        },
      });
    }
  };

  const hasExtraData =
    notification.data &&
    Object.keys(notification.data).some(
      (key) => !['type', 'title', 'message', 'url'].includes(key)
    );

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      {/* Back button */}
      <Button
        variant="ghost"
        asChild
        className="mb-4 -ml-4 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
      >
        <Link href={backUrl}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux notifications
        </Link>
      </Button>

      {/* Detail card */}
      <Card className="overflow-hidden rounded-2xl border-slate-200/60 shadow-xl shadow-slate-200/20 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/50 dark:shadow-slate-950/20">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            {/* Icon */}
            <div
              className={cn(
                'flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border shadow-sm',
                colorClass
              )}
            >
              <Icon className="h-7 w-7" />
            </div>

            {/* Content */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className={cn(
                      'rounded-full px-2.5 py-0.5 text-xs font-semibold',
                      colorClass
                    )}
                  >
                    {label}
                  </Badge>
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {format(
                      new Date(notification.created_at),
                      'EEEE d MMMM yyyy à HH:mm',
                      { locale: fr }
                    )}
                  </span>
                </div>
                {isUnread && (
                  <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Nouveau
                  </Badge>
                )}
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {notification.title}
              </h2>

              <div className="prose prose-slate max-w-none text-slate-600 dark:prose-invert dark:text-slate-300">
                <p className="whitespace-pre-wrap leading-relaxed">
                  {notification.message}
                </p>
              </div>

              {notification.url && (
                <div className="pt-4">
                  <Button asChild className="shadow-sm">
                    <a href={notification.url} target="_blank" rel="noopener noreferrer">
                      Voir les détails associés
                    </a>
                  </Button>
                </div>
              )}

              {/* Extra data */}
              {hasExtraData && (
                <div className="mt-8 rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800/60 dark:bg-slate-900/30">
                  <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
                    Informations supplémentaires
                  </h3>
                  <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {Object.entries(notification.data!)
                      .filter(([key]) => !['type', 'title', 'message', 'url'].includes(key))
                      .map(([key, value]) => (
                        <div key={key}>
                          <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 capitalize">
                            {key.replace(/_/g, ' ')}
                          </dt>
                          <dd className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-200 break-all">
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </dd>
                        </div>
                      ))}
                  </dl>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/50 sm:px-8">
          {isUnread && (
            <Button
              variant="outline"
              onClick={handleMarkAsRead}
              className="bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 shadow-sm"
            >
              <Check className="mr-2 h-4 w-4" />
              Marquer comme lu
            </Button>
          )}
          <Button
            variant="outline"
            onClick={handleDelete}
            className="border-red-200 bg-white text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:bg-slate-900 dark:text-red-400 dark:hover:bg-red-950/40 shadow-sm"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </Card>
    </div>
  );
}
