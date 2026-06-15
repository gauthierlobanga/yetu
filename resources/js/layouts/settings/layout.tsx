import { Link } from '@inertiajs/react';
import { User, ShieldCheck, Palette } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import type { NavItem } from '@/types';

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    const pathname = window.location.pathname;
    let prefix = '';

    if (pathname.startsWith('/acheteur/settings')) {
        prefix = '/acheteur/settings';
    } else if (pathname.startsWith('/tenant/settings')) {
        prefix = '/tenant/settings';
    } else if (pathname.startsWith('/settings')) {
        prefix = '/settings';
    }

    const sidebarNavItems: NavItem[] = [
        {
            title: 'Profil',
            href: `${prefix}/profile`,
            icon: User,
        },
        {
            title: 'Sécurité',
            href: `${prefix}/security`,
            icon: ShieldCheck,
        },
        {
            title: 'Apparence',
            href: `${prefix}/appearance`,
            icon: Palette,
        },
    ];

    return (
        <div className="mx-auto max-w-6xl px-4 py-8">
            <Heading
                title="Paramètres du compte"
                description="Gérez vos informations personnelles et vos préférences de sécurité."
            />

            <div className="mt-8 flex flex-col lg:flex-row lg:space-x-12">
                <aside className="w-full shrink-0 lg:w-64">
                    <nav
                        className="sticky top-8 flex flex-col space-y-2"
                        aria-label="Settings"
                    >
                        {sidebarNavItems.map((item, index) => {
                            const isActive = isCurrentOrParentUrl(item.href);

                            return (
                                <Link
                                    key={`${toUrl(item.href)}-${index}`}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                                        isActive
                                            ? 'bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400'
                                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200',
                                    )}
                                >
                                    {item.icon && (
                                        <item.icon
                                            className={cn(
                                                'mr-3 h-5 w-5',
                                                isActive
                                                    ? 'text-emerald-500 dark:text-emerald-400'
                                                    : 'text-slate-400 dark:text-slate-500',
                                            )}
                                        />
                                    )}
                                    {item.title}
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                <Separator className="my-8 lg:hidden" />

                <div className="min-w-0 flex-1">
                    <div className="space-y-12">{children}</div>
                </div>
            </div>
        </div>
    );
}
