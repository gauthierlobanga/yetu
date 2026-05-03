// resources/js/components/tenants/cart/CartPreview.tsx
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/ecommerce/use-cart';

export default function CartPreview() {
    const { cart } = useCart();

    if (!cart || cart.items.length === 0) {
        return (
            <div className="w-80 p-6">
                <div className="flex flex-col items-center justify-center space-y-4 rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 py-10 text-center dark:border-gray-800 dark:bg-gray-900/40">
                    <div className="text-sm text-muted-foreground">
                        Votre panier est vide
                    </div>

                    <Button asChild size="sm" className="rounded-full px-5">
                        <Link href={route('tenant.product.index')}>
                            Explorer la boutique
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    const previewItems = cart.items.slice(0, 3);
    const remainingCount = cart.items.length - previewItems.length;

    return (
        <div className="w-95 rounded-3xl border border-gray-200/70 bg-white/80 p-5 shadow-xl backdrop-blur-xl dark:border-gray-800/60 dark:bg-gray-900/80">
            {/* HEADER */}
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Panier
                    </h4>
                    <p className="text-xs text-muted-foreground">
                        {cart.nb_articles} article
                        {cart.nb_articles > 1 ? 's' : ''}
                    </p>
                </div>

                <Link
                    href={route('tenant.cart.index')}
                    className="text-xs font-medium text-primary hover:underline"
                >
                    Voir tout
                </Link>
            </div>

            {/* ITEMS */}
            <div className="scrollbar-none max-h-72 space-y-3 overflow-y-auto pr-1">
                {previewItems.map((item) => (
                    <div
                        key={item.id}
                        className="group flex gap-3 rounded-xl p-2 transition hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                        <img
                            src={item.produit.image || undefined}
                            alt={item.produit.nom}
                            className="h-14 w-14 rounded-lg border object-cover"
                        />

                        <div className="flex flex-1 flex-col justify-between">
                            <div>
                                <p className="line-clamp-1 text-xs font-medium text-gray-900 dark:text-gray-100">
                                    {item.produit.nom}
                                </p>

                                <p className="text-[11px] text-muted-foreground">
                                    {item.variante?.valeur || 'Standard'}
                                </p>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                    €{Number(item.prix_unitaire).toFixed(2)}
                                </span>

                                <span className="text-[11px] text-muted-foreground">
                                    x{item.quantite}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* MORE ITEMS */}
            {remainingCount > 0 && (
                <p className="mt-2 text-xs text-muted-foreground">
                    + {remainingCount} autre
                    {remainingCount > 1 ? 's' : ''} article
                    {remainingCount > 1 ? 's' : ''}
                </p>
            )}

            <Separator className="my-4" />

            {/* TOTAL */}
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                        €{cart.sous_total.toFixed(2)}
                    </span>
                </div>

                {cart.total_remises > 0 && (
                    <div className="flex justify-between text-emerald-600">
                        <span>Économies</span>
                        <span>-€{cart.total_remises.toFixed(2)}</span>
                    </div>
                )}
            </div>

            {/* CTA */}
            <Button
                asChild
                className="mt-5 h-11 w-full rounded-xl text-sm font-medium"
            >
                <Link href={route('tenant.cart.index')}>
                    Voir mon panier
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        </div>
    );
}
