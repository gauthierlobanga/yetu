import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Send } from 'lucide-react';
import { toast } from 'sonner';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Textarea } from '@/components/ui/textarea';
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
}

interface CampaignEditProps {
    tenant: Tenant;
    campaign: Campaign;
}

export default function CampaignEdit({ tenant, campaign }: CampaignEditProps) {
    const { data, setData, put, processing, errors } = useForm({
        titre: campaign.titre || '',
        sujet: campaign.sujet || '',
        contenu_html: campaign.contenu_html || '',
        contenu_text: campaign.contenu_text || '',
        status: campaign.status || 'brouillon',
        scheduled_at: campaign.scheduled_at ? new Date(campaign.scheduled_at).toISOString().slice(0, 16) : '',
        segments_cibles: undefined,
    });

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(route('vendor.newsletters.campaigns.update', { id: campaign.id }), {
            onSuccess: () => toast.success('Campagne mise à jour avec succès.')
        });
    };

    return (
        <SidebarProvider
            className="bg-slate-950/94 p-0"
            style={{ '--sidebar-width': 'calc(var(--spacing) * 72)', '--header-height': 'calc(var(--spacing) * 12)' } as React.CSSProperties}
        >
            <VendorSidebar tenant={tenant} />
            <SidebarInset>
                <SiteHeader />
                <div className="bg-white dark:bg-slate-950">
                    <Head title="Modifier la campagne" />
                    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-4 mb-8">
                            <Link href={route('vendor.newsletters.campaigns.index')}>
                                <Button variant="outline" size="icon">
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">Modifier la Campagne</h1>
                            </div>
                        </div>

                        {campaign.status === 'envoye' && (
                            <div className="mb-6 p-4 bg-amber-50 text-amber-800 border border-amber-200 rounded-md text-sm">
                                Cette campagne a déjà été envoyée et ne peut plus être modifiée.
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="grid gap-6 md:grid-cols-3">
                                <div className="md:col-span-2 flex flex-col gap-6">
                                    <Card className="border-slate-200 dark:border-slate-800">
                                        <CardHeader>
                                            <CardTitle>Informations principales</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="titre">Nom de la campagne (interne)</Label>
                                                <Input
                                                    id="titre"
                                                    value={data.titre}
                                                    onChange={(e) => setData('titre', e.target.value)}
                                                    disabled={campaign.status === 'envoye'}
                                                />
                                                {errors.titre && <p className="text-sm text-red-500">{errors.titre}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="sujet">Sujet de l'email</Label>
                                                <Input
                                                    id="sujet"
                                                    value={data.sujet}
                                                    onChange={(e) => setData('sujet', e.target.value)}
                                                    disabled={campaign.status === 'envoye'}
                                                />
                                                {errors.sujet && <p className="text-sm text-red-500">{errors.sujet}</p>}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-slate-200 dark:border-slate-800">
                                        <CardHeader>
                                            <CardTitle>Contenu de l'email</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="contenu_html">Contenu HTML</Label>
                                                <Textarea
                                                    id="contenu_html"
                                                    rows={15}
                                                    value={data.contenu_html}
                                                    onChange={(e) => setData('contenu_html', e.target.value)}
                                                    className="font-mono text-sm"
                                                    disabled={campaign.status === 'envoye'}
                                                />
                                                {errors.contenu_html && <p className="text-sm text-red-500">{errors.contenu_html}</p>}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="space-y-6">
                                    <Card className="border-slate-200 dark:border-slate-800">
                                        <CardHeader>
                                            <CardTitle>Paramètres d'envoi</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="status">Statut de la campagne</Label>
                                                <Select
                                                    value={data.status}
                                                    onValueChange={(val) => setData('status', val)}
                                                    disabled={campaign.status === 'envoye'}
                                                >
                                                    <SelectTrigger id="status">
                                                        <SelectValue placeholder="Sélectionnez un statut" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="brouillon">Brouillon</SelectItem>
                                                        <SelectItem value="programme">Programmer l'envoi</SelectItem>
                                                        <SelectItem value="envoye">Envoyer maintenant</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {data.status === 'programme' && (
                                                <div className="space-y-2">
                                                    <Label htmlFor="scheduled_at">Date et heure d'envoi</Label>
                                                    <Input
                                                        id="scheduled_at"
                                                        type="datetime-local"
                                                        value={data.scheduled_at}
                                                        onChange={(e) => setData('scheduled_at', e.target.value)}
                                                        disabled={campaign.status === 'envoye'}
                                                    />
                                                    {errors.scheduled_at && <p className="text-sm text-red-500">{errors.scheduled_at}</p>}
                                                </div>
                                            )}
                                        </CardContent>
                                        <CardFooter className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex justify-end p-4">
                                            <Button type="submit" disabled={processing || campaign.status === 'envoye'} className="w-full">
                                                {data.status === 'envoye' ? (
                                                    <><Send className="mr-2 h-4 w-4" /> Enregistrer et envoyer</>
                                                ) : (
                                                    <><Save className="mr-2 h-4 w-4" /> Enregistrer les modifications</>
                                                )}
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
