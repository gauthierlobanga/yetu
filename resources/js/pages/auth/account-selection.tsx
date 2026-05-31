import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Plus, ShieldCheck, Store } from 'lucide-react';

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';

type Account = {
    name: string;
    email: string;
    avatar_url: string;
};

type Tenant = {
    id: string;
    slug: string;
    name: string;
    email?: string | null;
    logo_url?: string | null;
    dashboard_url: string;
};

type Props = {
    account: Account;
    tenants: Tenant[];
};

function initials(name: string, email: string): string {
    const source = name.trim() || email;
    const parts = source.split(/\s+/).filter(Boolean);

    return parts
        .map((part) => part.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('');
}

export default function AccountSelection({ account, tenants }: Props) {
    return (
        <AuthLayout
            title="Choisir un compte"
            description="Retrouvez votre espace vendeur ou créez un nouveau compte pour une autre boutique."
        >
            <Head title="Choisir un compte" />

            <div className="space-y-5">
                <div className="flex justify-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-emerald-700 backdrop-blur-xl dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Session reconnue
                    </div>
                </div>

                <div className="space-y-3">
                    {tenants.map((tenant, index) => (
                        <motion.div
                            key={tenant.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                delay: index * 0.05,
                                duration: 0.3,
                                ease: 'easeOut',
                            }}
                        >
                            <Link
                                href={`/selection-compte/${tenant.slug}/continuer`}
                                className="group flex w-full items-center gap-4 rounded-2xl border border-slate-200/80 bg-white/80 p-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-white hover:shadow-lg hover:shadow-emerald-900/8 focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:outline-none dark:border-slate-800 dark:bg-slate-950/50 dark:hover:border-emerald-700 dark:hover:bg-slate-950"
                            >
                                <Avatar className="size-14 ring-4 ring-emerald-500/10">
                                    <AvatarImage
                                        src={account.avatar_url}
                                        alt={account.name}
                                    />
                                    <AvatarFallback className="bg-emerald-600 text-base font-semibold text-white">
                                        {initials(account.name, account.email)}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="min-w-0 flex-1">
                                    <div className="flex min-w-0 items-center gap-2">
                                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                                            {account.name}
                                        </p>
                                    </div>

                                    <div className="mt-1 flex min-w-0 items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                        <Mail className="h-3.5 w-3.5 shrink-0" />
                                        <span className="truncate">
                                            {account.email}
                                        </span>
                                    </div>

                                    <div className="mt-3 inline-flex max-w-full items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                                        <Store className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                        <span className="truncate">
                                            {tenant.name}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white transition-transform duration-300 group-hover:translate-x-1">
                                    <ArrowRight className="h-4 w-4" />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <Button
                    asChild
                    variant="outline"
                    className="h-11 w-full rounded-2xl border-slate-200 bg-white/70 text-sm font-semibold hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-950/40 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/20 dark:hover:text-emerald-300"
                >
                    <Link
                        href="/selection-compte/ajouter"
                        method="post"
                        as="button"
                        type="button"
                    >
                        <Plus className="h-4 w-4" />
                        Ajouter un compte
                    </Link>
                </Button>
            </div>
        </AuthLayout>
    );
}
