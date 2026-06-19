import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Play, Pause, Trash2, Edit, Users, Eye, MousePointerClick, Send } from 'lucide-react';
import { toast } from 'sonner';
import { SiteHeader } from '@/components/site-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { VendorSidebar } from '@/components/VendorSidebar';
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
            case 'brouillon': return <Badge variant="secondary">Brouillon</Badge>;
            case 'programme': return <Badge variant="outline" className="text-blue-600">Programmé</Badge>;
            case 'envoye': return <Badge className="bg-emerald-500">Envoyé</Badge>;
            case 'annule': return <Badge variant="destructive">Annulé</Badge>;
            case 'erreur': return <Badge variant="destructive">Erreur</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    // Calcul des pourcentages
    const openRate = campaign.total_envoyes > 0 ? (campaign.total_ouverts / campaign.total_envoyes) * 100 : 0;
    const clickRate = campaign.total_envoyes > 0 ? (campaign.total_clics / campaign.total_envoyes) * 100 : 0;

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
                <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
                    <Head title={`Campagne : ${campaign.titre}`} />
                    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                            <div className="flex items-center gap-4">
                                <Link href={route('vendor.newsletters.campaigns.index')}>
                                    <Button variant="outline" size="icon" className="bg-white">
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

                            <div className="flex items-center gap-2">
                                {campaign.status === 'brouillon' && (
                                    <>
                                        <Button onClick={() => handleStatusChange('envoye')} className="bg-emerald-600 hover:bg-emerald-700">
                                            <Send className="h-4 w-4 mr-2" /> Envoyer maintenant
                                        </Button>
                                        <Button variant="outline" onClick={handleDelete} className="text-red-600 hover:bg-red-50">
                                            <Trash2 className="h-4 w-4 mr-2" /> Supprimer
                                        </Button>
                                    </>
                                )}
                                {campaign.status === 'programme' && (
                                    <>
                                        <Button variant="outline" onClick={() => handleStatusChange('annule')} className="text-amber-600">
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
                                        <Card className="border-slate-200 dark:border-slate-800">
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-sm font-medium text-slate-500">Envoyés</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-3xl font-bold">{campaign.total_envoyes}</div>
                                                <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                                    <Users className="h-3 w-3" /> Abonnés ciblés
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <Card className="border-slate-200 dark:border-slate-800">
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-sm font-medium text-slate-500">Ouvertures</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-3xl font-bold text-blue-600">{campaign.total_ouverts}</div>
                                                <Progress value={openRate} className="mt-2 h-2" />
                                                <div className="text-xs text-slate-400 mt-2">{openRate.toFixed(1)}% taux d'ouverture</div>
                                            </CardContent>
                                        </Card>
                                        <Card className="border-slate-200 dark:border-slate-800">
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-sm font-medium text-slate-500">Clics</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-3xl font-bold text-emerald-600">{campaign.total_clics}</div>
                                                <Progress value={clickRate} className="mt-2 h-2 [&>div]:bg-emerald-500" />
                                                <div className="text-xs text-slate-400 mt-2">{clickRate.toFixed(1)}% taux de clic</div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}

                                {/* Aperçu du contenu */}
                                <Card className="border-slate-200 dark:border-slate-800 overflow-hidden">
                                    <CardHeader className="bg-slate-100/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <Eye className="h-4 w-4" /> Aperçu du contenu (HTML)
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="p-6 bg-white prose max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: campaign.contenu_html }} />
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Colonne Secondaire */}
                            <div className="space-y-6">
                                <Card className="border-slate-200 dark:border-slate-800">
                                    <CardHeader>
                                        <CardTitle className="text-base">Détails</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <div className="text-sm font-medium text-slate-500">Créée le</div>
                                            <div className="text-sm">{new Date(campaign.created_at).toLocaleString()}</div>
                                        </div>
                                        {campaign.scheduled_at && (
                                            <div>
                                                <div className="text-sm font-medium text-slate-500">Programmée pour</div>
                                                <div className="text-sm font-medium text-blue-600">
                                                    {new Date(campaign.scheduled_at).toLocaleString()}
                                                </div>
                                            </div>
                                        )}
                                        {campaign.sent_at && (
                                            <div>
                                                <div className="text-sm font-medium text-slate-500">Envoyée le</div>
                                                <div className="text-sm font-medium text-emerald-600">
                                                    {new Date(campaign.sent_at).toLocaleString()}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card className="border-slate-200 dark:border-slate-800">
                                    <CardHeader>
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <Send className="h-4 w-4" /> Envoyer un test
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleSendTest} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="test-email">Adresse e-mail</Label>
                                                <Input 
                                                    id="test-email" 
                                                    type="email" 
                                                    placeholder="test@example.com"
                                                    value={testData.email}
                                                    onChange={(e) => setTestData('email', e.target.value)}
                                                    required
                                                />
                                                {testErrors.email && <p className="text-sm text-red-500">{testErrors.email}</p>}
                                            </div>
                                            <Button type="submit" disabled={processingTest} className="w-full">
                                                Envoyer le test
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>

                                <Card className="border-slate-200 dark:border-slate-800">
                                    <CardHeader>
                                        <CardTitle className="text-base flex items-center gap-2">
                                            <MousePointerClick className="h-4 w-4" /> Activité récente
                                        </CardTitle>
                                        <CardDescription>Ouv. & clics sur cette campagne</CardDescription>
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
                                                        <div className="mt-0.5">
                                                            {isClicked ? (
                                                                <MousePointerClick className="h-4 w-4 text-emerald-500" />
                                                            ) : isOpened ? (
                                                                <Eye className="h-4 w-4 text-blue-500" />
                                                            ) : (
                                                                <Send className="h-4 w-4 text-slate-400" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium">{send.email}</div>
                                                            <div className="text-slate-500 text-xs">
                                                                {isClicked ? 'a cliqué sur un lien' : isOpened ? 'a ouvert l\'email' : 'a reçu l\'email'}
                                                                {' • '}{new Date(date).toLocaleString()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )})}
                                            </div>
                                        ) : (
                                            <div className="text-sm text-slate-500 text-center py-4">
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
