/* eslint-disable @typescript-eslint/no-unused-vars */
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
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import * as React from 'react';
import { useState, useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

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
    filters?: { search?: string; statut?: string };
}

const statusConfig = (statut: string) => {
    switch (statut) {
        case 'valide':
            return {
                bg: 'bg-emerald-50 dark:bg-emerald-950/30',
                text: 'text-emerald-700 dark:text-emerald-400',
                border: 'border-emerald-200 dark:border-emerald-800',
                dot: 'bg-emerald-500',
            };
        case 'en_attente':
            return {
                bg: 'bg-amber-50 dark:bg-amber-950/30',
                text: 'text-amber-700 dark:text-amber-400',
                border: 'border-amber-200 dark:border-amber-800',
                dot: 'bg-amber-500',
            };
        case 'echec':
            return {
                bg: 'bg-red-50 dark:bg-red-950/30',
                text: 'text-red-700 dark:text-red-400',
                border: 'border-red-200 dark:border-red-800',
                dot: 'bg-red-500',
            };
        case 'rembourse':
            return {
                bg: 'bg-purple-50 dark:bg-purple-950/30',
                text: 'text-purple-700 dark:text-purple-400',
                border: 'border-purple-200 dark:border-purple-800',
                dot: 'bg-purple-500',
            };
        default:
            return {
                bg: 'bg-slate-50 dark:bg-slate-800/50',
                text: 'text-slate-700 dark:text-slate-400',
                border: 'border-slate-200 dark:border-slate-700',
                dot: 'bg-slate-500',
            };
    }
};

export function DataTablePaiements({
    paiements: initialPaiements,
    filters = {},
}: Props) {
    const [data, setData] = useState<PaiementRow[]>(initialPaiements.data);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState({
        pageIndex: (initialPaiements.current_page || 1) - 1,
        pageSize: initialPaiements.per_page || 10,
    });

    useEffect(() => {
        setData(initialPaiements.data);
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
                    className="border-slate-300 dark:border-slate-600"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    className="border-slate-300 dark:border-slate-600"
                />
            ),
            enableSorting: false,
        },
        {
            accessorKey: 'reference',
            header: 'Référence',
            cell: ({ row }) => (
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {row.getValue('reference')}
                </span>
            ),
        },
        {
            accessorKey: 'transaction_id',
            header: 'Transaction',
            cell: ({ row }) => (
                <span className="text-sm text-slate-600 dark:text-slate-400">
                    {row.getValue('transaction_id') || '—'}
                </span>
            ),
        },
        {
            accessorKey: 'montant',
            header: () => (
                <div className="text-right text-slate-700 dark:text-slate-300">
                    Montant
                </div>
            ),
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
                <Badge
                    variant="outline"
                    className="border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                    {row.getValue('mode')}
                </Badge>
            ),
        },
        {
            accessorKey: 'statut',
            header: 'Statut',
            cell: ({ row }) => {
                const config = statusConfig(row.original.statut);

                return (
                    <Badge
                        variant="outline"
                        className={`inline-flex items-center gap-1.5 ${config.bg} ${config.text} ${config.border}`}
                    >
                        <span
                            className={`h-2 w-2 rounded-full ${config.dot}`}
                        />
                        {row.getValue('statut')}
                    </Badge>
                );
            },
            filterFn: (row, id, value) => value.includes(row.getValue(id)),
        },
        {
            accessorKey: 'date_paiement',
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                    className="text-slate-700 dark:text-slate-300"
                >
                    Date <ArrowUpDown className="ml-1 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <span className="text-sm text-slate-600 dark:text-slate-400">
                    {new Date(row.original.date_paiement).toLocaleDateString(
                        'fr-FR',
                        { day: '2-digit', month: 'short', year: 'numeric' },
                    )}
                </span>
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
                            className="h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="w-40 rounded-xl border-emerald-200 dark:border-slate-700"
                    >
                        <DropdownMenuItem
                            onClick={() =>
                                router.get(`/paiements/${row.original.id}`)
                            }
                            className="cursor-pointer"
                        >
                            <Eye className="mr-2 h-4 w-4" /> Voir
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
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

    // eslint-disable-next-line react-hooks/incompatible-library
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

    return (
        <Card className="overflow-hidden border-emerald-200 shadow-sm dark:border-emerald-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-emerald-100 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-950">
                <div className="flex items-center gap-3">
                    <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white">
                        Derniers paiements
                    </CardTitle>
                    <Badge
                        variant="secondary"
                        className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                    >
                        {initialPaiements.total} total
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                {/* Barre d'outils */}
                <div className="flex items-center gap-3 border-b border-emerald-100 bg-slate-50/50 px-6 py-3 dark:border-slate-800 dark:bg-slate-900/50">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            placeholder="Rechercher une référence..."
                            value={
                                (columnFilters.find((f) => f.id === 'reference')
                                    ?.value as string) ?? ''
                            }
                            onChange={(e) =>
                                table
                                    .getColumn('reference')
                                    ?.setFilterValue(e.target.value)
                            }
                            className="border-slate-200 bg-white pl-9 transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-800 dark:focus:border-emerald-400 dark:focus:ring-emerald-800"
                        />
                    </div>
                    <Select
                        value={
                            (columnFilters.find((f) => f.id === 'statut')
                                ?.value as string) ?? 'all'
                        }
                        onValueChange={(value) =>
                            table
                                .getColumn('statut')
                                ?.setFilterValue(value === 'all' ? '' : value)
                        }
                    >
                        <SelectTrigger className="w-44 border-slate-200 bg-white transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-800">
                            <Filter className="mr-2 h-4 w-4 text-slate-400" />
                            <SelectValue placeholder="Tous les statuts" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-emerald-200 dark:border-slate-700">
                            <SelectItem value="all">
                                Tous les statuts
                            </SelectItem>
                            <SelectItem value="valide">Validé</SelectItem>
                            <SelectItem value="en_attente">
                                En attente
                            </SelectItem>
                            <SelectItem value="echec">Échec</SelectItem>
                            <SelectItem value="rembourse">Remboursé</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="flex-1" />
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                        {table.getFilteredRowModel().rows.length} résultat(s)
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow
                                    key={headerGroup.id}
                                    className="border-emerald-100 bg-slate-50/30 dark:border-slate-800 dark:bg-slate-900/30"
                                >
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            className="h-12 text-slate-600 dark:text-slate-400"
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
                                        className="border-emerald-100 transition-colors hover:bg-emerald-50/30 data-[state=selected]:bg-emerald-50/50 dark:border-slate-800 dark:hover:bg-emerald-950/10 dark:data-[state=selected]:bg-emerald-950/20"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className="py-3"
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
                                        className="h-24 text-center text-slate-500 dark:text-slate-400"
                                    >
                                        Aucun paiement trouvé.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-emerald-100 px-6 py-3 dark:border-slate-800">
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                        {table.getFilteredSelectedRowModel().rows.length} sur{' '}
                        {table.getFilteredRowModel().rows.length} sélectionné(s)
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="h-8 border-slate-200 dark:border-slate-700"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {table.getState().pagination.pageIndex + 1} /{' '}
                            {table.getPageCount()}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="h-8 border-slate-200 dark:border-slate-700"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
