import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import SearchInputPage from '@/pages/searchInput';
import AppearanceToogle from './appearance-toogle';
import { Bell, ShieldCheck } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { CanRole } from '@/core/permissions/Can';
import { dashboard as admin } from '@/routes/filament/admin/pages/index';
import { Badge } from './ui/badge';

export function SiteHeader() {
    return (
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            {/* Hero Section moderne */}
            <div className="flex w-full items-center gap-1 px-4 py-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                />
                <Link
                    href={dashboard()}
                    className="cursor-pointer text-base font-medium"
                >
                    <h1>Dashboard</h1>
                </Link>
                <div className="ml-auto flex items-center gap-2">
                    <SearchInputPage />
                    <div className="relative flex items-center space-x-1">
                        <CanRole roles="super_admin">
                            <div className="relative flex items-center space-x-1 rounded-lg py-2.5">
                                <ShieldCheck className="mr-2 h-8 w-8" />
                                <Link
                                    className="block w-full cursor-pointer text-sm"
                                    href={admin()}
                                >
                                    Admin
                                </Link>
                            </div>
                        </CanRole>
                        <Button
                            variant="ghost"
                            asChild
                            className="hidden h-10 w-10 bg-transparent text-amber-500 hover:bg-transparent lg:flex dark:hover:bg-transparent"
                        >
                            <Bell className="h-10 w-10 cursor-pointer text-amber-500" />
                        </Button>
                        <AppearanceToogle />
                    </div>
                </div>
            </div>
        </header>
    );
}
