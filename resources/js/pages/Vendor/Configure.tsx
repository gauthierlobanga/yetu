/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/Pages/Vendor/Configure.tsx
import { Head, useForm, Link } from '@inertiajs/react';
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
} from 'lucide-react';
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

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
        name: 'Contact',
        icon: Mail,
        description: 'Email et mot de passe',
    },
    {
        id: 3,
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
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { data, setData, post, processing, errors, recentlySuccessful } =
        useForm({
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isFormValid()) {
            return;
        }

        setData('contact_phone', data.contact_phone?.trim() || '');
        post(route('vendor.store'), {
            forceFormData: true,
            preserveScroll: true,
            onError: (formErrors: any) => {
                const firstKey = Object.keys(formErrors)[0] ?? '';

                if (firstKey.startsWith('shop_')) {
                    setCurrentStep(1);
                } else if (
                    [
                        'contact_',
                        'phone_',
                        'currency',
                        'language',
                        'password',
                    ].some((p) => firstKey.startsWith(p))
                ) {
                    setCurrentStep(2);
                }
            },
        });
    };

    // État de chargement / succès
    if (processing || recentlySuccessful) {
        const steps = [
            { name: 'Création du tenant', duration: 2 },
            { name: 'Configuration de la boutique', duration: 3 },
            { name: 'Setup des permissions', duration: 2 },
            { name: 'Finalisation', duration: 1 },
        ];

        const currentProgressStep = Math.floor(
            (submitProgress / 100) * steps.length,
        );

        return (
            <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-white via-emerald-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/30 p-4">
                <div className="w-full max-w-md space-y-8">
                    {/* Animated Icon Circle */}
                    <motion.div
                        className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-linear-to-br from-emerald-500 to-teal-600 shadow-2xl shadow-emerald-500/20"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                            type: 'spring',
                            stiffness: 200,
                            damping: 15,
                        }}
                    >
                        {recentlySuccessful ? (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <PartyPopper className="h-16 w-16 text-white" />
                            </motion.div>
                        ) : (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: 'linear',
                                }}
                            >
                                <Loader2 className="h-16 w-16 text-white" />
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Title */}
                    <div className="text-center space-y-2">
                        <motion.h2
                            className="text-3xl font-bold text-slate-900 dark:text-white"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            {recentlySuccessful
                                ? '🎉 Félicitations!'
                                : 'Création de votre boutique'}
                        </motion.h2>
                        <motion.p
                            className="text-sm text-slate-500 dark:text-slate-400"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            {recentlySuccessful
                                ? 'Votre boutique est maintenant prête à être utilisée'
                                : 'Veuillez patienter, nous configurons tout...'}
                        </motion.p>
                    </div>

                    {!recentlySuccessful && (
                        <div className="space-y-6">
                            {/* Progress Bar */}
                            <div className="space-y-2">
                                <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                                    <motion.div
                                        className="h-full rounded-full bg-linear-to-r from-emerald-500 via-teal-500 to-emerald-500 bg-[length:200%_100%]"
                                        animate={{
                                            backgroundPosition: ['0% 0%', '100% 0%'],
                                        }}
                                        initial={{
                                            width: `${submitProgress}%`,
                                        }}
                                        animate={{
                                            width: `${submitProgress}%`,
                                        }}
                                        transition={{
                                            backgroundPosition: {
                                                duration: 2,
                                                repeat: Infinity,
                                            },
                                            width: {
                                                duration: 0.5,
                                                ease: 'easeOut',
                                            },
                                        }}
                                    />
                                </div>
                                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                                    <span>{Math.round(submitProgress)}%</span>
                                    <span>
                                        {
                                            steps[currentProgressStep]?.name
                                        }
                                    </span>
                                </div>
                            </div>

                            {/* Steps Timeline */}
                            <div className="space-y-3">
                                {steps.map((step, idx) => (
                                    <motion.div
                                        key={idx}
                                        className="flex items-center gap-3"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                    >
                                        <div
                                            className={cn(
                                                'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all',
                                                idx < currentProgressStep
                                                    ? 'bg-emerald-500 text-white'
                                                    : idx ===
                                                        currentProgressStep
                                                      ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                                                      : 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600',
                                            )}
                                        >
                                            {idx <
                                            currentProgressStep ? (
                                                <Check className="h-4 w-4" />
                                            ) : idx ===
                                              currentProgressStep ? (
                                                <motion.div
                                                    animate={{
                                                        rotate: 360,
                                                    }}
                                                    transition={{
                                                        duration: 1.5,
                                                        repeat: Infinity,
                                                    }}
                                                >
                                                    <Loader2 className="h-4 w-4" />
                                                </motion.div>
                                            ) : (
                                                idx + 1
                                            )}
                                        </div>
                                        <span
                                            className={cn(
                                                'text-sm font-medium transition-colors',
                                                idx <= currentProgressStep
                                                    ? 'text-slate-900 dark:text-white'
                                                    : 'text-slate-400 dark:text-slate-600',
                                            )}
                                        >
                                            {step.name}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Tip */}
                            <div className="rounded-2xl bg-blue-50 p-4 dark:bg-blue-950/20">
                                <p className="text-xs text-blue-700 dark:text-blue-300">
                                    <Sparkles className="mr-2 inline h-3 w-3" />
                                    Astuce: Ne fermez pas cette page
                                    pendant la création de votre boutique.
                                </p>
                            </div>
                        </div>
                    )}

                    {recentlySuccessful && (
                        <motion.button
                            onClick={() =>
                                (window.location.href = route(
                                    'tenant.dashboard',
                                ))
                            }
                            className="w-full rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 px-6 py-3 text-white font-semibold shadow-lg shadow-emerald-500/20 hover:from-emerald-700 hover:to-teal-700 transition-all"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Accéder à ma boutique →
                        </motion.button>
                    )}
                </div>
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

                            {/* ======== ÉTAPE 2 : Contact ======== */}
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
                                                <Mail className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <Badge className="mb-2">
                                                    Étape 2 sur 3
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

                            {/* ======== ÉTAPE 3 : Validation ======== */}
                            {currentStep === 3 && (
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
                                                    Étape 3 sur 3
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
                                        <div className="grid grid-cols-2 gap-4 rounded-3xl bg-slate-50/80 p-4 dark:bg-slate-950/30">
                                            <div>
                                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                                    Plan
                                                </span>
                                                <p className="font-medium text-slate-900 dark:text-white">
                                                    {plan.name} (
                                                    {plan.formatted_price})
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                                    Nom
                                                </span>
                                                <p className="font-medium text-slate-900 dark:text-white">
                                                    {data.shop_name}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                                    Adresse
                                                </span>
                                                <p className="font-medium text-slate-900 dark:text-white">
                                                    {data.shop_slug}.
                                                    {window.location.hostname}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                                    Email
                                                </span>
                                                <p className="font-medium text-slate-900 dark:text-white">
                                                    {data.contact_email}
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
                                                    setCurrentStep(2)
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
