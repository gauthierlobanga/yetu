import { Head, Link, router } from '@inertiajs/react';
import {
    Plus, Mail, Eye, MousePointerClick, Send, Clock, Edit, Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { VendorSidebar } from '@/components/VendorSidebar';
import type { Tenant } from '@/types/tenants/products/vendor/tenant';

interface Campaign {
    id: string;
    titre: string;
    sujet: string;
    status: 'brouillon' | 'programme' | 'envoye' | 'annule' | 'erreur';
    scheduled_at: string | null;
    sent_at: string | null;
    total_envoyes: number;
    total_ouverts: number;
    total_clics: number;
    created_at: string;
}

interface CampaignsIndexProps {
    tenant: Tenant;
    campaigns: {
        data: Campaign[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
        total: number;
    };
}

export default function CampaignsIndex({ tenant, campaigns }: CampaignsIndexProps) {

    const handleDelete = (id: string) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette campagne ?')) {
            router.delete(route('vendor.newsletters.campaigns.destroy', { id }), {
                onSuccess: () => toast.success('Campagne supprimée.'),
            });
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'brouillon':
                return <Badge variant="secondary" className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">Brouillon</Badge>;
            case 'programme':
                return <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-400">Programmé</Badge>;
            case 'envoye':
                return <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">Envoyé</Badge>;
            case 'annule':
                return <Badge variant="destructive">Annulé</Badge>;
            case 'erreur':
                return <Badge variant="destructive" className="bg-red-600">Erreur</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
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
                    <Head title="Campagnes Newsletter" />
                    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <div>
                                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">Campagnes Newsletter</h1>
                                <p className="mt-1 text-slate-500 dark:text-slate-400">Créez et gérez vos envois de newsletters.</p>
                            </div>
                            <Link href={route('vendor.newsletters.campaigns.create')}>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" /> Nouvelle campagne
                                </Button>
                            </Link>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3 mb-8">
                            <Card className="border-slate-200 dark:border-slate-800">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Campagnes</CardTitle>
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{campaigns.total}</div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="border-slate-200 shadow-sm dark:border-slate-800">
                            <CardHeader>
                                <CardTitle>Vos campagnes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border border-slate-200 dark:border-slate-800">
                                    <Table>
                                        <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                                            <TableRow>
                                                <TableHead>Titre</TableHead>
                                                <TableHead>Statut</TableHead>
                                                <TableHead>Performances</TableHead>
                                                <TableHead>Dates</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {campaigns.data.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                                                        Aucune campagne trouvée.{' '}
                                                        <Link href={route('vendor.newsletters.campaigns.create')} className="text-blue-600 underline">
                                                            Créer une campagne
                                                        </Link>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                campaigns.data.map((campaign) => (
                                                    <TableRow key={campaign.id}>
                                                        <TableCell>
                                                            <div className="font-medium text-slate-900 dark:text-slate-100">{campaign.titre}</div>
                                                            <div className="text-sm text-slate-500 dark:text-slate-400">{campaign.sujet}</div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {getStatusBadge(campaign.status)}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex gap-4 text-sm text-slate-500">
                                                                <span className="flex items-center gap-1" title="Envoyés">
                                                                    <Send className="h-3 w-3" /> {campaign.total_envoyes}
                                                                </span>
                                                                <span className="flex items-center gap-1" title="Ouverts">
                                                                    <Eye className="h-3 w-3 text-blue-500" /> {campaign.total_ouverts}
                                                                </span>
                                                                <span className="flex items-center gap-1" title="Clics">
                                                                    <MousePointerClick className="h-3 w-3 text-emerald-500" /> {campaign.total_clics}
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-sm text-slate-500">
                                                            {campaign.status === 'programme' && campaign.scheduled_at && (
                                                                <div className="flex items-center gap-1">
                                                                    <Clock className="h-3 w-3" />
                                                                    {new Date(campaign.scheduled_at).toLocaleDateString()}{' '}
                                                                    {new Date(campaign.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </div>
                                                            )}
                                                            {campaign.status === 'envoye' && campaign.sent_at && (
                                                                <div className="flex items-center gap-1">
                                                                    <Send className="h-3 w-3" />
                                                                    {new Date(campaign.sent_at).toLocaleDateString()}
                                                                </div>
                                                            )}
                                                            {campaign.status === 'brouillon' && (
                                                                <div>Créé le {new Date(campaign.created_at).toLocaleDateString()}</div>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-right whitespace-nowrap">
                                                            <Link href={route('vendor.newsletters.campaigns.show', { id: campaign.id })}>
                                                                <Button variant="ghost" size="icon" title="Voir">
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                            {campaign.status !== 'envoye' && (
                                                                <Link href={route('vendor.newsletters.campaigns.edit', { id: campaign.id })}>
                                                                    <Button variant="ghost" size="icon" title="Modifier">
                                                                        <Edit className="h-4 w-4 text-blue-500" />
                                                                    </Button>
                                                                </Link>
                                                            )}
                                                            {campaign.status !== 'envoye' && (
                                                                <Button variant="ghost" size="icon" title="Supprimer" onClick={() => handleDelete(campaign.id)}>
                                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                                </Button>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>

                                <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                                    <div>
                                        Affichage de {campaigns.data.length} sur {campaigns.total} campagnes
                                    </div>
                                    <div className="flex gap-2">
                                        {campaigns.links.map((link, index) => (
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
