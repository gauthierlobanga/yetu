import { Link, usePage } from '@inertiajs/react';
import { List, Menu } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import AppLogoIcon from '@/components/app-logo-icon';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
// import { accueil } from '@/routes/nmarket';
import type { BreadcrumbItem, NavItem } from '@/types';
import { HeaderActions } from './HeaderActions';
import { MainNavigation } from './MainNavigation';
import { MobileNavigation } from './MobileNavigation';
import { UserNavigation } from './UserNavigation';

type Props = {
    breadcrumbs?: BreadcrumbItem[];
};

export const mainNavItems: NavItem[] = [
    {
        title: 'Boutiques',
        href: route('shop.cart.index'),
    },
    {
        title: 'Services',
        href: route('shop.wishlist.index'),
    },
    {
        title: 'Contact',
        href: route('contact.index'),
    },
    {
        title: 'À propos',
        href: route('nmarket.about'),
    },
    {
        title: 'Blog',
        href: route('blog.index'),
    },
];

export const mainNavSubItems: NavItem[] = [
    {
        title: 'Toutes les catégories',
        href: '',
        icon: List,
    },
    {
        title: 'Protection des commandes',
        href: route('blog.index'),
    },
    {
        title: 'Centre des acheteurs',
        href: route('contact.index'),
    },
    {
        title: 'Fournisseurs',
        href: route('nmarket.about'),
    },
    {
        title: 'Fabricants Verified',
        href: route('nmarket.about'),
    },
];

export function AppHeader({ breadcrumbs = [] }: Props) {
    const page = usePage();
    const { auth } = page.props;

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
                <div className="mx-auto flex h-16 items-center px-14 md:min-w-5xl">
                    {/* Mobile Menu */}
                    <div className="mr-4 lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9"
                                    aria-label="Menu"
                                >
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                aria-describedby={undefined}
                                side="left"
                                className="w-72 p-0"
                            >
                                <SheetHeader className="border-b p-4">
                                    <SheetTitle className="flex items-center">
                                        <AppLogoIcon className="mr-2 h-6 w-6" />
                                        <span>Menu</span>
                                    </SheetTitle>
                                </SheetHeader>
                                <MobileNavigation items={mainNavItems} />
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Logo */}
                    <Link
                        href="/"
                        prefetch
                        className="flex items-center space-x-2 transition-opacity hover:opacity-80"
                    >
                        <AppLogo />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="ml-6 hidden lg:block">
                        <MainNavigation items={mainNavItems} />
                    </div>

                    {/* Right Section */}
                    <div className="ml-auto flex items-center space-x-2">
                        <HeaderActions />
                        <UserNavigation user={auth.user} />
                    </div>
                </div>
                <div className="mx-auto flex h-10 items-center px-5 md:min-w-5xl">
                    {/* Mobile Menu */}
                    <div className="mr-4 lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9"
                                    aria-label="Menu"
                                >
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                aria-describedby={undefined}
                                side="left"
                                className="w-72 p-0"
                            >
                                <SheetHeader className="border-b p-4">
                                    <SheetTitle className="flex items-center">
                                        <AppLogoIcon className="mr-2 h-6 w-6" />
                                        <span>Menu</span>
                                    </SheetTitle>
                                </SheetHeader>
                                <MobileNavigation items={mainNavItems} />
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="ml-6 hidden lg:block">
                        <MainNavigation items={mainNavSubItems} />
                    </div>
                </div>
            </header>

            {/* Breadcrumbs */}
            {breadcrumbs.length > 1 && (
                <div className="container mx-auto border-b border-border/40 px-4 sm:px-6 lg:px-8">
                    <div className="flex h-10 items-center">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}

// resources/js/layouts/AppHeader.tsx;
// import { Link, usePage } from '@inertiajs/react';
// import { useState, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   Menu,
//   Search,
//   ChevronDown,
//   MapPin,
//   User,
//   Heart,
//   ShoppingCart,
//   Globe,
//   ShieldCheck,
//   Package,
//   Sparkles,
//   Camera,
//   X,
// } from 'lucide-react';
// import AppLogo from '@/components/app-logo';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from '@/components/ui/sheet';
// import {
//   HoverCard,
//   HoverCardContent,
//   HoverCardTrigger,
// } from '@/components/ui/hover-card';
// import { Badge } from '@/components/ui/badge';
// import { CartButton } from './CartButton';
// import { UserNavigation } from './UserNavigation';
// import { MegaMenu } from './MegaMenu';
// import { MobileNavigation } from './MobileNavigation';
// import { accueil } from '@/routes/nmarket';
// import type { BreadcrumbItem, NavItem } from '@/types';
// import type { HeaderCategory } from '@/types/ecommerce/products';

// type Props = {
//   breadcrumbs?: BreadcrumbItem[];
// };

// export const mainNavItems: NavItem[] = [
//   { title: 'Accueil', href: accueil() },
//   { title: 'Boutique', href: route('shop.products.index') },
//   { title: 'Blog', href: route('blog.index') },
//   { title: 'À propos', href: route('nmarket.about') },
//   { title: 'Contact', href: route('contact.index') },
// ];

// export function AppHeader({ breadcrumbs = [] }: Props) {
//   const { props } = usePage<{ auth: any; headerData?: { categories: HeaderCategory[] } }>();
//   const { auth } = props;
//   const headerData = props.headerData;
//   const categories = headerData?.categories ?? [];

//   const [megaMenuOpen, setMegaMenuOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
//   const searchInputRef = useRef<HTMLInputElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       window.location.href = route('shop.products.index', { search: searchQuery });
//     }
//   };

//   const handleImageSearch = () => {
//     fileInputRef.current?.click();
//   };

//   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     // Implémentez l'upload et la recherche par image (OCR) comme précédemment
//     // ...
//   };

//   return (
//     <>
//       <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
//         {/* Barre supérieure fine */}
//         <div className="hidden border-b border-border/40 bg-muted/30 px-4 py-1.5 text-xs lg:block">
//           <div className="container mx-auto flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <span className="flex items-center gap-1 text-muted-foreground">
//                 <MapPin className="h-3 w-3" />
//                 Livraison :
//               </span>
//               <button className="flex items-center gap-1 font-medium hover:text-primary">
//                 <span className="fi fi-cd rounded-sm" /> CD
//                 <ChevronDown className="h-3 w-3" />
//               </button>
//               <span className="text-muted-foreground">Français - CDF</span>
//             </div>
//             <div className="flex items-center gap-4">
//               <Link href={route('shop.orders.index')} className="hover:text-primary">
//                 Mes commandes
//               </Link>
//               <Link href="#" className="hover:text-primary">
//                 Protection
//               </Link>
//               <Link href="#" className="hover:text-primary">
//                 Aide
//               </Link>
//               <Link href="#" className="hover:text-primary">
//                 Devenir vendeur
//               </Link>
//               {!auth.user ? (
//                 <>
//                   <Link href={route('login')} className="hover:text-primary">
//                     Se connecter
//                   </Link>
//                   <Link href={route('register')} className="hover:text-primary">
//                     Créer un compte
//                   </Link>
//                 </>
//               ) : (
//                 <UserNavigation user={auth.user} />
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Barre principale */}
//         <div className="container mx-auto flex h-16 items-center gap-2 px-4 sm:gap-4 sm:px-6">
//           {/* Menu mobile */}
//           <div className="lg:hidden">
//             <Sheet>
//               <SheetTrigger asChild>
//                 <Button variant="ghost" size="icon" className="h-9 w-9">
//                   <Menu className="h-5 w-5" />
//                 </Button>
//               </SheetTrigger>
//               <SheetContent side="left" className="w-72 p-0">
//                 <SheetHeader className="border-b p-4">
//                   <SheetTitle>Menu</SheetTitle>
//                 </SheetHeader>
//                 <MobileNavigation items={mainNavItems} />
//               </SheetContent>
//             </Sheet>
//           </div>

//           {/* Logo */}
//           <Link href={accueil()} className="flex-shrink-0">
//             <AppLogo className="h-8 w-auto sm:h-10" />
//           </Link>

//           {/* Bouton "Toutes les catégories" avec méga-menu */}
//           <div
//             className="relative hidden lg:block"
//             onMouseEnter={() => setMegaMenuOpen(true)}
//             onMouseLeave={() => setMegaMenuOpen(false)}
//           >
//             <button className="flex items-center gap-1 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
//               <Menu className="h-4 w-4" />
//               Catégories
//               <ChevronDown className="h-3 w-3" />
//             </button>
//             <AnimatePresence>
//               {megaMenuOpen && (
//                 <motion.div
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: 10 }}
//                   transition={{ duration: 0.2 }}
//                   className="absolute left-0 top-full mt-1 w-[900px] rounded-lg border bg-background p-6 shadow-xl"
//                   onMouseEnter={() => setMegaMenuOpen(true)}
//                   onMouseLeave={() => setMegaMenuOpen(false)}
//                 >
//                   <MegaMenu categories={categories} />
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>

//           {/* Barre de recherche */}
//           <form onSubmit={handleSearch} className="hidden flex-1 px-2 sm:block sm:px-4">
//             <div className="relative flex w-full max-w-2xl items-center">
//               <Input
//                 ref={searchInputRef}
//                 type="search"
//                 placeholder="Rechercher un produit, une marque..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 onFocus={() => setShowSearchSuggestions(true)}
//                 onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
//                 className="h-10 w-full rounded-full border-border bg-muted/50 pr-24 text-sm focus-visible:ring-primary"
//               />
//               <Button
//                 type="submit"
//                 size="sm"
//                 className="absolute right-1 h-8 rounded-full bg-primary px-4 text-primary-foreground hover:bg-primary/90"
//               >
//                 <Search className="h-4 w-4" />
//                 <span className="ml-1 hidden sm:inline">Rechercher</span>
//               </Button>
//               <Button
//                 type="button"
//                 variant="ghost"
//                 size="icon"
//                 className="absolute right-12 h-8 w-8 sm:right-16"
//                 onClick={handleImageSearch}
//               >
//                 <Camera className="h-4 w-4" />
//               </Button>
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 onChange={handleImageUpload}
//                 accept="image/*"
//                 className="hidden"
//               />

//               {/* Suggestions de recherche (simplifiées) */}
//               {showSearchSuggestions && searchQuery && (
//                 <div className="absolute left-0 right-0 top-full z-20 mt-1 rounded-lg border bg-background p-2 shadow-lg">
//                   <p className="px-2 py-1 text-xs text-muted-foreground">Suggestions</p>
//                   {['Smartphone', 'Ordinateur portable', 'Écouteurs'].map((s) => (
//                     <button
//                       key={s}
//                       onClick={() => {
//                         setSearchQuery(s);
//                         window.location.href = route('shop.products.index', { search: s });
//                       }}
//                       className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted"
//                     >
//                       <Search className="h-3.5 w-3.5 text-muted-foreground" />
//                       {s}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </form>

//           {/* Actions utilisateur */}
//           <div className="flex flex-shrink-0 items-center gap-1 sm:gap-2">
//             <Button variant="ghost" size="icon" className="h-9 w-9 sm:hidden" asChild>
//               <Link href={route('shop.products.index')}>
//                 <Search className="h-5 w-5" />
//               </Link>
//             </Button>
//             <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
//               <Link href={route('shop.wishlist.index')}>
//                 <Heart className="h-5 w-5" />
//               </Link>
//             </Button>
//             <CartButton />
//             {!auth.user ? (
//               <div className="hidden lg:flex lg:items-center lg:gap-1">
//                 <Button variant="ghost" size="sm" asChild>
//                   <Link href={route('login')}>
//                     <User className="mr-1 h-4 w-4" />
//                     Connexion
//                   </Link>
//                 </Button>
//                 <Button size="sm" asChild>
//                   <Link href={route('register')}>S'inscrire</Link>
//                 </Button>
//               </div>
//             ) : (
//               <UserNavigation user={auth.user} />
//             )}
//           </div>
//         </div>

//         {/* Navigation secondaire (onglets) */}
//         <div className="hidden border-t border-border/40 bg-background lg:block">
//           <div className="container mx-auto flex items-center gap-1 px-4 sm:px-6">
//             <Link href="#" className="px-3 py-2 text-sm font-medium text-primary border-b-2 border-primary">
//               <Sparkles className="mr-1 inline h-4 w-4" />
//               AI Mode
//             </Link>
//             <Link href={route('shop.products.index')} className="px-3 py-2 text-sm font-medium hover:text-primary">
//               Produits
//             </Link>
//             <Link href="#" className="px-3 py-2 text-sm font-medium hover:text-primary">
//               Marques
//             </Link>
//             <Link href="#" className="px-3 py-2 text-sm font-medium hover:text-primary">
//               Tendance
//             </Link>
//             <Link href="#" className="px-3 py-2 text-sm font-medium hover:text-primary">
//               Offres
//             </Link>
//           </div>
//         </div>
//       </header>

//       {/* Breadcrumbs */}
//       {breadcrumbs.length > 1 && (
//         <div className="container mx-auto border-b border-border/40 px-4 sm:px-6">
//           <div className="flex h-10 items-center">
//             <Breadcrumbs breadcrumbs={breadcrumbs} />
//           </div>
//         </div>
//       )}
//     </>
//   );
// }
