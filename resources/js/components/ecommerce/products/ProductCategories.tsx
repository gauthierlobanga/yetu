// resources/js/components/ecommerce/products/FeaturedProducts.tsx
import type { Variants } from 'framer-motion';
import { motion } from 'framer-motion';
import { ChevronRight, Link, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCategoryMega } from './ProductCategoryMega';

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


export default function ProductCategoriesPage() {
    return (
        <section className="relative overflow-hidden py-8 lg:py-12">
            <div className="relative mx-auto max-w-350 px-4 sm:px-6 lg:px-8">
                <motion.header
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-100px' }}
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
                             Acheter par {' '}
                            <span className="bg-linear-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300">
                                catégorie
                            </span>
                        </h2>
                        <p className="mt-3 text-base text-muted-foreground md:text-lg">
                            Explorez nos collections soigneusement sélectionnées
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
                                transition={{
                                    type: 'spring',
                                    stiffness: 400,
                                    damping: 10,
                                }}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </motion.div>
                        </Link>
                    </Button>
                </motion.header>

                <ProductCategoryMega />
            </div>
        </section>
    );
}
