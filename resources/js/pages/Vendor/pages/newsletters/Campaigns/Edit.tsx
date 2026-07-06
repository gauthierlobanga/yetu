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
                    <Head title="Modifier la campagne" />
                    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
                        <div className="flex items-center gap-4">
                            <Link href={route('vendor.newsletters.campaigns.index')}>
                                <Button variant="outline" size="icon" className="rounded-xl border-slate-200/60 hover:bg-slate-100 dark:border-slate-800/60 dark:hover:bg-slate-800">
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">Modifier la Campagne</h1>
                                <p className="mt-1 text-slate-500 dark:text-slate-400">Ajustez les détails ou la programmation de votre campagne.</p>
                            </div>
                        </div>

                        {campaign.status === 'envoye' && (
                            <div className="p-4 bg-amber-50/80 backdrop-blur-sm text-amber-800 border border-amber-200/60 rounded-2xl shadow-sm dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50 flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/50">
                                    <Send className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                                </div>
                                <p className="text-sm font-medium">Cette campagne a déjà été envoyée et ne peut plus être modifiée.</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="grid gap-6 md:grid-cols-3">
                                <div className="md:col-span-2 flex flex-col gap-6">
                                    <Card className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
                                        <CardHeader>
                                            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Informations principales</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="titre" className="text-slate-700 dark:text-slate-300">Nom de la campagne (interne)</Label>
                                                <Input
                                                    id="titre"
                                                    value={data.titre}
                                                    onChange={(e) => setData('titre', e.target.value)}
                                                    disabled={campaign.status === 'envoye'}
                                                    className="bg-white/50 dark:bg-slate-950/50 disabled:opacity-60"
                                                />
                                                {errors.titre && <p className="text-sm text-red-500">{errors.titre}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="sujet" className="text-slate-700 dark:text-slate-300">Sujet de l'email</Label>
                                                <Input
                                                    id="sujet"
                                                    value={data.sujet}
                                                    onChange={(e) => setData('sujet', e.target.value)}
                                                    disabled={campaign.status === 'envoye'}
                                                    className="bg-white/50 dark:bg-slate-950/50 disabled:opacity-60"
                                                />
                                                {errors.sujet && <p className="text-sm text-red-500">{errors.sujet}</p>}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
                                        <CardHeader>
                                            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Contenu de l'email</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="contenu_html" className="text-slate-700 dark:text-slate-300">Contenu HTML</Label>
                                                <Textarea
                                                    id="contenu_html"
                                                    rows={15}
                                                    value={data.contenu_html}
                                                    onChange={(e) => setData('contenu_html', e.target.value)}
                                                    className="font-mono text-sm bg-white/50 dark:bg-slate-950/50 disabled:opacity-60"
                                                    disabled={campaign.status === 'envoye'}
                                                />
                                                {errors.contenu_html && <p className="text-sm text-red-500">{errors.contenu_html}</p>}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="space-y-6">
                                    <Card className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
                                        <CardHeader>
                                            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Paramètres d'envoi</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="status" className="text-slate-700 dark:text-slate-300">Statut de la campagne</Label>
                                                <Select
                                                    value={data.status}
                                                    onValueChange={(val) => setData('status', val as any)}
                                                    disabled={campaign.status === 'envoye'}
                                                >
                                                    <SelectTrigger id="status" className="bg-white/50 dark:bg-slate-950/50 disabled:opacity-60">
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
                                                <div className="space-y-2 pt-4 mt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                                                    <Label htmlFor="scheduled_at" className="text-slate-700 dark:text-slate-300">Date et heure d'envoi</Label>
                                                    <Input
                                                        id="scheduled_at"
                                                        type="datetime-local"
                                                        value={data.scheduled_at}
                                                        onChange={(e) => setData('scheduled_at', e.target.value)}
                                                        disabled={campaign.status === 'envoye'}
                                                        className="bg-white/50 dark:bg-slate-950/50 disabled:opacity-60"
                                                    />
                                                    {errors.scheduled_at && <p className="text-sm text-red-500">{errors.scheduled_at}</p>}
                                                </div>
                                            )}
                                        </CardContent>
                                        <CardFooter className="bg-slate-50/50 dark:bg-slate-900/50 flex gap-2 rounded-b-2xl border-t border-slate-200/60 dark:border-slate-800/60 p-5">
                                            <Button type="submit" disabled={processing || campaign.status === 'envoye'} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 disabled:bg-emerald-600/50">
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
