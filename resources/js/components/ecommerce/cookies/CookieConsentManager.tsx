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
import { ShieldCheck, Cookie } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CookieConsentManager() {
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

    if (!isLoaded) return null;

    return (
        <>
            <AnimatePresence>
                {showBanner && !isDialogOpen && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 pointer-events-none"
                    >
                        <div className="mx-auto max-w-5xl pointer-events-auto">
                            <div className="flex flex-col md:flex-row items-center gap-4 p-5 rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-xl shadow-2xl dark:border-slate-800/60 dark:bg-slate-950/80">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                                        <Cookie className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                                            Respect de votre vie privée
                                        </h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            Nous utilisons des cookies pour améliorer votre expérience, analyser notre trafic et vous proposer des contenus personnalisés.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center justify-end gap-2 w-full md:w-auto shrink-0">
                                    <Button
                                        variant="ghost"
                                        className="text-slate-500"
                                        onClick={() => setIsDialogOpen(true)}
                                    >
                                        Personnaliser
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={declineAll}
                                        className="border-slate-200 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800"
                                    >
                                        Continuer sans accepter
                                    </Button>
                                    <Button
                                        onClick={acceptAll}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                    >
                                        Tout accepter
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-2xl bg-white/95 backdrop-blur-xl dark:bg-slate-950/95">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <ShieldCheck className="h-5 w-5 text-emerald-500" />
                            Préférences de cookies
                        </DialogTitle>
                        <DialogDescription>
                            Gérez vos préférences de consentement pour les cookies. Les cookies nécessaires au fonctionnement du site ne peuvent pas être désactivés.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-6 py-4">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="necessary" className="flex flex-col gap-1">
                                    <span className="font-semibold text-slate-900 dark:text-slate-100">Strictement nécessaires</span>
                                    <span className="font-normal text-xs text-slate-500 dark:text-slate-400">
                                        Requis pour le fonctionnement de base du site (panier, sécurité, etc.).
                                    </span>
                                </Label>
                                <Switch
                                    id="necessary"
                                    checked={true}
                                    disabled
                                    className="data-[state=checked]:bg-emerald-600"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="analytics" className="flex flex-col gap-1 cursor-pointer">
                                    <span className="font-semibold text-slate-900 dark:text-slate-100">Analytiques</span>
                                    <span className="font-normal text-xs text-slate-500 dark:text-slate-400">
                                        Nous aident à comprendre comment les visiteurs interagissent avec le site.
                                    </span>
                                </Label>
                                <Switch
                                    id="analytics"
                                    checked={tempPrefs.analytics}
                                    onCheckedChange={(checked) => setTempPrefs({ ...tempPrefs, analytics: checked })}
                                    className="data-[state=checked]:bg-emerald-600"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="marketing" className="flex flex-col gap-1 cursor-pointer">
                                    <span className="font-semibold text-slate-900 dark:text-slate-100">Marketing & Publicité</span>
                                    <span className="font-normal text-xs text-slate-500 dark:text-slate-400">
                                        Utilisés pour vous fournir des annonces pertinentes et des campagnes publicitaires.
                                    </span>
                                </Label>
                                <Switch
                                    id="marketing"
                                    checked={tempPrefs.marketing}
                                    onCheckedChange={(checked) => setTempPrefs({ ...tempPrefs, marketing: checked })}
                                    className="data-[state=checked]:bg-emerald-600"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="preferences" className="flex flex-col gap-1 cursor-pointer">
                                    <span className="font-semibold text-slate-900 dark:text-slate-100">Préférences de personnalisation</span>
                                    <span className="font-normal text-xs text-slate-500 dark:text-slate-400">
                                        Permettent de mémoriser vos choix (langue, région) pour une expérience personnalisée.
                                    </span>
                                </Label>
                                <Switch
                                    id="preferences"
                                    checked={tempPrefs.preferences}
                                    onCheckedChange={(checked) => setTempPrefs({ ...tempPrefs, preferences: checked })}
                                    className="data-[state=checked]:bg-emerald-600"
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:justify-between">
                        <Button
                            variant="ghost"
                            onClick={() => setIsDialogOpen(false)}
                            className="w-full sm:w-auto"
                        >
                            Annuler
                        </Button>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <Button
                                variant="outline"
                                onClick={acceptAll}
                                className="w-full sm:w-auto"
                            >
                                Tout accepter
                            </Button>
                            <Button
                                onClick={handleSavePreferences}
                                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white"
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
