import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import MainLayout from '@/layouts/main-layout';

export default function Required() {
    return (
        <MainLayout>
            <Head title="Abonnement requis" />
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
                <h1 className="text-3xl font-bold">Période d’essai terminée</h1>
                <p className="mt-4 max-w-md text-muted-foreground">
                    Votre essai gratuit a expiré. Pour continuer à utiliser
                    votre boutique, veuillez passer à un plan payant.
                </p>
                <Button asChild className="mt-8">
                    <Link href={route('vendor.payment')}>Choisir un plan</Link>
                </Button>
            </div>
        </MainLayout>
    );
}
