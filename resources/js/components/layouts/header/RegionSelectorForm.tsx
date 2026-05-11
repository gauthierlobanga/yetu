import { usePage, router } from '@inertiajs/react';
import { Globe, Check, Loader2 } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
} from '@/components/ui/combobox';
import {
    Item,
    ItemContent,
    ItemDescription,
    ItemTitle,
} from '@/components/ui/item';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

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

export function RegionSelectorForm() {
    const { props } = usePage();
    const {
        countries = [],
        currencies = [],
        languages = [],
        currentCountry,
        currentCurrency,
        currentLanguage,
    } = props as any;

    const [selectedCountry, setSelectedCountry] = useState<Country | null>(
        null,
    );
    const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(
        null,
    );
    const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
        null,
    );

    const [countrySearch, setCountrySearch] = useState('');
    const [currencySearch, setCurrencySearch] = useState('');
    const [languageSearch, setLanguageSearch] = useState('');
    const [loading, setLoading] = useState(false);

    // Initialiser les valeurs à partir des props backend
    useEffect(() => {
        if (currentCountry) {
            const match = countries.find(
                (c: Country) => c.code === currentCountry,
            );
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSelectedCountry(
                match || { code: currentCountry, name: currentCountry },
            );
        }

        if (currentCurrency) {
            const match = currencies.find(
                (c: Currency) => c.code === currentCurrency,
            );
            setSelectedCurrency(
                match || { code: currentCurrency, name: currentCurrency },
            );
        }

        if (currentLanguage) {
            const match = languages.find(
                (l: Language) => l.code === currentLanguage,
            );
            setSelectedLanguage(
                match || { code: currentLanguage, name: currentLanguage },
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

    const filteredCountries = useMemo(() => {
        if (!Array.isArray(countries)) {
            return [];
        }

        return countries.filter((country: Country) =>
            country.name.toLowerCase().includes(countrySearch.toLowerCase()),
        );
    }, [countries, countrySearch]);

    const filteredCurrencies = useMemo(() => {
        if (!Array.isArray(currencies)) {
            return [];
        }

        return currencies.filter((currency: Currency) =>
            currency.name.toLowerCase().includes(currencySearch.toLowerCase()),
        );
    }, [currencies, currencySearch]);

    const filteredLanguages = useMemo(() => {
        if (!Array.isArray(languages)) {
            return [];
        }

        return languages.filter((language: Language) =>
            language.name.toLowerCase().includes(languageSearch.toLowerCase()),
        );
    }, [languages, languageSearch]);

    const handleSubmit = () => {
        setLoading(true);
        router.post(
            route('preferences.update'),
            {
                country: selectedCountry?.code,
                currency: selectedCurrency?.code,
                locale: selectedLanguage?.code,
            },
            {
                onSuccess: () => {
                    toast.success('Préférences enregistrées.');
                    setLoading(false);
                },
                onError: (errors) => {
                    toast.error('Erreur lors de la mise à jour.');
                    console.error(errors);
                    setLoading(false);
                },
            },
        );
    };

    const itemToStringValue = (item: any) => item?.name || '';

    // Texte indicatif dans le déclencheur
    const countryCode = selectedCountry?.code?.toUpperCase() || '??';
    const currencyCode = selectedCurrency?.code?.toUpperCase() || '??';
    const languageCode = selectedLanguage?.code?.toUpperCase() || '??';

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                    <Globe className="h-4 w-4" />
                    <span className="hidden sm:inline">
                        {countryCode} / {currencyCode} / {languageCode}
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-95 p-6 shadow-xl">
                <div className="space-y-6">
                    {/* Pays */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                            Pays
                        </label>
                        <Combobox
                            items={filteredCountries}
                            value={selectedCountry}
                            onValueChange={setSelectedCountry}
                            itemToStringValue={itemToStringValue}
                            inputValue={countrySearch}
                            onInputValueChange={setCountrySearch}
                        >
                            <ComboboxInput
                                placeholder="Rechercher un pays..."
                                className="h-10"
                            />
                            <ComboboxContent>
                                <ComboboxEmpty>
                                    Aucun pays trouvé.
                                </ComboboxEmpty>
                                <ComboboxList>
                                    {(country: Country) => (
                                        <ComboboxItem
                                            key={country.code}
                                            value={country}
                                        >
                                            <Item size="sm">
                                                <ItemContent>
                                                    <ItemTitle>
                                                        {country.name}
                                                    </ItemTitle>
                                                    <ItemDescription>
                                                        {country.continent !==
                                                        '—'
                                                            ? `${country.continent} · `
                                                            : ''}
                                                        {country.code?.toUpperCase()}
                                                    </ItemDescription>
                                                </ItemContent>
                                                {selectedCountry?.code ===
                                                    country.code && (
                                                    <Check className="ml-auto h-4 w-4 text-primary" />
                                                )}
                                            </Item>
                                        </ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                    </div>

                    {/* Devise */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                            Devise
                        </label>
                        <Combobox
                            items={filteredCurrencies}
                            value={selectedCurrency}
                            onValueChange={setSelectedCurrency}
                            itemToStringValue={itemToStringValue}
                            inputValue={currencySearch}
                            onInputValueChange={setCurrencySearch}
                        >
                            <ComboboxInput
                                placeholder="Choisir une devise..."
                                className="h-10"
                            />
                            <ComboboxContent>
                                <ComboboxEmpty>
                                    Aucune devise trouvée.
                                </ComboboxEmpty>
                                <ComboboxList>
                                    {(currency: Currency) => (
                                        <ComboboxItem
                                            key={currency.code}
                                            value={currency}
                                        >
                                            <Item size="sm">
                                                <ItemContent>
                                                    <ItemTitle>
                                                        {currency.name}
                                                    </ItemTitle>
                                                    <ItemDescription>
                                                        {currency.code?.toUpperCase()}
                                                        {currency.symbol
                                                            ? ` (${currency.symbol})`
                                                            : ''}
                                                    </ItemDescription>
                                                </ItemContent>
                                                {selectedCurrency?.code ===
                                                    currency.code && (
                                                    <Check className="ml-auto h-4 w-4 text-primary" />
                                                )}
                                            </Item>
                                        </ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                    </div>

                    {/* Langue */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                            Langue
                        </label>
                        <Combobox
                            items={filteredLanguages}
                            value={selectedLanguage}
                            onValueChange={setSelectedLanguage}
                            itemToStringValue={itemToStringValue}
                            inputValue={languageSearch}
                            onInputValueChange={setLanguageSearch}
                        >
                            <ComboboxInput
                                placeholder="Choisir une langue..."
                                className="h-10"
                            />
                            <ComboboxContent>
                                <ComboboxEmpty>
                                    Aucune langue trouvée.
                                </ComboboxEmpty>
                                <ComboboxList>
                                    {(lang: Language) => (
                                        <ComboboxItem
                                            key={lang.code}
                                            value={lang}
                                        >
                                            <Item size="sm">
                                                <ItemContent>
                                                    <ItemTitle>
                                                        {lang.name}
                                                    </ItemTitle>
                                                    <ItemDescription>
                                                        {lang.code?.toUpperCase()}
                                                    </ItemDescription>
                                                </ItemContent>
                                                {selectedLanguage?.code ===
                                                    lang.code && (
                                                    <Check className="ml-auto h-4 w-4 text-primary" />
                                                )}
                                            </Item>
                                        </ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                    </div>
                </div>

                <div className="mt-6 border-t border-border pt-4">
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Enregistrement...
                            </>
                        ) : (
                            'Enregistrer les modifications'
                        )}
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
