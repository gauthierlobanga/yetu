/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { router } from '@inertiajs/react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    Filter,
    X,
    RefreshCw,
    ChevronDown,
    SlidersHorizontal,
} from 'lucide-react';
import { useState, useEffect } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';

// ----------------------------------------------------------------------
// Options (inchangées)
// ----------------------------------------------------------------------
const periodOptions = [
    { value: 'today', label: "Aujourd'hui" },
    { value: 'yesterday', label: 'Hier' },
    { value: 'last7days', label: '7 derniers jours' },
    { value: 'last30days', label: '30 derniers jours' },
    { value: 'last90days', label: '90 derniers jours' },
    { value: 'thisWeek', label: 'Cette semaine' },
    { value: 'lastWeek', label: 'Semaine dernière' },
    { value: 'thisMonth', label: 'Ce mois' },
    { value: 'lastMonth', label: 'Mois dernier' },
    { value: 'thisQuarter', label: 'Ce trimestre' },
    { value: 'lastQuarter', label: 'Trimestre dernier' },
    { value: 'thisYear', label: 'Cette année' },
    { value: 'lastYear', label: 'Année dernière' },
    { value: 'custom', label: 'Personnalisé' },
];

const yearOptions = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - i;

    return { value: year.toString(), label: year.toString() };
});

const monthOptions = [
    { value: '1', label: 'Janvier' },
    { value: '2', label: 'Février' },
    { value: '3', label: 'Mars' },
    { value: '4', label: 'Avril' },
    { value: '5', label: 'Mai' },
    { value: '6', label: 'Juin' },
    { value: '7', label: 'Juillet' },
    { value: '8', label: 'Août' },
    { value: '9', label: 'Septembre' },
    { value: '10', label: 'Octobre' },
    { value: '11', label: 'Novembre' },
    { value: '12', label: 'Décembre' },
];

const statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'published', label: 'Publiés' },
    { value: 'draft', label: 'Brouillons' },
    { value: 'scheduled', label: 'Programmés' },
    { value: 'archived', label: 'Archivés' },
];

const quickPeriods = [
    { value: 'today', label: 'Auj.' },
    { value: 'last7days', label: '7j' },
    { value: 'last30days', label: '30j' },
    { value: 'thisMonth', label: 'Mois' },
    { value: 'thisYear', label: 'Année' },
];

// ----------------------------------------------------------------------
interface DashboardFiltersProps {
    currentFilters?: {
        period?: string;
        start_date?: string;
        end_date?: string;
        year?: string;
        month?: string;
        status?: string;
    };
}

export function DashboardFilters({
    currentFilters = {},
}: DashboardFiltersProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [period, setPeriod] = useState(currentFilters.period || 'last30days');
    const [startDate, setStartDate] = useState<Date | undefined>(
        currentFilters.start_date
            ? new Date(currentFilters.start_date)
            : undefined,
    );
    const [endDate, setEndDate] = useState<Date | undefined>(
        currentFilters.end_date ? new Date(currentFilters.end_date) : undefined,
    );
    const [selectedYear, setSelectedYear] = useState(
        currentFilters.year || new Date().getFullYear().toString(),
    );
    const [selectedMonth, setSelectedMonth] = useState(
        currentFilters.month || '',
    );
    const [selectedStatus, setSelectedStatus] = useState(
        currentFilters.status || 'all',
    );

    const hasActiveFilters =
        period !== 'last30days' ||
        selectedStatus !== 'all' ||
        selectedYear !== new Date().getFullYear().toString() ||
        selectedMonth !== '';

    const applyFilters = () => {
        const params: any = { period };

        if (period === 'custom' && startDate && endDate) {
            params.start_date = format(startDate, 'yyyy-MM-dd');
            params.end_date = format(endDate, 'yyyy-MM-dd');
        }

        if (selectedYear && (period === 'thisYear' || period === 'lastYear')) {
            params.year = selectedYear;
        }

        if (
            selectedMonth &&
            (period === 'thisMonth' || period === 'lastMonth')
        ) {
            params.month = selectedMonth;
        }

        if (selectedStatus && selectedStatus !== 'all') {
            params.status = selectedStatus;
        }

        router.get(route('blog.stats'), params, {
            preserveState: true,
            preserveScroll: true,
            showProgress: false,
            only: [
                'posts',
                'chartStats',
                'stats',
                'categoriesStats',
                'postsStatusStats',
                'topPosts',
                'topAuthors',
                'weeklyActivity',
                'monthlyPostsStats',
                'hourlyPostsStats',
                'categoryPerformance',
                'topTags',
                'scheduledPosts',
            ],
        });
        setIsOpen(false);
    };

    const resetFilters = () => {
        setPeriod('last30days');
        setStartDate(undefined);
        setEndDate(undefined);
        setSelectedYear(new Date().getFullYear().toString());
        setSelectedMonth('');
        setSelectedStatus('all');
        router.get(route('blog.stats'), {}, { preserveState: true, preserveScroll: true, showProgress: false, });

    };

    const getActiveFiltersCount = () => {
        let count = 0;

        if (period !== 'last30days') {
            count++;
        }

        if (selectedStatus !== 'all') {
            count++;
        }

        if (selectedYear !== new Date().getFullYear().toString()) {
            count++;
        }

        if (selectedMonth !== '') {
            count++;
        }

        return count;
    };

    return (
        <div className="space-y-4 px-4 lg:px-6">
            {/* Barre de filtres principale */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    {/* Bouton Filtres avec compteur */}
                    <Button
                        variant="outline"
                        onClick={() => setIsOpen(!isOpen)}
                        className={cn(
                            'gap-2 rounded-xl border-slate-200 bg-white/80 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/80 dark:hover:bg-slate-900',
                            isOpen &&
                                'border-emerald-500 ring-2 ring-emerald-100 dark:border-emerald-700 dark:ring-emerald-900',
                        )}
                    >
                        <SlidersHorizontal className="h-4 w-4" />
                        <span className="text-sm font-medium">Filtres</span>
                        {getActiveFiltersCount() > 0 && (
                            <Badge
                                variant="secondary"
                                className="ml-1 rounded-full bg-emerald-100 px-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                            >
                                {getActiveFiltersCount()}
                            </Badge>
                        )}
                    </Button>

                    {/* Filtres rapides style "pill" */}
                    <div className="hidden items-center rounded-xl bg-slate-100 p-1 sm:flex dark:bg-slate-800">
                        {quickPeriods.map((qp) => (
                            <button
                                key={qp.value}
                                onClick={() => setPeriod(qp.value)}
                                className={cn(
                                    'rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200',
                                    period === qp.value
                                        ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
                                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200',
                                )}
                            >
                                {qp.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={resetFilters}
                            className="gap-1 rounded-xl text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                        >
                            <RefreshCw className="h-3.5 w-3.5" />
                            Réinitialiser
                        </Button>
                    )}
                    <Button
                        onClick={applyFilters}
                        className="gap-1 rounded-xl bg-slate-900 text-xs text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                    >
                        <Calendar className="h-3.5 w-3.5" />
                        Appliquer
                    </Button>
                </div>
            </div>

            {/* Panneau de filtres étendu avec animation */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <Card className="rounded-2xl border-0 bg-white shadow-lg ring-1 ring-slate-200/50 dark:bg-slate-900 dark:ring-slate-800">
                            <CardContent className="p-6">
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                                    {/* Période */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                            Période
                                        </label>
                                        <Select
                                            value={period}
                                            onValueChange={setPeriod}
                                        >
                                            <SelectTrigger className="h-9 rounded-xl border-slate-200 bg-slate-50/50 text-sm dark:border-slate-700 dark:bg-slate-800/50">
                                                <SelectValue placeholder="Sélectionner" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {periodOptions.map((option) => (
                                                    <SelectItem
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Plage personnalisée */}
                                    {period === 'custom' && (
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                                Dates
                                            </label>
                                            <div className="flex gap-2">
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className="flex-1 justify-start rounded-xl border-slate-200 bg-slate-50/50 text-sm font-normal dark:border-slate-700 dark:bg-slate-800/50"
                                                        >
                                                            {startDate
                                                                ? format(
                                                                      startDate,
                                                                      'dd/MM/yyyy',
                                                                  )
                                                                : 'Début'}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0">
                                                        <CalendarComponent
                                                            mode="single"
                                                            selected={startDate}
                                                            onSelect={
                                                                setStartDate
                                                            }
                                                            locale={fr}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className="flex-1 justify-start rounded-xl border-slate-200 bg-slate-50/50 text-sm font-normal dark:border-slate-700 dark:bg-slate-800/50"
                                                        >
                                                            {endDate
                                                                ? format(
                                                                      endDate,
                                                                      'dd/MM/yyyy',
                                                                  )
                                                                : 'Fin'}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0">
                                                        <CalendarComponent
                                                            mode="single"
                                                            selected={endDate}
                                                            onSelect={
                                                                setEndDate
                                                            }
                                                            locale={fr}
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                        </div>
                                    )}

                                    {/* Année */}
                                    {(period === 'thisYear' ||
                                        period === 'lastYear') && (
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                                Année
                                            </label>
                                            <Select
                                                value={selectedYear}
                                                onValueChange={setSelectedYear}
                                            >
                                                <SelectTrigger className="h-9 rounded-xl border-slate-200 bg-slate-50/50 text-sm dark:border-slate-700 dark:bg-slate-800/50">
                                                    <SelectValue placeholder="Année" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {yearOptions.map(
                                                        (option) => (
                                                            <SelectItem
                                                                key={
                                                                    option.value
                                                                }
                                                                value={
                                                                    option.value
                                                                }
                                                            >
                                                                {option.label}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}

                                    {/* Mois */}
                                    {(period === 'thisMonth' ||
                                        period === 'lastMonth') && (
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                                Mois
                                            </label>
                                            <Select
                                                value={selectedMonth}
                                                onValueChange={setSelectedMonth}
                                            >
                                                <SelectTrigger className="h-9 rounded-xl border-slate-200 bg-slate-50/50 text-sm dark:border-slate-700 dark:bg-slate-800/50">
                                                    <SelectValue placeholder="Mois" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {monthOptions.map(
                                                        (option) => (
                                                            <SelectItem
                                                                key={
                                                                    option.value
                                                                }
                                                                value={
                                                                    option.value
                                                                }
                                                            >
                                                                {option.label}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    )}

                                    {/* Statut */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                                            Statut
                                        </label>
                                        <Select
                                            value={selectedStatus}
                                            onValueChange={setSelectedStatus}
                                        >
                                            <SelectTrigger className="h-9 rounded-xl border-slate-200 bg-slate-50/50 text-sm dark:border-slate-700 dark:bg-slate-800/50">
                                                <SelectValue placeholder="Statut" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {statusOptions.map((option) => (
                                                    <SelectItem
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsOpen(false)}
                                        className="rounded-xl border-slate-200 text-sm dark:border-slate-700"
                                    >
                                        Annuler
                                    </Button>
                                    <Button
                                        onClick={applyFilters}
                                        className="rounded-xl bg-slate-900 text-sm text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                                    >
                                        Appliquer les filtres
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Badges des filtres actifs */}
            {hasActiveFilters && (
                <div className="flex flex-wrap gap-2">
                    {period !== 'last30days' && (
                        <Badge
                            variant="secondary"
                            className="cursor-pointer gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                            onClick={() => setPeriod('last30days')}
                        >
                            Période :{' '}
                            {
                                periodOptions.find((p) => p.value === period)
                                    ?.label
                            }
                            <X className="h-3 w-3" />
                        </Badge>
                    )}
                    {selectedStatus !== 'all' && (
                        <Badge
                            variant="secondary"
                            className="cursor-pointer gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                            onClick={() => setSelectedStatus('all')}
                        >
                            Statut :{' '}
                            {
                                statusOptions.find(
                                    (s) => s.value === selectedStatus,
                                )?.label
                            }
                            <X className="h-3 w-3" />
                        </Badge>
                    )}
                    {selectedYear !== new Date().getFullYear().toString() && (
                        <Badge
                            variant="secondary"
                            className="cursor-pointer gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                            onClick={() =>
                                setSelectedYear(
                                    new Date().getFullYear().toString(),
                                )
                            }
                        >
                            Année : {selectedYear}
                            <X className="h-3 w-3" />
                        </Badge>
                    )}
                    {selectedMonth !== '' && (
                        <Badge
                            variant="secondary"
                            className="cursor-pointer gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                            onClick={() => setSelectedMonth('')}
                        >
                            Mois :{' '}
                            {
                                monthOptions.find(
                                    (m) => m.value === selectedMonth,
                                )?.label
                            }
                            <X className="h-3 w-3" />
                        </Badge>
                    )}
                </div>
            )}
        </div>
    );
}
