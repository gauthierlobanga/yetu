// resources/js/components/layout/header/NotificationsDropdown.tsx

import { Link } from '@inertiajs/react';
import { Bell } from 'lucide-react';
import { NotificationItem } from '@/components/tenants/shop/notifications/NotificationItem';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { useNotifications } from '@/hooks/tenants/use-notifications';
import type { Notification } from '@/types/tenants/notifications/notification';

export function NotificationsDropdown() {
    const { notifications, unreadCount, markAsRead, markAllAsRead } =
        useNotifications();

    return (
        <DropdownMenu>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon-lg"
                            className="relative h-10 w-10 cursor-pointer"
                            aria-label="Notifications"
                        >
                            <Bell className="h-4 w-4" />
                            {unreadCount > 0 && (
                                <Badge
                                    variant="destructive"
                                    className="absolute -top-1 -right-1 h-5 min-w-5 px-1 text-xs"
                                >
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </Badge>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Notifications</p>
                </TooltipContent>
            </Tooltip>

            <DropdownMenuContent className="w-80" align="end">
                <div className="flex items-center justify-between px-4 py-2">
                    <DropdownMenuLabel className="p-0 text-sm font-semibold">
                        Notifications
                    </DropdownMenuLabel>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-xs text-primary hover:bg-transparent"
                            onClick={markAllAsRead}
                        >
                            Tout marquer comme lu
                        </Button>
                    )}
                </div>
                <DropdownMenuSeparator />
                <ScrollArea className="h-75">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            Aucune notification
                        </div>
                    ) : (
                        notifications.map((notification: Notification) => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                onMarkAsRead={markAsRead}
                            />
                        ))
                    )}
                </ScrollArea>
                <DropdownMenuSeparator />
                <div className="p-2">
                    <Link
                        href="#"
                        className="block w-full rounded-md px-2 py-1.5 text-center text-sm hover:bg-accent"
                    >
                        Voir toutes les notifications
                    </Link>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
