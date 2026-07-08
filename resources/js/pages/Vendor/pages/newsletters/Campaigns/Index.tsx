import { Head, Link, router } from '@inertiajs/react';
import {
    Plus, Mail, Eye, MousePointerClick, Send, Clock, Edit, Trash2, Calendar
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { VendorSidebar } from '@/components/VendorSidebar';
import { cn } from '@/lib/utils';
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

function KpiCard({ icon: Icon, label, value, helper, iconColorClass = "text-slate-600 dark:text-slate-400" }: { icon: LucideIcon, label: string, value: string | number, helper?: string, iconColorClass?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all hover:shadow-md dark:border-slate-800/60 dark:bg-slate-900/70"
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
                    {helper && <p className="mt-0.5 text-xs text-slate-400">{helper}</p>}
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                    <Icon className={cn("h-5 w-5", iconColorClass)} />
                </div>
            </div>
        </motion.div>
    );
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
                return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800">Brouillon</Badge>;
            case 'programme':
                return <Badge className="text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400">Programmé</Badge>;
            case 'envoye':
                return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400">Envoyé</Badge>;
            case 'annule':
                return <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400">Annulé</Badge>;
            case 'erreur':
                return <Badge variant="destructive" className="bg-red-600 text-white dark:bg-red-900/80">Erreur</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    // Calculs statistiques pour la page courante
    const totalEnvoyesCurrentPage = campaigns.data.reduce((acc, c) => acc + c.total_envoyes, 0);
    const totalOuvertsCurrentPage = campaigns.data.reduce((acc, c) => acc + c.total_ouverts, 0);
    const totalClicsCurrentPage = campaigns.data.reduce((acc, c) => acc + c.total_clics, 0);

    const avgOpenRate = totalEnvoyesCurrentPage > 0
        ? Math.round((totalOuvertsCurrentPage / totalEnvoyesCurrentPage) * 100)
        : 0;

    const avgClickRate = totalEnvoyesCurrentPage > 0
        ? Math.round((totalClicsCurrentPage / totalEnvoyesCurrentPage) * 100)
        : 0;

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
                    <Head title="Campagnes Newsletter" />
                    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Campagnes Newsletter</h1>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Gérez vos envois d'emails et analysez leurs performances.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge variant="outline" className="hidden sm:inline-flex rounded-full">
                                    <Calendar className="mr-1 h-3.5 w-3.5" />
                                    {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                                </Badge>
                                <Link href={route('vendor.newsletters.campaigns.create')}>
                                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20">
                                        <Plus className="mr-2 h-4 w-4" /> Nouvelle campagne
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <KpiCard
                                icon={Mail}
                                label="Total Campagnes"
                                value={campaigns.total}
                                helper="Toutes vos campagnes"
                                iconColorClass="text-indigo-500"
                            />
                            <KpiCard
                                icon={Send}
                                label="Emails Envoyés"
                                value={totalEnvoyesCurrentPage}
                                helper="Cumul de cette page"
                                iconColorClass="text-slate-500"
                            />
                            <KpiCard
                                icon={Eye}
                                label="Taux d'ouverture"
                                value={`${avgOpenRate}%`}
                                helper="Moyenne (page actuelle)"
                                iconColorClass="text-blue-500"
                            />
                            <KpiCard
                                icon={MousePointerClick}
                                label="Taux de clics"
                                value={`${avgClickRate}%`}
                                helper="Moyenne (page actuelle)"
                                iconColorClass="text-emerald-500"
                            />
                        </div>

                        <Card className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Vos campagnes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-xl border border-slate-200/60 overflow-hidden dark:border-slate-800/60">
                                    <Table>
                                        <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
                                            <TableRow className="hover:bg-transparent">
                                                <TableHead className="font-medium text-slate-500 dark:text-slate-400">Titre</TableHead>
                                                <TableHead className="font-medium text-slate-500 dark:text-slate-400">Statut</TableHead>
                                                <TableHead className="font-medium text-slate-500 dark:text-slate-400">Performances</TableHead>
                                                <TableHead className="font-medium text-slate-500 dark:text-slate-400">Dates</TableHead>
                                                <TableHead className="text-right font-medium text-slate-500 dark:text-slate-400">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {campaigns.data.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="h-40 text-center text-slate-500">
                                                        <div className="flex flex-col items-center justify-center space-y-3">
                                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                                                                <Mail className="h-6 w-6 text-slate-400" />
                                                            </div>
                                                            <p>Aucune campagne trouvée.</p>
                                                            <Link href={route('vendor.newsletters.campaigns.create')} className="text-emerald-600 font-medium hover:underline">
                                                                Créer votre première campagne
                                                            </Link>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                campaigns.data.map((campaign) => (
                                                    <TableRow key={campaign.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                                                        <TableCell>
                                                            <div className="font-medium text-slate-900 dark:text-slate-100">{campaign.titre}</div>
                                                            <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-50 sm:max-w-75">{campaign.sujet}</div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {getStatusBadge(campaign.status)}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex gap-4 text-sm text-slate-500 font-medium">
                                                                <span className="flex items-center gap-1.5" title="Envoyés">
                                                                    <Send className="h-3.5 w-3.5 text-slate-400" /> {campaign.total_envoyes}
                                                                </span>
                                                                <span className="flex items-center gap-1.5" title="Ouverts">
                                                                    <Eye className="h-3.5 w-3.5 text-blue-500" /> {campaign.total_ouverts}
                                                                </span>
                                                                <span className="flex items-center gap-1.5" title="Clics">
                                                                    <MousePointerClick className="h-3.5 w-3.5 text-emerald-500" /> {campaign.total_clics}
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-sm text-slate-500">
                                                            {campaign.status === 'programme' && campaign.scheduled_at && (
                                                                <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                                                                    <Clock className="h-3.5 w-3.5" />
                                                                    {new Date(campaign.scheduled_at).toLocaleDateString()}{' '}
                                                                    {new Date(campaign.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </div>
                                                            )}
                                                            {campaign.status === 'envoye' && campaign.sent_at && (
                                                                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                                                                    <Send className="h-3.5 w-3.5" />
                                                                    {new Date(campaign.sent_at).toLocaleDateString()}
                                                                </div>
                                                            )}
                                                            {campaign.status === 'brouillon' && (
                                                                <div className="text-slate-400">Créé le {new Date(campaign.created_at).toLocaleDateString()}</div>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-right whitespace-nowrap">
                                                            <Link href={route('vendor.newsletters.campaigns.show', { id: campaign.id })}>
                                                                <Button variant="ghost" size="icon" title="Voir" className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                            {campaign.status !== 'envoye' && (
                                                                <Link href={route('vendor.newsletters.campaigns.edit', { id: campaign.id })}>
                                                                    <Button variant="ghost" size="icon" title="Modifier" className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                </Link>
                                                            )}
                                                            {campaign.status !== 'envoye' && (
                                                                <Button variant="ghost" size="icon" title="Supprimer" onClick={() => handleDelete(campaign.id)} className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>

                                <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between text-sm text-slate-500 gap-4">
                                    <div>
                                        Affichage de <span className="font-medium text-slate-900 dark:text-white">{campaigns.data.length}</span> sur <span className="font-medium text-slate-900 dark:text-white">{campaigns.total}</span> campagnes
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {campaigns.links.map((link, index) => (
                                            link.url ? (
                                                <Link
                                                    key={index}
                                                    href={link.url}
                                                    className={cn(
                                                        "px-3 py-1.5 rounded-lg border transition-colors",
                                                        link.active
                                                            ? "bg-slate-900 text-white border-slate-900 dark:bg-emerald-600 dark:border-emerald-600"
                                                            : "bg-white text-slate-600 border-slate-200/60 hover:bg-slate-50 dark:bg-slate-900/50 dark:border-slate-800/60 dark:text-slate-400 dark:hover:bg-slate-800"
                                                    )}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ) : (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1.5 rounded-lg border border-slate-200/40 bg-slate-50/50 text-slate-400 dark:border-slate-800/40 dark:bg-slate-900/30"
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
