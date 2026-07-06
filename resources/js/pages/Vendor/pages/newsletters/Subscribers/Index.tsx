import { Head, Link, router } from '@inertiajs/react';
import {
    Search, Mail, Ban, CheckCircle2,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { VendorSidebar } from '@/components/VendorSidebar';
import { cn } from '@/lib/utils';
import type { Tenant } from '@/types/tenants/products/vendor/tenant';

interface Subscriber {
    id: string;
    email: string;
    prenom: string | null;
    nom: string | null;
    is_active: boolean;
    source: string;
    created_at: string;
}

interface SubscribersIndexProps {
    tenant: Tenant;
    subscribers: {
        data: Subscriber[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
        total: number;
    };
    filters: {
        search?: string;
        status?: string;
    };
}

export default function SubscribersIndex({ tenant, subscribers, filters }: SubscribersIndexProps) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('vendor.newsletters.subscribers.index'), { search }, { preserveState: true });
    };

    const handleDeactivate = (id: string) => {
        if (confirm('Êtes-vous sûr de vouloir désactiver cet abonné ?')) {
            router.delete(route('vendor.newsletters.subscribers.destroy', { id }), {
                onSuccess: () => toast.success('Abonné désactivé avec succès.'),
            });
        }
    };

    return (
        <SidebarProvider
            className={cn(
                'h-screen overflow-hidden',
                'border-r border-slate-200/70',
                'bg-white/92 backdrop-blur-3xl supports-backdrop-filter:bg-white/88',
                'dark:border-transparent',
                'dark:bg-slate-950/94 dark:supports-backdrop-filter:bg-slate-950/88'
            )}
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 72)',
                    '--header-height': 'calc(var(--spacing) * 12)',
                } as React.CSSProperties
            }
        >
            <VendorSidebar tenant={tenant} />
            <SidebarInset className="flex min-h-0 flex-col">
                <SiteHeader />
                <div className="bg-slate-50/50 dark:bg-slate-950 flex-1 overflow-y-auto">
                    <Head title="Abonnés Newsletter" />
                    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">Abonnés</h1>
                                <p className="mt-1 text-slate-500 dark:text-slate-400">Gérez votre liste d'abonnés à la newsletter.</p>
                            </div>
                        </div>

                        <Card className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
                            <CardHeader className="pb-4">
                                <div className="flex flex-col sm:flex-row justify-between gap-4">
                                    <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Liste des abonnés ({subscribers.total})</CardTitle>
                                    <form onSubmit={handleSearch} className="flex gap-2">
                                        <div className="relative">
                                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                                            <Input
                                                type="search"
                                                placeholder="Rechercher un email..."
                                                className="pl-9 w-full sm:w-80 bg-white/50 dark:bg-slate-950/50"
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                            />
                                        </div>
                                        <Button type="submit" variant="secondary" className="shadow-sm">Filtrer</Button>
                                    </form>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 overflow-hidden bg-white/50 dark:bg-slate-950/20 backdrop-blur-sm">
                                    <Table>
                                        <TableHeader className="bg-slate-50/80 dark:bg-slate-900/50">
                                            <TableRow className="border-slate-200/60 dark:border-slate-800/60">
                                                <TableHead className="font-medium text-slate-600 dark:text-slate-300">Email</TableHead>
                                                <TableHead className="font-medium text-slate-600 dark:text-slate-300">Nom</TableHead>
                                                <TableHead className="font-medium text-slate-600 dark:text-slate-300">Statut</TableHead>
                                                <TableHead className="font-medium text-slate-600 dark:text-slate-300">Source</TableHead>
                                                <TableHead className="font-medium text-slate-600 dark:text-slate-300">Date d'inscription</TableHead>
                                                <TableHead className="text-right font-medium text-slate-600 dark:text-slate-300">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {subscribers.data.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                                                        Aucun abonné trouvé.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                subscribers.data.map((subscriber) => (
                                                    <TableRow key={subscriber.id} className="border-slate-200/60 dark:border-slate-800/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                                                        <TableCell className="font-medium text-slate-900 dark:text-slate-200">
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800/50">
                                                                    <Mail className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                                                                </div>
                                                                {subscriber.email}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-slate-600 dark:text-slate-400">
                                                            {subscriber.prenom || subscriber.nom
                                                                ? `${subscriber.prenom || ''} ${subscriber.nom || ''}`
                                                                : <span className="text-slate-400 italic">Non renseigné</span>}
                                                        </TableCell>
                                                        <TableCell>
                                                            {subscriber.is_active ? (
                                                                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50">
                                                                    <CheckCircle2 className="mr-1 h-3 w-3" /> Actif
                                                                </Badge>
                                                            ) : (
                                                                <Badge variant="secondary" className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                                                                    Inactif
                                                                </Badge>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="capitalize text-slate-600 dark:text-slate-400">{subscriber.source}</TableCell>
                                                        <TableCell className="text-slate-600 dark:text-slate-400">{new Date(subscriber.created_at).toLocaleDateString()}</TableCell>
                                                        <TableCell className="text-right">
                                                            {subscriber.is_active && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleDeactivate(subscriber.id)}
                                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50 rounded-xl"
                                                                >
                                                                    <Ban className="mr-2 h-4 w-4" />
                                                                    Désactiver
                                                                </Button>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Pagination */}
                                <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-sm text-slate-500 gap-4">
                                    <div>
                                        Affichage de <span className="font-medium text-slate-900 dark:text-slate-200">{subscribers.data.length}</span> sur <span className="font-medium text-slate-900 dark:text-slate-200">{subscribers.total}</span> abonnés
                                    </div>
                                    <div className="flex gap-1.5">
                                        {subscribers.links.map((link, index) => (
                                            link.url ? (
                                                <Link
                                                    key={index}
                                                    href={link.url}
                                                    className={`px-3 py-1 rounded-lg border text-sm font-medium transition-colors ${link.active ? 'bg-slate-900 text-white border-slate-900 shadow-sm dark:bg-white dark:text-slate-900 dark:border-white' : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200/60 dark:bg-slate-950 dark:border-slate-800/60 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-slate-300'}`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ) : (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 rounded-lg border border-slate-200/60 bg-slate-50/50 text-slate-400 text-sm font-medium dark:border-slate-800/60 dark:bg-slate-900/50 dark:text-slate-500"
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            )
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
