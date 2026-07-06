import { Link, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
    ArrowLeft,
    Bell,
    Check,
    CreditCard,
    Gift,
    Heart,
    Info,
    MessageCircle,
    Package,
    Star,
    Tag,
    Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { DashboardNotification } from '@/types/ecommerce/notifications/notification';

interface NotificationDetailProps {
    notification: DashboardNotification;
    backUrl: string;
}

const getIconForType = (type: string) => {
    switch (type) {
        case 'order':
            return <Package className="h-6 w-6" />;
        case 'payment':
        case 'success':
            return <CreditCard className="h-6 w-6" />;
        case 'message':
            return <MessageCircle className="h-6 w-6" />;
        case 'review':
            return <Star className="h-6 w-6" />;
        case 'promotion':
            return <Tag className="h-6 w-6" />;
        case 'loyalty':
            return <Gift className="h-6 w-6" />;
        case 'wishlist':
            return <Heart className="h-6 w-6" />;
        case 'error':
            return <Info className="h-6 w-6" />;
        default:
            return <Bell className="h-6 w-6" />;
    }
};

const getColorClassForType = (type: string) => {
    switch (type) {
        case 'order':
            return 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800';
        case 'payment':
        case 'success':
            return 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800';
        case 'promotion':
            return 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800';
        case 'loyalty':
            return 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800';
        case 'wishlist':
            return 'bg-pink-50 text-pink-600 border-pink-200 dark:bg-pink-950/40 dark:text-pink-400 dark:border-pink-800';
        case 'error':
            return 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800';
        case 'message':
            return 'bg-cyan-50 text-cyan-600 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-400 dark:border-cyan-800';
        case 'review':
            return 'bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-950/40 dark:text-yellow-400 dark:border-yellow-800';
        default:
            return 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
    }
};

const getLabelForType = (type: string) => {
    switch (type) {
        case 'order':
            return 'Commande';
        case 'payment':
            return 'Paiement';
        case 'success':
            return 'Succès';
        case 'message':
            return 'Message';
        case 'review':
            return 'Avis';
        case 'promotion':
            return 'Promotion';
        case 'loyalty':
            return 'Fidélité';
        case 'wishlist':
            return 'Liste de souhaits';
        case 'error':
            return 'Erreur';
        default:
            return 'Information';
    }
};

export function NotificationDetail({
    notification,
    backUrl,
}: NotificationDetailProps) {
    const isUnread = !notification.read_at;

    const handleMarkAsRead = () => {
        router.post(
            route('tenant.notifications.mark-as-read', notification.id),
            {},
            { preserveScroll: true, preserveState: true }
        );
    };

    const handleDelete = () => {
        router.delete(route('tenant.notifications.destroy', notification.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Notification supprimée.');
                router.visit(backUrl);
            },
        });
    };

    const hasExtraData =
        notification.data &&
        Object.keys(notification.data).some(
            (key) => !['type', 'title', 'message', 'url'].includes(key)
        );

    return (
        <div className="mx-auto w-full max-w-4xl space-y-6">
            <div>
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
            </div>

            <Card className="overflow-hidden rounded-2xl border-slate-200/60 shadow-xl shadow-slate-200/20 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/50 dark:shadow-slate-950/20">
                <div className="p-6 sm:p-8">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                        {/* Icon */}
                        <div
                            className={cn(
                                'flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border shadow-sm',
                                getColorClassForType(notification.type)
                            )}
                        >
                            {getIconForType(notification.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-4">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-3">
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            'rounded-full px-2.5 py-0.5 text-xs font-semibold',
                                            getColorClassForType(notification.type)
                                        )}
                                    >
                                        {getLabelForType(notification.type)}
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

                            <div>
                                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {notification.title}
                                </h2>
                            </div>

                            <div className="prose prose-slate max-w-none text-slate-600 dark:prose-invert dark:text-slate-300">
                                <p className="whitespace-pre-wrap leading-relaxed">
                                    {notification.message}
                                </p>
                            </div>

                            {notification.url && (
                                <div className="pt-4">
                                    <Button asChild className="shadow-sm">
                                        <a
                                            href={notification.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Voir les détails associés
                                        </a>
                                    </Button>
                                </div>
                            )}

                            {hasExtraData && (
                                <div className="mt-8 rounded-xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800/60 dark:bg-slate-900/30">
                                    <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
                                        Informations supplémentaires
                                    </h3>
                                    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        {Object.entries(notification.data!)
                                            .filter(
                                                ([key]) =>
                                                    !['type', 'title', 'message', 'url'].includes(key)
                                            )
                                            .map(([key, value]) => (
                                                <div key={key}>
                                                    <dt className="text-xs font-medium text-slate-500 dark:text-slate-400 capitalize">
                                                        {key.replace(/_/g, ' ')}
                                                    </dt>
                                                    <dd className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-200 wrap-break-word">
                                                        {typeof value === 'object'
                                                            ? JSON.stringify(value)
                                                            : String(value)}
                                                    </dd>
                                                </div>
                                            ))}
                                    </dl>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

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
