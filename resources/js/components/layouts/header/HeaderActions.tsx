import { usePage } from '@inertiajs/react';
import { useState } from 'react';
// import AppearanceToggle from '@/components/appearance-toogle';
import SearchInput from '@/pages/searchInput';
import { CartButton } from './CartButton';
import { NotificationsDropdown } from './NotificationsDropdown';
import { RegionSelector } from './RegionSelector';

export function HeaderActions() {
    const { auth } = usePage().props;

    const isCartPage = route().current('shop.cart.index');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <>
            {/* Search */}
            <div className="hidden md:block">
                <SearchInput />
            </div>

            {/* Region & Language Selector */}
            <RegionSelector />

            {/* Theme Toggle */}
            {/* <AppearanceToggle /> */}

            {/* Cart - Visible pour tous */}
            {!isCartPage && <CartButton />}

            {/* Notifications - Visible uniquement pour utilisateurs connectés */}
            {auth.user && <NotificationsDropdown />}
        </>
    );
}
