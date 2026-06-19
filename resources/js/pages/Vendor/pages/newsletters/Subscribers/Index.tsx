import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Search, Mail, Ban, CheckCircle2,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { SiteHeader } from '@/components/site-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { VendorSidebar } from '@/components/VendorSidebar';
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
            className="bg-slate-950/94 p-0"
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 72)',
                    '--header-height': 'calc(var(--spacing) * 12)',
                } as React.CSSProperties
            }
        >
            <VendorSidebar tenant={tenant} />
            <SidebarInset>
                <SiteHeader />
                <div className="bg-white dark:bg-slate-950">
                    <Head title="Abonnés Newsletter" />
                    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <div>
                                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">Abonnés</h1>
                                <p className="mt-1 text-slate-500 dark:text-slate-400">Gérez votre liste d'abonnés à la newsletter.</p>
                            </div>
                        </div>

                        <Card className="border-slate-200 shadow-sm dark:border-slate-800">
                            <CardHeader className="pb-4">
                                <div className="flex flex-col sm:flex-row justify-between gap-4">
                                    <CardTitle>Liste des abonnés ({subscribers.total})</CardTitle>
                                    <form onSubmit={handleSearch} className="flex gap-2">
                                        <div className="relative">
                                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                                            <Input
                                                type="search"
                                                placeholder="Rechercher un email..."
                                                className="pl-9 w-full sm:w-[300px]"
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                            />
                                        </div>
                                        <Button type="submit" variant="secondary">Filtrer</Button>
                                    </form>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border border-slate-200 dark:border-slate-800">
                                    <Table>
                                        <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                                            <TableRow>
                                                <TableHead>Email</TableHead>
                                                <TableHead>Nom</TableHead>
                                                <TableHead>Statut</TableHead>
                                                <TableHead>Source</TableHead>
                                                <TableHead>Date d'inscription</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
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
                                                    <TableRow key={subscriber.id}>
                                                        <TableCell className="font-medium">
                                                            <div className="flex items-center gap-2">
                                                                <Mail className="h-4 w-4 text-slate-400" />
                                                                {subscriber.email}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {subscriber.prenom || subscriber.nom
                                                                ? `${subscriber.prenom || ''} ${subscriber.nom || ''}`
                                                                : <span className="text-slate-400 italic">Non renseigné</span>}
                                                        </TableCell>
                                                        <TableCell>
                                                            {subscriber.is_active ? (
                                                                <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                                    <CheckCircle2 className="mr-1 h-3 w-3" /> Actif
                                                                </Badge>
                                                            ) : (
                                                                <Badge variant="secondary" className="text-slate-500">
                                                                    Inactif
                                                                </Badge>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="capitalize">{subscriber.source}</TableCell>
                                                        <TableCell>{new Date(subscriber.created_at).toLocaleDateString()}</TableCell>
                                                        <TableCell className="text-right">
                                                            {subscriber.is_active && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleDeactivate(subscriber.id)}
                                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50"
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
                                <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                                    <div>
                                        Affichage de {subscribers.data.length} sur {subscribers.total} abonnés
                                    </div>
                                    <div className="flex gap-2">
                                        {subscribers.links.map((link, index) => (
                                            link.url ? (
                                                <Link
                                                    key={index}
                                                    href={link.url}
                                                    className={`px-3 py-1 rounded-md border ${link.active ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-white hover:bg-slate-50 dark:bg-slate-950 dark:border-slate-800 dark:hover:bg-slate-900'}`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ) : (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 rounded-md border border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-800 dark:bg-slate-900/50"
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
