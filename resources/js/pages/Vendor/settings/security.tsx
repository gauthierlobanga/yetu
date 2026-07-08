import { Transition } from '@headlessui/react';
import { Form, Head } from '@inertiajs/react';
import { ShieldCheck } from 'lucide-react';
import { useRef, useState } from 'react';
import ParametresSecurityController from '@/actions/App/Http/Controllers/Vendor/Settings/ParametresSecurityController';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { SiteHeader } from '@/components/site-header';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { VendorSidebar } from '@/components/VendorSidebar';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import SettingsLayout from '@/layouts/Vendor/settings/layout';
import { disable, enable } from '@/routes/two-factor';
import type { Tenant } from '@/types/tenants/products/vendor/tenant';

type Props = {
    canManageTwoFactor?: boolean;
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
    tenant: Tenant;
};

export default function Security({
    canManageTwoFactor = false,
    requiresConfirmation = false,
    twoFactorEnabled = false,
    tenant,
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
        <SidebarProvider
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 72)',
                    '--header-height': 'calc(var(--spacing) * 12)',
                } as React.CSSProperties
            }
        >
            <Head title={`Sécurité - ${tenant.raison_sociale}`} />
            <VendorSidebar tenant={tenant} />
            <SidebarInset>
                <SiteHeader />
                <SettingsLayout>
                    <div className="space-y-8">
                        {/* Carte : Mise à jour du mot de passe */}
                        <div className="rounded-2xl border border-tr bg-white/60 p-6 shadow-lg backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/60 dark:shadow-black/20">
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                                    Modifier le mot de passe
                                </h2>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    Utilisez un mot de passe long et unique pour
                                    sécuriser votre compte.
                                </p>
                            </div>

                            <Form
                                {...ParametresSecurityController.update.form()}
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
                                        <div className="grid gap-6">
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
                                            <div className="hidden sm:block" />
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
                        </div>

                        {/* Carte : Authentification à deux facteurs */}
                        {canManageTwoFactor && (
                            <div className="rounded-2xl border border-white/40 bg-white/60 p-6 shadow-lg backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/60 dark:shadow-black/20">
                                <div className="mb-6">
                                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                                        Authentification à deux facteurs
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                        Renforcez la sécurité de votre compte
                                        avec une deuxième étape de vérification.
                                    </p>
                                </div>

                                {twoFactorEnabled ? (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/60">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                <ShieldCheck className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-slate-100">
                                                    L'authentification à deux
                                                    facteurs est activée.
                                                </p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                                    Votre compte est protégé par
                                                    une vérification
                                                    supplémentaire.
                                                </p>
                                            </div>
                                        </div>

                                        <TwoFactorRecoveryCodes
                                            recoveryCodesList={
                                                recoveryCodesList
                                            }
                                            fetchRecoveryCodes={
                                                fetchRecoveryCodes
                                            }
                                            errors={errors}
                                        />

                                        <div className="flex flex-wrap gap-3">
                                            <Form {...disable.form()}>
                                                {({ processing }) => (
                                                    <Button
                                                        variant="destructive"
                                                        type="submit"
                                                        disabled={processing}
                                                        className="rounded-xl bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600"
                                                    >
                                                        Désactiver
                                                    </Button>
                                                )}
                                            </Form>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Lorsque vous activez
                                            l'authentification à deux facteurs,
                                            un code sécurisé vous sera demandé
                                            lors de la connexion. Ce code peut
                                            être généré par une application TOTP
                                            sur votre téléphone.
                                        </p>

                                        <div>
                                            {hasSetupData ? (
                                                <Button
                                                    onClick={() =>
                                                        setShowSetupModal(true)
                                                    }
                                                    className="rounded-xl bg-emerald-600 px-5 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700"
                                                >
                                                    <ShieldCheck className="mr-2 h-4 w-4" />
                                                    Continuer la configuration
                                                </Button>
                                            ) : (
                                                <Form
                                                    {...enable.form()}
                                                    onSuccess={() =>
                                                        setShowSetupModal(true)
                                                    }
                                                >
                                                    {({ processing }) => (
                                                        <Button
                                                            type="submit"
                                                            disabled={
                                                                processing
                                                            }
                                                            className="rounded-xl bg-emerald-600 px-5 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700"
                                                        >
                                                            Activer 2FA
                                                        </Button>
                                                    )}
                                                </Form>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <TwoFactorSetupModal
                                    isOpen={showSetupModal}
                                    onClose={() => setShowSetupModal(false)}
                                    requiresConfirmation={requiresConfirmation}
                                    twoFactorEnabled={twoFactorEnabled}
                                    qrCodeSvg={qrCodeSvg}
                                    manualSetupKey={manualSetupKey}
                                    clearSetupData={clearSetupData}
                                    fetchSetupData={fetchSetupData}
                                    errors={errors}
                                />
                            </div>
                        )}
                    </div>
                </SettingsLayout>
            </SidebarInset>
        </SidebarProvider>
    );
}
