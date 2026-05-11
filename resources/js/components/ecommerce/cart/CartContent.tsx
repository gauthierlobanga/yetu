/* eslint-disable @typescript-eslint/no-unused-vars */
import { Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Minus,
    Plus,
    Trash2,
    Tag,
    X,
    ShieldCheck,
    ChevronRight,
    Percent,
    AlertCircleIcon,
    Calendar,
    Package,
} from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';

import ProductCardCompact from '@/components/ecommerce/products/ProductCardCompact';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useCartItems } from '@/hooks/ecommerce/use-cart';
import { SpinnerCard } from '@/pages/Shop/Products/Spinner';
import type {
    PageProps,
    Product,
    CalculatedTotals,
} from '@/types/ecommerce/products';
import { EmptyCart } from './EmptyCart';

interface PagePropsWithRecommendations extends PageProps {
    recommendedProducts?: Product[];
    calculatedTotals?: CalculatedTotals;
}

export default function CartContent() {
    const {
        cart,
        updateQuantity,
        removeItem,
        clearCart,
        applyCoupon,
        removeCoupon,
    } = useCartItems();
    const { props } = usePage<PagePropsWithRecommendations>();
    const recommendedProducts = props.recommendedProducts ?? [];

    const [couponCode, setCouponCode] = useState('');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [calculatedTotals, setCalculatedTotals] = useState<CalculatedTotals>({
        sous_total: cart?.sous_total ?? 0,
        total_taxes: cart?.total_taxes ?? 0,
        total_livraison: cart?.total_livraison ?? 0,
        total_remises: cart?.total_remises ?? 0,
        total_general: cart?.total_general ?? 0,
        selected_count: cart?.nb_articles ?? 0,
    });
    const [isSyncing, setIsSyncing] = useState(false);
    const [itemToRemove, setItemToRemove] = useState<number | null>(null);
    const isAfterMount = useRef(false);

    useEffect(() => {
        isAfterMount.current = true;
    }, []);
    // Initialiser la sélection
    const isInitialized = useRef(false);

    const syncSelection = useCallback(
        async (itemIds: number[]) => {
            if (!cart) {
                return;
            }

            try {
                const response = await fetch(route('tenant.cart.calculate'), {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN':
                            document
                                .querySelector('meta[name="csrf-token"]')
                                ?.getAttribute('content') ?? '',
                    },
                    body: JSON.stringify({ item_ids: itemIds }),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => null);
                    console.error('Erreur API détaillée:', errorData);

                    throw new Error('Erreur API');
                }

                const data = await response.json();

                if (data.calculatedTotals) {
                    setCalculatedTotals(data.calculatedTotals);
                }
            } catch (error) {
                console.error(error);
                // ✅ Ne plus mettre à zéro, on garde l'état précédent
            }
        },
        [cart],
    );
    useEffect(() => {
        if (!cart) {
            return;
        }

        const ids = cart.items.map((item) => item.id);
        setSelectedItems(ids);

        // première sync propre
        syncSelection(ids);

        isInitialized.current = true;
    }, [cart, syncSelection]);

    // Synchroniser quand la sélection change (avec debounce)
    useEffect(() => {
        if (!cart || selectedItems.length === 0) {
            return;
        }

        const timer = setTimeout(() => {
            syncSelection(selectedItems);
        }, 300);

        return () => clearTimeout(timer);
    }, [cart, selectedItems, syncSelection]);

    if (!cart || cart.items.length === 0) {
        return <EmptyCart />;
    }

    const handleSelectAll = (checked: boolean) => {
        setSelectedItems(checked ? cart.items.map((item) => item.id) : []);
    };

    const handleRemoveClick = (itemId: number) => setItemToRemove(itemId);

    const confirmRemove = () => {
        if (itemToRemove) {
            removeItem(itemToRemove);
            setItemToRemove(null);
        }
    };
    const cancelRemove = () => setItemToRemove(null);

    const handleSubmitCoupon = (e: React.FormEvent) => {
        e.preventDefault();

        if (couponCode.trim()) {
            applyCoupon(couponCode.trim());
            setCouponCode('');
        }
    };

    if (!calculatedTotals) {
        return null;
    }

    const totalItems = cart.items.reduce((sum, item) => sum + item.quantite, 0);
    const totalSavings = calculatedTotals?.total_remises ?? 0;

    return (
        <div className="flex h-full flex-col">
            {/* En-tête */}
            <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-3">
                    <Checkbox
                        checked={selectedItems.length === cart.items.length}
                        onCheckedChange={handleSelectAll}
                    />
                    <span className="text-sm font-medium">
                        Sélectionner tous les articles ({totalItems})
                    </span>
                </div>
                <Button variant="ghost" size="sm" onClick={clearCart}>
                    Vider le panier
                </Button>
            </div>

            {/* Grille principale */}
            <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Colonne de gauche : Liste des articles */}
                <div className="lg:col-span-2">
                    <div className="space-y-5">
                        {cart.items.map((item) => {
                            const variantInfo = item.variante
                                ? `${item.variante.nom}: ${item.variante.valeur}`
                                : item.options_selectionnees
                                  ? Object.entries(item.options_selectionnees)
                                        .map(([k, v]) => `${k}: ${v}`)
                                        .join(', ')
                                  : null;

                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{
                                        duration: 0.25,
                                        ease: 'easeOut',
                                    }}
                                    whileHover={{
                                        y: -2,
                                        transition: { duration: 0.15 },
                                    }}
                                    className="group relative overflow-hidden rounded-none border bg-card/80 p-3 backdrop-blur transition-shadow"
                                >
                                    <div className="flex gap-3">
                                        {/* CHECKBOX */}
                                        <Checkbox
                                            checked={selectedItems.includes(
                                                item.id,
                                            )}
                                            onCheckedChange={(checked) => {
                                                setSelectedItems(
                                                    checked
                                                        ? [
                                                              ...selectedItems,
                                                              item.id,
                                                          ]
                                                        : selectedItems.filter(
                                                              (id) =>
                                                                  id !==
                                                                  item.id,
                                                          ),
                                                );
                                            }}
                                            className="mt-2"
                                        />

                                        {/* IMAGE */}
                                        <div className="relative">
                                            <img
                                                src={
                                                    item.produit.image ||
                                                    undefined
                                                }
                                                alt={item.produit.nom}
                                                className="h-24 w-24 rounded-xl border object-cover transition group-hover:scale-105"
                                            />

                                            {/* badge overlay */}
                                            {Number(item.produit.sold_count) >
                                                0 && (
                                                <span className="absolute top-1 left-1 rounded-md bg-black/70 px-2 py-0.5 text-[10px] text-white">
                                                    🔥 {item.produit.sold_count}
                                                </span>
                                            )}
                                        </div>

                                        {/* CONTENT */}
                                        <div className="flex-1 space-y-3">
                                            {/* HEADER */}
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="space-y-1">
                                                    {item.produit.brand && (
                                                        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                                            {
                                                                (
                                                                    item.produit
                                                                        .brand as unknown as {
                                                                        nom: string;
                                                                    }
                                                                )?.nom
                                                            }
                                                        </p>
                                                    )}

                                                    <Link
                                                        href={route(
                                                            'tenant.product.show',
                                                            item.produit.slug,
                                                        )}
                                                        className="line-clamp-2 text-sm leading-snug font-semibold hover:text-primary"
                                                    >
                                                        {item.produit.nom}
                                                    </Link>
                                                </div>

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                    onClick={() =>
                                                        handleRemoveClick(
                                                            item.id,
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            {/* VARIANTS */}
                                            {variantInfo && (
                                                <p className="text-xs text-muted-foreground">
                                                    {variantInfo}
                                                </p>
                                            )}

                                            {/* BADGES */}
                                            <div className="flex flex-wrap gap-2">
                                                {Number(
                                                    item.produit.sold_count,
                                                ) > 0 && (
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-xs"
                                                    >
                                                        {
                                                            item.produit
                                                                .sold_count
                                                        }{' '}
                                                        vendus
                                                    </Badge>
                                                )}

                                                {item.options?.min_quantity && (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        Min :{' '}
                                                        {
                                                            item.options
                                                                .min_quantity
                                                        }
                                                    </Badge>
                                                )}
                                            </div>

                                            {/* FOOTER */}
                                            <div className="flex items-center justify-between pt-2">
                                                {/* PRICE */}
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg font-bold text-primary">
                                                            €
                                                            {Number(
                                                                item.prix_unitaire,
                                                            ).toFixed(2)}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            / pièce
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* QUANTITY */}
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center rounded-full border bg-muted/40 px-1 shadow-inner">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 rounded-full"
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.id,
                                                                    Math.max(
                                                                        1,
                                                                        item.quantite -
                                                                            1,
                                                                    ),
                                                                )
                                                            }
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </Button>

                                                        <span className="w-8 text-center text-sm font-medium">
                                                            {item.quantite}
                                                        </span>

                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 rounded-full"
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.id,
                                                                    item.quantite +
                                                                        1,
                                                                )
                                                            }
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* WARNING */}
                                            {item.options?.min_quantity &&
                                                item.quantite <
                                                    item.options
                                                        .min_quantity && (
                                                    <div className="flex items-center gap-2 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
                                                        <AlertCircleIcon className="h-4 w-4" />
                                                        <span>
                                                            Il manque{' '}
                                                            {item.options
                                                                .min_quantity -
                                                                item.quantite}{' '}
                                                            unités pour
                                                            atteindre le minimum
                                                        </span>
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Colonne de droite : Récapitulatif PREMIUM */}
                <div className="lg:col-span-1">
                    <div className="sticky top-20 space-y-5 rounded-none bg-card/90 p-6 shadow-xs backdrop-blur-xl">
                        {/* HEADER */}
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold">
                                Récapitulatif de la commande (
                                {calculatedTotals.selected_count || 0} articles)
                            </h3>

                            {/* Images empilées */}
                            <div className="flex -space-x-3">
                                {cart.items.slice(0, 4).map((item, i) => (
                                    <img
                                        key={i}
                                        src={item.produit.image || undefined}
                                        className="h-12 w-12 rounded-lg border-2 border-white object-cover shadow-sm dark:border-gray-900"
                                    />
                                ))}

                                {cart.items.length > 4 && (
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-white bg-muted text-xs font-medium shadow-sm dark:border-gray-900">
                                        +{cart.items.length - 4}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* PRICING */}
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Sous-total de l'article
                                </span>
                                <span className="font-medium">
                                    {Number(
                                        calculatedTotals.sous_total,
                                    ).toFixed(2)}{' '}
                                    CDF
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Frais d'expédition
                                </span>
                                <span className="font-medium">
                                    {Number(
                                        calculatedTotals.total_livraison,
                                    ).toFixed(2)}{' '}
                                    CDF
                                </span>
                            </div>

                            {calculatedTotals.total_remises > 0 && (
                                <div className="flex justify-between font-medium text-red-500">
                                    <span>Réduction sur les frais</span>
                                    <span>
                                        -
                                        {Number(
                                            calculatedTotals.total_remises,
                                        ).toFixed(2)}{' '}
                                        CDF
                                    </span>
                                </div>
                            )}

                            <div className="my-2 h-px bg-border" />

                            <div className="flex justify-between text-lg font-bold">
                                <span>Sous-total</span>
                                <span>
                                    {Number(
                                        calculatedTotals.total_general,
                                    ).toFixed(2)}{' '}
                                    CDF
                                </span>
                            </div>

                            {/* Economies */}
                            {totalSavings > 0 && (
                                <div className="rounded-lg bg-orange-100 px-3 py-2 text-sm font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                                    {totalSavings.toFixed(2)} CDF économisés sur
                                    votre commande
                                </div>
                            )}
                        </div>

                        {/* COUPON */}
                        <form
                            onSubmit={handleSubmitCoupon}
                            className="flex gap-2"
                        >
                            <Input
                                placeholder="Code promo"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                className="h-10"
                            />
                            <Button type="submit" variant="outline">
                                OK
                            </Button>
                        </form>

                        {/* PROMOS */}
                        {cart.promotions?.length > 0 && (
                            <div className="space-y-2 rounded-lg bg-green-50 p-3 dark:bg-green-950/20">
                                {cart.promotions.map((promo, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between text-xs text-green-700 dark:text-green-400"
                                    >
                                        <span className="font-medium">
                                            {promo.code}
                                        </span>
                                        <span>
                                            -{Number(promo.montant).toFixed(2)}{' '}
                                            CDF
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* BOUTON PAYER */}
                        <Button
                            asChild
                            disabled={isSyncing}
                            className="h-10 w-full cursor-pointer rounded-full bg-primary/95 text-base font-semibold hover:bg-primary"
                        >
                            <Link
                                href={route('tenant.checkout.index')}
                                className="flex items-center justify-center gap-2"
                            >
                                {isSyncing ? (
                                    <SpinnerCard />
                                ) : (
                                    <>
                                        <ShieldCheck className="h-5 w-5" />
                                        Payer
                                    </>
                                )}
                            </Link>
                        </Button>

                        {/* PROTECTION (STYLE ALIBABA) */}
                        <div className="space-y-4 border-t pt-4 text-sm">
                            <h4 className="font-semibold">
                                Protection des commandes
                            </h4>

                            <div className="space-y-3 text-muted-foreground">
                                <div className="flex items-start gap-3">
                                    <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-green-600" />

                                    <div className="space-y-1">
                                        <p className="font-medium text-foreground">
                                            Paiements sécurisés
                                        </p>
                                        <p className="text-sm leading-relaxed text-muted-foreground">
                                            Chaque paiement est sécurisé par un
                                            cryptage SSL strict et des
                                            protocoles PCI DSS.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Package className="mt-1 h-5 w-5 shrink-0 text-primary" />

                                    <div className="space-y-1">
                                        <p className="font-medium text-foreground">
                                            Livraison garantie
                                        </p>
                                        <p className="text-sm leading-relaxed text-muted-foreground">
                                            Recevez votre commande à temps ou
                                            bénéficiez d'une indemnité de
                                            retard.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-primary" />

                                    <div className="space-y-1">
                                        <p className="font-medium text-foreground">
                                            Protection de remboursement
                                        </p>
                                        <p className="text-sm leading-relaxed text-muted-foreground">
                                            Remboursement si commande non livrée
                                            ou non conforme.
                                        </p>
                                    </div>
                                </div>

                                <p className="text-xs text-muted-foreground">
                                    Seules les commandes payées bénéficient de
                                    la protection gratuite.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Vous aimerez aussi */}
            {recommendedProducts.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="relative mt-12 border-t border-border/50 pt-10"
                >
                    {/* Fond décoratif */}
                    <div className="absolute inset-0 -z-10 overflow-hidden">
                        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-[100px]" />
                        <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-secondary/5 blur-[80px]" />
                    </div>

                    {/* En-tête */}
                    <div className="mb-8 flex items-end justify-between">
                        <div className="space-y-1">
                            <span className="text-xs font-semibold tracking-wider text-primary uppercase">
                                ✦ Recommandations personnalisées
                            </span>
                            <h3 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">
                                Vous aimerez aussi
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Sélectionnés pour compléter votre style
                            </p>
                        </div>
                        <Link
                            href={route('tenant.product.index')}
                            className="group flex items-center gap-1 text-sm font-medium text-primary transition-all hover:gap-2 hover:text-primary/80"
                        >
                            Voir toutes les suggestions
                            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                    </div>

                    {/* Grille de produits (4 colonnes) */}
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4">
                        {recommendedProducts.slice(0, 8).map((product) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3 }}
                            >
                                <ProductCardCompact product={product} />
                            </motion.div>
                        ))}
                    </div>

                    {/* Bouton "Voir plus" si plus de 8 produits */}
                    {recommendedProducts.length > 8 && (
                        <div className="mt-6 text-center">
                            <Button variant="outline" asChild>
                                <Link href={route('tenant.product.index')}>
                                    Voir plus de recommandations
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    )}

                    {/* Bannière promotionnelle (optionnelle) */}
                    <div className="mt-10 overflow-hidden rounded-2xl bg-linear-to-r from-primary/10 via-secondary/5 to-primary/10 p-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-primary/20 p-2 text-primary">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <p className="text-sm font-medium">
                                    Livraison offerte dès 50€ d'achat sur ces
                                    articles
                                </p>
                            </div>
                            <Button variant="link" size="sm" asChild>
                                <Link href={route('tenant.promotions.index')}>
                                    En savoir plus
                                </Link>
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Dialogue de confirmation de suppression */}
            <AlertDialog
                open={itemToRemove !== null}
                onOpenChange={(open) => !open && setItemToRemove(null)}
            >
                <AlertDialogContent className="max-w-md rounded-2xl border-border/50 bg-background/95 p-0 shadow-2xl backdrop-blur-sm sm:max-w-lg">
                    <AlertDialogHeader className="p-6 pb-4">
                        <AlertDialogMedia className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive ring-4 ring-destructive/20 dark:bg-destructive/20 dark:text-destructive-foreground dark:ring-destructive/30">
                            <Trash2 className="h-8 w-8" />
                        </AlertDialogMedia>
                        <AlertDialogTitle className="text-xl font-semibold tracking-tight">
                            Supprimer l'article
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm leading-relaxed text-muted-foreground">
                            Cet article sera définitivement supprimé de votre
                            panier. Cette action est irréversible.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-row-reverse justify-start gap-3 border-t bg-muted/20 p-4 dark:bg-muted/10">
                        <AlertDialogAction
                            variant="destructive"
                            onClick={confirmRemove}
                            className="min-w-24 cursor-pointer rounded-full px-6"
                        >
                            Supprimer
                        </AlertDialogAction>
                        <AlertDialogCancel
                            variant="outline"
                            onClick={cancelRemove}
                            className="min-w-24 cursor-pointer rounded-full px-6"
                        >
                            Annuler
                        </AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
