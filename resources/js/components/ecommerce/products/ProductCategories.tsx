import { Link } from '@inertiajs/react';
import type { Variants } from 'framer-motion';
import { motion } from 'motion/react';
import { ArrowRight, Layers3, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { index as productIndex } from '@/routes/tenant/product';
import { ProductCategoryMega } from './ProductCategoryMega';

const headerVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring',
            stiffness: 80,
            damping: 20,
        },
    },
};

export default function ProductCategoriesPage() {
    return (
        <section className="relative overflow-hidden border-y border-emerald-100/70 bg-linear-to-b from-white via-emerald-50/45 to-slate-50 py-12 dark:border-slate-800/80 dark:from-slate-950 dark:via-slate-950 dark:to-emerald-950/25 sm:py-14 lg:py-18">
            <div className="relative mx-auto max-w-350 px-4 sm:px-6 lg:px-8">
                <motion.header
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: '-100px' }}
                    variants={headerVariants}
                    className="mb-8 flex flex-col items-start justify-between gap-6 lg:mb-10 lg:flex-row lg:items-end"
                >
                    <div className="max-w-3xl">
                        <Badge
                            variant="secondary"
                            className="h-7 gap-2 rounded-md border border-emerald-200/80 bg-emerald-50 px-3 text-emerald-700 shadow-xs dark:border-emerald-900/60 dark:bg-emerald-950/50 dark:text-emerald-300"
                        >
                            <Sparkles />
                            Collections populaires
                        </Badge>

                        <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl">
                            Acheter par{' '}
                            <span className="text-emerald-700 dark:text-emerald-300">
                                catégorie
                            </span>
                        </h2>

                        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                            Explorez les collections clés, comparez les produits
                            en un coup d'oeil et accédez rapidement aux rayons
                            qui comptent.
                        </p>
                    </div>

                    <Button
                        variant="outline"
                        size="lg"
                        asChild
                        className="w-full border-emerald-200 bg-white text-slate-800 shadow-sm hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 dark:border-emerald-900/70 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-200 sm:w-auto"
                    >
                        <Link
                            href={productIndex.url({
                                query: { sort: 'popular' },
                            })}
                            prefetch
                        >
                            <Layers3 data-icon="inline-start" />
                            Voir la collection
                            <ArrowRight data-icon="inline-end" />
                        </Link>
                    </Button>
                </motion.header>

                <ProductCategoryMega />
            </div>
        </section>
    );
}
