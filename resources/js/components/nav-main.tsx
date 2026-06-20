import { Link, usePage } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types';

// ---------- Type local pour UrlMethodPair (à importer si déjà défini) ----------
type UrlMethodPair = {
    url: string;
    method?: string;
};

// ---------- Helpers ----------
const getHrefString = (
    href: string | UrlMethodPair | undefined,
): string | null => {
    if (!href) {
        return null;
    }

    return typeof href === 'string' ? href : href.url;
};

const isHrefActive = (
    currentUrl: string,
    href: string | UrlMethodPair | undefined,
): boolean => {
    const hrefStr = getHrefString(href);

    if (!hrefStr) {
        return false;
    }

    return currentUrl === hrefStr || currentUrl.startsWith(hrefStr + '/');
};

// ---------- Composant ----------
export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { url: currentUrl } = usePage(); // ← Correction : usePage().url, pas props

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarMenu>
                {items.map((item) => {
                    const active = isHrefActive(currentUrl, item.href);
                    const hrefStr = getHrefString(item.href);

                    // Élément sans URL (label désactivé)
                    if (!hrefStr) {
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    className="h-11 rounded-xl px-3 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                                    disabled
                                    size="lg"
                                >
                                    {item.icon && (
                                        <item.icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                    )}
                                    <span>{item.title}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    }

                    return (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                isActive={active}
                                tooltip={{ children: item.title }}
                                size="lg"
                                className={cn(
                                    'h-11 rounded-xl px-3 transition-all duration-200',
                                    'hover:bg-emerald-50 dark:text-slate-400 dark:hover:bg-slate-800/60 hover:text-emerald-700 ',
                                    active &&
                                        'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
                                )}

                            >
                                <Link
                                    className={cn(
                                        'group flex items-center rounded-lg px-3 py-2 text-sm transition-all duration-200',
                                        ' hover:bg-slate-100 ',
                                        'dark:hover:text-emerald-300',
                                    )}
                                    href={hrefStr}
                                    prefetch
                                >
                                    {item.icon && (
                                        <item.icon className="h-5 w-5" />
                                    )}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
