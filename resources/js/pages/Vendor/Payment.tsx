import { ShieldCheckIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

type VendorPaymentProps = {
    plan: {
        name: string;
        formatted_price: string;
        trial_days: number;
    };
    vendorRequest: {
        shop_name: string;
        shop_slug: string;
    };
};

export default function VendorPayment({
    plan,
    vendorRequest,
}: VendorPaymentProps) {
    const [processing, setProcessing] = useState(false);

    const handlePayment = () => {
        setProcessing(true);
        window.location.href = route('vendor.payment.checkout');
    };

    return (
        <>
            <Head title="Paiement" />

            <div className="mx-auto max-w-2xl px-4 py-12">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Finaliser votre inscription
                    </h1>
                    <p className="mt-2 text-gray-500">
                        Plan sélectionné : <strong>{plan.name}</strong>
                    </p>
                </div>

                {/* Résumé de la commande */}
                <div className="mb-8 rounded-2xl bg-white p-8 shadow-lg">
                    <h2 className="mb-6 text-xl font-bold text-gray-900">
                        Résumé de votre commande
                    </h2>

                    <div className="space-y-4">
                        <div className="flex justify-between border-b py-2">
                            <span className="text-gray-600">
                                Plan {plan.name}
                            </span>
                            <span className="font-semibold">
                                {plan.formatted_price}
                            </span>
                        </div>

                        {plan.trial_days > 0 && (
                            <div className="flex justify-between border-b py-2">
                                <span className="text-gray-600">
                                    Période d'essai ({plan.trial_days} jours)
                                </span>
                                <span className="font-semibold text-green-600">
                                    Gratuit
                                </span>
                            </div>
                        )}

                        <div className="flex justify-between py-3 text-lg font-bold">
                            <span>Total</span>
                            <span className="text-amber-700">
                                {plan.formatted_price}/mois
                            </span>
                        </div>

                        {plan.trial_days > 0 && (
                            <p className="text-center text-sm text-gray-400">
                                Vous ne serez facturé qu'après la période
                                d'essai de {plan.trial_days} jours. Vous pouvez
                                annuler à tout moment.
                            </p>
                        )}
                    </div>
                </div>

                {/* Informations de la boutique */}
                <div className="mb-8 rounded-2xl bg-white p-8 shadow-lg">
                    <h2 className="mb-4 text-xl font-bold text-gray-900">
                        Votre boutique
                    </h2>

                    <div className="space-y-3">
                        <div>
                            <span className="text-gray-500">Nom :</span>
                            <span className="ml-2 font-medium">
                                {vendorRequest.shop_name}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-500">Adresse :</span>
                            <span className="ml-2 font-medium">
                                {vendorRequest.shop_slug}.
                                {window.location.hostname}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Sécurité */}
                <div className="mb-8 flex items-center justify-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        <LockClosedIcon className="h-4 w-4 text-green-500" />
                        <span>Paiement sécurisé</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ShieldCheckIcon className="h-4 w-4 text-green-500" />
                        <span>Protection des données</span>
                    </div>
                </div>

                {/* Bouton de paiement */}
                <button
                    onClick={handlePayment}
                    disabled={processing}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 py-4 text-lg font-semibold text-white transition hover:bg-amber-700 disabled:opacity-50"
                >
                    {processing ? (
                        <>
                            <svg
                                className="h-5 w-5 animate-spin"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                />
                            </svg>
                            Redirection vers la page de paiement...
                        </>
                    ) : (
                        <>Payer {plan.formatted_price} et créer ma boutique</>
                    )}
                </button>

                <p className="mt-4 text-center text-sm text-gray-400">
                    En cliquant sur ce bouton, vous serez redirigé vers la page
                    de paiement sécurisée de Stripe.
                </p>

                {/* Retour */}
                <div className="mt-6 text-center">
                    <Link
                        href={route('vendor.configure')}
                        className="text-sm text-amber-600 underline"
                    >
                        ← Retour à la configuration
                    </Link>
                </div>
            </div>
        </>
    );
}
