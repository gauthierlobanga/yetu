// resources/js/hooks/ecommerce/use-notifications.ts

import { Notification } from '@/types/ecommerce/notifications/notification';
import { usePage, router } from '@inertiajs/react';
import { useMemo } from 'react';

interface UseNotificationsReturn {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: number | string) => void;
    markAllAsRead: () => void;
}

export function useNotifications(): UseNotificationsReturn {
    const { props } = usePage();
    const notifications = (props.notifications as Notification[]) || [];

    const unreadCount = useMemo(() => {
        return notifications.filter((n: Notification) => !n.read_at).length;
    }, [notifications]);

    const markAsRead = (id: number | string) => {
        router.post(
            route('notifications.mark-as-read', { id }),
            {},
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const markAllAsRead = () => {
        router.post(
            route('notifications.mark-all-as-read'),
            {},
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    return {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
    };
}
