// resources/js/Pages/Vendor/Plans.tsx
import { SparklesIcon as SparklesSolid } from '@heroicons/react/24/solid';
import { Head, Link, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Rocket,
    Zap,
    Crown,
    Gem,
    ArrowRight,
    BadgeCheck,
    TrendingUp,
    Store,
    RefreshCw,
    Headphones,
    ShieldCheckIcon,
    Sparkles,
    Package,
    ShoppingCart,
    BarChart3,
    Globe,
    CreditCard,
    Users,
    FileText,
    Wrench,
    Check,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { dashboard } from '@/routes';

interface Plan {
    id: number | string;
    name: string;
    description: string;
    highlight?: string;
    price: number;
    currency?: string;
    interval?: string;
    trial_days: number;
    is_featured?: boolean;
    is_recommended?: boolean;
    features?: string[];
    limits?: Record<string, string>;
    badge?: string;
    badge_color?: string;
    button_text?: string;
}

interface Props {
    plans: Plan[];
    canBecomeVendor: boolean;
}

const planIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    Gratuit: Zap,
    Starter: Rocket,
    Pro: Crown,
    Business: Gem,
    Enterprise: BadgeCheck,
};

const featureIconMap: Record<
    string,
    React.ComponentType<{ className?: string }>
> = {
    produit: Package,
    commande: ShoppingCart,
    statistique: BarChart3,
    domaine: Globe,
    paiement: CreditCard,
    compte: Users,
    rapport: FileText,
    support: Headphones,
    personnalis: Wrench,
    illimité: Sparkles,
};

function getFeatureIcon(
    text: string,
): React.ComponentType<{ className?: string }> {
    const lower = text.toLowerCase();

    for (const [key, Icon] of Object.entries(featureIconMap)) {
        if (lower.includes(key)) {
            return Icon;
        }
    }

    return Check;
}

export default function VendorPlans({ plans, canBecomeVendor }: Props) {
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>(
        'monthly',
    );

    const displayedPlans = useMemo(() => {
        if (billingCycle === 'annual') {
            return plans.map((plan) => ({
                ...plan,
                price: Math.round(plan.price * 10 * 100) / 100,
                interval: 'year' as const,
            }));
        }

        return plans.map((p) => ({ ...p, interval: p.interval as string }));
    }, [plans, billingCycle]);

    if (!canBecomeVendor) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center px-4">
                <div className="max-w-md text-center">
                    <div className="mb-6 inline-flex rounded-2xl bg-primary/10 p-4">
                        <SparklesSolid className="h-10 w-10 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground">
                        Demande en cours
                    </h1>
                    <p className="mt-3 text-muted-foreground">
                        Une demande de création de boutique est déjà en cours de
                        traitement. Vous recevrez une notification dès qu'elle
                        sera validée.
                    </p>
                    <Link
                        href={dashboard()}
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                    >
                        Retour au tableau de bord
                    </Link>
                </div>
            </div>
        );
    }

    const handleContinue = () => {
        if (selectedPlan) {
            router.visit('/devenir-vendeur/configurer', {
                method: 'get',
                data: { plan_id: selectedPlan.id, billing_cycle: billingCycle },
            });
        }
    };

    const formatPrice = (price: number, currency: string = 'CDF') => {
        if (price === 0) {
            return 'Gratuit';
        }

        return new Intl.NumberFormat('fr-CD', {
            style: 'currency',
            currency,
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <>
            <Head title="Choisir un plan – Devenir vendeur" />

            {/* Fond premium avec dégradé et formes décoratives */}
            <div className="relative min-h-screen overflow-hidden bg-linear-to-b from-background via-background to-primary/5 dark:from-background dark:to-primary/10">
                {/* Formes d'arrière-plan floues */}
                <div className="pointer-events-none absolute inset-0 -z-10">
                    <div className="absolute -top-32 left-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
                    <div className="absolute right-1/4 -bottom-20 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
                </div>

                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
                    {/* En-tête */}
                    <div className="mb-16 text-center">
                        <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                            <TrendingUp className="h-4 w-4" />
                            Plus de 500 boutiques créées ce mois-ci
                        </span>
                        <h1 className="mt-6 text-4xl font-semibold text-foreground sm:text-5xl lg:text-5xl">
                            Lancez votre{' '}
                            <span className="bg-linear-to-r from-primary to-emerald-400 bg-clip-text text-transparent dark:from-primary dark:to-emerald-300">
                                boutique
                            </span>{' '}
                            en ligne
                        </h1>
                        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                            Choisissez le plan qui correspond à vos ambitions.
                            Passez à un plan supérieur à tout moment.
                        </p>
                    </div>

                    {/* Toggle mensuel / annuel */}
                    <div className="mb-12 flex justify-center">
                        <div className="inline-flex items-center rounded-full bg-muted p-1">
                            <button
                                onClick={() => setBillingCycle('monthly')}
                                className={`rounded-full px-6 py-2 text-sm font-medium transition ${
                                    billingCycle === 'monthly'
                                        ? 'bg-background text-foreground shadow dark:bg-card'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                Mensuel
                            </button>
                            <button
                                onClick={() => setBillingCycle('annual')}
                                className={`rounded-full px-6 py-2 text-sm font-medium transition ${
                                    billingCycle === 'annual'
                                        ? 'bg-background text-foreground shadow dark:bg-card'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                Annuel
                                <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                                    -2 mois
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Grille des plans */}
                    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {displayedPlans.map((plan) => {
                            const isSelected = selectedPlan?.id === plan.id;
                            const IconComponent = planIcons[plan.name] || Store;

                            return (
                                <motion.div
                                    key={plan.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        duration: 0.4,
                                        ease: 'easeOut',
                                    }}
                                    onClick={() => setSelectedPlan(plan)}
                                    className={`relative flex cursor-pointer flex-col rounded-2xl border-2 p-5 transition-all duration-200 hover:shadow-lg ${
                                        isSelected
                                            ? 'border-primary bg-primary/10 shadow-lg dark:bg-primary/20'
                                            : plan.is_featured ||
                                                plan.is_recommended
                                              ? 'border-primary/30 bg-card'
                                              : 'border-border bg-card'
                                    }`}
                                >
                                    {plan.badge && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow">
                                            {plan.badge}
                                        </div>
                                    )}
                                    <div
                                        className={`mb-4 ${plan.badge ? 'mt-2' : ''}`}
                                    >
                                        <div className="mb-2 inline-flex rounded-lg bg-muted p-2">
                                            <IconComponent className="h-6 w-6 text-primary" />
                                        </div>
                                        <h2 className="text-lg font-bold text-foreground">
                                            {plan.name}
                                        </h2>
                                        {plan.highlight && (
                                            <p className="mt-1 text-xs text-primary">
                                                {plan.highlight}
                                            </p>
                                        )}
                                        <p className="mt-2 line-clamp-3 text-xs text-muted-foreground">
                                            {plan.description}
                                        </p>
                                    </div>

                                    <div className="mb-5">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-extrabold text-foreground">
                                                {formatPrice(
                                                    plan.price,
                                                    plan.currency,
                                                )}
                                            </span>
                                            {plan.price > 0 && (
                                                <span className="text-sm text-muted-foreground">
                                                    /
                                                    {plan.interval === 'year'
                                                        ? 'an'
                                                        : 'mois'}
                                                </span>
                                            )}
                                        </div>
                                        {plan.trial_days > 0 && (
                                            <p className="mt-1 text-xs font-medium text-primary">
                                                {plan.trial_days} jours d'essai
                                                gratuit
                                            </p>
                                        )}
                                    </div>

                                    <hr className="mb-5 border-border" />

                                    <ul className="mb-6 flex-1 space-y-2.5">
                                        {plan.features?.map((feature, i) => {
                                            const FeatureIcon =
                                                getFeatureIcon(feature);

                                            return (
                                                <li
                                                    key={i}
                                                    className="flex items-start gap-2"
                                                >
                                                    <FeatureIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                                    <span className="text-xs text-muted-foreground">
                                                        {feature}
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>

                                    <button
                                        className={`w-full rounded-xl py-2.5 text-sm font-semibold transition ${
                                            isSelected
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted text-foreground hover:bg-primary/20 dark:hover:bg-primary/10'
                                        }`}
                                    >
                                        {isSelected
                                            ? 'Sélectionné'
                                            : plan.button_text ||
                                              'Choisir ce plan'}
                                    </button>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Bouton Continuer */}
                    <AnimatePresence>
                        {selectedPlan && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="mt-12 text-center"
                            >
                                <button
                                    onClick={handleContinue}
                                    className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-primary to-primary/80 px-8 py-4 text-lg font-semibold text-primary-foreground shadow-xl transition hover:from-primary/90 hover:to-primary/70"
                                >
                                    Continuer avec {selectedPlan.name}
                                    <ArrowRight className="h-5 w-5" />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Garanties */}
                    <div className="mt-20 grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {[
                            {
                                icon: ShieldCheckIcon,
                                text: 'Paiement sécurisé',
                            },
                            {
                                icon: RefreshCw,
                                text: 'Annulation à tout moment',
                            },
                            { icon: Headphones, text: 'Support 24/7' },
                            { icon: TrendingUp, text: 'Statistiques avancées' },
                        ].map(({ icon: Icon, text }) => (
                            <div
                                key={text}
                                className="flex flex-col items-center gap-2 rounded-2xl bg-muted p-6"
                            >
                                <Icon className="h-8 w-8 text-primary" />
                                <span className="text-sm font-medium text-foreground">
                                    {text}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <p className="mt-12 text-center text-sm text-muted-foreground">
                        Tous les plans incluent un sous‑domaine gratuit, la
                        gestion des commandes et le support technique.
                        <br />
                        Passez à un plan supérieur à tout moment depuis votre
                        tableau de bord.
                    </p>
                </div>
            </div>
        </>
    );
}
