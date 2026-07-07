/* eslint-disable @stylistic/padding-line-between-statements */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import { usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShieldCheck,
    Cookie,
    Settings2,
    X,
    CheckCircle,
    AlertCircle,
    Globe,
    BarChart3,
    ShoppingBag,
    User,
    ExternalLink,
} from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import type { CookiePreferences } from '@/hooks/useCookieConsent';
import { cn } from '@/lib/utils';
import type { PageProps } from '@/types/tenants/products';

interface CookieSettings {
    enabled: boolean;
    title: string;
    message: string;
    button_accept: string;
    button_decline: string;
    button_customize: string;
    privacy_policy_url?: string;
    cookie_definitions?: {
        category: string;
        name: string;
        description: string;
        required: boolean;
        icon?: React.ReactNode;
    }[];
}

const categoryIcons: Record<string, React.ReactNode> = {
    necessary: <ShieldCheck className="h-4 w-4" />,
    analytics: <BarChart3 className="h-4 w-4" />,
    marketing: <ShoppingBag className="h-4 w-4" />,
    preferences: <User className="h-4 w-4" />,
};

const categoryColors: Record<string, string> = {
    necessary:
        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    analytics:
        'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    marketing:
        'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
    preferences:
        'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
};

export function CookieConsentManager() {
    const { tenant } = usePage<PageProps>().props;

    const cookieSettings: CookieSettings = tenant?.cookie_settings || {
        enabled: true,
        title: '🍪 Respect de votre vie privée',
        message:
            'Nous utilisons des cookies pour améliorer votre expérience, analyser notre trafic et vous proposer des contenus personnalisés.',
        button_accept: 'Tout accepter',
        button_decline: 'Continuer sans accepter',
        button_customize: 'Personnaliser',
        privacy_policy_url: '/privacy-policy',
        cookie_definitions: [
            {
                category: 'necessary',
                name: 'Strictement nécessaires',
                description:
                    'Requis pour le fonctionnement de base du site (panier, sécurité, session).',
                required: true,
                icon: categoryIcons.necessary,
            },
            {
                category: 'analytics',
                name: 'Analytiques',
                description:
                    'Nous aident à comprendre comment les visiteurs interagissent avec le site.',
                required: false,
                icon: categoryIcons.analytics,
            },
            {
                category: 'marketing',
                name: 'Marketing & Publicité',
                description:
                    'Utilisés pour vous fournir des annonces pertinentes et des campagnes publicitaires.',
                required: false,
                icon: categoryIcons.marketing,
            },
            {
                category: 'preferences',
                name: 'Personnalisation',
                description:
                    'Permettent de mémoriser vos choix (langue, région) pour une expérience sur-mesure.',
                required: false,
                icon: categoryIcons.preferences,
            },
        ],
    };

    const {
        showBanner,
        preferences,
        isLoaded,
        acceptAll,
        declineAll,
        savePreferences,
    } = useCookieConsent();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [tempPrefs, setTempPrefs] = useState<CookiePreferences>(preferences);
    const [showFloatingButton, setShowFloatingButton] = useState(false);
    const initialLoadRef = useRef(true);

    // Détermine si le consentement est complet (toutes les catégories facultatives sont activées)
    const isFullConsent = useMemo(() => {
        const optionalCategories =
            cookieSettings.cookie_definitions
                ?.filter((def) => !def.required)
                .map((def) => def.category) || [];
        return optionalCategories.every(
            (cat) => preferences[cat as keyof CookiePreferences] === true,
        );
    }, [preferences, cookieSettings.cookie_definitions]);

    // Synchronisation des préférences temporaires
    useEffect(() => {
        if (isDialogOpen) {
            setTempPrefs(preferences);
        }
    }, [isDialogOpen, preferences]);

    // Gestion de l'affichage du bouton flottant
    useEffect(() => {
        // Le bouton flottant s'affiche si le banner est fermé, que le consentement n'est pas complet
        // et qu'on a déjà chargé
        if (!showBanner && isLoaded && !isFullConsent) {
            setShowFloatingButton(true);
        } else {
            setShowFloatingButton(false);
        }

        if (initialLoadRef.current && isLoaded) {
            initialLoadRef.current = false;
        }
    }, [showBanner, isLoaded, isFullConsent]);

    const handleSavePreferences = () => {
        savePreferences(tempPrefs);
        setIsDialogOpen(false);
        // Après sauvegarde, le consentement peut devenir complet → le flottant disparaîtra via l'effet
    };

    const handleAcceptAll = () => {
        acceptAll();
        // Après acceptAll, le consentement devient complet → le flottant disparaît
    };

    const handleDeclineAll = () => {
        declineAll();
        // Après refus, le consentement n'est pas complet → le flottant reste
    };

    if (!isLoaded || !cookieSettings.enabled) {
        return null;
    }

    return (
        <>
            {/* Banner principal */}
            <AnimatePresence>
                {showBanner && !isDialogOpen && (
                    <motion.div
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 40, opacity: 0 }}
                        transition={{
                            type: 'spring',
                            stiffness: 400,
                            damping: 28,
                        }}
                        className="pointer-events-none fixed right-4 bottom-4 left-4 z-50 flex justify-end sm:right-6 sm:bottom-6 sm:left-auto"
                    >
                        <div
                            className="group pointer-events-auto relative w-full max-w-104 overflow-hidden rounded-[2rem] border border-white/40 bg-white/70 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.15)] ring-1 ring-black/5 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/70 dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)] dark:ring-white/10"
                            role="dialog"
                            aria-label="Gestion des cookies"
                        >
                            <div className="absolute inset-0 -z-10 bg-linear-to-br from-emerald-500/10 via-transparent to-transparent opacity-50 blur-2xl" />

                            <div className="p-6">
                                <div className="mb-5 flex items-start gap-4">
                                    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-emerald-100 to-emerald-50 ring-1 ring-emerald-500/20 dark:from-emerald-500/20 dark:to-emerald-500/5 dark:ring-emerald-500/30">
                                        <Cookie className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                        <div className="absolute -top-1 -right-1 h-3.5 w-3.5 animate-pulse rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-950" />
                                    </div>
                                    <div className="min-w-0 flex-1 pt-1">
                                        <h3 className="leading-tight font-semibold text-slate-900 dark:text-slate-100">
                                            {cookieSettings.title}
                                        </h3>
                                        <p className="mt-1 text-sm leading-relaxed text-slate-600/90 dark:text-slate-400/90">
                                            {cookieSettings.message}
                                        </p>
                                        {cookieSettings.privacy_policy_url && (
                                            <a
                                                href={
                                                    cookieSettings.privacy_policy_url
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-2 inline-flex items-center text-xs font-medium text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                                            >
                                                En savoir plus
                                                <ExternalLink className="ml-1 h-3 w-3" />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2.5">
                                    <Button
                                        onClick={handleAcceptAll}
                                        className="h-11 w-full rounded-xl bg-linear-to-b from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/20 transition-shadow hover:from-emerald-600 hover:to-emerald-700 hover:shadow-emerald-500/30"
                                    >
                                        {cookieSettings.button_accept}
                                    </Button>
                                    <div className="flex gap-2.5">
                                        <Button
                                            variant="outline"
                                            onClick={handleDeclineAll}
                                            className="h-10 flex-1 rounded-xl border-slate-200/60 bg-white/50 shadow-sm hover:bg-slate-50 dark:border-slate-800/60 dark:bg-slate-900/50 dark:hover:bg-slate-800"
                                        >
                                            {cookieSettings.button_decline}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                setIsDialogOpen(true)
                                            }
                                            className="group h-10 flex-1 gap-2 rounded-xl border-slate-200/60 bg-white/50 shadow-sm hover:bg-slate-50 dark:border-slate-800/60 dark:bg-slate-900/50 dark:hover:bg-slate-800"
                                        >
                                            <Settings2 className="h-4 w-4 text-slate-500 transition-transform group-hover:rotate-90" />
                                            {cookieSettings.button_customize}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bouton flottant modernisé */}
            <AnimatePresence>
                {showFloatingButton && !showBanner && (
                    <motion.button
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{
                            type: 'spring',
                            stiffness: 500,
                            damping: 30,
                            mass: 0.8,
                        }}
                        onClick={() => setIsDialogOpen(true)}
                        className="fixed right-6 bottom-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md ring-2 shadow-emerald-500/25 ring-white/20 transition-all duration-200 hover:scale-105 hover:bg-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:outline-none"
                        aria-label="Ouvrir les paramètres des cookies"
                    >
                        <Cookie className="h-4 w-4" />
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[8px] font-bold text-emerald-600 shadow-sm">
                            {Object.values(preferences).filter(Boolean).length}
                        </span>
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Dialogue de personnalisation (inchangé) */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="overflow-hidden rounded-[2rem] border-white/40 bg-white/90 p-0 shadow-2xl backdrop-blur-3xl sm:max-w-125 dark:border-white/10 dark:bg-slate-950/90">
                    <div className="relative">
                        <div className="absolute inset-0 bg-linear-to-br from-emerald-500/10 via-transparent to-transparent opacity-30 blur-2xl" />

                        <DialogHeader className="relative border-b border-slate-200/50 p-6 pb-4 dark:border-slate-800/50">
                            <DialogTitle className="flex items-center gap-3 text-xl">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100/50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <span>Préférences de cookies</span>
                            </DialogTitle>
                            <DialogDescription className="pt-2 text-sm text-slate-600 dark:text-slate-400">
                                Gérez vos préférences de consentement pour les
                                cookies. Les cookies nécessaires au
                                fonctionnement du site ne peuvent pas être
                                désactivés.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="relative flex max-h-[60vh] flex-col gap-4 overflow-y-auto px-6 py-4">
                            {cookieSettings.cookie_definitions?.map(
                                (def, index) => {
                                    const isActive = def.required
                                        ? true
                                        : (tempPrefs[
                                              def.category as keyof CookiePreferences
                                          ] ?? false);
                                    const colorClass =
                                        categoryColors[def.category] ||
                                        'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';

                                    return (
                                        <div key={def.category}>
                                            <div className="flex flex-col gap-3 rounded-xl border border-slate-200/30 bg-slate-50/50 p-4 transition-colors hover:border-slate-300/50 dark:border-slate-800/30 dark:bg-slate-900/30 dark:hover:border-slate-700/50">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex items-start gap-3">
                                                        <div
                                                            className={cn(
                                                                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                                                                colorClass,
                                                            )}
                                                        >
                                                            {def.icon || (
                                                                <Globe className="h-4 w-4" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <Label
                                                                htmlFor={
                                                                    def.category
                                                                }
                                                                className={cn(
                                                                    'flex cursor-pointer flex-col gap-0.5',
                                                                    def.required &&
                                                                        'cursor-not-allowed',
                                                                )}
                                                            >
                                                                <span className="font-medium text-slate-900 dark:text-slate-100">
                                                                    {def.name}
                                                                </span>
                                                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                                                    {
                                                                        def.description
                                                                    }
                                                                </span>
                                                            </Label>
                                                            <div className="mt-1.5 flex items-center gap-2">
                                                                {def.required ? (
                                                                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                                                                        <CheckCircle className="h-3 w-3" />
                                                                        Requis
                                                                    </span>
                                                                ) : (
                                                                    <span
                                                                        className={cn(
                                                                            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium',
                                                                            isActive
                                                                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                                                                                : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
                                                                        )}
                                                                    >
                                                                        {isActive
                                                                            ? 'Activé'
                                                                            : 'Désactivé'}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Switch
                                                        id={def.category}
                                                        checked={
                                                            def.required
                                                                ? true
                                                                : isActive
                                                        }
                                                        disabled={def.required}
                                                        onCheckedChange={(
                                                            checked,
                                                        ) => {
                                                            if (!def.required) {
                                                                setTempPrefs({
                                                                    ...tempPrefs,
                                                                    [def.category]:
                                                                        checked,
                                                                });
                                                            }
                                                        }}
                                                        className="mt-1 shadow-sm data-[state=checked]:bg-emerald-600"
                                                    />
                                                </div>
                                            </div>
                                            {index <
                                                (cookieSettings
                                                    .cookie_definitions
                                                    ?.length || 0) -
                                                    1 && (
                                                <div className="h-px bg-slate-200/50 dark:bg-slate-800/50" />
                                            )}
                                        </div>
                                    );
                                },
                            )}
                        </div>

                        <DialogFooter className="relative flex flex-col gap-2 border-t border-slate-200/50 bg-slate-50/30 p-6 pt-4 sm:flex-row sm:justify-between dark:border-slate-800/50 dark:bg-slate-900/30">
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                <AlertCircle className="h-4 w-4 text-slate-400" />
                                <span>
                                    Vous pouvez modifier vos préférences à tout
                                    moment.
                                </span>
                            </div>
                            <div className="flex w-full gap-2 sm:w-auto">
                                <Button
                                    variant="ghost"
                                    onClick={() => setIsDialogOpen(false)}
                                    className="w-full rounded-xl hover:bg-slate-100/50 sm:w-auto dark:hover:bg-slate-800/50"
                                >
                                    Annuler
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        acceptAll();
                                        setIsDialogOpen(false);
                                    }}
                                    className="w-full rounded-xl border-slate-200/60 bg-white/50 shadow-sm hover:bg-slate-50 sm:w-auto dark:border-slate-800/60 dark:bg-slate-900/50"
                                >
                                    Tout accepter
                                </Button>
                                <Button
                                    onClick={handleSavePreferences}
                                    className="w-full rounded-xl bg-linear-to-b from-emerald-500 to-emerald-600 text-white shadow-sm ring-1 ring-emerald-600/20 hover:from-emerald-600 hover:to-emerald-700 sm:w-auto"
                                >
                                    Enregistrer
                                </Button>
                            </div>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
