/* eslint-disable @typescript-eslint/no-unused-vars */
import { Transition } from '@headlessui/react';
import { Form, Head, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Camera,
    Mail,
    ShoppingBag,
    Settings2,
    AlertCircle,
    CheckCircle2,
    Copy,
    User,
    Sparkles,
    Building2,
    Globe,
    ShieldCheck,
    CreditCard,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import ParametresController from '@/actions/App/Http/Controllers/Vendor/Settings/ParametresController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { SiteHeader } from '@/components/site-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VendorSidebar } from '@/components/VendorSidebar';
import SettingsLayout from '@/layouts/Vendor/settings/layout';
import { getToastStyles } from '@/lib/toast-style';
import type { Tenant } from '@/types/tenants/products/vendor/tenant';

const cardAnimation: {
    initial: Record<string, number>;
    animate: Record<string, number>;
    transition: { duration: number; ease: [number, number, number, number] };
} = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }, // courbe de Bézier standard
};

export default function VendorProfile({
    tenant,
    mustVerifyEmail,
    status,
    isOwner = false,
}: {
    tenant: Tenant;
    mustVerifyEmail: boolean;
    status?: string;
    isOwner?: boolean;
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
            reader.onloadend = () =>
                setAvatarPreviewUrl(reader.result as string);
            reader.readAsDataURL(file);
            toast.success('Photo sélectionnée - Enregistrez pour confirmer', {
                style: getToastStyles('success'),
            });
        }
    };

    const copyShopUrl = () => {
        navigator.clipboard.writeText(shopUrl);
        setCopiedUrl(true);
        toast.success('URL de la boutique copiée', {
            style: getToastStyles('success'),
        });
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
                    <div className="relative min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-100 dark:from-transparent dark:via-transparent dark:to-transparent">
                        <div className="relative z-10 mx-auto max-w-5xl space-y-6 px-4 py-6">
                            {/* En-tête modernisé */}
                            <motion.div
                                {...cardAnimation}
                                className="space-y-4"
                            >
                                <div>
                                    <Badge className="mb-2 inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-0.5 text-xs font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                                        <Sparkles className="h-3 w-3" />
                                        Profil
                                    </Badge>
                                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                                        {isOwner
                                            ? 'Gérez votre profil personnel et votre boutique'
                                            : 'Gérez votre profil personnel'}
                                    </h1>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                        Mettez à jour vos informations et
                                        personnalisez votre espace.
                                    </p>
                                </div>
                            </motion.div>

                            {/* Onglets */}
                            <Tabs
                                value={activeTab}
                                onValueChange={setActiveTab}
                                className="w-full"
                            >
                                {isOwner && (
                                    <TabsList className="mb-6 grid w-full max-w-md grid-cols-2 rounded bg-white/60 p-1 dark:border-slate-800/60 dark:bg-slate-900/60">
                                        <TabsTrigger
                                            value="personal"
                                            className="flex items-center gap-2 rounded text-sm data-[state=active]:bg-white data-[state=active]:text-emerald-700 dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-emerald-400"
                                        >
                                            <User className="h-4 w-4" />
                                            Profil personnel
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="shop"
                                            className="flex items-center gap-2 rounded text-sm data-[state=active]:bg-white data-[state=active]:text-emerald-700 dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-emerald-400"
                                        >
                                            <ShoppingBag className="h-4 w-4" />
                                            Ma boutique
                                        </TabsTrigger>
                                    </TabsList>
                                )}

                                {/* Onglet: Profil personnel */}
                                <TabsContent
                                    value="personal"
                                    className="mt-0 space-y-8"
                                >
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
                                            <motion.div {...cardAnimation}>
                                                <Card className="overflow-hidden border-0 bg-white/70 dark:bg-slate-900/70">
                                                    {/* Avatar + nom */}
                                                    <div className="flex flex-col items-center gap-6 border-b border-slate-100 p-6 sm:flex-row dark:border-slate-800">
                                                        <div className="relative">
                                                            <Avatar className="h-24 w-24 border-4 border-white dark:border-slate-900">
                                                                <AvatarImage
                                                                    src={
                                                                        avatarPreviewUrl ||
                                                                        user?.avatar_url ||
                                                                        user?.avatar
                                                                    }
                                                                />
                                                                <AvatarFallback className="bg-slate-900 text-xl font-semibold text-white dark:bg-emerald-600">
                                                                    {
                                                                        userInitials
                                                                    }
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <label
                                                                htmlFor="avatar"
                                                                className="absolute right-0 bottom-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-slate-950 text-white shadow-lg transition hover:bg-emerald-600 dark:border-slate-900"
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
                                                                <Camera className="h-3.5 w-3.5" />
                                                            </label>
                                                        </div>
                                                        <div className="min-w-0 flex-1 text-center sm:text-left">
                                                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                                                                {user?.name}
                                                            </h2>
                                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                                {user?.email}
                                                            </p>
                                                            <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
                                                                {user?.email_verified_at ? (
                                                                    <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
                                                                        <CheckCircle2 className="mr-1 h-3 w-3" />
                                                                        Email
                                                                        vérifié
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge className="border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-400">
                                                                        <AlertCircle className="mr-1 h-3 w-3" />
                                                                        Email
                                                                        non
                                                                        vérifié
                                                                    </Badge>
                                                                )}
                                                                {selectedFile && (
                                                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                                                        {
                                                                            selectedFile.name
                                                                        }{' '}
                                                                        sélectionné
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <InputError
                                                                message={
                                                                    errors.avatar
                                                                }
                                                            />
                                                        </div>
                                                    </div>

                                                    <CardHeader>
                                                        <CardTitle className="flex items-center gap-2 text-lg">
                                                            <Settings2 className="h-5 w-5 text-emerald-500" />
                                                            Informations
                                                            personnelles
                                                        </CardTitle>
                                                        <CardDescription>
                                                            Modifiez les
                                                            informations
                                                            visibles sur votre
                                                            compte.
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
                                                                    className="h-10 rounded-xl"
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
                                                                    className="h-10 rounded-xl"
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
                                                                <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
                                                                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                                                                    <div className="flex-1">
                                                                        <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                                                                            Email
                                                                            non
                                                                            vérifié
                                                                        </p>
                                                                        <p className="mt-1 text-xs text-amber-800 dark:text-amber-200">
                                                                            Vérifiez
                                                                            votre
                                                                            adresse
                                                                            email
                                                                            pour
                                                                            accéder
                                                                            à
                                                                            toutes
                                                                            les
                                                                            fonctionnalités.
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            )}

                                                        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
                                                            <Button
                                                                disabled={
                                                                    processing
                                                                }
                                                                className="h-10 gap-2 rounded-xl bg-slate-900 px-5 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                                                            >
                                                                Enregistrer les
                                                                modifications
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
                                            </motion.div>
                                        )}
                                    </Form>
                                </TabsContent>

                                {/* Onglet: Ma boutique */}
                                {isOwner && (
                                    <TabsContent
                                        value="shop"
                                        className="mt-0 space-y-6"
                                    >
                                        {/* Carte principale boutique */}
                                        <motion.div {...cardAnimation}>
                                            <Card className="overflow-hidden border-0 bg-white/70 shadow-lg shadow-slate-200/20 backdrop-blur-xl dark:bg-slate-900/70 dark:shadow-black/20">
                                                <div className="h-8 bg-linear-to-r from-emerald-500/20 to-transparent dark:from-transparent dark:to-transparent" />
                                                <CardContent className="pt-0">
                                                    <div className="flex flex-col gap-6 sm:flex-row">
                                                        <div className="relative -mt-12 flex justify-center sm:justify-start">
                                                            <Avatar className="h-28 w-28 border-4 border-white dark:border-slate-900">
                                                                <AvatarImage
                                                                    src={
                                                                        tenant?.logo_url ??
                                                                        avatarPreviewUrl ??
                                                                        undefined
                                                                    }
                                                                />
                                                                <AvatarFallback className="bg-emerald-500 text-2xl font-bold text-white">
                                                                    {
                                                                        tenant
                                                                            .raison_sociale[0]
                                                                    }
                                                                </AvatarFallback>
                                                            </Avatar>
                                                        </div>
                                                        <div className="flex-1 space-y-4 pt-2 sm:pt-6">
                                                            <div>
                                                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                                                    {
                                                                        tenant.raison_sociale
                                                                    }
                                                                </h2>
                                                                {tenant.type_entite && (
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="mt-1"
                                                                    >
                                                                        {
                                                                            tenant.type_entite
                                                                        }
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            {/* URL boutique */}
                                                            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-800/50">
                                                                <p className="mb-1 text-xs font-semibold text-slate-500 uppercase dark:text-slate-400">
                                                                    URL de la
                                                                    boutique
                                                                </p>
                                                                <div className="flex items-center gap-2">
                                                                    <Globe className="h-4 w-4 text-emerald-500" />
                                                                    <code className="flex-1 truncate font-mono text-sm text-slate-900 dark:text-slate-100">
                                                                        {
                                                                            shopUrl
                                                                        }
                                                                    </code>
                                                                    <button
                                                                        onClick={
                                                                            copyShopUrl
                                                                        }
                                                                        className="shrink-0 rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700"
                                                                    >
                                                                        {copiedUrl ? (
                                                                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                                                        ) : (
                                                                            <Copy className="h-4 w-4" />
                                                                        )}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>

                                        {/* Réglages rapides */}
                                        <motion.div
                                            {...cardAnimation}
                                            transition={{ delay: 0.1 }}
                                        >
                                            <Card className="border-0 bg-white/70 shadow-lg shadow-slate-200/20 backdrop-blur-xl dark:bg-slate-900/70 dark:shadow-black/20">
                                                <CardContent className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                            <Settings2 className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-slate-900 dark:text-white">
                                                                Paramètres de la
                                                                boutique
                                                            </h3>
                                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                                Modifiez le
                                                                logo, les
                                                                informations
                                                                commerciales et
                                                                plus.
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        asChild
                                                        className="rounded-xl bg-emerald-600 hover:bg-emerald-700"
                                                    >
                                                        <a
                                                            href={route(
                                                                'vendor.settings',
                                                            )}
                                                        >
                                                            Ouvrir les
                                                            paramètres
                                                        </a>
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        </motion.div>

                                        {/* Cartes légales & abonnement */}
                                        <div className="grid gap-6 md:grid-cols-2">
                                            <motion.div
                                                {...cardAnimation}
                                                transition={{ delay: 0.15 }}
                                            >
                                                <Card className="border-0 bg-white/70 shadow-lg shadow-slate-200/20 backdrop-blur-xl dark:bg-slate-900/70 dark:shadow-black/20">
                                                    <CardHeader>
                                                        <CardTitle className="flex items-center gap-2 text-base">
                                                            <ShieldCheck className="h-5 w-5 text-emerald-500" />
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
                                                                {
                                                                    tenant.type_entite
                                                                }
                                                            </Badge>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>

                                            <motion.div
                                                {...cardAnimation}
                                                transition={{ delay: 0.2 }}
                                            >
                                                <Card className="border-0 bg-white/70 shadow-lg shadow-slate-200/20 backdrop-blur-xl dark:bg-slate-900/70 dark:shadow-black/20">
                                                    <CardHeader>
                                                        <CardTitle className="flex items-center gap-2 text-base">
                                                            <CreditCard className="h-5 w-5 text-emerald-500" />
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
                                                                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                                                }
                                                            >
                                                                {tenant.statut ===
                                                                'actif'
                                                                    ? 'Actif'
                                                                    : 'Inactif'}
                                                            </Badge>
                                                        </div>
                                                        <div>
                                                            <p className="mb-1 text-xs font-semibold text-slate-500 uppercase dark:text-slate-400">
                                                                Plan
                                                            </p>
                                                            <p className="text-sm text-slate-900 dark:text-slate-100">
                                                                {tenant.plan
                                                                    ?.name ??
                                                                    'Aucun plan'}
                                                            </p>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        </div>
                                    </TabsContent>
                                )}
                            </Tabs>
                        </div>
                    </div>
                </SettingsLayout>
            </SidebarInset>
        </SidebarProvider>
    );
}
