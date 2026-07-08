/* eslint-disable react-hooks/incompatible-library */
// resources/js/Components/DataTableCommandes.tsx

import { router } from '@inertiajs/react';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';

import type {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
} from '@tanstack/react-table';

import {
    ArrowUpDown,
    MoreHorizontal,
    Eye,
    FileText,
    Trash2,
    ChevronLeft,
    ChevronRight,
    PackageCheck,
} from 'lucide-react';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Checkbox } from '@/components/ui/checkbox';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { cn } from '@/lib/utils';

export interface CommandeRow {
    id: string;
    numero_commande: string;
    client: string;
    client_email?: string;
    total: number;
    statut: string;
    date_commande: string;
    url: string;
}

interface Props {
    commandes: {
        data: CommandeRow[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
    };
    filters?: {
        search?: string;
        statut?: string;
    };
}

const STATUS_OPTIONS = [
    { key: '', label: 'Tous' },
    { key: 'payee', label: 'Payée' },
    { key: 'en_attente', label: 'En attente' },
    { key: 'annulee', label: 'Annulée' },
    { key: 'expediee', label: 'Expédiée' },
];

export function DataTableCommandes({ commandes: initialCommandes }: Props) {
    const [data, setData] = useState<CommandeRow[]>(initialCommandes.data);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState({
        pageIndex: (initialCommandes.current_page || 1) - 1,
        pageSize: initialCommandes.per_page || 10,
    });

    useEffect(() => {
        setData(initialCommandes.data);
    }, [initialCommandes.data]);

    const columns: ColumnDef<CommandeRow>[] = [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && 'indeterminate')
                    }
                    onCheckedChange={(value) =>
                        table.toggleAllPageRowsSelected(!!value)
                    }
                    className="border-slate-400/60 dark:border-slate-600"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    className="border-slate-400/60 dark:border-slate-600"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'numero_commande',
            header: 'Commande',
            cell: ({ row }) => (
                <div className="space-y-1">
                    <a
                        href={row.original.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
                    >
                        {row.original.numero_commande}
                    </a>
                    <div className="text-xs text-slate-400 dark:text-slate-500">
                        #{row.original.id.substring(0, 8)}
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'client',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                    className="h-auto p-0 font-medium text-slate-600 hover:bg-transparent hover:text-emerald-600 dark:text-slate-300"
                >
                    Client
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="space-y-0.5">
                    <div className="font-medium text-slate-800 dark:text-slate-200">
                        {row.original.client}
                    </div>
                    {row.original.client_email && (
                        <div className="text-xs text-slate-500">
                            {row.original.client_email}
                        </div>
                    )}
                </div>
            ),
        },
        {
            accessorKey: 'total',
            header: () => <div className="text-right font-medium">Montant</div>,
            cell: ({ row }) => (
                <div className="text-right font-semibold text-slate-800 dark:text-slate-200">
                    {new Intl.NumberFormat('fr-CD', {
                        style: 'currency',
                        currency: 'CDF',
                    }).format(row.original.total)}
                </div>
            ),
        },
        {
            accessorKey: 'statut',
            header: 'Statut',
            cell: ({ row }) => {
                const statut = row.original.statut;
                const config: Record<
                    string,
                    { bg: string; text: string; dot: string; label: string }
                > = {
                    payee: {
                        bg: 'bg-emerald-50 dark:bg-emerald-900/30',
                        text: 'text-emerald-700 dark:text-emerald-400',
                        dot: 'bg-emerald-500',
                        label: 'Payée',
                    },
                    en_attente: {
                        bg: 'bg-amber-50 dark:bg-amber-900/30',
                        text: 'text-amber-700 dark:text-amber-400',
                        dot: 'bg-amber-500',
                        label: 'En attente',
                    },
                    annulee: {
                        bg: 'bg-red-50 dark:bg-red-900/30',
                        text: 'text-red-700 dark:text-red-400',
                        dot: 'bg-red-500',
                        label: 'Annulée',
                    },
                    expediee: {
                        bg: 'bg-blue-50 dark:bg-blue-900/30',
                        text: 'text-blue-700 dark:text-blue-400',
                        dot: 'bg-blue-500',
                        label: 'Expédiée',
                    },
                };
                const c = config[statut] ?? {
                    bg: 'bg-slate-50 dark:bg-slate-800/50',
                    text: 'text-slate-700 dark:text-slate-400',
                    dot: 'bg-slate-500',
                    label: statut,
                };

                return (
                    <Badge
                        className={cn(
                            'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
                            c.bg,
                            c.text,
                        )}
                    >
                        <span
                            className={cn('h-1.5 w-1.5 rounded-full', c.dot)}
                        />
                        {c.label}
                    </Badge>
                );
            },
            filterFn: (row, id, value) => !value || row.getValue(id) === value,
        },
        {
            accessorKey: 'date_commande',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                    className="h-auto p-0 font-medium text-slate-600 hover:bg-transparent hover:text-emerald-600 dark:text-slate-300"
                >
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="text-sm text-slate-500 dark:text-slate-400">
                    {new Date(row.original.date_commande).toLocaleDateString(
                        'fr-FR',
                        {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                        },
                    )}
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
                            className="h-9 w-9 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="w-48 rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-950/95"
                    >
                        <DropdownMenuItem
                            onClick={() =>
                                window.open(row.original.url, '_blank')
                            }
                            className="cursor-pointer"
                        >
                            <Eye className="mr-2 h-4 w-4" /> Voir
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() =>
                                window.open(
                                    `${row.original.url}/invoice`,
                                    '_blank',
                                )
                            }
                            className="cursor-pointer"
                        >
                            <FileText className="mr-2 h-4 w-4" /> Facture
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
                        <DropdownMenuItem
                            className="cursor-pointer text-red-500 focus:bg-red-50 dark:focus:bg-red-950/30"
                            onClick={() => {
                                if (confirm('Supprimer cette commande ?')) {
                                    router.delete(
                                        `/commandes/${row.original.id}`,
                                        {
                                            onSuccess: () =>
                                                toast.success(
                                                    'Commande supprimée',
                                                ),
                                        },
                                    );
                                }
                            }}
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Supprimer
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    const table = useReactTable({
        data,
        columns,
        state: { sorting, columnFilters, rowSelection, pagination },
        pageCount: initialCommandes.last_page,
        manualPagination: true,
        manualSorting: true,
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const activeFilter =
        (columnFilters.find((f) => f.id === 'statut')?.value as string) || '';

    return (
        <Card className="overflow-hidden rounded-[2rem] border-0 bg-white/70 shadow-lg shadow-slate-200/20 backdrop-blur-xl dark:bg-slate-900/70 dark:shadow-black/20">
            <CardHeader className="flex flex-col gap-4 border-b border-slate-100 bg-linear-to-r from-white to-slate-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <PackageCheck className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                            Dernières commandes
                        </CardTitle>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {initialCommandes.total} commande(s)
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {STATUS_OPTIONS.map((opt) => (
                        <button
                            key={opt.key}
                            onClick={() =>
                                table
                                    .getColumn('statut')
                                    ?.setFilterValue(opt.key || '')
                            }
                            className={cn(
                                'rounded-full px-3 py-1.5 text-xs font-medium transition-all',
                                activeFilter === opt.key ||
                                    (!opt.key && !activeFilter)
                                    ? 'bg-emerald-500 text-white shadow-sm'
                                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800',
                            )}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow
                                    key={headerGroup.id}
                                    className="border-b border-slate-100 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50"
                                >
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            className="h-12 px-4 text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400"
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
                            {table.getRowModel().rows.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={
                                            row.getIsSelected() && 'selected'
                                        }
                                        className="border-b border-slate-100 transition-colors hover:bg-slate-50 data-[state=selected]:bg-emerald-50/50 dark:border-slate-800 dark:hover:bg-slate-800/50 dark:data-[state=selected]:bg-emerald-950/20"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className="px-4 py-3"
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-32 text-center text-slate-500 dark:text-slate-400"
                                    >
                                        Aucune commande trouvée.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                {/* Pagination */}
                <div className="flex flex-col gap-4 border-t border-slate-100 bg-slate-50/50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900/50">
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                        {table.getFilteredSelectedRowModel().rows.length}{' '}
                        sélectionnée(s) sur{' '}
                        {table.getFilteredRowModel().rows.length}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="h-9 w-9 rounded-xl border-slate-200 bg-white hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                            {table.getState().pagination.pageIndex + 1} /{' '}
                            {table.getPageCount()}
                        </span>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="h-9 w-9 rounded-xl border-slate-200 bg-white hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
