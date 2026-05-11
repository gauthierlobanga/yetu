// resources/js/Pages/Shop/Cart/Index.tsx
import { Head } from '@inertiajs/react';
import CartContent from '@/components/ecommerce/cart/CartContent';
import MainLayout from '@/layouts/main-layout';

export default function CartIndex() {
    return (
        <MainLayout>
            <Head title="Panier" />
            <div className="lg:18 container mx-auto sm:px-14 md:py-16">
                <h1 className="mb-6 text-2xl font-semibold tracking-tight">
                    Votre panier
                </h1>
                <CartContent />
            </div>
        </MainLayout>
    );
}
