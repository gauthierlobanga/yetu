// resources/js/components/navigation/ChooseYetuContent.tsx
import { Link } from '@inertiajs/react';
import {
    Rocket,
    Shield,
    CreditCard,
    Headphones,
    TrendingUp,
    Globe,
    BookOpen,
    HelpCircle,
    Mail,
} from 'lucide-react';

const features = [
    {
        icon: Rocket,
        title: 'Démarrage rapide',
        desc: 'Lancez votre boutique en quelques minutes, sans compétences techniques.',
    },
    {
        icon: Shield,
        title: 'Sécurité maximale',
        desc: 'Certificat SSL, protection contre la fraude et sauvegardes automatiques.',
    },
    {
        icon: CreditCard,
        title: 'Paiements simplifiés',
        desc: 'Acceptez cartes bancaires, mobile money et paiement à la livraison.',
    },
    {
        icon: Headphones,
        title: 'Support réactif',
        desc: 'Une équipe dédiée pour vous aider à chaque étape.',
    },
    {
        icon: TrendingUp,
        title: 'Statistiques avancées',
        desc: 'Analysez vos ventes, vos clients et optimisez votre activité.',
    },
    {
        icon: Globe,
        title: 'International',
        desc: 'Vendez dans plusieurs pays et devises sans effort.',
    },
];

const resources = [
    { icon: BookOpen, label: 'Blog', href: route('blog.index') },
    {
        icon: HelpCircle,
        label: "Centre d'aide",
        href: route('page.help'),
    },
    {
        icon: HelpCircle,
        label: "Centre d'aide",
        href: route('page.help'),
    },
    {
        icon: HelpCircle,
        label: 'A propos',
        href: route('page.about'),
    },
    { icon: Mail, label: 'Contact', href: route('page.contact') },
];

export function ChooseYetuContent() {
    return (
        <div className="grid grid-cols-[2fr_1fr] gap-8 p-6">
            {/* Colonne principale : fonctionnalités */}
            <div>
                <h4 className="mb-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Pourquoi Yetu ?
                </h4>
                <div className="grid grid-cols-2 gap-4">
                    {features.map((feat) => (
                        <Link
                            key={feat.title}
                            href={route('vendor.register')}
                            className="group flex gap-3 rounded-xl border border-transparent p-3 transition-all hover:border-emerald-200 hover:bg-emerald-50/50 dark:hover:border-emerald-800 dark:hover:bg-emerald-900/20"
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                <feat.icon className="h-5 w-5" />
                            </div>
                            <div>
                                <h5 className="text-sm font-semibold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                                    {feat.title}
                                </h5>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    {feat.desc}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Colonne latérale : ressources */}
            <div className="border-l pl-6">
                <h4 className="mb-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Ressources
                </h4>
                <ul className="space-y-1">
                    {resources.map((res) => (
                        <li key={res.label}>
                            <Link
                                href={res.href}
                                className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400"
                            >
                                <res.icon className="h-4 w-4" />
                                {res.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* CTA supplémentaire */}
                <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
                    <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                        Prêt à vous lancer ?
                    </p>
                    <Link
                        href={route('vendor.register')}
                        className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                    >
                        Démarrer gratuitement →
                    </Link>
                </div>
            </div>
        </div>
    );
}
