/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/Pages/Vendor/Configure.tsx
import { Head, useForm, Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    ArrowRight,
    Store,
    Globe,
    Mail,
    CheckCircle,
    AlertCircle,
    Sparkles,
    ShieldCheck,
    Zap,
    Loader2,
    XCircle,
    Lock,
    Check,
    PartyPopper,
    ImagePlus,
    Share2,
    Upload,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
} from 'lucide-react';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import React from 'react';
import { fa } from 'zod/v4/locales';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { PremiumLoadingState } from './PremiumLoadingState';

// Types inchangés...
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
interface Props {
    plan: { id: number; name: string; formatted_price: string; price: number };
    currencies: Currency[];
    languages: Language[];
    countries: Country[];
}

const STEPS = [
    { id: 1, name: 'Identité', icon: Store, description: 'Nom et adresse web' },
    {
        id: 2,
        name: 'Personnalisation',
        icon: ImagePlus,
        description: 'Logo de la boutique',
    },
    {
        id: 3,
        name: 'Réseaux Sociaux',
        icon: Share2,
        description: 'Liens et contacts',
    },
    {
        id: 4,
        name: 'Contact',
        icon: Mail,
        description: 'Email et mot de passe',
    },
    {
        id: 5,
        name: 'Validation',
        icon: ShieldCheck,
        description: 'Récapitulatif',
    },
];

const getFlagUrl = (iso2: string) => `https://flagcdn.com/w40/${iso2}.png`;

const detectUserCountry = (countries: Country[]): Country | null => {
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
};

// ─── Composant FloatingLabelInput (correction dark + focus emerald) ───
function FloatingLabelInput({
    id,
    label,
    type = 'text',
    icon: Icon,
    value,
    onChange,
    placeholder,
    error,
    required,
    rightIcon,
    className,
    ...props
}: {
    id?: string;
    label: string;
    type?: string;
    icon?: React.ElementType;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    error?: string;
    required?: boolean;
    rightIcon?: React.ReactNode;
    className?: string;
    [key: string]: any;
}) {
    const [focused, setFocused] = useState(false);
    const hasValue = value.length > 0;

    return (
        <div className={cn('relative', className)}>
            <div
                className={cn(
                    // Fond clair / sombre cohérent
                    'relative rounded-2xl border bg-white/70 backdrop-blur-sm transition-all duration-300',
                    'dark:bg-slate-900/80 dark:text-white', // ✅ ajout dark background + texte
                    focused
                        ? 'border-emerald-400 shadow-lg ring-4 shadow-emerald-500/5 ring-emerald-500/10 dark:border-emerald-500 dark:ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-700',
                    error
                        ? 'border-red-400 ring-red-500/10 dark:border-red-400'
                        : '',
                )}
            >
                {Icon && (
                    <Icon
                        className={cn(
                            'absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors',
                            focused && 'text-emerald-500 dark:text-emerald-400', // icône émeraude au focus
                        )}
                    />
                )}
                <input
                    id={id}
                    type={type}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder={placeholder}
                    required={required}
                    className={cn(
                        'peer h-12 w-full bg-transparent px-4 pt-5 pb-1 text-sm placeholder-transparent focus:outline-none',
                        'dark:text-white dark:placeholder:text-transparent', // texte blanc en dark
                        Icon ? 'pl-12' : 'pl-4',
                        rightIcon && 'pr-12',
                    )}
                    {...props}
                />
                <label
                    htmlFor={id}
                    className={cn(
                        'pointer-events-none absolute left-4 transition-all duration-200',
                        Icon ? 'left-12' : 'left-4',
                        focused || hasValue
                            ? 'top-1.5 text-xs text-emerald-600 dark:text-emerald-400'
                            : 'top-1/2 -translate-y-1/2 text-sm text-slate-400 dark:text-slate-500',
                    )}
                >
                    {label}
                    {required && <span className="ml-0.5 text-red-500">*</span>}
                </label>
                {rightIcon && (
                    <div className="absolute top-1/2 right-4 -translate-y-1/2">
                        {rightIcon}
                    </div>
                )}
            </div>
            {error && (
                <p
                    className="mt-1.5 flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400"
                    role="alert"
                >
                    <AlertCircle className="h-4 w-4" />
                    {error}
                </p>
            )}
        </div>
    );
}

// ─── StepIndicator inchangé, mais le fond des steps peut être amélioré ───
function StepIndicator({
    steps,
    currentStep,
    onStepClick,
}: {
    steps: typeof STEPS;
    currentStep: number;
    onStepClick: (id: number) => void;
}) {
    return (
        <div className="hidden items-center gap-1 lg:flex">
            {steps.map((step, idx) => {
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                const StepIcon = step.icon;

                return (
                    <React.Fragment key={step.id}>
                        <motion.button
                            whileHover={
                                isCompleted || isActive ? { scale: 1.05 } : {}
                            }
                            onClick={() =>
                                (isCompleted || isActive) &&
                                onStepClick(step.id)
                            }
                            className={cn(
                                'relative flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-semibold transition-all duration-300',
                                isActive &&
                                    'bg-linear-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20',
                                isCompleted &&
                                    'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300',
                                !isActive &&
                                    !isCompleted &&
                                    'cursor-not-allowed text-slate-400 dark:text-slate-500',
                            )}
                        >
                            <span
                                className={cn(
                                    'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
                                    isActive
                                        ? 'bg-white/20'
                                        : isCompleted
                                          ? 'bg-emerald-500 text-white'
                                          : 'bg-slate-200 dark:bg-slate-800',
                                )}
                            >
                                {isCompleted ? (
                                    <Check className="h-3 w-3" />
                                ) : (
                                    <StepIcon className="h-3 w-3" />
                                )}
                            </span>
                            <span className="hidden xl:inline">
                                {step.name}
                            </span>
                        </motion.button>
                        {idx < steps.length - 1 && (
                            <div className="mx-1 h-px w-6 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                                <motion.div
                                    className="h-full bg-linear-to-r from-emerald-500 to-teal-500"
                                    initial={{ width: 0 }}
                                    animate={{
                                        width:
                                            currentStep > step.id
                                                ? '100%'
                                                : '0%',
                                    }}
                                    transition={{
                                        duration: 0.5,
                                        ease: 'easeInOut',
                                    }}
                                />
                            </div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}
// ─── ShopPreview  ───
function ShopPreview({ data }: { data: any }) {
    return (
        <div className="rounded-3xl border border-slate-200/70 bg-white/50 p-6 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/30">
            <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-400 to-teal-600 text-white shadow-lg">
                    <Store className="h-8 w-8" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {data.shop_name || 'Ma Boutique'}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {data.shop_slug}.{window.location.hostname}
                    </p>
                </div>
            </div>
            {data.shop_description && (
                <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {data.shop_description}
                </p>
            )}
        </div>
    );
}

// ─── Composant principal VendorConfigure ───
export default function VendorConfigure({
    plan,
    currencies,
    languages,
    countries,
}: Props) {
    const { flash } = usePage().props as any;
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
    const [submitProgress, setSubmitProgress] = useState(0);
    const [isCreating, setIsCreating] = useState(false);
    const [pendingRequestId, setPendingRequestId] = useState<string | null>(
        null,
    );
    const [targetDashboardUrl, setTargetDashboardUrl] = useState<string | null>(
        null,
    );
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const loadingPhrases = useMemo(() => [
        "Préparation de votre environnement...",
        "Configuration de votre boutique...",
        "Mise en place de votre base de données...",
        "Sécurisation de vos accès...",
        "Personnalisation de votre espace...",
        "Finalisation de la configuration..."
    ], []);
    const [loadingTextIndex, setLoadingTextIndex] = useState(0);

    useEffect(() => {
        if (!isCreating) {
return;
}

        const interval = setInterval(() => {
            setLoadingTextIndex((current) => (current + 1) % loadingPhrases.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [isCreating, loadingPhrases]);

    const { data, setData, post, processing, errors } = useForm({
        plan_id: plan.id,
        shop_name: '',
        shop_slug: '',
        shop_description: '',
        contact_email: '',
        contact_phone: '' as string | null,
        password: 'password',
        phone_code: detectedCountry?.phone_code || '+243',
        currency: 'CDF',
        language: 'fr',
        accept_terms: false,
        logo: null as File | null,
        social_links: {
            facebook: '',
            twitter: '',
            instagram: '',
            linkedin: '',
        },
    });

    // Capture flash data on mount (in case of page reload with flash)
    useEffect(() => {
        if (flash?.pending_vendor_request_id && !pendingRequestId) {
            setPendingRequestId(flash.pending_vendor_request_id);
            setTargetDashboardUrl(flash.target_dashboard_url);
            setIsCreating(true);
        }
    }, [
        flash.pending_vendor_request_id,
        flash.target_dashboard_url,
        pendingRequestId,
    ]);

    // Polling Logic — uses state variables, not flash props
    useEffect(() => {
        if (!pendingRequestId) {
            return;
        }

        setIsCreating(true);

        const pollInterval = setInterval(async () => {
            try {
                const response = await fetch(
                    `/devenir-vendeur/status/${pendingRequestId}`,
                    {
                        headers: {
                            Accept: 'application/json',
                            'X-Requested-With': 'XMLHttpRequest',
                        },
                    },
                );

                if (!response.ok) {
                    console.error('Polling response error:', response.status);

                    return;
                }

                const statusData = await response.json();

                if (statusData.status === 'approved') {
                    clearInterval(pollInterval);
                    // Redirection finale via SSO (token frais généré par l'API)
                    if (statusData.sso_url) {
                        window.location.href = statusData.sso_url;
                    } else if (targetDashboardUrl) {
                        window.location.href = targetDashboardUrl;
                    }
                } else if (statusData.status === 'rejected') {
                    clearInterval(pollInterval);
                    setIsCreating(false);
                    setPendingRequestId(null);
                    setTargetDashboardUrl(null);
                }
            } catch (error) {
                console.error('Polling error:', error);
            }
        }, 3000);

        return () => clearInterval(pollInterval);
    }, [pendingRequestId, targetDashboardUrl]);

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
    }, [data.shop_name, setData, slugManuallyEdited]);

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
                            (
                                document.querySelector(
                                    'meta[name="csrf-token"]',
                                ) as HTMLMetaElement
                            )?.content || '',
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

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;

        if (processing) {
            setSubmitProgress(0);
            timer = setInterval(
                () =>
                    setSubmitProgress((prev) =>
                        prev >= 90 ? 90 : prev + Math.random() * 15,
                    ),
                800,
            );
        } else {
            setSubmitProgress(100);
        }

        return () => clearInterval(timer);
    }, [processing]);

    const isFormValid = () =>
        data.shop_name.trim() &&
        data.shop_slug.trim() &&
        slugStatus === 'available' &&
        data.contact_email.trim() &&
        data.password.length >= 8 &&
        data.accept_terms;

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isFormValid()) {
            return;
        }

        setData('contact_phone', data.contact_phone?.trim() || '');
        post(route('vendor.store'), {
            forceFormData: true,
            preserveScroll: true,
            showProgress: false,
            onSuccess: (page: any) => {
                // Capture flash data into state to trigger polling
                const pageFlash = page?.props?.flash;

                if (pageFlash?.pending_vendor_request_id) {
                    setPendingRequestId(pageFlash.pending_vendor_request_id);
                    setTargetDashboardUrl(pageFlash.target_dashboard_url);
                    setIsCreating(true);
                }
            },
            onError: (formErrors: any) => {
                const firstKey = Object.keys(formErrors)[0] ?? '';

                if (firstKey.startsWith('shop_') || firstKey === 'logo') {
                    setCurrentStep(1);
                } else if (firstKey.startsWith('social_links')) {
                    setCurrentStep(3);
                } else if (
                    [
                        'contact_',
                        'phone_',
                        'currency',
                        'language',
                        'password',
                    ].some((p) => firstKey.startsWith(p))
                ) {
                    setCurrentStep(4);
                }
            },
        });
    };

    // État de chargement premium – Design moderne Light/Dark
    if (processing || isCreating) {
        return (
            <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 p-4 dark:bg-[#020817]">
                {/* Dynamic Background */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                    <motion.div
                        className="absolute top-[-20%] right-[-10%] h-160 w-160 rounded-full bg-emerald-200/40 blur-[100px] dark:bg-emerald-600/10"
                        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                    />
                    <motion.div
                        className="absolute bottom-[-20%] left-[-10%] h-160 w-160 rounded-full bg-blue-200/40 blur-[100px] dark:bg-blue-600/10"
                        animate={{ rotate: -360, scale: [1, 1.2, 1] }}
                        transition={{
                            duration: 25,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                    />
                </div>

                <Head
                    title={`Création de ${data.shop_name || 'votre boutique'}...`}
                />

                {/* Main Content Card */}
                <motion.div
                    className="relative z-10 w-full max-w-md"
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="relative overflow-hidden rounded border border-white/60 bg-white/70 px-8 py-12 shadow shadow-slate-200/50 backdrop-blur-2xl dark:border-slate-800/60 dark:bg-slate-900/60 dark:shadow-black/50">
                        {/* Top highlight line */}
                        <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-transparent via-emerald-500/50 to-transparent" />

                        {/* Center Logo/Icon */}
                        <div className="relative mx-auto mb-10 flex h-28 w-28 items-center justify-center">
                            {/* Outer dashed ring */}
                            <motion.div
                                className="absolute inset-0 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700"
                                animate={{ rotate: 360 }}
                                transition={{
                                    duration: 25,
                                    repeat: Infinity,
                                    ease: 'linear',
                                }}
                            />
                            {/* Inner spinning ring */}
                            <motion.div
                                className="absolute inset-2 rounded-full border-b-2 border-l-2 border-emerald-400 dark:border-emerald-500"
                                animate={{ rotate: -360, scale: [1, 0.95, 1] }}
                                transition={{
                                    rotate: {
                                        duration: 8,
                                        repeat: Infinity,
                                        ease: 'linear',
                                    },
                                    scale: {
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                        delay: 0.5,
                                    },
                                }}
                            />
                            {/* Center Logo/Icon */}
                            <motion.div
                                className={cn(
                                    'relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl text-white shadow-xl shadow-emerald-500/30',
                                    data.logo
                                        ? 'bg-white'
                                        : 'bg-linear-to-br from-emerald-500 to-teal-600',
                                )}
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                            >
                                {data.logo ? (
                                    <img
                                        src={URL.createObjectURL(data.logo)}
                                        alt={data.shop_name || 'Boutique'}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <svg
                                        className="h-8 w-8"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                        />
                                    </svg>
                                )}
                            </motion.div>
                        </div>

                        {/* Text Content */}
                        <div className="space-y-3 text-center">
                            <motion.h2
                                className="bg-linear-to-br from-slate-900 to-slate-600 bg-clip-text text-2xl font-bold tracking-tight text-transparent dark:from-white dark:to-slate-400"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                {data.shop_name || 'Boutique'} en cours de création...
                            </motion.h2>

                            <div className="relative h-6 w-full overflow-hidden">
                                <AnimatePresence mode="wait">
                                    <motion.p
                                        key={isCreating ? loadingTextIndex : 'done'}
                                        className="absolute w-full text-[15px] text-slate-500 dark:text-slate-400"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {isCreating
                                            ? loadingPhrases[loadingTextIndex]
                                            : 'Initialisation sécurisée en cours...'}
                                    </motion.p>
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Smooth Progress Bar */}
                        <div className="mt-12 space-y-6">
                            {/* Barre de progression épurée à la Google/Microsoft */}
                            {/* <div className="mt-8">
                                <div className="relative h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800/60">
                                    <motion.div
                                        className="absolute h-full rounded-full bg-linear-to-r from-emerald-500 to-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)] dark:from-emerald-400 dark:to-emerald-500"
                                        initial={{ left: '-40%', width: '40%' }}
                                        animate={{ left: ['-40%', '100%'] }}
                                        transition={{
                                            duration: 1.8,
                                            repeat: Infinity,
                                            ease: [0.4, 0, 0.2, 1], // Easing standard Material / Android Enterprise
                                        }}
                                    />
                                </div>
                            </div> */}

                            {/* Bouncing Dots */}
                            <div className="flex justify-center gap-2">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        className="h-2 w-2 rounded-full bg-emerald-500/80"
                                        animate={{
                                            y: [0, -6, 0],
                                            opacity: [0.5, 1, 0.5],
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            delay: i * 0.2,
                                            ease: 'easeInOut',
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Pied informatif discret entièrement intégré */}
                        <div className="mt-8 flex items-start gap-3 border-t border-slate-100 pt-6 text-left dark:border-slate-800/60">
                            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-500" />
                            <span className="text-[11px] leading-relaxed font-medium tracking-normal text-slate-400 dark:text-slate-500">
                                Création des bases de données et des protocoles
                                de sécurité. Pour garantir la stabilité,
                                veuillez ne pas rafraîchir cette page.
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <>
            <Head title="Configurez votre boutique" />
            <div className="min-h-screen bg-white dark:bg-slate-950">
                {/* Barre de progression sticky */}
                <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
                    <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-500/40 to-transparent" />
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-18 items-center justify-between gap-4">
                            <Link
                                href={route('vendor.register')}
                                className="group inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900"
                            >
                                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-600 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-emerald-950/40 dark:group-hover:text-emerald-400">
                                    <ArrowLeft className="h-4 w-4" />
                                </span>
                                <span className="hidden sm:inline">Retour</span>
                            </Link>

                            <StepIndicator
                                steps={STEPS}
                                currentStep={currentStep}
                                onStepClick={(id) => setCurrentStep(id)}
                            />

                            <Badge className="border-emerald-200 bg-emerald-50 px-3 py-1.5 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-300">
                                <Zap className="mr-1.5 h-3.5 w-3.5" />
                                Plan {plan.name}
                            </Badge>
                        </div>
                        {/* Progression mobile */}
                        <div className="pb-4 lg:hidden">
                            <div className="mb-3 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                                        {React.createElement(
                                            STEPS[currentStep - 1].icon,
                                            { className: 'h-4 w-4' },
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                            {STEPS[currentStep - 1].name}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Étape {currentStep} sur{' '}
                                            {STEPS.length}
                                        </p>
                                    </div>
                                </div>
                                <Badge
                                    variant="outline"
                                    className="rounded-full"
                                >
                                    {Math.round(
                                        (currentStep / STEPS.length) * 100,
                                    )}
                                    %
                                </Badge>
                            </div>
                            <div className="relative h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                                <motion.div
                                    className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-emerald-500 to-teal-600"
                                    initial={{ width: 0 }}
                                    animate={{
                                        width: `${(currentStep / STEPS.length) * 100}%`,
                                    }}
                                    transition={{
                                        duration: 0.4,
                                        ease: 'easeInOut',
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <AnimatePresence mode="wait">
                            {/* ======== ÉTAPE 1 : Identité ======== */}
                            {currentStep === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/90 shadow-xl shadow-slate-200/30 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-black/20"
                                >
                                    <div className="border-b border-slate-100 bg-linear-to-r from-emerald-50 via-white to-teal-50 px-6 py-6 dark:border-slate-800 dark:from-emerald-950/20 dark:via-slate-900 dark:to-teal-950/20">
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20">
                                                <Store className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <Badge className="mb-2">
                                                    Étape 1 sur 3
                                                </Badge>
                                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                                    Identité de votre boutique
                                                </h2>
                                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                                    Choisissez un nom accrocheur
                                                    et une adresse web unique.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-6 p-6">
                                        <FloatingLabelInput
                                            id="shop_name"
                                            label="Nom de la boutique"
                                            icon={Store}
                                            value={data.shop_name}
                                            onChange={(e) =>
                                                setData(
                                                    'shop_name',
                                                    e.target.value,
                                                )
                                            }
                                            error={errors.shop_name}
                                            required
                                        />
                                        <div>
                                            <FloatingLabelInput
                                                id="shop_slug"
                                                label="Adresse web"
                                                icon={Globe}
                                                value={data.shop_slug}
                                                onChange={(e) => {
                                                    setSlugManuallyEdited(true);
                                                    setData(
                                                        'shop_slug',
                                                        cleanSlug(
                                                            e.target.value,
                                                        ),
                                                    );
                                                }}
                                                error={errors.shop_slug}
                                                required
                                                rightIcon={
                                                    slugChecking ? (
                                                        <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
                                                    ) : slugStatus ===
                                                      'available' ? (
                                                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                                                    ) : slugStatus ===
                                                      'unavailable' ? (
                                                        <XCircle className="h-4 w-4 text-red-500" />
                                                    ) : null
                                                }
                                            />
                                            <div className="mt-2">
                                                {slugStatus === 'available' && (
                                                    <span className="text-sm text-emerald-600 dark:text-emerald-400">
                                                        ✓ Disponible
                                                    </span>
                                                )}
                                                {slugErrors.map((e) => (
                                                    <p
                                                        key={e}
                                                        className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400"
                                                    >
                                                        <AlertCircle className="h-4 w-4" />
                                                        {e}
                                                    </p>
                                                ))}
                                                {slugSuggestions.length > 0 && (
                                                    <div className="mt-2">
                                                        <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
                                                            Suggestions :
                                                        </p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {slugSuggestions.map(
                                                                (s) => (
                                                                    <button
                                                                        key={s}
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setSlugManuallyEdited(
                                                                                true,
                                                                            );
                                                                            setData(
                                                                                'shop_slug',
                                                                                s,
                                                                            );
                                                                        }}
                                                                        className="rounded-full border border-slate-200 px-3 py-1 text-xs hover:border-emerald-400 hover:bg-emerald-50 dark:border-slate-700 dark:text-slate-300 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/30"
                                                                    >
                                                                        {s}
                                                                    </button>
                                                                ),
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex justify-end pt-4">
                                            <Button
                                                type="button"
                                                size="lg"
                                                onClick={() =>
                                                    setCurrentStep(2)
                                                }
                                                className="rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-700 hover:to-teal-700"
                                            >
                                                Continuer{' '}
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* ======== ÉTAPE 2 : Personnalisation ======== */}
                            {currentStep === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/90 shadow-xl shadow-slate-200/30 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-black/20"
                                >
                                    <div className="border-b border-slate-100 bg-linear-to-r from-emerald-50 via-white to-teal-50 px-6 py-6 dark:border-slate-800 dark:from-emerald-950/20 dark:via-slate-900 dark:to-teal-950/20">
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20">
                                                <ImagePlus className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <Badge className="mb-2">
                                                    Étape 2 sur 5 (Optionnel)
                                                </Badge>
                                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                                    Logo de la boutique
                                                </h2>
                                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                                    Importez le logo de votre
                                                    boutique pour vous
                                                    démarquer.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-6 p-6">
                                        <div className="flex flex-col items-center justify-center gap-4">
                                            <label
                                                htmlFor="logo-upload"
                                                className="group relative flex h-32 w-32 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-emerald-300 bg-emerald-50 transition-all hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/40"
                                            >
                                                {data.logo ? (
                                                    <img
                                                        src={URL.createObjectURL(
                                                            data.logo,
                                                        )}
                                                        alt="Logo preview"
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <>
                                                        <Upload className="mb-2 h-8 w-8 text-emerald-500 transition-transform group-hover:scale-110" />
                                                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                                            Upload Logo
                                                        </span>
                                                    </>
                                                )}
                                                <input
                                                    id="logo-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const file =
                                                            e.target.files?.[0];

                                                        if (file) {
                                                            setData(
                                                                'logo',
                                                                file,
                                                            );
                                                        }
                                                    }}
                                                />
                                            </label>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                Format recommandé : 512x512px,
                                                PNG ou JPG (Max: 2MB)
                                            </p>
                                        </div>

                                        <div className="flex justify-between pt-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="lg"
                                                onClick={() =>
                                                    setCurrentStep(1)
                                                }
                                                className="rounded-2xl"
                                            >
                                                <ArrowLeft className="mr-2 h-4 w-4" />
                                                Retour
                                            </Button>
                                            <Button
                                                type="button"
                                                size="lg"
                                                onClick={() =>
                                                    setCurrentStep(3)
                                                }
                                                className="rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20"
                                            >
                                                Continuer{' '}
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* ======== ÉTAPE 3 : Réseaux Sociaux ======== */}
                            {currentStep === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/90 shadow-xl shadow-slate-200/30 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-black/20"
                                >
                                    <div className="border-b border-slate-100 bg-linear-to-r from-emerald-50 via-white to-teal-50 px-6 py-6 dark:border-slate-800 dark:from-emerald-950/20 dark:via-slate-900 dark:to-teal-950/20">
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20">
                                                <Share2 className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <Badge className="mb-2">
                                                    Étape 3 sur 5 (Optionnel)
                                                </Badge>
                                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                                    Réseaux Sociaux
                                                </h2>
                                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                                    Liez vos réseaux pour
                                                    rassurer vos futurs clients.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4 p-6">
                                        <FloatingLabelInput
                                            id="facebook"
                                            label="Page Facebook (URL)"
                                            icon={Facebook}
                                            placeholder="https://facebook.com/votreboutique"
                                            value={
                                                data.social_links?.facebook ||
                                                ''
                                            }
                                            onChange={(e) =>
                                                setData('social_links', {
                                                    ...data.social_links,
                                                    facebook: e.target.value,
                                                })
                                            }
                                        />
                                        <FloatingLabelInput
                                            id="instagram"
                                            label="Profil Instagram (URL)"
                                            icon={Instagram}
                                            placeholder="https://instagram.com/votreboutique"
                                            value={
                                                data.social_links?.instagram ||
                                                ''
                                            }
                                            onChange={(e) =>
                                                setData('social_links', {
                                                    ...data.social_links,
                                                    instagram: e.target.value,
                                                })
                                            }
                                        />
                                        <FloatingLabelInput
                                            id="twitter"
                                            label="Twitter / X (URL)"
                                            icon={Twitter}
                                            placeholder="https://twitter.com/votreboutique"
                                            value={
                                                data.social_links?.twitter || ''
                                            }
                                            onChange={(e) =>
                                                setData('social_links', {
                                                    ...data.social_links,
                                                    twitter: e.target.value,
                                                })
                                            }
                                        />

                                        <div className="flex justify-between pt-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="lg"
                                                onClick={() =>
                                                    setCurrentStep(2)
                                                }
                                                className="rounded-2xl"
                                            >
                                                <ArrowLeft className="mr-2 h-4 w-4" />
                                                Retour
                                            </Button>
                                            <Button
                                                type="button"
                                                size="lg"
                                                onClick={() =>
                                                    setCurrentStep(4)
                                                }
                                                className="rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20"
                                            >
                                                Continuer{' '}
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* ======== ÉTAPE 4 : Contact ======== */}
                            {currentStep === 4 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/90 shadow-xl shadow-slate-200/30 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-black/20"
                                >
                                    <div className="border-b border-slate-100 bg-linear-to-r from-emerald-50 via-white to-teal-50 px-6 py-6 dark:border-slate-800 dark:from-emerald-950/20 dark:via-slate-900 dark:to-teal-950/20">
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20">
                                                <Mail className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <Badge className="mb-2">
                                                    Étape 4 sur 5
                                                </Badge>
                                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                                    Contact & Sécurité
                                                </h2>
                                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                                    Assurez-vous que votre email
                                                    soit valide et définissez un
                                                    mot de passe robuste.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-6 p-6">
                                        <FloatingLabelInput
                                            id="contact_email"
                                            label="Adresse email"
                                            type="email"
                                            icon={Mail}
                                            value={data.contact_email}
                                            onChange={(e) =>
                                                setData(
                                                    'contact_email',
                                                    e.target.value,
                                                )
                                            }
                                            error={errors.contact_email}
                                            required
                                        />
                                        <FloatingLabelInput
                                            id="password"
                                            label="Mot de passe"
                                            type="password"
                                            icon={Lock}
                                            value={data.password}
                                            onChange={(e) =>
                                                setData(
                                                    'password',
                                                    e.target.value,
                                                )
                                            }
                                            error={errors.password}
                                            required
                                        />
                                        <div className="flex justify-between pt-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="lg"
                                                onClick={() =>
                                                    setCurrentStep(3)
                                                }
                                                className="rounded-2xl"
                                            >
                                                <ArrowLeft className="mr-2 h-4 w-4" />
                                                Retour
                                            </Button>
                                            <Button
                                                type="button"
                                                size="lg"
                                                onClick={() =>
                                                    setCurrentStep(5)
                                                }
                                                className="rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20"
                                            >
                                                Continuer{' '}
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* ======== ÉTAPE 5 : Validation ======== */}
                            {currentStep === 5 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/90 shadow-xl shadow-slate-200/30 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-black/20"
                                >
                                    <div className="border-b border-slate-100 bg-linear-to-r from-amber-50 via-white to-orange-50 px-6 py-6 dark:border-slate-800 dark:from-amber-950/20 dark:via-slate-900 dark:to-orange-950/20">
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/20">
                                                <Sparkles className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <Badge className="mb-2">
                                                    Étape 5 sur 5
                                                </Badge>
                                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                                    Validation
                                                </h2>
                                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                                    Vérifiez les informations
                                                    avant de lancer votre
                                                    boutique.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-6 p-6">
                                        {/* Resume Header - Figma Pro Style */}
                                        <div className="flex items-center gap-5 rounded-[2rem] border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-800/60 dark:bg-slate-900/40">
                                            {data.logo ? (
                                                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-slate-100 shadow-inner dark:border-slate-800">
                                                    <img
                                                        src={URL.createObjectURL(
                                                            data.logo,
                                                        )}
                                                        alt="Logo de la boutique"
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-inner dark:bg-emerald-950/30 dark:text-emerald-400">
                                                    <Store
                                                        className="h-10 w-10"
                                                        strokeWidth={1.5}
                                                    />
                                                </div>
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <h3 className="truncate text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                                    {data.shop_name ||
                                                        'Ma Boutique'}
                                                </h3>
                                                <div className="mt-1 flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                                    <Globe className="h-4 w-4 shrink-0 opacity-70" />
                                                    <span className="truncate">
                                                        {data.shop_slug ||
                                                            'boutique'}
                                                        .
                                                        {
                                                            window.location
                                                                .hostname
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Details Cards */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-2 rounded-[2rem] border border-slate-100 bg-slate-50/50 p-5 dark:border-slate-800/60 dark:bg-slate-950/20">
                                                <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                                    <Zap className="h-4 w-4" />
                                                    Plan Sélectionné
                                                </div>
                                                <p className="text-lg font-semibold text-slate-900 dark:text-white">
                                                    {plan.name}
                                                </p>
                                                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                                    {plan.price > 0
                                                        ? plan.formatted_price
                                                        : 'Gratuit'}
                                                </p>
                                            </div>

                                            <div className="flex flex-col gap-2 rounded-[2rem] border border-slate-100 bg-slate-50/50 p-5 dark:border-slate-800/60 dark:bg-slate-950/20">
                                                <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                                    <Mail className="h-4 w-4" />
                                                    Contact
                                                </div>
                                                <p
                                                    className="truncate text-sm font-medium text-slate-900 dark:text-white"
                                                    title={data.contact_email}
                                                >
                                                    {data.contact_email ||
                                                        'Non renseigné'}
                                                </p>
                                                <p className="truncate text-sm font-medium text-slate-500 dark:text-slate-400">
                                                    {data.contact_phone ||
                                                        'Pas de téléphone'}
                                                </p>
                                            </div>
                                        </div>
                                        <label className="flex cursor-pointer items-start gap-3">
                                            <input
                                                type="checkbox"
                                                checked={data.accept_terms}
                                                onChange={(e) =>
                                                    setData(
                                                        'accept_terms',
                                                        e.target.checked,
                                                    )
                                                }
                                                className="mt-1 h-5 w-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 dark:border-slate-600 dark:bg-slate-800 dark:checked:bg-emerald-600"
                                            />
                                            <span className="text-sm text-slate-600 dark:text-slate-400">
                                                J'accepte les{' '}
                                                <Link
                                                    href="/conditions"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-emerald-600 underline dark:text-emerald-400"
                                                >
                                                    conditions générales
                                                </Link>{' '}
                                                et la{' '}
                                                <Link
                                                    href="/confidentialite"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-emerald-600 underline dark:text-emerald-400"
                                                >
                                                    politique de confidentialité
                                                </Link>
                                                .
                                            </span>
                                        </label>
                                        {errors.accept_terms && (
                                            <p className="text-sm text-red-600 dark:text-red-400">
                                                <AlertCircle className="mr-1 inline h-4 w-4" />
                                                {errors.accept_terms}
                                            </p>
                                        )}
                                        <div className="flex justify-between pt-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="lg"
                                                onClick={() =>
                                                    setCurrentStep(4)
                                                }
                                                className="rounded-2xl"
                                            >
                                                <ArrowLeft className="mr-2 h-4 w-4" />
                                                Retour
                                            </Button>
                                            <Button
                                                type="submit"
                                                size="lg"
                                                disabled={
                                                    processing || !isFormValid()
                                                }
                                                className="rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                                            >
                                                {plan.price > 0
                                                    ? `Payer ${plan.formatted_price} & Créer`
                                                    : 'Créer gratuitement'}
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
