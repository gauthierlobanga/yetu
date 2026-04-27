//resources/js/components/user-menu-content
// import { Link, router } from '@inertiajs/react';
// import { LogOut, Settings, Shield, ShieldCheck } from 'lucide-react';
// import {
//     DropdownMenuGroup,
//     DropdownMenuItem,
//     DropdownMenuLabel,
//     DropdownMenuSeparator,
// } from '@/components/ui/dropdown-menu';
// import { UserInfo } from '@/components/user-info';
// import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
// import { logout } from '@/routes';
// import { edit } from '@/routes/profile';
// import type { User } from '@/types';
// import { CanRole } from '@/core/permissions/Can';
// import { dashboard } from '@/routes/filament/admin/pages';

// type Props = {
//     user: User;
// };

// export function UserMenuContent({ user }: Props) {
//     const cleanup = useMobileNavigation();

//     const handleLogout = () => {
//         cleanup();
//         router.flushAll();
//     };

//     return (
//         <>
//             <DropdownMenuLabel className="p-0 font-normal">
//                 <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
//                     <UserInfo user={user} showEmail={true} />
//                 </div>
//             </DropdownMenuLabel>
//             <DropdownMenuSeparator />
//             <DropdownMenuGroup>
//                 <DropdownMenuItem asChild>
//                     <Link
//                         className="block w-full cursor-pointer"
//                         href={edit()}
//                         prefetch
//                         onClick={cleanup}
//                     >
//                         <Settings className="mr-2" />
//                         Paramètres
//                     </Link>
//                 </DropdownMenuItem>
//             </DropdownMenuGroup>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem asChild>
//                 <Link
//                     className="block w-full cursor-pointer"
//                     href={logout()}
//                     as="button"
//                     onClick={handleLogout}
//                     data-test="logout-button"
//                 >
//                     <LogOut className="mr-2" />
//                     Log out
//                 </Link>
//             </DropdownMenuItem>
//         </>
//     );
// }

/**
 * La deuxième modification
 */
// import { Link, router } from '@inertiajs/react';
// import {
//     LogOut,
//     Settings,
//     HelpCircle,
//     Package,
//     Heart,
//     CreditCard,
//     Ticket,
//     ShoppingBag,
//     Shield,
//     LayoutDashboard,
// } from 'lucide-react';
// import {
//     DropdownMenuGroup,
//     DropdownMenuItem,
//     DropdownMenuLabel,
//     DropdownMenuSeparator,
// } from '@/components/ui/dropdown-menu';
// import { UserInfo } from '@/components/user-info';
// import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
// import { logout } from '@/routes';
// import { edit } from '@/routes/profile';
// import type { User } from '@/types';
// import { Badge } from '@/components/ui/badge';
// import { Separator } from '@/components/ui/separator';
// import { Can, CanRole } from '@/core/permissions/Can';

// type Props = {
//     user: User;
// };

// interface MenuItem {
//     icon: React.ComponentType<{ className?: string }>;
//     label: string;
//     href: string;
//     badge?: number;
//     permission?: string;
// }

// export function UserMenuContent({ user }: Props) {
//     const cleanup = useMobileNavigation();

//     const handleLogout = () => {
//         cleanup();
//         router.post(logout());
//     };

//     const mainMenuItems: MenuItem[] = [
//         {
//             icon: ShoppingBag,
//             label: 'Mes commandes',
//             href: route('blog.index'),
//         },
//         {
//             icon: Package,
//             label: 'Mes produits',
//             href: route('blog.index'),
//             permission: 'ViewAny:Product',
//         },
//         {
//             icon: CreditCard,
//             label: 'Mes paiements',
//             href: route('blog.index'),
//         },
//         {
//             icon: Heart,
//             label: 'Liste de souhaits',
//             href: route('blog.index'),
//         },
//         {
//             icon: Ticket,
//             label: 'Mes coupons',
//             href: route('blog.index'),
//         },
//     ];

//     const accountMenuItems: MenuItem[] = [
//         {
//             icon: Settings,
//             label: 'Paramètres',
//             href: route('blog.index'),
//         },
//         {
//             icon: HelpCircle,
//             label: "Centre d`'aide",
//             href: route('blog.index'),
//         },
//     ];

//     return (
//         <>
//             {/* En-tête utilisateur */}
//             <DropdownMenuLabel className="p-0 font-normal">
//                 <div className="flex items-center gap-3 px-3 py-3">
//                     <UserInfo user={user} showEmail={true} />
//                 </div>
//             </DropdownMenuLabel>

//             <DropdownMenuSeparator />

//             {/* Menu principal avec permissions */}
//             <DropdownMenuGroup>
//                 {mainMenuItems.map((item) => {
//                     const content = (
//                         <DropdownMenuItem asChild key={item.href}>
//                             <Link
//                                 href={item.href}
//                                 className="flex w-full cursor-pointer items-center justify-between"
//                                 onClick={cleanup}
//                             >
//                                 <div className="flex items-center">
//                                     <item.icon className="mr-2 h-4 w-4" />
//                                     <span>{item.label}</span>
//                                 </div>
//                                 {item.badge && (
//                                     <Badge variant="secondary" className="ml-2">
//                                         {item.badge}
//                                     </Badge>
//                                 )}
//                             </Link>
//                         </DropdownMenuItem>
//                     );

//                     // Si une permission est requise
//                     if (item.permission) {
//                         return (
//                             <Can key={item.href} permission={item.permission}>
//                                 {content}
//                             </Can>
//                         );
//                     }

//                     return content;
//                 })}
//             </DropdownMenuGroup>

//             <DropdownMenuSeparator />

//             {/* Administration - Visible uniquement pour les rôles admin */}
//             <CanRole roles={['admin', 'super_admin']}>
//                 <DropdownMenuGroup>
//                     <DropdownMenuItem asChild>
//                         <Link
//                             href={route('filament.admin.pages.dashboard')}
//                             className="flex w-full cursor-pointer items-center"
//                             onClick={cleanup}
//                         >
//                             <LayoutDashboard className="mr-2 h-4 w-4" />
//                             <span>Administration</span>
//                             <Badge variant="outline" className="ml-2 text-xs">
//                                 Admin
//                             </Badge>
//                         </Link>
//                     </DropdownMenuItem>
//                 </DropdownMenuGroup>
//                 <DropdownMenuSeparator />
//             </CanRole>

//             {/* Gestion du compte */}
//             <DropdownMenuGroup>
//                 {accountMenuItems.map((item) => (
//                     <DropdownMenuItem asChild key={item.href}>
//                         <Link
//                             href={item.href}
//                             className="flex w-full cursor-pointer items-center"
//                             onClick={cleanup}
//                         >
//                             <item.icon className="mr-2 h-4 w-4" />
//                             <span>{item.label}</span>
//                         </Link>
//                     </DropdownMenuItem>
//                 ))}
//             </DropdownMenuGroup>

//             <DropdownMenuSeparator />

//             {/* Permissions spéciales - Gestion des rôles */}
//             <Can permission="Manage Roles">
//                 <DropdownMenuItem asChild>
//                     <Link
//                         href={route('blog.index')}
//                         className="flex w-full cursor-pointer items-center"
//                         onClick={cleanup}
//                     >
//                         <Shield className="mr-2 h-4 w-4" />
//                         <span>Gestion des rôles</span>
//                     </Link>
//                 </DropdownMenuItem>
//             </Can>

//             {/* Déconnexion */}
//             <DropdownMenuItem
//                 onClick={handleLogout}
//                 className="cursor-pointer text-destructive focus:text-destructive"
//             >
//                 <LogOut className="mr-2 h-4 w-4" />
//                 <span>Déconnexion</span>
//             </DropdownMenuItem>
//         </>
//     );
// }

/**
 * La troisième modification
 */
import { useId, Fragment } from 'react';
import { Link, router } from '@inertiajs/react';
import {
    LogOut,
    Settings,
    HelpCircle,
    Heart,
    ShoppingBag,
    Shield,
    LayoutDashboard,
    type LucideIcon,
} from 'lucide-react';
import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';
import type { User } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Can, CanRole } from '@/core/permissions/Can';

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
                href: route('shop.dashboard'),
            },
            {
                key: 'orders',
                icon: ShoppingBag,
                label: 'Mes commandes',
                href: route('shop.orders.index'),
            },
            {
                key: 'wishlist',
                icon: Heart,
                label: 'Liste de souhaits',
                href: route('shop.wishlist.index'),
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
                href: route('nmarket.help'),
            },
        ] as MenuItem[],

        admin: {
            key: 'admin-dashboard',
            icon: LayoutDashboard,
            label: 'Administration',
            href: route('filament.admin.pages.dashboard'),
            roles: ['admin', 'super_admin'],
        } as MenuItem,

        roles: {
            key: 'manage-roles',
            icon: Shield,
            label: 'Gestion des rôles',
            href: route('blog.index'),
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
                <span>Déconnexion</span>
            </DropdownMenuItem>
        </>
    );
}
