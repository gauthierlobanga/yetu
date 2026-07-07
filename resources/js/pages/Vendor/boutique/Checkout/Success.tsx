/* eslint-disable @typescript-eslint/no-unused-vars */
import { Head, Link, usePage } from '@inertiajs/react';
import type { Variants } from 'framer-motion';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2,
    Package,
    Truck,
    Calendar,
    MapPin,
    CreditCard,
    ChevronRight,
    ShoppingBag,
    Sparkles,
    Lock,
    Clock,
    Mail,
    ArrowRight,
    Star,
    ArrowLeft,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import MainLayout from '@/layouts/main-layout';
import { formatPrice } from '@/lib/format';
import { handleImageFallback, resolveImageUrl } from '@/lib/media'; // selon votre projet
import { cn } from '@/lib/utils';
import tenant from '@/routes/tenant';

interface Ligne {
    id: string;
    produit: {
        nom: string;
        image?: string;
    };
    quantite: number;
    prix_unitaire: number;
    prix_total: number;
}

interface Commande {
    id: string;
    numero_commande: string;
    statut: string;
    total: number;
    sous_total: number;
    taxe: number;
    frais_livraison: number;
    created_at: string;
    lignes: Ligne[];
    adresse_livraison?: {
        rue: string;
        complement?: string;
        code_postal: string;
        ville: string;
        pays: string;
    };
}

interface Props extends Record<string, unknown> {
    commande: Commande;
}

const statusConfig: Record<
    string,
    {
        label: string;
        color: string;
        bg: string;
        border: string;
        darkBg: string;
        darkText: string;
    }
> = {
    en_attente: {
        label: 'En attente',
        color: 'text-amber-700 dark:text-amber-300',
        bg: 'bg-amber-100 dark:bg-amber-900/30',
        border: 'border-amber-200 dark:border-amber-800',
        darkBg: 'dark:bg-amber-900/30',
        darkText: 'dark:text-amber-300',
    },
    en_cours: {
        label: 'En cours',
        color: 'text-blue-700 dark:text-blue-300',
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        border: 'border-blue-200 dark:border-blue-800',
        darkBg: 'dark:bg-blue-900/30',
        darkText: 'dark:text-blue-300',
    },
    termine: {
        label: 'Terminée',
        color: 'text-emerald-700 dark:text-emerald-300',
        bg: 'bg-emerald-100 dark:bg-emerald-900/30',
        border: 'border-emerald-200 dark:border-emerald-800',
        darkBg: 'dark:bg-emerald-900/30',
        darkText: 'dark:text-emerald-300',
    },
    annule: {
        label: 'Annulée',
        color: 'text-red-700 dark:text-red-300',
        bg: 'bg-red-100 dark:bg-red-900/30',
        border: 'border-red-200 dark:border-red-800',
        darkBg: 'dark:bg-red-900/30',
        darkText: 'dark:text-red-300',
    },
    rejete: {
        label: 'Rejetée',
        color: 'text-gray-700 dark:text-gray-300',
        bg: 'bg-gray-100 dark:bg-gray-900/30',
        border: 'border-gray-200 dark:border-gray-800',
        darkBg: 'dark:bg-gray-900/30',
        darkText: 'dark:text-gray-300',
    },
};

const defaultStatus = {
    label: 'Inconnu',
    color: 'text-gray-700',
    bg: 'bg-gray-100',
    border: 'border-gray-200',
    darkBg: 'dark:bg-gray-900/30',
    darkText: 'dark:text-gray-300',
};

export default function CheckoutSuccessPage() {
    const { commande } = usePage<Props>().props;

    const status = statusConfig[commande.statut] || defaultStatus;
    const orderDate = new Date(commande.created_at).toLocaleDateString(
        'fr-FR',
        {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        },
    );

    const totalItems = commande.lignes.reduce((acc, l) => acc + l.quantite, 0);

    const containerVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: 'easeOut' },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, x: -20 },
        visible: (i: number) => ({
            opacity: 1,
            x: 0,
            transition: { delay: 0.2 + i * 0.1, duration: 0.4 },
        }),
    };

    return (
        <MainLayout>
            <Head title="Commande confirmée" />

            <div className="relative min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
                {/* Cercles décoratifs */}

                <div className="relative z-10 mx-auto max-w-4xl px-4 py-8 md:py-12">
                    {/* En-tête de succès */}
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-center"
                    >
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                            className="inline-flex items-center justify-center rounded-full bg-emerald-100 p-3 dark:bg-emerald-900/40"
                        >
                            <CheckCircle2 className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
                        </motion.div>
                        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl dark:text-white">
                            Merci pour votre commande !
                        </h1>
                        <p className="mt-2 text-slate-500 dark:text-slate-400">
                            Votre commande a été enregistrée avec succès.
                            <br />
                            Vous recevrez un email de confirmation dans quelques
                            instants.
                        </p>
                    </motion.div>

                    {/* Détails de la commande */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="mt-8 space-y-6"
                    >
                        {/* Carte commande avec en-tête dégradé */}
                        <Card className="overflow-hidden rounded-2xl border-0 bg-white/90 backdrop-blur-sm dark:bg-slate-900/80">
                            <div className="px-6 py-5 text-white">
                                <div className="flex items-center justify-between">
                                    <h2 className="flex items-center gap-2 text-lg font-bold">
                                        <Package className="h-5 w-5" />
                                        Commande #{commande.numero_commande}
                                    </h2>
                                    <Badge
                                        className={cn(
                                            'border px-3 py-1 text-sm font-semibold',
                                            status.border,
                                            status.bg,
                                            status.color,
                                        )}
                                    >
                                        {status.label}
                                    </Badge>
                                </div>
                            </div>
                            <CardContent className="space-y-6 p-6">
                                {/* Infos générales */}
                                <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                        <Calendar className="h-4 w-4 text-emerald-500" />
                                        <span>Passée le {orderDate}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                        <CreditCard className="h-4 w-4 text-emerald-500" />
                                        <span>
                                            Total{' '}
                                            {formatPrice(commande.total, 'CDF')}
                                        </span>
                                    </div>
                                    {commande.adresse_livraison && (
                                        <div className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                                            <span className="truncate">
                                                {commande.adresse_livraison.rue}
                                                ,{' '}
                                                {
                                                    commande.adresse_livraison
                                                        .code_postal
                                                }{' '}
                                                {
                                                    commande.adresse_livraison
                                                        .ville
                                                }
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <Separator className="bg-slate-100 dark:bg-slate-800" />

                                {/* Articles */}
                                <div>
                                    <h3 className="mb-3 flex items-center gap-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                        <ShoppingBag className="h-4 w-4" />
                                        Articles ({totalItems})
                                    </h3>
                                    <div className="space-y-3">
                                        {commande.lignes.map((ligne, index) => (
                                            <motion.div
                                                key={ligne.id}
                                                variants={itemVariants}
                                                initial="hidden"
                                                animate="visible"
                                                custom={index}
                                                className="group flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-3 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800/50"
                                            >
                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-700">
                                                    {ligne.produit.image ? (
                                                        <img
                                                            src={
                                                                resolveImageUrl
                                                                    ? resolveImageUrl(
                                                                          ligne
                                                                              .produit
                                                                              .image,
                                                                      )
                                                                    : ligne
                                                                          .produit
                                                                          .image
                                                            }
                                                            alt={
                                                                ligne.produit
                                                                    .nom
                                                            }
                                                            className="h-10 w-10 rounded object-cover"
                                                            onError={
                                                                handleImageFallback
                                                                    ? handleImageFallback()
                                                                    : undefined
                                                            }
                                                        />
                                                    ) : (
                                                        <ShoppingBag className="h-5 w-5 text-slate-400" />
                                                    )}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">
                                                        {ligne.produit.nom}
                                                    </p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                                        {ligne.quantite} ×{' '}
                                                        {formatPrice(
                                                            ligne.prix_unitaire,
                                                            'CDF',
                                                        )}
                                                    </p>
                                                </div>
                                                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                                    {formatPrice(
                                                        ligne.prix_total,
                                                        'CDF',
                                                    )}
                                                </span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                <Separator className="bg-slate-100 dark:bg-slate-800" />

                                {/* Totaux */}
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                        <span>Sous-total</span>
                                        <span>
                                            {formatPrice(
                                                commande.sous_total,
                                                'CDF',
                                            )}
                                        </span>
                                    </div>
                                    {commande.taxe > 0 && (
                                        <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                            <span>Taxes</span>
                                            <span>
                                                {formatPrice(
                                                    commande.taxe,
                                                    'CDF',
                                                )}
                                            </span>
                                        </div>
                                    )}
                                    {commande.frais_livraison > 0 && (
                                        <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                            <span>Livraison</span>
                                            <span>
                                                {formatPrice(
                                                    commande.frais_livraison,
                                                    'CDF',
                                                )}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-slate-900 dark:border-slate-700 dark:text-white">
                                        <span>Total</span>
                                        <span className="text-emerald-600 dark:text-emerald-400">
                                            {formatPrice(commande.total, 'CDF')}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Prochaines étapes */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="overflow-hidden rounded-2xl border-0 bg-white/90 shadow-lg backdrop-blur-sm dark:bg-slate-900/80"
                        >
                            <div className="px-6 py-4 text-white">
                                <h3 className="flex items-center gap-2 text-lg font-bold">
                                    <Truck className="h-5 w-5" />
                                    Prochaines étapes
                                </h3>
                            </div>
                            <div className="space-y-4 p-6 text-sm text-slate-600 dark:text-slate-400">
                                {[
                                    {
                                        step: 1,
                                        title: 'Confirmation par email',
                                        desc: 'Un email récapitulatif vous a été envoyé.',
                                        icon: Mail,
                                    },
                                    {
                                        step: 2,
                                        title: 'Préparation de votre commande',
                                        desc: 'Notre équipe prépare votre colis dans les plus brefs délais.',
                                        icon: Package,
                                    },
                                    {
                                        step: 3,
                                        title: 'Expédition et suivi',
                                        desc: 'Vous recevrez un numéro de suivi dès l’expédition.',
                                        icon: Truck,
                                    },
                                ].map((s, i) => (
                                    <div
                                        key={i}
                                        className="flex items-start gap-4 rounded-xl p-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                    >
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
                                            {s.step}
                                        </div>
                                        <div>
                                            <strong className="text-slate-800 dark:text-slate-200">
                                                {s.title}
                                            </strong>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                {s.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mt-8 flex flex-wrap justify-center gap-4"
                    >
                        <Button
                            asChild
                            size="lg"
                            className="gap-2 rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 px-6 py-3 text-white shadow-lg shadow-emerald-500/20 transition-all hover:shadow-xl hover:shadow-emerald-500/30"
                        >
                            <Link href={tenant.orders.show(commande.id).url}>
                                Voir ma commande
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            asChild
                            className="rounded-xl border-slate-200 px-6 py-3 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/50"
                        >
                            <Link href={tenant.product.index().url}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Continuer mes achats
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </div>
        </MainLayout>
    );
}
