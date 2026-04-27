import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Post',
        href: dashboard(),
    },
];

export default function Show() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="List post" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1>Post Show</h1>
            </div>
        </AppLayout>
    );
}
