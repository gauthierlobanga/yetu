import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Loader2, ShieldCheck } from 'lucide-react';

interface Props {
    processing: boolean;
    isCreating: boolean;
    data: {
        shop_name?: string;
    };
}

export function PremiumLoadingState({
    processing,
    isCreating,
    data,
}: Props) {
    if (!processing && !isCreating) {
        return null;
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 p-6 dark:bg-slate-950">
            {/* Arrière-plan : Grille de design fine + lueur Émeraude discrète */}
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#0f172a0a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a0a_1px,transparent_1px)] bg-size-[4rem_4rem] opacity-40 dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] dark:opacity-20" />

            <div className="pointer-events-none absolute top-1/2 left-1/2 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[120px] dark:bg-emerald-500/5" />

            <Head
                title={`Configuration de ${data.shop_name || 'votre boutique'}...`}
            />

            <motion.div
                className="relative z-10 w-full max-w-md"
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
                {/* Plaque principale épurée */}
                <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-8 shadow-[0_24px_50px_-12px_rgba(15,23,42,0.08)] backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-900/70 dark:shadow-[0_24px_50px_-12px_rgba(0,0,0,0.5)]">
                    {/* Zone de l'icône de chargement */}
                    <div className="mb-8 flex justify-center">
                        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 shadow-xs dark:border-slate-800/60 dark:bg-slate-950">
                            {/* Halo lumineux intermittent */}
                            <motion.div
                                className="absolute inset-0 rounded-2xl bg-emerald-500/20 blur-md dark:bg-emerald-500/10"
                                animate={{ opacity: [0.3, 0.8, 0.3] }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                            />

                            {/* Loader central fluide */}
                            <Loader2 className="relative h-6 w-6 animate-spin text-emerald-600 animation-duration-[1.5s] dark:text-emerald-400" />
                        </div>
                    </div>

                    {/* Textes et Hiérarchie Typographique */}
                    <div className="space-y-2 text-center">
                        <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                            {data.shop_name ? (
                                <>
                                    Création de{' '}
                                    <span className="text-emerald-600 dark:text-emerald-400">
                                        {data.shop_name}
                                    </span>
                                </>
                            ) : (
                                'Initialisation de la boutique'
                            )}
                        </h2>

                        <p className="mx-auto max-w-xs text-sm leading-relaxed font-normal text-slate-500 dark:text-slate-400">
                            {isCreating
                                ? 'Nous préparons votre écosystème premium...'
                                : 'Configuration de votre espace de vente sécurisé...'}
                        </p>
                    </div>

                    {/* Barre de progression épurée à la Google/Microsoft */}
                    <div className="mt-8">
                        <div className="relative h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800/60">
                            <motion.div
                                className="absolute h-full rounded-full bg-linear-to-r from-emerald-500 to-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)] dark:from-emerald-400 dark:to-emerald-500"
                                initial={{ left: '-40%', width: '40%' }}
                                animate={{ left: ['-40%', '100%'] }}
                                transition={{
                                    duration: 1.6,
                                    repeat: Infinity,
                                    ease: [0.4, 0, 0.2, 1], // Easing standard Material / Android Enterprise
                                }}
                            />
                        </div>
                    </div>

                    {/* Pied informatif discret entièrement intégré */}
                    <div className="mt-8 flex items-start gap-3 border-t border-slate-100 pt-6 text-left dark:border-slate-800/60">
                        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-500" />
                        <span className="text-[11px] leading-relaxed font-medium tracking-normal text-slate-400 dark:text-slate-500">
                            Création des bases de données et des protocoles de
                            sécurité. Pour garantir la stabilité, veuillez ne
                            pas rafraîchir cette page.
                        </span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
