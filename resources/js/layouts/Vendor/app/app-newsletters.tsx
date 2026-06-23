import { useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Loader2, Mail, Send } from 'lucide-react';
import type { SubmitEventHandler } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import getToastStyles from '@/lib/toast-style';
import { cn } from '@/lib/utils';

export default function NewsletterSectionVendeur() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
    });

    const submit: SubmitEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        post('/newsletter/subscribe', {
            preserveScroll: true,
            showProgress: false,
            onSuccess: () => {
                toast.success('Subscription successful!', {
                    description: 'You are now part of our community.',
                    style: getToastStyles()
                });
                reset('email');
            },
            onError: () => {
                toast.error(errors.email || 'Error during subscription.', {
                    description: errors.email || 'Please try again.',
                     style: getToastStyles('error')
                });
            },
        });
    };

    return (
        <section className="relative w-full overflow-hidden bg-white py-16 lg:py-24 dark:bg-slate-950">
            {/* Décor d'arrière-plan doux */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute top-0 right-0 h-96 w-96 translate-x-1/3 -translate-y-1/3 rounded-full bg-emerald-200/30 blur-3xl dark:bg-emerald-900/10" />
                <div className="absolute bottom-0 left-0 h-80 w-80 -translate-x-1/4 translate-y-1/4 rounded-full bg-slate-200/40 blur-3xl dark:bg-slate-800/10" />
                <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/10 blur-3xl dark:bg-emerald-600/5" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
            >
                <div className="grid items-center gap-12 overflow-hidden rounded border border-white/20 bg-white/70 p-8 md:grid-cols-5 md:p-12 lg:p-16 dark:border-slate-800/50 dark:bg-slate-900/60 dark:shadow-slate-900/40">
                    {/* Colonne texte (3/5) */}
                    <div className="space-y-6 md:col-span-3">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700 shadow-sm dark:bg-emerald-900/40 dark:text-emerald-300"
                        >
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Restez Informé
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white"
                        >
                            Rejoignez Notre
                            <span className="bg-linear-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent dark:from-emerald-400 dark:to-emerald-200">
                                {' '}
                                Communauté
                            </span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-300"
                        >
                            Abonnez-vous à notre newsletter pour recevoir les dernières 
                            mises à jour, du contenu exclusif et des offres spéciales 
                            directement dans votre boîte de réception.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400"
                        >
                            <span className="flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                No spam
                            </span>
                            <span className="h-4 w-px bg-slate-300 dark:bg-slate-700" />
                            <span className="flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                Unsubscribe anytime
                            </span>
                        </motion.div>
                    </div>

                    {/* Colonne formulaire (2/5) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="md:col-span-2"
                    >
                        <div className="rounded border border-slate-100 bg-white p-6 shadow-lg shadow-slate-100/40 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950 dark:shadow-none">
                            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-sm dark:bg-emerald-900/40 dark:text-emerald-400">
                                <Mail className="h-6 w-6" />
                            </div>

                            <form onSubmit={submit} className="space-y-5">
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300"
                                    >
                                        Email address
                                    </label>
                                    <div className="relative">
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData('email', e.target.value)
                                            }
                                            placeholder="you@example.com"
                                            className={cn(
                                                'h-12 rounded px-3 pl-10 text-base transition-all duration-200',
                                                'border-slate-200 bg-white/80 text-slate-900 placeholder:text-slate-400',
                                                'hover:border-emerald-300 hover:bg-white',
                                                // 'focus:border-emerald-500 focus:ring-0 focus:ring-emerald-500/20',
                                                'dark:border-slate-700 dark:bg-slate-900/80 dark:text-white dark:placeholder:text-slate-500',
                                                'dark:hover:border-emerald-700 dark:hover:bg-slate-900',
                                                'dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20',
                                                errors.email
                                                    ? 'border-red-400 focus-visible:ring-red-400'
                                                    : 'border-slate-200 focus-visible:ring-emerald-500 dark:border-slate-800',
                                                // 'dark:bg-slate-900 dark:text-white',
                                            )}
                                            disabled={processing}
                                            required
                                        />
                                        <Mail className="absolute top-3.5 left-4 h-5 w-5 text-slate-400" />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-2 text-sm text-red-500">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className={cn(
                                        'group relative h-12 w-full overflow-hidden rounded-xl bg-emerald-600 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-emerald-700 hover:shadow-lg focus-visible:outline focus-visible:outline-emerald-500 active:scale-[0.98]',
                                        'dark:bg-emerald-500 dark:hover:bg-emerald-400',
                                    )}
                                >
                                    <span className="absolute inset-0 -z-10 bg-linear-to-r from-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                                    {processing ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Subscribing...
                                        </>
                                    ) : (
                                        <>
                                            Subscribe
                                            <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}
