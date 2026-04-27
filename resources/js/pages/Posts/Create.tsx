import { Head } from '@inertiajs/react';
import { create } from '@/actions/App/Http/Controllers/Posts/PostController';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Post',
        href: create(),
    },
];

export default function Create() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="List post" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1>Post Create</h1>
            </div>
        </AppLayout>
    );
}
