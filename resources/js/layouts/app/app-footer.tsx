// resources/js/layouts/FooterSection.tsx
import { Link } from '@inertiajs/react';
import { motion, useInView } from 'framer-motion';
import {
    ShieldCheck,
    Truck,
    CreditCard,
    RefreshCw,
    ChevronRight,
    Globe,
} from 'lucide-react';
import { useRef } from 'react';
import AppLogo from '@/components/app-logo';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Icônes sociales Lucide
const socialLinks = [
    {
        name: 'Facebook',
        href: '#',
        icon: (props: any) => (
            <svg {...props} viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
        ),
    },
    {
        name: 'Instagram',
        href: '#',
        icon: (props: any) => (
            <svg
                {...props}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
        ),
    },
    {
        name: 'Twitter / X',
        href: '#',
        icon: (props: any) => (
            <svg {...props} viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        ),
    },
    {
        name: 'LinkedIn',
        href: '#',
        icon: (props: any) => (
            <svg {...props} viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        ),
    },
    {
        name: 'YouTube',
        href: '#',
        icon: (props: any) => (
            <svg {...props} viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
        ),
    },
];

const guarantees = [
    {
        icon: ShieldCheck,
        title: 'Paiement sécurisé',
        desc: 'Transactions cryptées SSL',
    },
    { icon: Truck, title: 'Livraison rapide', desc: 'Expédition 24h' },
    { icon: RefreshCw, title: 'Retours faciles', desc: 'Sous 30 jours' },
    { icon: CreditCard, title: 'Paiement en 4x', desc: 'Sans frais' },
];

const footerSections = [
    {
        title: 'Explorer',
        links: [
            { name: 'Produits', href: route('tenant.product.index') },
            {
                name: 'Promotions',
                href: route('tenant.promotions.index'),
                badge: '🔥',
            },
            {
                name: 'Nouveautés',
                href: route('tenant.product.index', { sort: 'newest' }),
                badge: '✨',
            },
            {
                name: 'Meilleures ventes',
                href: route('tenant.product.index', { sort: 'bestseller' }),
            },
        ],
    },
    {
        title: 'Entreprise',
        links: [
            { name: 'À propos', href: route('tenant.page.about') },
            { name: 'Blog', href: route('tenant.blog.index') },
            { name: 'Devenir vendeur', href: route('vendor.register') },
        ],
    },
    {
        title: 'Support',
        links: [
            { name: 'Contact', href: route('tenant.page.contact') },
            { name: 'FAQ', href: route('tenant.page.faq') },
            { name: 'Suivi de commande', href: route('tenant.orders.index') },
            { name: 'Retours', href: route('tenant.return.index') },
        ],
    },
    {
        title: 'Légal',
        links: [
            { name: 'Conditions', href: route('tenant.page.terms') },
            { name: 'Confidentialité', href: route('tenant.page.privacy') },
            { name: 'Cookies', href: route('tenant.page.cookies') },
        ],
    },
];

export default function FooterSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, ease: 'easeOut' },
        },
    };

    return (
        <footer ref={ref} className="relative border-t bg-card text-foreground">
            {/* Ligne de garanties */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                className="container mx-auto px-4 py-10"
            >
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {guarantees.map((item, i) => (
                        <motion.div
                            key={i}
                            variants={itemVariants}
                            whileHover={{ y: -2 }}
                            className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-emerald-200 dark:hover:border-emerald-800"
                        >
                            <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                <item.icon className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold">
                                    {item.title}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {item.desc}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            <Separator />

            {/* Contenu principal */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                className="container mx-auto px-4 py-12"
            >
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
                    {/* Marque */}
                    <motion.div variants={itemVariants} className="space-y-4">
                        <Link href={route('home')} className="inline-block">
                            <AppLogo />
                        </Link>
                        <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                            Une expérience e‑commerce premium, rapide et fiable.
                        </p>
                        <div className="flex gap-2">
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.name}
                                    href={social.href}
                                    whileHover={{ scale: 1.15 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border bg-card text-muted-foreground transition-colors hover:border-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400"
                                >
                                    <social.icon className="h-4 w-4" />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Sections de liens */}
                    {footerSections.map((section) => (
                        <motion.div
                            key={section.title}
                            variants={itemVariants}
                            className="space-y-3"
                        >
                            <h3 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                                {section.title}
                            </h3>
                            <ul className="space-y-2">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="group inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-emerald-600 dark:hover:text-emerald-400"
                                        >
                                            <ChevronRight className="mr-1 h-3 w-3 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" />
                                            <span className="relative">
                                                {link.name}
                                                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-emerald-500 transition-all duration-300 group-hover:w-full" />
                                            </span>
                                            {link.badge && (
                                                <Badge
                                                    variant="secondary"
                                                    className="ml-2 px-1.5 py-0 text-[10px]"
                                                >
                                                    {link.badge}
                                                </Badge>
                                            )}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            <Separator />

            {/* Barre inférieure */}
            <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col items-center justify-between gap-3 text-sm text-muted-foreground md:flex-row">
                    <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Français (CDF)
                    </div>
                    <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Visa • Mastercard • PayPal
                    </div>
                    <p>© {new Date().getFullYear()} Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    );
}
