import { Transition } from '@headlessui/react';
import { Form, Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Camera,
    Mail,
    ShoppingBag,
    Settings2,
    AlertCircle,
    CheckCircle2,
    Copy,
    User,
} from 'lucide-react';
import { toast } from 'sonner';
import ParametresController from '@/actions/App/Http/Controllers/Vendor/Settings/ParametresController';
import InputError from '@/components/input-error';
import Heading from '@/components/heading';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { VendorSidebar } from '@/components/VendorSidebar';
import SettingsLayout from '@/layouts/Vendor/settings/layout';
import type { Tenant } from '@/types/tenants/products/vendor/tenant';

export default function VendorProfile({
    tenant,
    mustVerifyEmail,
}: {
    tenant: Tenant;
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage().props;
    const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(
        null,
    );
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [copiedUrl, setCopiedUrl] = useState(false);
    const [activeTab, setActiveTab] = useState('personal');

    const user = auth?.user;
    const userInitials = user?.name
        ? user.name
              .split(' ')
              .map((n: string) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)
        : '?';

    const shopUrl =
        tenant.url ||
        `${tenant.slug}.${window.location.hostname.split('.').slice(-2).join('.')}`;

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
            toast.success('Photo sélectionnée - Enregistrez pour confirmer');
        }
    };

    const copyShopUrl = () => {
        navigator.clipboard.writeText(shopUrl);
        setCopiedUrl(true);
        toast.success('URL de la boutique copiée');
        setTimeout(() => setCopiedUrl(false), 2000);
    };

    return (
        <SidebarProvider
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 72)',
                    '--header-height': 'calc(var(--spacing) * 12)',
                } as React.CSSProperties
            }
        >
            <Head title={`Profil - ${tenant.raison_sociale}`} />
            <VendorSidebar tenant={tenant} />
            <SidebarInset>
                <SiteHeader />
                <SettingsLayout>
                    <div className="max-w-5xl space-y-6">
                        {/* En-tête principal */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <div>
                                <Heading
                                    variant="small"
                                    title="Profil"
                                    description="Gérez votre profil personnel et les détails de votre boutique"
                                />
                            </div>
                        </motion.div>

                        {/* Onglets */}
                        <Tabs
                            value={activeTab}
                            onValueChange={setActiveTab}
                            className="w-full"
                        >
                            <TabsList className="grid w-full max-w-md grid-cols-2">
                                <TabsTrigger
                                    value="personal"
                                    className="flex items-center gap-2"
                                >
                                    <User className="h-4 w-4" />
                                    Profil personnel
                                </TabsTrigger>
                                <TabsTrigger
                                    value="shop"
                                    className="flex items-center gap-2"
                                >
                                    <ShoppingBag className="h-4 w-4" />
                                    Ma boutique
                                </TabsTrigger>
                            </TabsList>

                            {/* Onglet: Profil personnel */}
                            <TabsContent value="personal" className="space-y-6">
                                <Form
                                    {...ParametresController.update.form()}
                                    className="space-y-6"
                                    encType="multipart/form-data"
                                    options={{ preserveScroll: true }}
                                >
                                    {({
                                        processing,
                                        recentlySuccessful,
                                        errors,
                                    }) => (
                                        <Card className="border-slate-200/80 bg-white/95 shadow-sm shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-950/80">
                                            <div className="border-b border-slate-200/70 px-5 py-6 sm:px-6 dark:border-slate-800">
                                                <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
                                                    <div className="relative">
                                                        <Avatar className="h-28 w-28 border-4 border-white shadow-xl ring-1 shadow-slate-900/10 ring-slate-200 dark:border-slate-950 dark:ring-slate-800">
                                                            <AvatarImage
                                                                src={
                                                                    avatarPreviewUrl ||
                                                                    user?.avatar_url ||
                                                                    user?.avatar
                                                                }
                                                            />
                                                            <AvatarFallback className="bg-slate-900 text-xl font-semibold text-white dark:bg-emerald-600">
                                                                {userInitials}
                                                            </AvatarFallback>
                                                        </Avatar>

                                                        <label
                                                            htmlFor="avatar"
                                                            className="absolute right-1 bottom-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-slate-950 text-white shadow-lg transition hover:bg-emerald-600 dark:border-slate-950"
                                                        >
                                                            <input
                                                                id="avatar"
                                                                name="avatar"
                                                                type="file"
                                                                accept="image/jpeg,image/png,image/webp,image/gif"
                                                                className="sr-only"
                                                                onChange={
                                                                    handleAvatarChange
                                                                }
                                                            />
                                                            <Camera className="h-4 w-4" />
                                                        </label>
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                            <div className="min-w-0">
                                                                <h2 className="truncate text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                                                                    {user?.name}
                                                                </h2>
                                                                <p className="mt-1 truncate text-sm text-slate-500 dark:text-slate-400">
                                                                    {
                                                                        user?.email
                                                                    }
                                                                </p>
                                                            </div>

                                                            {user?.email_verified_at ? (
                                                                <Badge className="bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900">
                                                                    <CheckCircle2 className="mr-1 h-3 w-3" />
                                                                    Email
                                                                    vérifié
                                                                </Badge>
                                                            ) : (
                                                                <Badge className="bg-amber-50 text-amber-700 ring-1 ring-amber-200 hover:bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900">
                                                                    <AlertCircle className="mr-1 h-3 w-3" />
                                                                    Email non
                                                                    vérifié
                                                                </Badge>
                                                            )}
                                                        </div>

                                                        <p className="mt-4 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                                            {selectedFile
                                                                ? `${selectedFile.name} sélectionné. Enregistrez pour confirmer.`
                                                                : 'Ajoutez une photo nette au format JPG, PNG, WebP ou GIF.'}
                                                        </p>
                                                        <InputError
                                                            message={
                                                                errors.avatar
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Settings2 className="h-5 w-5" />
                                                    Informations personnelles
                                                </CardTitle>
                                                <CardDescription>
                                                    Modifiez les informations
                                                    visibles sur votre compte.
                                                </CardDescription>
                                            </CardHeader>

                                            <CardContent className="space-y-6">
                                                <div className="grid gap-6 md:grid-cols-2">
                                                    <div className="grid gap-2">
                                                        <Label
                                                            htmlFor="name"
                                                            className="text-sm font-medium"
                                                        >
                                                            Nom complet
                                                        </Label>
                                                        <Input
                                                            id="name"
                                                            name="name"
                                                            defaultValue={
                                                                user?.name
                                                            }
                                                            placeholder="Votre nom"
                                                            className="h-10"
                                                            required
                                                        />
                                                        <InputError
                                                            message={
                                                                errors.name
                                                            }
                                                        />
                                                    </div>

                                                    <div className="grid gap-2">
                                                        <Label
                                                            htmlFor="email"
                                                            className="flex items-center gap-2 text-sm font-medium"
                                                        >
                                                            <Mail className="h-4 w-4" />
                                                            Email
                                                        </Label>
                                                        <Input
                                                            id="email"
                                                            type="email"
                                                            name="email"
                                                            defaultValue={
                                                                user?.email
                                                            }
                                                            placeholder="votre@email.com"
                                                            className="h-10"
                                                            required
                                                        />
                                                        <InputError
                                                            message={
                                                                errors.email
                                                            }
                                                        />
                                                    </div>
                                                </div>

                                                {mustVerifyEmail &&
                                                    !user?.email_verified_at && (
                                                        <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
                                                            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                                                            <div className="flex-1">
                                                                <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                                                                    Email non
                                                                    vérifié
                                                                </p>
                                                                <p className="mt-1 text-xs text-amber-800 dark:text-amber-200">
                                                                    Vérifiez
                                                                    votre
                                                                    adresse
                                                                    email pour
                                                                    accéder à
                                                                    toutes les
                                                                    fonctionnalités.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}

                                                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
                                                    <Button
                                                        disabled={processing}
                                                        className="h-10 gap-2 bg-slate-950 px-4 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                                                    >
                                                        Enregistrer
                                                    </Button>

                                                    <Transition
                                                        show={
                                                            recentlySuccessful
                                                        }
                                                        enter="transition ease-in-out duration-200"
                                                        enterFrom="opacity-0"
                                                        leave="transition ease-in-out duration-200"
                                                        leaveTo="opacity-0"
                                                    >
                                                        <p className="flex items-center gap-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                                            <CheckCircle2 className="h-4 w-4" />
                                                            Modifications
                                                            sauvegardées
                                                        </p>
                                                    </Transition>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                </Form>
                            </TabsContent>

                            {/* Onglet: Ma boutique */}
                            <TabsContent value="shop" className="space-y-6">
                                {/* Carte avec logo */}
                                <Card className="overflow-hidden border-emerald-200/50 dark:border-emerald-900/20">
                                    <div className="h-32 bg-gradient-to-r from-emerald-50 via-emerald-100/50 to-white dark:from-emerald-950/40 dark:via-emerald-900/20 dark:to-slate-900" />

                                    <CardContent className="pt-6">
                                        <div className="flex items-start gap-8">
                                            {/* Logo */}
                                            <div className="relative -mt-20">
                                                <Avatar className="h-40 w-40 border-4 border-white shadow-xl dark:border-slate-900">
                                                    <AvatarImage
                                                        src={tenant.logo_url}
                                                    />
                                                    <AvatarFallback className="bg-emerald-500 text-3xl font-bold text-white">
                                                        {
                                                            tenant
                                                                .raison_sociale[0]
                                                        }
                                                    </AvatarFallback>
                                                </Avatar>
                                            </div>

                                            {/* Infos boutique */}
                                            <div className="flex-1 pt-6">
                                                <div>
                                                    <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                                                        {tenant.raison_sociale}
                                                    </h2>
                                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                                        {tenant.type_entite &&
                                                            `Type: ${tenant.type_entite}`}
                                                    </p>
                                                </div>

                                                {/* URL Boutique */}
                                                <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                                                    <p className="mb-2 text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                                        URL de votre boutique
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <code className="flex-1 font-mono text-sm break-all text-slate-900 dark:text-slate-100">
                                                            {shopUrl}
                                                        </code>
                                                        <button
                                                            onClick={
                                                                copyShopUrl
                                                            }
                                                            className="rounded-lg p-2 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700"
                                                        >
                                                            {copiedUrl ? (
                                                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                                            ) : (
                                                                <Copy className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Badges */}
                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    {tenant.email_verified_at ||
                                                    tenant.statut ===
                                                        'actif' ? (
                                                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                                                            <CheckCircle2 className="mr-1 h-3 w-3" />
                                                            Actif
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                                                            <AlertCircle className="mr-1 h-3 w-3" />
                                                            En attente de
                                                            vérification
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Réglages boutique */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <ShoppingBag className="h-5 w-5" />
                                            Réglages boutique
                                        </CardTitle>
                                        <CardDescription>
                                            Les informations commerciales, le
                                            logo et les coordonnées se modifient
                                            dans l'espace boutique.
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                                {tenant.raison_sociale}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                {tenant.telephone ||
                                                    tenant.email ||
                                                    'Coordonnées de boutique'}
                                            </p>
                                        </div>

                                        <Button
                                            asChild
                                            variant="outline"
                                            className="h-10"
                                        >
                                            <a href={route('vendor.settings')}>
                                                Ouvrir les paramètres
                                            </a>
                                        </Button>
                                    </CardContent>
                                </Card>

                                {/* Informations supplémentaires */}
                                <div className="grid gap-4 md:grid-cols-2">
                                    {/* SIRET/RCCM */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-base">
                                                Documents légaux
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div>
                                                <p className="mb-1 text-xs font-semibold text-slate-500 uppercase dark:text-slate-400">
                                                    RCCM
                                                </p>
                                                <p className="font-mono text-sm text-slate-900 dark:text-slate-100">
                                                    {tenant.siret ||
                                                        'Non renseigné'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="mb-1 text-xs font-semibold text-slate-500 uppercase dark:text-slate-400">
                                                    Type d'entité
                                                </p>
                                                <Badge variant="outline">
                                                    {tenant.type_entite}
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Abonnement */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-base">
                                                Abonnement
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <div>
                                                <p className="mb-1 text-xs font-semibold text-slate-500 uppercase dark:text-slate-400">
                                                    Statut
                                                </p>
                                                <Badge
                                                    className={
                                                        tenant.statut ===
                                                        'actif'
                                                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                                                            : 'bg-slate-100 text-slate-700'
                                                    }
                                                >
                                                    {tenant.statut === 'actif'
                                                        ? 'Actif'
                                                        : 'Inactif'}
                                                </Badge>
                                            </div>
                                            <div>
                                                <p className="mb-1 text-xs font-semibold text-slate-500 uppercase dark:text-slate-400">
                                                    Plan
                                                </p>
                                                <p className="text-sm text-slate-900 dark:text-slate-100">
                                                    {tenant.plan_id
                                                        ? 'Plan actif'
                                                        : 'Pas de plan'}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </SettingsLayout>
            </SidebarInset>
        </SidebarProvider>
    );
}
