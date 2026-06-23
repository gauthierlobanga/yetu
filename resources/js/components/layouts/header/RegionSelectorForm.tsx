/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
// resources/js/components/region/RegionSelectorForm.tsx

import type { PageProps } from '@inertiajs/core';
import { router, usePage } from '@inertiajs/react';
import { Check, Globe, Loader2, Sparkles, ChevronDown } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
    ComboboxTrigger,
    ComboboxValue,
} from '@/components/ui/combobox';
import { DialogDescription, DialogTitle } from '@/components/ui/dialog';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

// resources/js/components/region/RegionSelectorForm.tsx

interface Country {
    code: string;
    name: string;
    continent?: string;
    currency?: string;
    phone_code?: string;
}

interface Currency {
    code: string;
    name: string;
    symbol?: string;
}

interface Language {
    code: string;
    name: string;
}

/**
 * SharedProps doit étendre PageProps pour être compatible avec :
 * usePage<SharedProps>()
 */
interface SharedProps extends PageProps {
    countries?: Country[];
    currencies?: Currency[];
    languages?: Language[];
    currentCountry?: string;
    currentCurrency?: string;
    currentLanguage?: string;
}

/* -------------------------------------------------------------------------- */
/*                              Helper Components                             */
/* -------------------------------------------------------------------------- */

interface SelectionCardProps {
    icon: React.ElementType;
    label: string;
    value?: string;
}

function SelectionCard({ icon: Icon, label, value }: SelectionCardProps) {
    return (
        <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-900/60">
            <div className="mb-1 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Icon className="h-3.5 w-3.5" />
                </div>
                <span className="text-[11px] font-semibold tracking-[0.16em] text-slate-500 uppercase dark:text-slate-400">
                    {label}
                </span>
            </div>
            <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                {value || 'Non défini'}
            </p>
        </div>
    );
}

interface SelectorSectionProps<T extends { code: string; name: string }> {
    title: string;
    placeholder: string;
    items: T[];
    selected: T | null;
    onSelect: (item: T) => void;
    displayLabel: (item: T) => string;
}

function SelectorSection<T extends { code: string; name: string }>({
    title,
    placeholder,
    items,
    selected,
    onSelect,
    displayLabel,
}: SelectorSectionProps<T>) {
    const { t } = useTranslation();

    return (
        <div className="space-y-1.5">
            <label className="px-1 text-[11px] font-semibold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                {title}
            </label>
            <Combobox
                items={items}
                value={selected}
                onValueChange={(val) => {
                    if (val) {
                        onSelect(val);
                    }
                }}
            >
                <ComboboxTrigger
                    render={
                        <Button
                            variant="outline"
                            className={cn(
                                'h-11 w-full justify-between rounded-lg border px-3 text-sm font-normal transition-all duration-200',
                                'border-slate-200 bg-white/80 text-slate-700',
                                'hover:border-emerald-300 hover:bg-white',
                                'focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 focus:outline-none',
                                'dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300',
                                'dark:hover:border-emerald-700 dark:hover:bg-slate-900',
                                'dark:focus:border-emerald-400 dark:focus:ring-emerald-400/20',
                            )}
                        >
                            <span className="truncate">
                                {selected ? (
                                    displayLabel(selected)
                                ) : (
                                    <span className="text-slate-400">
                                        {placeholder}
                                    </span>
                                )}
                            </span>
                        </Button>
                    }
                />
                <ComboboxContent
                    side="bottom"
                    align="start"
                    sideOffset={4}
                    className={cn(
                        'z-50 flex max-h-80 w-[--anchor-width] flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white/95 p-1 backdrop-blur-xl',
                        'shadow-[0_10px_38px_-10px_rgba(22,101,52,0.1)]',
                        'dark:border-slate-800/80 dark:bg-slate-950/90 dark:shadow-[0_10px_38px_-10px_rgba(0,0,0,0.5)]',
                    )}
                >
                    <div className="px-1 pt-1 pb-2">
                        <ComboboxInput
                            showTrigger={false}
                            placeholder={t('Rechercher...')}
                        />
                    </div>
                    <ComboboxEmpty className="py-6 text-center text-sm text-slate-500">
                        {t('Aucun résultat trouvé.')}
                    </ComboboxEmpty>
                    <ComboboxList className="flex-1 overflow-y-auto px-1 pb-1">
                        {(item: T) => {
                            const isSelected = selected?.code === item.code;

                            return (
                                <ComboboxItem
                                    key={item.code}
                                    value={item}
                                    className={cn(
                                        'group mb-1 flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 transition-colors',
                                        'data-highlighted:bg-emerald-50/80 dark:data-highlighted:bg-emerald-900/20',
                                        isSelected &&
                                            'bg-emerald-50/50 dark:bg-emerald-900/10',
                                    )}
                                >
                                    <span className="truncate text-sm font-medium text-slate-900 dark:text-white">
                                        {displayLabel(item)}
                                    </span>

                                    <Check
                                        className={cn(
                                            'h-4 w-4 shrink-0 text-emerald-500 transition-opacity',
                                            isSelected
                                                ? 'opacity-100'
                                                : 'opacity-0',
                                        )}
                                    />
                                </ComboboxItem>
                            );
                        }}
                    </ComboboxList>
                </ComboboxContent>
            </Combobox>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*                              Main Component                                */
/* -------------------------------------------------------------------------- */

export function RegionSelectorForm() {
    const { props } = usePage<SharedProps>();
    const { t } = useTranslation();

    const {
        countries = [],
        currencies = [],
        languages = [],
        currentCountry,
        currentCurrency,
        currentLanguage,
    } = props;

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [selectedCountry, setSelectedCountry] = useState<Country | null>(
        null,
    );

    const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(
        null,
    );

    const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
        null,
    );

    /* ---------------------------------------------------------------------- */
    /* Initial values                                                         */
    /* ---------------------------------------------------------------------- */

    useEffect(() => {
        if (currentCountry) {
            setSelectedCountry(
                countries.find((country) => country.code === currentCountry) ??
                    null,
            );
        }

        if (currentCurrency) {
            setSelectedCurrency(
                currencies.find(
                    (currency) => currency.code === currentCurrency,
                ) ?? null,
            );
        }

        if (currentLanguage) {
            setSelectedLanguage(
                languages.find(
                    (language) => language.code === currentLanguage,
                ) ?? null,
            );
        }
    }, [
        currentCountry,
        currentCurrency,
        currentLanguage,
        countries,
        currencies,
        languages,
    ]);

    /* ---------------------------------------------------------------------- */
    /* Derived data                                                           */
    /* ---------------------------------------------------------------------- */

    const summary = useMemo(() => {
        const country = selectedCountry?.code ?? 'Non défini';
        const currency = selectedCurrency?.code?.toUpperCase() ?? 'Non défini';
        const language = selectedLanguage?.code ?? 'Non défini';

        return `${country} • ${currency} • ${language}`;
    }, [selectedCountry, selectedCurrency, selectedLanguage]);

    const hasChanges =
        selectedCountry?.code !== currentCountry ||
        selectedCurrency?.code !== currentCurrency ||
        selectedLanguage?.code !== currentLanguage;

    /* ---------------------------------------------------------------------- */
    /* Submit                                                                 */
    /* ---------------------------------------------------------------------- */

    const handleSubmit = useCallback(() => {
        setLoading(true);

        router.post(
            // @ts-ignore
            route().has('tenant.preferences.update')
                ? route('tenant.preferences.update')
                : route('preferences.update'),
            {
                country: selectedCountry?.code,
                currency: selectedCurrency?.code,
                locale: selectedLanguage?.code,
            },
            {
                preserveScroll: true,
                showProgress: false,
                onSuccess: () => {
                    toast.success(
                        t('Vos préférences ont été enregistrées avec succès.'),
                    );
                    setOpen(false);
                    router.reload({ only: ['headerData', 'seo'] });
                },
                onError: () => {
                    toast.error(
                        t('Une erreur est survenue lors de la mise à jour.'),
                    );
                },
                onFinish: () => {
                    setLoading(false);
                },
            },
        );
    }, [
        selectedCountry?.code,
        selectedCurrency?.code,
        selectedLanguage?.code,
        t,
    ]);

    /* ---------------------------------------------------------------------- */
    /* Render                                                                 */
    /* ---------------------------------------------------------------------- */

    return (
        <Popover open={open} onOpenChange={setOpen}>
            {/* Trigger */}
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                        'group h-10 rounded-full border-slate-200/70 bg-white/85',
                        'shadow-sm backdrop-blur-xl transition-all duration-300',
                        'hover:border-emerald-300 hover:bg-white hover:shadow-md hover:shadow-emerald-500/10',
                        'dark:border-slate-700 dark:bg-slate-900/80',
                        'dark:hover:border-emerald-700 dark:hover:bg-slate-900',
                    )}
                >
                    <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <Globe className="h-5 w-5" />
                        </div>

                        <span className="hidden max-w-37.5 truncate text-sm font-medium text-slate-700 sm:inline lg:max-w-50 dark:text-slate-300">
                            {summary}
                        </span>

                        <ChevronDown
                            className={cn(
                                'h-4 w-4 text-slate-400 transition-transform duration-300',
                                open && 'rotate-180',
                            )}
                        />
                    </div>
                </Button>
            </PopoverTrigger>

            {/* Content */}
            <PopoverContent
                align="center"
                sideOffset={10}
                className={cn(
                    'w-[calc(100vw-2rem)] overflow-hidden rounded p-0 sm:w-95',
                    'border border-slate-200/70 bg-white/95 backdrop-blur-2xl',
                    'shadow-[0_24px_80px_-20px_rgba(15,23,42,0.20)]',
                    'dark:border-slate-800 dark:bg-slate-950/95',
                    'dark:shadow-[0_24px_80px_-20px_rgba(0,0,0,0.65)]',
                )}
            >
                {/* Header */}
                <div className="relative overflow-hidden border-b border-slate-200/70 bg-linear-to-r from-emerald-50/90 via-white to-slate-50/90 px-5 py-4 dark:border-slate-800 dark:from-emerald-950/20 dark:via-slate-950 dark:to-slate-900">
                    <div className="flex flex-col items-start gap-1">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                            {t('Région, devise et langue')}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {t('Personnalisez votre expérience d’achat.')}
                        </p>
                    </div>
                </div>

                {/* Selectors */}
                <div className="max-h-112 space-y-5 overflow-y-auto px-5 pt-4 pb-5">
                    <SelectorSection
                        title={t('Pays')}
                        placeholder={t('Rechercher un pays...')}
                        items={countries}
                        selected={selectedCountry}
                        onSelect={setSelectedCountry}
                        displayLabel={(country) => country.name}
                    />

                    <SelectorSection
                        title={t('Devise')}
                        placeholder={t('Rechercher une devise...')}
                        items={currencies}
                        selected={selectedCurrency}
                        onSelect={setSelectedCurrency}
                        displayLabel={(currency) => currency.code.toUpperCase()}
                    />

                    <SelectorSection
                        title={t('Langue')}
                        placeholder={t('Rechercher une langue...')}
                        items={languages}
                        selected={selectedLanguage}
                        onSelect={setSelectedLanguage}
                        displayLabel={(language) => language.name}
                    />
                </div>

                {/* Footer */}
                <div className="border-t border-slate-200/70 bg-slate-50/70 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/50">
                    <Button
                        onClick={handleSubmit}
                        disabled={loading || !hasChanges}
                        className={cn(
                            'h-11 w-full rounded-2xl',
                            'bg-linear-to-r from-emerald-600 to-emerald-500',
                            'font-medium text-white',
                            'shadow-lg shadow-emerald-500/20',
                            'transition-all duration-300',
                            'hover:shadow-xl hover:shadow-emerald-500/30',
                            'disabled:cursor-not-allowed disabled:opacity-60',
                        )}
                    >
                        {loading && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {loading
                            ? t('Enregistrement...')
                            : t('Enregistrer les modifications')}
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
