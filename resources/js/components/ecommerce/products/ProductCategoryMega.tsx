import { usePage } from '@inertiajs/react';
import type { MegaMenuCategory } from './ExplorerProductCategory';
import { ProductCategoriesMega } from './ExplorerProductCategory';

interface ProductCategoryPageProps {
    [key: string]: unknown;
    megaMenuCategories?: MegaMenuCategory[];
}

export function ProductCategoryMega() {
    const { megaMenuCategories = [] } =
        usePage<ProductCategoryPageProps>().props;

    return <ProductCategoriesMega categories={megaMenuCategories} />;
}
