/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/Pages/Vendor/Settings.tsx
import { Head, useForm, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Store,
    Mail,
    Phone,
    Globe,
    Camera,
    Save,
    Loader2,
    ArrowLeft,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { SiteHeader } from '@/components/site-header';
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
import { Textarea } from '@/components/ui/textarea';
import { VendorSidebar } from '@/components/VendorSidebar';
import getToastStyle from '@/lib/toast-style';

interface Props {
    tenant: {
        id: string;
        raison_sociale: string;
        slug: string;
        description: string | null;
        email: string;
        telephone: string | null;
        logo_url?: string;
        facebook_url?: string;
        instagram_url?: string;
        twitter_url?: string;
        youtube_url?: string;
        tiktok_url?: string;
        admin_url: string;
        url: string;
        is_active: boolean;
        plan?: { name: string; price: number; currency: string };
    };
}

export default function VendorSettings({ tenant }: Props) {
    const [logoPreview, setLogoPreview] = useState<string | null>(
        tenant.logo_url ?? null,
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        raison_sociale: tenant.raison_sociale,
        description: tenant.description ?? '',
        email: tenant.email,
        telephone: tenant.telephone ?? '',
        logo: null as File | null,
        facebook_url: tenant.facebook_url ?? '',
        instagram_url: tenant.instagram_url ?? '',
        twitter_url: tenant.twitter_url ?? '',
        youtube_url: tenant.youtube_url ?? '',
        tiktok_url: tenant.tiktok_url ?? '',
        _method: 'PUT',
    });

    // Après la déclaration du useForm (ou juste avant le return)
    const socialFields: Array<{ label: string; key: keyof typeof data }> = [
        { label: 'Facebook', key: 'facebook_url' },
        { label: 'Instagram', key: 'instagram_url' },
        { label: 'Twitter', key: 'twitter_url' },
        { label: 'YouTube', key: 'youtube_url' },
        { label: 'TikTok', key: 'tiktok_url' },
    ];

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setData('logo', file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('tenant.vendor.settings.update'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Paramètres enregistrés avec succès', {
                    style: getToastStyle('success'),
                });
            },
        });
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
            <VendorSidebar tenant={tenant} />
            <SidebarInset>
                <SiteHeader />
                <div className="min-h-screen bg-white dark:bg-slate-950">
                    <Head title={`Paramètres - ${tenant.raison_sociale}`} />
                    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="mb-8 flex items-center gap-4">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    asChild
                                    className="text-slate-500 hover:text-slate-800 dark:hover:text-white"
                                >
                                    <a href={route('vendor.dashboard')}>
                                        <ArrowLeft className="h-5 w-5" />
                                    </a>
                                </Button>
                                <div>
                                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                                        Paramètres
                                    </h1>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        Gérez les informations de votre boutique
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <Card className="border-slate-200 dark:border-slate-700">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                                            <Store className="h-5 w-5" />{' '}
                                            Informations générales
                                        </CardTitle>
                                        <CardDescription>
                                            Modifiez les détails publics de
                                            votre boutique.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            <div>
                                                <Label htmlFor="raison_sociale">
                                                    Nom de la boutique *
                                                </Label>
                                                <Input
                                                    id="raison_sociale"
                                                    value={data.raison_sociale}
                                                    onChange={(e) =>
                                                        setData(
                                                            'raison_sociale',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="mt-1"
                                                    required
                                                />
                                                {errors.raison_sociale && (
                                                    <p className="mt-1 text-sm text-red-500">
                                                        {errors.raison_sociale}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <Label htmlFor="email">
                                                    Email de contact *
                                                </Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) =>
                                                        setData(
                                                            'email',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="mt-1"
                                                    required
                                                />
                                                {errors.email && (
                                                    <p className="mt-1 text-sm text-red-500">
                                                        {errors.email}
                                                    </p>
                                                )}
                                            </div>
                                            <div>
                                                <Label htmlFor="telephone">
                                                    Téléphone
                                                </Label>
                                                <Input
                                                    id="telephone"
                                                    type="tel"
                                                    value={data.telephone}
                                                    onChange={(e) =>
                                                        setData(
                                                            'telephone',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="mt-1"
                                                />
                                                {errors.telephone && (
                                                    <p className="mt-1 text-sm text-red-500">
                                                        {errors.telephone}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="description">
                                                Description
                                            </Label>
                                            <Textarea
                                                id="description"
                                                value={data.description}
                                                onChange={(e) =>
                                                    setData(
                                                        'description',
                                                        e.target.value,
                                                    )
                                                }
                                                className="mt-1"
                                                rows={4}
                                                maxLength={500}
                                            />
                                            <p className="mt-1 text-xs text-slate-400">
                                                {data.description.length}/500
                                            </p>
                                        </div>

                                        <div>
                                            <Label>Logo</Label>
                                            <div className="mt-2 flex items-center gap-6">
                                                <div className="relative h-24 w-24 overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800">
                                                    {logoPreview ? (
                                                        <img
                                                            src={logoPreview}
                                                            alt="Logo"
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center text-slate-400">
                                                            <Camera className="h-8 w-8" />
                                                        </div>
                                                    )}
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={
                                                            handleLogoChange
                                                        }
                                                        className="absolute inset-0 cursor-pointer opacity-0"
                                                    />
                                                </div>
                                                <p className="text-sm text-slate-500">
                                                    PNG, JPG ou WebP. Max 2 Mo.
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="mt-6 border-slate-200 dark:border-slate-700">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                                            <Globe className="h-5 w-5" />{' '}
                                            Réseaux sociaux
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        {socialFields.map(({ label, key }) => (
                                            <div key={key}>
                                                <Label htmlFor={key}>
                                                    {label}
                                                </Label>
                                                <Input
                                                    id={key}
                                                    type="url"
                                                    value={data[key] as string}
                                                    onChange={(e) =>
                                                        setData(
                                                            key,
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="mt-1"
                                                    placeholder={`https://${label.toLowerCase()}.com/votre-pseudo`}
                                                />
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>

                                <div className="mt-8 flex justify-end">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="gap-2 bg-emerald-600 shadow-sm shadow-emerald-200 hover:bg-emerald-700 dark:shadow-emerald-900/20"
                                    >
                                        {processing ? (
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        ) : (
                                            <Save className="h-5 w-5" />
                                        )}
                                        {processing
                                            ? 'Enregistrement...'
                                            : 'Enregistrer les modifications'}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
