// resources/js/Pages/Vendor/Plans.tsx
import { CheckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
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
} from 'lucide-react';
import { useState, useMemo } from 'react';

type Plan = {
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
};

type VendorPlansProps = {
    plans: Plan[];
    canBecomeVendor: boolean;
};

const planIcons: Record<string, React.ElementType> = {
    Gratuit: Zap,
    Starter: Rocket,
    Pro: Crown,
    Business: Gem,
    Enterprise: BadgeCheck,
};

export default function VendorPlans({
    plans,
    canBecomeVendor,
}: VendorPlansProps) {
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>(
        'monthly',
    );

    const displayedPlans = useMemo(() => {
        if (billingCycle === 'annual') {
            return plans.map((plan) => ({
                ...plan,
                price: plan.price * 10,
                interval: 'year',
            }));
        }

        return plans;
    }, [plans, billingCycle]);

    if (!canBecomeVendor) {
        return (
            <div className="mx-auto max-w-lg py-20 text-center">
                <SparklesSolid className="mx-auto h-12 w-12 text-amber-500" />
                <h1 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
                    Demande en cours
                </h1>
                <p className="mt-4 text-gray-500 dark:text-gray-400">
                    Une demande de création de boutique est déjà en cours de
                    traitement. Vous recevrez une notification dès qu'elle sera
                    validée.
                </p>
                <Link
                    href="/dashboard"
                    className="mt-8 inline-flex items-center gap-2 rounded-xl bg-amber-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-700"
                >
                    Retour au tableau de bord
                </Link>
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

    return (
        <>
            <Head title="Choisir un plan – Devenir vendeur" />

            <div className="bg-white dark:bg-gray-950">
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
                    {/* En-tête */}
                    <div className="mb-16 text-center">
                        <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-sm font-medium text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                            <TrendingUp className="h-4 w-4" />
                            Plus de 500 boutiques créées ce mois-ci
                        </span>
                        <h1 className="mt-6 text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl dark:text-white">
                            Lancez votre{' '}
                            <span className="bg-linear-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent dark:from-amber-400 dark:to-amber-600">
                                boutique
                            </span>{' '}
                            en ligne
                        </h1>
                        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500 dark:text-gray-400">
                            Choisissez le plan qui correspond à vos ambitions.
                            Passez à un plan supérieur à tout moment.
                        </p>
                    </div>

                    {/* Toggle mensuel / annuel */}
                    <div className="mb-12 flex justify-center">
                        <div className="inline-flex items-center rounded-full bg-gray-100 p-1 dark:bg-gray-800">
                            <button
                                onClick={() => setBillingCycle('monthly')}
                                className={`rounded-full px-6 py-2 text-sm font-medium transition ${
                                    billingCycle === 'monthly'
                                        ? 'bg-white text-gray-900 shadow dark:bg-gray-700 dark:text-white'
                                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                            >
                                Mensuel
                            </button>
                            <button
                                onClick={() => setBillingCycle('annual')}
                                className={`rounded-full px-6 py-2 text-sm font-medium transition ${
                                    billingCycle === 'annual'
                                        ? 'bg-white text-gray-900 shadow dark:bg-gray-700 dark:text-white'
                                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                            >
                                Annuel
                                <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-900 dark:text-green-400">
                                    -2 mois
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Grille des plans */}
                    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
                        {displayedPlans.map((plan) => {
                            const isSelected = selectedPlan?.id === plan.id;
                            const PlanIcon = planIcons[plan.name] || Store;
                            const isPopular =
                                plan.is_featured || plan.is_recommended;

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
                                    className={`relative flex cursor-pointer flex-col rounded-2xl border-2 p-6 transition-all duration-200 hover:shadow-lg ${
                                        isSelected
                                            ? 'border-amber-500 bg-amber-50/50 shadow-lg dark:border-amber-400 dark:bg-amber-900/20'
                                            : isPopular
                                              ? 'border-amber-200 bg-white dark:border-amber-600 dark:bg-gray-800'
                                              : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
                                    }`}
                                >
                                    {plan.badge && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-500 px-4 py-1 text-sm font-semibold text-white shadow">
                                            {plan.badge}
                                        </div>
                                    )}
                                    <div
                                        className={`mb-4 ${plan.badge ? 'mt-2' : ''}`}
                                    >
                                        <div className="mb-2 inline-flex rounded-lg bg-gray-100 p-2 dark:bg-gray-700">
                                            <PlanIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                            {plan.name}
                                        </h2>
                                        {plan.highlight && (
                                            <p className="mt-1 text-sm text-amber-600 dark:text-amber-400">
                                                {plan.highlight}
                                            </p>
                                        )}
                                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                            {plan.description}
                                        </p>
                                    </div>

                                    <div className="mb-6">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                                                {plan.price === 0
                                                    ? 'Gratuit'
                                                    : new Intl.NumberFormat(
                                                          'fr-CD',
                                                          {
                                                              style: 'currency',
                                                              currency:
                                                                  plan.currency ||
                                                                  'CDF',
                                                              minimumFractionDigits: 0,
                                                          },
                                                      ).format(plan.price)}
                                            </span>
                                            {plan.price > 0 && (
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    /
                                                    {plan.interval === 'year'
                                                        ? 'an'
                                                        : 'mois'}
                                                </span>
                                            )}
                                        </div>
                                        {plan.trial_days > 0 && (
                                            <p className="mt-1 text-sm font-medium text-green-600 dark:text-green-400">
                                                {plan.trial_days} jours d'essai
                                                gratuit
                                            </p>
                                        )}
                                    </div>

                                    <hr className="mb-6 border-gray-200 dark:border-gray-700" />

                                    <ul className="mb-8 flex-1 space-y-3">
                                        {plan.features?.map((feature, i) => (
                                            <li
                                                key={i}
                                                className="flex items-start gap-2"
                                            >
                                                <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        className={`w-full rounded-xl py-3 text-sm font-semibold transition ${
                                            isSelected
                                                ? 'bg-amber-500 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-amber-100 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
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
                                    className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-amber-600 to-amber-700 px-10 py-4 text-lg font-bold text-white shadow-xl transition hover:from-amber-700 hover:to-amber-800"
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
                        ].map(({ icon: Icon, text }, i) => (
                            <div
                                key={i}
                                className="flex flex-col items-center gap-2 rounded-2xl bg-gray-50 p-6 dark:bg-gray-800"
                            >
                                <Icon className="h-8 w-8 text-amber-500" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {text}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <p className="mt-12 text-center text-sm text-gray-400 dark:text-gray-500">
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
