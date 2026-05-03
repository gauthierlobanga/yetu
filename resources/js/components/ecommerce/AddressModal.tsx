// resources/js/Components/AddressModal.tsx
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Loader2, Search } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface AddressFormData {
    rue: string;
    complement: string;
    code_postal: string;
    ville: string;
    pays: string; // code ISO
    telephone: string;
    type: 'facturation' | 'livraison';
    est_defaut: boolean;
}

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (data: AddressFormData) => void;
    initialData?: Partial<AddressFormData>;
}

const defaultData: AddressFormData = {
    rue: '',
    complement: '',
    code_postal: '',
    ville: '',
    pays: 'CD', // détecté automatiquement
    telephone: '',
    type: 'livraison',
    est_defaut: false,
};

export default function AddressModal({
    open,
    onOpenChange,
    onSave,
    initialData,
}: Props) {
    const [form, setForm] = useState<AddressFormData>({
        ...defaultData,
        ...initialData,
    });
    const [countries, setCountries] = useState<
        { id: number; iso2: string; name: string; emoji: string }[]
    >([]);
    const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
    const [loadingCities, setLoadingCities] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [searchCity, setSearchCity] = useState('');

    // Détection automatique du pays via le navigateur
    useEffect(() => {
        const userLocale = navigator.language; // ex: "fr-CD"
        const parts = userLocale.split('-');

        if (parts.length === 2) {
            const countryCode = parts[1].toUpperCase();
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setForm((prev) => ({ ...prev, pays: countryCode }));
        }
    }, []);

    // Charger la liste des pays
    useEffect(() => {
        fetch('/api/countries')
            .then((res) => res.json())
            .then((data) => setCountries(data))
            .catch(console.error);
    }, []);

    // Charger les villes quand le pays change
    useEffect(() => {
        if (!form.pays) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setCities([]);

            return;
        }

        setLoadingCities(true);
        const country = countries.find((c) => c.iso2 === form.pays);

        if (!country) {
            setLoadingCities(false);

            return;
        }

        fetch(`/api/countries/${country.id}/cities`)
            .then((res) => res.json())
            .then((data) => {
                setCities(data);
                setLoadingCities(false);
            })
            .catch(() => setLoadingCities(false));
    }, [form.pays, countries]);

    const handleCountryChange = (code: string) => {
        setForm((prev) => ({ ...prev, pays: code, ville: '' }));
    };

    const handleSubmit = () => {
        onSave(form);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>
                        {initialData?.rue
                            ? "Modifier l'adresse"
                            : 'Nouvelle adresse'}
                    </DialogTitle>
                </DialogHeader>
                <div className="grid max-h-[70vh] gap-4 overflow-y-auto py-4">
                    {/* Rue */}
                    <div className="grid gap-2">
                        <Label htmlFor="rue">Rue *</Label>
                        <Input
                            id="rue"
                            value={form.rue}
                            onChange={(e) =>
                                setForm({ ...form, rue: e.target.value })
                            }
                            placeholder="Ex: 12 Avenue de la Paix"
                        />
                    </div>

                    {/* Complément */}
                    <div className="grid gap-2">
                        <Label htmlFor="complement">Complément</Label>
                        <Input
                            id="complement"
                            value={form.complement}
                            onChange={(e) =>
                                setForm({ ...form, complement: e.target.value })
                            }
                            placeholder="Appartement, étage..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Pays */}
                        <div className="grid gap-2">
                            <Label>Pays *</Label>
                            <Select
                                value={form.pays}
                                onValueChange={handleCountryChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Choisir un pays" />
                                </SelectTrigger>
                                <SelectContent>
                                    {countries.map((country) => (
                                        <SelectItem
                                            key={country.id}
                                            value={country.iso2}
                                        >
                                            <span className="flex items-center gap-2">
                                                <span>{country.emoji}</span>
                                                <span>{country.name}</span>
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Ville */}
                        <div className="grid gap-2">
                            <Label>Ville *</Label>
                            {loadingCities ? (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Chargement...
                                </div>
                            ) : (
                                <Select
                                    value={form.ville}
                                    onValueChange={(ville) =>
                                        setForm({ ...form, ville })
                                    }
                                    disabled={!form.pays}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choisir une ville" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cities
                                            .filter((c) =>
                                                c.name
                                                    .toLowerCase()
                                                    .includes(
                                                        searchCity.toLowerCase(),
                                                    ),
                                            )
                                            .map((city) => (
                                                <SelectItem
                                                    key={city.id}
                                                    value={city.name}
                                                >
                                                    {city.name}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    </div>

                    {/* Code postal */}
                    <div className="grid gap-2">
                        <Label htmlFor="code_postal">Code postal *</Label>
                        <Input
                            id="code_postal"
                            value={form.code_postal}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    code_postal: e.target.value,
                                })
                            }
                        />
                    </div>

                    {/* Téléphone */}
                    <div className="grid gap-2">
                        <Label htmlFor="phone">Téléphone</Label>
                        <PhoneInput
                            country={form.pays?.toLowerCase() ?? 'cd'}
                            value={form.telephone}
                            onChange={(phone) =>
                                setForm({ ...form, telephone: phone })
                            }
                            inputClass="!w-full !h-10 !rounded-md !border-gray-300 !shadow-sm"
                            buttonClass="!rounded-md !border-gray-300"
                            placeholder="+243 xxx xxx xxx"
                        />
                        <p className="text-xs text-muted-foreground">
                            Format international automatique.
                        </p>
                    </div>

                    {/* Type d'adresse */}
                    <div className="grid gap-2">
                        <Label>Type d'adresse</Label>
                        <Select
                            value={form.type}
                            onValueChange={(val) =>
                                setForm({
                                    ...form,
                                    type: val as 'facturation' | 'livraison',
                                })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="livraison">
                                    Livraison
                                </SelectItem>
                                <SelectItem value="facturation">
                                    Facturation
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Défaut */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="est_defaut"
                            checked={form.est_defaut}
                            onCheckedChange={(checked) =>
                                setForm({
                                    ...form,
                                    est_defaut: checked === true,
                                })
                            }
                        />
                        <Label htmlFor="est_defaut" className="cursor-pointer">
                            Définir comme adresse par défaut
                        </Label>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Annuler
                    </Button>
                    <Button onClick={handleSubmit}>Enregistrer</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
