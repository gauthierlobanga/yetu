import { Head, Link } from '@inertiajs/react';
import {
    Award,
    Heart,
    LayoutDashboard,
    MapPinned,
    RotateCcw,
    ShoppingBag,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MainLayout from '@/layouts/main-layout';

type NavKey =
    | 'dashboard'
    | 'orders'
    | 'wishlist'
    | 'loyalty'
    | 'addresses'
    | 'returns';

interface StatItem {
    label: string;
    value: string | number;
    helper?: string;
}

interface Props {
    headTitle: string;
    title: string;
    description: string;
    active: NavKey;
    stats?: StatItem[];
    children: ReactNode;
}

const sections: Array<{
    key: NavKey;
    label: string;
    href: string;
    icon: LucideIcon;
}> = [
    {
        key: 'dashboard',
        label: 'Vue d’ensemble',
        href: route('tenant.dashboard'),
        icon: LayoutDashboard,
    },
    {
        key: 'orders',
        label: 'Mes commandes',
        href: route('tenant.orders.index'),
        icon: ShoppingBag,
    },
    {
        key: 'wishlist',
        label: 'Wishlist',
        href: route('tenant.wishlist.index'),
        icon: Heart,
    },
    {
        key: 'loyalty',
        label: 'Fidelite',
        href: route('tenant.loyalty.index'),
        icon: Award,
    },
    {
        key: 'addresses',
        label: 'Adresses',
        href: route('tenant.addresses.index'),
        icon: MapPinned,
    },
    {
        key: 'returns',
        label: 'Retours',
        href: route('tenant.returns.index'),
        icon: RotateCcw,
    },
];

export default function ShopAccountShell({
    headTitle,
    title,
    description,
    active,
    stats = [],
    children,
}: Props) {
    return (
        <MainLayout>
            <Head title={headTitle} />

            <div className="mx-auto max-w-7xl px-4 py-8">
                <div className="mb-6 rounded-3xl border bg-linear-to-br from-primary/8 via-background to-secondary/8 p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div className="space-y-2">
                            <Badge variant="secondary">Espace client</Badge>
                            <h1 className="font-heading text-3xl font-semibold">
                                {title}
                            </h1>
                            <p className="max-w-2xl text-sm text-muted-foreground">
                                {description}
                            </p>
                        </div>

                        {stats.length > 0 && (
                            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                {stats.map((stat) => (
                                    <Card
                                        key={stat.label}
                                        className="min-w-36 border-0 bg-background/90 py-0 shadow-sm"
                                    >
                                        <CardContent className="space-y-1 p-4">
                                            <p className="text-xs tracking-wide text-muted-foreground uppercase">
                                                {stat.label}
                                            </p>
                                            <p className="text-xl font-semibold">
                                                {stat.value}
                                            </p>
                                            {stat.helper && (
                                                <p className="text-xs text-muted-foreground">
                                                    {stat.helper}
                                                </p>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
                    <Card className="h-fit py-0">
                        <CardHeader className="pb-2">
                            <CardTitle>Navigation</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {sections.map((section) => {
                                const Icon = section.icon;

                                return (
                                    <Link
                                        key={section.key}
                                        href={section.href}
                                        className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
                                            active === section.key
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground'
                                        }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span>{section.label}</span>
                                    </Link>
                                );
                            })}
                        </CardContent>
                    </Card>

                    <div className="space-y-6">{children}</div>
                </div>
            </div>
        </MainLayout>
    );
}
