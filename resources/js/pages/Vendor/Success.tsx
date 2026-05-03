// resources/js/Pages/Vendor/Success.tsx
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Sparkles,
    Rocket,
    ExternalLink,
    Copy,
    Check,
    ArrowRight,
    PartyPopper,
    Settings,
} from 'lucide-react';
import { useState } from 'react';

interface VendorSuccessProps {
    tenant: {
        raison_sociale: string;
        admin_url: string;
        url: string;
        domaine?: string;
    };
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut' },
    },
};

const floatingIcons = [
    { Icon: PartyPopper, delay: 0, x: '10%', y: '20%', size: 40, rotate: -15 },
    { Icon: Sparkles, delay: 0.3, x: '85%', y: '15%', size: 32, rotate: 10 },
    { Icon: Rocket, delay: 0.6, x: '15%', y: '75%', size: 36, rotate: -25 },
    { Icon: Sparkles, delay: 0.9, x: '80%', y: '70%', size: 28, rotate: 20 },
    { Icon: PartyPopper, delay: 1.2, x: '50%', y: '85%', size: 44, rotate: -5 },
];

export default function VendorSuccess({ tenant }: VendorSuccessProps) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(tenant.url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback pour les navigateurs qui ne supportent pas l'API Clipboard
            const textArea = document.createElement('textarea');
            textArea.value = tenant.url;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <>
            <Head title="Boutique créée avec succès !" />

            <div className="relative min-h-screen overflow-hidden bg-linear-to-b from-amber-50 via-white to-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
                {/* Icônes flottantes en arrière-plan */}
                {floatingIcons.map(
                    ({ Icon, delay, x, y, size, rotate }, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{
                                opacity: [0, 1, 0.6, 1],
                                scale: [0, 1, 0.9, 1],
                            }}
                            transition={{
                                delay,
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 2,
                            }}
                            className="pointer-events-none absolute"
                            style={{ left: x, top: y }}
                        >
                            <Icon
                                size={size}
                                className="text-amber-300/40 dark:text-amber-600/20"
                                style={{ transform: `rotate(${rotate}deg)` }}
                            />
                        </motion.div>
                    ),
                )}

                <div className="relative z-10 mx-auto max-w-2xl px-4 py-20">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-center"
                    >
                        {/* Cercle de succès animé */}
                        <motion.div
                            variants={itemVariants}
                            className="relative mb-10 inline-flex"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: [0, 1.4, 1] }}
                                transition={{ duration: 0.8, ease: 'easeOut' }}
                                className="absolute inset-0 rounded-full bg-amber-200/50 dark:bg-amber-800/20"
                            />
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: [0, 1.2, 1] }}
                                transition={{
                                    duration: 0.6,
                                    delay: 0.2,
                                    ease: 'easeOut',
                                }}
                                className="relative flex h-28 w-28 items-center justify-center rounded-full bg-linear-to-br from-amber-400 to-amber-600 shadow-2xl shadow-amber-200 dark:from-amber-500 dark:to-amber-700 dark:shadow-amber-900/30"
                            >
                                <Rocket className="h-14 w-14 text-white" />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                                className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white shadow-lg"
                            >
                                <Check className="h-5 w-5" />
                            </motion.div>
                        </motion.div>

                        {/* Titre */}
                        <motion.h1
                            variants={itemVariants}
                            className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl dark:text-white"
                        >
                            Félicitations !{' '}
                            <span className="inline-block animate-bounce">
                                🎉
                            </span>
                        </motion.h1>

                        {/* Sous-titre */}
                        <motion.p
                            variants={itemVariants}
                            className="mb-2 text-xl text-gray-600 dark:text-gray-300"
                        >
                            Votre boutique{' '}
                            <strong className="text-amber-600 dark:text-amber-400">
                                {tenant.raison_sociale}
                            </strong>{' '}
                            est prête !
                        </motion.p>

                        {/* Description */}
                        <motion.p
                            variants={itemVariants}
                            className="mb-12 text-gray-500 dark:text-gray-400"
                        >
                            Vous pouvez maintenant configurer vos produits,
                            personnaliser l'apparence de votre boutique et
                            commencer à vendre.
                        </motion.p>

                        {/* Bouton principal */}
                        <motion.div variants={itemVariants} className="mb-8">
                            <a
                                href={tenant.admin_url}
                                className="group inline-flex items-center gap-3 rounded-2xl bg-linear-to-r from-amber-600 to-amber-700 px-10 py-5 text-xl font-bold text-white shadow-xl shadow-amber-200 transition-all hover:from-amber-700 hover:to-amber-800 hover:shadow-2xl hover:shadow-amber-300 dark:shadow-amber-900/30 dark:hover:shadow-amber-900/50"
                            >
                                <Sparkles className="h-6 w-6 transition-transform group-hover:rotate-12" />
                                Accéder à ma boutique
                                <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
                            </a>
                        </motion.div>

                        {/* URL de la boutique */}
                        <motion.div
                            variants={itemVariants}
                            className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800/50 dark:backdrop-blur-sm"
                        >
                            <p className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                                Votre boutique est accessible à l'adresse :
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="flex flex-1 items-center gap-2 rounded-lg bg-gray-50 px-4 py-3 dark:bg-gray-900">
                                    <ExternalLink className="h-4 w-4 shrink-0 text-gray-400" />
                                    <a
                                        href={tenant.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="truncate text-sm font-medium text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
                                    >
                                        {tenant.url}
                                    </a>
                                </div>
                                <button
                                    onClick={copyToClipboard}
                                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 transition hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                                    aria-label="Copier l'URL"
                                >
                                    {copied ? (
                                        <Check className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <Copy className="h-5 w-5 text-gray-500 dark:text-gray-300" />
                                    )}
                                </button>
                            </div>
                        </motion.div>

                        {/* Actions secondaires */}
                        <motion.div
                            variants={itemVariants}
                            className="mt-8 flex flex-wrap items-center justify-center gap-4"
                        >
                            <Link
                                href={route('vendor.dashboard')}
                                className="inline-flex items-center gap-2 rounded-xl bg-gray-100 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
                            >
                                <Settings className="h-5 w-5" />
                                Accéder à mon tableau de bord
                            </Link>
                            <span className="text-gray-300 dark:text-gray-600">
                                •
                            </span>
                            <a
                                href={tenant.admin_url + '/produits/create'}
                                className="text-sm font-medium text-amber-600 transition hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
                            >
                                Créer mon premier produit →
                            </a>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </>
    );
}
