/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/components/data-table-post.tsx
'use client';

import {
    closestCenter,
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent, UniqueIdentifier } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { router, usePage } from '@inertiajs/react';
import {
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import type {
    ColumnDef,
    ColumnFiltersState,
    Row,
    SortingState,
    VisibilityState,
} from '@tanstack/react-table';
import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    GripVertical,
    LayoutIcon,
    Loader2,
    Plus,
    CheckCircle2,
    MoreVertical,
    TriangleAlert,
    Trash2,
    Copy,
    ExternalLink,
    Calendar,
    Tag,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import * as React from 'react';
import { toast } from 'sonner';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useIsMobile } from '@/hooks/use-mobile';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from './ui/drawer';

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------
interface Category {
    id: number;
    nom: string;
    slug: string;
    color: string | null;
}

interface User {
    id: number;
    name: string;
    email: string;
    avatar_url: string | null;
}

export interface Post {
    id: number;
    title: string;
    slug: string;
    status: 'draft' | 'published' | 'scheduled' | 'expired' | 'archived';
    status_label: string;
    status_color: string;
    views_count: number;
    likes_count: number;
    comments_count: number;
    user?: User;
    categories?: Category[];
    published_at: string | null;
    created_at: string;
    featured_image_url: string | null;
    excerpt: string | null;
    url: string;
}

interface DataTableProps {
    posts: {
        data: Post[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
        per_page: number;
    };
    filters?: {
        search?: string;
        status?: string;
    };
}

// ----------------------------------------------------------------------
// Ligne draggable
// ----------------------------------------------------------------------
function DraggableRow({ row }: { row: Row<Post> }) {
    const {
        transform,
        transition,
        setNodeRef,
        listeners,
        attributes,
        isDragging,
    } = useSortable({ id: row.original.id });

    return (
        <TableRow
            ref={setNodeRef}
            data-state={row.getIsSelected() && 'selected'}
            data-dragging={isDragging}
            className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
            }}
        >
            <TableCell>
                <Button
                    {...listeners}
                    {...attributes}
                    variant="ghost"
                    size="icon"
                    className="size-7 cursor-grab text-slate-400 hover:bg-transparent"
                >
                    <GripVertical className="size-4" />
                </Button>
            </TableCell>
            {row.getVisibleCells().map((cell) => {
                if (cell.column.id === 'drag') {
                    return null;
                }

                return (
                    <TableCell key={cell.id}>
                        {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                        )}
                    </TableCell>
                );
            })}
        </TableRow>
    );
}

// ----------------------------------------------------------------------
// Composant principal
// ----------------------------------------------------------------------
export function DataTable({
    posts: initialPosts,
    filters = {},
}: DataTableProps) {
    const [data, setData] = useState(initialPosts.data);
    const [loading, setLoading] = useState(false);
    const [rowSelection, setRowSelection] = useState({});
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        likes_count: false,
        comments_count: false,
    });
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [pagination, setPagination] = useState({
        pageIndex: (initialPosts.current_page || 1) - 1,
        pageSize: initialPosts.per_page || 10,
    });

    const [deleteId, setDeleteId] = useState<number | null>(null);
    const alertContentRef = useRef<HTMLDivElement>(null);

    const sortableId = React.useId();
    const sensors = useSensors(
        useSensor(MouseSensor, {}),
        useSensor(TouchSensor, {}),
        useSensor(KeyboardSensor, {}),
    );

    useEffect(() => {
        setData(initialPosts.data);
    }, [initialPosts.data]);

    useEffect(() => {
        if (!deleteId) {
            return;
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (
                alertContentRef.current &&
                !alertContentRef.current.contains(event.target as Node)
            ) {
                setDeleteId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, [deleteId]);

    // Pagination → sans barre de progression
    const handlePaginationChange = (updater: any) => {
        const newPagination =
            typeof updater === 'function' ? updater(pagination) : updater;
        setPagination(newPagination);
        router.get(
            route('blog.stats'),
            {
                page: newPagination.pageIndex + 1,
                per_page: newPagination.pageSize,
                ...filters,
            },
            {
                preserveState: true,
                preserveScroll: true,
                showProgress: false,
                only: ['posts'],
            },
        );
    };

    // Tri → sans barre de progression
    const handleSortingChange = (updater: any) => {
        const newSorting =
            typeof updater === 'function' ? updater(sorting) : updater;
        setSorting(newSorting);

        if (newSorting.length > 0) {
            router.get(
                route('blog.stats'),
                {
                    sort: newSorting[0].id,
                    direction: newSorting[0].desc ? 'desc' : 'asc',
                    page: pagination.pageIndex + 1,
                    per_page: pagination.pageSize,
                    ...filters,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    showProgress: false,
                    only: ['posts'],
                },
            );
        }
    };

    const confirmDelete = () => {
        if (deleteId !== null) {
            router.delete(route('blog.posts.destroy', deleteId), {
                onSuccess: () => {
                    toast.success('Article supprimé');
                    setDeleteId(null);
                },
                onError: () => {
                    toast.error('Erreur lors de la suppression');
                    setDeleteId(null);
                },
                showProgress: false,
            });
        }
    };

    // Colonnes
    const columns = React.useMemo<ColumnDef<Post>[]>(
        () => [
            {
                id: 'drag',
                header: () => null,
                cell: () => null,
                enableSorting: false,
                enableHiding: false,
            },
            {
                id: 'select',
                header: ({ table }) => (
                    <div className="flex items-center justify-center">
                        <Checkbox
                            checked={
                                table.getIsAllPageRowsSelected() ||
                                (table.getIsSomePageRowsSelected() &&
                                    'indeterminate')
                            }
                            onCheckedChange={(value) =>
                                table.toggleAllPageRowsSelected(!!value)
                            }
                            aria-label="Select all"
                        />
                    </div>
                ),
                cell: ({ row }) => (
                    <div className="flex items-center justify-center">
                        <Checkbox
                            checked={row.getIsSelected()}
                            onCheckedChange={(value) =>
                                row.toggleSelected(!!value)
                            }
                            aria-label="Select row"
                        />
                    </div>
                ),
                enableSorting: false,
                enableHiding: false,
            },
            {
                accessorKey: 'title',
                header: 'Titre',
                cell: ({ row }) => <PostTitleCell post={row.original} />,
                enableHiding: false,
            },
            {
                accessorKey: 'categories',
                header: 'Catégories',
                cell: ({ row }) => (
                    <div className="flex flex-wrap gap-1">
                        {row.original.categories?.slice(0, 2).map((cat) => (
                            <Badge
                                key={cat.id}
                                variant="outline"
                                className="px-1.5 text-xs"
                                style={
                                    cat.color
                                        ? {
                                              borderColor: cat.color,
                                              color: cat.color,
                                          }
                                        : {}
                                }
                            >
                                {cat.nom}
                            </Badge>
                        ))}
                        {row.original.categories &&
                            row.original.categories.length > 2 && (
                                <Badge
                                    variant="outline"
                                    className="px-1.5 text-xs"
                                >
                                    +{row.original.categories.length - 2}
                                </Badge>
                            )}
                    </div>
                ),
            },
            {
                accessorKey: 'status',
                header: 'Statut',
                cell: ({ row }) => {
                    const colorMap: Record<string, string> = {
                        green: 'rgba(34,197,94,0.15)',
                        yellow: 'rgba(234,179,8,0.15)',
                        red: 'rgba(239,68,68,0.15)',
                    };
                    const borderMap: Record<string, string> = {
                        green: '#22c55e',
                        yellow: '#eab308',
                        red: '#ef4444',
                    };
                    const bg =
                        colorMap[row.original.status_color] || 'transparent';
                    const border =
                        borderMap[row.original.status_color] ||
                        'hsl(var(--border))';

                    return (
                        <Badge
                            variant="outline"
                            className="inline-flex items-center gap-1 px-1.5 text-xs"
                            style={{ backgroundColor: bg, borderColor: border }}
                        >
                            {row.original.status === 'published' && (
                                <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
                            )}
                            {row.original.status === 'draft' && (
                                <Loader2 className="h-3 w-3 animate-spin text-slate-500" />
                            )}
                            {row.original.status_label}
                        </Badge>
                    );
                },
            },
            {
                accessorKey: 'views_count',
                header: () => <div className="w-full text-right">Vues</div>,
                cell: ({ row }) => (
                    <div className="text-right font-medium tabular-nums">
                        {row.original.views_count.toLocaleString()}
                    </div>
                ),
            },
            {
                accessorKey: 'likes_count',
                header: () => <div className="w-full text-right">J'aime</div>,
                cell: ({ row }) => (
                    <div className="text-right font-medium tabular-nums">
                        {row.original.likes_count.toLocaleString()}
                    </div>
                ),
            },
            {
                accessorKey: 'comments_count',
                header: () => (
                    <div className="w-full text-right">Commentaires</div>
                ),
                cell: ({ row }) => (
                    <div className="text-right font-medium tabular-nums">
                        {row.original.comments_count.toLocaleString()}
                    </div>
                ),
            },
            {
                accessorKey: 'user',
                header: 'Auteur',
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        {row.original.user?.avatar_url ? (
                            <img
                                src={row.original.user.avatar_url}
                                alt=""
                                className="size-6 rounded-full"
                            />
                        ) : (
                            <div className="flex size-6 items-center justify-center rounded-full bg-slate-200 text-xs dark:bg-slate-700">
                                {row.original.user?.name?.charAt(0) || '?'}
                            </div>
                        )}
                        <span className="text-sm">
                            {row.original.user?.name || 'N/A'}
                        </span>
                    </div>
                ),
            },
            {
                accessorKey: 'published_at',
                header: 'Publié le',
                cell: ({ row }) => (
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                        {row.original.published_at?.split('T')[0] ||
                            row.original.created_at?.split('T')[0] ||
                            '—'}
                    </div>
                ),
            },
            {
                id: 'actions',
                cell: ({ row }) => (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 text-slate-400"
                            >
                                <MoreVertical className="size-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-36">
                            <DropdownMenuItem
                                onClick={() =>
                                    router.get(
                                        `/vendeur/posts/posts/${row.original.slug}/edit`,
                                        {},
                                        { showProgress: false },
                                    )
                                }
                            >
                                Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() =>
                                    navigator.clipboard.writeText(
                                        row.original.url,
                                    )
                                }
                            >
                                Copier le lien
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() =>
                                    router.post(
                                        route(
                                            'blog.posts.duplicate',
                                            row.original.id,
                                        ),
                                        {},
                                        { showProgress: false },
                                    )
                                }
                            >
                                Dupliquer
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                variant="destructive"
                                onClick={() => setDeleteId(row.original.id)}
                            >
                                Supprimer
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ),
            },
        ],
        [],
    );

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            pagination,
        },
        pageCount: initialPosts.last_page,
        manualPagination: true,
        manualSorting: true,
        getRowId: (row) => row.id.toString(),
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: handleSortingChange,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: handlePaginationChange,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    });

    const dataIds = React.useMemo<UniqueIdentifier[]>(
        () => data?.map(({ id }) => id) || [],
        [data],
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (active && over && active.id !== over.id) {
            const oldIndex = dataIds.indexOf(active.id);
            const newIndex = dataIds.indexOf(over.id);
            const newData = arrayMove(data, oldIndex, newIndex);
            setData(newData);
            setLoading(true);
            router.post(
                route('blog.posts.reorder'),
                { ordered_ids: newData.map((p) => p.id) },
                {
                    preserveScroll: true,
                    preserveState: true,
                    showProgress: false,
                    onSuccess: () => {
                        setLoading(false);
                        toast.success('Ordre mis à jour');
                    },
                    onError: () => {
                        setLoading(false);
                        toast.error('Erreur de réorganisation');
                        setData(initialPosts.data);
                    },
                },
            );
        }
    }

    if (!initialPosts || !initialPosts.data) {
        return (
            <div className="flex h-48 items-center justify-center text-sm text-slate-500">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Chargement…
            </div>
        );
    }

    return (
        <div className="relative space-y-4">
            {loading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm dark:bg-slate-950/60">
                    <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
                </div>
            )}

            <div className="flex items-center justify-between px-4 lg:px-6">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Articles
                    </h2>
                    <Badge variant="secondary" className="rounded-full">
                        {initialPosts.total} total
                    </Badge>
                </div>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl border-slate-200 bg-white/80 dark:border-slate-700 dark:bg-slate-900/80"
                            >
                                <LayoutIcon className="mr-1 h-4 w-4" />
                                <span className="hidden lg:inline">
                                    Colonnes
                                </span>
                                <ChevronDown className="ml-1 h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            {table
                                .getAllColumns()
                                .filter(
                                    (col) =>
                                        typeof col.accessorFn !== 'undefined' &&
                                        col.getCanHide(),
                                )
                                .map((col) => {
                                    const labels: Record<string, string> = {
                                        title: 'Titre',
                                        categories: 'Catégories',
                                        status: 'Statut',
                                        views_count: 'Vues',
                                        likes_count: "J'aime",
                                        comments_count: 'Commentaires',
                                        user: 'Auteur',
                                        published_at: 'Date',
                                    };

                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={col.id}
                                            checked={col.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                col.toggleVisibility(!!value)
                                            }
                                        >
                                            {labels[col.id] || col.id}
                                        </DropdownMenuCheckboxItem>
                                    );
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl border-slate-200 bg-white/80 dark:border-slate-700 dark:bg-slate-900/80"
                        onClick={() =>
                            router.get(
                                '/vendeur/posts/posts/create',
                                {},
                                { showProgress: false },
                            )
                        }
                    >
                        <Plus className="mr-1 h-4 w-4" />
                        <span className="hidden lg:inline">Nouvel article</span>
                    </Button>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border-0 bg-white/80 shadow-sm dark:bg-slate-900/80">
                <DndContext
                    collisionDetection={closestCenter}
                    modifiers={[restrictToVerticalAxis]}
                    onDragEnd={handleDragEnd}
                    sensors={sensors}
                    id={sortableId}
                >
                    <Table>
                        <TableHeader className="sticky top-0 z-10 bg-slate-50/80 dark:bg-slate-900/80">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            colSpan={header.colSpan}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                <SortableContext
                                    items={dataIds}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {table.getRowModel().rows.map((row) => (
                                        <DraggableRow key={row.id} row={row} />
                                    ))}
                                </SortableContext>
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        Aucun article trouvé.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </DndContext>
            </div>

            <div className="flex items-center justify-between px-4 pb-2">
                <div className="text-xs text-slate-500">
                    {table.getFilteredSelectedRowModel().rows.length} sur{' '}
                    {table.getFilteredRowModel().rows.length} sélectionné(s)
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden items-center gap-2 lg:flex">
                        <Label htmlFor="rows-per-page" className="text-xs">
                            Lignes
                        </Label>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(value) => {
                                table.setPageSize(Number(value));
                                router.get(
                                    route('blog.stats'),
                                    {
                                        per_page: Number(value),
                                        page: 1,
                                        ...filters,
                                    },
                                    {
                                        preserveState: true,
                                        showProgress: false,
                                        only: ['posts'],
                                    },
                                );
                            }}
                        >
                            <SelectTrigger
                                size="sm"
                                className="w-16 rounded-xl"
                            >
                                <SelectValue
                                    placeholder={
                                        table.getState().pagination.pageSize
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[10, 20, 30, 50, 100].map((size) => (
                                    <SelectItem key={size} value={`${size}`}>
                                        {size}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="text-xs font-medium">
                        Page {table.getState().pagination.pageIndex + 1} /{' '}
                        {table.getPageCount()}
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="icon"
                            className="size-8 rounded-lg"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="size-8 rounded-lg"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="size-8 rounded-lg"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="size-8 rounded-lg"
                            onClick={() =>
                                table.setPageIndex(table.getPageCount() - 1)
                            }
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Dialogue modernisé avec fermeture extérieure */}
            <AlertDialog
                open={deleteId !== null}
                onOpenChange={(open) => !open && setDeleteId(null)}
            >
                <AlertDialogContent
                    ref={alertContentRef}
                    className="overflow-hidden rounded-2xl border-0 bg-white p-0 shadow-2xl sm:max-w-lg dark:bg-slate-900"
                >
                    <div className="p-6 sm:p-8">
                        <div className="flex flex-col items-center text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                                <TriangleAlert className="h-8 w-8 text-red-600 dark:text-red-400" />
                            </div>
                            <AlertDialogTitle className="mt-4 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                Supprimer l’article
                            </AlertDialogTitle>
                            <AlertDialogDescription className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                Cette action est irréversible. L’article sera
                                définitivement supprimé et vous ne pourrez pas
                                le récupérer.
                            </AlertDialogDescription>
                        </div>

                        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
                            <AlertDialogCancel
                                onClick={() => setDeleteId(null)}
                                className="rounded-xl border-slate-200 bg-white px-6 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                            >
                                Annuler
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={confirmDelete}
                                className="rounded-xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-200 transition-all hover:scale-[1.02] hover:bg-red-700 active:scale-95 dark:shadow-red-900/30"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer définitivement
                            </AlertDialogAction>
                        </div>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

// ----------------------------------------------------------------------
// Composant de cellule titre (Drawer)
// ----------------------------------------------------------------------
function PostTitleCell({ post }: { post: Post }) {
    const isMobile = useIsMobile();

    return (
        <Drawer direction={isMobile ? 'bottom' : 'right'}>
            <DrawerTrigger asChild>
                <Button
                    variant="link"
                    className="h-auto p-0 text-left font-medium text-slate-900 decoration-2 underline-offset-4 hover:underline dark:text-white"
                >
                    {post.title.length > 50
                        ? post.title.slice(0, 50) + '…'
                        : post.title}
                </Button>
            </DrawerTrigger>
            <DrawerContent className="mx-auto max-h-[90vh] w-full max-w-xl rounded-t-2xl border-0 bg-white shadow-2xl dark:bg-slate-900 sm:rounded-2xl">
                {/* En-tête avec fond dégradé */}
                <div className="relative overflow-hidden rounded-t-2xl bg-linear-to-br from-slate-50 to-white px-6 pt-8 pb-4 dark:from-slate-800 dark:to-slate-900">
                    <div className="absolute top-0 right-0 h-32 w-32 translate-x-10 -translate-y-10 rounded-full bg-emerald-500/10 blur-3xl" />
                    <div className="absolute bottom-0 left-0 h-24 w-24 -translate-x-6 translate-y-6 rounded-full bg-blue-500/10 blur-2xl" />

                    <DrawerHeader className="relative gap-2 p-0">
                        <DrawerTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                            {post.title}
                        </DrawerTitle>
                        <DrawerDescription className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                            {typeof post.excerpt === 'string'
                                ? post.excerpt
                                : post.excerpt
                                  ? (post.excerpt as any).text ||
                                    JSON.stringify(post.excerpt)
                                  : 'Aucun extrait disponible'}
                        </DrawerDescription>
                    </DrawerHeader>
                </div>

                {/* Détails de l'article */}
                <div className="px-6 py-5 space-y-5">
                    {/* Statut & Auteur */}
                    <div className="flex items-center justify-between">
                        <Badge
                            variant="outline"
                            className="inline-flex items-center gap-1 px-2 py-0.5 text-xs"
                            style={{
                                backgroundColor:
                                    post.status_color === 'green' ? 'rgba(34,197,94,0.15)' :
                                    post.status_color === 'yellow' ? 'rgba(234,179,8,0.15)' :
                                    post.status_color === 'red' ? 'rgba(239,68,68,0.15)' : 'transparent',
                                borderColor:
                                    post.status_color === 'green' ? '#22c55e' :
                                    post.status_color === 'yellow' ? '#eab308' :
                                    post.status_color === 'red' ? '#ef4444' : 'hsl(var(--border))',
                            }}
                        >
                            {post.status === 'published' && <CheckCircle2 className="h-3 w-3 text-green-600" />}
                            {post.status === 'draft' && <Loader2 className="h-3 w-3 animate-spin text-slate-500" />}
                            {post.status_label}
                        </Badge>
                        <div className="flex items-center gap-2">
                            {post.user?.avatar_url ? (
                                <img src={post.user.avatar_url} alt="" className="h-6 w-6 rounded-full" />
                            ) : (
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs dark:bg-slate-700">
                                    {post.user?.name?.charAt(0) || '?'}
                                </div>
                            )}
                            <span className="text-sm text-slate-700 dark:text-slate-300">
                                {post.user?.name || 'Anonyme'}
                            </span>
                        </div>
                    </div>

                    {/* Date de publication */}
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        {/* <Calendar className="h-4 w-4" /> */}
                        <span>
                            {post.published_at
                                ? new Date(post.published_at).toLocaleDateString('fr-FR', {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric',
                                  })
                                : 'Non publié'}
                        </span>
                    </div>

                    {/* Catégories */}
                    {post.categories && post.categories.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2">
                            <Tag className="h-4 w-4 text-slate-400" />
                            {post.categories.map((cat) => (
                                <Badge
                                    key={cat.id}
                                    variant="outline"
                                    className="px-1.5 text-xs"
                                    style={cat.color ? { borderColor: cat.color, color: cat.color } : {}}
                                >
                                    {cat.nom}
                                </Badge>
                            ))}
                        </div>
                    )}

                    <Separator />

                    {/* Performances */}
                    <div>
                        <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Performances
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-center dark:border-slate-800 dark:bg-slate-800/50">
                                <p className="text-lg font-bold text-slate-900 dark:text-white">
                                    {post.views_count.toLocaleString()}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Vues</p>
                            </div>
                            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-center dark:border-slate-800 dark:bg-slate-800/50">
                                <p className="text-lg font-bold text-slate-900 dark:text-white">
                                    {post.likes_count.toLocaleString()}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">J'aime</p>
                            </div>
                            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-center dark:border-slate-800 dark:bg-slate-800/50">
                                <p className="text-lg font-bold text-slate-900 dark:text-white">
                                    {post.comments_count.toLocaleString()}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Commentaires</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* URL & Actions */}
                <div className="flex flex-col gap-4 px-6 pt-2 pb-6">
                    <div className="space-y-2">
                        <Label className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            URL de l'article
                        </Label>
                        <div className="flex items-center gap-2">
                            <Input
                                value={post.url}
                                readOnly
                                className="flex-1 border-slate-200 bg-slate-50 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            />
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 rounded-lg border-slate-200 dark:border-slate-700"
                                onClick={() => {
                                    navigator.clipboard.writeText(post.url);
                                    toast.success('Lien copié');
                                }}
                            >
                                <Copy className="h-4 w-4 text-slate-500" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <a
                            href={`/vendeur/posts/posts/${post.slug}/edit`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                        >
                            <ExternalLink className="h-4 w-4" />
                            Modifier
                        </a>
                        <DrawerClose asChild>
                            <Button variant="outline" className="flex-1 rounded-xl border-slate-200 dark:border-slate-700">
                                Fermer
                            </Button>
                        </DrawerClose>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
