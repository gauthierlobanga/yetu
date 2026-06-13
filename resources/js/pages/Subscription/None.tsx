/* eslint-disable react-hooks/purity */
import { Head, Link } from '@inertiajs/react';
import type { Variants } from 'framer-motion';
import { motion } from 'framer-motion';
import { Package, ArrowRight, Zap, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SubscriptionNone() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.3 },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 8 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    };

    return (
        <>
            <Head title="Pas d'abonnement" />

            {/* Fond flou dynamique */}
            <div className="fixed inset-0 z-40 bg-linear-to-br from-slate-900/30 via-slate-800/20 to-slate-950/40 backdrop-blur-3xl" />

            {/* Particules lumineuses derrière la carte */}
            <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute h-72 w-72 rounded-full bg-teal-400/10 blur-3xl"
                        animate={{
                            x: [0, 80, -60, 0],
                            y: [0, -40, 60, 0],
                            scale: [1, 1.1, 0.9, 1],
                        }}
                        transition={{
                            duration: 18 + i * 6,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        style={{
                            left: `${15 + i * 20}%`,
                            top: `${10 + i * 25}%`,
                        }}
                    />
                ))}
                {/* Particules plus petites pour texture */}
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={`small-${i}`}
                        className="absolute h-32 w-32 rounded-full bg-cyan-300/5 blur-2xl"
                        animate={{
                            x: [0, -50, 30, 0],
                            y: [0, 30, -20, 0],
                        }}
                        transition={{
                            duration: 12 + i * 4,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                    />
                ))}
            </div>

            {/* Modal centré */}
            <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full max-w-lg"
                >
                    <motion.div
                        className="relative overflow-hidden rounded-3xl border border-white/20 bg-linear-to-br from-white/70 to-slate-50/70 shadow-2xl shadow-black/10 backdrop-blur-2xl dark:border-slate-800/50 dark:from-slate-900/70 dark:to-slate-800/70"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        {/* Ligne d'accent linear animée */}
                        <motion.div
                            className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-teal-400 via-cyan-300 to-teal-400 animate-linear-x"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                        />

                        <motion.div variants={containerVariants} className="px-8 py-12 text-center sm:px-10 sm:py-14">
                            {/* Icône animée */}
                            <motion.div variants={itemVariants} className="mb-8 flex justify-center">
                                <motion.div
                                    className="relative"
                                    animate={{ y: [0, -6, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                    <div className="absolute inset-0 rounded-full bg-linear-to-br from-teal-400/30 to-cyan-400/20 blur-2xl" />
                                    <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-teal-500 to-cyan-600 shadow-xl shadow-teal-500/30 dark:shadow-teal-900/50">
                                        <Package className="h-12 w-12 text-white" strokeWidth={1.5} />
                                    </div>
                                    <motion.div
                                        className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white/30 bg-linear-to-br from-teal-400 to-cyan-500 shadow-lg dark:border-slate-700"
                                        animate={{ scale: [1, 1.15, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <Zap className="h-4 w-4 text-white" strokeWidth={2} />
                                    </motion.div>
                                </motion.div>
                            </motion.div>

                            {/* Titre – typographie moderne avec dégradé animé */}
                            <motion.h1
                                variants={itemVariants}
                                className="mb-3 bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 bg-size-[200%_auto] bg-clip-text text-4xl font-extrabold tracking-tight text-transparent animate-linear-text dark:from-white dark:via-slate-200 dark:to-white"
                            >
                                Aucun abonnement
                            </motion.h1>

                            {/* Sous-titre */}
                            <motion.p
                                variants={itemVariants}
                                className="mb-6 text-base font-medium text-slate-600 dark:text-slate-400"
                            >
                                Votre boutique n'a pas d'abonnement actif
                            </motion.p>

                            {/* Description */}
                            <motion.p
                                variants={itemVariants}
                                className="mb-8 leading-relaxed text-slate-500 dark:text-slate-400"
                            >
                                Pour accéder à votre boutique et commencer à gérer vos produits, sélectionnez un plan d'abonnement adapté à vos besoins commerciaux.
                            </motion.p>

                            {/* Bouton principal avec effet de brillance */}
                            <motion.div variants={itemVariants} className="mb-4">
                                <Button
                                    asChild
                                    className="group relative w-full overflow-hidden rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 py-3.5 text-base font-bold text-white shadow-lg transition-all duration-300 hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl dark:from-emerald-500 dark:to-teal-500 dark:hover:from-emerald-600 dark:hover:to-teal-600"
                                >
                                    <Link
                                        href={route('subscription.show')}
                                        className="flex items-center justify-center gap-2"
                                    >
                                        {/* Effet de brillance au survol */}
                                        <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                                        <Sparkles className="relative z-10 h-5 w-5 transition-transform group-hover:scale-110" />
                                        <span className="relative z-10">Activer un abonnement</span>
                                        <ArrowRight className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </Button>
                            </motion.div>

                            {/* Badge de sécurité */}
                            <motion.div
                                variants={itemVariants}
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-200/30 bg-linear-to-r from-emerald-50/50 to-teal-50/50 px-4 py-2 text-xs font-medium text-emerald-700 shadow-sm backdrop-blur-sm dark:border-emerald-900/30 dark:from-emerald-950/30 dark:to-teal-950/30 dark:text-emerald-300"
                            >
                                <ShieldCheck className="h-4 w-4" />
                                Paiement sécurisé & chiffré
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Texte d'accompagnement */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-6 text-center text-sm text-slate-400 dark:text-slate-500"
                    >
                        Démarrez votre activité en ligne dès aujourd'hui
                    </motion.p>
                </motion.div>
            </div>

            {/* Styles pour les animations de dégradé (à ajouter dans votre CSS global ou via un <style> intégré) */}
            <style>{`
                @keyframes linear-x {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-linear-x {
                    animation: linear-x 3s ease infinite;
                    background-size: 200% 200%;
                }
                @keyframes linear-text {
                    0%, 100% { background-position: 0% center; }
                    50% { background-position: 100% center; }
                }
                .animate-linear-text {
                    animation: linear-text 4s ease infinite;
                }
            `}</style>
        </>
    );
}
