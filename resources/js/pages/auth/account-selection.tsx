import { Head, Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowRight,
    ExternalLink,
    LayoutDashboard,
    Mail,
    PanelTopOpen,
    Plus,
    ShieldCheck,
    Store,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Account = {
    name: string;
    email: string;
    avatar_url: string | null;
};

type SelectionTenant = {
    id: string;
    slug: string;
    name: string;
    email?: string | null;
    logo_url?: string | null;
    url?: string;
    admin_url?: string;
    sso_login_url: string;
};

type Props = {
    account: Account;
    tenants: SelectionTenant[];
    is_super_admin?: boolean;
    admin_panel_url?: string;
};

function initials(name: string, email: string): string {
    const source = name.trim() || email;
    const parts = source.split(/\s+/).filter(Boolean);

    return parts
        .map((part) => part.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('');
}

function tenantInitials(name: string): string {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('');
}

function QuickAccess({
    href,
    icon: Icon,
    label,
    description,
    disabled = false,
}: {
    href?: string;
    icon: typeof LayoutDashboard;
    label: string;
    description: string;
    disabled?: boolean;
}) {
    return (
        <a
            href={disabled ? undefined : href}
            aria-disabled={disabled}
            className={cn(
                'group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-white/20 bg-white/30 p-5 backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-emerald-300/40 hover:bg-white/60  dark:border-slate-800/40 dark:bg-slate-900/40 dark:hover:border-emerald-800/40 dark:hover:bg-slate-900/60',
                disabled && 'pointer-events-none opacity-50',
            )}
        >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-emerald-500/30">
                <Icon className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-slate-800 dark:text-white">
                    {label}
                </span>
                <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">
                    {description}
                </span>
            </span>
            <ExternalLink className="h-4 w-4 shrink-0 text-slate-400 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-emerald-600" />
        </a>
    );
}

export default function AccountSelection({
    account,
    tenants,
    is_super_admin,
    admin_panel_url,
}: Props) {
    const hasTenants = tenants.length > 0;
    const primaryTenant = tenants[0];

    const dashboardUrl = primaryTenant?.sso_login_url ?? 'admin/dashboard';
    const panelUrl = is_super_admin
        ? admin_panel_url
        : primaryTenant?.admin_url;
    const pageTitle = hasTenants
        ? 'Selection de compte'
        : 'Creer votre boutique';

    return (
        <main className="relative min-h-svh overflow-hidden bg-slate-50/30 px-4 py-8 sm:px-6 dark:bg-slate-950">
            {/* Arrière‑plan sophistiqué : dégradé mouvant + grille + texture bruit */}
            <div className="pointer-events-none fixed inset-0 -z-10">
                {/* Dégradé de fond */}
                <div className="absolute inset-0 bg-linear-to-br from-white via-slate-50 to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/20" />
                {/* Grille subtile */}
                <div className="absolute inset-0 bg-[image:radial-linear(circle_at_center,#cbd5e1_0.4px,transparent_0.4px)] bg-size-[20px_20px] opacity-30 dark:bg-[image:radial-linear(circle_at_center,#334155_0.4px,transparent_0.4px)] dark:opacity-20" />
                {/* Texture bruit (noise) */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc0IiBudW1PY3RhdmVzPSIzIiAvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNmKSIgb3BhY2l0eT0iMC4wMiIgLz48L3N2Zz4=')] opacity-20 dark:opacity-10" />
            </div>

            <Head title={pageTitle} />

            <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
                {/* Profil */}
                <motion.section
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="flex flex-col items-center text-center"
                >
                    <div className="relative">
                        <Avatar className="h-32 w-32 border-[3px] border-white/70 shadow-2xl ring-2 shadow-black/10 ring-emerald-500/30 backdrop-blur-sm dark:border-slate-800/70 dark:shadow-black/50 dark:ring-emerald-400/20">
                            <AvatarImage
                                src={account.avatar_url ?? undefined}
                                alt={account.name}
                                className="object-cover"
                            />
                            <AvatarFallback className="bg-linear-to-br from-slate-800 to-slate-950 text-3xl font-bold text-white dark:from-emerald-600 dark:to-emerald-800">
                                {initials(account.name, account.email)}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    <h1 className="mt-5 max-w-full truncate text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        {account.name}
                    </h1>
                    <div className="mt-3 flex max-w-full items-center gap-2 rounded-full border border-white/30 bg-white/50 px-4 py-1.5 text-xs font-medium text-slate-600 shadow-sm backdrop-blur-xl dark:border-slate-800/40 dark:bg-slate-900/50 dark:text-slate-400">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                        <span className="truncate">{account.email}</span>
                    </div>
                </motion.section>

                {/* Accès rapides */}
                <motion.section
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.1, ease: 'easeOut' }}
                    className="grid gap-4 sm:grid-cols-2"
                    aria-label="Acces rapides"
                >
                    <QuickAccess
                        href={dashboardUrl}
                        icon={LayoutDashboard}
                        label="Dashboard"
                        description={
                            hasTenants
                                ? 'Ouvrir votre espace vendeur'
                                : 'Creer une boutique'
                        }
                    />
                    <QuickAccess
                        href={panelUrl}
                        icon={PanelTopOpen}
                        label="Panel Filament"
                        description={
                            panelUrl
                                ? 'Administration avancee'
                                : 'Disponible apres creation'
                        }
                        disabled={!panelUrl}
                    />
                </motion.section>

                {/* Boutiques ou état vide */}
                <AnimatePresence mode="wait">
                    {hasTenants ? (
                        <motion.section
                            key="tenants"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.35, ease: 'easeOut' }}
                            className="space-y-5"
                        >
                            <div className="flex items-center justify-between">
                                <h2 className="text-xs font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                                    Vos boutiques
                                </h2>
                                <span className="rounded-full bg-emerald-100/80 px-3 py-1 text-xs font-semibold text-emerald-800 backdrop-blur-sm dark:bg-emerald-900/50 dark:text-emerald-200">
                                    {tenants.length}
                                </span>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                {tenants.map((tenant, index) => (
                                    <motion.article
                                        key={tenant.id}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.35,
                                            delay: index * 0.06,
                                            ease: 'easeOut',
                                        }}
                                        className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/30 p-4 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300/40 hover:bg-white/60 hover:shadow-xl hover:shadow-emerald-500/10 dark:border-slate-800/40 dark:bg-slate-900/40 dark:hover:border-emerald-800/40 dark:hover:bg-slate-900/60"
                                    >
                                        <div className="flex items-start gap-4">
                                            <Avatar className="h-14 w-14 ring-2 ring-white/70 dark:ring-slate-800/70">
                                                <AvatarImage
                                                    src={
                                                        tenant.logo_url ??
                                                        undefined
                                                    }
                                                    alt={tenant.name}
                                                />
                                                <AvatarFallback className="bg-linear-to-br from-emerald-500 to-emerald-700 text-base font-bold text-white shadow-inner">
                                                    {tenantInitials(
                                                        tenant.name,
                                                    )}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-base font-semibold text-slate-800 dark:text-white">
                                                    {tenant.name}
                                                </p>
                                                {tenant.email && (
                                                    <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                                        <Mail className="h-3.5 w-3.5 shrink-0" />
                                                        <span className="truncate">
                                                            {tenant.email}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-4 flex flex-wrap gap-2">
                                            <a
                                                href={tenant.sso_login_url}
                                                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-slate-800 to-slate-900 px-4 text-xs font-semibold text-white shadow-md shadow-slate-900/10 transition-all duration-300 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg hover:shadow-emerald-500/20 dark:from-emerald-600 dark:to-emerald-500 dark:hover:from-emerald-500 dark:hover:to-emerald-400"
                                            >
                                                Dashboard
                                                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                                            </a>
                                            {tenant.admin_url && (
                                                <a
                                                    href={tenant.admin_url}
                                                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/20 px-4 text-xs font-semibold text-slate-700 backdrop-blur-md transition-all duration-300 hover:border-emerald-300/40 hover:text-emerald-700 dark:border-slate-700/40 dark:bg-slate-900/30 dark:text-slate-300 dark:hover:border-emerald-700/40 dark:hover:text-emerald-300"
                                                >
                                                    <PanelTopOpen className="h-3.5 w-3.5" />
                                                    Panel
                                                </a>
                                            )}
                                        </div>
                                    </motion.article>
                                ))}
                            </div>

                            <Button
                                asChild
                                variant="outline"
                                className="h-12 w-full rounded-xl border-dashed border-white/30 bg-white/20 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-emerald-400/40 hover:bg-white/40 hover:text-emerald-700 hover:shadow-md dark:border-slate-700/40 dark:bg-slate-900/30 dark:text-slate-300 dark:hover:border-emerald-600/40 dark:hover:text-emerald-300"
                            >
                                <Link href="/selection-compte/ajouter">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Ajouter une boutique
                                </Link>
                            </Button>
                        </motion.section>
                    ) : (
                        <motion.section
                            key="empty"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.35, ease: 'easeOut' }}
                            className="flex flex-col items-center rounded-3xl border border-white/20 bg-white/30 p-8 text-center shadow-sm backdrop-blur-xl dark:border-slate-800/40 dark:bg-slate-900/40"
                        >
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-100 to-emerald-200 text-emerald-700 shadow-md shadow-emerald-500/10 dark:from-emerald-900/40 dark:to-emerald-800/40 dark:text-emerald-300">
                                <Store className="h-8 w-8" />
                            </div>
                            <h2 className="mt-5 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                Aucune boutique pour le moment
                            </h2>
                            <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500 dark:text-slate-400">
                                Creez votre premiere boutique pour acceder au
                                dashboard et au panel Filament.
                            </p>
                            <Button
                                asChild
                                className="mt-6 h-12 w-full rounded-xl bg-linear-to-r from-slate-800 to-slate-900 text-white shadow-md shadow-slate-900/10 transition-all duration-300 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg hover:shadow-emerald-500/20 dark:from-emerald-600 dark:to-emerald-500 dark:hover:from-emerald-500 dark:hover:to-emerald-400"
                            >
                                <Link href="/devenir-vendeur">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Creer une boutique
                                </Link>
                            </Button>
                        </motion.section>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
