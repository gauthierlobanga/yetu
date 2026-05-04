/* eslint-disable react-hooks/purity */
// resources/js/Pages/Vendor/Success.tsx
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import {
    Sparkles,
    Rocket,
    ExternalLink,
    Copy,
    Check,
    ArrowRight,
    LayoutDashboard,
    ShoppingBag,
    PartyPopper,
} from 'lucide-react';
import { useEffect, useRef, useState, useMemo } from 'react';

interface Props {
    tenant: { raison_sociale: string; admin_url: string; url: string };
}

// Génère des positions aléatoires UNE SEULE FOIS pour les particules
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

    // Animation d’entrée avec GSAP
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

        // Particules décoratives
        const particleElements = document.querySelectorAll('.success-particle');
        particleElements.forEach((p, i) => {
            gsap.to(p, {
                y: 'random(-120, 120)',
                x: 'random(-120, 120)',
                opacity: 0,
                scale: 0,
                duration: 2 + i * 0.2,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: i * 0.1,
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

            <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white dark:bg-gray-950">
                {/* Particules d’arrière‑plan */}
                <div className="pointer-events-none absolute inset-0">
                    {particles.map((pos, i) => (
                        <PartyPopper
                            key={i}
                            className="success-particle absolute h-6 w-6 text-emerald-300/30 dark:text-emerald-600/20"
                            style={pos}
                        />
                    ))}
                </div>

                <div
                    className="relative z-10 mx-auto max-w-2xl px-4 py-20 text-center"
                    ref={containerRef}
                >
                    {/* Cercle de succès animé */}
                    <div ref={circleRef} className="mb-10 inline-flex">
                        <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-emerald-600">
                            <Rocket className="h-14 w-14 text-white" />
                            <Check className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-green-500 p-1 text-white" />
                        </div>
                    </div>

                    {/* Titre */}
                    <h1
                        ref={titleRef}
                        className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white"
                    >
                        Félicitations&nbsp;!{' '}
                        <span className="inline-block animate-bounce">🎉</span>
                    </h1>

                    {/* Sous‑titre */}
                    <p
                        ref={subtitleRef}
                        className="mb-2 text-xl text-gray-600 dark:text-gray-300"
                    >
                        Votre boutique{' '}
                        <strong className="text-emerald-600 dark:text-emerald-400">
                            {tenant.raison_sociale}
                        </strong>{' '}
                        est prête&nbsp;!
                    </p>
                    <p className="mb-12 text-gray-500 dark:text-gray-400">
                        Vous pouvez maintenant configurer vos produits, gérer
                        vos commandes et commencer à vendre.
                    </p>

                    {/* Bouton principal */}
                    <motion.div
                        ref={ctaRef}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="mb-8"
                    >
                        <a
                            href={tenant.admin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-3 rounded-2xl bg-linear-to-r from-emerald-600 to-emerald-700 px-10 py-5 text-xl font-bold text-white transition hover:from-emerald-700 hover:to-emerald-800"
                        >
                            <Sparkles className="h-6 w-6 transition-transform group-hover:rotate-12" />
                            Accéder à ma boutique
                            <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
                        </a>
                    </motion.div>

                    {/* Bloc URL */}
                    <div
                        ref={urlBlockRef}
                        className="mx-auto max-w-md rounded-2xl border bg-card p-5"
                    >
                        <p className="mb-3 text-sm font-medium text-muted-foreground">
                            Votre boutique est accessible à l’adresse&nbsp;:
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="flex flex-1 items-center gap-2 rounded-lg bg-muted px-4 py-3">
                                <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
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
                                className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted transition hover:bg-muted/80"
                                aria-label="Copier l’URL"
                            >
                                {copied ? (
                                    <Check className="h-5 w-5 text-green-500" />
                                ) : (
                                    <Copy className="h-5 w-5 text-muted-foreground" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Actions secondaires */}
                    <div
                        ref={actionsRef}
                        className="mt-8 flex flex-wrap items-center justify-center gap-4"
                    >
                        <Link
                            href={route('vendor.dashboard')}
                            className="inline-flex items-center gap-2 rounded-xl bg-muted px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted/80"
                        >
                            <LayoutDashboard className="h-5 w-5" /> Tableau de
                            bord
                        </Link>
                        <span className="text-muted-foreground">•</span>
                        <a
                            href={`${tenant.admin_url}/produits/create`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 transition hover:text-emerald-700 dark:text-emerald-400"
                        >
                            <ShoppingBag className="h-4 w-4" /> Créer mon
                            premier produit →
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
