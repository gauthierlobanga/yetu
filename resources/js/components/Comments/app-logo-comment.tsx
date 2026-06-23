import { usePage } from '@inertiajs/react';

export default function AppLogoComment() {
    const { name, tenant, app_logo } = usePage().props as any;
    const logoUrl = tenant?.logo_url || app_logo;
    const displayName = tenant?.raison_sociale || name || 'Yetufy';

    return (
        <>
            {logoUrl ? (
                    <img
                        src={logoUrl}
                        alt={displayName}
                        className="h-8 w-auto object-contain"
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

            ) : (
                <img
                    src="https://ui-avatars.com/api/?name=User&background=random"
                    alt="Vous"
                    className="mt-0.5 h-10 w-10 shrink-0 rounded-full object-cover shadow-sm ring-2 ring-white dark:ring-slate-900"
                />
            )}
        </>
    );
}
