import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { list } from '@/routes/post';
import type { BreadcrumbItem } from '@/types';

// import { Post } from '@/types/post';

// interface Props {

//     post: Post[],
// }

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Post',
        href: list(),
        // href: edit(post),
    },
];

export default function Edit() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="List post" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1>Post Edit</h1>
            </div>
        </AppLayout>
    );
}
