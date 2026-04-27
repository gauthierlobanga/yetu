// resources/js/hooks/posts/usePosts.tsx

// import { router } from '@inertiajs/react';
// import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
// import { toast } from 'sonner';
// import type { Category } from '@/types/posts/category';
// import type { Post, PostFilters, PostsResponse } from '@/types/posts/posts';

// interface UsePostsProps {
//     initialPosts: PostsResponse;
//     initialFilters: PostFilters;
//     categories: Category[];
//     statuses: Record<string, string>;
// }

// export function usePosts({
//     initialPosts,
//     initialFilters,
//     categories,
//     statuses,
// }: UsePostsProps) {
//     const [posts, setPosts] = useState(initialPosts.data);
//     const [pagination, setPagination] = useState({
//         current_page: initialPosts.current_page,
//         last_page: initialPosts.last_page,
//         total: initialPosts.total,
//         from: initialPosts.from,
//         to: initialPosts.to,
//     });
//     const [filters, setFilters] = useState<PostFilters>(initialFilters);
//     const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
//     const [processing, setProcessing] = useState(false);

//     const isMounted = useRef(true);
//     const requestInProgress = useRef(false);

//     useEffect(() => {
//         isMounted.current = true;

//         return () => {
//             isMounted.current = false;
//         };
//     }, []);

//     const statusColors = useMemo(
//         () => ({
//             draft: 'bg-gray-100 text-gray-800',
//             published:
//                 'bg-green-300/20 dark:bg-green-800/20 text-green-800 dark:text-green-400',
//             scheduled: 'bg-yellow-100 text-yellow-800',
//             expired: 'bg-red-100 text-red-800',
//             archived: 'bg-gray-100 text-gray-800',
//         }),
//         [],
//     );

//     // 🔥 Fonction pour construire les paramètres sans valeurs par défaut
//     const buildParams = (newFilters: Partial<PostFilters>, page?: number) => {
//         const params: Record<string, any> = {};

//         // N'ajouter que les filtres qui ont des valeurs
//         if (newFilters.search) {
//             params.search = newFilters.search;
//         }

//         if (newFilters.status) {
//             params.status = newFilters.status;
//         }

//         if (newFilters.category_id) {
//             params.category_id = newFilters.category_id;
//         }

//         // N'ajouter le tri que s'il n'est pas par défaut
//         if (newFilters.sort && newFilters.sort !== 'created_at') {
//             params.sort = newFilters.sort;

//             if (newFilters.direction && newFilters.direction !== 'desc') {
//                 params.direction = newFilters.direction;
//             }
//         }

//         // N'ajouter la page que si ce n'est pas la page 1
//         if (page && page > 1) {
//             params.page = page;
//         }

//         return params;
//     };

//     // Mise à jour des filtres
//     const updateFilters = useCallback(
//         (newFilters: Partial<PostFilters>) => {
//             if (requestInProgress.current) {
//                 return;
//             }

//             const updatedFilters = { ...filters, ...newFilters };
//             setFilters(updatedFilters);

//             setProcessing(true);
//             requestInProgress.current = true;

//             // 🔥 Construire les paramètres sans valeurs par défaut
//             const params = buildParams(updatedFilters, 1);

//             router.get(route('post.list'), params, {
//                 preserveState: true,
//                 preserveScroll: true,
//                 only: ['posts', 'filters'],
//                 onSuccess: (page: any) => {
//                     if (!isMounted.current) {
//                         return;
//                     }

//                     setPosts(page.props.posts.data);
//                     setPagination({
//                         current_page: page.props.posts.current_page,
//                         last_page: page.props.posts.last_page,
//                         total: page.props.posts.total,
//                         from: page.props.posts.from,
//                         to: page.props.posts.to,
//                     });
//                     setProcessing(false);
//                     requestInProgress.current = false;
//                 },
//                 onError: () => {
//                     if (!isMounted.current) {
//                         return;
//                     }

//                     setProcessing(false);
//                     requestInProgress.current = false;
//                     toast.error('Erreur lors du chargement');
//                 },
//             });
//         },
//         [filters],
//     );

//     // Réinitialiser les filtres
//     const resetFilters = useCallback(() => {
//         if (requestInProgress.current) {
//             return;
//         }

//         setFilters({});
//         setProcessing(true);
//         requestInProgress.current = true;

//         // 🔥 Pas de paramètres du tout
//         router.get(
//             route('post.list'),
//             {},
//             {
//                 preserveState: true,
//                 preserveScroll: true,
//                 only: ['posts', 'filters'],
//                 onSuccess: (page: any) => {
//                     if (!isMounted.current) {
//                         return;
//                     }

//                     setPosts(page.props.posts.data);
//                     setPagination({
//                         current_page: page.props.posts.current_page,
//                         last_page: page.props.posts.last_page,
//                         total: page.props.posts.total,
//                         from: page.props.posts.from,
//                         to: page.props.posts.to,
//                     });
//                     setProcessing(false);
//                     requestInProgress.current = false;
//                 },
//                 onError: () => {
//                     if (!isMounted.current) {
//                         return;
//                     }

//                     setProcessing(false);
//                     requestInProgress.current = false;
//                     toast.error('Erreur lors de la réinitialisation');
//                 },
//             },
//         );
//     }, []);

//     // Changer de page
//     const changePage = useCallback(
//         (page: number) => {
//             if (requestInProgress.current) {
//                 return;
//             }

//             setProcessing(true);
//             requestInProgress.current = true;

//             // 🔥 Construire les paramètres avec la page
//             const params = buildParams(filters, page);

//             router.get(route('post.list'), params, {
//                 preserveState: true,
//                 preserveScroll: true,
//                 only: ['posts'],
//                 onSuccess: (page: any) => {
//                     if (!isMounted.current) {
//                         return;
//                     }

//                     setPosts(page.props.posts.data);
//                     setPagination({
//                         current_page: page.props.posts.current_page,
//                         last_page: page.props.posts.last_page,
//                         total: page.props.posts.total,
//                         from: page.props.posts.from,
//                         to: page.props.posts.to,
//                     });
//                     setProcessing(false);
//                     requestInProgress.current = false;
//                 },
//                 onError: () => {
//                     if (!isMounted.current) {
//                         return;
//                     }

//                     setProcessing(false);
//                     requestInProgress.current = false;
//                     toast.error('Erreur lors du changement de page');
//                 },
//             });
//         },
//         [filters],
//     );

//     // Supprimer un post
//     const deletePost = useCallback(async (postId: number) => {
//         setProcessing(true);
//         const toastId = toast.loading('Suppression en cours...');

//         try {
//             await new Promise((resolve, reject) => {
//                 router.delete(route('post.destroy', postId), {
//                     onSuccess: () => {
//                         if (!isMounted.current) {
//                             return;
//                         }

//                         setPosts((prev) => prev.filter((p) => p.id !== postId));
//                         setPagination((prev) => ({
//                             ...prev,
//                             total: prev.total - 1,
//                         }));
//                         toast.dismiss(toastId);
//                         toast.success('Post supprimé avec succès');
//                         resolve(true);
//                     },
//                     onError: (errors) => {
//                         toast.dismiss(toastId);
//                         toast.error('Erreur lors de la suppression');
//                         reject(errors);
//                     },
//                     onFinish: () => {
//                         if (!isMounted.current) {
//                             return;
//                         }

//                         setProcessing(false);
//                     },
//                 });
//             });
//         } catch (error) {
//             console.error('Erreur suppression:', error);
//         }
//     }, []);

//     // Épingler/Désépingler un post
//     const togglePin = useCallback(async (post: Post) => {
//         setProcessing(true);
//         const action = post.is_pinned ? 'Désépinglage' : 'Épinglage';
//         const toastId = toast.loading(`${action} en cours...`);

//         try {
//             await new Promise((resolve, reject) => {
//                 router.post(
//                     route('post.toggle-pin', post.id),
//                     {},
//                     {
//                         onSuccess: () => {
//                             if (!isMounted.current) {
//                                 return;
//                             }

//                             setPosts((prev) =>
//                                 prev.map((p) =>
//                                     p.id === post.id
//                                         ? { ...p, is_pinned: !p.is_pinned }
//                                         : p,
//                                 ),
//                             );
//                             toast.dismiss(toastId);
//                             toast.success(
//                                 post.is_pinned
//                                     ? 'Post désépinglé'
//                                     : 'Post épinglé',
//                             );
//                             resolve(true);
//                         },
//                         onError: (errors) => {
//                             toast.dismiss(toastId);
//                             toast.error("Erreur lors de l'opération");
//                             reject(errors);
//                         },
//                         onFinish: () => {
//                             if (!isMounted.current) {
//                                 return;
//                             }

//                             setProcessing(false);
//                         },
//                     },
//                 );
//             });
//         } catch (error) {
//             console.error('Erreur toggle pin:', error);
//         }
//     }, []);

//     // Dupliquer un post
//     const duplicatePost = useCallback(async (post: Post) => {
//         setProcessing(true);
//         const toastId = toast.loading('Duplication en cours...');

//         try {
//             await new Promise((resolve, reject) => {
//                 router.post(
//                     route('post.duplicate', post.id),
//                     {},
//                     {
//                         onSuccess: (response: any) => {
//                             if (!isMounted.current) {
//                                 return;
//                             }

//                             toast.dismiss(toastId);
//                             toast.success('Post dupliqué avec succès', {
//                                 action: response.props.flash?.new_post_id
//                                     ? {
//                                           label: 'Modifier la copie',
//                                           onClick: () =>
//                                               router.get(
//                                                   route(
//                                                       'post.edit',
//                                                       response.props.flash
//                                                           .new_post_id,
//                                                   ),
//                                               ),
//                                       }
//                                     : undefined,
//                             });
//                             resolve(true);
//                         },
//                         onError: (errors) => {
//                             toast.dismiss(toastId);
//                             toast.error('Erreur lors de la duplication');
//                             reject(errors);
//                         },
//                         onFinish: () => {
//                             if (!isMounted.current) {
//                                 return;
//                             }

//                             setProcessing(false);
//                         },
//                     },
//                 );
//             });
//         } catch (error) {
//             console.error('Erreur duplication:', error);
//         }
//     }, []);

//     // Actions en masse
//     const bulkDelete = useCallback(async () => {
//         if (selectedPosts.length === 0) {
//             return;
//         }

//         setProcessing(true);
//         const toastId = toast.loading(
//             `Suppression de ${selectedPosts.length} post(s)...`,
//         );

//         try {
//             await new Promise((resolve, reject) => {
//                 router.post(
//                     route('post.bulk-delete'),
//                     { ids: selectedPosts },
//                     {
//                         onSuccess: () => {
//                             if (!isMounted.current) {
//                                 return;
//                             }

//                             setPosts((prev) =>
//                                 prev.filter(
//                                     (p) => !selectedPosts.includes(p.id),
//                                 ),
//                             );
//                             setSelectedPosts([]);
//                             setPagination((prev) => ({
//                                 ...prev,
//                                 total: prev.total - selectedPosts.length,
//                             }));
//                             toast.dismiss(toastId);
//                             toast.success(
//                                 `${selectedPosts.length} post(s) supprimé(s)`,
//                             );
//                             resolve(true);
//                         },
//                         onError: (errors) => {
//                             toast.dismiss(toastId);
//                             toast.error('Erreur lors de la suppression');
//                             reject(errors);
//                         },
//                         onFinish: () => {
//                             if (!isMounted.current) {
//                                 return;
//                             }

//                             setProcessing(false);
//                         },
//                     },
//                 );
//             });
//         } catch (error) {
//             console.error('Erreur suppression multiple:', error);
//         }
//     }, [selectedPosts]);

//     const bulkStatus = useCallback(
//         async (status: string) => {
//             if (selectedPosts.length === 0) {
//                 return;
//             }

//             setProcessing(true);

//             const statusLabel = statuses[status].toLowerCase();
//             const toastId = toast.loading(
//                 `Mise à jour de ${selectedPosts.length} post(s)...`,
//             );

//             try {
//                 await new Promise((resolve, reject) => {
//                     router.post(
//                         route('post.bulk-status'),
//                         { ids: selectedPosts, status },
//                         {
//                             onSuccess: () => {
//                                 if (!isMounted.current) {
//                                     return;
//                                 }

//                                 setPosts((prev) =>
//                                     prev.map((p) =>
//                                         selectedPosts.includes(p.id)
//                                             ? {
//                                                   ...p,
//                                                   status: status as Post['status'],
//                                               }
//                                             : p,
//                                     ),
//                                 );
//                                 setSelectedPosts([]);
//                                 toast.dismiss(toastId);
//                                 toast.success(
//                                     `${selectedPosts.length} post(s) marqué(s) comme ${statusLabel}`,
//                                 );
//                                 resolve(true);
//                             },
//                             onError: (errors) => {
//                                 toast.dismiss(toastId);
//                                 toast.error('Erreur lors de la mise à jour');
//                                 reject(errors);
//                             },
//                             onFinish: () => {
//                                 if (!isMounted.current) {
//                                     return;
//                                 }

//                                 setProcessing(false);
//                             },
//                         },
//                     );
//                 });
//             } catch (error) {
//                 console.error('Erreur mise à jour multiple:', error);
//             }
//         },
//         [selectedPosts, statuses],
//     );

//     // Sélection
//     const selectAll = useCallback(() => {
//         if (selectedPosts.length === posts.length) {
//             setSelectedPosts([]);
//         } else {
//             setSelectedPosts(posts.map((p) => p.id));
//         }
//     }, [posts, selectedPosts]);

//     const selectPost = useCallback((postId: number) => {
//         setSelectedPosts((prev) =>
//             prev.includes(postId)
//                 ? prev.filter((id) => id !== postId)
//                 : [...prev, postId],
//         );
//     }, []);

//     return {
//         posts,
//         pagination,
//         filters,
//         selectedPosts,
//         processing,
//         statusColors,
//         categories,
//         statuses,
//         updateFilters,
//         resetFilters,
//         changePage,
//         deletePost,
//         togglePin,
//         duplicatePost,
//         bulkDelete,
//         bulkStatus,
//         selectAll,
//         selectPost,
//         setSelectedPosts,
//     };
// }
// resources/js/components/posts/PostFilters.tsx
// resources/js/hooks/posts/usePosts.tsx
import { router } from '@inertiajs/react';
import { useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import type { Category } from '@/types/posts/category';
import type { Post, PostsResponse, PostFilters } from '@/types/posts/posts';

interface UsePostsOptions {
    initialPosts: PostsResponse;
    initialFilters: PostFilters;
    categories: Category[];
    statuses: Record<string, string>;
}

interface UsePostsReturn {
    // Données
    posts: Post[];
    pagination: {
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
    };
    filters: PostFilters;
    selectedPosts: number[];
    processing: boolean;
    statusColors: Record<string, string>;
    categories: Category[];

    // Actions
    updateFilters: (newFilters: Partial<PostFilters>) => void;
    changePage: (page: number) => void;
    deletePost: (postId: number) => Promise<void>;
    togglePin: (post: Post) => Promise<void>;
    duplicatePost: (post: Post) => Promise<void>;
    bulkDelete: () => Promise<void>;
    bulkStatus: (status: string) => Promise<void>;
    selectAll: () => void;
    selectPost: (postId: number) => void;
    clearSelection: () => void;
}

export function usePosts({
    initialPosts,
    initialFilters,
    categories,
    statuses,
}: UsePostsOptions): UsePostsReturn {
    const cleanFilters = useMemo(() => {
        const cleaned: PostFilters = {
            search: initialFilters.search,
            status: initialFilters.status,
            category_id: initialFilters.category_id,
            page: initialFilters.page,
        };

        // Ne garder sort que si c'est une chaîne valide
        if (initialFilters.sort && typeof initialFilters.sort === 'string') {
            cleaned.sort = initialFilters.sort;
        }

        // Ne garder direction que si c'est une chaîne valide
        if (
            initialFilters.direction &&
            (initialFilters.direction === 'asc' ||
                initialFilters.direction === 'desc')
        ) {
            cleaned.direction = initialFilters.direction;
        }

        return cleaned;
    }, [initialFilters]);

    const [postsData, setPostsData] = useState<PostsResponse>(initialPosts);
    // const [filters, setFilters] = useState<PostFilters>(initialFilters);
    const [selectedPosts, setSelectedPosts] = useState<number[]>([]);
    const [processing, setProcessing] = useState(false);

    const [filters, setFilters] = useState<PostFilters>(cleanFilters);

    // Couleurs pour les statuts
    const statusColors: Record<string, string> = {
        draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        published:
            'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        scheduled:
            'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        archived:
            'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
        pending:
            'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    };

    // Pagination
    const pagination = useMemo(
        () => ({
            current_page: postsData.current_page,
            last_page: postsData.last_page,
            from: postsData.from || 0,
            to: postsData.to || 0,
            total: postsData.total,
        }),
        [postsData],
    );

    // Dans usePosts.tsx - mémoïser updateFilters
    const updateFilters = useCallback(
        (newFilters: Partial<PostFilters>) => {
            // Éviter les mises à jour inutiles si les filtres sont identiques
            const hasChanges = Object.entries(newFilters).some(
                ([key, value]) => {
                    return filters[key as keyof PostFilters] !== value;
                },
            );

            if (!hasChanges) {
                return;
            }

            setProcessing(true);
            const updatedFilters = { ...filters, ...newFilters };

            router.get(
                route('post.list'),
                { ...updatedFilters, page: 1 },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    only: ['posts', 'filters'],
                    onSuccess: (page) => {
                        const pageProps = page.props as unknown as {
                            posts: PostsResponse;
                            filters: PostFilters;
                        };
                        setPostsData(pageProps.posts);
                        setFilters(pageProps.filters);
                        setProcessing(false);
                        setSelectedPosts([]);
                    },
                    onError: () => {
                        setProcessing(false);
                        toast.error('Erreur lors du filtrage');
                    },
                },
            );
        },
        [filters],
    ); // Garder filters comme dépendance
    // Changer de page
    const changePage = useCallback(
        (page: number) => {
            setProcessing(true);

            router.get(
                route('post.list'),
                { ...filters, page },
                {
                    preserveState: true,
                    preserveScroll: true,
                    only: ['posts', 'filters'],
                    onSuccess: (page) => {
                        const pageProps = page.props as unknown as {
                            posts: PostsResponse;
                            filters: PostFilters;
                        };
                        setPostsData(pageProps.posts);
                        setProcessing(false);
                        setSelectedPosts([]);
                    },
                    onError: () => {
                        setProcessing(false);
                        toast.error('Erreur lors du chargement de la page');
                    },
                },
            );
        },
        [filters],
    );

    // Supprimer un post
    const deletePost = useCallback(async (postId: number) => {
        setProcessing(true);

        return new Promise<void>((resolve, reject) => {
            router.delete(route('post.destroy', postId), {
                preserveState: true,
                preserveScroll: true,
                onSuccess: (page) => {
                    const pageProps = page.props as unknown as {
                        posts: PostsResponse;
                    };
                    setPostsData(pageProps.posts);
                    setSelectedPosts((prev) =>
                        prev.filter((id) => id !== postId),
                    );
                    setProcessing(false);
                    toast.success('Post supprimé avec succès');
                    resolve();
                },
                onError: (errors) => {
                    setProcessing(false);
                    console.error('Erreur suppression:', errors);
                    toast.error('Erreur lors de la suppression');
                    reject(errors);
                },
            });
        });
    }, []);

    // Épingler/Désépingler un post
    const togglePin = useCallback(async (post: Post) => {
        setProcessing(true);

        return new Promise<void>((resolve, reject) => {
            router.patch(
                route('post.toggle-pin', post.id),
                {},
                {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: (page) => {
                        const pageProps = page.props as unknown as {
                            posts: PostsResponse;
                        };
                        setPostsData(pageProps.posts);
                        setProcessing(false);
                        toast.success(
                            post.is_pinned ? 'Post désépinglé' : 'Post épinglé',
                        );
                        resolve();
                    },
                    onError: (errors) => {
                        setProcessing(false);
                        console.error('Erreur toggle pin:', errors);
                        toast.error("Erreur lors de l'opération");
                        reject(errors);
                    },
                },
            );
        });
    }, []);

    // Dupliquer un post
    const duplicatePost = useCallback(async (post: Post) => {
        setProcessing(true);

        return new Promise<void>((resolve, reject) => {
            router.post(
                route('post.duplicate', post.id),
                {},
                {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: (page) => {
                        const pageProps = page.props as unknown as {
                            posts: PostsResponse;
                        };
                        setPostsData(pageProps.posts);
                        setProcessing(false);
                        toast.success('Post dupliqué avec succès');
                        resolve();
                    },
                    onError: (errors) => {
                        setProcessing(false);
                        console.error('Erreur duplication:', errors);
                        toast.error('Erreur lors de la duplication');
                        reject(errors);
                    },
                },
            );
        });
    }, []);

    // Suppression en masse
    const bulkDelete = useCallback(async () => {
        if (selectedPosts.length === 0) {
            toast.warning('Aucun post sélectionné');
            return;
        }

        setProcessing(true);

        return new Promise<void>((resolve, reject) => {
            router.delete(route('post.bulk-destroy'), {
                data: { ids: selectedPosts },
                preserveState: true,
                preserveScroll: true,
                onSuccess: (page) => {
                    const pageProps = page.props as unknown as {
                        posts: PostsResponse;
                    };
                    setPostsData(pageProps.posts);
                    setSelectedPosts([]);
                    setProcessing(false);
                    toast.success(
                        `${selectedPosts.length} post(s) supprimé(s)`,
                    );
                    resolve();
                },
                onError: (errors) => {
                    setProcessing(false);
                    console.error('Erreur suppression multiple:', errors);
                    toast.error('Erreur lors de la suppression multiple');
                    reject(errors);
                },
            });
        });
    }, [selectedPosts]);

    // Changement de statut en masse
    const bulkStatus = useCallback(
        async (status: string) => {
            if (selectedPosts.length === 0) {
                toast.warning('Aucun post sélectionné');
                return;
            }

            setProcessing(true);

            return new Promise<void>((resolve, reject) => {
                router.patch(
                    route('post.bulk-status'),
                    { ids: selectedPosts, status },
                    {
                        preserveState: true,
                        preserveScroll: true,
                        onSuccess: (page) => {
                            const pageProps = page.props as unknown as {
                                posts: PostsResponse;
                            };
                            setPostsData(pageProps.posts);
                            setSelectedPosts([]);
                            setProcessing(false);
                            toast.success(
                                `Statut mis à jour pour ${selectedPosts.length} post(s)`,
                            );
                            resolve();
                        },
                        onError: (errors) => {
                            setProcessing(false);
                            console.error('Erreur mise à jour statut:', errors);
                            toast.error(
                                'Erreur lors de la mise à jour des statuts',
                            );
                            reject(errors);
                        },
                    },
                );
            });
        },
        [selectedPosts],
    );

    // Sélectionner tous les posts
    const selectAll = useCallback(() => {
        if (selectedPosts.length === postsData.data.length) {
            setSelectedPosts([]);
        } else {
            setSelectedPosts(postsData.data.map((post) => post.id));
        }
    }, [postsData.data, selectedPosts.length]);

    // Sélectionner un post individuel
    const selectPost = useCallback((postId: number) => {
        setSelectedPosts((prev) =>
            prev.includes(postId)
                ? prev.filter((id) => id !== postId)
                : [...prev, postId],
        );
    }, []);

    // Effacer la sélection
    const clearSelection = useCallback(() => {
        setSelectedPosts([]);
    }, []);

    return {
        // Données
        posts: postsData.data,
        pagination,
        filters,
        selectedPosts,
        processing,
        statusColors,
        categories,

        // Actions
        updateFilters,
        changePage,
        deletePost,
        togglePin,
        duplicatePost,
        bulkDelete,
        bulkStatus,
        selectAll,
        selectPost,
        clearSelection,
    };
}

// Export par défaut pour compatibilité
export default usePosts;
