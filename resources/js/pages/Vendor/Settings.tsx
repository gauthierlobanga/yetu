// resources/js/Pages/Vendor/Settings.tsx
'use client';

import { Head, Link, useForm } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertCircle,
    ArrowLeft,
    Camera,
    CheckCircle2,
    ExternalLink,
    Globe,
    Link as LinkIcon,
    Loader2,
    Save,
    ShieldCheck,
    Store,
    UploadCloud,
    X,
    CalendarIcon,
    MapPin,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { DragEvent } from 'react';
import { toast } from 'sonner';

import { update as updateVendorSettings } from '@/actions/App/Http/Controllers/Vendor/Vendeurs/VendorSettingsController';
import { SiteHeader } from '@/components/site-header';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Textarea } from '@/components/ui/textarea';
import { VendorSidebar } from '@/components/VendorSidebar';

import getToastStyle from '@/lib/toast-style';
import { cn } from '@/lib/utils';
import type { Tenant } from '@/types/tenants/products/vendor/tenant';

// ---------- Types locaux ----------
interface DocumentType {
    id: string;
    code: string;
    nom: string;
    description?: string;
    autorite_emettrice?: string;
    est_obligatoire: boolean;
    forme_juridique?: string;
}

interface Props {
    tenant: Tenant;
    documentTypes?: DocumentType[];
    existingDocuments?: Record<
        string,
        {
            numero_document: string;
            date_delivrance: string;
            date_expiration: string;
            lieu_delivrance: string;
            autorite_delivrance: string;
        }
    >;
}

// Clés sociales (adresse exclue)
type SocialFieldKey =
    | 'facebook_url'
    | 'instagram_url'
    | 'twitter_url'
    | 'youtube_url'
    | 'tiktok_url';

// ----- Constantes des formes juridiques -----
const FORMES_JURIDIQUES: Record<string, string> = {
    toutes: 'Toutes formes',
    societe_commerciale: 'Société commerciale',
    petit_commercant: 'Petit commerçant',
    organisation_sans_but_lucratif: 'Organisation sans but lucratif',
};

// ----- Petit composant DatePicker -----
function DatePickerField({
    value,
    onChange,
    placeholder = 'Sélectionner une date',
}: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}) {
    const [openState, setOpenState] = useState(false);
    const date = value ? new Date(value + 'T12:00:00') : undefined;

    return (
        <Popover open={openState} onOpenChange={setOpenState}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        'h-11 w-full justify-start rounded-xl border-slate-200 bg-white/80 text-left font-normal shadow-sm backdrop-blur-sm transition-all duration-200',
                        'hover:border-emerald-300 hover:bg-white',
                        'dark:border-slate-700 dark:bg-slate-900/70 dark:hover:border-emerald-700',
                        !date && 'text-slate-400 dark:text-slate-500',
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4 text-emerald-500" />
                    {date ? (
                        date.toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        })
                    ) : (
                        <span>{placeholder}</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-auto rounded-2xl border-slate-200/70 bg-white/95 p-0 shadow-xl backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/95"
                align="start"
            >
                <Calendar
                    mode="single"
                    selected={date}
                    defaultMonth={date || new Date()}
                    captionLayout="dropdown"
                    onSelect={(selected) => {
                        if (selected) {
                            onChange(selected.toISOString().split('T')[0]);
                        } else {
                            onChange('');
                        }

                        setOpenState(false);
                    }}
                    startMonth={new Date(1950, 0)}
                    endMonth={new Date(new Date().getFullYear() + 10, 11)}
                    classNames={{
                        months: 'flex flex-col gap-4 sm:flex-row',
                        month: 'flex flex-col gap-4',
                        caption_label:
                            'flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-200',
                        nav: 'absolute inset-x-0 top-0 flex items-center justify-between gap-1',
                        button_previous: cn(
                            'h-7 w-7 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400',
                        ),
                        button_next: cn(
                            'h-7 w-7 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400',
                        ),
                        weekday:
                            'text-xs font-medium text-slate-400 dark:text-slate-500',
                        day: 'text-sm rounded-lg hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/30 dark:hover:text-emerald-400 aria-selected:bg-emerald-500 aria-selected:text-white dark:aria-selected:bg-emerald-600',
                        day_button:
                            'h-9 w-9 flex items-center justify-center rounded-lg',
                        selected:
                            'bg-emerald-500 text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500',
                        today: 'font-bold text-emerald-600 dark:text-emerald-400',
                        outside: 'text-slate-300 dark:text-slate-600',
                        disabled:
                            'text-slate-300 opacity-50 dark:text-slate-600',
                    }}
                />
            </PopoverContent>
        </Popover>
    );
}

export default function VendorSettings({
    tenant,
    documentTypes = [],
    existingDocuments = {},
}: Props) {
    const [logoPreview, setLogoPreview] = useState<string | null>(
        tenant.logo_url ?? null,
    );
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initialisation des documents légaux
    const initialDocuments = useMemo(() => {
        const docs: Record<string, any> = {};
        documentTypes.forEach((type) => {
            docs[type.id] = existingDocuments[type.id] || {
                type_document_id: type.id,
                numero_document: '',
                date_delivrance: '',
                date_expiration: '',
                lieu_delivrance: '',
                autorite_delivrance: type.autorite_emettrice ?? '', // ← pré-remplissage direct
            };
        });

        return docs;
    }, [documentTypes, existingDocuments]);

    const {
        data,
        setData,
        post,
        processing,
        errors,
        isDirty,
        reset,
        setDefaults,
        recentlySuccessful,
    } = useForm({
        raison_sociale: tenant.raison_sociale ?? '',
        description: tenant.description ?? '',
        email: tenant.email ?? '',
        telephone: tenant.telephone ?? '',
        address: tenant.address ?? '',
        forme_juridique: tenant.type_entite ?? 'toutes',
        logo: null as File | null,
        facebook_url: tenant.facebook_url ?? '',
        instagram_url: tenant.instagram_url ?? '',
        twitter_url: tenant.twitter_url ?? '',
        youtube_url: tenant.youtube_url ?? '',
        tiktok_url: tenant.tiktok_url ?? '',
        remove_logo: false,
        _method: 'PUT',
        documents: initialDocuments,
    });

    // Filtrage des types de documents selon la forme juridique sélectionnée
    const filteredDocumentTypes = useMemo(() => {
        if (!tenant?.id) {
            return [];
        }

        return documentTypes.filter(
            (type) =>
                type.forme_juridique === 'toutes' ||
                type.forme_juridique === data.forme_juridique ||
                !type.forme_juridique,
        );
    }, [documentTypes, data.forme_juridique, tenant]);

    // Pré-remplissage automatique de l'autorité de délivrance pour les documents affichés
    useEffect(() => {
        let hasChanges = false;
        const updatedDocs = { ...data.documents };

        filteredDocumentTypes.forEach((type) => {
            const doc = updatedDocs[type.id];

            // Si le document existe et que l'autorité de délivrance n'est pas encore renseignée,
            // on la pré-remplit avec l'autorité émettrice du type de document
            if (
                doc &&
                (!doc.autorite_delivrance ||
                    doc.autorite_delivrance.trim() === '') &&
                type.autorite_emettrice
            ) {
                updatedDocs[type.id] = {
                    ...doc,
                    autorite_delivrance: type.autorite_emettrice,
                };
                hasChanges = true;
            }
        });

        if (hasChanges) {
            setData('documents', updatedDocs);
        }
    }, [data.documents, filteredDocumentTypes, setData]); // Déclenché quand la liste filtrée change (forme juridique modifiée)

    // Liste des champs sociaux – sans l'adresse
    const socialFields: Array<{
        label: string;
        key: SocialFieldKey;
        placeholder: string;
    }> = [
        {
            label: 'Facebook',
            key: 'facebook_url',
            placeholder: 'https://facebook.com/votre-page',
        },
        {
            label: 'Instagram',
            key: 'instagram_url',
            placeholder: 'https://instagram.com/votre-compte',
        },
        {
            label: 'Twitter / X',
            key: 'twitter_url',
            placeholder: 'https://x.com/votre-compte',
        },
        {
            label: 'YouTube',
            key: 'youtube_url',
            placeholder: 'https://youtube.com/@votre-chaine',
        },
        {
            label: 'TikTok',
            key: 'tiktok_url',
            placeholder: 'https://tiktok.com/@votre-compte',
        },
    ];

    const inputClass =
        'h-11 rounded-xl border-slate-200 bg-white/80 shadow-xs backdrop-blur-sm ' +
        'transition-all duration-200 placeholder:text-slate-400 ' +
        'hover:border-slate-300 hover:bg-white ' +
        'focus-visible:border-emerald-500 focus-visible:ring-4 ' +
        'focus-visible:ring-emerald-500/10 focus-visible:shadow-md ' +
        'dark:border-slate-700 dark:bg-slate-900/70 dark:hover:border-slate-600 ' +
        'dark:focus-visible:border-emerald-400 dark:focus-visible:ring-emerald-400/10';

    const textareaClass =
        'min-h-[130px] rounded-2xl border-slate-200 bg-white/80 shadow-xs backdrop-blur-sm ' +
        'transition-all duration-200 placeholder:text-slate-400 resize-none ' +
        'hover:border-slate-300 hover:bg-white ' +
        'focus-visible:border-emerald-500 focus-visible:ring-4 ' +
        'focus-visible:ring-emerald-500/10 focus-visible:shadow-md ' +
        'dark:border-slate-700 dark:bg-slate-900/70 dark:hover:border-slate-600 ' +
        'dark:focus-visible:border-emerald-400 dark:focus-visible:ring-emerald-400/10';

    useEffect(() => {
        return () => {
            if (
                logoPreview &&
                logoPreview.startsWith('blob:') &&
                tenant.logo_url !== logoPreview
            ) {
                URL.revokeObjectURL(logoPreview);
            }
        };
    }, [logoPreview, tenant.logo_url]);

    const completion = useMemo(() => {
        const fields = [
            data.raison_sociale,
            data.email,
            data.telephone,
            data.address,
            data.description,
        ];
        const filled = fields.filter(
            (value) => typeof value === 'string' && value.trim() !== '',
        ).length;

        return Math.round((filled / fields.length) * 100);
    }, [data]);

    const handleDrag = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const updateLogo = (file: File | null) => {
        if (!file) {
            return;
        }

        if (!file.type.startsWith('image/')) {
            toast.error('Veuillez sélectionner une image valide.', {
                style: getToastStyle('error'),
            });

            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            toast.error('Le fichier ne doit pas dépasser 2 Mo.', {
                style: getToastStyle('error'),
            });

            return;
        }

        const preview = URL.createObjectURL(file);
        setData('logo', file);
        setData('remove_logo', false);
        setLogoPreview(preview);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];

        if (file) {
            updateLogo(file);
        }
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            updateLogo(file);
        }
    };

    const removeLogo = () => {
        setData('logo', null);
        setData('remove_logo', true);
        setLogoPreview(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(updateVendorSettings.url(), {
            forceFormData: true,
            preserveScroll: true,
            preserveState: true,
            showProgress: false,
            onSuccess: (page) => {
                const updatedTenant = (page.props.tenant ?? tenant) as Tenant;
                const savedData = {
                    ...data,
                    logo: null,
                    remove_logo: false,
                };

                setData('logo', null);
                setData('remove_logo', false);
                setDefaults(savedData);
                setLogoPreview(updatedTenant.logo_url ?? null);

                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }

                toast.success(
                    'Les paramètres ont été enregistrés avec succès.',
                    {
                        style: getToastStyle('success'),
                    },
                );
            },
            onError: () => {
                toast.error('Certaines informations sont invalides.', {
                    style: getToastStyle('error'),
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
            <Head title={`Paramètres - ${tenant.raison_sociale}`} />
            <VendorSidebar tenant={tenant} />
            <SidebarInset>
                <SiteHeader />
                <div className="relative min-h-screen bg-linear-to-b from-slate-50 via-white to-emerald-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="absolute -top-24 right-1/4 h-96 w-96 rounded-full bg-emerald-200/20 blur-3xl dark:bg-emerald-900/20" />
                        <div className="absolute bottom-12 left-1/3 h-64 w-64 rounded-full bg-teal-100/30 blur-2xl dark:bg-teal-900/20" />
                    </div>
                    <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35 }}
                            className="space-y-8"
                        >
                            {/* Header */}
                            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                                <div className="flex items-start gap-4">
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="icon"
                                        className="mt-1 rounded-2xl border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80"
                                    >
                                        <Link href={route('vendor.dashboard')}>
                                            <ArrowLeft className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <div className="space-y-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <Badge className="rounded-full border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
                                                <Store className="mr-1 h-3.5 w-3.5" />
                                                Boutique
                                            </Badge>
                                            {tenant.plan?.name && (
                                                <Badge
                                                    variant="outline"
                                                    className="rounded-full"
                                                >
                                                    {tenant.plan.name}
                                                </Badge>
                                            )}
                                            {tenant.is_active && (
                                                <Badge className="rounded-full border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
                                                    <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                                                    Active
                                                </Badge>
                                            )}
                                        </div>
                                        <div>
                                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                                Paramètres de la boutique
                                            </h1>
                                            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
                                                Configurez votre identité, vos
                                                informations de contact et vos
                                                réseaux sociaux.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <Card className="w-full max-w-sm rounded-3xl border-slate-200/70 bg-white/80 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
                                    <CardContent className="p-5">
                                        <div className="mb-3 flex items-center justify-between">
                                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                                Profil complété
                                            </span>
                                            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                                {completion}%
                                            </span>
                                        </div>
                                        <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                            <div
                                                className="h-full rounded-full bg-linear-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                                                style={{
                                                    width: `${completion}%`,
                                                }}
                                            />
                                        </div>
                                        <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                            Informations sécurisées et
                                            sauvegardées.
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Unsaved changes banner */}
                            <AnimatePresence>
                                {isDirty && !recentlySuccessful && (
                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            y: 8,
                                            height: 0,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                            height: 'auto',
                                        }}
                                        exit={{ opacity: 0, y: -8, height: 0 }}
                                        transition={{ duration: 0.25 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="flex items-start gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/90 px-4 py-3 shadow-sm backdrop-blur-sm dark:border-amber-900/40 dark:bg-amber-950/20">
                                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                                                <AlertCircle className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                                                    Vous avez des modifications
                                                    non enregistrées
                                                </p>
                                                <p className="mt-1 text-xs leading-5 text-amber-700 dark:text-amber-300/90">
                                                    Pensez à enregistrer vos
                                                    changements afin qu'ils
                                                    soient pris en compte sur
                                                    votre boutique.
                                                </p>
                                            </div>
                                            <Button
                                                type="submit"
                                                size="sm"
                                                disabled={processing}
                                                className="h-8 rounded-lg bg-amber-600 px-3 text-xs font-medium text-white hover:bg-amber-700"
                                            >
                                                {processing ? (
                                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                ) : (
                                                    'Enregistrer'
                                                )}
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Informations générales */}
                                <Card className="overflow-hidden border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70">
                                    <CardHeader className="border-b border-slate-100 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/60">
                                        <CardTitle className="flex items-center gap-3 text-lg font-semibold text-slate-900 dark:text-white">
                                            <div className="rounded-xl bg-emerald-100 p-2 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                <Store className="h-5 w-5" />
                                            </div>
                                            Informations générales
                                        </CardTitle>
                                        <CardDescription>
                                            Ces informations seront affichées
                                            sur votre boutique.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-8 p-6">
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            <div className="space-y-2.5">
                                                <Label
                                                    htmlFor="raison_sociale"
                                                    className="text-sm font-medium text-slate-700 dark:text-slate-300"
                                                >
                                                    Nom de la boutique
                                                    <span className="ml-1 text-red-500">
                                                        *
                                                    </span>
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
                                                    placeholder="Ex. Uzana Store"
                                                    className={inputClass}
                                                />
                                                {errors.raison_sociale && (
                                                    <p className="text-sm text-red-500">
                                                        {errors.raison_sociale}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="space-y-2.5">
                                                <Label
                                                    htmlFor="email"
                                                    className="text-sm font-medium text-slate-700 dark:text-slate-300"
                                                >
                                                    Email de contact
                                                    <span className="ml-1 text-red-500">
                                                        *
                                                    </span>
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
                                                    placeholder="contact@votreboutique.com"
                                                    className={inputClass}
                                                />
                                                {errors.email && (
                                                    <p className="text-sm text-red-500">
                                                        {errors.email}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="space-y-2.5 md:col-span-2">
                                                <Label
                                                    htmlFor="telephone"
                                                    className="text-sm font-medium text-slate-700 dark:text-slate-300"
                                                >
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
                                                    placeholder="+243 81 234 56 78"
                                                    className={inputClass}
                                                />
                                                {errors.telephone && (
                                                    <p className="text-sm text-red-500">
                                                        {errors.telephone}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-2.5">
                                            <Label
                                                htmlFor="description"
                                                className="text-sm font-medium text-slate-700 dark:text-slate-300"
                                            >
                                                Description de la boutique
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
                                                maxLength={500}
                                                placeholder="Présentez votre boutique, vos produits et votre proposition de valeur..."
                                                className={textareaClass}
                                            />
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-slate-400">
                                                    Maximum 500 caractères
                                                </span>
                                                <span
                                                    className={cn(
                                                        'font-medium',
                                                        data.description
                                                            .length > 450
                                                            ? 'text-amber-600'
                                                            : 'text-slate-400',
                                                    )}
                                                >
                                                    {data.description.length}
                                                    /500
                                                </span>
                                            </div>
                                        </div>

                                        {/* Adresse de la boutique (unique) */}
                                        <div className="space-y-2.5">
                                            <Label
                                                htmlFor="address"
                                                className="text-sm font-medium text-slate-700 dark:text-slate-300"
                                            >
                                                Adresse de la boutique
                                            </Label>
                                            <div className="relative">
                                                <MapPin className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                                <Input
                                                    id="address"
                                                    value={data.address}
                                                    onChange={(e) =>
                                                        setData(
                                                            'address',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Ex. 12 Avenue de la Paix, Kinshasa"
                                                    className={cn(
                                                        inputClass,
                                                        'pl-10',
                                                    )}
                                                />
                                            </div>
                                            {errors.address && (
                                                <p className="text-sm text-red-500">
                                                    {errors.address}
                                                </p>
                                            )}
                                        </div>

                                        {/* Logo */}
                                        <div className="space-y-3">
                                            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                Logo de la boutique
                                            </Label>
                                            <div
                                                onDragEnter={handleDrag}
                                                onDragOver={handleDrag}
                                                onDragLeave={handleDrag}
                                                onDrop={handleDrop}
                                                className={cn(
                                                    'group relative rounded-3xl border-2 border-dashed p-6 transition-all duration-300',
                                                    dragActive
                                                        ? 'border-emerald-500 bg-emerald-50/80 shadow-lg shadow-emerald-500/10 dark:bg-emerald-950/20'
                                                        : 'border-slate-300 bg-slate-50/70 hover:border-emerald-400 hover:bg-emerald-50/40 dark:border-slate-700 dark:bg-slate-900/50',
                                                )}
                                            >
                                                <div className="flex flex-col items-center gap-6 md:flex-row">
                                                    <div className="relative">
                                                        <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
                                                            {logoPreview ? (
                                                                <img
                                                                    src={
                                                                        logoPreview
                                                                    }
                                                                    alt="Logo"
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                <Camera className="h-10 w-10 text-slate-300 dark:text-slate-600" />
                                                            )}
                                                        </div>
                                                        {logoPreview && (
                                                            <button
                                                                type="button"
                                                                onClick={
                                                                    removeLogo
                                                                }
                                                                className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border border-white bg-red-500 text-white shadow-lg transition hover:bg-red-600"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 text-center md:text-left">
                                                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                                                            Téléchargez votre
                                                            logo
                                                        </h4>
                                                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                                            Glissez-déposez une
                                                            image ou cliquez sur
                                                            le bouton
                                                            ci-dessous.
                                                        </p>
                                                        <p className="mt-1 text-xs text-slate-400">
                                                            PNG, JPG ou WebP •
                                                            Taille maximale : 2
                                                            Mo
                                                        </p>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                fileInputRef.current?.click()
                                                            }
                                                            className="mt-4 rounded-xl border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50 dark:border-slate-700 dark:bg-slate-800"
                                                        >
                                                            <UploadCloud className="mr-2 h-4 w-4" />
                                                            Choisir un fichier
                                                        </Button>
                                                    </div>
                                                </div>
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/png,image/jpeg,image/webp"
                                                    onChange={handleLogoChange}
                                                    className="hidden"
                                                />
                                            </div>
                                            {errors.logo && (
                                                <p className="text-sm text-red-500">
                                                    {errors.logo}
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Réseaux sociaux – sans le champ Adresse */}
                                <Card className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white/85 shadow-sm backdrop-blur-xl transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900/85 dark:hover:shadow-slate-950/40">
                                    <CardHeader className="border-b border-slate-100 bg-slate-50/50 px-6 py-5 dark:border-slate-800 dark:bg-slate-900/50">
                                        <CardTitle className="flex items-center gap-3 text-lg font-semibold text-slate-900 dark:text-white">
                                            <div className="rounded-2xl bg-emerald-100 p-2.5 text-emerald-600 shadow-sm dark:bg-emerald-950/40 dark:text-emerald-400">
                                                <Globe className="h-5 w-5" />
                                            </div>
                                            Réseaux sociaux
                                        </CardTitle>
                                        <CardDescription className="text-sm leading-6 text-slate-500 dark:text-slate-400">
                                            Ajoutez les liens vers vos profils
                                            sociaux pour renforcer la
                                            crédibilité de votre boutique et
                                            améliorer votre visibilité.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                            {socialFields.map((field) => {
                                                const value = data[
                                                    field.key
                                                ] as string;
                                                const hasValue =
                                                    value?.trim().length > 0;
                                                const error = errors[field.key];

                                                return (
                                                    <div
                                                        key={field.key}
                                                        className="space-y-2.5"
                                                    >
                                                        <Label
                                                            htmlFor={field.key}
                                                            className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300"
                                                        >
                                                            <div className="rounded-lg bg-slate-100 p-1 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                                                <LinkIcon className="h-3.5 w-3.5" />
                                                            </div>
                                                            {field.label}
                                                            {hasValue &&
                                                                !error && (
                                                                    <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-500" />
                                                                )}
                                                        </Label>
                                                        <div className="relative">
                                                            <LinkIcon className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                                            <Input
                                                                id={field.key}
                                                                type="url"
                                                                value={value}
                                                                onChange={(e) =>
                                                                    setData(
                                                                        field.key,
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                placeholder={
                                                                    field.placeholder
                                                                }
                                                                className={cn(
                                                                    'h-11 rounded-xl border bg-white/80 pr-10 pl-10 shadow-xs backdrop-blur-sm',
                                                                    'transition-all duration-200',
                                                                    'placeholder:text-slate-400',
                                                                    'hover:border-slate-300 hover:bg-white',
                                                                    'focus-visible:border-emerald-500',
                                                                    'focus-visible:ring-4',
                                                                    'focus-visible:ring-emerald-500/10',
                                                                    'focus-visible:shadow-md',
                                                                    'dark:bg-slate-900/70',
                                                                    'dark:hover:border-slate-600',
                                                                    'dark:focus-visible:border-emerald-400',
                                                                    'dark:focus-visible:ring-emerald-400/10',
                                                                    error
                                                                        ? 'border-red-300 focus-visible:border-red-500 focus-visible:ring-red-500/10 dark:border-red-800'
                                                                        : 'border-slate-200 dark:border-slate-700',
                                                                )}
                                                            />
                                                            {hasValue &&
                                                                !error && (
                                                                    <CheckCircle2 className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-emerald-500" />
                                                                )}
                                                        </div>
                                                        {error && (
                                                            <p className="flex items-center gap-1.5 text-sm text-red-500">
                                                                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                                                {error}
                                                            </p>
                                                        )}
                                                        {hasValue && !error && (
                                                            <a
                                                                href={value}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                                                            >
                                                                <ExternalLink className="h-3.5 w-3.5" />
                                                                Ouvrir le profil
                                                            </a>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="mt-6 rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 py-3 text-xs leading-5 text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
                                            Les liens sociaux apparaîtront sur
                                            votre boutique et permettront à vos
                                            clients de découvrir votre présence
                                            en ligne.
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Documents Légaux – avec sélecteur de forme juridique */}
                                {tenant?.id && documentTypes.length > 0 && (
                                    <Card className="overflow-hidden border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/70">
                                        <CardHeader className="border-b border-slate-100 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-900/60">
                                            <CardTitle className="flex items-center gap-3 text-lg font-semibold text-slate-900 dark:text-white">
                                                <div className="rounded-xl bg-emerald-100 p-2 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                    <ShieldCheck className="h-5 w-5" />
                                                </div>
                                                Documents légaux
                                            </CardTitle>
                                            <CardDescription>
                                                Sélectionnez votre forme
                                                juridique puis renseignez vos
                                                documents officiels.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6 p-6">
                                            <div className="max-w-sm">
                                                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                    Forme juridique
                                                </Label>
                                                <Select
                                                    value={data.forme_juridique}
                                                    onValueChange={(val) =>
                                                        setData(
                                                            'forme_juridique',
                                                            val,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger className="mt-2 h-11 rounded-xl border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm hover:border-emerald-300 dark:border-slate-700 dark:bg-slate-900/70 dark:hover:border-emerald-700">
                                                        <SelectValue placeholder="Choisir une forme juridique" />
                                                    </SelectTrigger>
                                                    <SelectContent
                                                        position="popper"
                                                        className="rounded-xl border-slate-200/70 bg-white/95 shadow-xl backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-900/95"
                                                    >
                                                        {Object.entries(
                                                            FORMES_JURIDIQUES,
                                                        ).map(
                                                            ([
                                                                value,
                                                                label,
                                                            ]) => (
                                                                <SelectItem
                                                                    key={value}
                                                                    value={
                                                                        value
                                                                    }
                                                                >
                                                                    {label}
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {filteredDocumentTypes.length ===
                                            0 ? (
                                                <p className="text-sm text-slate-500 italic">
                                                    Aucun document obligatoire
                                                    pour cette forme juridique.
                                                </p>
                                            ) : (
                                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                                    {filteredDocumentTypes.map(
                                                        (type) => {
                                                            const doc =
                                                                data.documents[
                                                                    type.id
                                                                ] || {};
                                                            const error =
                                                                errors[
                                                                    `documents.${type.id}.numero_document`
                                                                ] || '';

                                                            return (
                                                                <div
                                                                    key={
                                                                        type.id
                                                                    }
                                                                    className="space-y-2"
                                                                >
                                                                    <Label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                                                        {
                                                                            type.nom
                                                                        }
                                                                        {type.est_obligatoire && (
                                                                            <span className="text-red-500">
                                                                                *
                                                                            </span>
                                                                        )}
                                                                    </Label>
                                                                    <Input
                                                                        placeholder="N° du document"
                                                                        value={
                                                                            doc.numero_document
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            setData(
                                                                                'documents',
                                                                                {
                                                                                    ...data.documents,
                                                                                    [type.id]:
                                                                                        {
                                                                                            ...doc,
                                                                                            numero_document:
                                                                                                e
                                                                                                    .target
                                                                                                    .value,
                                                                                        },
                                                                                },
                                                                            )
                                                                        }
                                                                        className={
                                                                            inputClass
                                                                        }
                                                                    />
                                                                    <div className="grid grid-cols-2 gap-3">
                                                                        <DatePickerField
                                                                            value={
                                                                                doc.date_delivrance
                                                                            }
                                                                            onChange={(
                                                                                date,
                                                                            ) =>
                                                                                setData(
                                                                                    'documents',
                                                                                    {
                                                                                        ...data.documents,
                                                                                        [type.id]:
                                                                                            {
                                                                                                ...doc,
                                                                                                date_delivrance:
                                                                                                    date,
                                                                                            },
                                                                                    },
                                                                                )
                                                                            }
                                                                            placeholder="Délivrance"
                                                                        />
                                                                        <DatePickerField
                                                                            value={
                                                                                doc.date_expiration
                                                                            }
                                                                            onChange={(
                                                                                date,
                                                                            ) =>
                                                                                setData(
                                                                                    'documents',
                                                                                    {
                                                                                        ...data.documents,
                                                                                        [type.id]:
                                                                                            {
                                                                                                ...doc,
                                                                                                date_expiration:
                                                                                                    date,
                                                                                            },
                                                                                    },
                                                                                )
                                                                            }
                                                                            placeholder="Expiration"
                                                                        />
                                                                    </div>
                                                                    <Input
                                                                        placeholder="Lieu de délivrance"
                                                                        value={
                                                                            doc.lieu_delivrance
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            setData(
                                                                                'documents',
                                                                                {
                                                                                    ...data.documents,
                                                                                    [type.id]:
                                                                                        {
                                                                                            ...doc,
                                                                                            lieu_delivrance:
                                                                                                e
                                                                                                    .target
                                                                                                    .value,
                                                                                        },
                                                                                },
                                                                            )
                                                                        }
                                                                        className={
                                                                            inputClass
                                                                        }
                                                                    />
                                                                    <Input
                                                                        placeholder="Autorité de délivrance"
                                                                        value={
                                                                            doc.autorite_delivrance
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            setData(
                                                                                'documents',
                                                                                {
                                                                                    ...data.documents,
                                                                                    [type.id]:
                                                                                        {
                                                                                            ...doc,
                                                                                            autorite_delivrance:
                                                                                                e
                                                                                                    .target
                                                                                                    .value,
                                                                                        },
                                                                                },
                                                                            )
                                                                        }
                                                                        className={
                                                                            inputClass
                                                                        }
                                                                    />
                                                                    {error && (
                                                                        <p className="text-sm text-red-500">
                                                                            {
                                                                                error
                                                                            }
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            );
                                                        },
                                                    )}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Footer Actions */}
                                <div className="sticky bottom-4 z-30 pt-2">
                                    <div className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/90 shadow-2xl shadow-slate-200/40 backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-slate-950/40">
                                        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-500/50 to-transparent" />
                                        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                                            <div className="flex items-start gap-3">
                                                <div
                                                    className={cn(
                                                        'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border',
                                                        recentlySuccessful
                                                            ? 'border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400'
                                                            : isDirty
                                                              ? 'border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-400'
                                                              : 'border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400',
                                                    )}
                                                >
                                                    {recentlySuccessful ? (
                                                        <CheckCircle2 className="h-4.5 w-4.5" />
                                                    ) : isDirty ? (
                                                        <AlertCircle className="h-4.5 w-4.5" />
                                                    ) : (
                                                        <ShieldCheck className="h-4.5 w-4.5" />
                                                    )}
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                                        {recentlySuccessful
                                                            ? 'Modifications enregistrées'
                                                            : isDirty
                                                              ? 'Modifications non enregistrées'
                                                              : 'Toutes les données sont synchronisées'}
                                                    </p>
                                                    <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                                                        {recentlySuccessful
                                                            ? 'Vos paramètres ont été sauvegardés avec succès.'
                                                            : isDirty
                                                              ? 'Pensez à enregistrer vos changements avant de quitter cette page.'
                                                              : 'Aucune modification en attente.'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => {
                                                        reset();
                                                        setData(
                                                            'remove_logo',
                                                            false,
                                                        );
                                                        setLogoPreview(
                                                            tenant.logo_url ??
                                                                null,
                                                        );
                                                    }}
                                                    disabled={
                                                        processing || !isDirty
                                                    }
                                                    className={cn(
                                                        'h-11 rounded-xl border-slate-200 bg-white px-5 shadow-sm transition-all',
                                                        'hover:border-slate-300 hover:bg-slate-50',
                                                        'disabled:cursor-not-allowed disabled:opacity-50',
                                                        'dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600 dark:hover:bg-slate-700',
                                                    )}
                                                >
                                                    Réinitialiser
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    disabled={
                                                        processing || !isDirty
                                                    }
                                                    className={cn(
                                                        'h-11 min-w-60 rounded-xl px-6 font-medium text-white',
                                                        'bg-linear-to-r from-emerald-600 via-emerald-600 to-teal-600',
                                                        'shadow-lg shadow-emerald-500/20',
                                                        'transition-all duration-200',
                                                        'hover:-translate-y-0.5 hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl hover:shadow-emerald-500/25',
                                                        'focus-visible:ring-4 focus-visible:ring-emerald-500/20',
                                                        'disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60',
                                                    )}
                                                >
                                                    {processing ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-4.5 w-4.5 animate-spin" />
                                                            Enregistrement...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Save className="mr-2 h-4.5 w-4.5" />
                                                            Enregistrer les
                                                            modifications
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
