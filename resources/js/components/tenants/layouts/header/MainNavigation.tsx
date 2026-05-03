import { Link } from '@inertiajs/react';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types';

interface MainNavigationProps {
    items: NavItem[];
}

const activeItemStyles = 'bg-accent text-accent-foreground';

export function MainNavigation({ items }: MainNavigationProps) {
    const { whenCurrentUrl } = useCurrentUrl();

    // Filtrer les doublons potentiels basés sur href
    const uniqueItems = items.filter(
        (item, index, self) =>
            index === self.findIndex((t) => t.href === item.href),
    );

    return (
        <NavigationMenu className="flex h-full items-stretch">
            <NavigationMenuList className="flex h-full items-stretch space-x-1">
                {uniqueItems.map((item, index) => (
                    <NavigationMenuItem
                        key={`nav-${item.href}-${index}`}
                        className="relative flex h-full items-center"
                    >
                        <Link
                            href={item.href}
                            className={cn(
                                navigationMenuTriggerStyle(),
                                whenCurrentUrl(item.href, activeItemStyles),
                                'h-9 cursor-pointer px-3 text-sm font-medium transition-colors hover:text-primary',
                            )}
                        >
                            {item.icon && (
                                <item.icon className="mr-2 h-4 w-4" />
                            )}
                            {item.title}
                        </Link>
                    </NavigationMenuItem>
                ))}
            </NavigationMenuList>
        </NavigationMenu>
    );
}
