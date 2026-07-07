/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/components/ecommerce/cart/CartButton.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ShoppingCart } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import CartContent from '@/components/ecommerce/cart/CartContent';
import CartPreview from '@/components/ecommerce/cart/CartPreview';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { useCart } from '@/hooks/ecommerce/use-cart';
import { cn } from '@/lib/utils';

export function CartButton() {
    const { itemCount } = useCart();
    const [sheetOpen, setSheetOpen] = useState(false);
    const prevCount = useRef(itemCount);
    const [bounce, setBounce] = useState(false);

    // Animation de rebond quand itemCount change
    useEffect(() => {
        if (itemCount !== prevCount.current) {
            setBounce(true);
            prevCount.current = itemCount;
            const timeout = setTimeout(() => setBounce(false), 600);

            return () => clearTimeout(timeout);
        }
    }, [itemCount]);

    return (
        <>
            {/* HoverCard pour desktop uniquement */}
            <div className="hidden sm:block">
                <HoverCard openDelay={300} closeDelay={150}>
                    <HoverCardTrigger asChild>
                        <motion.button
                            animate={bounce ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className={cn(
                                'relative h-10 w-10 cursor-pointer rounded-full',
                                'bg-white/70 hover:bg-emerald-50/80 dark:bg-slate-800/70 dark:hover:bg-emerald-950/30',
                                'border border-slate-200/60 dark:border-slate-700/60',
                                'transition-all duration-300 hover:scale-105 hover:shadow-md hover:shadow-emerald-500/10',
                                'focus-visible:ring-2 focus-visible:ring-emerald-500',
                            )}
                            aria-label="Panier"
                        >
                            <ShoppingCart className="h-4.5 w-4.5 text-slate-700 dark:text-slate-300" />
                            {itemCount > 0 && (
                                <motion.span
                                    key={itemCount}
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.5, opacity: 0 }}
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                >
                                    <Badge
                                        variant="destructive"
                                        className={cn(
                                            'absolute -top-1.5 -right-1.5',
                                            'flex h-5 min-w-5 items-center justify-center px-1 text-[10px] font-bold leading-none',
                                            'bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-600',
                                            'ring-2 ring-white dark:ring-slate-900',
                                        )}
                                    >
                                        {itemCount > 99 ? '99+' : itemCount}
                                    </Badge>
                                </motion.span>
                            )}
                        </motion.button>
                    </HoverCardTrigger>
                    <HoverCardContent
                        side="bottom"
                        align="end"
                        sideOffset={12}
                        className="w-96 p-0 shadow-2xl shadow-slate-200/30 dark:shadow-slate-950/40 border-0 bg-white/95 backdrop-blur-2xl dark:bg-slate-900/95 rounded-2xl overflow-hidden"
                    >
                        <CartPreview />
                    </HoverCardContent>
                </HoverCard>
            </div>

            {/* Bouton mobile (ouvre le Sheet) */}
            <div className="block sm:hidden">
                <motion.button
                    animate={bounce ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setSheetOpen(true)}
                    className={cn(
                        'relative h-10 w-10 cursor-pointer rounded-full',
                        'bg-white/70 hover:bg-emerald-50/80 dark:bg-slate-800/70 dark:hover:bg-emerald-950/30',
                        'border border-slate-200/60 dark:border-slate-700/60',
                        'transition-all duration-300 hover:scale-105 hover:shadow-md hover:shadow-emerald-500/10',
                        'focus-visible:ring-2 focus-visible:ring-emerald-500',
                    )}
                    aria-label="Panier"
                >
                    <ShoppingCart className="h-4.5 w-4.5 text-slate-700 dark:text-slate-300" />
                    {itemCount > 0 && (
                        <motion.span
                            key={itemCount}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        >
                            <Badge
                                variant="destructive"
                                className={cn(
                                    'absolute -top-1.5 -right-1.5',
                                    'flex h-5 min-w-5 items-center justify-center px-1 text-[10px] font-bold leading-none',
                                    'bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-600',
                                    'ring-2 ring-white dark:ring-slate-900',
                                )}
                            >
                                {itemCount > 99 ? '99+' : itemCount}
                            </Badge>
                        </motion.span>
                    )}
                </motion.button>
            </div>

            {/* Sheet (mobile) */}
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetContent
                    className={cn(
                        'w-full border-0 bg-white/95 backdrop-blur-2xl sm:max-w-lg',
                        'dark:bg-slate-950/95',
                        'px-4 pb-20 md:px-6',
                    )}
                >
                    <SheetHeader className="border-b border-slate-200/60 pb-4 dark:border-slate-800/60">
                        <SheetTitle className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
                            <ShoppingBag className="h-5 w-5 text-emerald-500" />
                            Votre panier
                        </SheetTitle>
                        <SheetDescription className="sr-only">
                            Consultez et gérez les articles de votre panier d'achat
                        </SheetDescription>
                    </SheetHeader>
                    <CartContent />
                </SheetContent>
            </Sheet>
        </>
    );
}
