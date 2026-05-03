/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/consistent-type-imports */
// resources/js/hooks/ecommerce/use-cart.ts
import { router, usePage } from '@inertiajs/react';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { createElement } from 'react';
import { useCallback, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface CartItem {
    variante: any;
    options_selectionnees: any;
    id: number;
    produit: {
        brand: import("react/jsx-runtime").JSX.Element;
        sold_count: boolean; id: number; nom: string; slug: string; image: string | null
    };
    quantite: number;
    prix_unitaire: number;
    prix_total: number;
    options?: any;
}

interface Cart {
    id: number;
    nb_articles: number;
    sous_total: number;
    total_taxes: number;
    total_livraison: number;
    total_remises: number;
    total_general: number;
    items: CartItem[];
    promotions: Array<{ code: string; montant: number }>;
}

export function useCartItems() {
    const { props } = usePage<{ cart?: Cart }>();
    const cart = props.cart;

    const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantite, 0) ?? 0;

    const updateQuantity = useCallback((itemId: number, quantity: number) => {
        router.patch(route('cart.update', itemId), { quantite: quantity }, {
            preserveScroll: true,
            preserveState: true,
            only: ['cart'],
            showProgress: false,
            onSuccess: () => {
                // Optionnel : toast léger de confirmation
                // toast.success('Quantité mise à jour');
            },
        });
    }, []);


    const removeItem = useCallback((itemId: number) => {
        router.delete(route('cart.remove', itemId), {
            preserveScroll: true,
            preserveState: true,
            only: ['cart'],
            showProgress: false,
            onSuccess: () => {
                toast.success('Produit retiré du panier', {
                    description: 'L\'article a été supprimé avec succès.',
                    icon: createElement(Trash2, { className: 'h-5 w-5 text-white' }),
                    duration: 2500,
                    style: {
                        background: '#1e293b',
                        color: '#f8fafc',
                        border: '1px solid #334155',
                    },
                });
            },
        });
    }, []);

    const addToCart = useCallback((productId: number, quantity = 1, variantId?: number) => {
        router.post(route('cart.add', productId), { quantity, variante_id: variantId }, {
            preserveScroll: true,
            preserveState: true,
            only: ['cart'],
            showProgress: false,
            onSuccess: () => {
                toast.success('Produit ajouté au panier', {
                    description: 'L\'article a été ajouté avec succès.',
                    icon: createElement(ShoppingCart, { className: 'h-5 w-5 text-white' }),
                    duration: 2500,
                    style: {
                        background: '#1e293b',
                        color: '#f8fafc',
                        border: '1px solid #334155'
                    },
                });
            },
        });
    }, []);

    const clearCart = useCallback(() => {
        router.post(route('cart.clear'), {}, {
            preserveScroll: true,
            onSuccess: () => toast.success('Panier vidé'),
        });
    }, []);

    const applyCoupon = useCallback((code: string) => {
        router.post(route('cart.apply-coupon'), { code }, {
            preserveScroll: true,
            onSuccess: () => toast.success('Code promo appliqué'),
            onError: (errors) => toast.error(errors.code || 'Erreur'),
        });
    }, []);

    const removeCoupon = useCallback(() => {
        router.delete(route('cart.remove-coupon'), {
            preserveScroll: true,
            onSuccess: () => toast.success('Code promo retiré'),
        });
    }, []);

    return {
        cart,
        itemCount,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        applyCoupon,
        removeCoupon,
    };
}



export function useCart() {
    const { props } = usePage<{ cart?: Cart }>();
    const [localCart, setLocalCart] = useState<Cart | undefined>(props.cart);

    // Quand les props changent (navigation Inertia complète), on se resynchronise
    useEffect(() => {
        setLocalCart(props.cart);
    }, [props.cart]);

    const itemCount = localCart?.items?.reduce((sum, item) => sum + item.quantite, 0) ?? 0;

    // Fonction générique pour envoyer une requête et récupérer le nouveau panier
    const updateCartFromResponse = useCallback(async (url: string, options?: RequestInit) => {
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    ...(options?.headers ?? {}),
                },
            });
            const data = await response.json();

            if (data.cart) {
                setLocalCart(data.cart);
            }
        } catch (error) {
            console.error('Erreur de mise à jour du panier', error);
        }
    }, []);

    const updateQuantity = useCallback((itemId: number, quantity: number) => {
        updateCartFromResponse(route('cart.update', itemId), {
            method: 'PATCH',
            body: JSON.stringify({ quantite: quantity }),
        });
    }, [updateCartFromResponse]);

    const removeItem = useCallback((itemId: number) => {
        updateCartFromResponse(route('cart.remove', itemId), { method: 'DELETE' });
    }, [updateCartFromResponse]);

    const addToCart = useCallback((productId: number, quantity = 1, variantId?: number) => {
        updateCartFromResponse(route('cart.add', productId), {
            method: 'POST',
            body: JSON.stringify({ quantite: quantity, variante_id: variantId }),
        });
    }, [updateCartFromResponse]);

    const clearCart = useCallback(() => {
        updateCartFromResponse(route('cart.clear'), { method: 'POST' });
    }, [updateCartFromResponse]);

    const applyCoupon = useCallback((code: string) => {
        updateCartFromResponse(route('cart.apply-coupon'), {
            method: 'POST',
            body: JSON.stringify({ code }),
        });
    }, [updateCartFromResponse]);

    const removeCoupon = useCallback(() => {
        updateCartFromResponse(route('cart.remove-coupon'), { method: 'DELETE' });
    }, [updateCartFromResponse]);

    return {
        cart: localCart,
        itemCount,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        applyCoupon,
        removeCoupon,
    };
}
