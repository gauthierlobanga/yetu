/* eslint-disable @typescript-eslint/no-unused-vars */
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Play, Pause, Trash2, Edit, Users, Eye, MousePointerClick, Send } from 'lucide-react';
import { toast } from 'sonner';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { VendorSidebar } from '@/components/VendorSidebar';
import { cn } from '@/lib/utils';
import type { Tenant } from '@/types/tenants/products/vendor/tenant';

interface Campaign {
    id: string;
    titre: string;
    sujet: string;
    contenu_html: string;
    contenu_text: string | null;
    status: 'brouillon' | 'programme' | 'envoye' | 'annule' | 'erreur';
    scheduled_at: string | null;
    sent_at: string | null;
    total_envoyes: number;
    total_ouverts: number;
    total_clics: number;
    created_at: string;
}

interface CampaignShowProps {
    tenant: Tenant;
    campaign: Campaign;
    recentSends: any[];
}

export default function CampaignShow({ tenant, campaign, recentSends }: CampaignShowProps) {

    const handleStatusChange = (newStatus: string) => {
        router.put(route('vendor.newsletters.campaigns.update', { id: campaign.id }), {
            status: newStatus,
        }, {
            preserveScroll: true,
            onSuccess: () => toast.success(`Statut de la campagne mis à jour.`),
        });
    };

    const { data: testData, setData: setTestData, post: postTest, processing: processingTest, errors: testErrors } = useForm({
        email: ''
    });

    const handleSendTest = (e: React.FormEvent) => {
        e.preventDefault();
        postTest(route('vendor.newsletters.campaigns.send-test', { id: campaign.id }), {
            preserveScroll: true,
            onSuccess: () => {
                setTestData('email', '');
                toast.success('Email de test envoyé.');
            }
        });
    };

    const handleDelete = () => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette campagne ? Cette action est irréversible.')) {
            router.delete(route('vendor.newsletters.campaigns.destroy', { id: campaign.id }), {
                onSuccess: () => toast.success('Campagne supprimée.'),
            });
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'brouillon': return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-800">Brouillon</Badge>;
            case 'programme': return <Badge className="text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400">Programmé</Badge>;
            case 'envoye': return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400">Envoyé</Badge>;
            case 'annule': return <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400">Annulé</Badge>;
            case 'erreur': return <Badge variant="destructive" className="bg-red-600 text-white dark:bg-red-900/80">Erreur</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    // Calcul des pourcentages
    const openRate = campaign.total_envoyes > 0 ? (campaign.total_ouverts / campaign.total_envoyes) * 100 : 0;
    const clickRate = campaign.total_envoyes > 0 ? (campaign.total_clics / campaign.total_envoyes) * 100 : 0;

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
                    <Head title={`Campagne : ${campaign.titre}`} />
                    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-center gap-4">
                                <Link href={route('vendor.newsletters.campaigns.index')}>
                                    <Button variant="outline" size="icon" className="rounded-xl border-slate-200/60 hover:bg-slate-100 dark:border-slate-800/60 dark:hover:bg-slate-800">
                                        <ArrowLeft className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <div>
                                    <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                                        {campaign.titre}
                                        {getStatusBadge(campaign.status)}
                                    </h1>
                                    <p className="mt-1 text-slate-500 dark:text-slate-400">Sujet : {campaign.sujet}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {campaign.status === 'brouillon' && (
                                    <>
                                        <Button onClick={() => handleStatusChange('envoye')} className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20">
                                            <Send className="h-4 w-4 mr-2" /> Envoyer maintenant
                                        </Button>
                                        <Button variant="outline" onClick={handleDelete} className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 dark:border-red-900/30 dark:hover:bg-red-900/20">
                                            <Trash2 className="h-4 w-4 mr-2" /> Supprimer
                                        </Button>
                                    </>
                                )}
                                {campaign.status === 'programme' && (
                                    <>
                                        <Button variant="outline" onClick={() => handleStatusChange('annule')} className="text-amber-600 border-amber-200 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 dark:border-amber-900/30 dark:hover:bg-amber-900/20">
                                            <Pause className="h-4 w-4 mr-2" /> Annuler l'envoi
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Colonne Principale */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Statistiques (si envoyé) */}
                                {(campaign.status === 'envoye' || campaign.total_envoyes > 0) && (
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <Card className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Envoyés</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-3xl font-bold text-slate-900 dark:text-white">{campaign.total_envoyes}</div>
                                                <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                                    <Users className="h-3 w-3" /> Abonnés ciblés
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <Card className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Ouvertures</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{campaign.total_ouverts}</div>
                                                <Progress value={openRate} className="mt-2 h-2 [&>div]:bg-blue-500 bg-slate-100 dark:bg-slate-800" />
                                                <div className="text-xs text-slate-400 mt-2">{openRate.toFixed(1)}% taux d'ouverture</div>
                                            </CardContent>
                                        </Card>
                                        <Card className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Clics</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{campaign.total_clics}</div>
                                                <Progress value={clickRate} className="mt-2 h-2 [&>div]:bg-emerald-500 bg-slate-100 dark:bg-slate-800" />
                                                <div className="text-xs text-slate-400 mt-2">{clickRate.toFixed(1)}% taux de clic</div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}

                                {/* Aperçu du contenu */}
                                <Card className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70 overflow-hidden flex flex-col">
                                    <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200/60 dark:border-slate-800/60">
                                        <CardTitle className="text-base flex items-center gap-2 text-slate-900 dark:text-white">
                                            <Eye className="h-4 w-4 text-emerald-500" /> Aperçu du contenu (HTML)
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0 flex-1">
                                        <div className="p-6 bg-white dark:bg-slate-900 min-h-100 prose max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: campaign.contenu_html }} />
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Colonne Secondaire */}
                            <div className="space-y-6">
                                <Card className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
                                    <CardHeader>
                                        <CardTitle className="text-base text-slate-900 dark:text-white">Détails</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Créée le</div>
                                            <div className="text-sm text-slate-900 dark:text-slate-300">{new Date(campaign.created_at).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })}</div>
                                        </div>
                                        {campaign.scheduled_at && (
                                            <div>
                                                <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Programmée pour</div>
                                                <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                                    {new Date(campaign.scheduled_at).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })}
                                                </div>
                                            </div>
                                        )}
                                        {campaign.sent_at && (
                                            <div>
                                                <div className="text-sm font-medium text-slate-500 dark:text-slate-400">Envoyée le</div>
                                                <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                                    {new Date(campaign.sent_at).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
                                    <CardHeader>
                                        <CardTitle className="text-base flex items-center gap-2 text-slate-900 dark:text-white">
                                            <Send className="h-4 w-4 text-indigo-500" /> Envoyer un test
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleSendTest} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="test-email" className="text-slate-700 dark:text-slate-300">Adresse e-mail</Label>
                                                <Input
                                                    id="test-email"
                                                    type="email"
                                                    placeholder="test@example.com"
                                                    value={testData.email}
                                                    onChange={(e) => setTestData('email', e.target.value)}
                                                    required
                                                    className="bg-white/50 dark:bg-slate-950/50"
                                                />
                                                {testErrors.email && <p className="text-sm text-red-500">{testErrors.email}</p>}
                                            </div>
                                            <Button type="submit" disabled={processingTest} className="w-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700">
                                                Envoyer le test
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>

                                <Card className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
                                    <CardHeader>
                                        <CardTitle className="text-base flex items-center gap-2 text-slate-900 dark:text-white">
                                            <MousePointerClick className="h-4 w-4 text-emerald-500" /> Activité récente
                                        </CardTitle>
                                        <CardDescription>Ouvertures & clics</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        {recentSends && recentSends.length > 0 ? (
                                            <div className="space-y-4">
                                                {recentSends.map((send, i) => {
                                                    const isOpened = send.status === 'ouvert' || send.status === 'clique';
                                                    const isClicked = send.status === 'clique';
                                                    const date = send.clicked_at || send.opened_at || send.created_at;

                                                    return (
                                                    <div key={i} className="flex items-start gap-3 text-sm">
                                                        <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800/50">
                                                            {isClicked ? (
                                                                <MousePointerClick className="h-4 w-4 text-emerald-500" />
                                                            ) : isOpened ? (
                                                                <Eye className="h-4 w-4 text-blue-500" />
                                                            ) : (
                                                                <Send className="h-4 w-4 text-slate-400" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-slate-900 dark:text-slate-200">{send.email}</div>
                                                            <div className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                                                                {isClicked ? 'a cliqué sur un lien' : isOpened ? 'a ouvert l\'email' : 'a reçu l\'email'}
                                                                {' • '}{new Date(date).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
})}
                                            </div>
                                        ) : (
                                            <div className="text-sm text-slate-500 text-center py-6">
                                                Aucune activité enregistrée pour le moment.
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
