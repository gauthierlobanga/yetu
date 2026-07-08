import { Form } from '@inertiajs/react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useRef } from 'react';
import ParametresController from '@/actions/App/Http/Controllers/Vendor/Settings/ParametresController';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function DeleteUser() {
    const passwordInput = useRef<HTMLInputElement>(null);

    return (
        <div className="space-y-6">
            <div className="rounded-xl border border-rose-200/60 bg-rose-50/50 p-6 dark:border-rose-900/30 dark:bg-rose-950/20">
                <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400">
                        <AlertTriangle className="h-6 w-6" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-bold text-rose-700 dark:text-rose-300">
                            Supprimer votre compte
                        </h3>
                        <p className="text-sm text-rose-600/80 dark:text-rose-300/70">
                            Cette action est irréversible. Toutes vos données
                            seront définitivement effacées.
                        </p>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    variant="destructive"
                                    className="gap-2 rounded-xl text-rose-200 dark:text-rose-200 bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Supprimer mon compte
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="overflow-hidden rounded-3xl border-0 bg-white/90 p-0 sm:max-w-md dark:bg-slate-900/90">
                                {/* Barre supérieure décorative */}
                                <div className="h-1 w-full bg-linear-to-r from-rose-500 to-pink-500" />

                                {/* Icône de fermeture repositionnée */}
                                <DialogClose asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-4 right-4 z-10 h-8 w-8 rounded-full bg-white/80 text-slate-500 transition-all hover:bg-rose-50 hover:text-rose-600 dark:bg-slate-800/80 dark:text-slate-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </DialogClose>

                                <div className="px-6 pt-10 pb-8">
                                    <div className="flex flex-col items-center gap-4 text-center">
                                        {/* Conteneur d'icône avec anneau pulsé */}
                                        <div className="relative mb-2">
                                            <div className="absolute inset-0 animate-ping rounded-full bg-rose-400/30 dark:bg-rose-500/20" />
                                            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-rose-100 to-rose-200 text-rose-600 shadow-lg shadow-rose-500/20 dark:from-rose-900/40 dark:to-rose-800/20 dark:text-rose-400 dark:shadow-rose-500/10">
                                                <AlertTriangle className="h-8 w-8" />
                                            </div>
                                        </div>

                                        <DialogTitle className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                            Confirmer la suppression
                                        </DialogTitle>
                                        <DialogDescription className="max-w-xs text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                                            Cette action est{' '}
                                            <span className="font-semibold text-rose-600 dark:text-rose-400">
                                                irréversible
                                            </span>
                                            . Saisissez votre mot de passe pour
                                            supprimer définitivement votre
                                            compte.
                                        </DialogDescription>
                                    </div>

                                    <Form
                                        {...ParametresController.destroy.form()}
                                        options={{ preserveScroll: true }}
                                        onError={() =>
                                            passwordInput.current?.focus()
                                        }
                                        resetOnSuccess
                                        className="mt-8 space-y-5"
                                    >
                                        {({
                                            resetAndClearErrors,
                                            processing,
                                            errors,
                                        }) => (
                                            <>
                                                <div className="grid gap-2">
                                                    <Label
                                                        htmlFor="password"
                                                        className="text-sm font-medium text-slate-700 dark:text-slate-300"
                                                    >
                                                        Mot de passe
                                                    </Label>
                                                    <PasswordInput
                                                        id="password"
                                                        name="password"
                                                        ref={passwordInput}
                                                        placeholder="••••••••"
                                                        autoComplete="current-password"
                                                        className="rounded-xl border-slate-200 bg-slate-50/50 transition-all focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:focus:border-rose-500"
                                                    />
                                                    <InputError
                                                        message={
                                                            errors.password
                                                        }
                                                    />
                                                </div>

                                                <DialogFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                                    <DialogClose asChild>
                                                        <Button
                                                            variant="outline"
                                                            onClick={() =>
                                                                resetAndClearErrors()
                                                            }
                                                            className="rounded-xl border-slate-200 bg-white text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:shadow dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                                                        >
                                                            Annuler
                                                        </Button>
                                                    </DialogClose>
                                                    <Button
                                                        variant="destructive"
                                                        disabled={processing}
                                                        className="gap-2 rounded-xl bg-linear-to-r from-rose-600 to-pink-600 px-5 text-white shadow-lg shadow-rose-500/20 transition-all hover:from-rose-700 hover:to-pink-700 hover:shadow-xl disabled:opacity-70 dark:from-rose-700 dark:to-pink-700"
                                                        asChild
                                                    >
                                                        <button
                                                            type="submit"
                                                            disabled={
                                                                processing
                                                            }
                                                        >
                                                            {processing ? (
                                                                <span className="flex items-center gap-2">
                                                                    <svg
                                                                        className="h-4 w-4 animate-spin"
                                                                        viewBox="0 0 24 24"
                                                                        fill="none"
                                                                    >
                                                                        <circle
                                                                            cx="12"
                                                                            cy="12"
                                                                            r="10"
                                                                            stroke="currentColor"
                                                                            strokeWidth="4"
                                                                            className="opacity-25"
                                                                        />
                                                                        <path
                                                                            fill="currentColor"
                                                                            className="opacity-75"
                                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                                                        />
                                                                    </svg>
                                                                    Suppression...
                                                                </span>
                                                            ) : (
                                                                <>
                                                                    <Trash2 className="h-4 w-4" />
                                                                    Supprimer
                                                                    mon compte
                                                                </>
                                                            )}
                                                        </button>
                                                    </Button>
                                                </DialogFooter>
                                            </>
                                        )}
                                    </Form>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>
    );
}
