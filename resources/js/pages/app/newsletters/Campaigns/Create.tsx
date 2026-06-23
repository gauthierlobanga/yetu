import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save, Send } from 'lucide-react';
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

interface CampaignCreateProps {
    tenant: Tenant;
}

export default function CampaignCreate({ tenant }: CampaignCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        titre: '',
        sujet: '',
        contenu_html: '',
        contenu_text: '',
        status: 'brouillon',
        scheduled_at: '',
    });

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('vendor.newsletters.campaigns.store'));
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
                    <Head title="Créer une campagne" />
                    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-4 mb-8">
                            <Link href={route('vendor.newsletters.campaigns.index')}>
                                <Button variant="outline" size="icon">
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">Nouvelle Campagne</h1>
                                <p className="mt-1 text-slate-500 dark:text-slate-400">Rédigez et programmez votre newsletter.</p>
                            </div>
                        </div>

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
                                                    placeholder="Ex: Newsletter Printemps 2026"
                                                    value={data.titre}
                                                    onChange={(e) => setData('titre', e.target.value)}
                                                />
                                                {errors.titre && <p className="text-sm text-red-500">{errors.titre}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="sujet">Sujet de l'email</Label>
                                                <Input
                                                    id="sujet"
                                                    placeholder="Ex: Découvrez nos nouvelles offres"
                                                    value={data.sujet}
                                                    onChange={(e) => setData('sujet', e.target.value)}
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
                                                    placeholder='<h2>Bonjour {{prenom}},</h2><p>Voici nos nouveautés...</p>'
                                                    className="font-mono h-64"
                                                    value={data.contenu_html}
                                                    onChange={(e) => setData('contenu_html', e.target.value)}
                                                />
                                                {errors.contenu_html && <p className="text-sm text-red-500">{errors.contenu_html}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="contenu_text">Contenu Texte brut (Optionnel)</Label>
                                                <Textarea
                                                    id="contenu_text"
                                                    placeholder="Bonjour {{prenom}}, Voici nos nouveautés..."
                                                    className="font-mono h-32"
                                                    value={data.contenu_text}
                                                    onChange={(e) => setData('contenu_text', e.target.value)}
                                                />
                                                <p className="text-xs text-slate-500">Variables disponibles : {'{{prenom}}'}, {'{{nom}}'}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="flex flex-col gap-6">
                                    <Card className="border-slate-200 dark:border-slate-800">
                                        <CardHeader>
                                            <CardTitle>Publication</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="status">Statut</Label>
                                                <Select value={data.status} onValueChange={(val) => setData('status', val)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Sélectionner le statut" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="brouillon">Brouillon</SelectItem>
                                                        <SelectItem value="programme">Programmer l'envoi</SelectItem>
                                                        <SelectItem value="envoye">Envoyer immédiatement</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
                                            </div>

                                            {data.status === 'programme' && (
                                                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                                    <Label htmlFor="scheduled_at">Date et heure d'envoi</Label>
                                                    <Input
                                                        type="datetime-local"
                                                        id="scheduled_at"
                                                        value={data.scheduled_at}
                                                        onChange={(e) => setData('scheduled_at', e.target.value)}
                                                    />
                                                    {errors.scheduled_at && <p className="text-sm text-red-500">{errors.scheduled_at}</p>}
                                                </div>
                                            )}
                                        </CardContent>
                                        <CardFooter className="bg-slate-50 dark:bg-slate-900/50 flex gap-2 rounded-b-xl border-t border-slate-200 dark:border-slate-800">
                                            <Button type="submit" disabled={processing} className="w-full">
                                                {data.status === 'brouillon' ? (
                                                    <><Save className="w-4 h-4 mr-2" /> Enregistrer le brouillon</>
                                                ) : (
                                                    <><Send className="w-4 h-4 mr-2" /> Programmer / Envoyer</>
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
