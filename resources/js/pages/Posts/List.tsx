'use client';
// resources/js/Pages/Posts/List.tsx

import { Head, router } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { DeleteModal } from '@/components/posts/DeleteModal';
import { PostBulkActions } from '@/components/posts/PostBulkActions';
import { PostFiltersComponent } from '@/components/posts/PostFilters';
import { PostFormSheet } from '@/components/posts/PostFormSheet';
import { PostTable } from '@/components/posts/PostTable';
import { Button } from '@/components/ui/button';
import { CanRole } from '@/core/permissions/Can';
import { usePermissions } from '@/core/permissions/usePermissions';
import { usePosts } from '@/hooks/posts/usePosts';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Category } from '@/types/posts/category';
import type { PostFormData } from '@/types/posts/post-form';
import type { Post, PostsResponse, PostFilters } from '@/types/posts/posts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Posts',
        href: route('post.list'),
    },
];

interface Props {
    posts: PostsResponse;
    categories: {
        data: Category[];
    };
    tags?: Array<{
        id: number;
        name: string;
        slug: string;
        count?: number;
    }>;
    filters: {
        search?: string;
        status?: string;
        category_id?: string;
        sort?: string;
        direction?: string;
        page?: number;
    };
    statuses: Record<string, string>;
}

export default function List({
    posts: initialPosts,
    categories,
    tags = [],
    filters: initialFilters, // 🔥 Renommé pour éviter la confusion
    statuses,
}: Props) {
    const { debug } = usePermissions();

    const transformedFilters: PostFilters = React.useMemo(() => {
        // Fonction helper pour nettoyer une valeur
        const cleanValue = <T,>(value: T): T | undefined => {
            if (value === null || value === undefined) {
                return undefined;
            }

            if (typeof value === 'string' && value.trim() === '') {
                return undefined;
            }

            if (typeof value === 'function') {
                return undefined;
            } // 🔥 Ignorer les fonctions

            return value;
        };

        // Nettoyer chaque propriété
        const search = cleanValue(initialFilters.search);
        const status = cleanValue(initialFilters.status);

        let category_id: number | undefined = undefined;

        if (initialFilters.category_id) {
            const parsed = parseInt(initialFilters.category_id, 10);

            if (!isNaN(parsed)) {
                category_id = parsed;
            }
        }

        // 🔥 CORRECTION CRITIQUE: S'assurer que sort est une chaîne valide
        let sort: string | undefined = undefined;

        if (
            initialFilters.sort &&
            typeof initialFilters.sort === 'string' &&
            initialFilters.sort !== 'function sort() { [native code] }' && // Ignorer la fonction native
            initialFilters.sort !== 'published_at'
        ) {
            // Ignorer le tri par défaut
            sort = initialFilters.sort;
        }

        // 🔥 CORRECTION: S'assurer que direction est une chaîne valide
        let direction: 'asc' | 'desc' | undefined = undefined;

        if (
            initialFilters.direction &&
            typeof initialFilters.direction === 'string' &&
            (initialFilters.direction === 'asc' ||
                initialFilters.direction === 'desc') &&
            (sort !== undefined || initialFilters.sort !== 'published_at')
        ) {
            direction = initialFilters.direction as 'asc' | 'desc';
        }

        const page = initialFilters.page || 1;

        return {
            search,
            status,
            category_id,
            sort,
            direction,
            page,
        };
    }, [initialFilters]);

    console.log('🔍 Transformed filters:', transformedFilters); // Pour debug

    const {
        posts: postsData,
        pagination,
        filters: currentFilters,
        selectedPosts,
        processing,
        statusColors,
        categories: categoriesList,
        updateFilters,
        changePage,
        deletePost,
        togglePin,
        duplicatePost,
        bulkDelete,
        bulkStatus,
        selectAll,
        selectPost,
    } = usePosts({
        initialPosts: initialPosts,
        initialFilters: transformedFilters,
        categories: categories.data,
        statuses,
    });

    const [postToDelete, setPostToDelete] = useState<number | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [formOpen, setFormOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | undefined>();

    if (import.meta.env.DEV) {
        debug();
    }

    const handleDeleteClick = (postId: number) => {
        setPostToDelete(postId);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (postToDelete) {
            await deletePost(postToDelete);
            setShowDeleteModal(false);
            setPostToDelete(null);
        }
    };

    const handleBulkDeleteClick = (): void => {
        if (selectedPosts.length === 0) {
            return;
        }

        setPostToDelete(null);
        setShowDeleteModal(true);
    };

    const handleConfirmBulkDelete = async () => {
        await bulkDelete();
        setShowDeleteModal(false);
    };

    const handleEdit = (post?: Post) => {
        setEditingPost(post);
        setFormOpen(true);
    };

    const handleFormSubmit = (data: PostFormData) => {
        const formData = new FormData();

        // Ajouter toutes les données au FormData
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (key === 'tags' && Array.isArray(value)) {
                    formData.append(key, JSON.stringify(value));
                } else if (key === 'featured_image' && value instanceof File) {
                    formData.append(key, value);
                } else if (key === 'categories' && Array.isArray(value)) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, String(value));
                }
            }
        });

        if (editingPost) {
            router.put(route('post.update', editingPost.id), formData, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Post mis à jour avec succès');
                    setFormOpen(false);
                    setEditingPost(undefined);
                    // Recharger les posts après modification
                    router.reload({ only: ['posts'] });
                },
                onError: (errors) => {
                    console.error('Erreur mise à jour:', errors);
                    toast.error('Erreur lors de la mise à jour');
                },
            });
        } else {
            router.post(route('post.store'), formData, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Post créé avec succès');
                    setFormOpen(false);
                    router.reload({ only: ['posts'] });
                },
                onError: (errors) => {
                    console.error('Erreur création:', errors);
                    toast.error('Erreur lors de la création');
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Liste des posts" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* En-tête */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Mes posts</h1>
                    <div className="space-x-3">
                        <Button
                            onClick={() => handleEdit()}
                            className="cursor-pointer"
                        >
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Nouveau post
                        </Button>
                        <CanRole roles="super_admin">
                            <Button
                                onClick={() => handleEdit()}
                                className="cursor-pointer"
                            >
                                <PlusIcon className="mr-2 h-4 w-4" />
                                Admin panel
                            </Button>
                        </CanRole>
                    </div>
                </div>

                {/* Filtres et actions en masse */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <PostFiltersComponent
                        filters={currentFilters}
                        categories={categoriesList}
                        statuses={statuses}
                        processing={processing}
                        onFilterChange={updateFilters}
                    />
                    <PostBulkActions
                        selectedCount={selectedPosts.length}
                        statuses={statuses}
                        processing={processing}
                        onBulkStatus={bulkStatus}
                        onBulkDelete={handleBulkDeleteClick}
                    />
                </div>

                {/* Tableau des posts */}
                <PostTable
                    posts={postsData}
                    selectedPosts={selectedPosts}
                    processing={processing}
                    statusColors={statusColors}
                    onSelectAll={selectAll}
                    onSelectPost={selectPost}
                    onDelete={handleDeleteClick}
                    onTogglePin={togglePin}
                    onDuplicate={duplicatePost}
                    onEdit={handleEdit}
                    pagination={pagination}
                    onPageChange={changePage}
                />
            </div>

            {/* Modal de suppression */}
            <DeleteModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setPostToDelete(null);
                }}
                onConfirm={
                    postToDelete ? handleConfirmDelete : handleConfirmBulkDelete
                }
                title={
                    postToDelete
                        ? 'Supprimer le post'
                        : 'Supprimer plusieurs posts'
                }
                description={
                    postToDelete
                        ? 'Êtes-vous sûr de vouloir supprimer ce post ? Cette action est irréversible.'
                        : `Êtes-vous sûr de vouloir supprimer ${selectedPosts.length} post(s) ? Cette action est irréversible.`
                }
                isDeleting={processing}
            />

            {/* Sheet Formulaire */}
            <PostFormSheet
                open={formOpen}
                onOpenChange={setFormOpen}
                post={editingPost}
                categories={categories.data}
                tags={tags}
                statuses={statuses}
                onSubmit={handleFormSubmit}
                isSubmitting={processing}
            />
        </AppLayout>
    );
}
