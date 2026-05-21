// import { Form, Head } from '@inertiajs/react';
// import { motion } from 'framer-motion';
// import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
// import InputError from '@/components/input-error';
// import PasswordInput from '@/components/password-input';
// import { SocialLoginButtons } from '@/components/social-login-buttons';
// import TextLink from '@/components/text-link';
// import { Button } from '@/components/ui/button';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Spinner } from '@/components/ui/spinner';
// import AuthLayout from '@/layouts/auth-layout';
// import { store } from '@/routes/login';
// import { request } from '@/routes/password';
// import { register } from '@/routes/tenant';

// type Props = {
//     status?: string;
//     canResetPassword: boolean;
//     canRegister: boolean;
// };

// export default function Login({
//     status,
//     canResetPassword,
//     canRegister,
// }: Props) {
//     return (
//         <AuthLayout
//             title="Welcome back"
//             description="Enter your credentials to access your account"
//         >
//             <Head title="Log in" />

//             <Form
//                 {...store.form()}
//                 resetOnSuccess={['password']}
//                 className="flex flex-col gap-6"
//             >
//                 {({ processing, errors }) => (
//                     <>
//                         <div className="grid gap-5">
//                             {/* Champ Email avec icône */}
//                             <div className="grid gap-2">
//                                 <Label
//                                     htmlFor="email"
//                                     className="text-sm font-medium"
//                                 >
//                                     Email address
//                                 </Label>
//                                 <div className="relative">
//                                     <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
//                                     <Input
//                                         id="email"
//                                         type="email"
//                                         name="email"
//                                         required
//                                         autoFocus
//                                         tabIndex={1}
//                                         autoComplete="email"
//                                         placeholder="email@example.com"
//                                         className="h-11 pl-10 transition-all focus:ring-2 focus:ring-primary/20"
//                                     />
//                                 </div>
//                                 <InputError message={errors.email} />
//                             </div>

//                             {/* Champ Mot de passe avec icône */}
//                             <div className="grid gap-2">
//                                 <div className="flex items-center">
//                                     <Label
//                                         htmlFor="password"
//                                         className="text-sm font-medium"
//                                     >
//                                         Password
//                                     </Label>
//                                     {canResetPassword && (
//                                         <TextLink
//                                             href={request()}
//                                             className="ml-auto text-sm"
//                                             tabIndex={5}
//                                         >
//                                             Forgot password?
//                                         </TextLink>
//                                     )}
//                                 </div>
//                                 <div className="relative">
//                                     <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
//                                     <PasswordInput
//                                         id="password"
//                                         name="password"
//                                         required
//                                         tabIndex={2}
//                                         autoComplete="current-password"
//                                         placeholder="••••••••"
//                                         className="h-11 pl-10 transition-all focus:ring-2 focus:ring-primary/20"
//                                     />
//                                 </div>
//                                 <InputError message={errors.password} />
//                             </div>

//                             <div className="flex items-center space-x-3">
//                                 <Checkbox
//                                     id="remember"
//                                     name="remember"
//                                     tabIndex={3}
//                                     className="rounded border-gray-300"
//                                 />
//                                 <Label htmlFor="remember" className="text-sm">
//                                     Remember me
//                                 </Label>
//                             </div>

//                             <Button
//                                 type="submit"
//                                 className="group relative mt-2 h-11 w-full overflow-hidden text-base font-medium shadow-lg shadow-primary/20 transition-all hover:shadow-xl"
//                                 tabIndex={4}
//                                 disabled={processing}
//                                 data-test="login-button"
//                             >
//                                 <span className="relative z-10 flex items-center justify-center gap-2">
//                                     {processing ? (
//                                         <Spinner />
//                                     ) : (
//                                         <>
//                                             Sign in
//                                             <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
//                                         </>
//                                     )}
//                                 </span>
//                                 {/* Effet de survol lumineux */}
//                                 <span className="absolute inset-0 z-0 bg-linear-to-r from-primary to-primary-foreground opacity-0 transition-opacity group-hover:opacity-20" />
//                             </Button>
//                         </div>

//                         {/* Séparateur stylisé */}
//                         <div className="relative">
//                             <div className="absolute inset-0 flex items-center">
//                                 <span className="w-full border-t border-border/50" />
//                             </div>
//                             <div className="relative flex justify-center text-xs uppercase">
//                                 <span className="bg-white/80 px-3 text-muted-foreground backdrop-blur-sm dark:bg-black/40">
//                                     Or continue with
//                                 </span>
//                             </div>
//                         </div>

//                         {/* Connexion sociale */}
//                         <SocialLoginButtons />

//                         {canRegister && (
//                             <div className="text-center text-sm text-muted-foreground">
//                                 Don't have an account?{' '}
//                                 <TextLink href={register()} tabIndex={5}>
//                                     Create an account
//                                     <Sparkles className="ml-1 inline h-3 w-3" />
//                                 </TextLink>
//                             </div>
//                         )}
//                     </>
//                 )}
//             </Form>

//             {status && (
//                 <motion.div
//                     initial={{ opacity: 0, y: -10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="mt-4 rounded-lg bg-green-50 p-3 text-center text-sm font-medium text-green-700 dark:bg-green-950/30 dark:text-green-400"
//                 >
//                     {status}
//                 </motion.div>
//             )}
//         </AuthLayout>
//     );
// }

// import { Form, Head } from '@inertiajs/react';
// import InputError from '@/components/input-error';
// import PasswordInput from '@/components/password-input';
// import TextLink from '@/components/text-link';
// import { Button } from '@/components/ui/button';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Spinner } from '@/components/ui/spinner';
// import AuthLayout from '@/layouts/auth-layout';
// import { register } from '@/routes';
// import { store } from '@/routes/login';
// import { request } from '@/routes/password';

// type Props = {
//     status?: string;
//     canResetPassword: boolean;
//     canRegister: boolean;
// };

// export default function Login({
//     status,
//     canResetPassword,
//     canRegister,
// }: Props) {
//     return (
//         <AuthLayout
//             title="Log in to your account"
//             description="Enter your email and password below to log in"
//         >
//             <Head title="Log in" />

//             <Form
//                 {...store.form()}
//                 resetOnSuccess={['password']}
//                 className="flex flex-col gap-6"
//             >
//                 {({ processing, errors }) => (
//                     <>
//                         <div className="grid gap-6">
//                             <div className="grid gap-2">
//                                 <Label htmlFor="email">Email address</Label>
//                                 <Input
//                                     id="email"
//                                     type="email"
//                                     name="email"
//                                     required
//                                     autoFocus
//                                     tabIndex={1}
//                                     autoComplete="email"
//                                     placeholder="email@example.com"
//                                 />
//                                 <InputError message={errors.email} />
//                             </div>

//                             <div className="grid gap-2">
//                                 <div className="flex items-center">
//                                     <Label htmlFor="password">Password</Label>
//                                     {canResetPassword && (
//                                         <TextLink
//                                             href={request()}
//                                             className="ml-auto text-sm"
//                                             tabIndex={5}
//                                         >
//                                             Forgot password?
//                                         </TextLink>
//                                     )}
//                                 </div>
//                                 <PasswordInput
//                                     id="password"
//                                     name="password"
//                                     required
//                                     tabIndex={2}
//                                     autoComplete="current-password"
//                                     placeholder="Password"
//                                 />
//                                 <InputError message={errors.password} />
//                             </div>

//                             <div className="flex items-center space-x-3">
//                                 <Checkbox
//                                     id="remember"
//                                     name="remember"
//                                     tabIndex={3}
//                                 />
//                                 <Label htmlFor="remember">Remember me</Label>
//                             </div>

//                             <Button
//                                 type="submit"
//                                 className="mt-4 w-full"
//                                 tabIndex={4}
//                                 disabled={processing}
//                                 data-test="login-button"
//                             >
//                                 {processing && <Spinner />}
//                                 Log in
//                             </Button>
//                         </div>

//                         {canRegister && (
//                             <div className="text-center text-sm text-muted-foreground">
//                                 Don't have an account?{' '}
//                                 <TextLink href={register()} tabIndex={5}>
//                                     Sign up
//                                 </TextLink>
//                             </div>
//                         )}
//                     </>
//                 )}
//             </Form>

//             {status && (
//                 <div className="mb-4 text-center text-sm font-medium text-green-600">
//                     {status}
//                 </div>
//             )}
//         </AuthLayout>
//     );
// }
// import { Form, Head } from '@inertiajs/react';
// import InputError from '@/components/input-error';
// import PasswordInput from '@/components/password-input';
// import { SocialLoginButtons } from '@/components/social-login-buttons';
// import TextLink from '@/components/text-link';
// import { Button } from '@/components/ui/button';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Spinner } from '@/components/ui/spinner';
// import AuthLayout from '@/layouts/auth-layout';
// import { register } from '@/routes';
// import { store } from '@/routes/login';
// import { request } from '@/routes/password';

// type Props = {
//     status?: string;
//     canResetPassword: boolean;
//     canRegister: boolean;
// };

// export default function Login({
//     status,
//     canResetPassword,
//     canRegister,
// }: Props) {
//     return (
//         <AuthLayout
//             title="Welcome back"
//             description="Enter your credentials to access your account"
//         >
//             <Head title="Log in" />

//             <Form
//                 {...store.form()}
//                 resetOnSuccess={['password']}
//                 className="flex flex-col gap-6"
//             >
//                 {({ processing, errors }) => (
//                     <>
//                         <div className="grid gap-6">
//                             {/* Champs email / mot de passe */}
//                             <div className="grid gap-2">
//                                 <Label htmlFor="email">Email address</Label>
//                                 <Input
//                                     id="email"
//                                     type="email"
//                                     name="email"
//                                     required
//                                     autoFocus
//                                     tabIndex={1}
//                                     autoComplete="email"
//                                     placeholder="email@example.com"
//                                     className="h-11"
//                                 />
//                                 <InputError message={errors.email} />
//                             </div>

//                             <div className="grid gap-2">
//                                 <div className="flex items-center">
//                                     <Label htmlFor="password">Password</Label>
//                                     {canResetPassword && (
//                                         <TextLink
//                                             href={request()}
//                                             className="ml-auto text-sm"
//                                             tabIndex={5}
//                                         >
//                                             Forgot password?
//                                         </TextLink>
//                                     )}
//                                 </div>
//                                 <PasswordInput
//                                     id="password"
//                                     name="password"
//                                     required
//                                     tabIndex={2}
//                                     autoComplete="current-password"
//                                     placeholder="••••••••"
//                                     className="h-11"
//                                 />
//                                 <InputError message={errors.password} />
//                             </div>

//                             <div className="flex items-center space-x-3">
//                                 <Checkbox
//                                     id="remember"
//                                     name="remember"
//                                     tabIndex={3}
//                                 />
//                                 <Label htmlFor="remember" className="text-sm">
//                                     Remember me
//                                 </Label>
//                             </div>

//                             <Button
//                                 type="submit"
//                                 className="mt-2 h-11 w-full text-base font-medium shadow-sm transition-all hover:shadow-md"
//                                 tabIndex={4}
//                                 disabled={processing}
//                                 data-test="login-button"
//                             >
//                                 {processing && <Spinner />}
//                                 Sign in
//                             </Button>
//                         </div>

//                         {/* Séparateur */}
//                         <div className="relative">
//                             <div className="absolute inset-0 flex items-center">
//                                 <span className="w-full border-t" />
//                             </div>
//                             <div className="relative flex justify-center text-xs uppercase">
//                                 <span className="bg-background px-2 text-muted-foreground">
//                                     Or continue with
//                                 </span>
//                             </div>
//                         </div>

//                         {/* Connexion sociale */}
//                         <SocialLoginButtons />

//                         {canRegister && (
//                             <div className="text-center text-sm text-muted-foreground">
//                                 Don't have an account?{' '}
//                                 <TextLink href={register()} tabIndex={5}>
//                                     Create an account
//                                 </TextLink>
//                             </div>
//                         )}
//                     </>
//                 )}
//             </Form>

//             {status && (
//                 <div className="mb-4 text-center text-sm font-medium text-green-600">
//                     {status}
//                 </div>
//             )}
//         </AuthLayout>
//     );
// }
import { Form, Head } from '@inertiajs/react';
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

import AuthLayout from '@/layouts/auth-layout';
import { request } from '@/routes/central/password';
import { store } from '@/routes/login';
import { register } from '@/routes/tenant';

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
    return (
        <AuthLayout
            title="Bon retour"
            description="Connectez-vous pour accéder à votre espace vendeur et gérer votre boutique."
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
                                            href={request()}
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
                                <TextLink
                                    href={register()}
                                    tabIndex={5}
                                    className="inline-flex items-center gap-1 font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                                >
                                    Créer ma boutique
                                    <Sparkles className="h-3.5 w-3.5" />
                                </TextLink>
                            </motion.div>
                        )}
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
