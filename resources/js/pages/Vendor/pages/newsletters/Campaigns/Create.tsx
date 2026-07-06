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
import { cn } from '@/lib/utils';
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
                    <Head title="Créer une campagne" />
                    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
                        <div className="flex items-center gap-4">
                            <Link href={route('vendor.newsletters.campaigns.index')}>
                                <Button variant="outline" size="icon" className="rounded-xl border-slate-200/60 hover:bg-slate-100 dark:border-slate-800/60 dark:hover:bg-slate-800">
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
                                    <Card className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
                                        <CardHeader>
                                            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Informations principales</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="titre" className="text-slate-700 dark:text-slate-300">Nom de la campagne (interne)</Label>
                                                <Input
                                                    id="titre"
                                                    placeholder="Ex: Newsletter Printemps 2026"
                                                    value={data.titre}
                                                    onChange={(e) => setData('titre', e.target.value)}
                                                    className="bg-white/50 dark:bg-slate-950/50"
                                                />
                                                {errors.titre && <p className="text-sm text-red-500">{errors.titre}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="sujet" className="text-slate-700 dark:text-slate-300">Sujet de l'email</Label>
                                                <Input
                                                    id="sujet"
                                                    placeholder="Ex: Découvrez nos nouvelles offres"
                                                    value={data.sujet}
                                                    onChange={(e) => setData('sujet', e.target.value)}
                                                    className="bg-white/50 dark:bg-slate-950/50"
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
                                                    placeholder='<h2>Bonjour {{prenom}},</h2><p>Voici nos nouveautés...</p>'
                                                    className="font-mono h-64 bg-white/50 dark:bg-slate-950/50"
                                                    value={data.contenu_html}
                                                    onChange={(e) => setData('contenu_html', e.target.value)}
                                                />
                                                {errors.contenu_html && <p className="text-sm text-red-500">{errors.contenu_html}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="contenu_text" className="text-slate-700 dark:text-slate-300">Contenu Texte brut (Optionnel)</Label>
                                                <Textarea
                                                    id="contenu_text"
                                                    placeholder="Bonjour {{prenom}}, Voici nos nouveautés..."
                                                    className="font-mono h-32 bg-white/50 dark:bg-slate-950/50"
                                                    value={data.contenu_text}
                                                    onChange={(e) => setData('contenu_text', e.target.value)}
                                                />
                                                <p className="text-xs text-slate-500">Variables disponibles : {'{{prenom}}'}, {'{{nom}}'}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="flex flex-col gap-6">
                                    <Card className="rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
                                        <CardHeader>
                                            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">Publication</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="status" className="text-slate-700 dark:text-slate-300">Statut</Label>
                                                <Select value={data.status} onValueChange={(val) => setData('status', val)}>
                                                    <SelectTrigger className="bg-white/50 dark:bg-slate-950/50">
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
                                                <div className="space-y-2 pt-4 mt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                                                    <Label htmlFor="scheduled_at" className="text-slate-700 dark:text-slate-300">Date et heure d'envoi</Label>
                                                    <Input
                                                        type="datetime-local"
                                                        id="scheduled_at"
                                                        value={data.scheduled_at}
                                                        onChange={(e) => setData('scheduled_at', e.target.value)}
                                                        className="bg-white/50 dark:bg-slate-950/50"
                                                    />
                                                    {errors.scheduled_at && <p className="text-sm text-red-500">{errors.scheduled_at}</p>}
                                                </div>
                                            )}
                                        </CardContent>
                                        <CardFooter className="bg-slate-50/50 dark:bg-slate-900/50 flex gap-2 rounded-b-2xl border-t border-slate-200/60 dark:border-slate-800/60 p-5">
                                            <Button type="submit" disabled={processing} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20">
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
