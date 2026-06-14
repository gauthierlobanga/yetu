import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import type { NavItem } from '@/types';
import { User, ShieldCheck, Palette } from 'lucide-react';

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
        <div className="px-4 py-8 max-w-6xl mx-auto">
            <Heading
                title="Paramètres du compte"
                description="Gérez vos informations personnelles et vos préférences de sécurité."
            />

            <div className="flex flex-col lg:flex-row lg:space-x-12 mt-8">
                <aside className="w-full lg:w-64 shrink-0">
                    <nav
                        className="flex flex-col space-y-2 sticky top-8"
                        aria-label="Settings"
                    >
                        {sidebarNavItems.map((item, index) => {
                            const isActive = isCurrentOrParentUrl(item.href);
                            return (
                                <Link
                                    key={`${toUrl(item.href)}-${index}`}
                                    href={item.href}
                                    className={cn(
                                        'flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200',
                                        isActive 
                                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 shadow-sm ring-1 ring-emerald-500/20' 
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                                    )}
                                >
                                    {item.icon && (
                                        <item.icon className={cn('h-5 w-5 mr-3', isActive ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500')} />
                                    )}
                                    {item.title}
                                </Link>
                            )
                        })}
                    </nav>
                </aside>

                <Separator className="my-8 lg:hidden" />

                <div className="flex-1 min-w-0">
                    <div className="space-y-12">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
