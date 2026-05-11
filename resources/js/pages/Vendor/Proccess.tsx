/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/Pages/Vendor/Configure.tsx
import { Head, useForm, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    ArrowRight,
    Store,
    Globe,
    Mail,
    Phone,
    Camera,
    CheckCircle,
    AlertCircle,
    Sparkles,
    ShieldCheck,
    Loader2,
    XCircle,
    FileCheck,
    ChevronsUpDown,
    Badge,
    Zap,
} from 'lucide-react';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
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
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

// ---------- TYPES ----------
interface Currency {
    code: string;
    symbol: string;
    name: string;
}
interface Language {
    code: string;
    name: string;
}
interface Country {
    iso2: string;
    name: string;
    phone_code: string;
}
interface TypeDocument {
    id: string;
    code: string;
    nom: string;
    description: string | null;
    est_obligatoire: boolean;
    forme_juridique?: string;
}
interface DocumentData {
    numero: string;
    date_delivrance: string;
    date_expiration: string;
}
interface Props {
    plan: { id: number; name: string; formatted_price: string; price: number };
    currencies: Currency[];
    languages: Language[];
    countries: Country[];
    requiredDocuments: TypeDocument[];
    optionalDocuments: TypeDocument[];
}

const STEPS = [
    { id: 1, name: 'Identité', icon: Store },
    { id: 2, name: 'Contact', icon: Mail },
    { id: 3, name: 'Légal', icon: FileCheck },
    { id: 4, name: 'Apparence', icon: Camera },
    { id: 5, name: 'Validation', icon: ShieldCheck },
];

function getFlagUrl(iso2: string) {
    return `https://flagcdn.com/w40/${iso2}.png`;
}

function detectUserCountry(countries: Country[]): Country | null {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const city = tz.split('/')[1] || '';
    const tzMap: Record<string, string> = {
        Kinshasa: 'cd',
        Lubumbashi: 'cd',
        Paris: 'fr',
        London: 'gb',
        New_York: 'us',
        Brussels: 'be',
        Zurich: 'ch',
        Toronto: 'ca',
        Brazzaville: 'cg',
        Kigali: 'rw',
        Bujumbura: 'bi',
        Nairobi: 'ke',
        Dar_es_Salaam: 'tz',
        Kampala: 'ug',
    };

    return countries.find((c) => c.iso2 === (tzMap[city] || 'cd')) || null;
}

// Composant DatePickerField inchangé
function DatePickerField({
    value,
    onChange,
    placeholder,
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
}) {
    const [date, setDate] = useState<Date | undefined>(
        value ? new Date(value) : undefined,
    );
    const [open, setOpen] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDate(value ? new Date(value) : undefined);
    }, [value]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        'h-11 w-full justify-start text-left font-normal',
                        !date && 'text-muted-foreground',
                    )}
                >
                    {date ? (
                        format(date, 'PPP', { locale: fr })
                    ) : (
                        <span>{placeholder}</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => {
                        if (d) {
                            setDate(d);
                            onChange(format(d, 'yyyy-MM-dd'));
                            setOpen(false);
                        }
                    }}
                    initialFocus
                    locale={fr}
                />
            </PopoverContent>
        </Popover>
    );
}

export default function VendorConfigure({
    plan,
    currencies,
    languages,
    countries,
    requiredDocuments,
    optionalDocuments,
}: Props) {
    const detectedCountry = useMemo(
        () => detectUserCountry(countries),
        [countries],
    );

    const [currentStep, setCurrentStep] = useState(1);
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
    const [slugStatus, setSlugStatus] = useState<
        'idle' | 'checking' | 'available' | 'unavailable'
    >('idle');
    const [slugChecking, setSlugChecking] = useState(false);
    const [slugErrors, setSlugErrors] = useState<string[]>([]);
    const [slugSuggestions, setSlugSuggestions] = useState<string[]>([]);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [selectedPhoneCountry, setSelectedPhoneCountry] =
        useState<Country | null>(detectedCountry);
    const [phoneSearch, setPhoneSearch] = useState('');
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        plan_id: plan.id,
        shop_name: '',
        shop_slug: '',
        shop_description: '',
        contact_email: '',
        contact_phone: '',
        phone_code: detectedCountry?.phone_code || '+243',
        currency: 'CDF',
        language: 'fr',
        logo: null as File | null,
        facebook_url: '',
        instagram_url: '',
        twitter_url: '',
        youtube_url: '',
        tiktok_url: '',
        accept_terms: false,
        forme_juridique: 'societe_commerciale',
        legal_documents: {} as Record<string, DocumentData>,
    });

    const cleanSlug = (v: string) => v.toLowerCase().replace(/[^a-z0-9-]/g, '');
    const generateBaseSlug = (name: string) =>
        name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');

    useEffect(() => {
        if (!slugManuallyEdited && data.shop_name) {
            setData('shop_slug', generateBaseSlug(data.shop_name));
        }
    }, [data.shop_name, slugManuallyEdited, setData]);

    const checkSlug = useCallback(
        async (slug: string) => {
            if (!slug || slug.length < 3) {
                setSlugStatus('idle');
                setSlugErrors([]);
                setSlugSuggestions([]);

                return;
            }

            setSlugChecking(true);
            setSlugStatus('checking');

            try {
                const res = await fetch('/devenir-vendeur/check-domain', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN':
                            document
                                .querySelector('meta[name="csrf-token"]')
                                ?.getAttribute('content') || '',
                    },
                    body: JSON.stringify({ slug }),
                });
                const json = await res.json();

                if (json.errors?.length) {
                    setSlugStatus('unavailable');
                    setSlugErrors(json.errors);
                } else if (json.available) {
                    setSlugStatus('available');
                    setSlugErrors([]);

                    if (json.cleaned_slug && json.cleaned_slug !== slug) {
                        setData('shop_slug', json.cleaned_slug);
                    }
                } else {
                    setSlugStatus('unavailable');
                    setSlugErrors(['Ce sous-domaine est déjà pris.']);
                    setSlugSuggestions(json.suggestions || []);
                }
            } catch {
                setSlugStatus('idle');
            } finally {
                setSlugChecking(false);
            }
        },
        [setData],
    );

    useEffect(() => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        if (data.shop_slug.length >= 3) {
            debounceTimer.current = setTimeout(
                () => checkSlug(data.shop_slug),
                500,
            );
        } else {
            setSlugStatus('idle');
            setSlugSuggestions([]);
        }

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [data.shop_slug, checkSlug]);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setData('logo', file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const isFormValid = (): boolean => {
        if (!data.shop_name.trim()) {
            return false;
        }

        if (!data.shop_slug.trim() || slugStatus !== 'available') {
            return false;
        }

        if (!data.contact_email.trim()) {
            return false;
        }

        for (const doc of requiredDocuments.filter(
            (d) =>
                d.forme_juridique === data.forme_juridique ||
                d.forme_juridique === 'toutes',
        )) {
            if (!data.legal_documents[doc.code]?.numero?.trim()) {
                return false;
            }
        }

        if (!data.accept_terms) {
            return false;
        }

        return true;
    };

    const getValidationErrorMessage = (): string | null => {
        if (!data.shop_name.trim()) {
            return 'Veuillez saisir le nom de la boutique.';
        }

        if (!data.shop_slug.trim()) {
            return 'Veuillez saisir l’adresse web.';
        }

        if (slugStatus !== 'available') {
            return 'L’adresse web n’est pas valide ou déjà prise. Veuillez en choisir une autre.';
        }

        if (!data.contact_email.trim()) {
            return 'Veuillez saisir votre email de contact.';
        }

        for (const doc of requiredDocuments.filter(
            (d) =>
                d.forme_juridique === data.forme_juridique ||
                d.forme_juridique === 'toutes',
        )) {
            if (!data.legal_documents[doc.code]?.numero?.trim()) {
                return `Veuillez renseigner le numéro du document ${doc.nom}.`;
            }
        }

        if (!data.accept_terms) {
            return 'Vous devez accepter les conditions générales.';
        }

        return null;
    };

    const handleSubmit = (
        e: React.BaseSyntheticEvent<
            SubmitEvent,
            HTMLFormElement,
            HTMLFormElement
        >,
    ) => {
        e.preventDefault();

        const errorMessage = getValidationErrorMessage();

        if (errorMessage) {
            toast.error(errorMessage);

            return;
        }

        post('/devenir-vendeur/store');
    };

    const filteredCountries = useMemo(() => {
        if (!phoneSearch.trim()) {
            return countries;
        }

        return countries.filter(
            (c) =>
                c.name.toLowerCase().includes(phoneSearch.toLowerCase()) ||
                c.phone_code.includes(phoneSearch),
        );
    }, [phoneSearch, countries]);

    return (
        <>
            <Head title="Configurez votre boutique" />
            <div className="min-h-screen bg-background">
                {/* Barre de progression (inchangée) */}
                <div className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                        {/* Retour */}
                        <Link
                            href={route('vendor.register')}
                            className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span className="hidden sm:inline">Retour</span>
                        </Link>

                        {/* Étapes (desktop) */}
                        <div className="hidden items-center gap-2 sm:flex">
                            {STEPS.map((step, idx) => {
                                const isActive = currentStep === step.id;
                                const isCompleted = currentStep > step.id;
                                const StepIcon = step.icon;

                                return (
                                    <div
                                        key={step.id}
                                        className="flex items-center"
                                    >
                                        <button
                                            onClick={() =>
                                                !isCompleted &&
                                                setCurrentStep(step.id)
                                            }
                                            disabled={!isCompleted && !isActive}
                                            className={cn(
                                                'flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200',
                                                isActive &&
                                                    'bg-primary text-primary-foreground shadow-sm',
                                                isCompleted &&
                                                    'bg-primary/10 text-primary hover:bg-primary/20',
                                                !isActive &&
                                                    !isCompleted &&
                                                    'cursor-not-allowed bg-muted text-muted-foreground',
                                                (isActive || isCompleted) &&
                                                    'cursor-pointer',
                                            )}
                                        >
                                            <StepIcon className="h-3.5 w-3.5" />
                                            <span className="hidden lg:inline">
                                                {step.name}
                                            </span>
                                        </button>
                                        {idx < STEPS.length - 1 && (
                                            <div
                                                className={cn(
                                                    'h-px w-6',
                                                    isCompleted
                                                        ? 'bg-primary'
                                                        : 'bg-border',
                                                )}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Badge du plan */}
                        <Badge
                            variant="outline"
                            className="border-primary/30 bg-primary/10 text-primary"
                        >
                            <Zap className="mr-1 h-3 w-3" />
                            Plan {plan.name}
                        </Badge>
                    </div>

                    {/* Barre de progression mobile */}
                    <div className="px-4 pb-3 sm:hidden">
                        <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                            <span>{STEPS[currentStep - 1]?.name}</span>
                            <span>
                                {currentStep}/{STEPS.length}
                            </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted">
                            <motion.div
                                className="h-full rounded-full bg-primary"
                                initial={{ width: 0 }}
                                animate={{
                                    width: `${(currentStep / STEPS.length) * 100}%`,
                                }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                    </div>
                </div>
                <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <AnimatePresence mode="wait">
                            {/* Étape 1 : Identité (inchangée) */}
                            {currentStep === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="rounded-xl border bg-card p-6"
                                >
                                    <h2 className="flex items-center gap-3 text-lg font-semibold">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                                            1
                                        </span>{' '}
                                        Identité
                                    </h2>
                                    <div className="mt-6 space-y-6">
                                        <div>
                                            <Label htmlFor="shop_name">
                                                Nom de la boutique{' '}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <div className="relative mt-2">
                                                <Store className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                                <Input
                                                    id="shop_name"
                                                    value={data.shop_name}
                                                    onChange={(e) =>
                                                        setData(
                                                            'shop_name',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-11 pl-10"
                                                    placeholder="Ma Boutique Artisanale"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label htmlFor="shop_slug">
                                                Adresse web{' '}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <div className="mt-2 flex rounded-lg">
                                                <div className="relative flex-1">
                                                    <Globe className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                                    <Input
                                                        id="shop_slug"
                                                        value={data.shop_slug}
                                                        onChange={(e) => {
                                                            setSlugManuallyEdited(
                                                                true,
                                                            );
                                                            setData(
                                                                'shop_slug',
                                                                cleanSlug(
                                                                    e.target
                                                                        .value,
                                                                ),
                                                            );
                                                        }}
                                                        className={`h-11 rounded-r-none pl-10 ${
                                                            slugStatus ===
                                                            'available'
                                                                ? 'border-green-500 focus-visible:ring-green-500'
                                                                : slugStatus ===
                                                                    'unavailable'
                                                                  ? 'border-red-500 focus-visible:ring-red-500'
                                                                  : ''
                                                        }`}
                                                        placeholder="ma-boutique"
                                                        required
                                                    />
                                                    <div className="absolute top-1/2 right-3 -translate-y-1/2">
                                                        {slugChecking && (
                                                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                                        )}
                                                        {!slugChecking &&
                                                            slugStatus ===
                                                                'available' && (
                                                                <CheckCircle className="h-5 w-5 text-green-500" />
                                                            )}
                                                        {!slugChecking &&
                                                            slugStatus ===
                                                                'unavailable' && (
                                                                <XCircle className="h-5 w-5 text-red-500" />
                                                            )}
                                                    </div>
                                                </div>
                                                <span className="flex items-center rounded-r-lg border border-l-0 bg-muted px-4 text-sm text-muted-foreground">
                                                    .{window.location.hostname}
                                                </span>
                                            </div>
                                            {/* Affichage des suggestions/erreurs  */}
                                        </div>
                                        <div className="flex justify-end">
                                            <Button
                                                type="button"
                                                onClick={() =>
                                                    setCurrentStep((prev) =>
                                                        Math.min(prev + 1, 5),
                                                    )
                                                }
                                            >
                                                Continuer{' '}
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Étape 2 : Contact (inchangée) */}
                            {currentStep === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="rounded-xl border bg-card p-6"
                                >
                                    <h2 className="flex items-center gap-3 text-lg font-semibold">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                                            2
                                        </span>{' '}
                                        Contact & localisation
                                    </h2>
                                    <div className="mt-6 grid gap-6 sm:grid-cols-2">
                                        {/* ... contenu inchangé ... */}
                                        <div className="flex justify-between sm:col-span-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    setCurrentStep(1)
                                                }
                                            >
                                                <ArrowLeft className="mr-2 h-4 w-4" />{' '}
                                                Retour
                                            </Button>
                                            <Button
                                                type="button"
                                                onClick={() =>
                                                    setCurrentStep((prev) =>
                                                        Math.min(prev + 1, 5),
                                                    )
                                                }
                                            >
                                                Continuer{' '}
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Étape 3 : Légal (inchangée) */}
                            {currentStep === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="rounded-xl border bg-card p-6"
                                >
                                    <h2 className="flex items-center gap-3 text-lg font-semibold">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                                            3
                                        </span>{' '}
                                        Documents légaux
                                    </h2>
                                    {/* ... contenu inchangé ... */}
                                    <div className="mt-6 flex justify-between">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setCurrentStep(2)}
                                        >
                                            <ArrowLeft className="mr-2 h-4 w-4" />{' '}
                                            Retour
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={() =>
                                                setCurrentStep((prev) =>
                                                    Math.min(prev + 1, 5),
                                                )
                                            }
                                        >
                                            Continuer{' '}
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Étape 4 : Apparence */}
                            {currentStep === 4 && (
                                <motion.div
                                    key="step4"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="rounded-xl border bg-card p-6"
                                >
                                    <h2 className="flex items-center gap-3 text-lg font-semibold">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                                            4
                                        </span>{' '}
                                        Apparence & réseaux sociaux
                                    </h2>
                                    {/* ... contenu inchangé ... */}
                                    <div className="flex justify-between sm:col-span-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setCurrentStep(3)}
                                        >
                                            <ArrowLeft className="mr-2 h-4 w-4" />{' '}
                                            Retour
                                        </Button>
                                        {/* Bloqué si le slug n'est pas disponible */}
                                        <Button
                                            type="button"
                                            disabled={
                                                slugStatus !== 'available'
                                            }
                                            onClick={() =>
                                                setCurrentStep((prev) =>
                                                    Math.min(prev + 1, 5),
                                                )
                                            }
                                        >
                                            Continuer{' '}
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Étape 5 : Validation (sans globalError) */}
                            {currentStep === 5 && (
                                <motion.div
                                    key="step5"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="rounded-xl border bg-card p-6"
                                >
                                    <h2 className="flex items-center gap-3 text-lg font-semibold">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                                            5
                                        </span>{' '}
                                        Récapitulatif & validation
                                    </h2>
                                    <div className="mt-6 space-y-6">
                                        {/* ... résumé ... */}
                                        <div className="flex justify-between pt-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    setCurrentStep(4)
                                                }
                                            >
                                                <ArrowLeft className="mr-2 h-4 w-4" />{' '}
                                                Retour
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={
                                                    processing || !isFormValid()
                                                }
                                                className="inline-flex items-center gap-3 rounded-xl bg-primary px-8 py-4 text-base font-bold text-primary-foreground transition hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground"
                                            >
                                                {processing ? (
                                                    <>
                                                        <Loader2 className="h-5 w-5 animate-spin" />{' '}
                                                        Création en cours...
                                                    </>
                                                ) : plan.price > 0 ? (
                                                    <>
                                                        <ShieldCheck className="h-5 w-5" />{' '}
                                                        Payer{' '}
                                                        {plan.formatted_price}{' '}
                                                        et créer ma boutique
                                                    </>
                                                ) : (
                                                    <>
                                                        <Sparkles className="h-5 w-5" />{' '}
                                                        Créer ma boutique
                                                        gratuitement
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </div>
            </div>
        </>
    );
}
// ------------------------------------------------------------------
// Composant DocumentCard mis à jour avec DatePickerField
// ------------------------------------------------------------------
function DocumentCard({
    doc,
    data,
    setData,
}: {
    doc: TypeDocument;
    data: any;
    setData: (field: string, value: any) => void;
}) {
    const docData = data.legal_documents[doc.code] || {
        numero: '',
        date_delivrance: '',
        date_expiration: '',
    };
    const updateDoc = (field: string, value: string) =>
        setData('legal_documents', {
            ...data.legal_documents,
            [doc.code]: { ...docData, [field]: value },
        });

    return (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
            <div className="flex items-start gap-3">
                <FileCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <div className="flex-1 space-y-3">
                    <div>
                        <h4 className="font-semibold">
                            {doc.nom}
                            {doc.est_obligatoire && (
                                <span className="text-red-500"> *</span>
                            )}
                        </h4>
                        {doc.description && (
                            <p className="text-sm text-muted-foreground">
                                {doc.description}
                            </p>
                        )}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                        <Input
                            type="text"
                            placeholder="Numéro du document"
                            value={docData.numero}
                            onChange={(e) =>
                                updateDoc('numero', e.target.value)
                            }
                            className="h-11"
                        />
                        <DatePickerField
                            value={docData.date_delivrance}
                            onChange={(v) => updateDoc('date_delivrance', v)}
                            placeholder="Date de délivrance"
                        />
                        <DatePickerField
                            value={docData.date_expiration}
                            onChange={(v) => updateDoc('date_expiration', v)}
                            placeholder="Date d'expiration"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Composant SocialInput (inchangé, mais ajoutez h-11 sur l'Input si désiré)
function SocialInput({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <div>
            <Label className="mb-2 flex items-center gap-1 text-sm font-medium">
                {label}
            </Label>
            <Input
                type="url"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={`https://${label.toLowerCase().replace(' / x', '')}.com/votreboutique`}
                className="h-11"
            />
        </div>
    );
}
