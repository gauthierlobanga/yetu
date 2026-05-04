/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/components/MainNavigation.tsx
import { Link } from '@inertiajs/react';
import React from 'react';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuContent,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types';

interface MainNavigationProps {
    items: NavItem[];
}

export function MainNavigation({ items }: MainNavigationProps) {
    return (
        <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="gap-1">
                {items.map((item, index) => {
                    // Si l'item a un contenu (méga‑menu), on utilise NavigationMenuTrigger + NavigationMenuContent
                    if (item.content) {
                        return (
                            <NavigationMenuItem key={`nav-${index}`}>
                                <NavigationMenuTrigger className="h-10 px-3 text-sm font-medium">
                                    {item.title}
                                </NavigationMenuTrigger>
                                <NavigationMenuContent className="absolute top-full left-0 w-screen border-b bg-white shadow-lg dark:bg-gray-900">
                                    <div className="mx-auto max-w-7xl px-4 py-8">
                                        {item.content}
                                    </div>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        );
                    }

                    // Sinon, un simple lien
                    return (
                        <NavigationMenuItem key={`nav-${index}`}>
                            <Link
                                href={item.href}
                                className={cn(
                                    navigationMenuTriggerStyle(),
                                    'h-10 px-3 text-sm font-medium',
                                )}
                            >
                                {item.title}
                            </Link>
                        </NavigationMenuItem>
                    );
                })}
            </NavigationMenuList>
        </NavigationMenu>
    );
}
