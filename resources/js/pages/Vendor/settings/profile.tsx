import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { VendorSidebar } from '@/components/VendorSidebar';
import SettingsLayout from '@/layouts/Vendor/settings/layout';
import type { Tenant } from '@/types/tenants/products/vendor/tenant';

export default function Profile({
    tenant,
    mustVerifyEmail,
    status,
}: {
    tenant: Tenant;
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage().props;

    return (
        <SidebarProvider
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 72)',
                    '--header-height': 'calc(var(--spacing) * 12)',
                } as React.CSSProperties
            }
        >
            <Head title={`Profil - ${tenant.raison_sociale}`} />
            <VendorSidebar tenant={tenant} />
            <SidebarInset>
                <SiteHeader />
                <SettingsLayout>
                    <div className="space-y-6">
                        <Heading
                            variant="small"
                            title="Informations du profil"
                            description="Mettez à jour votre nom et votre adresse email"
                        />
                        <Form
                            method="patch"
                            action={route('tenant.settings.profile.update')}
                            className="space-y-6"
                            preserveScroll
                        >
                            {({ processing, recentlySuccessful, errors }) => {
                                return (
                                    <>
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">
                                                Nom complet
                                            </Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                defaultValue={auth.user?.name}
                                                required
                                                autoComplete="name"
                                                placeholder="Votre nom"
                                            />
                                            <InputError message={errors.name} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                defaultValue={auth.user?.email}
                                                required
                                                autoComplete="email"
                                                placeholder="exemple@email.com"
                                            />
                                            <InputError
                                                message={errors.email}
                                            />
                                        </div>
                                        {mustVerifyEmail &&
                                            !auth.user?.email_verified_at && (
                                                <div className="text-sm text-amber-600">
                                                    Votre adresse email n'est
                                                    pas vérifiée.{' '}
                                                    <Link
                                                        href={route(
                                                            'verification.send',
                                                        )}
                                                        method="post"
                                                        as="button"
                                                        className="underline"
                                                    >
                                                        Renvoyer le lien de
                                                        vérification
                                                    </Link>
                                                    {status ===
                                                        'verification-link-sent' && (
                                                        <span className="ml-2 text-green-600">
                                                            Un nouveau lien a
                                                            été envoyé.
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        <div className="flex items-center gap-4">
                                            <Button disabled={processing}>
                                                Enregistrer
                                            </Button>
                                            <Transition
                                                show={recentlySuccessful}
                                                enter="transition ease-in-out"
                                                enterFrom="opacity-0"
                                                leave="transition ease-in-out"
                                                leaveTo="opacity-0"
                                            >
                                                <p className="text-sm text-emerald-600">
                                                    Sauvegardé
                                                </p>
                                            </Transition>
                                        </div>
                                    </>
                                );
                            }}
                        </Form>
                    </div>
                </SettingsLayout>
            </SidebarInset>
        </SidebarProvider>
    );
}
