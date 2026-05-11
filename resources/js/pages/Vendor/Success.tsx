/* eslint-disable react-hooks/purity */
// resources/js/Pages/Vendor/Success.tsx
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import {
    Rocket,
    ExternalLink,
    Copy,
    Check,
    ArrowRight,
    LayoutDashboard,
    ShoppingBag,
    Sparkles,
} from 'lucide-react';
import { useEffect, useRef, useState, useMemo } from 'react';
import { CanRole } from '@/core/permissions/Can';

interface Props {
    tenant: { raison_sociale: string; admin_url: string; url: string };
}

// Particules d’arrière‑plan : positions aléatoires stables
function useParticlePositions(count: number) {
    return useMemo(
        () =>
            Array.from({ length: count }).map(() => ({
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
            })),
        [count],
    );
}

export default function VendorSuccess({ tenant }: Props) {
    const [copied, setCopied] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const circleRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const urlBlockRef = useRef<HTMLDivElement>(null);
    const actionsRef = useRef<HTMLDivElement>(null);

    const particles = useParticlePositions(12);

    // Animation d’entrée orchestrée
    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.fromTo(
            circleRef.current,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.8 },
        )
            .fromTo(
                titleRef.current,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6 },
                '-=0.3',
            )
            .fromTo(
                subtitleRef.current,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5 },
                '-=0.2',
            )
            .fromTo(
                ctaRef.current,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5 },
                '-=0.2',
            )
            .fromTo(
                urlBlockRef.current,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5 },
                '-=0.2',
            )
            .fromTo(
                actionsRef.current,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5 },
                '-=0.2',
            );

        // Particules flottantes discrètes
        const particleElements = document.querySelectorAll('.success-particle');
        particleElements.forEach((p, i) => {
            gsap.to(p, {
                y: 'random(-80, 80)',
                x: 'random(-80, 80)',
                opacity: 0.15,
                scale: 0.8,
                duration: 3 + i * 0.3,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: i * 0.2,
            });
        });
    }, []);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(tenant.url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            const ta = document.createElement('textarea');
            ta.value = tenant.url;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <>
            <Head title="Boutique créée avec succès !" />

            <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white dark:bg-slate-950">
                {/* Arrière‑plan décoratif */}
                <div className="pointer-events-none absolute inset-0 -z-10">
                    {/* Cercles flous emerald / slate */}
                    <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-800/10" />
                    <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-slate-300/20 blur-3xl dark:bg-slate-700/10" />
                    <div className="absolute top-1/2 left-1/4 h-48 w-48 rounded-full bg-emerald-400/10 blur-2xl dark:bg-emerald-600/10" />
                </div>

                {/* Particules subtiles */}
                <div className="pointer-events-none absolute inset-0">
                    {particles.map((pos, i) => (
                        <Sparkles
                            key={i}
                            className="success-particle absolute h-4 w-4 text-emerald-400/30 dark:text-emerald-500/20"
                            style={pos}
                        />
                    ))}
                </div>

                <div
                    className="relative z-10 mx-auto max-w-3xl px-4 py-20 text-center"
                    ref={containerRef}
                >
                    {/* Cercle du succès */}
                    <div ref={circleRef} className="mb-10 inline-flex">
                        <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30">
                            <Rocket className="h-14 w-14 text-white" />
                            <Check className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-green-500 p-1 text-white shadow-md" />
                        </div>
                    </div>

                    {/* Titre principal */}
                    <h1
                        ref={titleRef}
                        className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl dark:text-white"
                    >
                        Félicitations&nbsp;!{' '}
                    </h1>

                    {/* Sous‑titre */}
                    <p
                        ref={subtitleRef}
                        className="mb-2 text-xl text-slate-600 dark:text-slate-300"
                    >
                        Votre boutique{' '}
                        <strong className="bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent dark:from-emerald-400 dark:to-emerald-300">
                            {tenant.raison_sociale}
                        </strong>{' '}
                        est prête&nbsp;!
                    </p>
                    <p className="mb-12 text-slate-500 dark:text-slate-400">
                        Vous pouvez maintenant configurer vos produits, gérer
                        vos commandes et commencer à vendre.
                    </p>

                    {/* Bouton principal (CTA) */}
                    <motion.div
                        ref={ctaRef}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="mb-8"
                    >
                        <CanRole roles="super_admin">
                            <a
                                href={tenant.admin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-10 py-4 text-lg font-semibold text-white shadow-lg shadow-emerald-200 transition-all hover:from-emerald-700 hover:to-emerald-800 hover:shadow-xl dark:shadow-emerald-900/30"
                            >
                                <Rocket className="h-6 w-6 transition-transform group-hover:-rotate-12" />
                                Accéder à ma boutique
                                <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
                            </a>
                        </CanRole>
                    </motion.div>

                    {/* Bloc URL avec copie */}
                    <div
                        ref={urlBlockRef}
                        className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white/80 p-5 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80"
                    >
                        <p className="mb-3 text-sm font-medium text-slate-500 dark:text-slate-400">
                            Votre boutique est accessible à l’adresse&nbsp;:
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="flex flex-1 items-center gap-2 rounded-lg bg-slate-100 px-4 py-3 dark:bg-slate-900">
                                <ExternalLink className="h-4 w-4 shrink-0 text-slate-400" />
                                <a
                                    href={tenant.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="truncate text-sm font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                                >
                                    {tenant.url}
                                </a>
                            </div>
                            <button
                                onClick={copyToClipboard}
                                className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 transition hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-700"
                                aria-label="Copier l’URL"
                            >
                                {copied ? (
                                    <Check className="h-5 w-5 text-green-500" />
                                ) : (
                                    <Copy className="h-5 w-5 text-slate-500" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Actions secondaires */}
                    <div
                        ref={actionsRef}
                        className="mt-8 flex flex-wrap items-center justify-center gap-4"
                    >
                        <CanRole roles="super_admin">
                            <Link
                                href={route('vendor.dashboard')}
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:shadow dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                            >
                                <LayoutDashboard className="h-5 w-5" /> Tableau
                                de bord
                            </Link>
                        </CanRole>
                        <span className="text-slate-300 dark:text-slate-600">
                            •
                        </span>
                        <CanRole roles="super_admin">
                            <a
                                href={`${tenant.admin_url}/products/produits`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 transition hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                            >
                                <ShoppingBag className="h-4 w-4" /> Créer mon
                                premier produit →
                            </a>
                        </CanRole>
                    </div>
                </div>
            </div>
        </>
    );
}
