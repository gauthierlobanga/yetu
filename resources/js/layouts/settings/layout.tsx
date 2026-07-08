import { Link } from '@inertiajs/react';
import { User, ShieldCheck, Palette } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import Heading from '@/components/heading';
import { Separator } from '@/components/ui/separator';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import type { NavItem } from '@/types';

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

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
        { title: 'Profil', href: `${prefix}/profile`, icon: User },
        { title: 'Sécurité', href: `${prefix}/security`, icon: ShieldCheck },
        { title: 'Apparence', href: `${prefix}/appearance`, icon: Palette },
    ];

    return (
        <div className="relative min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            <div className="relative z-10 mx-auto max-w-6xl px-4 py-8">
                <Heading
                    title="Paramètres du compte"
                    description="Gérez vos informations personnelles et vos préférences de sécurité."
                />

                <div className="mt-8 flex flex-col lg:flex-row lg:gap-12">
                    {/* Navigation latérale */}
                    <aside className="w-full shrink-0 lg:w-64">
                        <nav
                            className="sticky top-24 flex flex-col gap-1 bg-transparent p-2 dark:bg-transparent"
                            aria-label="Settings"
                        >
                            {sidebarNavItems.map((item, index) => {
                                const isActive = isCurrentOrParentUrl(
                                    item.href,
                                );
                                const Icon = item.icon;

                                return (
                                    <Link
                                        key={`${toUrl(item.href)}-${index}`}
                                        href={item.href}
                                        className={cn(
                                            'flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                                            isActive
                                                ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-emerald-500/20 dark:bg-slate-800 dark:text-emerald-400 dark:ring-emerald-500/30'
                                                : 'text-slate-600 hover:bg-white/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/80 dark:hover:text-slate-200',
                                        )}
                                    >
                                        {Icon && (
                                            <Icon
                                                className={cn(
                                                    'mr-3 h-5 w-5 transition-colors',
                                                    isActive
                                                        ? 'text-emerald-500 dark:text-emerald-400'
                                                        : 'text-slate-400 group-hover:text-emerald-500 dark:text-slate-500 dark:group-hover:text-emerald-400',
                                                )}
                                            />
                                        )}
                                        {item.title}
                                    </Link>
                                );
                            })}
                        </nav>
                    </aside>

                    <Separator className="my-6 lg:hidden" />

                    {/* Contenu principal */}
                    <div className="min-w-0 flex-1">
                        <div className="rounded-2xl border border-white/40 bg-white/60 p-6 shadow-lg shadow-slate-200/20 backdrop-blur-xl sm:p-8 dark:border-slate-800/60 dark:bg-slate-900/60 dark:shadow-black/20">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
