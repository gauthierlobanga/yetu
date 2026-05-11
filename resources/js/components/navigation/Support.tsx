// resources/js/components/navigation/ProductsMenuContent.tsx
import { Link } from '@inertiajs/react';
import {
    Store,
    ShoppingCart,
    Smartphone,
    Globe,
    Palette,
    Settings,
    Handshake,
    Building2,
    Factory,
} from 'lucide-react';

const tools = [
    {
        icon: Store,
        title: 'Boutique en ligne',
        desc: 'Créez un site vitrine et vendez 24h/24.',
    },
    {
        icon: ShoppingCart,
        title: 'Panier & Checkout',
        desc: 'Processus de commande optimisé pour convertir.',
    },
    {
        icon: Smartphone,
        title: 'Mobile first',
        desc: 'Thèmes responsives pour smartphones et tablettes.',
    },
    {
        icon: Globe,
        title: 'Domaines personnalisés',
        desc: 'Utilisez votre propre nom de domaine.',
    },
    {
        icon: Palette,
        title: 'Personnalisation',
        desc: 'Modifiez les couleurs, polices et mises en page.',
    },
    {
        icon: Settings,
        title: 'Gestion avancée',
        desc: 'Inventaire, commandes, clients, tout est intégré.',
    },
];

const solutions = [
    {
        icon: Handshake,
        label: 'Pour les artisans',
        href: route('vendor.register'),
    },
    { icon: Building2, label: 'Pour les PME', href: route('vendor.register') },
    {
        icon: Factory,
        label: 'Pour les grandes marques',
        href: route('vendor.register'),
    },
];

export function Support() {
    return (
        <div className="grid grid-cols-[2fr_1fr] gap-8 p-6">
            {/* Colonne principale : outils */}
            <div>
                <h4 className="mb-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Outils de vente
                </h4>
                <div className="grid grid-cols-2 gap-4">
                    {tools.map((tool) => (
                        <Link
                            key={tool.title}
                            href={route('vendor.register')}
                            className="group flex gap-3 rounded-xl border border-transparent p-3 transition-all hover:border-emerald-200 hover:bg-emerald-50/50 dark:hover:border-emerald-800 dark:hover:bg-emerald-900/20"
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                <tool.icon className="h-5 w-5" />
                            </div>
                            <div>
                                <h5 className="text-sm font-semibold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                                    {tool.title}
                                </h5>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    {tool.desc}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Colonne latérale : solutions */}
            <div className="border-l pl-6">
                <h4 className="mb-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                    Solutions
                </h4>
                <ul className="space-y-1">
                    {solutions.map((sol) => (
                        <li key={sol.label}>
                            <Link
                                href={sol.href}
                                className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/20 dark:hover:text-emerald-400"
                            >
                                <sol.icon className="h-4 w-4" />
                                {sol.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* CTA supplémentaire */}
                <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
                    <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                        Boostez votre activité
                    </p>
                    <Link
                        href={route('vendor.register')}
                        className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                    >
                        Créer ma boutique →
                    </Link>
                </div>
            </div>
        </div>
    );
}
