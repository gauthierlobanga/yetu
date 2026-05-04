// import { Link } from '@inertiajs/react';
// import { LogIn, UserPlus } from 'lucide-react';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Button } from '@/components/ui/button';
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { UserMenuContent } from '@/components/user-menu-content';
// import { useInitials } from '@/hooks/use-initials';
// import { register } from '@/routes';
// import type { User } from '@/types';

// interface UserNavigationProps {
//     user: User | null;
// }

// export function UserNavigation({ user }: UserNavigationProps) {
//     const getInitials = useInitials();

//     if (!user) {
//         return (
//             <div className="flex items-center space-x-2">
//                 <Button
//                     variant="ghost"
//                     size="sm"
//                     asChild
//                     className="hidden sm:flex"
//                 >
//                     <Link href={login()}>
//                         <LogIn className="mr-2 h-4 w-4" />
//                         Connexion
//                     </Link>
//                 </Button>
//                 <Button size="sm" asChild>
//                     <Link href={register()}>
//                         <UserPlus className="mr-2 h-4 w-4" />
//                         <span className="hidden sm:inline">Inscription</span>
//                         <span className="sm:hidden">S'inscrire</span>
//                     </Link>
//                 </Button>
//             </div>
//         );
//     }

//     const avatarUrl = (() => {
//         if (!user?.avatar_url) {
//             return undefined;
//         }

//         const url = String(user.avatar_url);

//         return url.startsWith('http') || url.startsWith('/') ? url : undefined;
//     })();

//     const userName =
//         user?.name && typeof user.name === 'string' ? user.name : 'Utilisateur';
//     const userInitials = getInitials(userName);

//     return (
//         <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//                 <Button
//                     variant="ghost"
//                     className="relative h-9 w-9 rounded-full p-0"
//                 >
//                     <Avatar className="h-9 w-9">
//                         {avatarUrl ? (
//                             <AvatarImage src={avatarUrl} alt={userName} />
//                         ) : (
//                             <AvatarFallback className="bg-primary/10 text-primary">
//                                 {userInitials}
//                             </AvatarFallback>
//                         )}
//                     </Avatar>
//                 </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent className="w-64" align="end" forceMount>
//                 <UserMenuContent user={user} />
//             </DropdownMenuContent>
//         </DropdownMenu>
//     );
// }
// resources/js/components/UserNavigation.tsx
import { Link } from '@inertiajs/react';
import { LogIn } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import type { User } from '@/types';
import tenant from '@/routes/tenant';

interface UserNavigationProps {
    user: User | null;
}

export function UserNavigation({ user }: UserNavigationProps) {
    const getInitials = useInitials();

    if (!user) {
        return (
            <div className="flex items-center space-x-2">
                {/* Sur tenant : connexion uniquement (pas d’inscription) */}
                <Button variant="ghost" size="sm" asChild>
                    <Link href={tenant.login()}>
                        {/* <Link href={route('tenant.login')}> */}
                        <LogIn className="mr-2 h-4 w-4" />
                        Connexion
                    </Link>
                </Button>
            </div>
        );
    }

    const avatarUrl = (() => {
        if (!user?.avatar_url) {
            return undefined;
        }

        const url = String(user.avatar_url);

        return url.startsWith('http') || url.startsWith('/') ? url : undefined;
    })();

    const userName =
        user?.name && typeof user.name === 'string' ? user.name : 'Utilisateur';
    const userInitials = getInitials(userName);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full p-0"
                >
                    <Avatar className="h-9 w-9">
                        {avatarUrl ? (
                            <AvatarImage src={avatarUrl} alt={userName} />
                        ) : (
                            <AvatarFallback className="bg-primary/10 text-primary">
                                {userInitials}
                            </AvatarFallback>
                        )}
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end" forceMount>
                <UserMenuContent user={user} />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
