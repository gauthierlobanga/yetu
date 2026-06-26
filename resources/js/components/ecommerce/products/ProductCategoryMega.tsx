// resources/js/components/navigation/ProductsMenuContent.tsx
import { usePage } from '@inertiajs/react';
import { ProductCategoriesMega } from './ExplorerProductCategory';

export function ProductCategoryMega() {
    const { megaMenuCategories } = usePage().props as any;

    if (!megaMenuCategories || megaMenuCategories.length === 0) {
        return null;
    }

    return <ProductCategoriesMega categories={megaMenuCategories} />;
}
