/* eslint-disable react-hooks/purity */
// resources/js/Pages/Vendor/Success.tsx

import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Rocket,
    ExternalLink,
    Copy,
    Check,
    ArrowRight,
    LayoutDashboard,
    ShoppingBag,
    Sparkles,
    ShieldCheck,
    Globe,
    PartyPopper,
    Home,
    Loader2,
} from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { Tenant } from '@/types/tenants/products/vendor/tenant';

interface Props {
    tenant: {
        id: string;
        raison_sociale: string;
        slug: string;
        url: string;
        admin_url: string;
        logo_url: string | null;
        dashboard_url?: string;
    };
    isCreating?: boolean;
}

function useParticlePositions(count: number) {
    return useMemo(
        () =>
            Array.from({ length: count }).map(() => ({
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                duration: 6 + Math.random() * 8,
                delay: Math.random() * 4,
            })),
        [count],
    );
}

export default function VendorSuccess({ tenant, isCreating = false }: Props) {
    const [copied, setCopied] = useState(false);
    const particles = useParticlePositions(14);
    const [creationStatus, setCreationStatus] = useState(isCreating);

    // Polling pour vérifier quand le tenant est créé
    useEffect(() => {
        if (!creationStatus) return;

        const pollInterval = setInterval(async () => {
            try {
                const response = await fetch(`/api/vendor-request/${tenant.id}/status`);
                const data = await response.json();

                if (data.status === 'approved') {
                    setCreationStatus(false);
                    // Rediriger vers le dashboard après 1.5 secondes
                    setTimeout(() => {
                        window.location.href = tenant.admin_url;
                    }, 1500);
                }
            } catch (error) {
                console.error('Polling error:', error);
            }
        }, 3000); // Vérifier toutes les 3 secondes

        return () => clearInterval(pollInterval);
    }, [creationStatus, tenant.id, tenant.admin_url]);

    // Si la création est en cours, afficher l'écran de progression premium
    if (creationStatus) {
        return (
            <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black dark:bg-black p-4">
                {/* Animated background with glassmorphism */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* Gradient blobs */}
                    <motion.div
                        className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl"
                        animate={{
                            y: [0, 50, 0],
                            x: [0, 30, 0],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                    <motion.div
                        className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-teal-500/20 blur-3xl"
                        animate={{
                            y: [0, -50, 0],
                            x: [0, -30, 0],
                        }}
                        transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: 1,
                        }}
                    />
                </div>

                <Head title="Création en cours..." />

                {/* Premium Content Card */}
                <motion.div
                    className="relative z-10 w-full max-w-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <div className="backdrop-blur-2xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
                        {/* Animated geometric shapes */}
                        <div className="mb-12 h-32 flex items-center justify-center relative">
                            {/* Rotating shapes */}
                            <motion.div
                                className="absolute h-24 w-24 rounded-3xl border-2 border-emerald-500/30"
                                animate={{
                                    rotate: 360,
                                    scale: [1, 1.1, 1],
                                }}
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
                                    },
                                }}
                            />
                            <motion.div
                                className="absolute h-16 w-16 rounded-2xl border-2 border-teal-500/40"
                                animate={{
                                    rotate: -360,
                                    scale: [1, 0.9, 1],
                                }}
                                transition={{
                                    rotate: {
                                        duration: 6,
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
                            {/* Center orb */}
                            <motion.div
                                className="h-8 w-8 rounded-full bg-linear-to-br from-emerald-400 to-teal-500 shadow-2xl shadow-emerald-500/50"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    boxShadow: [
                                        '0 0 20px rgba(16, 185, 129, 0.5)',
                                        '0 0 40px rgba(16, 185, 129, 0.8)',
                                        '0 0 20px rgba(16, 185, 129, 0.5)',
                                    ],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                }}
                            />
                        </div>

                        {/* Text content */}
                        <div className="space-y-4 text-center">
                            <motion.h2
                                className="text-3xl font-light tracking-tight text-white"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                Création en cours
                            </motion.h2>
                            <motion.p
                                className="text-sm text-white/60 font-light"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                Nous préparons votre environnement
                            </motion.p>
                        </div>

                        {/* Premium progress indicator */}
                        <div className="mt-12 space-y-6">
                            {/* Animated progress line */}
                            <div className="relative h-1 overflow-hidden rounded-full bg-white/10">
                                <motion.div
                                    className="absolute h-full bg-linear-to-r from-emerald-500 via-teal-500 to-emerald-500"
                                    animate={{
                                        width: ['0%', '100%'],
                                        opacity: [0.5, 1, 0.5],
                                    }}
                                    transition={{
                                        duration: 2.5,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                    }}
                                />
                            </div>

                            {/* Status indicator dots */}
                            <div className="flex justify-center gap-2">
                                {[0, 1, 2, 3].map((i) => (
                                    <motion.div
                                        key={i}
                                        className="h-1.5 rounded-full bg-white/20"
                                        animate={{
                                            backgroundColor: ['rgba(255,255,255,0.2)', 'rgba(16,185,129,0.8)', 'rgba(255,255,255,0.2)'],
                                            scale: [1, 1.3, 1],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            delay: i * 0.3,
                                        }}
                                        style={{
                                            width: i === 1 ? '20px' : '8px',
                                            transition: 'width 0.3s ease',
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Footer info */}
                        <motion.div
                            className="mt-8 rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <p className="text-xs text-white/50 text-center font-light leading-relaxed">
                                Configuration sécurisée en cours. Ne fermez pas cette page.
                            </p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        );
    }

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(tenant.url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2200);
        } catch {
            // fallback
            const textarea = document.createElement('textarea');
            textarea.value = tenant.url;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);

            setCopied(true);
            setTimeout(() => setCopied(false), 2200);
        }
    };

    const summary = [
        {
            label: 'Boutique',
            value: tenant.raison_sociale,
            icon: ShoppingBag,
        },
        {
            label: 'Statut',
            value: 'Active et accessible',
            icon: ShieldCheck,
        },
        {
            label: 'URL publique',
            value: new URL(tenant.url).hostname,
            icon: Globe,
        },
    ];

    return (
        <>
            <Head title="Boutique créée avec succès" />

            <div className="relative min-h-screen overflow-hidden bg-black dark:bg-black">
                {/* Premium animated background */}
                <div className="absolute inset-0 overflow-hidden">
                    {/* Gradient orbs */}
                    <motion.div
                        className="absolute top-1/4 left-1/3 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl"
                        animate={{
                            y: [0, 100, 0],
                            x: [0, 50, 0],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                    <motion.div
                        className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl"
                        animate={{
                            y: [0, -100, 0],
                            x: [0, -50, 0],
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: 1,
                        }}
                    />
                </div>

                {/* Content */}
                <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="w-full max-w-3xl"
                    >
                        {/* Success card */}
                        <div className="backdrop-blur-2xl rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-12 shadow-2xl">
                            {/* Header */}
                            <div className="mb-12 text-center">
                                {/* Success icon - animated */}
                                <motion.div
                                    className="mx-auto mb-6 flex h-20 w-20 items-center justify-center"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 200,
                                        damping: 12,
                                    }}
                                >
                                    <div className="relative flex h-full w-full items-center justify-center">
                                        <motion.div
                                            className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl"
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: 'easeInOut',
                                            }}
                                        />
                                        <div className="relative rounded-full bg-linear-to-br from-emerald-500 to-teal-600 p-4">
                                            <Check className="h-10 w-10 text-white" />
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Title */}
                                <motion.h1
                                    className="text-4xl font-light tracking-tight text-white"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    Boutique créée
                                </motion.h1>

                                {/* Subtitle */}
                                <motion.p
                                    className="mt-4 text-lg text-white/60 font-light"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <span className="text-white font-medium">
                                        {tenant.raison_sociale}
                                    </span>{' '}
                                    est prête
                                </motion.p>
                            </div>

                            {/* Grid with info */}
                            <div className="grid gap-6 md:grid-cols-2 mb-12">
                                {/* Shop name */}
                                <motion.div
                                    className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <ShoppingBag className="h-5 w-5 text-emerald-400" />
                                        <p className="text-xs uppercase tracking-wider text-white/50">
                                            Boutique
                                        </p>
                                    </div>
                                    <p className="text-lg font-medium text-white">
                                        {tenant.raison_sociale}
                                    </p>
                                </motion.div>

                                {/* URL */}
                                <motion.div
                                    className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <Globe className="h-5 w-5 text-teal-400" />
                                        <p className="text-xs uppercase tracking-wider text-white/50">
                                            Adresse
                                        </p>
                                    </div>
                                    <p className="text-sm font-mono text-white break-all">
                                        {new URL(tenant.url).hostname}
                                    </p>
                                </motion.div>
                                </div>

                            {/* CTA Buttons */}
                            <div className="space-y-3">
                                {/* Primary button */}
                                <motion.a
                                    href={tenant.admin_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-emerald-600 to-teal-600 px-6 py-4 text-white font-medium transition-all hover:from-emerald-700 hover:to-teal-700 active:scale-95"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                    whileHover={{ y: -2 }}
                                >
                                    <Rocket className="h-5 w-5 group-hover:-rotate-12 transition-transform" />
                                    Accéder au panneau
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </motion.a>

                                {/* Secondary button */}
                                <motion.a
                                    href={tenant.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-4 text-white font-medium transition-all hover:bg-white/10 active:scale-95"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.7 }}
                                    whileHover={{ y: -2 }}
                                >
                                    <ExternalLink className="h-5 w-5" />
                                    Visiter la boutique
                                </motion.a>
                            </div>

                            {/* Footer text */}
                            <motion.p
                                className="mt-8 text-center text-sm text-white/40"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                            >
                                Tout est sécurisé et prêt. Commencez à ajouter vos produits.
                            </motion.p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
}
