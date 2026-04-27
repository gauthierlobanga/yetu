import { router } from '@inertiajs/react';
import { Globe } from 'lucide-react';
import { useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ComboboxPopup } from '@/components/ecommerce/pays/SelectCountry';
import { ComboboxWithGroupsAndSeparator } from '@/components/ecommerce/pays/Timezone';
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
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
} from '@/components/ui/sheet';

type Country = (typeof countries)[number];
type Currency = (typeof currencies)[number];
type Language = (typeof languages)[number];

const countries = [
    { code: '', value: '', continent: '', label: 'Select country' },
    {
        code: 'ar',
        value: 'argentina',
        label: 'Argentina',
        continent: 'South America',
    },
    {
        code: 'au',
        value: 'australia',
        label: 'Australia',
        continent: 'Oceania',
    },
    {
        code: 'br',
        value: 'brazil',
        label: 'Brazil',
        continent: 'South America',
    },
    {
        code: 'ca',
        value: 'canada',
        label: 'Canada',
        continent: 'North America',
    },
    { code: 'cn', value: 'china', label: 'China', continent: 'Asia' },
    {
        code: 'co',
        value: 'colombia',
        label: 'Colombia',
        continent: 'South America',
    },
    { code: 'eg', value: 'egypt', label: 'Egypt', continent: 'Africa' },
    { code: 'fr', value: 'france', label: 'France', continent: 'Europe' },
    { code: 'de', value: 'germany', label: 'Germany', continent: 'Europe' },
    { code: 'it', value: 'italy', label: 'Italy', continent: 'Europe' },
    { code: 'jp', value: 'japan', label: 'Japan', continent: 'Asia' },
    { code: 'ke', value: 'kenya', label: 'Kenya', continent: 'Africa' },
    {
        code: 'mx',
        value: 'mexico',
        label: 'Mexico',
        continent: 'North America',
    },
    {
        code: 'nz',
        value: 'new-zealand',
        label: 'New Zealand',
        continent: 'Oceania',
    },
    { code: 'ng', value: 'nigeria', label: 'Nigeria', continent: 'Africa' },
    {
        code: 'za',
        value: 'south-africa',
        label: 'South Africa',
        continent: 'Africa',
    },
    {
        code: 'kr',
        value: 'south-korea',
        label: 'South Korea',
        continent: 'Asia',
    },
    {
        code: 'gb',
        value: 'united-kingdom',
        label: 'United Kingdom',
        continent: 'Europe',
    },
    {
        code: 'us',
        value: 'united-states',
        label: 'United States',
        continent: 'North America',
    },
];

const currencies: Currency[] = [
    { code: 'eur', name: 'Euro' },
    { code: 'usd', name: 'Dollar US' },
];

const languages: Language[] = [
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'Anglais' },
];

export function RegionSelector() {
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(
        countries.find((c) => c.code === 'fr') || null,
    );
    const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(
        currencies[0],
    );
    const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
        languages[0],
    );

    const [countrySearch, setCountrySearch] = useState('');
    const [currencySearch, setCurrencySearch] = useState('');
    const [languageSearch, setLanguageSearch] = useState('');

    const filteredCountries = countries.filter(
        (country) =>
            country.code !== '' &&
            country.label.toLowerCase().includes(countrySearch.toLowerCase()),
    );

    const filteredCurrencies = currencies.filter((currency) =>
        currency.name.toLowerCase().includes(currencySearch.toLowerCase()),
    );

    const filteredLanguages = languages.filter((language) =>
        language.name.toLowerCase().includes(languageSearch.toLowerCase()),
    );

    const handleSubmit = () => {
        router.get(route('blog.index'), {
            country: selectedCountry?.code,
            currency: selectedCurrency?.code,
            locale: selectedLanguage?.code,
        });
        router.post(route('preferences.update'), {
            country: selectedCountry?.code,
            currency: selectedCurrency?.code,
            locale: selectedLanguage?.code,
        });
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon-lg">
                    <Globe className="h-8 w-8 cursor-pointer" />
                </Button>
            </SheetTrigger>

            <SheetContent className="w-120 sm:w-112.5">
                <SheetHeader>
                    <SheetTitle>Préférences régionales</SheetTitle>
                    <SheetDescription>
                        Ajustez votre pays, langue et devise pour personnaliser
                        votre expérience.
                    </SheetDescription>
                </SheetHeader>

                <div className="grid gap-6 px-6 py-6">
                    {/* SECTION PAYS */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold">Pays</label>
                        <Combobox
                            items={filteredCountries}
                            selectedValue={selectedCountry}
                            onValueChange={(val) => setSelectedCountry(val)}
                            itemToStringValue={(item) => item?.label || ''}
                            inputValue={countrySearch}
                            onInputValueChange={setCountrySearch}
                        >
                            <ComboboxInput
                                className="py-4"
                                placeholder="Rechercher un pays..."
                            />
                            <ComboboxContent>
                                <ComboboxEmpty>
                                    Aucun pays trouvé.
                                </ComboboxEmpty>
                                <ComboboxList>
                                    {(country) => (
                                        <ComboboxItem
                                            key={country.code}
                                            value={country}
                                        >
                                            <Item size="xs" className="p-0">
                                                <ItemContent>
                                                    <ItemTitle>
                                                        {country.label}
                                                    </ItemTitle>
                                                    <ItemDescription>
                                                        {country.continent} (
                                                        {country.code})
                                                    </ItemDescription>
                                                </ItemContent>
                                            </Item>
                                        </ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                    </div>

                    {/* SECTION DEVISE - CORRIGÉE */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold">Devise</label>
                        <Combobox
                            items={filteredCurrencies}
                            selectedValue={selectedCurrency}
                            onValueChange={(val) => setSelectedCurrency(val)}
                            itemToStringValue={(item) => item?.name || ''}
                            inputValue={currencySearch}
                            onInputValueChange={setCurrencySearch}
                        >
                            <ComboboxInput placeholder="Choisir une devise..." />
                            <ComboboxContent>
                                <ComboboxEmpty>
                                    Aucune devise trouvée.
                                </ComboboxEmpty>
                                <ComboboxList>
                                    {(currency) => (
                                        <ComboboxItem
                                            key={currency.code}
                                            value={currency}
                                        >
                                            <Item size="xs" className="p-0">
                                                <ItemContent>
                                                    <ItemTitle>
                                                        {currency.name}
                                                    </ItemTitle>
                                                    <ItemDescription>
                                                        {currency.code.toUpperCase()}
                                                    </ItemDescription>
                                                </ItemContent>
                                            </Item>
                                        </ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                    </div>

                    {/* SECTION LANGUE - CORRIGÉE */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold">Langue</label>
                        <Combobox
                            items={filteredLanguages}
                            selectedValue={selectedLanguage}
                            onValueChange={(val) => setSelectedLanguage(val)}
                            itemToStringValue={(item) => item?.name || ''}
                            inputValue={languageSearch}
                            onInputValueChange={setLanguageSearch}
                        >
                            <ComboboxInput placeholder="Choisir une langue..." />
                            <ComboboxContent>
                                <ComboboxEmpty>
                                    Aucune langue trouvée.
                                </ComboboxEmpty>
                                <ComboboxList>
                                    {(lang) => (
                                        <ComboboxItem
                                            key={lang.code}
                                            value={lang}
                                        >
                                            <Item size="xs" className="p-0">
                                                <ItemContent>
                                                    <ItemTitle>
                                                        {lang.name}
                                                    </ItemTitle>
                                                    <ItemDescription>
                                                        {lang.code.toUpperCase()}
                                                    </ItemDescription>
                                                </ItemContent>
                                            </Item>
                                        </ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                    </div>

                    {/* SECTION TIMEZONE */}
                    <ComboboxWithGroupsAndSeparator />
                </div>

                <SheetFooter className="mt-4">
                    <Button className="w-full" onClick={handleSubmit}>
                        Enregistrer les modifications
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
