import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

const menuSections = [
    {
        title: "Vendre sur Yetu",
        links: [
            { label: "Créer une boutique", href: route('vendor.register') },
            { label: "Tarifs et commissions", href: "#" },
            { label: "Guide du vendeur", href: "#" },
            { label: "Témoignages", href: "#" },
        ]
    },
    {
        title: "Acheter sur Yetu",
        links: [
            { label: "Parcourir les produits", href: route('tenant.product.index') },
            { label: "Paiement sécurisé", href: "#" },
            { label: "Livraison et retours", href: "#" },
            { label: "Protection acheteur", href: "#" },
        ]
    },
    {
        title: "Outils & Services",
        links: [
            { label: "Yetu Pay", href: "#" },
            { label: "Logistique", href: "#" },
            { label: "Publicité sponsorisée", href: "#" },
            { label: "Analytique", href: "#" },
        ]
    },
    {
        title: "Notre entreprise",
        links: [
            { label: "À propos de nous", href: route('about') },
            { label: "Carrières", href: "#" },
            { label: "Presse et médias", href: "#" },
            { label: "Investisseurs", href: "#" },
        ]
    },
    // Second row
    {
        title: "Ressources",
        links: [
            { label: "Centre d'aide", href: route('help') },
            { label: "Blog", href: route('blog.index') },
            { label: "Communauté", href: "#" },
            { label: "Webinaires", href: "#" },
        ]
    },
    {
        title: "Légal & Confidentialité",
        links: [
            { label: "Conditions d'utilisation", href: "#" },
            { label: "Politique de confidentialité", href: "#" },
            { label: "Mentions légales", href: "#" },
            { label: "Propriété intellectuelle", href: "#" },
        ]
    },
    {
        title: "Développeurs",
        links: [
            { label: "Documentation API", href: "#" },
            { label: "Intégrations", href: "#" },
            { label: "Portail partenaire", href: "#" },
            { label: "Statut du système", href: "#" },
        ]
    },
    {
        title: "Contact",
        links: [
            { label: "Support client", href: route('contact') },
            { label: "Support vendeur", href: "#" },
            { label: "Partenariats", href: "#" },
            { label: "Signaler un problème", href: "#" },
        ]
    }
];

export function ChooseYetuContent() {
    return (
        <div className="mx-auto w-full border-none lg:border lg:border-white/20 bg-transparent lg:bg-white/95 shadow-none lg:shadow-2xl lg:shadow-black/5 backdrop-blur-none lg:backdrop-blur-xl dark:border-none lg:dark:border-slate-800 dark:bg-transparent lg:dark:bg-slate-950/95">
            <div className="relative overflow-hidden">
                {/* Fond décoratif */}
                <div className="absolute inset-0 hidden lg:block bg-linear-to-br from-emerald-50/40 via-white/40 to-slate-50/40 dark:from-emerald-950/20 dark:via-slate-900/40 dark:to-slate-950/40" />
                <div className="absolute top-0 left-0 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
                <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-slate-400/10 blur-3xl dark:bg-slate-600/10" />

                <div className="relative mx-auto max-w-7xl px-4 py-4 lg:px-6 lg:py-10">
                    <div className="grid grid-cols-1 gap-y-8 gap-x-8 md:grid-cols-2 lg:grid-cols-4">
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
                </div>
            </div>
        </div>
    );
}
