/* eslint-disable @typescript-eslint/no-unused-vars */
import { Transition } from '@headlessui/react';
import { Form, Head } from '@inertiajs/react';
import { ShieldCheck, KeyRound, Smartphone } from 'lucide-react';
import { useRef, useState } from 'react';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { disable, enable } from '@/routes/two-factor';
import type { BreadcrumbItem } from '@/types';

type Props = {
    canManageTwoFactor?: boolean;
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Sécurité',
        href: '#',
    },
];

export default function Security({
    canManageTwoFactor = false,
    requiresConfirmation = false,
    twoFactorEnabled = false,
}: Props) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const {
        qrCodeSvg,
        hasSetupData,
        manualSetupKey,
        clearSetupData,
        fetchSetupData,
        recoveryCodesList,
        fetchRecoveryCodes,
        errors,
    } = useTwoFactorAuth();
    const [showSetupModal, setShowSetupModal] = useState<boolean>(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sécurité" />
            <SettingsLayout>
                <div className="space-y-8">
                    {/* Carte : Mot de passe */}
                    <Card className="overflow-hidden border-0 bg-white/70 shadow-xl shadow-slate-200/20 backdrop-blur-xl dark:bg-slate-900/70 dark:shadow-black/20">
                        <div className="h-1 w-full bg-linear-to-r from-emerald-500 to-teal-500" />
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <KeyRound className="h-5 w-5 text-emerald-500" />
                                Mettre à jour le mot de passe
                            </CardTitle>
                            <CardDescription>
                                Utilisez un mot de passe long et unique pour
                                sécuriser votre compte.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form
                                {...SecurityController.update.form()}
                                options={{ preserveScroll: true }}
                                resetOnError={[
                                    'password',
                                    'password_confirmation',
                                    'current_password',
                                ]}
                                resetOnSuccess
                                onError={(errors) => {
                                    if (errors.password) {
                                        passwordInput.current?.focus();
                                    }

                                    if (errors.current_password) {
                                        currentPasswordInput.current?.focus();
                                    }
                                }}
                                className="space-y-6"
                            >
                                {({
                                    errors,
                                    processing,
                                    recentlySuccessful,
                                }) => (
                                    <>
                                        <div className="grid gap-6 sm:grid-cols-2">
                                            <div className="grid gap-2">
                                                <Label htmlFor="current_password">
                                                    Mot de passe actuel
                                                </Label>
                                                <PasswordInput
                                                    id="current_password"
                                                    ref={currentPasswordInput}
                                                    name="current_password"
                                                    className="h-10 rounded-xl"
                                                    autoComplete="current-password"
                                                    placeholder="••••••••"
                                                />
                                                <InputError
                                                    message={
                                                        errors.current_password
                                                    }
                                                />
                                            </div>
                                            <div className="hidden sm:block" />{' '}
                                            {/* espace vide pour alignement */}
                                            <div className="grid gap-2">
                                                <Label htmlFor="password">
                                                    Nouveau mot de passe
                                                </Label>
                                                <PasswordInput
                                                    id="password"
                                                    ref={passwordInput}
                                                    name="password"
                                                    className="h-10 rounded-xl"
                                                    autoComplete="new-password"
                                                    placeholder="••••••••"
                                                />
                                                <InputError
                                                    message={errors.password}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="password_confirmation">
                                                    Confirmer le mot de passe
                                                </Label>
                                                <PasswordInput
                                                    id="password_confirmation"
                                                    name="password_confirmation"
                                                    className="h-10 rounded-xl"
                                                    autoComplete="new-password"
                                                    placeholder="••••••••"
                                                />
                                                <InputError
                                                    message={
                                                        errors.password_confirmation
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 pt-2">
                                            <Button
                                                disabled={processing}
                                                className="rounded-xl bg-emerald-600 px-5 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 disabled:opacity-70"
                                            >
                                                Enregistrer
                                            </Button>
                                            <Transition
                                                show={recentlySuccessful}
                                                enter="transition ease-in-out duration-200"
                                                enterFrom="opacity-0"
                                                leave="transition ease-in-out duration-200"
                                                leaveTo="opacity-0"
                                            >
                                                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                                    ✅ Mot de passe mis à jour
                                                </p>
                                            </Transition>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </CardContent>
                    </Card>

                    {/* Carte : Authentification à deux facteurs */}
                    {canManageTwoFactor && (
                        <Card className="overflow-hidden border-0 bg-white/70 shadow-xl shadow-slate-200/20 backdrop-blur-xl dark:bg-slate-900/70 dark:shadow-black/20">
                            <div className="h-1 w-full bg-linear-to-r from-emerald-500 to-teal-500" />
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Smartphone className="h-5 w-5 text-emerald-500" />
                                    Authentification à deux facteurs
                                </CardTitle>
                                <CardDescription>
                                    Renforcez la sécurité de votre compte avec
                                    une deuxième étape de vérification.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/60">
                                        <div
                                            className={`flex h-10 w-10 items-center justify-center rounded-full ${twoFactorEnabled ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}
                                        >
                                            <ShieldCheck className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900 dark:text-slate-100">
                                                {twoFactorEnabled
                                                    ? "L'authentification à deux facteurs est activée."
                                                    : "L'authentification à deux facteurs n'est pas activée."}
                                            </p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                {twoFactorEnabled
                                                    ? 'Votre compte est protégé par une vérification supplémentaire.'
                                                    : 'Ajoutez une couche de protection supplémentaire.'}
                                            </p>
                                        </div>
                                    </div>

                                    {twoFactorEnabled ? (
                                        <div className="space-y-6 border-t border-slate-100 pt-6 dark:border-slate-800">
                                            {qrCodeSvg && (
                                                <div className="space-y-4">
                                                    <p className="text-sm text-slate-600 dark:text-slate-300">
                                                        Scannez le code QR
                                                        ci-dessous avec votre
                                                        application
                                                        d'authentification.
                                                    </p>
                                                    <div
                                                        className="inline-block rounded-lg bg-white p-3 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700"
                                                        dangerouslySetInnerHTML={{
                                                            __html: qrCodeSvg,
                                                        }}
                                                    />
                                                    {manualSetupKey && (
                                                        <div className="space-y-2">
                                                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                                                Clé de
                                                                configuration
                                                                manuelle :
                                                            </p>
                                                            <code className="inline-block rounded-lg bg-slate-100 px-3 py-2 font-mono text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                                {manualSetupKey}
                                                            </code>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <TwoFactorRecoveryCodes
                                                recoveryCodes={
                                                    recoveryCodesList
                                                }
                                                onRegenerate={
                                                    fetchRecoveryCodes
                                                }
                                                className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900/30 dark:bg-amber-900/10"
                                            />

                                            <div className="flex flex-wrap items-center gap-3">
                                                {!qrCodeSvg && (
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => {
                                                            fetchSetupData();
                                                            setShowSetupModal(
                                                                true,
                                                            );
                                                        }}
                                                        className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                                    >
                                                        Afficher le code QR
                                                    </Button>
                                                )}
                                                <Form
                                                    {...disable.form()}
                                                    options={{
                                                        onSuccess:
                                                            clearSetupData,
                                                    }}
                                                >
                                                    {({ processing }) => (
                                                        <Button
                                                            variant="destructive"
                                                            disabled={
                                                                processing
                                                            }
                                                            className="rounded-xl bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600"
                                                        >
                                                            Désactiver
                                                        </Button>
                                                    )}
                                                </Form>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="pt-2">
                                            <Button
                                                onClick={() => {
                                                    fetchSetupData();
                                                    setShowSetupModal(true);
                                                }}
                                                className="rounded-xl bg-emerald-600 px-5 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700"
                                            >
                                                Activer
                                            </Button>
                                        </div>
                                    )}

                                    <TwoFactorSetupModal
                                        isOpen={showSetupModal}
                                        onClose={() => setShowSetupModal(false)}
                                        qrCodeSvg={qrCodeSvg}
                                        manualSetupKey={manualSetupKey}
                                        errors={errors}
                                        requiresConfirmation={
                                            requiresConfirmation
                                        }
                                        onConfirm={(code) => {
                                            // gérer la confirmation
                                        }}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
