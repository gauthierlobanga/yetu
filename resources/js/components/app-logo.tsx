import { usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { cn } from '@/lib/utils';

interface AppLogoProps {
    hideIconOnMobile?: boolean;
}

export default function AppLogo({ hideIconOnMobile }: AppLogoProps = {}) {
    const { name, tenant, app_logo } = usePage().props as any;
    const logoUrl = tenant?.logo_url || app_logo;
    const displayName = tenant?.raison_sociale || name || 'Yetufy';

    return (
        <>
            {logoUrl ? (
                <div className={cn("flex items-center gap-3", hideIconOnMobile && "hidden sm:flex")}>
                    <img
                        src={logoUrl}
                        alt={displayName}
                        className="h-10 w-auto object-contain"
                        onError={(e) => {
                            const el = e.currentTarget;
                            el.style.display = 'none';
                            const fallback = el.parentElement?.querySelector(
                                '.fallback-icon',
                            ) as HTMLElement | null;

                            if (fallback) {
                                fallback.style.display = 'flex';
                            }
                        }}
                    />
                    <div className="fallback-icon hidden aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                        <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
                    </div>
                </div>
            ) : (
                <div className={cn("flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground", hideIconOnMobile && "hidden sm:flex")}>
                    <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
                </div>
            )}
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="text-slate-900 dark:text-slate-100 bg-clip-text text-2xl font-medium">
                    {displayName}
                </span>
            </div>
        </>
    );
}
