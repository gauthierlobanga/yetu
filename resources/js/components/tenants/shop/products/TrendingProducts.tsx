import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Product } from '@/types/tenants/products';
import ProductCard from './ProductCard';

interface ProductCardProps {
    products: Product;
}

export default function TrendingProducts({ products }: ProductCardProps) {
    return (
        <section className="bg-muted/30 py-16 lg:py-24">
            <div className="mx-auto max-w-7xl px-4">
                <header className="mb-10 flex items-end justify-between">
                    <div>
                        <h2 className="font-heading text-2xl font-bold md:text-3xl">
                            Tendances actuelles
                        </h2>
                        <p className="mt-2 text-muted-foreground">
                            Les produits les plus populaires du moment
                        </p>
                    </div>
                    <Button variant="link" className="gap-1" asChild>
                        <Link
                            href={route('tenant.products.index', {
                                sort: 'popular',
                            })}
                        >
                            Voir plus
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </header>

                <div className="grid grid-cols-2 gap-4 px-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
                    {products.map((product: Product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}
