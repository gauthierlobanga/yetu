import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/layouts/main-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Posts',
        href: route('post.list'),
    },
];

export default function Cookies() {
    return (
        <MainLayout breadcrumbs={breadcrumbs}>
            <Head title="Contactez-nous" />
            <section className="py-14 lg:py-20"></section>
        </MainLayout>
    );
}
