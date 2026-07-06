import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCookieConsent, CookiePreferences } from '@/hooks/useCookieConsent';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ShieldCheck, Cookie, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';

interface CookieSettings {
    enabled: boolean;
    title: string;
    message: string;
    button_accept: string;
    button_decline: string;
    button_customize: string;
    cookie_definitions?: {
        category: string;
        name: string;
        description: string;
        required: boolean;
    }[];
}

export function CookieConsentManager() {
    const { tenant } = usePage<PageProps>().props;
    
    const cookieSettings: CookieSettings = tenant?.cookie_settings || {
        enabled: true,
        title: 'Respect de votre vie privée',
        message: 'Nous utilisons des cookies pour améliorer votre expérience, analyser notre trafic et vous proposer des contenus personnalisés.',
        button_accept: 'Tout accepter',
        button_decline: 'Continuer sans accepter',
        button_customize: 'Personnaliser',
        cookie_definitions: [
            {
                category: 'necessary',
                name: 'Strictement nécessaires',
                description: 'Requis pour le fonctionnement de base du site (panier, sécurité, session).',
                required: true,
            },
            {
                category: 'analytics',
                name: 'Analytiques',
                description: 'Nous aident à comprendre comment les visiteurs interagissent avec le site.',
                required: false,
            },
            {
                category: 'marketing',
                name: 'Marketing & Publicité',
                description: 'Utilisés pour vous fournir des annonces pertinentes et des campagnes publicitaires.',
                required: false,
            },
            {
                category: 'preferences',
                name: 'Personnalisation',
                description: 'Permettent de mémoriser vos choix (langue, région) pour une expérience sur-mesure.',
                required: false,
            }
        ]
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

    // Sync tempPrefs with actual preferences when dialog opens
    useEffect(() => {
        if (isDialogOpen) {
            setTempPrefs(preferences);
        }
    }, [isDialogOpen, preferences]);

    const handleSavePreferences = () => {
        savePreferences(tempPrefs);
        setIsDialogOpen(false);
    };

    if (!isLoaded || !cookieSettings.enabled) return null;

    return (
        <>
            <AnimatePresence>
                {showBanner && !isDialogOpen && (
                    <motion.div
                        initial={{ y: 50, opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 50, opacity: 0, scale: 0.95 }}
                        transition={{ 
                            type: 'spring',
                            stiffness: 400,
                            damping: 30
                        }}
                        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 pointer-events-none flex justify-end"
                    >
                        <div className="relative pointer-events-auto max-w-[26rem] w-full group overflow-hidden rounded-[2rem] border border-white/40 bg-white/70 backdrop-blur-2xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.15)] ring-1 ring-black/5 dark:border-white/10 dark:bg-slate-950/70 dark:ring-white/10 dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)]">
                            
                            {/* Subtle animated background gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-50 blur-2xl -z-10" />

                            <div className="p-6">
                                <div className="flex items-start gap-4 mb-5">
                                    <div className="relative flex shrink-0 items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-500/20 dark:to-emerald-500/5 ring-1 ring-emerald-500/20 dark:ring-emerald-500/30">
                                        <Cookie className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                        <div className="absolute top-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-950" />
                                    </div>
                                    <div className="flex-1 min-w-0 pt-1">
                                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                                            {cookieSettings.title}
                                        </h3>
                                        <p className="mt-1 text-sm text-slate-600/90 dark:text-slate-400/90 leading-relaxed">
                                            {cookieSettings.message}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2.5">
                                    <Button
                                        onClick={acceptAll}
                                        className="w-full h-11 rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-sm ring-1 ring-emerald-600/20"
                                    >
                                        {cookieSettings.button_accept}
                                    </Button>
                                    <div className="flex gap-2.5">
                                        <Button
                                            variant="outline"
                                            onClick={declineAll}
                                            className="flex-1 h-10 rounded-xl border-slate-200/60 bg-white/50 hover:bg-slate-50 dark:border-slate-800/60 dark:bg-slate-900/50 dark:hover:bg-slate-800 shadow-sm"
                                        >
                                            {cookieSettings.button_decline}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsDialogOpen(true)}
                                            className="flex-1 h-10 rounded-xl border-slate-200/60 bg-white/50 hover:bg-slate-50 dark:border-slate-800/60 dark:bg-slate-900/50 dark:hover:bg-slate-800 shadow-sm gap-2"
                                        >
                                            <Settings2 className="h-4 w-4 text-slate-500" />
                                            {cookieSettings.button_customize}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-[2rem] bg-white/80 backdrop-blur-3xl border-white/40 dark:bg-slate-950/80 dark:border-white/10 shadow-2xl">
                    <DialogHeader className="pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
                        <DialogTitle className="flex items-center gap-3 text-xl">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100/50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            Préférences de cookies
                        </DialogTitle>
                        <DialogDescription className="pt-2">
                            Gérez vos préférences de consentement pour les cookies. Les cookies nécessaires au fonctionnement du site ne peuvent pas être désactivés.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-5 py-4 max-h-[60vh] overflow-y-auto px-1">
                        {cookieSettings.cookie_definitions?.map((def, index) => (
                            <div key={def.category}>
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-start justify-between gap-4">
                                        <Label htmlFor={def.category} className={cn("flex flex-col gap-1.5", def.required ? "cursor-not-allowed" : "cursor-pointer")}>
                                            <span className="font-medium text-slate-900 dark:text-slate-100">{def.name}</span>
                                            <span className="font-normal text-sm text-slate-500 dark:text-slate-400">
                                                {def.description}
                                            </span>
                                        </Label>
                                        <Switch
                                            id={def.category}
                                            checked={def.required ? true : tempPrefs[def.category as keyof CookiePreferences] || false}
                                            disabled={def.required}
                                            onCheckedChange={(checked) => {
                                                if (!def.required) {
                                                    setTempPrefs({ ...tempPrefs, [def.category]: checked });
                                                }
                                            }}
                                            className="data-[state=checked]:bg-emerald-600 mt-1 shadow-sm"
                                        />
                                    </div>
                                </div>
                                {index < (cookieSettings.cookie_definitions?.length || 0) - 1 && (
                                    <div className="h-px bg-slate-200/50 dark:bg-slate-800/50 mt-5" />
                                )}
                            </div>
                        ))}
                    </div>

                    <DialogFooter className="gap-2 sm:justify-between pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                        <Button
                            variant="ghost"
                            onClick={() => setIsDialogOpen(false)}
                            className="w-full sm:w-auto rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
                        >
                            Annuler
                        </Button>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <Button
                                variant="outline"
                                onClick={acceptAll}
                                className="w-full sm:w-auto rounded-xl border-slate-200/60 bg-white/50 hover:bg-slate-50 dark:border-slate-800/60 dark:bg-slate-900/50 shadow-sm"
                            >
                                Tout accepter
                            </Button>
                            <Button
                                onClick={handleSavePreferences}
                                className="w-full sm:w-auto rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-sm ring-1 ring-emerald-600/20"
                            >
                                Enregistrer
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
