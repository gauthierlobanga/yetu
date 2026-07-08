import { Link } from '@inertiajs/react';
import { motion } from 'motion/react';
import {
    ArrowRight,
    Building2,
    Factory,
    Handshake,
    Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuSections = [
    {
        title: "Outils de vente",
        links: [
            { label: "Boutique en ligne", href: route('vendor.register') },
            { label: "Panier & Checkout", href: route('vendor.register') },
            { label: "Expérience Mobile First", href: route('vendor.register') },
            { label: "Domaine personnalisé", href: route('vendor.register') },
        ]
    },
    {
        title: "Gestion",
        links: [
            { label: "Personnalisation", href: route('vendor.register') },
            { label: "Gestion avancée", href: route('vendor.register') },
            { label: "Statistiques & Analytique", href: route('vendor.register') },
            { label: "Marketing intégré", href: route('vendor.register') },
        ]
    },
    {
        title: "Aide & Contact",
        links: [
            { label: "Centre d'aide vendeur", href: route('help') },
            { label: "Tutoriels", href: "#" },
            { label: "Contacter le support", href: route('contact') },
            { label: "Communauté des vendeurs", href: "#" },
        ]
    }
];

const solutions = [
    {
        icon: Handshake,
        label: 'Pour les artisans',
        description: 'Simple, rapide et accessible.',
        href: route('vendor.register'),
    },
    {
        icon: Building2,
        label: 'Pour les PME',
        description: 'Automatisez vos ventes.',
        href: route('vendor.register'),
    },
    {
        icon: Factory,
        label: 'Grandes marques',
        description: 'Infrastructure robuste.',
        href: route('vendor.register'),
    },
];

export function Support() {
    return (
        <div className={cn(
            "mx-auto w-full overflow-hidden",
            "rounded-none lg:rounded-b-[2rem]",
            "border-none lg:border lg:border-white/20 dark:border-none lg:dark:border-slate-800",
            "bg-transparent lg:bg-white/95 dark:bg-transparent lg:dark:bg-slate-950/95",
            "shadow-none lg:shadow-2xl lg:shadow-black/5",
            "backdrop-blur-none lg:backdrop-blur-xl"
        )}>
            <div className="relative overflow-hidden">
                {/* Fond décoratif */}
                <div className="absolute inset-0 hidden lg:block bg-linear-to-br from-emerald-50/40 via-white/40 to-slate-50/40 dark:from-emerald-950/20 dark:via-slate-900/40 dark:to-slate-950/40" />
                <div className="absolute top-0 left-0 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
                <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-slate-400/10 blur-3xl dark:bg-slate-600/10" />

                <div className="relative grid grid-cols-12">
                    {/* Section Gauche (Liens style ChooseYetu) */}
                    <section className="col-span-12 p-6 xl:col-span-8 xl:p-7">
                        <div className="grid grid-cols-1 gap-y-8 gap-x-8 md:grid-cols-3">
                            {menuSections.map((section, sectionIdx) => (
                                <div key={section.title} className="space-y-5">
                                    <motion.h3
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: sectionIdx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                                        className="text-xs font-bold tracking-widest text-slate-900 uppercase dark:text-white"
                                    >
                                        {section.title}
                                    </motion.h3>
                                    <ul className="space-y-4">
                                        {section.links.map((link, linkIdx) => (
                                            <motion.li
                                                key={link.label}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{
                                                    duration: 0.4,
                                                    delay: (sectionIdx * 0.05) + (linkIdx * 0.03) + 0.1,
                                                    ease: [0.16, 1, 0.3, 1]
                                                }}
                                            >
                                                <Link
                                                    href={link.href}
                                                    className="group inline-flex items-center text-sm font-medium text-slate-500 transition-colors hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
                                                >
                                                    <span className="relative">
                                                        {link.label}
                                                        <span className="absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-emerald-500 transition-all duration-300 group-hover:w-full"></span>
                                                    </span>
                                                </Link>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Section Droite (Sidebar originale) */}
                    <aside className="col-span-12 border-t border-slate-200/70 bg-slate-50/70 p-6 xl:col-span-4 xl:border-t-0 xl:border-l dark:border-slate-800/70 dark:bg-slate-900/40">
                        <div className="mb-4">
                            <p className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400">
                                Solutions
                            </p>
                            <h4 className="mt-1 text-base font-semibold text-slate-900 dark:text-white">
                                Pour chaque activité
                            </h4>
                        </div>

                        {/* Compact solution list */}
                        <div className="space-y-2">
                            {solutions.map((solution, index) => (
                                <motion.div
                                    key={solution.label}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 + 0.2, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <Link
                                        href={solution.href}
                                        className="group flex items-center gap-3 rounded-2xl border border-transparent p-3 transition-all duration-300 hover:border-emerald-200 hover:bg-white hover:shadow-sm dark:hover:border-emerald-800/50 dark:hover:bg-slate-800/70"
                                    >
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
                                            <solution.icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold text-slate-900 transition-colors group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                                                {solution.label}
                                            </p>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                                {solution.description}
                                            </p>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {/* Compact CTA */}
                        <div className="mt-4 rounded-2xl border border-emerald-200/70 bg-linear-to-br from-emerald-50 via-white to-slate-50 p-4 dark:border-emerald-800/40 dark:from-emerald-950/30 dark:via-slate-900 dark:to-slate-950">
                            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md shadow-emerald-500/20">
                                <Zap className="h-4 w-4" />
                            </div>

                            <h5 className="text-sm font-semibold text-slate-900 dark:text-white">
                                Prêt à vendre ?
                            </h5>
                            <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                Créez votre boutique professionnelle dès aujourd’hui.
                            </p>

                            <Link
                                href={route('vendor.register')}
                                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                            >
                                Créer ma boutique
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
