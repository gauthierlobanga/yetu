/* eslint-disable react-hooks/preserve-manual-memoization */

/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/Pages/Shop/Cart/CartContent.tsx
import { Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Minus,
    Plus,
    Trash2,
    X,
    ShieldCheck,
    Truck,
    RotateCcw,
    Sparkles,
    Gift,
} from 'lucide-react';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import ProductCardCompact from '@/components/ecommerce/products/ProductCardCompact';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useCartItems } from '@/hooks/ecommerce/use-cart';
import { handleImageFallback, resolveImageUrl } from '@/lib/media';
import { cn } from '@/lib/utils';
import type { Product, CalculatedTotals } from '@/types/ecommerce/products';
import { EmptyCart } from './EmptyCart';

interface CartContentProps extends Record<string, unknown> {
    recommendedProducts?: Product[];
    calculatedTotals?: CalculatedTotals;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

export default function CartContent() {
    const { cart, updateQuantity, removeItem, clearCart, applyCoupon } =
        useCartItems();
    const { props } = usePage<CartContentProps>();
    const recommendedProducts = props.recommendedProducts ?? [];

    const [couponCode, setCouponCode] = useState('');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [itemToRemove, setItemToRemove] = useState<number | null>(null);
    const [isCouponApplied, setIsCouponApplied] = useState(false);

    // Optimistic quantities
    const [optimistic, setOptimistic] = useState<Record<number, number>>({});
    const timers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

    // Tri stable par ID
    const sortedItems = useMemo(() => {
        if (!cart?.items) {
            return [];
        }

        return [...cart.items].sort((a, b) => a.id - b.id);
    }, [cart?.items]);

    // Articles avec quantités optimistes
    const displayedItems = useMemo(() => {
        return sortedItems.map((item) => ({
            ...item,
            quantite: optimistic[item.id] ?? item.quantite,
            prix_total:
                (optimistic[item.id] ?? item.quantite) * item.prix_unitaire,
        }));
    }, [sortedItems, optimistic]);

    // Totaux calculés localement (instantanés)
    const localTotals = useMemo(() => {
        const selected = displayedItems.filter((item) =>
            selectedItems.includes(item.id),
        );
        const sousTotal = selected.reduce(
            (sum, item) => sum + item.prix_total,
            0,
        );
        const totalTaxes = selected.reduce(
            (sum, item) =>
                sum + ((item as any).taxe_unitaire ?? 0) * item.quantite,
            0,
        );
        const totalGeneral =
            sousTotal +
            totalTaxes +
            (cart?.total_livraison ?? 0) -
            (cart?.total_remises ?? 0);

        return {
            sous_total: sousTotal,
            total_taxes: totalTaxes,
            total_general: totalGeneral,
            selected_count: selected.reduce(
                (sum, item) => sum + item.quantite,
                0,
            ),
        };
    }, [
        displayedItems,
        selectedItems,
        cart?.total_livraison,
        cart?.total_remises,
    ]);

    // Synchronisation serveur (appelée après stabilisation)
    const syncSelection = useCallback(
        async (itemIds: number[]) => {
            if (!cart) {
                return;
            }

            try {
                await fetch(route('tenant.cart.calculate'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN':
                            document
                                .querySelector('meta[name="csrf-token"]')
                                ?.getAttribute('content') ?? '',
                    },
                    body: JSON.stringify({ item_ids: itemIds }),
                });
            } catch (error) {
                console.error('Erreur de synchronisation des totaux', error);
            }
        },
        [cart],
    );

    // Initialisation unique de la sélection (basée sur l'id du panier)
    const cartIdRef = useRef(cart?.id);
    useEffect(() => {
        if (!cart || cart.id === cartIdRef.current) {
            return;
        }

        cartIdRef.current = cart.id;
        const ids = cart.items.map((item) => item.id);
        setSelectedItems(ids);
        syncSelection(ids);
    }, [cart, syncSelection]);

    // Debounce de l'envoi après changement de sélection
    const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
        undefined,
    );
    useEffect(() => {
        if (!cart || selectedItems.length === 0) {
            return;
        }

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            syncSelection(selectedItems);
        }, 500);

        return () => clearTimeout(debounceRef.current);
    }, [selectedItems, cart, syncSelection]);

    // Gestion optimiste de la quantité
    const handleQuantityChange = (
        itemId: number,
        currentQty: number,
        delta: number,
    ) => {
        const newQty = Math.max(1, currentQty + delta);

        if (timers.current[itemId]) {
            clearTimeout(timers.current[itemId]);
        }

        setOptimistic((prev) => ({ ...prev, [itemId]: newQty }));
        updateQuantity(itemId, newQty);

        timers.current[itemId] = setTimeout(() => {
            setOptimistic((prev) => {
                const next = { ...prev };
                delete next[itemId];

                return next;
            });
            delete timers.current[itemId];
        }, 600);
    };

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
            setIsCouponApplied(true);
            setTimeout(() => setIsCouponApplied(false), 2000);
        }
    };

    const totalItems = cart.items.reduce((sum, item) => sum + item.quantite, 0);
    const totalSavings = cart?.total_remises ?? 0;
    const hasPromotions = (cart?.promotions?.length ?? 0) > 0;

    return (
        <div className="flex h-full flex-col py-6">
            {/* En-tête */}
            <div className="mb-6 flex items-center justify-between border-b border-slate-200/60 pb-4 dark:border-slate-800/60">
                <div className="flex items-center gap-3">
                    <Checkbox
                        checked={selectedItems.length === cart.items.length}
                        onCheckedChange={handleSelectAll}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 dark:border-slate-600"
                    />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Sélectionner tout ({totalItems} articles)
                    </span>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCart}
                    className="rounded-full text-xs text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
                >
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                    Vider
                </Button>
            </div>

            {/* Grille principale */}
            <div className="grid flex-1 grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Colonne articles */}
                <div className="lg:col-span-2">
                    <AnimatePresence mode="popLayout">
                        {displayedItems.map((item) => {
                            const variantInfo = item.variante
                                ? `${item.variante.nom}: ${item.variante.valeur}`
                                : item.options_selectionnees
                                  ? Object.entries(item.options_selectionnees)
                                        .map(([k, v]) => `${k}: ${v}`)
                                        .join(', ')
                                  : null;
                            const isSelected = selectedItems.includes(item.id);

                            return (
                                <motion.div
                                    key={item.id}
                                    // ❌ layout supprimé pour éviter les déplacements
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{
                                        opacity: 0,
                                        height: 0,
                                        marginBottom: 0,
                                    }}
                                    transition={{ duration: 0.2 }}
                                    className="mb-4"
                                >
                                    <div
                                        className={cn(
                                            'group relative overflow-hidden rounded-2xl border transition-all duration-300',
                                            isSelected
                                                ? 'border-emerald-300 bg-emerald-50/40 shadow-md shadow-emerald-500/5 dark:border-emerald-700/50 dark:bg-emerald-950/20'
                                                : 'border-slate-200/80 bg-white/80 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 dark:border-slate-800/80 dark:bg-slate-900/60',
                                        )}
                                    >
                                        <div className="flex gap-4 p-4">
                                            <Checkbox
                                                checked={isSelected}
                                                onCheckedChange={(checked) =>
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
                                                    )
                                                }
                                                className="mt-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 dark:border-slate-600"
                                            />

                                            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                                                <img
                                                    src={resolveImageUrl(
                                                        item.produit.image,
                                                    )}
                                                    alt={item.produit.nom}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    onError={handleImageFallback()}
                                                />
                                                {item.produit
                                                    .est_en_promotion && (
                                                    <Badge className="absolute top-2 left-2 rounded-full border-0 bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                                                        -
                                                        {
                                                            item.produit
                                                                .reduction_pourcentage
                                                        }
                                                        %
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="flex flex-1 flex-col justify-between">
                                                <div>
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div>
                                                            {item.produit
                                                                .brand && (
                                                                <p className="text-xs font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
                                                                    {
                                                                        (
                                                                            item
                                                                                .produit
                                                                                .brand as any
                                                                        )?.nom
                                                                    }
                                                                </p>
                                                            )}
                                                            <Link
                                                                href={route(
                                                                    'tenant.product.show',
                                                                    item.produit
                                                                        .slug,
                                                                )}
                                                                className="line-clamp-2 text-sm font-semibold text-slate-800 hover:text-emerald-600 dark:text-slate-100 dark:hover:text-emerald-400"
                                                            >
                                                                {
                                                                    item.produit
                                                                        .nom
                                                                }
                                                            </Link>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 rounded-full text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/20"
                                                            onClick={() =>
                                                                handleRemoveClick(
                                                                    item.id,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                    {variantInfo && (
                                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                                            {variantInfo}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="mt-3 flex items-end justify-between">
                                                    <div className="space-y-1">
                                                        <span className="text-lg font-bold text-slate-900 dark:text-white">
                                                            {formatCurrency(
                                                                item.prix_unitaire,
                                                            )}
                                                        </span>
                                                        <span className="text-xs text-slate-400">
                                                            {' '}
                                                            / pièce
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center rounded-full border border-slate-200 bg-white/90 shadow-sm dark:border-slate-700 dark:bg-slate-800/90">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 rounded-full transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
                                                            onClick={() =>
                                                                handleQuantityChange(
                                                                    item.id,
                                                                    item.quantite,
                                                                    -1,
                                                                )
                                                            }
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </Button>
                                                        <span className="w-8 text-center text-sm font-medium tabular-nums">
                                                            {item.quantite}
                                                        </span>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 rounded-full transition-colors hover:bg-slate-100 dark:hover:bg-slate-700"
                                                            onClick={() =>
                                                                handleQuantityChange(
                                                                    item.id,
                                                                    item.quantite,
                                                                    1,
                                                                )
                                                            }
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* Récapitulatif */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-6 rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-xl backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/80">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            Récapitulatif{' '}
                            <span className="text-sm font-normal text-slate-500">
                                ({localTotals.selected_count} article
                                {localTotals.selected_count > 1 ? 's' : ''})
                            </span>
                        </h3>

                        <form
                            onSubmit={handleSubmitCoupon}
                            className="flex gap-2"
                        >
                            <div className="relative flex-1">
                                <Input
                                    placeholder="Code promo"
                                    value={couponCode}
                                    onChange={(e) =>
                                        setCouponCode(e.target.value)
                                    }
                                    className={cn(
                                        'h-10 border-slate-200 bg-slate-50/50 pr-12 transition-colors',
                                        'placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-800/50',
                                        isCouponApplied &&
                                            'border-emerald-400 ring-2 ring-emerald-400/30',
                                    )}
                                />
                                {couponCode && (
                                    <button
                                        type="button"
                                        onClick={() => setCouponCode('')}
                                        className="absolute top-1/2 right-10 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                            <Button
                                type="submit"
                                variant="outline"
                                size="sm"
                                className="h-10 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-700 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/30"
                            >
                                Appliquer
                            </Button>
                        </form>

                        {hasPromotions && (
                            <div className="rounded-xl bg-emerald-50/80 p-3 dark:bg-emerald-950/30">
                                {cart.promotions.map((promo, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-300"
                                    >
                                        <span className="flex items-center gap-1.5 font-medium">
                                            <Gift className="h-3 w-3" />
                                            {promo.code}
                                        </span>
                                        <span>
                                            -{formatCurrency(promo.montant)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                <span>Sous-total</span>
                                <span className="font-medium">
                                    {formatCurrency(localTotals.sous_total)}
                                </span>
                            </div>
                            <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                <span>Livraison</span>
                                <span className="font-medium">
                                    {formatCurrency(cart?.total_livraison ?? 0)}
                                </span>
                            </div>
                            {totalSavings > 0 && (
                                <div className="flex justify-between font-medium text-rose-500">
                                    <span>Réduction</span>
                                    <span>-{formatCurrency(totalSavings)}</span>
                                </div>
                            )}
                            <Separator className="my-1 bg-slate-200/60 dark:bg-slate-800/60" />
                            <div className="flex justify-between text-base font-bold text-slate-900 dark:text-white">
                                <span>Total</span>
                                <span className="text-emerald-600 dark:text-emerald-400">
                                    {formatCurrency(localTotals.total_general)}
                                </span>
                            </div>
                            {totalSavings > 0 && (
                                <div className="rounded-lg bg-amber-50/70 px-3 py-2 text-xs font-medium text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">
                                    🎉 Vous économisez{' '}
                                    {formatCurrency(totalSavings)} sur cette
                                    commande
                                </div>
                            )}
                        </div>

                        <Button
                            asChild
                            className="w-full rounded-2xl bg-emerald-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-500/30 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                        >
                            <Link href={route('tenant.checkout.index')}>
                                <ShieldCheck className="mr-2 h-4 w-4" />
                                Procéder au paiement
                            </Link>
                        </Button>

                        <div className="space-y-3 border-t border-slate-200/60 pt-5 dark:border-slate-800/60">
                            <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                                Garanties Yetu
                            </p>
                            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
                                <div className="flex items-start gap-2">
                                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                                    <span>
                                        Paiement sécurisé par cryptage SSL
                                    </span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <Truck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                                    <span>
                                        Livraison offerte dès 50 000 CDF
                                    </span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <RotateCcw className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                                    <span>Retours faciles sous 30 jours</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recommandations */}
            {recommendedProducts.length > 0 && (
                <section className="relative mt-16 border-t border-slate-200/60 pt-12 dark:border-slate-800/60">
                    <div className="mb-8 text-center">
                        <span className="inline-flex items-center gap-1 text-sm font-semibold tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
                            <Sparkles className="h-4 w-4" /> Recommandations
                        </span>
                        <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                            Vous aimerez aussi
                        </h2>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            Sélectionnés pour compléter votre panier
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        {recommendedProducts.slice(0, 8).map((product) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.25 }}
                            >
                                <ProductCardCompact product={product} />
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* Dialogue de suppression */}
            <AlertDialog
                open={itemToRemove !== null}
                onOpenChange={() => setItemToRemove(null)}
            >
                <AlertDialogContent className="max-w-md rounded-3xl border-0 bg-white/95 backdrop-blur-2xl dark:bg-slate-950/95">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-slate-900 dark:text-white">
                            Retirer l'article ?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-500 dark:text-slate-400">
                            Il sera définitivement supprimé de votre panier.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
                            Annuler
                        </AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            className="rounded-xl bg-red-600 hover:bg-red-700"
                            onClick={confirmRemove}
                        >
                            Supprimer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
