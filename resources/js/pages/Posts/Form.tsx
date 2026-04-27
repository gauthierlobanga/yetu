// resources/js/Pages/Posts/Form.tsx

import { Head, router } from '@inertiajs/react';
import React from 'react';
import { toast } from 'sonner';
import { PostForm } from '@/components/posts/PostForm/index';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Category } from '@/types/posts/category';
import type { PostFormData } from '@/types/posts/post-form';
import type { Post } from '@/types/posts/posts';

interface Props {
    post?: {
        data: Post;
    };
    categories: {
        data: Category[];
    };
    tags?: Array<{
        id: number;
        name: string;
        slug: string;
        count?: number;
    }>;
    statuses: Record<string, string>;
}

export default function PostFormPage({
    post,
    categories,
    tags = [],
    statuses,
}: Props) {
    // CORRECTION: Extraire le post de la structure paginée
    const postData = post?.data;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Posts',
            href: route('post.list'),
        },
        {
            title: postData ? 'Modifier' : 'Créer',
            href: postData
                ? route('post.edit', postData.id)
                : route('post.create'),
        },
    ];

    // CORRECTION: Convertir PostFormData en Record<string, any> pour Inertia
    const handleSubmit = (data: PostFormData) => {
        // Convertir en objet simple pour Inertia
        const formData: Record<string, any> = { ...data };

        if (postData) {
            // Mise à jour
            router.put(route('post.update', postData.id), formData, {
                onSuccess: () => {
                    toast.success('Post mis à jour avec succès');
                    router.visit(route('post.list'));
                },
                onError: (errors) => {
                    console.error('Erreur mise à jour:', errors);
                    toast.error('Erreur lors de la mise à jour');
                },
            });
        } else {
            // Création
            router.post(route('post.store'), formData, {
                onSuccess: () => {
                    toast.success('Post créé avec succès');
                    router.visit(route('post.list'));
                },
                onError: (errors) => {
                    console.error('Erreur création:', errors);
                    toast.error('Erreur lors de la création');
                },
            });
        }
    };

    const handleCancel = () => {
        router.visit(route('post.list'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={postData ? 'Modifier' : 'Créer'} />

            <div className="container mx-auto py-6">
                <PostForm
                    post={postData} // Utiliser postData au lieu de post
                    categories={categories.data}
                    tags={tags}
                    statuses={statuses}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            </div>
        </AppLayout>
    );
}
