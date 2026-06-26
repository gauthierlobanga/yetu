// resources/js/components/ecommerce/products/TrendingProducts.tsx
import { Link } from '@inertiajs/react';
import type { Variants } from 'framer-motion';
import { motion } from 'framer-motion';
import { ChevronRight, TrendingUp, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/ecommerce/products';
import ProductCard from './ProductCard';

interface TrendingProductsProps {
    products: Product[];
}

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
        },
    },
};

const headerVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 80,
            damping: 20,
        },
    },
};

export default function TrendingProducts({ products }: TrendingProductsProps) {
    return (
        <section className="relative overflow-hidden py-16 lg:py-24">

            <div className="relative mx-auto max-w-350 px-4 sm:px-6 lg:px-8">
                <motion.header
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={headerVariants}
                    className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end"
                >
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1, duration: 0.4 }}
                            className="flex items-center gap-2"
                        >
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200/50 bg-linear-to-r from-emerald-100 to-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-xs dark:border-emerald-800/50 dark:from-emerald-900/40 dark:to-emerald-900/20 dark:text-emerald-400">
                                <TrendingUp className="h-3.5 w-3.5" />
                                Populaires
                            </span>
                        </motion.div>
                        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl">
                            Tendances <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">actuelles</span>
                        </h2>
                        <p className="mt-3 text-base text-muted-foreground md:text-lg">
                            Découvrez les produits les plus populaires et les plus recherchés du moment par notre communauté.
                        </p>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        className="group gap-2 rounded-full font-medium text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-300"
                        asChild
                    >
                        <Link
                            href={route('tenant.product.index', {
                                sort: 'popular',
                            })}
                        >
                            Voir la collection
                            <motion.div
                                whileHover={{ x: 4 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </motion.div>
                        </Link>
                    </Button>
                </motion.header>

                {products.length > 0 ? (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-2 gap-4 sm:grid-cols-3  md:grid-cols-4 lg:grid-cols-6 lg:gap-6"
                    >
                        {products.map((product) => {
                            const inStock = (product.quantite_stock ?? product.stock_disponible ?? 0) > 0;

                            return (
                                <motion.div
                                    key={product.id}
                                    variants={itemVariants}
                                    className={cn(
                                        "group relative h-full transition-opacity duration-300",
                                        !inStock && "opacity-80 hover:opacity-100"
                                    )}
                                >
                                    <ProductCard product={product} />
                                </motion.div>
                            );
                        })}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex min-h-75 flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-card/40 text-center text-muted-foreground backdrop-blur-xs"
                    >
                        <div className="mb-4 rounded-full bg-emerald-100/50 p-4 dark:bg-emerald-900/20">
                            <Sparkles className="h-8 w-8 text-emerald-600/60 dark:text-emerald-400/60" />
                        </div>
                        <p className="text-base font-medium">
                            Aucune tendance pour le moment.
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground/80">
                            Revenez plus tard pour découvrir nos nouveautés.
                        </p>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
