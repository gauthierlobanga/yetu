import { Transition } from '@headlessui/react';
import { Form, Head } from '@inertiajs/react';
import { ShieldCheck, KeyRound, Smartphone } from 'lucide-react';
import { useRef, useState } from 'react';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import Heading from '@/components/heading';
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
            <h1 className="sr-only">Paramètres de sécurité</h1>

            <SettingsLayout>
                <div className="max-w-4xl space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <KeyRound className="h-5 w-5 text-emerald-500" />
                                Mettre à jour le mot de passe
                            </CardTitle>
                            <CardDescription>
                                Assurez-vous que votre compte utilise un mot de
                                passe long et aléatoire pour rester sécurisé.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <Form
                                {...SecurityController.update.form()}
                                options={{
                                    preserveScroll: true,
                                }}
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
                                        <div className="grid gap-2">
                                            <Label htmlFor="current_password">
                                                Mot de passe actuel
                                            </Label>
                                            <PasswordInput
                                                id="current_password"
                                                ref={currentPasswordInput}
                                                name="current_password"
                                                className="h-10 w-full"
                                                autoComplete="current-password"
                                                placeholder="Mot de passe actuel"
                                            />
                                            <InputError
                                                message={
                                                    errors.current_password
                                                }
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="password">
                                                Nouveau mot de passe
                                            </Label>
                                            <PasswordInput
                                                id="password"
                                                ref={passwordInput}
                                                name="password"
                                                className="h-10 w-full"
                                                autoComplete="new-password"
                                                placeholder="Nouveau mot de passe"
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
                                                className="h-10 w-full"
                                                autoComplete="new-password"
                                                placeholder="Confirmer le mot de passe"
                                            />
                                            <InputError
                                                message={
                                                    errors.password_confirmation
                                                }
                                            />
                                        </div>

                                        <div className="flex items-center gap-4 pt-4">
                                            <Button
                                                disabled={processing}
                                                className="bg-emerald-600 hover:bg-emerald-700"
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
                                                    ? Enregistré
                                                </p>
                                            </Transition>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </CardContent>
                    </Card>

                    {canManageTwoFactor && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Smartphone className="h-5 w-5 text-emerald-500" />
                                    Authentification à deux facteurs
                                </CardTitle>
                                <CardDescription>
                                    Ajoutez une sécurité supplémentaire à votre
                                    compte en utilisant l'authentification à
                                    deux facteurs.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                        {twoFactorEnabled
                                            ? "L'authentification à deux facteurs est activée."
                                            : "L'authentification à deux facteurs n'est pas activée."}
                                    </h3>

                                    <p className="max-w-xl text-sm text-slate-500 dark:text-slate-400">
                                        Lorsque l'authentification à deux
                                        facteurs est activée, vous serez invité
                                        à saisir un jeton sécurisé et aléatoire
                                        lors de l'authentification. Vous pouvez
                                        récupérer ce jeton via l'application
                                        Google Authenticator sur votre
                                        téléphone.
                                    </p>

                                    {twoFactorEnabled ? (
                                        <div className="space-y-6 border-t border-slate-200 pt-4 dark:border-slate-800">
                                            {qrCodeSvg && (
                                                <div>
                                                    <p className="mb-4 text-sm font-semibold text-slate-900 dark:text-slate-100">
                                                        L'authentification à
                                                        deux facteurs est
                                                        maintenant activée.
                                                        Scannez le code QR
                                                        suivant avec votre
                                                        application
                                                        d'authentification ou
                                                        entrez la clé de
                                                        configuration.
                                                    </p>

                                                    <div
                                                        className="inline-block rounded-lg bg-white p-2 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10"
                                                        dangerouslySetInnerHTML={{
                                                            __html: qrCodeSvg,
                                                        }}
                                                    />

                                                    {manualSetupKey && (
                                                        <div className="mt-4">
                                                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                                                Clé de
                                                                configuration :
                                                            </p>
                                                            <p className="mt-1 inline-block rounded bg-slate-100 px-2 py-1 font-mono text-sm dark:bg-slate-800">
                                                                {manualSetupKey}
                                                            </p>
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
                                                className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/30 dark:bg-amber-900/10"
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
                                                        >
                                                            Désactiver
                                                        </Button>
                                                    )}
                                                </Form>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="pt-4">
                                            <Button
                                                onClick={() => {
                                                    fetchSetupData();
                                                    setShowSetupModal(true);
                                                }}
                                                className="bg-emerald-600 hover:bg-emerald-700"
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
                                            // Handle confirmation logic
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
