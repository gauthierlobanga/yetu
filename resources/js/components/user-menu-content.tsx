import { Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    HelpCircle,
    Heart,
    LayoutDashboard,
    LogOut,
    Settings,
    ShoppingBag,
    Store,
} from 'lucide-react';
import { useId } from 'react';
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { CanRole } from '@/core/permissions/Can';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { cn } from '@/lib/utils';
import { logout } from '@/routes';
import { edit } from '@/routes/tenant/profile';
import type { User } from '@/types';

type Props = {
    user: User;
};

// ─── Configuration des liens ────────────────────────────────────────────────
const menuLinks = {
    vendor: [
        {
            icon: Store,
            label: 'Tableau de bord',
            href: route('vendor.dashboard'),
        },
        {
            icon: ShoppingBag,
            label: 'Commandes',
            href: route('tenant.orders.index'),
        },
    ],
    customer: [
        {
            icon: LayoutDashboard,
            label: 'Tableau de bord',
            href: route('acheteur.dashboard'),
        },
        {
            icon: ShoppingBag,
            label: 'Mes commandes',
            href: route('tenant.orders.index'),
        },
        {
            icon: Heart,
            label: 'Liste de souhaits',
            href: route('tenant.wishlist.index'),
        },
    ],
    account: [
        { icon: Settings, label: 'Paramètres', href: edit().url },
        {
            icon: HelpCircle,
            label: "Centre d'aide",
            href: route('tenant.page.help'),
        },
    ],
    admin: [
        {
            icon: LayoutDashboard,
            label: 'Administration',
            href: route('filament.admin.pages.dashboard'),
            target: '_blank',
            roles: ['admin', 'super_admin'],
        },
    ],
};

// ─── Composant pour un lien du menu ─────────────────────────────────────────
function MenuLink({
    item,
    onNavigate,
}: {
    item: (typeof menuLinks.vendor)[0] & { roles?: string[] };
    onNavigate: () => void;
}) {
    const content = (
        <DropdownMenuItem asChild className="p-0 focus:bg-transparent cursor-pointer">
            <Link
                href={item.href}
                target={(item as any).target}
                rel={(item as any).target === '_blank' ? 'noopener noreferrer' : undefined}
                onClick={onNavigate}
                className={cn(
                    'group mx-2 my-0.5 flex items-center gap-3 rounded-xl px-3 py-2',
                    'transition-all duration-300 ease-out',
                    'hover:bg-slate-100 hover:text-slate-900',
                    'dark:hover:bg-slate-800/60 dark:hover:text-slate-100',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50'
                )}
            >
                <div
                    className={cn(
                        'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg',
                        'bg-slate-100 text-slate-500 border border-transparent',
                        'transition-all duration-300 ease-out',
                        'group-hover:scale-105 group-hover:bg-white group-hover:text-emerald-600 group-hover:shadow-xs group-hover:border-slate-200/50',
                        'dark:bg-slate-800/80 dark:text-slate-400',
                        'dark:group-hover:bg-slate-700/80 dark:group-hover:text-emerald-400 dark:group-hover:border-slate-600/50',
                    )}
                >
                    <item.icon className="h-4 w-4" strokeWidth={2.5} />
                </div>

                <span className="flex-1 text-[13.5px] font-medium tracking-tight">
                    {item.label}
                </span>

                {!item.roles && (
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400 opacity-0 -translate-x-2 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100 dark:text-slate-500" />
                )}
            </Link>
        </DropdownMenuItem>
    );

    if (item.roles) {
        return <CanRole roles={item.roles}>{content}</CanRole>;
    }

    return content;
}

// ─── Composant principal ────────────────────────────────────────────────────
export function UserMenuContent({ user }: Props) {
    const cleanup = useMobileNavigation();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const id = useId();

    const handleLogout = () => {
        cleanup();
        router.post(logout());
    };

    return (
        <div className="py-1">
            {/* En-tête utilisateur */}
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="mx-2 mb-2 mt-1 rounded-2xl bg-slate-50/80 p-3 ring-1 ring-slate-900/5 transition-all hover:bg-slate-100 dark:bg-slate-900/50 dark:ring-white/10 dark:hover:bg-slate-900/80 backdrop-blur-sm">
                    <UserInfo user={user} showEmail />
                </div>
            </DropdownMenuLabel>

            {/* Section Vendeur */}
            <CanRole roles={['manager', 'super_admin']}>
                <DropdownMenuSeparator className="mx-4 bg-slate-200/60 dark:bg-slate-800/60" />
                <DropdownMenuGroup className="py-1.5">
                    <div className="px-5 pb-1.5 pt-1">
                        <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500">
                            Ma boutique
                        </p>
                    </div>
                    {menuLinks.vendor.map((item) => (
                        <MenuLink
                            key={`vendor-${item.label}`}
                            item={item}
                            onNavigate={cleanup}
                        />
                    ))}
                </DropdownMenuGroup>
            </CanRole>

            {/* Section Client */}
            <DropdownMenuSeparator className="mx-4 bg-slate-200/60 dark:bg-slate-800/60" />
            <DropdownMenuGroup className="py-1.5">
                <div className="px-5 pb-1.5 pt-1">
                    <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500">
                        Espace acheteur
                    </p>
                </div>
                {menuLinks.customer.map((item) => (
                    <MenuLink
                        key={`customer-${item.label}`}
                        item={item}
                        onNavigate={cleanup}
                    />
                ))}
            </DropdownMenuGroup>

            {/* Section Compte */}
            <DropdownMenuSeparator className="mx-4 bg-slate-200/60 dark:bg-slate-800/60" />
            <DropdownMenuGroup className="py-1.5">
                <div className="px-5 pb-1.5 pt-1">
                    <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500">
                        Compte
                    </p>
                </div>
                {menuLinks.account.map((item) => (
                    <MenuLink
                        key={`account-${item.label}`}
                        item={item}
                        onNavigate={cleanup}
                    />
                ))}
            </DropdownMenuGroup>

            {/* Déconnexion */}
            <DropdownMenuSeparator className="mx-4 bg-slate-200/60 dark:bg-slate-800/60" />
            <DropdownMenuItem
                onClick={handleLogout}
                className="p-0 focus:bg-transparent cursor-pointer"
            >
                <button
                    type="button"
                    className={cn(
                        'group mx-2 mt-1 mb-1 flex w-[calc(100%-1rem)] items-center gap-3 rounded-xl px-3 py-2.5',
                        'transition-all duration-300 ease-out',
                        'hover:bg-red-50 hover:text-red-600',
                        'dark:hover:bg-red-500/10 dark:hover:text-red-400',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50'
                    )}
                >
                    <div
                        className={cn(
                            'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg',
                            'bg-red-50 text-red-500 border border-transparent',
                            'transition-all duration-300 ease-out',
                            'group-hover:scale-105 group-hover:bg-white group-hover:shadow-xs group-hover:border-red-200/50',
                            'dark:bg-red-500/10 dark:text-red-400',
                            'dark:group-hover:bg-red-950/50 dark:group-hover:border-red-800/50',
                        )}
                    >
                        <LogOut className="h-4 w-4" strokeWidth={2.5} />
                    </div>

                    <span className="flex-1 text-left text-[13.5px] font-medium tracking-tight">
                        Se déconnecter
                    </span>
                </button>
            </DropdownMenuItem>
        </div>
    );
}
