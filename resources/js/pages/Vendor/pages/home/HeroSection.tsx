/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/components/home/HeroSection.tsx
import { useGSAP } from '@gsap/react';
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import {
    ArrowRight,
    CheckCircle2,
    Flame,
    Package2,
    Search,
    ShieldCheck,
    Sparkles,
    Star,
    Truck,
    Users,
    ChevronRight,
} from 'lucide-react';
import { useRef, useState } from 'react';
import CountUp from 'react-countup';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { Category } from '@/types/ecommerce/products';

interface HeroSectionProps {
    categories: Category[];
}

const TrustIndicator = ({
    icon: Icon,
    label,
}: {
    icon: any;
    label: string;
}) => (
    <motion.div
        className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/40 px-4 py-2 text-sm text-slate-700 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-emerald-300 hover:bg-white/60 hover:shadow-md dark:border-slate-700/50 dark:bg-slate-900/40 dark:text-slate-300 dark:hover:border-emerald-700 dark:hover:bg-slate-900/60"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
    >
        <Icon className="h-4 w-4 text-emerald-500" />
        {label}
    </motion.div>
);

export default function HeroSection({ categories }: HeroSectionProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { productsCount = 0 } = usePage<{ productsCount?: number }>().props;
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        if (searchQuery.trim()) {
            window.location.href = route('tenant.product.index', {
                search: searchQuery,
            });
        }
    };

    // Animation d'apparition simplifiée
    useGSAP(
        () => {
            gsap.fromTo(
                '.hero-badge',
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
            );
            gsap.fromTo(
                '.hero-title',
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.9,
                    delay: 0.2,
                    ease: 'power3.out',
                },
            );
            gsap.fromTo(
                '.hero-subtitle',
                { y: 20, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.7,
                    delay: 0.4,
                    ease: 'power3.out',
                },
            );
            gsap.fromTo(
                '.hero-search',
                { y: 15, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.5,
                    delay: 0.6,
                    ease: 'power3.out',
                },
            );
            gsap.fromTo(
                '.hero-visual',
                { scale: 0.95, opacity: 0 },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 1,
                    delay: 0.8,
                    ease: 'power3.out',
                },
            );
        },
        { scope: containerRef },
    );

    return (
        <section className="relative overflow-hidden bg-white dark:bg-slate-950">
            <div
                ref={containerRef}
                className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20"
            >
                {/* Fond simplifié */}
                <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-0 bg-linear-to-br from-emerald-50 via-white to-cyan-50/40 dark:from-slate-950 dark:via-slate-950 dark:to-emerald-950/20" />
                    <div className="absolute -top-48 left-1/4 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
                    <div className="absolute top-1/3 -right-32 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
                    <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-violet-500/8 blur-3xl" />
                    <div className="absolute inset-0 bg-[radial-linear(circle_at_1px_1px,rgba(148,163,184,0.15)_1px,transparent_0)] bg-size-[28px_28px] dark:bg-[radial-linear(circle_at_1px_1px,rgba(51,65,85,0.35)_1px,transparent_0)]" />
                </div>

                <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
                    {/* Gauche */}
                    <div className="relative z-10">
                        <div className="hero-badge">
                            <Badge className="inline-flex rounded-full border border-emerald-200/70 bg-white/90 px-4 py-2 text-emerald-700 shadow-sm backdrop-blur-xl dark:border-emerald-800/60 dark:bg-slate-900/80 dark:text-emerald-300">
                                <Sparkles className="mr-2 h-4 w-4" />
                                Nouvelle collection • Livraison offerte
                            </Badge>
                        </div>
                        <h1 className="hero-title mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
                            Achetez{' '}
                            <span className="relative inline-block">
                                <span className="bg-linear-to-r from-emerald-600 via-cyan-600 to-violet-600 bg-clip-text text-transparent dark:from-emerald-400 dark:via-cyan-400 dark:to-violet-400">
                                    intelligemment
                                </span>
                                <svg
                                    className="absolute -bottom-2 left-0 w-full"
                                    viewBox="0 0 200 8"
                                    fill="none"
                                >
                                    <path
                                        d="M1 5.5C25 1.5 75 -0.5 125 2.5C175 5.5 199 7 199 7"
                                        stroke="url(#underline)"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        className="opacity-70"
                                    />
                                    <defs>
                                        <linearGradient
                                            id="underline"
                                            x1="0%"
                                            y1="0%"
                                            x2="100%"
                                            y2="0%"
                                        >
                                            <stop
                                                offset="0%"
                                                stopColor="#10b981"
                                            />
                                            <stop
                                                offset="100%"
                                                stopColor="#8b5cf6"
                                            />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </span>
                            <br />
                            <span className="text-slate-900 dark:text-white">
                                en toute confiance
                            </span>
                        </h1>
                        <p className="hero-subtitle mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-300">
                            Découvrez des milliers de produits soigneusement
                            sélectionnés, des offres exclusives et une
                            expérience e‑commerce moderne, rapide et sécurisée.
                        </p>

                        <form
                            onSubmit={handleSearch}
                            className="hero-search mt-6 flex gap-3"
                        >
                            <div className="relative max-w-md flex-1">
                                <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                <Input
                                    type="text"
                                    placeholder="Rechercher un produit..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="h-12 w-full rounded-2xl border-slate-200/70 bg-white/70 pr-4 pl-12 text-sm shadow-sm backdrop-blur-xl transition-all duration-300 placeholder:text-slate-400 hover:border-emerald-300 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700/50 dark:bg-slate-900/70 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-emerald-600 dark:focus:border-emerald-500"
                                />
                            </div>
                            <Button
                                type="submit"
                                size="lg"
                                className="h-12 rounded-2xl bg-linear-to-r from-emerald-600 to-cyan-600 px-6 text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/30 dark:shadow-emerald-500/10"
                            >
                                <ArrowRight className="h-5 w-5" />
                            </Button>
                        </form>

                        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                            <Button
                                asChild
                                size="lg"
                                className={cn(
                                    'group relative h-14 overflow-hidden rounded-2xl px-8 text-base font-semibold',
                                    'bg-linear-to-r from-emerald-600 via-emerald-500 to-cyan-500',
                                    'border border-emerald-400/20 text-white transition-all duration-300',
                                    'hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/35',
                                    'active:scale-[0.98]',
                                )}
                            >
                                <Link href={route('tenant.product.index')}>
                                    <span className="relative z-10 flex items-center">
                                        Commencer mes achats
                                        <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                                    </span>
                                    <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className={cn(
                                    'group relative h-14 overflow-hidden rounded-2xl px-8 text-base font-semibold',
                                    'border-slate-300 bg-white text-slate-900 shadow-lg shadow-slate-200/60',
                                    'hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700',
                                    'dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:shadow-black/20',
                                    'dark:hover:border-emerald-700 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400',
                                    'backdrop-blur-xl transition-all duration-300',
                                    'hover:-translate-y-0.5 hover:shadow-xl',
                                    'active:scale-[0.98]',
                                )}
                            >
                                <Link
                                    href={route(
                                        'tenant.product.category.index',
                                    )}
                                >
                                    <span className="flex items-center">
                                        Explorer les catégories
                                        <ChevronRight className="ml-2 h-4 w-4 opacity-70 transition-transform duration-300 group-hover:translate-x-1" />
                                    </span>
                                </Link>
                            </Button>
                        </div>

                        <div className="hero-trust mt-8 flex flex-wrap gap-3">
                            <TrustIndicator
                                icon={ShieldCheck}
                                label="Paiement sécurisé"
                            />
                            <TrustIndicator
                                icon={Truck}
                                label="Livraison rapide"
                            />
                            <TrustIndicator
                                icon={CheckCircle2}
                                label="Retours faciles"
                            />
                            <TrustIndicator icon={Users} label="Support 24/7" />
                        </div>
                    </div>

                    {/* Droite – disposition épurée */}
                    <div className="hero-visual relative hidden lg:block">
                        <div className="relative mx-auto max-w-md">
                            {/* Halo */}
                            <div className="absolute inset-0 scale-105 rounded-[2.5rem] bg-linear-to-br from-emerald-500/20 via-cyan-500/10 to-violet-500/10 blur-3xl" />

                            {/* Image centrale */}
                            <motion.div
                                className="relative overflow-hidden rounded-[2.5rem] border border-white/30 bg-white/10 shadow-2xl shadow-slate-300/20 backdrop-blur-2xl dark:border-white/10 dark:shadow-black/30"
                                whileHover={{ scale: 1.02 }}
                            >
                                <img
                                    src="/storage/images/shopping-basket.jpg"
                                    alt="Shopping premium"
                                    className="aspect-4/5 w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 via-transparent to-transparent" />
                                <div className="absolute right-0 bottom-0 left-0 p-6 text-white">
                                    <p className="text-sm font-medium">
                                        Nouveautés 2024
                                    </p>
                                    <p className="text-2xl font-bold">
                                        Collection Exclusive
                                    </p>
                                </div>
                            </motion.div>

                            {/* Cartes flottantes simplifiées */}
                            <motion.div
                                className="absolute -bottom-6 -left-6 rounded-3xl border border-white/60 bg-white/90 p-5 shadow-2xl backdrop-blur-2xl dark:border-slate-700/60 dark:bg-slate-900/90"
                                whileHover={{ y: -4 }}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                                        <Flame className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                            <CountUp
                                                start={0}
                                                end={productsCount}
                                                duration={2}
                                                separator=" "
                                            />
                                            +
                                        </p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            produits disponibles
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center gap-1 text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className="h-3.5 w-3.5 fill-current"
                                        />
                                    ))}
                                    <span className="ml-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                                        4.9/5
                                    </span>
                                </div>
                            </motion.div>

                            <motion.div
                                className="absolute top-8 -right-6 rounded-3xl border border-white/60 bg-white/90 p-4 shadow-xl backdrop-blur-2xl dark:border-slate-700/60 dark:bg-slate-900/90"
                                whileHover={{ y: -4 }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                        <Package2 className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                                            Livraison 24h
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Grandes villes
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
