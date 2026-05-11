/* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/Pages/SaaSLanding/Home.tsx
import { Head, Link } from '@inertiajs/react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    ArrowRight,
    Globe,
    Zap,
    DollarSign,
    TrendingUp,
    Shield,
    Store,
    CheckCircle,
} from 'lucide-react';
import type { RefObject } from 'react';
import {
    JSXElementConstructor,
    Key,
    ReactElement,
    ReactNode,
    ReactPortal,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import CobeModern from '@/components/eldoraui/cobe-globe';
import CobePremiumGSAP from '@/components/eldoraui/cobe-globe';
import { IntegrationProduct } from '@/components/eldoraui/IntegrationProduit';
import { Integrations } from '@/components/eldoraui/integrations';
import { PhotonBeam } from '@/components/eldoraui/photon-beam';
import AnimatedCtaButton from '@/components/hero/AnimatedCtaButton';
import ParallaxCardPage from '@/components/parallax-cards/parallax-cards-example';
import { Button } from '@/components/ui/button';
import MainLayout from '@/layouts/main-layout';

gsap.registerPlugin(ScrollTrigger);

interface Plan {
    id: number;
    name: string;
    description: string;
    price: number;
    currency: string;
    interval: string;
    trial_days: number;
    is_featured: boolean;
    is_recommended: boolean;
    features: string[];
    badge: string | null;
    button_text: string | null;
}

interface Testimonial {
    name: string;
    store: string;
    quote: string;
    avatar: string;
}

interface Props {
    plans?: Plan[];
    stats?: {
        stores_created: number;
        products_listed: number;
        countries_served: number;
    };
    testimonials?: Testimonial[];
}

interface HeroImage {
    src: string;
    alt: string;
    title?: string;
    subtitle?: string;
}

const images: HeroImage[] = [
    {
        src: '/storage/images/a-minimal-yet-cosy-workspace.jpg',
        alt: 'Espace de travail cosy',
    },
    {
        src: '/storage/images/female-yoga-fashion-with-yoga-mat.jpg',
        alt: 'Mode yoga femme',
    },
    { src: '/storage/images/working-at-night.jpg', alt: 'Travail nocturne' },
    { src: '/storage/images/wireless-headphones.jpg', alt: 'Casque sans fil' },
    {
        src: '/storage/images/simple-beige-mens-shirt.jpg',
        alt: 'Chemise beige homme',
    },
    {
        src: '/storage/images/mobile-phone-and-gimbal-in-hand.jpg',
        alt: 'Téléphone et stabilisateur',
    },
    {
        src: '/storage/images/confident-young-woman.jpg',
        alt: 'Jeune femme confiante',
    },
    { src: '/storage/images/green-t-shirt.jpg', alt: 'T‑shirt vert' },
    {
        src: '/storage/images/pretty-gold-necklace.jpg',
        alt: 'Collier en or joli',
        title: 'Shopping',
        subtitle: 'Livraison rapide',
    },
    { src: '/storage/images/getting-business.jpg', alt: 'Getting business' },
    { src: '/storage/images/gold-zipper.jpg', alt: 'Zipper en or' },
    {
        src: '/storage/images/mens-fashion-watch.jpg',
        alt: 'Montre de mode masculine',
    },
];

/**
 * Grille d'images pour la section héro
 * @returns
 */
export function HeroImageGrid() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;

        if (!container) {
            return;
        }

        const cards = container.querySelectorAll('.hero-card');

        const ctx = gsap.context(() => {
            gsap.fromTo(
                cards,
                { opacity: 0, y: 40, scale: 0.95 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.7,
                    stagger: 0.08,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: container,
                        start: 'top bottom-=100',
                        toggleActions: 'play none none none',
                    },
                },
            );
        }, container);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6"
        >
            {images.map((img, index) => (
                <div
                    key={index}
                    className="hero-card group relative overflow-hidden rounded-2xl border border-border/50 bg-card transition-shadow hover:border-emerald-200 dark:hover:border-emerald-800"
                >
                    <div className="aspect-4/5 overflow-hidden">
                        <img
                            src={img.src}
                            alt={img.alt}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading="lazy"
                        />
                    </div>
                    {img.title && (
                        <div className="absolute right-0 bottom-0 left-0 bg-linear-to-t from-black/60 to-transparent p-4 pt-8">
                            <p className="text-sm font-medium text-white">
                                {img.title}
                            </p>
                            {img.subtitle && (
                                <p className="mt-1 text-xs text-white/70">
                                    {img.subtitle}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

/**
 * Section de CTA finale avec animation d’apparition au scroll
 */
const cards = [
    {
        title: 'Lancez-vous rapidement',
        desc: 'Jacki Prince a lancé **Guests on Earth** depuis chez elle. C’est aujourd’hui une entreprise de plus de 4 M$.',
        icon: Zap,
    },
    {
        title: 'Voyez aussi grand que vous le souhaitez',
        desc: 'D’une boutique ne proposant qu’un seul produit, **Our Place** est devenue un empire des ustensiles de cuisine.',
        icon: TrendingUp,
    },
    {
        title: 'Passez au niveau supérieur',
        desc: 'Le fabricant de jouets emblématique vend désormais directement aux consommateurs. Le tout propulsé par Yetu.',
        icon: Store,
    },
];

/**
 * Section de CTA finale avec animation d’apparition au scroll
 * @returns
 */

export function PourTousSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animation du titre
            gsap.from(titleRef.current, {
                scrollTrigger: {
                    trigger: titleRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                },
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out',
            });

            // Animation des cartes en stagger
            gsap.from(cardsRef.current, {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 65%',
                    toggleActions: 'play none none none',
                },
                y: 60,
                opacity: 0,
                scale: 0.92,
                duration: 0.7,
                stagger: 0.15,
                ease: 'back.out(1.2)',
                clearProps: 'transform',
            });
        }, sectionRef);

        return () => ctx.revert(); // Nettoie les ScrollTriggers
    }, []);

    // Effet de survol 3D
    const handleMouseMove = (
        e: React.MouseEvent<HTMLDivElement>,
        index: number,
    ) => {
        const card = cardsRef.current[index];

        if (!card) {
            return;
        }

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;
        gsap.to(card, {
            rotateX,
            rotateY,
            transformPerspective: 800,
            duration: 0.4,
            ease: 'power2.out',
        });
    };

    const handleMouseLeave = (index: number) => {
        const card = cardsRef.current[index];

        if (!card) {
            return;
        }

        gsap.to(card, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.6,
            ease: 'elastic.out(0.8)',
        });
    };

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden bg-linear-to-b from-emerald-50/60 to-slate-100/60 py-24 dark:from-slate-900 dark:to-emerald-950/60"
        >
            {/* Formes décoratives floues */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -top-32 left-1/4 h-72 w-72 rounded-full bg-emerald-200/20 blur-3xl dark:bg-emerald-700/10" />
                <div className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-slate-300/20 blur-3xl dark:bg-slate-600/10" />
            </div>

            <div className="mx-auto max-w-7xl px-6 text-center">
                <h2
                    ref={titleRef}
                    className="font-serif text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl lg:text-5xl dark:text-white"
                >
                    Pour tous, des entrepreneurs
                    <br />
                    aux grandes entreprises
                </h2>

                <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {cards.map((card, idx) => {
                        const Icon = card.icon;

                        return (
                            <div
                                key={idx}
                                ref={(el) => {
                                    cardsRef.current[idx] = el;
                                }}
                                onMouseMove={(e) => handleMouseMove(e, idx)}
                                onMouseLeave={() => handleMouseLeave(idx)}
                                className="group relative cursor-default rounded-2xl border border-white/40 bg-white/30 p-8 shadow-sm backdrop-blur-lg transition-shadow duration-300 hover:shadow-xl dark:border-slate-700/40 dark:bg-slate-800/30"
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                <div className="mb-5 inline-flex rounded-xl bg-emerald-100/80 p-3 text-emerald-700 shadow-inner dark:bg-emerald-900/50 dark:text-emerald-300">
                                    <Icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-semibold text-slate-800 dark:text-white">
                                    {card.title}
                                </h3>
                                <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
                                    {card.desc.split('**').map((part, i) =>
                                        i % 2 === 1 ? (
                                            <strong
                                                key={i}
                                                className="font-semibold text-emerald-700 dark:text-emerald-400"
                                            >
                                                {part}
                                            </strong>
                                        ) : (
                                            part
                                        ),
                                    )}
                                </p>
                                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-br from-emerald-500/0 to-slate-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-10 dark:from-emerald-400/0 dark:to-slate-400/0 dark:group-hover:opacity-15" />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

/**
 * Section de CTA finale avec animation d’apparition au scroll
 */
const steps = [
    { step: '01', title: 'Ajoutez votre premier produit' },
    { step: '02', title: 'Personnalisez votre boutique' },
    { step: '03', title: 'Configurez les paiements' },
];

/**
 * Section de CTA finale avec animation d’apparition au scroll
 * @returns
 */
export function CreerRapidementSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const stepsRef = useRef<(HTMLDivElement | null)[]>([]);
    const buttonRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Titre
            gsap.from(titleRef.current, {
                scrollTrigger: {
                    trigger: titleRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                },
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out',
            });

            // Étapes en cascade
            gsap.from(stepsRef.current, {
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 65%',
                    toggleActions: 'play none none none',
                },
                y: 60,
                opacity: 0,
                scale: 0.9,
                duration: 0.6,
                stagger: 0.15,
                ease: 'back.out(1.2)',
                clearProps: 'transform',
            });

            // Bouton CTA
            gsap.from(buttonRef.current, {
                scrollTrigger: {
                    trigger: buttonRef.current,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                },
                y: 30,
                opacity: 0,
                scale: 0.95,
                duration: 0.6,
                ease: 'power2.out',
                delay: 0.3,
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden bg-linear-to-b from-primary/10 via-background to-primary/5 py-24"
        >
            {/* Décors d'arrière-plan */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -top-40 right-1/3 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute bottom-10 left-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
            </div>

            <div className="mx-auto max-w-7xl px-6 text-center">
                <h2
                    ref={titleRef}
                    className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
                >
                    Créez rapidement sur Yetu
                </h2>

                <div className="mt-16 grid gap-8 sm:grid-cols-3">
                    {steps.map((item, idx) => (
                        <div
                            key={idx}
                            ref={(el) => {
                                stepsRef.current[idx] = el;
                            }}
                            className="group relative rounded-2xl border border-border bg-card/50 p-8 backdrop-blur-lg transition-all duration-300"
                        >
                            <span className="text-5xl font-extrabold tracking-tight text-primary drop-shadow-sm">
                                {item.step}
                            </span>
                            <h3 className="mt-4 text-xl font-semibold text-foreground">
                                {item.title}
                            </h3>
                            <div className="pointer-events-none absolute inset-0 rounded-xl bg-linear-to-br from-primary/0 to-primary/0 opacity-0 transition-opacity duration-500 group-hover:opacity-10" />
                        </div>
                    ))}
                </div>

                <div ref={buttonRef} className="mt-14">
                    <Button
                        size="lg"
                        asChild
                        className="group rounded-full bg-primary px-10 py-6 text-lg font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-primary/30"
                    >
                        <Link href={route('vendor.register')}>
                            Essayez maintenant
                            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}

/**
 * Section de CTA finale avec animation d’apparition au scroll
 * @returns
 */

export function CtaFinalSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);
    const buttonRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 70%',
                    toggleActions: 'play none none none',
                },
            });

            tl.from(cardRef.current, {
                y: 60,
                opacity: 0,
                scale: 0.95,
                duration: 0.7,
                ease: 'power3.out',
            })
                .from(
                    titleRef.current,
                    { y: 30, opacity: 0, duration: 0.5, ease: 'power2.out' },
                    '-=0.3',
                )
                .from(
                    textRef.current,
                    { y: 20, opacity: 0, duration: 0.5, ease: 'power2.out' },
                    '-=0.2',
                )
                .from(
                    buttonRef.current,
                    {
                        y: 20,
                        opacity: 0,
                        scale: 0.9,
                        duration: 0.5,
                        ease: 'back.out(1.4)',
                    },
                    '-=0.1',
                );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden bg-linear-to-b from-emerald-50/60 via-slate-100/60 to-emerald-100/40 py-24 dark:from-slate-900 dark:via-emerald-950/60 dark:to-slate-900"
        >
            {/* Motif de quadrillage discret */}
            <div
                className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.05]"
                style={{
                    backgroundImage:
                        'radial-linear(circle, #0f766e 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                }}
            />

            {/* Formes décoratives floues */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -top-32 left-1/4 h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-700/10" />
                <div className="absolute right-1/4 -bottom-20 h-96 w-96 rounded-full bg-slate-400/10 blur-3xl dark:bg-slate-600/10" />
            </div>

            {/* Vague décorative en bas */}
            <div className="pointer-events-none absolute right-0 bottom-0 left-0 -z-10 text-emerald-100/60 dark:text-emerald-900/40">
                <svg
                    viewBox="0 0 1440 120"
                    fill="currentColor"
                    preserveAspectRatio="none"
                    className="h-16 w-full sm:h-24"
                >
                    <path d="M0,64L120,53.3C240,43,480,21,720,32C960,43,1200,85,1320,96L1440,107L1440,120L1320,120C1200,120,960,120,720,120C480,120,240,120,120,120L0,120Z" />
                </svg>
            </div>

            <div className="mx-auto max-w-3xl px-6 text-center">
                {/* Carte en verre dépoli */}
                <div
                    ref={cardRef}
                    className="relative rounded-3xl border border-white/40 bg-white/40 p-10 shadow-xl shadow-emerald-900/5 backdrop-blur-xl sm:p-14 dark:border-slate-700/30 dark:bg-slate-800/20 dark:shadow-emerald-900/10"
                >
                    {/* Ornement subtil */}
                    <div className="mb-4 flex justify-center">
                        <span className="inline-block h-1 w-12 rounded-full bg-emerald-500/70 dark:bg-emerald-400/70" />
                    </div>

                    {/* Titre - police identique au Hero (sans-serif, semibold, tracking tight) */}
                    <h2
                        ref={titleRef}
                        className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl lg:text-5xl"
                    >
                        Prêt à vous lancer ?
                    </h2>

                    {/* Texte - même style que le paragraphe du Hero */}
                    <p
                        ref={textRef}
                        className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground"
                    >
                        Créez votre boutique gratuitement et commencez à vendre.
                    </p>

                    {/* Bouton */}
                    <div ref={buttonRef} className="mt-10">
                        <Button
                            size="lg"
                            asChild
                            className="group relative overflow-hidden rounded-full bg-emerald-600 px-10 py-6 text-lg font-semibold text-white shadow shadow-emerald-500/20 transition-all hover:bg-emerald-700 hover:shadow-emerald-500/30 dark:bg-emerald-700 dark:hover:bg-emerald-600"
                        >
                            <Link href={route('vendor.register')}>
                                <span className="relative z-10 inline-flex items-center">
                                    Démarrer gratuitement
                                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                                </span>
                                {/* Brillance au survol */}
                                <span className="absolute inset-0 z-0 rounded-full bg-linear-to-r from-transparent via-emerald-300/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:via-emerald-400/20" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}

/**
 * Composant de section avec animation d’apparition au scroll
 * @param param0
 * @returns
 */
function FadeInSection({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 32 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export default function SaaSLanding({ plans, stats, testimonials }: Props) {
    return (
        <MainLayout>
            <Head title="Yetu: Créez votre boutique en ligne" />
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-linear-to-br from-primary/30 via-background to-primary/20 text-foreground">
                <div className="absolute inset-0 bg-[radial-linear(ellipse_at_top_right,var(--color-primary)/.15,transparent_50%)]" />
                <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 text-center lg:flex lg:items-center lg:py-24 lg:text-left">
                    {/* <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 text-center lg:flex lg:items-center lg:py-32 lg:text-left"> */}
                    <FadeInSection className="lg:w-1/2">
                        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                            Devenez l’entrepreneur
                            <br />
                            <span className="bg-linear-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent dark:from-emerald-400 dark:to-emerald-600">
                                que vous rêvez d’être
                            </span>
                        </h1>
                        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                            Rêvez en grand et créez rapidement sur Yetu. La
                            meilleure plateforme de commerce en RDC.
                        </p>
                        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                            <AnimatedCtaButton href={route('vendor.register')}>
                                Démarrer gratuitement
                            </AnimatedCtaButton>

                            <Button
                                size="lg"
                                variant="outline"
                                asChild
                                className="rounded-full border-emerald-200 px-8 py-6 text-lg font-medium text-emerald-700 transition-all hover:border-emerald-400 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:border-emerald-600 dark:hover:bg-emerald-950/50"
                            >
                                <a href="#pourquoi">
                                    Pourquoi nous avons créé Yetu
                                </a>
                            </Button>
                        </div>
                    </FadeInSection>

                    {/* Colonne de droite : illustration avec orbite */}
                    <div className="mt-12 flex justify-center lg:mt-0 lg:w-1/2">
                        <HeroImageGrid />
                    </div>
                </div>
            </section>

            {/* ========== VENDEZ PARTOUT ========== */}
            <section className="bg-linear-to-b from-muted to-background py-20">
                <div className="mx-auto max-w-7xl px-6">
                    <FadeInSection className="grid items-center gap-12 lg:grid-cols-2">
                        <div>
                            <h2 className="font-serif text-5xl font-semibold tracking-tight text-foreground sm:text-5xl">
                                Vendez partout où vos clients
                                <br />
                                font leurs achats.
                            </h2>
                            <p className="mt-6 text-lg text-muted-foreground">
                                En ligne et en personne. Grâce à l’IA et sur les
                                réseaux sociaux. Localement et à
                                l’international.
                            </p>
                            <ul className="mt-8 space-y-4">
                                {[
                                    'Boutique en ligne',
                                    'Points de vente physiques',
                                    'Réseaux sociaux',
                                    'Marketplaces',
                                ].map((item) => (
                                    <li
                                        key={item}
                                        className="flex items-center gap-3 text-foreground"
                                    >
                                        <CheckCircle className="h-5 w-5 text-primary" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 rounded-xl bg-card p-4">
                                <p className="text-sm font-medium text-muted-foreground">
                                    MVA 2 Collection
                                </p>
                                <div className="mt-2 grid grid-cols-4 gap-2">
                                    {[
                                        'Hoodies',
                                        'Sports Bras',
                                        'Leggings',
                                        'Shirts',
                                    ].map((cat) => (
                                        <span
                                            key={cat}
                                            className="rounded-lg bg-muted px-3 py-1 text-xs text-foreground"
                                        >
                                            {cat}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="rounded-xl bg-card p-4">
                                <p className="text-sm font-semibold text-foreground">
                                    brooklinen
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Meet Brooklinen for Business
                                </p>
                            </div>
                            <div className="rounded-xl bg-card p-4">
                                <p className="text-sm font-semibold text-foreground">
                                    Brooklinen for business
                                </p>
                            </div>
                        </div>
                    </FadeInSection>
                </div>
            </section>

            {/* ========== POUR TOUS ========== */}
            <section className="bg-background py-20">
                <PourTousSection />
            </section>

            {/* ========== FIABILITÉ & PAIEMENT ========== */}
            <section className="bg-linear-to-br from-muted via-background to-primary/5 py-20">
                <div className="mx-auto max-w-7xl px-6">
                    <FadeInSection className="grid items-center gap-12 lg:grid-cols-2">
                        <div>
                            <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
                                Très rapide et vraiment fiable
                            </h2>
                            <p className="mt-6 text-lg text-muted-foreground">
                                Le processus de paiement offrant le meilleur
                                taux de conversion au monde
                            </p>
                            <div className="mt-10 space-y-8">
                                <div className="flex items-start gap-4">
                                    <TrendingUp className="mt-1 h-6 w-6 text-primary" />
                                    <div>
                                        <p className="text-2xl font-bold text-foreground">
                                            +15 %
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            TAUX DE CONVERSION PLUS ÉLEVÉ
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Globe className="mt-1 h-6 w-6 text-primary" />
                                    <div>
                                        <p className="text-2xl font-bold text-foreground">
                                            250 M+
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            ACHETEURS À FORTE INTENTION
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <p className="mt-8 text-sm text-muted-foreground">
                                Le checkout de Yetu convertit en moyenne 15 % de
                                plus que les autres plateformes et présente
                                votre marque à 250 millions d’acheteurs prêts.
                            </p>
                        </div>
                        {/* Simulation de checkout */}
                        <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-lg backdrop-blur">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Contact
                                    </label>
                                    <input
                                        disabled
                                        value="jordan.chen@domain.com"
                                        className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Code promo
                                        </label>
                                        <input
                                            disabled
                                            value="$125.00"
                                            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                            Livraison
                                        </label>
                                        <input
                                            disabled
                                            value="Free"
                                            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">
                                        Taxes estimées
                                    </label>
                                    <input
                                        disabled
                                        value="$10.00"
                                        className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                                    />
                                </div>
                                <div className="border-t border-border pt-4">
                                    <p className="text-sm font-semibold text-foreground">
                                        Livraison
                                    </p>
                                    <div className="mt-2 space-y-2">
                                        <input
                                            disabled
                                            value="United States"
                                            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                                        />
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                disabled
                                                placeholder="Prénom"
                                                value="Jordan"
                                                className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                                            />
                                            <input
                                                disabled
                                                placeholder="Nom"
                                                value="Chen"
                                                className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                                            />
                                        </div>
                                        <input
                                            disabled
                                            value="131 Greene St"
                                            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                                        />
                                        <div className="grid grid-cols-3 gap-2">
                                            <input
                                                disabled
                                                value="New York"
                                                className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                                            />
                                            <input
                                                disabled
                                                value="New York"
                                                className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                                            />
                                            <input
                                                disabled
                                                value="10012"
                                                className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeInSection>
                </div>
            </section>

            {/* ========== STABILITÉ & PERFORMANCE ========== */}
            <section className="bg-background py-20">
                <div className="mx-auto max-w-7xl px-6 text-center">
                    <FadeInSection>
                        <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
                            Une stabilité à
                            <br />
                            toute épreuve. Une
                            <br />
                            rapidité fulgurante.
                        </h2>
                        <div className="mt-12 flex flex-col items-center gap-8 sm:flex-row sm:justify-center">
                            <div className="flex items-center gap-4">
                                <Globe className="h-8 w-8 text-primary" />
                                <div className="text-left">
                                    <p className="text-3xl font-bold text-foreground">
                                        175
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        PAYS DANS LESQUELS DES
                                        <br />
                                        MARCHANDS VENDENT SUR YETU
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Shield className="h-8 w-8 text-primary" />
                                <div className="text-left">
                                    <p className="text-3xl font-bold text-foreground">
                                        99.99%
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        DISPONIBILITÉ GARANTIE
                                    </p>
                                </div>
                            </div>
                        </div>
                        <p className="mx-auto mt-10 max-w-2xl text-muted-foreground">
                            Votre boutique reste performante, même lors de vos
                            ventes exceptionnelles les plus intenses.
                        </p>
                    </FadeInSection>
                </div>
            </section>

            {/* ========== YETU CAPITAL ========== */}
            <section className="bg-linear-to-tl from-muted to-background py-20">
                <div className="mx-auto max-w-7xl px-6">
                    <FadeInSection className="grid items-center gap-12 lg:grid-cols-2">
                        <div>
                            <h2 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
                                Yetu s’occupe de vous
                            </h2>
                            <p className="mt-4 text-lg text-muted-foreground">
                                Si votre entreprise a besoin d’un coup de pouce,{' '}
                                <strong>Yetu Capital</strong> est là pour vous
                                accompagner.
                            </p>
                            <div className="mt-10 space-y-6">
                                <div className="flex items-start gap-4">
                                    <DollarSign className="mt-1 h-6 w-6 text-primary" />
                                    <div>
                                        <p className="text-2xl font-bold text-foreground">
                                            5 milliards de $ US
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            prêtés à ce jour, investis auprès de
                                            marchands Yetu
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <DollarSign className="mt-1 h-6 w-6 text-primary" />
                                    <div>
                                        <p className="text-2xl font-bold text-foreground">
                                            Jusqu’à 5 M$ US
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Des montants adaptés pour répondre à
                                            vos besoins
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Shield className="mt-1 h-6 w-6 text-primary" />
                                    <div>
                                        <p className="text-2xl font-bold text-foreground">
                                            0 %
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            de fonds propres – aucune prise de
                                            participation, jamais
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-2xl border border-border bg-card p-8">
                            <p className="text-lg text-foreground italic">
                                “Yetu Capital nous a donné les fonds dont nous
                                avions besoin pour maximiser nos stocks et nous
                                développer rapidement.”
                            </p>
                            <div className="mt-6 flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 font-bold text-primary">
                                    JW
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground">
                                        Jessica Wise
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        CEO, Hell Babies
                                    </p>
                                </div>
                            </div>
                        </div>
                    </FadeInSection>
                </div>
            </section>

            {/* ========== CRÉEZ RAPIDEMENT ========== */}
            <CreerRapidementSection />

            {/* ========== CTA FINAL ========== */}
            <CtaFinalSection />

            {/* ========== CTA INTEGRATION PRODUIT ========== */}
            <IntegrationProduct />
        </MainLayout>
    );
}
