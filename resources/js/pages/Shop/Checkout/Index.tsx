/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/Pages/Shop/Checkout/Index.tsx
import { Head, usePage, useForm, Link, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRight,
    ChevronLeft,
    Plus,
    Check,
    Truck,
    CreditCard,
    ShieldCheck,
    MapPin,
    Package,
    Clock,
    Building,
    Loader2,
    Pencil,
    Trash2,
    Home,
    Briefcase,
    AlertCircle,
    CheckCircle2,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import MainLayout from '@/layouts/main-layout';
import { cn } from '@/lib/utils';
import type { Cart, Address, PageProps } from '@/types/ecommerce/products';

interface Props extends PageProps {
    cart: Cart;
    addresses: Address[];
    shippingMethods: ShippingMethod[];
    paymentMethods: PaymentMethod[];
}

interface ShippingMethod {
    id: string;
    name: string;
    description: string;
    price: number;
    estimatedDays: string;
    logo?: string;
}

interface PaymentMethod {
    id: string;
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    description?: string;
}

const steps = [
    { id: 'address', name: 'Adresse', icon: MapPin },
    { id: 'shipping', name: 'Livraison', icon: Truck },
    { id: 'payment', name: 'Paiement', icon: CreditCard },
    { id: 'review', name: 'Confirmation', icon: ShieldCheck },
] as const;

type Step = (typeof steps)[number]['id'];

export default function CheckoutIndex() {
    const {
        cart,
        addresses: initialAddresses,
        shippingMethods = [],
        paymentMethods = [],
    } = usePage<Props>().props;

    // États locaux
    const [currentStep, setCurrentStep] = useState<Step>('address');
    const [selectedShipping, setSelectedShipping] = useState<string>(
        shippingMethods[0]?.id || '',
    );
    const [selectedPayment, setSelectedPayment] = useState<string>(
        paymentMethods[0]?.id || '',
    );
    const [addressDialogOpen, setAddressDialogOpen] = useState(false);
    const [sameAsShipping, setSameAsShipping] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState<number | null>(
        null,
    );
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);

    // Formulaire principal
    const { data, setData, post, processing, errors, reset } = useForm({
        adresse_facturation_id: '',
        adresse_livraison_id: '',
        shipping_method_id: '',
        payment_method_id: '',
        notes: '',
        same_as_shipping: false,
        // Nouvelle adresse (pour création/édition)
        new_address: {
            id: null as number | null,
            rue: '',
            complement: '',
            code_postal: '',
            ville: '',
            pays: 'France',
            telephone: '',
            type: 'livraison' as 'facturation' | 'livraison',
            est_defaut: false,
        },
    });

    // Synchroniser les sélections
    useEffect(() => {
        setData('shipping_method_id', selectedShipping);
    }, [selectedShipping, setData]);

    useEffect(() => {
        setData('payment_method_id', selectedPayment);
    }, [selectedPayment, setData]);

    useEffect(() => {
        setData('same_as_shipping', sameAsShipping);

        if (sameAsShipping && data.adresse_livraison_id) {
            setData('adresse_facturation_id', data.adresse_livraison_id);
        }
    }, [sameAsShipping, data.adresse_livraison_id, setData]);

    // Calculs
    const shippingMethod = shippingMethods.find(
        (m) => m.id === selectedShipping,
    );
    const paymentMethod = paymentMethods.find((m) => m.id === selectedPayment);
    const subtotal = cart.sous_total;
    const taxes = cart.total_taxes;
    const shipping = shippingMethod?.price || 0;
    const discounts = cart.total_remises;
    const total = subtotal + taxes + shipping - discounts;

    // Gestion des adresses
    const handleSaveAddress = async () => {
        const addressData = data.new_address;
        const url = editingAddressId
            ? route('shop.addresses.update', editingAddressId)
            : route('shop.addresses.store');
        const method = editingAddressId ? 'put' : 'post';

        setIsLoadingAddresses(true);

        try {
            await router.visit(url, {
                method,
                data: addressData,
                preserveState: true,
                preserveScroll: true,
                only: ['addresses'],
                onSuccess: () => {
                    toast.success(
                        editingAddressId
                            ? 'Adresse mise à jour'
                            : 'Adresse ajoutée',
                    );
                    setAddressDialogOpen(false);
                    resetNewAddress();
                },
                onError: (err) => {
                    toast.error("Erreur lors de l'enregistrement");
                    console.error(err);
                },
            });
        } finally {
            setIsLoadingAddresses(false);
        }
    };

    const handleDeleteAddress = (id: number) => {
        if (confirm('Supprimer cette adresse ?')) {
            router.delete(route('shop.addresses.destroy', id), {
                preserveState: true,
                preserveScroll: true,
                only: ['addresses'],
                onSuccess: () => toast.success('Adresse supprimée'),
            });
        }
    };

    const resetNewAddress = () => {
        setData('new_address', {
            id: null,
            rue: '',
            complement: '',
            code_postal: '',
            ville: '',
            pays: 'France',
            telephone: '',
            type: 'livraison',
            est_defaut: false,
        });
        setEditingAddressId(null);
    };

    const editAddress = (addr: Address) => {
        setData('new_address', {
            id: addr.id,
            rue: addr.rue,
            complement: addr.complement || '',
            code_postal: addr.code_postal,
            ville: addr.ville,
            pays: addr.pays,
            telephone: addr.telephone || '',
            type: addr.type,
            est_defaut: addr.est_defaut,
        });
        setEditingAddressId(addr.id);
        setAddressDialogOpen(true);
    };

    // Validation par étape
    const canProceed = (): boolean => {
        switch (currentStep) {
            case 'address':
                return (
                    !!data.adresse_livraison_id &&
                    (sameAsShipping || !!data.adresse_facturation_id)
                );
            case 'shipping':
                return !!selectedShipping;
            case 'payment':
                return !!selectedPayment;
            default:
                return true;
        }
    };

    const nextStep = () => {
        if (canProceed()) {
            const idx = steps.findIndex((s) => s.id === currentStep);

            if (idx < steps.length - 1) {
                setCurrentStep(steps[idx + 1].id);
            }
        } else {
            toast.error('Veuillez compléter toutes les informations requises');
        }
    };

    const prevStep = () => {
        const idx = steps.findIndex((s) => s.id === currentStep);

        if (idx > 0) {
            setCurrentStep(steps[idx - 1].id);
        }
    };

    const getStepStatus = (stepId: Step) => {
        const currentIdx = steps.findIndex((s) => s.id === currentStep);
        const stepIdx = steps.findIndex((s) => s.id === stepId);

        if (stepIdx < currentIdx) {
            return 'completed';
        }

        if (stepIdx === currentIdx) {
            return 'current';
        }

        return 'upcoming';
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('shop.checkout.process'), {
            onSuccess: () =>
                toast.success(
                    'Commande confirmée ! Redirection vers le paiement...',
                ),
            onError: () => toast.error('Une erreur est survenue'),
        });
    };

    // Adresse sélectionnée pour affichage
    const selectedShippingAddress = initialAddresses.find(
        (a) => String(a.id) === data.adresse_livraison_id,
    );
    const selectedBillingAddress = sameAsShipping
        ? selectedShippingAddress
        : initialAddresses.find(
              (a) => String(a.id) === data.adresse_facturation_id,
          );

    return (
        <MainLayout>
            <Head title="Finaliser la commande" />
            <TooltipProvider>
                <div className="mx-auto max-w-7xl px-4 py-8 lg:py-12">
                    {/* Stepper premium */}
                    <div className="mb-12">
                        <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
                            Finaliser votre commande
                        </h1>
                        <p className="mt-2 text-muted-foreground">
                            Complétez les informations ci-dessous pour confirmer
                            votre achat
                        </p>

                        <div className="mt-8 flex items-center justify-between">
                            {steps.map((step, idx) => {
                                const status = getStepStatus(step.id);
                                const Icon = step.icon;

                                return (
                                    <div
                                        key={step.id}
                                        className="flex items-center"
                                    >
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="flex flex-col items-center">
                                                    <motion.div
                                                        initial={false}
                                                        animate={{
                                                            scale:
                                                                status ===
                                                                'current'
                                                                    ? 1.1
                                                                    : 1,
                                                            backgroundColor:
                                                                status ===
                                                                'completed'
                                                                    ? 'rgb(34 197 94)'
                                                                    : status ===
                                                                        'current'
                                                                      ? 'hsl(var(--primary))'
                                                                      : 'hsl(var(--muted))',
                                                        }}
                                                        className={cn(
                                                            'flex h-10 w-10 items-center justify-center rounded-full text-white shadow-md transition-colors',
                                                            status ===
                                                                'completed' &&
                                                                'bg-green-500',
                                                            status ===
                                                                'current' &&
                                                                'bg-primary',
                                                            status ===
                                                                'upcoming' &&
                                                                'bg-muted text-muted-foreground',
                                                        )}
                                                    >
                                                        {status ===
                                                        'completed' ? (
                                                            <Check className="h-5 w-5" />
                                                        ) : (
                                                            <Icon className="h-5 w-5" />
                                                        )}
                                                    </motion.div>
                                                    <span
                                                        className={cn(
                                                            'mt-2 text-xs font-medium',
                                                            status ===
                                                                'upcoming' &&
                                                                'text-muted-foreground',
                                                        )}
                                                    >
                                                        {step.name}
                                                    </span>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                {status === 'completed' &&
                                                    'Étape validée'}
                                                {status === 'current' &&
                                                    'En cours'}
                                                {status === 'upcoming' &&
                                                    'À venir'}
                                            </TooltipContent>
                                        </Tooltip>
                                        {idx < steps.length - 1 && (
                                            <div
                                                className={cn(
                                                    'mx-2 h-0.5 w-12 rounded-full md:w-20',
                                                    getStepStatus(
                                                        steps[idx + 1].id,
                                                    ) === 'upcoming'
                                                        ? 'bg-muted'
                                                        : 'bg-primary/50',
                                                )}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Formulaire principal */}
                        <div className="lg:col-span-2">
                            <AnimatePresence mode="wait">
                                {currentStep === 'address' && (
                                    <AddressStep
                                        addresses={initialAddresses}
                                        data={data}
                                        setData={setData}
                                        errors={errors}
                                        sameAsShipping={sameAsShipping}
                                        setSameAsShipping={setSameAsShipping}
                                        addressDialogOpen={addressDialogOpen}
                                        setAddressDialogOpen={
                                            setAddressDialogOpen
                                        }
                                        editingAddressId={editingAddressId}
                                        isLoadingAddresses={isLoadingAddresses}
                                        onSaveAddress={handleSaveAddress}
                                        onEditAddress={editAddress}
                                        onDeleteAddress={handleDeleteAddress}
                                        resetNewAddress={resetNewAddress}
                                    />
                                )}

                                {currentStep === 'shipping' && (
                                    <ShippingStep
                                        shippingMethods={shippingMethods}
                                        selectedShipping={selectedShipping}
                                        setSelectedShipping={
                                            setSelectedShipping
                                        }
                                    />
                                )}

                                {currentStep === 'payment' && (
                                    <PaymentStep
                                        paymentMethods={paymentMethods}
                                        selectedPayment={selectedPayment}
                                        setSelectedPayment={setSelectedPayment}
                                    />
                                )}

                                {currentStep === 'review' && (
                                    <ReviewStep
                                        cart={cart}
                                        shippingAddress={
                                            selectedShippingAddress
                                        }
                                        billingAddress={selectedBillingAddress}
                                        shippingMethod={shippingMethod}
                                        paymentMethod={paymentMethod}
                                        notes={data.notes}
                                        setNotes={(v: string) =>
                                            setData('notes', v)
                                        }
                                        onEditStep={(step: string) =>
                                            setCurrentStep(step as Step)
                                        }
                                    />
                                )}
                            </AnimatePresence>

                            {/* Navigation */}
                            <div className="mt-8 flex justify-between">
                                {currentStep !== 'address' && (
                                    <Button
                                        variant="outline"
                                        onClick={prevStep}
                                    >
                                        <ChevronLeft className="mr-2 h-4 w-4" />
                                        Retour
                                    </Button>
                                )}
                                <div className="flex-1" />
                                {currentStep !== 'review' ? (
                                    <Button
                                        onClick={nextStep}
                                        disabled={!canProceed()}
                                    >
                                        Continuer
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={processing}
                                        size="lg"
                                        className="min-w-40"
                                    >
                                        {processing ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Traitement...
                                            </>
                                        ) : (
                                            <>
                                                <ShieldCheck className="mr-2 h-4 w-4" />
                                                Confirmer la commande
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Sidebar récapitulative */}
                        <OrderSummary
                            cart={cart}
                            subtotal={subtotal}
                            taxes={taxes}
                            shipping={shipping}
                            discounts={discounts}
                            total={total}
                            shippingMethodName={shippingMethod?.name}
                        />
                    </div>
                </div>
            </TooltipProvider>
        </MainLayout>
    );
}

// ========== SOUS-COMPOSANTS ==========

function AddressStep({
    addresses,
    data,
    setData,
    errors,
    sameAsShipping,
    setSameAsShipping,
    addressDialogOpen,
    setAddressDialogOpen,
    editingAddressId,
    isLoadingAddresses,
    onSaveAddress,
    onEditAddress,
    onDeleteAddress,
    resetNewAddress,
}: any) {
    return (
        <motion.div
            key="address"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            {/* Adresse de livraison */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Truck className="h-5 w-5 text-primary" />
                        Adresse de livraison
                    </CardTitle>
                    <CardDescription>
                        Où souhaitez-vous recevoir votre commande ?
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <RadioGroup
                        value={data.adresse_livraison_id}
                        onValueChange={(v) =>
                            setData('adresse_livraison_id', v)
                        }
                    >
                        <div className="space-y-3">
                            {addresses
                                .filter((a: Address) => a.type === 'livraison')
                                .map((addr: Address) => (
                                    <AddressCard
                                        key={addr.id}
                                        address={addr}
                                        selected={
                                            data.adresse_livraison_id ===
                                            String(addr.id)
                                        }
                                        onSelect={() =>
                                            setData(
                                                'adresse_livraison_id',
                                                String(addr.id),
                                            )
                                        }
                                        onEdit={() => onEditAddress(addr)}
                                        onDelete={() =>
                                            onDeleteAddress(addr.id)
                                        }
                                    />
                                ))}
                        </div>
                    </RadioGroup>

                    <Dialog
                        open={addressDialogOpen}
                        onOpenChange={(open) => {
                            setAddressDialogOpen(open);

                            if (!open) {
                                resetNewAddress();
                            }
                        }}
                    >
                        <DialogTrigger asChild>
                            <Button variant="outline" className="w-full">
                                <Plus className="mr-2 h-4 w-4" />
                                {editingAddressId
                                    ? "Modifier l'adresse"
                                    : 'Ajouter une nouvelle adresse'}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>
                                    {editingAddressId ? 'Modifier' : 'Nouvelle'}{' '}
                                    adresse
                                </DialogTitle>
                                <DialogDescription>
                                    Remplissez les informations ci-dessous
                                </DialogDescription>
                            </DialogHeader>
                            <AddressForm
                                data={data.new_address}
                                onChange={(field: string, value: string) =>
                                    setData('new_address', {
                                        ...data.new_address,
                                        [field]: value,
                                    })
                                }
                                isLoading={isLoadingAddresses}
                                onSave={onSaveAddress}
                                onCancel={() => setAddressDialogOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>

            {/* Adresse de facturation */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building className="h-5 w-5 text-primary" />
                        Adresse de facturation
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="sameAsShipping"
                            checked={sameAsShipping}
                            onCheckedChange={(checked) =>
                                setSameAsShipping(checked === true)
                            }
                        />
                        <Label
                            htmlFor="sameAsShipping"
                            className="cursor-pointer"
                        >
                            Identique à l'adresse de livraison
                        </Label>
                    </div>

                    {!sameAsShipping && (
                        <RadioGroup
                            value={data.adresse_facturation_id}
                            onValueChange={(v) =>
                                setData('adresse_facturation_id', v)
                            }
                        >
                            <div className="space-y-3">
                                {addresses
                                    .filter(
                                        (a: Address) =>
                                            a.type === 'facturation',
                                    )
                                    .map((addr: Address) => (
                                        <AddressCard
                                            key={addr.id}
                                            address={addr}
                                            selected={
                                                data.adresse_facturation_id ===
                                                String(addr.id)
                                            }
                                            onSelect={() =>
                                                setData(
                                                    'adresse_facturation_id',
                                                    String(addr.id),
                                                )
                                            }
                                            onEdit={() => onEditAddress(addr)}
                                            onDelete={() =>
                                                onDeleteAddress(addr.id)
                                            }
                                        />
                                    ))}
                            </div>
                        </RadioGroup>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}

function AddressCard({ address, selected, onSelect, onEdit, onDelete }: any) {
    return (
        <label
            className={cn(
                'relative flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-all',
                selected
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'hover:border-primary/50',
            )}
        >
            <RadioGroupItem
                value={String(address.id)}
                id={`addr-${address.id}`}
                className="mt-0.5"
            />
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    {address.type === 'livraison' ? (
                        <Home className="h-4 w-4 text-muted-foreground" />
                    ) : (
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    )}
                    <p className="font-medium">{address.rue}</p>
                    {address.est_defaut && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                            Par défaut
                        </Badge>
                    )}
                </div>
                {address.complement && (
                    <p className="text-sm text-muted-foreground">
                        {address.complement}
                    </p>
                )}
                <p className="text-sm text-muted-foreground">
                    {address.code_postal} {address.ville}, {address.pays}
                </p>
                {address.telephone && (
                    <p className="text-sm text-muted-foreground">
                        {address.telephone}
                    </p>
                )}
            </div>
            <div className="flex gap-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                        e.preventDefault();
                        onEdit();
                    }}
                >
                    <Pencil className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={(e) => {
                        e.preventDefault();
                        onDelete();
                    }}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </label>
    );
}

function AddressForm({ data, onChange, isLoading, onSave, onCancel }: any) {
    return (
        <div className="grid gap-4 py-4">
            <Input
                placeholder="Rue *"
                value={data.rue}
                onChange={(e) => onChange('rue', e.target.value)}
            />
            <Input
                placeholder="Complément"
                value={data.complement}
                onChange={(e) => onChange('complement', e.target.value)}
            />
            <div className="grid grid-cols-2 gap-3">
                <Input
                    placeholder="Code postal *"
                    value={data.code_postal}
                    onChange={(e) => onChange('code_postal', e.target.value)}
                />
                <Input
                    placeholder="Ville *"
                    value={data.ville}
                    onChange={(e) => onChange('ville', e.target.value)}
                />
            </div>
            <Input
                placeholder="Pays"
                value={data.pays}
                onChange={(e) => onChange('pays', e.target.value)}
            />
            <Input
                placeholder="Téléphone"
                value={data.telephone}
                onChange={(e) => onChange('telephone', e.target.value)}
            />
            <div className="flex items-center space-x-2">
                <Checkbox
                    id="est_defaut"
                    checked={data.est_defaut}
                    onCheckedChange={(checked) =>
                        onChange('est_defaut', checked === true)
                    }
                />
                <Label htmlFor="est_defaut">
                    Définir comme adresse par défaut
                </Label>
            </div>
            <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={onCancel}>
                    Annuler
                </Button>
                <Button onClick={onSave} disabled={isLoading}>
                    {isLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Enregistrer
                </Button>
            </div>
        </div>
    );
}

function ShippingStep({
    shippingMethods,
    selectedShipping,
    setSelectedShipping,
}: any) {
    return (
        <motion.div
            key="shipping"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <Card>
                <CardHeader>
                    <CardTitle>Mode de livraison</CardTitle>
                    <CardDescription>
                        Choisissez comment vous souhaitez recevoir votre
                        commande
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RadioGroup
                        value={selectedShipping}
                        onValueChange={setSelectedShipping}
                    >
                        <div className="space-y-3">
                            {shippingMethods.map((method: ShippingMethod) => (
                                <label
                                    key={method.id}
                                    className={cn(
                                        'flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition-all',
                                        selectedShipping === method.id
                                            ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                            : 'hover:border-primary/50',
                                    )}
                                >
                                    <RadioGroupItem
                                        value={method.id}
                                        id={method.id}
                                        className="mt-0.5"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="font-medium">
                                                {method.name}
                                            </p>
                                            <Badge variant="outline">
                                                {method.price === 0
                                                    ? 'Gratuit'
                                                    : `€${method.price.toFixed(2)}`}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {method.description}
                                        </p>
                                        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            Livraison estimée :{' '}
                                            {method.estimatedDays}
                                        </p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </RadioGroup>
                </CardContent>
            </Card>
        </motion.div>
    );
}

function PaymentStep({
    paymentMethods,
    selectedPayment,
    setSelectedPayment,
}: any) {
    return (
        <motion.div
            key="payment"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <Card>
                <CardHeader>
                    <CardTitle>Mode de paiement</CardTitle>
                    <CardDescription>
                        Sélectionnez votre moyen de paiement préféré
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RadioGroup
                        value={selectedPayment}
                        onValueChange={setSelectedPayment}
                    >
                        <div className="space-y-3">
                            {paymentMethods.map((method: PaymentMethod) => {
                                const Icon = method.icon;

                                return (
                                    <label
                                        key={method.id}
                                        className={cn(
                                            'flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition-all',
                                            selectedPayment === method.id
                                                ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                                : 'hover:border-primary/50',
                                        )}
                                    >
                                        <RadioGroupItem
                                            value={method.id}
                                            id={method.id}
                                            className="mt-0.5"
                                        />
                                        <Icon className="h-5 w-5 text-primary" />
                                        <div className="flex-1">
                                            <p className="font-medium">
                                                {method.name}
                                            </p>
                                            {method.description && (
                                                <p className="text-sm text-muted-foreground">
                                                    {method.description}
                                                </p>
                                            )}
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </RadioGroup>
                </CardContent>
            </Card>
        </motion.div>
    );
}

function ReviewStep({
    cart,
    shippingAddress,
    billingAddress,
    shippingMethod,
    paymentMethod,
    notes,
    setNotes,
    onEditStep,
}: any) {
    return (
        <motion.div
            key="review"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <Card>
                <CardHeader>
                    <CardTitle>Récapitulatif de votre commande</CardTitle>
                    <CardDescription>
                        Vérifiez les détails avant de confirmer
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Adresses */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <ReviewSection
                            title="Adresse de livraison"
                            onEdit={() => onEditStep('address')}
                        >
                            {shippingAddress ? (
                                <AddressSummary address={shippingAddress} />
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    Non définie
                                </p>
                            )}
                        </ReviewSection>
                        <ReviewSection
                            title="Adresse de facturation"
                            onEdit={() => onEditStep('address')}
                        >
                            {billingAddress ? (
                                <AddressSummary address={billingAddress} />
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    Non définie
                                </p>
                            )}
                        </ReviewSection>
                    </div>

                    {/* Livraison */}
                    <ReviewSection
                        title="Mode de livraison"
                        onEdit={() => onEditStep('shipping')}
                    >
                        <p className="font-medium">{shippingMethod?.name}</p>
                        <p className="text-sm text-muted-foreground">
                            {shippingMethod?.description}
                        </p>
                    </ReviewSection>

                    {/* Paiement */}
                    <ReviewSection
                        title="Mode de paiement"
                        onEdit={() => onEditStep('payment')}
                    >
                        <p className="font-medium">{paymentMethod?.name}</p>
                    </ReviewSection>

                    {/* Articles */}
                    <div>
                        <h4 className="mb-2 text-sm font-medium">
                            Articles ({cart.nb_articles})
                        </h4>
                        <ScrollArea className="max-h-48 pr-4">
                            <div className="space-y-2">
                                {cart.items.map((item: any) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-3 text-sm"
                                    >
                                        <img
                                            src={
                                                item.produit.image || undefined
                                            }
                                            alt={item.produit.nom}
                                            className="h-10 w-10 rounded-md object-cover"
                                        />
                                        <span className="flex-1">
                                            {item.produit.nom}
                                        </span>
                                        <span className="text-muted-foreground">
                                            {item.quantite} x €
                                            {item.prix_unitaire.toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Notes */}
                    <div>
                        <Label htmlFor="notes" className="mb-2 block">
                            Notes (optionnel)
                        </Label>
                        <Textarea
                            id="notes"
                            placeholder="Instructions particulières..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="resize-none"
                            rows={3}
                        />
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

function ReviewSection({ title, children, onEdit }: any) {
    return (
        <div className="rounded-lg border p-4">
            <div className="mb-2 flex items-center justify-between">
                <h4 className="text-sm font-medium">{title}</h4>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8"
                    onClick={onEdit}
                >
                    <Pencil className="mr-1 h-3 w-3" />
                    Modifier
                </Button>
            </div>
            {children}
        </div>
    );
}

function AddressSummary({ address }: { address: Address }) {
    return (
        <div className="text-sm">
            <p className="font-medium">{address.rue}</p>
            {address.complement && <p>{address.complement}</p>}
            <p>
                {address.code_postal} {address.ville}
            </p>
            <p>{address.pays}</p>
            {address.telephone && <p>{address.telephone}</p>}
        </div>
    );
}

function OrderSummary({
    cart,
    subtotal,
    taxes,
    shipping,
    discounts,
    total,
    shippingMethodName,
}: any) {
    return (
        <div className="lg:col-span-1">
            <Card className="sticky top-20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Votre commande
                    </CardTitle>
                    <CardDescription>
                        {cart.nb_articles} article
                        {+cart.nb_articles > 1 ? 's' : ''}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ScrollArea className="max-h-64 pr-4">
                        <div className="space-y-3">
                            {cart.items.slice(0, 5).map((item: any) => (
                                <div key={item.id} className="flex gap-3">
                                    <img
                                        src={item.produit.image || undefined}
                                        alt={item.produit.nom}
                                        className="h-12 w-12 rounded-md object-cover"
                                    />
                                    <div className="flex-1">
                                        <p className="line-clamp-1 text-sm font-medium">
                                            {item.produit.nom}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Qté: {item.quantite} x €
                                            {item.prix_unitaire.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {cart.items.length > 5 && (
                                <p className="text-xs text-muted-foreground">
                                    + {cart.items.length - 5} autre
                                    {+cart.items.length - 5 > 1 ? 's' : ''}{' '}
                                    article
                                    {+cart.items.length - 5 > 1 ? 's' : ''}
                                </p>
                            )}
                        </div>
                    </ScrollArea>

                    <Separator />

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">
                                Sous-total
                            </span>
                            <span>€{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Taxes</span>
                            <span>€{taxes.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">
                                Livraison
                            </span>
                            <span>
                                {shipping === 0 ? (
                                    <Badge variant="secondary">Gratuite</Badge>
                                ) : (
                                    `€${shipping.toFixed(2)}`
                                )}
                            </span>
                        </div>
                        {discounts > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span>Remises</span>
                                <span>-€{discounts.toFixed(2)}</span>
                            </div>
                        )}
                        <Separator />
                        <div className="flex justify-between text-base font-bold">
                            <span>Total</span>
                            <span>€{total.toFixed(2)}</span>
                        </div>
                        {shippingMethodName && (
                            <p className="text-xs text-muted-foreground">
                                Livraison : {shippingMethodName}
                            </p>
                        )}
                    </div>

                    <div className="rounded-lg bg-muted/30 p-3 text-xs">
                        <div className="flex items-center gap-2 font-medium">
                            <ShieldCheck className="h-4 w-4 text-green-600" />
                            Paiement 100% sécurisé
                        </div>
                        <p className="mt-1 text-muted-foreground">
                            Vos données sont protégées par cryptage SSL.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
