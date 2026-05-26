/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/pages/Shop/Addresses/Index.tsx
import type { PageProps } from '@inertiajs/core';
import { router, useForm, usePage, Head } from '@inertiajs/react';
import {
    MapPin,
    Plus,
    Check,
    Star,
    Home,
    Briefcase,
    Trash2,
    Sparkles,
    Phone,
    Globe,
    Building2,
    Landmark,
    CheckCircle2,
    PackageCheck,
    MapPinned,
} from 'lucide-react';
import { toast } from 'sonner';

import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import tenant from '@/routes/tenant';

// ---------- Types ----------
interface Address {
    id: string;
    rue: string;
    complement?: string | null;
    code_postal: string;
    ville: string;
    pays: string;
    telephone?: string | null;
    type: 'facturation' | 'livraison';
    est_defaut: boolean;
    adresse_complete?: string;
}

interface Props extends PageProps {
    addresses: Address[];
}

// ---------- Page ----------
export default function ShopAddressesPage() {
    const { addresses } = usePage<Props>().props;
    const form = useForm({
        rue: '',
        complement: '',
        code_postal: '',
        ville: '',
        pays: '',
        telephone: '',
        type: 'livraison' as 'livraison' | 'facturation',
        est_defaut: false,
    });

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.preventDefault();

        if (confirm('Supprimer cette adresse ?')) {
            router.delete(route('addresses.destroy', id), {
                preserveScroll: true,
                onSuccess: () => toast.success('Adresse supprimée'),
                onError: () => toast.error('Erreur lors de la suppression'),
            });
        }
    };

    const handleSetDefault = (id: string) => {
        router.post(
            route('addresses.default', id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => toast.success('Adresse par défaut modifiée'),
            },
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(route('addresses.store'), {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                toast.success('Adresse enregistrée');
            },
            onError: () => toast.error('Veuillez vérifier les champs'),
        });
    };

    const livraisonAddresses = addresses.filter((a) => a.type === 'livraison');
    const facturationAddresses = addresses.filter(
        (a) => a.type === 'facturation',
    );

    return (
        <SidebarProvider
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 72)',
                    '--header-height': 'calc(var(--spacing) * 12)',
                } as React.CSSProperties
            }
        >
            <Head title="Mes adresses" />
            <AppSidebar />
            <SidebarInset>
                <SiteHeader />
                <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                    <div className="flex flex-1 flex-col gap-6 p-4 pt-6 md:p-6 md:pt-6">
                        {/* En-tête */}
                        <div className="relative overflow-hidden rounded-lg border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/70">
                            {/* Effet subtil de glow émeraude */}
                            <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-transparent dark:from-emerald-500/10" />

                            <div className="relative z-10 flex flex-col gap-6 p-8 lg:flex-row lg:items-center lg:justify-between">
                                <div className="max-w-2xl">
                                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400">
                                        <MapPin className="h-4 w-4" />
                                        Gestion des adresses
                                    </div>

                                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl dark:text-white">
                                        Mes adresses
                                    </h1>

                                    <p className="mt-3 max-w-md text-slate-500 dark:text-slate-400">
                                        Gérez facilement vos adresses de
                                        livraison et de facturation avec une
                                        expérience moderne et sécurisée.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/30">
                                            <MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                Total adresses
                                            </p>
                                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                                {addresses.length}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/60">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/30">
                                            <Home className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                Adresse principale
                                            </p>
                                            <p className="text-xl font-bold text-slate-900 dark:text-white">
                                                {addresses.find(
                                                    (a) => a.est_defaut,
                                                )?.ville ?? 'Aucune'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Grille principale */}
                        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                            {/* Liste des adresses */}
                            <div className="space-y-6">
                                {/* Livraison */}
                                <Card className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                                            <Home className="h-5 w-5 text-emerald-500" />
                                            Adresses de livraison
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {livraisonAddresses.length > 0 ? (
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                {livraisonAddresses.map(
                                                    (address) => (
                                                        <div
                                                            key={address.id}
                                                            className="group relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white/90 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-2xl dark:border-slate-800/60 dark:bg-slate-900/80"
                                                        >
                                                            {/* Glow */}
                                                            <div className="absolute inset-0 bg-linear-to-br from-emerald-500/0 via-emerald-500/0 to-cyan-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                                                            {/* Badge principal */}
                                                            {address.est_defaut && (
                                                                <div className="absolute top-4 right-4">
                                                                    <div className="flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-white shadow-lg">
                                                                        <Star className="h-3.5 w-3.5 fill-white" />
                                                                        Principale
                                                                    </div>
                                                                </div>
                                                            )}

                                                            <div className="relative z-10">
                                                                <div className="mb-5 flex items-start justify-between">
                                                                    <div className="flex items-center gap-3">
                                                                        <div
                                                                            className={cn(
                                                                                'flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg',
                                                                                address.type ===
                                                                                    'livraison'
                                                                                    ? 'bg-linear-to-br from-emerald-500 to-teal-500'
                                                                                    : 'bg-linear-to-br from-blue-500 to-indigo-500',
                                                                            )}
                                                                        >
                                                                            {address.type ===
                                                                            'livraison' ? (
                                                                                <Home className="h-6 w-6 text-white" />
                                                                            ) : (
                                                                                <Briefcase className="h-6 w-6 text-white" />
                                                                            )}
                                                                        </div>

                                                                        <div>
                                                                            <h3 className="font-bold text-slate-900 dark:text-white">
                                                                                {address.type ===
                                                                                'livraison'
                                                                                    ? 'Adresse de livraison'
                                                                                    : 'Adresse de facturation'}
                                                                            </h3>

                                                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                                                {
                                                                                    address.ville
                                                                                }

                                                                                ,{' '}
                                                                                {
                                                                                    address.pays
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-3">
                                                                    <div className="flex items-start gap-3">
                                                                        <MapPinned className="mt-0.5 h-4 w-4 text-slate-400" />

                                                                        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                                                                            {address.adresse_complete ??
                                                                                `${address.rue}, ${address.code_postal} ${address.ville}, ${address.pays}`}
                                                                        </p>
                                                                    </div>

                                                                    {address.telephone && (
                                                                        <div className="flex items-center gap-3">
                                                                            <Phone className="h-4 w-4 text-slate-400" />

                                                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                                                {
                                                                                    address.telephone
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="mt-6 flex flex-wrap gap-3">
                                                                    {!address.est_defaut && (
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            className="rounded-2xl border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400"
                                                                            onClick={() =>
                                                                                handleSetDefault(
                                                                                    address.id,
                                                                                )
                                                                            }
                                                                        >
                                                                            <CheckCircle2 className="mr-2 h-4 w-4" />
                                                                            Définir
                                                                            principale
                                                                        </Button>
                                                                    )}

                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="rounded-2xl border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-800 dark:bg-red-950/20 dark:text-red-400"
                                                                        onClick={(
                                                                            e,
                                                                        ) =>
                                                                            handleDelete(
                                                                                address.id,
                                                                                e,
                                                                            )
                                                                        }
                                                                    >
                                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                                        Supprimer
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        ) : (
                                            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center dark:border-slate-800">
                                                <MapPin className="mx-auto h-8 w-8 text-slate-400" />
                                                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                                    Aucune adresse de livraison
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Facturation */}
                                <Card className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                                            <Briefcase className="h-5 w-5 text-blue-500" />
                                            Adresses de facturation
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {facturationAddresses.length > 0 ? (
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                {facturationAddresses.map(
                                                    (address) => (
                                                        <div
                                                            key={address.id}
                                                            className="group relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white/90 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-2xl dark:border-slate-800/60 dark:bg-slate-900/80"
                                                        >
                                                            {/* Glow */}
                                                            <div className="absolute inset-0 bg-linear-to-br from-emerald-500/0 via-emerald-500/0 to-cyan-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                                                            {/* Badge principal */}
                                                            {address.est_defaut && (
                                                                <div className="absolute top-4 right-4">
                                                                    <div className="flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-white shadow-lg">
                                                                        <Star className="h-3.5 w-3.5 fill-white" />
                                                                        Principale
                                                                    </div>
                                                                </div>
                                                            )}

                                                            <div className="relative z-10">
                                                                <div className="mb-5 flex items-start justify-between">
                                                                    <div className="flex items-center gap-3">
                                                                        <div
                                                                            className={cn(
                                                                                'flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg',
                                                                                address.type ===
                                                                                    'livraison'
                                                                                    ? 'bg-linear-to-br from-emerald-500 to-teal-500'
                                                                                    : 'bg-linear-to-br from-blue-500 to-indigo-500',
                                                                            )}
                                                                        >
                                                                            {address.type ===
                                                                            'livraison' ? (
                                                                                <Home className="h-6 w-6 text-white" />
                                                                            ) : (
                                                                                <Briefcase className="h-6 w-6 text-white" />
                                                                            )}
                                                                        </div>

                                                                        <div>
                                                                            <h3 className="font-bold text-slate-900 dark:text-white">
                                                                                {address.type ===
                                                                                'livraison'
                                                                                    ? 'Adresse de livraison'
                                                                                    : 'Adresse de facturation'}
                                                                            </h3>

                                                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                                                {
                                                                                    address.ville
                                                                                }

                                                                                ,{' '}
                                                                                {
                                                                                    address.pays
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-3">
                                                                    <div className="flex items-start gap-3">
                                                                        <MapPinned className="mt-0.5 h-4 w-4 text-slate-400" />

                                                                        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                                                                            {address.adresse_complete ??
                                                                                `${address.rue}, ${address.code_postal} ${address.ville}, ${address.pays}`}
                                                                        </p>
                                                                    </div>

                                                                    {address.telephone && (
                                                                        <div className="flex items-center gap-3">
                                                                            <Phone className="h-4 w-4 text-slate-400" />

                                                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                                                {
                                                                                    address.telephone
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="mt-6 flex flex-wrap gap-3">
                                                                    {!address.est_defaut && (
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            className="rounded-2xl border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400"
                                                                            onClick={() =>
                                                                                handleSetDefault(
                                                                                    address.id,
                                                                                )
                                                                            }
                                                                        >
                                                                            <CheckCircle2 className="mr-2 h-4 w-4" />
                                                                            Définir
                                                                            principale
                                                                        </Button>
                                                                    )}

                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="rounded-2xl border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-800 dark:bg-red-950/20 dark:text-red-400"
                                                                        onClick={(
                                                                            e,
                                                                        ) =>
                                                                            handleDelete(
                                                                                address.id,
                                                                                e,
                                                                            )
                                                                        }
                                                                    >
                                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                                        Supprimer
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        ) : (
                                            <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center dark:border-slate-800">
                                                <Briefcase className="mx-auto h-8 w-8 text-slate-400" />
                                                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                                    Aucune adresse de
                                                    facturation
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Formulaire d'ajout */}
                            <Card className="h-fit rounded-2xl border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/70">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                                        <Plus className="h-5 w-5 text-emerald-500" />
                                        Nouvelle adresse
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form
                                        onSubmit={handleSubmit}
                                        className="space-y-5"
                                    >
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                Adresse
                                            </label>

                                            <div className="relative">
                                                <MapPin className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                                <Input
                                                    value={form.data.rue}
                                                    onChange={(e) =>
                                                        form.setData(
                                                            'rue',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Ex : 24 Avenue de la Paix"
                                                    required
                                                    className="h-12 rounded-2xl border-slate-200 pl-11 shadow-sm focus-visible:ring-emerald-500 dark:border-slate-700"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                Complément
                                            </label>

                                            <div className="relative">
                                                <Building2 className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                                <Input
                                                    value={form.data.complement}
                                                    onChange={(e) =>
                                                        form.setData(
                                                            'complement',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Appartement, étage..."
                                                    className="h-12 rounded-2xl border-slate-200 pl-11 shadow-sm dark:border-slate-700"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="relative">
                                                <Landmark className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                                <Input
                                                    value={
                                                        form.data.code_postal
                                                    }
                                                    onChange={(e) =>
                                                        form.setData(
                                                            'code_postal',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Code postal"
                                                    required
                                                    className="h-12 rounded-2xl border-slate-200 pl-11 shadow-sm dark:border-slate-700"
                                                />
                                            </div>

                                            <div className="relative">
                                                <MapPinned className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                                <Input
                                                    value={form.data.ville}
                                                    onChange={(e) =>
                                                        form.setData(
                                                            'ville',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Ville"
                                                    required
                                                    className="h-12 rounded-2xl border-slate-200 pl-11 shadow-sm dark:border-slate-700"
                                                />
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <Globe className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                            <Input
                                                value={form.data.pays}
                                                onChange={(e) =>
                                                    form.setData(
                                                        'pays',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Pays"
                                                required
                                                className="h-12 rounded-2xl border-slate-200 pl-11 shadow-sm dark:border-slate-700"
                                            />
                                        </div>

                                        <div className="relative">
                                            <Phone className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                            <Input
                                                value={form.data.telephone}
                                                onChange={(e) =>
                                                    form.setData(
                                                        'telephone',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Téléphone"
                                                className="h-12 rounded-2xl border-slate-200 pl-11 shadow-sm dark:border-slate-700"
                                            />
                                        </div>

                                        {/* Sélecteur moderne */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    form.setData(
                                                        'type',
                                                        'livraison',
                                                    )
                                                }
                                                className={cn(
                                                    'rounded-2xl border p-4 text-left transition-all',
                                                    form.data.type ===
                                                        'livraison'
                                                        ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/10 dark:bg-emerald-950/20'
                                                        : 'border-slate-200 hover:border-slate-300 dark:border-slate-700',
                                                )}
                                            >
                                                <Home className="mb-2 h-5 w-5 text-emerald-500" />

                                                <p className="font-semibold text-slate-900 dark:text-white">
                                                    Livraison
                                                </p>

                                                <p className="text-xs text-slate-500">
                                                    Pour recevoir vos colis
                                                </p>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    form.setData(
                                                        'type',
                                                        'facturation',
                                                    )
                                                }
                                                className={cn(
                                                    'rounded-2xl border p-4 text-left transition-all',
                                                    form.data.type ===
                                                        'facturation'
                                                        ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/10 dark:bg-blue-950/20'
                                                        : 'border-slate-200 hover:border-slate-300 dark:border-slate-700',
                                                )}
                                            >
                                                <Briefcase className="mb-2 h-5 w-5 text-blue-500" />

                                                <p className="font-semibold text-slate-900 dark:text-white">
                                                    Facturation
                                                </p>

                                                <p className="text-xs text-slate-500">
                                                    Pour vos factures
                                                </p>
                                            </button>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={form.processing}
                                            className="h-12 w-full rounded-2xl bg-linear-to-r from-emerald-600 via-teal-500 to-cyan-500 text-base font-semibold text-white shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] hover:from-emerald-700 hover:to-cyan-600"
                                        >
                                            <PackageCheck className="mr-2 h-5 w-5" />

                                            {form.processing
                                                ? 'Enregistrement...'
                                                : 'Enregistrer l’adresse'}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
