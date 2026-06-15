/* eslint-disable @typescript-eslint/no-unused-vars */
import { useForm, Head, Link, usePage } from '@inertiajs/react';
import {
    Camera,
    Mail,
    Phone,
    MapPin,
    Globe,
    Shield,
    LogOut,
    Trash2,
    AlertCircle,
    CheckCircle,
    User,
    Bell,
    Tag,
    Clock,
    X,
    Pencil,
} from 'lucide-react';
import { useState, useRef, useMemo } from 'react';
import { toast } from 'sonner';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { getToastStyles } from '@/lib/toast-style';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types';
import type { ProfilePageProps } from '@/types/page-props';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mon profil',
        href: ProfileController.edit.url(),
    },
];

const AVAILABLE_LOCALES = [
    { value: 'fr', label: 'Français' },
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
];

const AVAILABLE_CURRENCIES = [
    { value: 'XOF', label: 'F CFA (XOF)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'USD', label: 'US Dollar (USD)' },
];

export default function ClientProfile() {
    const { auth, mustVerifyEmail, status } = usePage<ProfilePageProps>().props;
    const user = auth.user;
    const client = auth.client;

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initialisation du formulaire avec useForm pour une réactivité totale
    const form = useForm({
        name: user.name || '',
        email: user.email || '',
        phone: client?.phone || user.preferences?.phone || '',
        city: client?.city || user.preferences?.city || '',
        country: client?.country || user.preferences?.country || '',
        locale: user.preferences?.locale || 'fr',
        currency: user.preferences?.currency || 'XOF',
        notifications_email: user.preferences?.notifications_email ?? true,
        notifications_offers: user.preferences?.notifications_offers ?? false,
        avatar: null as File | null,
    });

    const initials = useMemo(() => {
        return (form.data.name || '')
            .split(' ')
            .filter(Boolean)
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) || '?';
    }, [form.data.name]);

    const billingAddress = user.adresses?.find(
        (a) => a.type === 'facturation' && a.est_defaut,
    );
    const shippingAddress = user.adresses?.find(
        (a) => a.type === 'livraison' && a.est_defaut,
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Utilisation de post avec _method PATCH pour supporter l'upload de fichiers
        form.post(ProfileController.update.url({ query: { _method: 'PATCH' } }), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Modifications sauvegardées', {
                    style: getToastStyles('success'),
                });
                setPreviewUrl(null);
            },
        });
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            form.setData('avatar', file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result as string);
            reader.readAsDataURL(file);
            toast.success('Photo sélectionnée', {
                style: getToastStyles('success'),
            });
        }
    };

    const removeAvatar = () => {
        form.setData('avatar', null);
        setPreviewUrl(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        toast.info('Photo supprimée (à enregistrer)', {
            style: getToastStyles('info'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mon profil" />
            <SettingsLayout>
                <div className="mx-auto max-w-6xl space-y-8">
                    {/* Carte d'identité */}
                    <Card className="relative overflow-hidden border-0 shadow-xl shadow-emerald-100/20 dark:shadow-none">
                        <div className="relative h-32 bg-linear-to-br from-emerald-400 via-emerald-500 to-emerald-700 dark:from-emerald-800 dark:via-emerald-900 dark:to-slate-900">
                            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10 mix-blend-overlay" />
                            <div className="absolute -bottom-6 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-white p-1 shadow-2xl dark:bg-slate-900">
                                <Avatar className="h-full w-full ring-4 ring-white dark:ring-slate-900">
                                    <AvatarImage
                                        src={
                                            previewUrl ||
                                            user.avatar_url ||
                                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
                                        }
                                    />
                                    <AvatarFallback className="bg-emerald-500 text-2xl font-bold text-white">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                        </div>

                        <CardContent className="space-y-3 px-6 pt-16 pb-6 text-center">
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                                {form.data.name || user.name}
                            </h1>
                            <p className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                <Mail className="h-4 w-4" />
                                {user.email}
                            </p>

                            <div className="mt-4 flex justify-center">
                                {user.email_verified_at ? (
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/50 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                                        <CheckCircle className="h-3.5 w-3.5" />
                                        Email vérifié
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/50 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                                        <AlertCircle className="h-3.5 w-3.5" />
                                        Email non vérifié
                                    </span>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                            {/* Colonne principale : formulaire */}
                            <div className="space-y-8 lg:col-span-2">
                                <Card className="border-slate-200/60 shadow-md dark:border-slate-800">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center gap-2">
                                            <User className="h-5 w-5 text-emerald-500" />{' '}
                                            Informations personnelles
                                        </CardTitle>
                                        <CardDescription>
                                            Gérez vos coordonnées et votre identité.
                                        </CardDescription>
                                    </CardHeader>

                                    <CardContent className="space-y-6">
                                        <div className="flex justify-center gap-3 pb-4">
                                            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-emerald-200/50 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/20">
                                                <Camera className="h-4 w-4" />
                                                Changer la photo
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handleAvatarChange}
                                                />
                                            </label>
                                            {(previewUrl || user.avatar_url) && (
                                                <button
                                                    type="button"
                                                    onClick={removeAvatar}
                                                    className="inline-flex items-center gap-2 rounded-lg border border-red-200/50 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                                                >
                                                    <X className="h-4 w-4" />
                                                    Supprimer
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid gap-6 sm:grid-cols-2">
                                            <Field
                                                icon={<User className="h-4 w-4" />}
                                                label="Nom complet"
                                                id="name"
                                                value={form.data.name}
                                                onChange={(e) => form.setData('name', e.target.value)}
                                                required
                                                autoComplete="name"
                                                error={form.errors.name}
                                            />
                                            <Field
                                                icon={<Mail className="h-4 w-4" />}
                                                label="Adresse email"
                                                id="email"
                                                type="email"
                                                value={form.data.email}
                                                onChange={(e) => form.setData('email', e.target.value)}
                                                required
                                                autoComplete="email"
                                                error={form.errors.email}
                                            />
                                            <Field
                                                icon={<Phone className="h-4 w-4" />}
                                                label="Téléphone"
                                                id="phone"
                                                value={form.data.phone}
                                                onChange={(e) => form.setData('phone', e.target.value)}
                                                autoComplete="tel"
                                                error={form.errors.phone}
                                            />
                                            <Field
                                                icon={<MapPin className="h-4 w-4" />}
                                                label="Ville"
                                                id="city"
                                                value={form.data.city}
                                                onChange={(e) => form.setData('city', e.target.value)}
                                                error={form.errors.city}
                                            />
                                            <div className="sm:col-span-2">
                                                <Field
                                                    icon={<MapPin className="h-4 w-4" />}
                                                    label="Pays"
                                                    id="country"
                                                    value={form.data.country}
                                                    onChange={(e) => form.setData('country', e.target.value)}
                                                    error={form.errors.country}
                                                />
                                            </div>
                                        </div>

                                        {mustVerifyEmail && !user.email_verified_at && (
                                            <div className="flex gap-3 rounded-xl border border-amber-200/60 bg-amber-50 p-4 dark:bg-amber-500/5">
                                                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                                                <div className="space-y-1 text-sm">
                                                    <p className="font-medium text-amber-900 dark:text-amber-200">
                                                        Vérification d’email requise
                                                    </p>
                                                    <p className="text-amber-800 dark:text-amber-300/80">
                                                        Pour débloquer toutes les fonctionnalités, vérifiez votre adresse email.
                                                    </p>
                                                    <Link
                                                        href={route('verification.send')}
                                                        method="post"
                                                        as="button"
                                                        className="inline-block text-xs font-semibold text-amber-600 underline transition-colors hover:text-amber-800"
                                                    >
                                                        Renvoyer le lien de vérification
                                                    </Link>
                                                    {status === 'verification-link-sent' && (
                                                        <p className="mt-1 flex items-center gap-1 text-xs text-emerald-600">
                                                            <CheckCircle className="h-3 w-3" /> Lien envoyé
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-4 border-t border-slate-100 pt-4 dark:border-slate-800">
                                            <Button
                                                type="submit"
                                                disabled={form.processing}
                                                className="gap-2 bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 disabled:opacity-70"
                                            >
                                                {form.processing ? (
                                                    <>
                                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                                        Enregistrement...
                                                    </>
                                                ) : (
                                                    'Enregistrer les modifications'
                                                )}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Colonne latérale */}
                            <div className="space-y-8">
                                {/* Régionalisation */}
                                <Card className="border-slate-200/60 shadow-md dark:border-slate-800">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center gap-2">
                                            <Globe className="h-5 w-5 text-emerald-500" />{' '}
                                            Régionalisation
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Langue</Label>
                                            <Select
                                                value={form.data.locale}
                                                onValueChange={(v) => form.setData('locale', v)}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Choisir une langue" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {AVAILABLE_LOCALES.map((opt) => (
                                                        <SelectItem key={opt.value} value={opt.value}>
                                                            {opt.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Devise</Label>
                                            <Select
                                                value={form.data.currency}
                                                onValueChange={(v) => form.setData('currency', v)}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Choisir une devise" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {AVAILABLE_CURRENCIES.map((opt) => (
                                                        <SelectItem key={opt.value} value={opt.value}>
                                                            {opt.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Notifications */}
                                <Card className="border-slate-200/60 shadow-md dark:border-slate-800">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center gap-2">
                                            <Bell className="h-5 w-5 text-emerald-500" />{' '}
                                            Notifications
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <ToggleItem
                                            icon={<Bell className="h-5 w-5" />}
                                            title="Notifications email"
                                            description="Commandes et messages"
                                            checked={form.data.notifications_email}
                                            onCheckedChange={(v) => form.setData('notifications_email', v)}
                                        />
                                        <ToggleItem
                                            icon={<Tag className="h-5 w-5" />}
                                            title="Offres promotionnelles"
                                            description="Réductions exclusives"
                                            checked={form.data.notifications_offers}
                                            onCheckedChange={(v) => form.setData('notifications_offers', v)}
                                        />
                                    </CardContent>
                                </Card>

                                {/* Adresses */}
                                <Card className="border-slate-200/60 shadow-md dark:border-slate-800">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center gap-2">
                                            <MapPin className="h-5 w-5 text-emerald-500" />{' '}
                                            Adresses
                                        </CardTitle>
                                        <CardDescription>
                                            Adresses de facturation et de livraison par défaut.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {billingAddress ? (
                                            <AddressCard
                                                type="Facturation"
                                                address={billingAddress}
                                                icon={<Shield className="h-4 w-4" />}
                                            />
                                        ) : (
                                            <p className="text-sm italic text-slate-500">
                                                Aucune adresse de facturation
                                            </p>
                                        )}
                                        {shippingAddress ? (
                                            <AddressCard
                                                type="Livraison"
                                                address={shippingAddress}
                                                icon={<MapPin className="h-4 w-4" />}
                                            />
                                        ) : (
                                            <p className="text-sm italic text-slate-500">
                                                Aucune adresse de livraison
                                            </p>
                                        )}
                                        <Link
                                            href={route('tenant.addresses.index')}
                                            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:underline"
                                        >
                                            <Pencil className="h-4 w-4" />
                                            Gérer les adresses
                                        </Link>
                                    </CardContent>
                                </Card>

                                {/* Zone de danger */}
                                <Card className="border-red-200/50 shadow-md dark:border-red-900/30">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center gap-2 text-red-600">
                                            <Trash2 className="h-5 w-5" /> Zone de danger
                                        </CardTitle>
                                        <CardDescription>Actions irréversibles.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="inline-flex w-full items-center gap-2 rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            Déconnexion
                                        </Link>
                                        <DeleteUser />
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}

/* ----- Composants réutilisables ----- */
function Field({
    icon,
    label,
    id,
    className = '',
    error,
    ...inputProps
}: {
    icon: React.ReactNode;
    label: string;
    id: string;
    className?: string;
    error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div className={`space-y-2 ${className}`}>
            <Label htmlFor={id} className={error ? 'text-red-500' : ''}>
                {label}
            </Label>
            <div className="relative">
                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400">
                    {icon}
                </span>
                <Input
                    id={id}
                    className={cn(
                        'h-11 border-slate-200 bg-white pl-10 transition-colors hover:border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-900',
                        error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
                    )}
                    {...inputProps}
                />
            </div>
            {error && <InputError message={error} />}
        </div>
    );
}

function ToggleItem({
    icon,
    title,
    description,
    checked,
    onCheckedChange,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
}) {
    return (
        <div className="group flex items-center justify-between rounded-xl border border-slate-200 p-4 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/40">
            <div className="flex items-start gap-3">
                <span className="mt-0.5 text-slate-400 transition-colors group-hover:text-emerald-500 dark:text-slate-500">
                    {icon}
                </span>
                <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {title}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {description}
                    </p>
                </div>
            </div>
            <Switch checked={checked} onCheckedChange={onCheckedChange} />
        </div>
    );
}

function AddressCard({
    type,
    address,
    icon,
}: {
    type: string;
    address: { rue: string; code_postal: string; ville: string; pays?: string };
    icon: React.ReactNode;
}) {
    return (
        <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                {icon} {type}
            </p>
            <p className="mt-1 text-sm text-slate-900 dark:text-slate-100">
                {address.rue}, {address.code_postal} {address.ville}
            </p>
            {address.pays && <p className="text-xs text-slate-500">{address.pays}</p>}
        </div>
    );
}
