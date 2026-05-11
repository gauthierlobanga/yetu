/* eslint-disable @typescript-eslint/no-unused-vars */
//resources/js/components/user-menu-content
/**
 * La troisième modification
 */
import { Link, router } from '@inertiajs/react';
import { ro } from 'date-fns/locale';
import {
    LogOut,
    Settings,
    HelpCircle,
    Heart,
    ShoppingBag,
    Shield,
    LayoutDashboard,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useId, Fragment } from 'react';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { Can, CanRole } from '@/core/permissions/Can';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';
import type { User } from '@/types';
type Props = {
    user: User;
};

interface MenuItem {
    key: string;
    icon: LucideIcon;
    label: string;
    href: string;
    badge?: number;
    permission?: string;
    roles?: string[];
    variant?: 'default' | 'destructive';
    target?: string;
}

// Composant helper pour éviter la duplication de code
const MenuItemComponent = ({
    item,
    onClick,
}: {
    item: MenuItem;
    onClick: () => void;
}) => (
    <DropdownMenuItem
        asChild
        className={
            item.variant === 'destructive'
                ? 'text-destructive focus:text-destructive'
                : ''
        }
    >
        <Link
            href={item.href}
            target={item.target}
            rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
            className="flex w-full cursor-pointer items-center justify-between"
            onClick={onClick}
        >
            <div className="flex items-center">
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.label}</span>
            </div>
            {item.badge && (
                <Badge variant="secondary" className="ml-2">
                    {item.badge}
                </Badge>
            )}
        </Link>
    </DropdownMenuItem>
);

export function UserMenuContent({ user }: Props) {
    const cleanup = useMobileNavigation();
    const id = useId();

    const handleLogout = () => {
        cleanup();
        router.post(logout());
    };

    // Configuration centralisée des items du menu
    const menuConfig = {
        main: [
            {
                key: 'dashboard',
                icon: LayoutDashboard,
                label: 'Mon compte',
                href: route('dashboard'),
            },
            {
                key: 'dashboard-vendor',
                icon: LayoutDashboard,
                label: 'Ma boutique',
                href: route('vendor.dashboard'),
            },
            {
                key: 'orders',
                icon: ShoppingBag,
                label: 'Mes commandes',
                href: route('tenant.orders.index'),
            },
            {
                key: 'wishlist',
                icon: Heart,
                label: 'Liste de souhaits',
                href: route('tenant.wishlist.index'),
            },
        ] as MenuItem[],

        account: [
            {
                key: 'settings',
                icon: Settings,
                label: 'Paramètres',
                href: edit(),
            },
            {
                key: 'help',
                icon: HelpCircle,
                label: "Centre d'aide",
                href: route('tenant.page.help'),
            },
        ] as MenuItem[],

        admin: {
            key: 'admin-dashboard',
            icon: LayoutDashboard,
            label: 'Administration',
            href: route('filament.admin.pages.dashboard'),
            roles: ['admin', 'super_admin'],
            target: '_blank',
        } as MenuItem,

        roles: {
            key: 'manage-roles',
            icon: Shield,
            label: 'Gestion des rôles',
            href: route('filament.admin.resources.shield.roles.index'),
            permission: 'Manage Roles',
        } as MenuItem,
    };

    // Fonction de rendu conditionnel avec permissions
    const renderMenuItem = (item: MenuItem) => {
        const element = (
            <MenuItemComponent
                key={`${id}-${item.key}`}
                item={item}
                onClick={cleanup}
            />
        );

        if (item.permission) {
            return (
                <Can key={`${id}-can-${item.key}`} permission={item.permission}>
                    {element}
                </Can>
            );
        }

        if (item.roles) {
            return (
                <CanRole key={`${id}-role-${item.key}`} roles={item.roles}>
                    {element}
                </CanRole>
            );
        }

        return element;
    };

    return (
        <>
            {/* En-tête utilisateur */}
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-3 px-3 py-3">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {/* Menu principal */}
            <DropdownMenuGroup>
                {menuConfig.main.map(renderMenuItem)}
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* Administration */}
            {renderMenuItem(menuConfig.admin)}
            {menuConfig.admin.roles && <DropdownMenuSeparator />}

            {/* Gestion du compte */}
            <DropdownMenuGroup>
                {menuConfig.account.map(renderMenuItem)}
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* Gestion des rôles */}
            {renderMenuItem(menuConfig.roles)}

            {/* Déconnexion */}
            <DropdownMenuItem
                key={`${id}-logout`}
                onClick={handleLogout}
                className="cursor-pointer text-destructive focus:text-destructive"
            >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Se déconnecter</span>
            </DropdownMenuItem>
        </>
    );
}
