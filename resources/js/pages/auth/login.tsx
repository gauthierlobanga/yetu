import { Form, Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Mail,
    Lock,
    ArrowRight,
    Sparkles,
    ShieldCheck,
    KeyRound,
} from 'lucide-react';

import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { SocialLoginButtons } from '@/components/social-login-buttons';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

import { useTenant } from '@/hooks/useTenant';
import AuthLayout from '@/layouts/auth-layout';
import { register as centralRegister } from '@/routes/central';
import { request as centralPasswordRequest } from '@/routes/central/password';
import { store } from '@/routes/login';
import { register as tenantRegister } from '@/routes/tenant';
import { request as tenantPasswordRequest } from '@/routes/tenant/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    const { isTenant } = useTenant();
    const passwordRequest = isTenant
        ? tenantPasswordRequest()
        : centralPasswordRequest();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const registerLink = (isTenant ? tenantRegister() : centralRegister()).url;

    return (
        <AuthLayout
            title={isTenant ? 'Connexion client' : 'Bon retour'}
            description={
                isTenant
                    ? 'Connectez-vous pour retrouver vos commandes, vos favoris et finaliser vos achats.'
                    : 'Connectez-vous pour accéder à votre espace vendeur et gérer votre boutique.'
            }
        >
            <Head title="Connexion" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="space-y-8"
            >
                {({ processing, errors }) => (
                    <>
                        {/* Badge de confiance */}
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="flex justify-center"
                        >
                            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-emerald-700 backdrop-blur-xl dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                Connexion sécurisée
                            </div>
                        </motion.div>

                        {/* Message de statut */}
                        {status && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-700 backdrop-blur-xl dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300"
                            >
                                {status}
                            </motion.div>
                        )}

                        {/* Carte formulaire */}
                        <div className="relative space-y-6">
                            {/* Email */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="email"
                                    className="text-sm font-semibold text-slate-700 dark:text-slate-200"
                                >
                                    Adresse e-mail
                                </Label>

                                <div className="group relative">
                                    <Mail className="pointer-events-none absolute top-1/2 left-4 h-4.5 w-4.5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400" />

                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="email@exemple.com"
                                        className="h-12 rounded-2xl border-slate-200 bg-white/70 pl-11 shadow-sm transition-all duration-300 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950/50"
                                    />
                                </div>

                                <InputError message={errors.email} />
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between gap-4">
                                    <Label
                                        htmlFor="password"
                                        className="text-sm font-semibold text-slate-700 dark:text-slate-200"
                                    >
                                        Mot de passe
                                    </Label>

                                    {canResetPassword && (
                                        <TextLink
                                            href={passwordRequest}
                                            className="text-xs font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                                            tabIndex={5}
                                        >
                                            Mot de passe oublié ?
                                        </TextLink>
                                    )}
                                </div>

                                <div className="group relative">
                                    <Lock className="pointer-events-none absolute top-1/2 left-4 z-10 h-4.5 w-4.5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400" />

                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        className="h-12 rounded-2xl border-slate-200 bg-white/70 pl-11 shadow-sm transition-all duration-300 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-950/50"
                                    />
                                </div>

                                <InputError message={errors.password} />
                            </div>

                            {/* Remember me */}
                            <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200/70 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/60">
                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        tabIndex={3}
                                    />
                                    <Label
                                        htmlFor="remember"
                                        className="cursor-pointer text-sm font-medium text-slate-600 dark:text-slate-300"
                                    >
                                        Se souvenir de moi
                                    </Label>
                                </div>

                                <KeyRound className="h-4 w-4 text-slate-400" />
                            </div>

                            {/* Bouton de connexion */}
                            <Button
                                type="submit"
                                disabled={processing}
                                tabIndex={4}
                                data-test="login-button"
                                className="group relative h-12 w-full overflow-hidden rounded-2xl bg-linear-to-r from-emerald-600 via-emerald-600 to-emerald-700 text-sm font-semibold text-white shadow-[0_10px_30px_-8px_rgba(5,150,105,0.45)] transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_20px_40px_-12px_rgba(5,150,105,0.55)] disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {/* Reflet subtil */}
                                <span className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {processing ? (
                                        <>
                                            <Spinner className="h-4 w-4" />
                                            Connexion en cours...
                                        </>
                                    ) : (
                                        <>
                                            Se connecter
                                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                        </>
                                    )}
                                </span>
                            </Button>
                        </div>

                        {/* Séparateur */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                            </div>

                            <div className="relative flex justify-center">
                                <span className="rounded-full border border-slate-200 bg-background px-4 py-1 text-[11px] font-semibold tracking-[0.15em] text-muted-foreground uppercase dark:border-slate-800">
                                    Ou continuer avec
                                </span>
                            </div>
                        </div>

                        {/* Connexions sociales */}
                        <SocialLoginButtons />

                        {/* Register */}
                        {canRegister && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center text-sm text-muted-foreground"
                            >
                                Vous n'avez pas encore de compte ?{' '}
                                <Link
                                    href={
                                        isTenant
                                            ? '/register'
                                            : '/devenir-vendeur'
                                    }
                                    tabIndex={5}
                                    className="inline-flex items-center gap-1 font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                                >
                                    {isTenant
                                        ? 'Créer mon compte'
                                        : 'Créer ma boutique'}
                                    <Sparkles className="h-3.5 w-3.5" />
                                </Link>
                            </motion.div>
                        )}
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
