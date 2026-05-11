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
    Zap,
    Eye,
    Loader2,
    Lightbulb,
    XCircle,
    Copy,
    Check,
    FileCheck,
    FileText,
    Search,
    ChevronDown,
    ChevronsUpDown,
} from 'lucide-react';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
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
interface DocumentPayload {
    type_document_id: string;
    numero_document: string | null;
    date_delivrance: string | null;
    date_expiration: string | null;
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

// Composant DatePicker réutilisable (utilise le Calendar shadcn)
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

    const { data, setData, post, processing, errors, transform } = useForm({
        plan_id: plan.id,
        shop_name: '',
        shop_slug: '',
        shop_description: '',
        contact_email: '',
        contact_phone: '' as string | null,
        password: 'password',
        password_confirmation: 'password',
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
        documents: [] as DocumentPayload[],
    });

    const selectedCurrency = useMemo(
        () => currencies.find((c) => c.code === data.currency),
        [currencies, data.currency],
    );
    const selectedLanguage = useMemo(
        () => languages.find((l) => l.code === data.language),
        [languages, data.language],
    );
    const selectedLegalDocuments = useMemo(
        () =>
            [...requiredDocuments, ...optionalDocuments].filter(
                (doc) =>
                    doc.forme_juridique === data.forme_juridique ||
                    doc.forme_juridique === 'toutes',
            ),
        [requiredDocuments, optionalDocuments, data.forme_juridique],
    );

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

    const isFormValid = () => {
        console.log('isFormValid check:', {
            shop_name: data.shop_name,
            shop_slug: data.shop_slug,
            slugStatus,
            contact_email: data.contact_email,
            password: data.password,
            password_confirmation: data.password_confirmation,
            accept_terms: data.accept_terms,
            selectedLegalDocuments: selectedLegalDocuments.filter(d => d.est_obligatoire).map(d => ({
                code: d.code,
                numero: data.legal_documents[d.code]?.numero
            }))
        });

        if (
            !data.shop_name.trim() ||
            !data.shop_slug.trim() ||
            slugStatus !== 'available'
        ) {
            console.log('Validation failed: shop_name, shop_slug or slugStatus');
            return false;
        }

        if (!data.contact_email.trim()) {
            console.log('Validation failed: contact_email');
            return false;
        }

        if (!data.password || data.password.length < 8) {
            console.log('Validation failed: password');
            return false;
        }

        if (data.password !== data.password_confirmation) {
            console.log('Validation failed: password_confirmation');
            return false;
        }

        if (!data.accept_terms) {
            console.log('Validation failed: accept_terms');
            return false;
        }

        for (const doc of selectedLegalDocuments.filter(
            (selectedDocument) => selectedDocument.est_obligatoire,
        )) {
            if (!data.legal_documents[doc.code]?.numero?.trim()) {
                console.log('Validation failed: document', doc.code);
                return false;
            }
        }

        console.log('Validation passed');
        return true;
    };
    const buildDocumentsPayload = (): DocumentPayload[] =>
        selectedLegalDocuments
            .map((doc) => {
                const docData = data.legal_documents[doc.code];

                return {
                    type_document_id: doc.id,
                    numero_document: docData?.numero?.trim() || null,
                    date_delivrance: docData?.date_delivrance || null,
                    date_expiration: docData?.date_expiration || null,
                };
            })
            .filter(
                (doc) =>
                    doc.numero_document ||
                    doc.date_delivrance ||
                    doc.date_expiration,
            );

    const handleSubmit = (
        e: React.BaseSyntheticEvent<
            SubmitEvent,
            HTMLFormElement,
            HTMLFormElement
        >,
    ) => {
        e.preventDefault();

        if (isFormValid()) {
            setData('contact_phone', data.contact_phone?.trim() || '');
            (data as any).documents = buildDocumentsPayload();

            post(route('vendor.store'), {
                forceFormData: true,
                preserveScroll: true,
                onError: (formErrors) => {
                    const firstError = Object.keys(formErrors)[0] ?? '';

                    if (firstError.startsWith('shop_')) {
                        setCurrentStep(1);
                    } else if (
                        firstError.startsWith('contact_') ||
                        firstError.startsWith('phone_') ||
                        firstError === 'currency' ||
                        firstError === 'language'
                    ) {
                        setCurrentStep(2);
                    } else if (firstError.startsWith('documents')) {
                        setCurrentStep(3);
                    } else if (
                        firstError === 'logo' ||
                        firstError.endsWith('_url')
                    ) {
                        setCurrentStep(4);
                    }
                },
            });
        }
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
            <div className="min-h-screen bg-white dark:bg-gray-950">
                {/* Barre de progression identique (inchangée) */}
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
                    {/* ... */}
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <AnimatePresence mode="wait">
                            {/* Étape 1 : Identité */}
                            {currentStep === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="rounded-xl border bg-card p-6"
                                >
                                    <h2 className="flex items-center gap-3 text-lg font-semibold">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">
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
                                            {errors.shop_name && (
                                                <p className="mt-2 text-sm text-red-600">
                                                    {errors.shop_name}
                                                </p>
                                            )}
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
                                                        className={`h-11 rounded-r-none pl-10 ${slugStatus === 'available' ? 'border-green-500 focus-visible:ring-green-500' : slugStatus === 'unavailable' ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                                        placeholder="ma-boutique"
                                                        required
                                                    />
                                                    <div className="absolute top-1/2 right-3 -translate-y-1/2">
                                                        {slugChecking && (
                                                            <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
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
                                            {slugStatus === 'available' && (
                                                <p className="mt-2 text-sm text-emerald-600">
                                                    Cette adresse est
                                                    disponible.
                                                </p>
                                            )}
                                            {slugErrors.map((error) => (
                                                <p
                                                    key={error}
                                                    className="mt-2 text-sm text-red-600"
                                                >
                                                    {error}
                                                </p>
                                            ))}
                                            {errors.shop_slug && (
                                                <p className="mt-2 text-sm text-red-600">
                                                    {errors.shop_slug}
                                                </p>
                                            )}
                                            {slugSuggestions.length > 0 && (
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {slugSuggestions.map(
                                                        (suggestion) => (
                                                            <button
                                                                key={suggestion}
                                                                type="button"
                                                                className="rounded-full border px-3 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary"
                                                                onClick={() => {
                                                                    setSlugManuallyEdited(
                                                                        true,
                                                                    );
                                                                    setData(
                                                                        'shop_slug',
                                                                        suggestion,
                                                                    );
                                                                }}
                                                            >
                                                                {suggestion}
                                                            </button>
                                                        ),
                                                    )}
                                                </div>
                                            )}
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

                            {/* Étape 2 : Contact – tous les Input, Select, Textarea ont maintenant h-11 */}
                            {currentStep === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="rounded-xl border bg-card p-6"
                                >
                                    <h2 className="flex items-center gap-3 text-lg font-semibold">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">
                                            2
                                        </span>{' '}
                                        Contact & localisation
                                    </h2>
                                    <div className="mt-6 grid gap-6 sm:grid-cols-2">
                                        <div>
                                            <Label htmlFor="contact_email">
                                                Email{' '}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <div className="relative mt-2">
                                                <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                                <Input
                                                    id="contact_email"
                                                    type="email"
                                                    value={data.contact_email}
                                                    onChange={(e) =>
                                                        setData(
                                                            'contact_email',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-11 pl-10"
                                                    required
                                                />
                                            </div>
                                            {errors.contact_email && (
                                                <p className="mt-2 text-sm text-red-600">
                                                    {errors.contact_email}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <Label htmlFor="password">
                                                Mot de passe{' '}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                value={data.password}
                                                onChange={(e) =>
                                                    setData(
                                                        'password',
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-11"
                                                placeholder="••••••••"
                                                required
                                            />
                                            {errors.password && (
                                                <p className="mt-2 text-sm text-red-600">
                                                    {errors.password}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="password_confirmation">
                                                Confirmer le mot de passe{' '}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                id="password_confirmation"
                                                type="password"
                                                value={
                                                    data.password_confirmation
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        'password_confirmation',
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-11"
                                                placeholder="••••••••"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label>Téléphone</Label>
                                            <div className="mt-2 flex gap-2">
                                                {/* Sélecteur de pays – inchangé */}
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className="h-11 w-32.5 justify-between"
                                                            role="combobox"
                                                        >
                                                            {selectedPhoneCountry ? (
                                                                <span className="flex items-center gap-2">
                                                                    <img
                                                                        src={getFlagUrl(
                                                                            selectedPhoneCountry.iso2,
                                                                        )}
                                                                        alt=""
                                                                        className="h-4 w-6 rounded-sm object-cover"
                                                                    />
                                                                    {
                                                                        selectedPhoneCountry.phone_code
                                                                    }
                                                                </span>
                                                            ) : (
                                                                <ChevronsUpDown className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent
                                                        className="w-70 p-0"
                                                        align="start"
                                                    >
                                                        <Command>
                                                            <CommandInput
                                                                placeholder="Rechercher un pays..."
                                                                value={
                                                                    phoneSearch
                                                                }
                                                                onValueChange={
                                                                    setPhoneSearch
                                                                }
                                                            />
                                                            <CommandList>
                                                                <CommandEmpty>
                                                                    Aucun pays
                                                                    trouvé
                                                                </CommandEmpty>
                                                                <CommandGroup>
                                                                    {filteredCountries.map(
                                                                        (
                                                                            country,
                                                                        ) => (
                                                                            <CommandItem
                                                                                key={
                                                                                    country.iso2
                                                                                }
                                                                                value={
                                                                                    country.phone_code
                                                                                }
                                                                                onSelect={() => {
                                                                                    setSelectedPhoneCountry(
                                                                                        country,
                                                                                    );
                                                                                    setData(
                                                                                        'phone_code',
                                                                                        country.phone_code,
                                                                                    );
                                                                                }}
                                                                            >
                                                                                <img
                                                                                    src={getFlagUrl(
                                                                                        country.iso2,
                                                                                    )}
                                                                                    alt=""
                                                                                    className="mr-2 h-4 w-6 rounded-sm object-cover"
                                                                                />
                                                                                {
                                                                                    country.name
                                                                                }
                                                                                <span className="ml-auto text-muted-foreground">
                                                                                    {
                                                                                        country.phone_code
                                                                                    }
                                                                                </span>
                                                                            </CommandItem>
                                                                        ),
                                                                    )}
                                                                </CommandGroup>
                                                            </CommandList>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                                <Input
                                                    type="tel"
                                                    value={
                                                        data.contact_phone || ''
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            'contact_phone',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="XXX XXX XXX"
                                                    className="h-11 flex-1"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label>Devise par défaut</Label>
                                            <Select
                                                value={data.currency}
                                                onValueChange={(v) =>
                                                    setData('currency', v)
                                                }
                                            >
                                                <SelectTrigger className="mt-2 h-11">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {currencies.map((c) => (
                                                        <SelectItem
                                                            key={c.code}
                                                            value={c.code}
                                                        >
                                                            {c.code} — {c.name}{' '}
                                                            ({c.symbol})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label>Langue par défaut</Label>
                                            <Select
                                                value={data.language}
                                                onValueChange={(v) =>
                                                    setData('language', v)
                                                }
                                            >
                                                <SelectTrigger className="mt-2 h-11">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {languages.map((l) => (
                                                        <SelectItem
                                                            key={l.code}
                                                            value={l.code}
                                                        >
                                                            {l.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="sm:col-span-2">
                                            <Label htmlFor="shop_description">
                                                Description
                                            </Label>
                                            <Textarea
                                                id="shop_description"
                                                value={data.shop_description}
                                                onChange={(e) =>
                                                    setData(
                                                        'shop_description',
                                                        e.target.value,
                                                    )
                                                }
                                                className="mt-2 min-h-30"
                                                rows={4}
                                                maxLength={500}
                                                placeholder="Parlez-nous de votre activité, de vos produits..."
                                            />
                                            <p className="mt-1 text-right text-xs text-muted-foreground">
                                                {data.shop_description
                                                    ?.length || 0}
                                                /500
                                            </p>
                                        </div>
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

                            {/* Étape 3 : Légal – avec DatePicker dans DocumentCard */}
                            {currentStep === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="rounded-xl border bg-card p-6"
                                >
                                    <h2 className="flex items-center gap-3 text-lg font-semibold">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">
                                            3
                                        </span>{' '}
                                        Documents légaux
                                    </h2>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Ces documents sont requis pour vérifier
                                        votre identité et votre entreprise.
                                    </p>
                                    <div className="mt-6">
                                        <Label htmlFor="forme_juridique">
                                            Forme juridique de votre activité{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Select
                                            value={data.forme_juridique}
                                            onValueChange={(v) => {
                                                setData('forme_juridique', v);
                                                setData('legal_documents', {});
                                            }}
                                        >
                                            <SelectTrigger className="mt-2">
                                                <SelectValue placeholder="Sélectionnez votre forme juridique" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="societe_commerciale">
                                                    Société commerciale (RCCM)
                                                </SelectItem>
                                                <SelectItem value="petit_commercant">
                                                    Petit commerçant individuel
                                                    (Patente)
                                                </SelectItem>
                                                <SelectItem value="organisation_sans_but_lucratif">
                                                    Organisation sans but
                                                    lucratif (ASBL/ONG)
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="mt-6 space-y-4">
                                        {requiredDocuments
                                            .filter(
                                                (doc) =>
                                                    doc.forme_juridique ===
                                                    data.forme_juridique ||
                                                    doc.forme_juridique ===
                                                    'toutes',
                                            )
                                            .map((doc) => (
                                                <DocumentCard
                                                    key={doc.id}
                                                    doc={doc}
                                                    data={data}
                                                    setData={setData}
                                                />
                                            ))}
                                        {optionalDocuments.filter(
                                            (doc) =>
                                                doc.forme_juridique ===
                                                data.forme_juridique ||
                                                doc.forme_juridique ===
                                                'toutes',
                                        ).length > 0 && (
                                                <div className="mt-6">
                                                    <h3 className="mb-3 text-sm font-semibold text-gray-700">
                                                        Documents facultatifs
                                                    </h3>
                                                    {optionalDocuments
                                                        .filter(
                                                            (doc) =>
                                                                doc.forme_juridique ===
                                                                data.forme_juridique ||
                                                                doc.forme_juridique ===
                                                                'toutes',
                                                        )
                                                        .map((doc) => (
                                                            <DocumentCard
                                                                key={doc.id}
                                                                doc={doc}
                                                                data={data}
                                                                setData={setData}
                                                            />
                                                        ))}
                                                </div>
                                            )}
                                    </div>
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
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">
                                            4
                                        </span>{' '}
                                        Apparence & réseaux sociaux
                                    </h2>
                                    <div className="mt-6 grid gap-6 sm:grid-cols-2">
                                        <div className="sm:col-span-2">
                                            <Label>Logo</Label>
                                            <div className="mt-2 flex items-center gap-6">
                                                <div className="relative h-24 w-24 overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700">
                                                    {logoPreview ? (
                                                        <img
                                                            src={logoPreview}
                                                            alt="Logo"
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center text-gray-400">
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
                                                <div className="text-sm text-gray-500">
                                                    <p className="font-medium">
                                                        500 × 500 px
                                                    </p>
                                                    <p>
                                                        PNG, JPG ou WebP. Max 2
                                                        Mo.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        {[
                                            [
                                                'Facebook',
                                                data.facebook_url,
                                                (v: string) =>
                                                    setData('facebook_url', v),
                                            ],
                                            [
                                                'Instagram',
                                                data.instagram_url,
                                                (v: string) =>
                                                    setData('instagram_url', v),
                                            ],
                                            [
                                                'Twitter / X',
                                                data.twitter_url,
                                                (v: string) =>
                                                    setData('twitter_url', v),
                                            ],
                                            [
                                                'YouTube',
                                                data.youtube_url,
                                                (v: string) =>
                                                    setData('youtube_url', v),
                                            ],
                                            [
                                                'TikTok',
                                                data.tiktok_url,
                                                (v: string) =>
                                                    setData('tiktok_url', v),
                                            ],
                                        ].map(([label, value, onChange]) => (
                                            <SocialInput
                                                key={label as string}
                                                label={label as string}
                                                value={value as string}
                                                onChange={
                                                    onChange as (
                                                        v: string,
                                                    ) => void
                                                }
                                            />
                                        ))}
                                        <div className="flex justify-between sm:col-span-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    setCurrentStep(3)
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

                            {/* Étape 5 : Validation */}
                            {currentStep === 5 && (
                                <motion.div
                                    key="step5"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="rounded-xl border bg-card p-6"
                                >
                                    <h2 className="flex items-center gap-3 text-lg font-semibold">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">
                                            5
                                        </span>{' '}
                                        Récapitulatif & validation
                                    </h2>
                                    <div className="mt-6 space-y-6">
                                        <div className="rounded-xl border bg-gray-50/50 p-6 dark:bg-gray-900/50">
                                            <h3 className="mb-4 text-sm font-semibold text-gray-500 uppercase">
                                                Récapitulatif
                                            </h3>
                                            <dl className="divide-y divide-gray-200 dark:divide-gray-700">
                                                {[
                                                    [
                                                        'Plan',
                                                        `${plan.name} (${plan.formatted_price})`,
                                                    ],
                                                    [
                                                        'Nom',
                                                        data.shop_name || '—',
                                                    ],
                                                    [
                                                        'Adresse',
                                                        `${data.shop_slug}.${window.location.hostname}`,
                                                    ],
                                                    [
                                                        'Email',
                                                        data.contact_email ||
                                                        '—',
                                                    ],
                                                    ['Devise', data.currency],
                                                    [
                                                        'Langue',
                                                        selectedLanguage?.name ||
                                                        data.language,
                                                    ],
                                                ].map(([label, value]) => (
                                                    <div
                                                        key={label}
                                                        className="flex justify-between py-3"
                                                    >
                                                        <dt className="text-gray-600">
                                                            {label}
                                                        </dt>
                                                        <dd className="font-medium text-gray-900 dark:text-white">
                                                            {value}
                                                        </dd>
                                                    </div>
                                                ))}
                                            </dl>
                                        </div>
                                        <div className="flex items-start gap-3 rounded-xl border p-4">
                                            <input
                                                type="checkbox"
                                                checked={data.accept_terms}
                                                onChange={(e) =>
                                                    setData(
                                                        'accept_terms',
                                                        e.target.checked,
                                                    )
                                                }
                                                className="mt-1 h-5 w-5 rounded border-gray-300 text-emerald-600"
                                                id="terms"
                                            />
                                            <label
                                                htmlFor="terms"
                                                className="text-sm text-gray-600 dark:text-gray-300"
                                            >
                                                J'accepte les{' '}
                                                <Link
                                                    href="/conditions"
                                                    className="font-medium text-emerald-600 underline"
                                                    target="_blank"
                                                >
                                                    conditions générales
                                                </Link>{' '}
                                                et la{' '}
                                                <Link
                                                    href="/confidentialite"
                                                    className="font-medium text-emerald-600 underline"
                                                    target="_blank"
                                                >
                                                    politique de confidentialité
                                                </Link>
                                                .
                                            </label>
                                        </div>
                                        {errors.accept_terms && (
                                            <p className="text-sm text-red-500">
                                                <AlertCircle className="inline h-4 w-4" />{' '}
                                                {errors.accept_terms}
                                            </p>
                                        )}
                                        {Object.values(errors).filter(Boolean)
                                            .length > 0 && (
                                                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
                                                    {Object.values(errors)
                                                        .filter(Boolean)
                                                        .slice(0, 3)
                                                        .map((error) => (
                                                            <p key={error}>
                                                                <AlertCircle className="mr-1 inline h-4 w-4" />
                                                                {error}
                                                            </p>
                                                        ))}
                                                </div>
                                            )}
                                        <div className="flex items-center justify-center gap-4 rounded-xl bg-green-50 p-4 dark:bg-green-900/20">
                                            <ShieldCheck className="h-5 w-5 text-green-600" />
                                            <span className="text-sm font-medium text-green-700">
                                                Vos données sont protégées et
                                                cryptées.
                                            </span>
                                        </div>
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
                                                className="inline-flex items-center gap-3 rounded-xl bg-emerald-600 px-8 py-4 text-base font-bold text-white transition hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400"
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
