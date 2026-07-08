/* eslint-disable react-hooks/incompatible-library */
// resources/js/Components/DataTablePaiements.tsx

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
    Trash2,
    ChevronLeft,
    ChevronRight,
    CreditCard,
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

export interface PaiementRow {
    id: string;
    reference: string;
    transaction_id?: string;
    montant: number;
    mode: string;
    statut: string;
    date_paiement: string;
}

interface Props {
    paiements: {
        data: PaiementRow[];
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
    { key: 'valide', label: 'Validé' },
    { key: 'en_attente', label: 'En attente' },
    { key: 'echec', label: 'Échec' },
    { key: 'rembourse', label: 'Remboursé' },
];

export function DataTablePaiements({ paiements: initialPaiements }: Props) {
    const [data, setData] = useState<PaiementRow[]>(
        initialPaiements.data ?? [],
    );
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState({
        pageIndex: (initialPaiements.current_page || 1) - 1,
        pageSize: initialPaiements.per_page || 10,
    });

    useEffect(() => {
        setData(initialPaiements.data ?? []);
    }, [initialPaiements.data]);

    const columns: ColumnDef<PaiementRow>[] = [
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
            accessorKey: 'reference',
            header: 'Référence',
            cell: ({ row }) => (
                <div className="space-y-0.5">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {row.original.reference}
                    </span>
                    <div className="text-xs text-slate-400 dark:text-slate-500">
                        #{row.original.id.slice(0, 8)}
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'transaction_id',
            header: 'Transaction',
            cell: ({ row }) => (
                <div className="text-sm text-slate-600 dark:text-slate-400">
                    {row.original.transaction_id || '—'}
                </div>
            ),
        },
        {
            accessorKey: 'montant',
            header: () => <div className="text-right font-medium">Montant</div>,
            cell: ({ row }) => (
                <div className="text-right font-semibold text-slate-800 dark:text-slate-200">
                    {new Intl.NumberFormat('fr-CD', {
                        style: 'currency',
                        currency: 'CDF',
                    }).format(row.original.montant)}
                </div>
            ),
        },
        {
            accessorKey: 'mode',
            header: 'Mode',
            cell: ({ row }) => (
                <Badge className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    <CreditCard className="h-3 w-3" />
                    {row.original.mode}
                </Badge>
            ),
        },
        {
            accessorKey: 'statut',
            header: 'Statut',
            cell: ({ row }) => {
                const statut = row.original.statut;
                const config: Record<
                    string,
                    { bg: string; text: string; dot: string }
                > = {
                    valide: {
                        bg: 'bg-emerald-50 dark:bg-emerald-900/30',
                        text: 'text-emerald-700 dark:text-emerald-400',
                        dot: 'bg-emerald-500',
                    },
                    en_attente: {
                        bg: 'bg-amber-50 dark:bg-amber-900/30',
                        text: 'text-amber-700 dark:text-amber-400',
                        dot: 'bg-amber-500',
                    },
                    echec: {
                        bg: 'bg-red-50 dark:bg-red-900/30',
                        text: 'text-red-700 dark:text-red-400',
                        dot: 'bg-red-500',
                    },
                    rembourse: {
                        bg: 'bg-purple-50 dark:bg-purple-900/30',
                        text: 'text-purple-700 dark:text-purple-400',
                        dot: 'bg-purple-500',
                    },
                };
                const c = config[statut] ?? {
                    bg: 'bg-slate-50 dark:bg-slate-800/50',
                    text: 'text-slate-700 dark:text-slate-400',
                    dot: 'bg-slate-500',
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
                        {statut}
                    </Badge>
                );
            },
            filterFn: (row, id, value) => !value || row.getValue(id) === value,
        },
        {
            accessorKey: 'date_paiement',
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
                    {new Date(row.original.date_paiement).toLocaleDateString(
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
                        className="w-44 rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-950/95"
                    >
                        <DropdownMenuItem
                            onClick={() =>
                                router.get(`/paiements/${row.original.id}`)
                            }
                            className="cursor-pointer"
                        >
                            <Eye className="mr-2 h-4 w-4" /> Voir
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
                        <DropdownMenuItem
                            className="cursor-pointer text-red-500 focus:bg-red-50 dark:focus:bg-red-950/30"
                            onClick={() => {
                                if (confirm('Supprimer ce paiement ?')) {
                                    router.delete(
                                        `/paiements/${row.original.id}`,
                                        {
                                            onSuccess: () =>
                                                toast.success(
                                                    'Paiement supprimé',
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
        pageCount: initialPaiements.last_page,
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
                        <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                            Derniers paiements
                        </CardTitle>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            {initialPaiements.total} paiement(s)
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
                                        Aucun paiement trouvé.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex flex-col gap-4 border-t border-slate-100 bg-slate-50/50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900/50">
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                        {table.getFilteredSelectedRowModel().rows.length}{' '}
                        sélectionné(s)
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
