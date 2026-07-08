import { Head, Link } from '@inertiajs/react';
import { motion } from 'motion/react';
import {
    Lock,
    ArrowRight,
    Clock,
    ShieldCheck,
    Sparkles,
    Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
    trialEndedAt?: string;
}

export default function SubscriptionRequired({ trialEndedAt }: Props) {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <>
            <Head title="Abonnement requis" />

            {/* Full-screen backdrop */}
            <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xl" />

            {/* Floating particles effect */}
            <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl"
                        animate={{
                            x: [0, 100, -100, 0],
                            y: [0, 50, -50, 0],
                        }}
                        transition={{
                            duration: 15 + i * 5,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                        style={{
                            left: `${20 + i * 30}%`,
                            top: `${20 + i * 25}%`,
                        }}
                    />
                ))}
            </div>

            {/* Centered modal */}
            <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="w-full max-w-lg"
                >
                    {/* Premium card with advanced glassmorphism */}
                    <motion.div
                        className="relative overflow-hidden rounded-3xl border border-emerald-200/30 bg-linear-to-br from-white/95 to-slate-50/95 shadow-2xl backdrop-blur-2xl dark:border-emerald-900/20 dark:from-slate-900/95 dark:to-slate-800/95"
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        {/* linear accent line at top */}
                        <motion.div
                            className="absolute inset-x-0 top-0 h-1.5 bg-linear-to-r from-emerald-500 via-teal-400 to-emerald-500"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                        />

                        {/* Content */}
                        <motion.div
                            variants={containerVariants}
                            className="px-8 py-12 text-center sm:px-10 sm:py-14"
                        >
                            {/* Icon with animation */}
                            <motion.div
                                variants={itemVariants}
                                className="mb-8 flex justify-center"
                            >
                                <motion.div
                                    className="relative"
                                    animate={{ rotate: [0, -5, 5, 0] }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                    }}
                                >
                                    <div className="absolute inset-0 rounded-full bg-linear-to-br from-emerald-400/20 to-teal-400/20 blur-2xl" />
                                    <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-emerald-500 to-teal-600 shadow-xl shadow-emerald-500/30 dark:shadow-emerald-900/50">
                                        <Lock
                                            className="h-12 w-12 text-white"
                                            strokeWidth={1.5}
                                        />
                                    </div>
                                    <motion.div
                                        className="absolute -right-2 -bottom-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white/20 bg-linear-to-br from-emerald-400 to-teal-500 shadow-lg dark:border-slate-700"
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                        }}
                                    >
                                        <Clock
                                            className="h-4 w-4 text-white"
                                            strokeWidth={2}
                                        />
                                    </motion.div>
                                </motion.div>
                            </motion.div>

                            {/* Title */}
                            <motion.h1
                                variants={itemVariants}
                                className="mb-2 bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-white dark:to-slate-300"
                            >
                                Essai terminé
                            </motion.h1>

                            {/* Subtitle */}
                            <motion.p
                                variants={itemVariants}
                                className="mb-6 text-base font-medium text-slate-600 dark:text-slate-400"
                            >
                                Votre période d'essai gratuit a expiré
                            </motion.p>

                            {/* Description */}
                            <motion.p
                                variants={itemVariants}
                                className="mb-8 leading-relaxed text-slate-500 dark:text-slate-400"
                            >
                                Pour continuer à profiter de toutes les
                                fonctionnalités de votre boutique et rester
                                compétitif, choisissez un plan adapté à votre
                                activité.
                            </motion.p>

                            {/* Trial end date */}
                            {trialEndedAt && (
                                <motion.div
                                    variants={itemVariants}
                                    className="mb-8 rounded-2xl border border-emerald-200/20 bg-linear-to-br from-emerald-50/50 to-teal-50/50 px-5 py-4 text-sm font-medium text-emerald-700 shadow-sm backdrop-blur-sm dark:border-emerald-900/30 dark:from-emerald-950/30 dark:to-teal-950/30 dark:text-emerald-300"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        Expiré depuis le{' '}
                                        <span className="font-bold">
                                            {new Date(
                                                trialEndedAt,
                                            ).toLocaleDateString('fr-FR', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                </motion.div>
                            )}

                            {/* Primary Button */}
                            <motion.div
                                variants={itemVariants}
                                className="mb-4"
                            >
                                <Button
                                    asChild
                                    className="group relative w-full overflow-hidden rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 py-3.5 text-base font-bold text-white shadow-lg transition-all duration-300 hover:from-emerald-700 hover:to-teal-700 hover:shadow-xl dark:from-emerald-500 dark:to-teal-500 dark:hover:from-emerald-600 dark:hover:to-teal-600"
                                >
                                    <Link
                                        href={route('subscription.show')}
                                        className="flex items-center justify-center gap-2"
                                    >
                                        <Sparkles className="h-5 w-5 transition-transform group-hover:scale-110" />
                                        Choisir un plan
                                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </Button>
                            </motion.div>

                            {/* Security badge */}
                            <motion.div
                                variants={itemVariants}
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-200/30 bg-linear-to-r from-emerald-50/50 to-teal-50/50 px-4 py-2 text-xs font-medium text-emerald-700 shadow-sm backdrop-blur-sm dark:border-emerald-900/30 dark:from-emerald-950/30 dark:to-teal-950/30 dark:text-emerald-300"
                            >
                                <ShieldCheck className="h-4 w-4" />
                                Paiement sécurisé & chiffré
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Bottom accent text */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400"
                    >
                        Accès illimité à toutes les fonctionnalités de votre
                        boutique
                    </motion.p>
                </motion.div>
            </div>
        </>
    );
}
