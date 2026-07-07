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
    ShoppingBag,
    Star,
    Sparkles,
    ArrowLeft,
    ArrowRight,
    Lock,
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
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
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import MainLayout from '@/layouts/main-layout';
import { handleImageFallback, resolveImageUrl } from '@/lib/media';
import { cn } from '@/lib/utils';
import type { Cart, Address, PageProps } from '@/types/ecommerce/products';

// ─── Types ───────────────────────────────────────────────
interface ShippingMethod {
    id: string;
    name: string;
    description: string;
    price: number;
    estimatedDays: string;
}
interface PaymentMethod {
    id: string;
    name: string;
    description?: string;
}
interface Props extends Record<string, unknown> {
    cart: Cart;
    addresses: Address[];
    shippingMethods?: ShippingMethod[];
    paymentMethods?: PaymentMethod[];
}

// ─── Constantes ──────────────────────────────────────────
const STEPS = [
    {
        id: 'address' as const,
        label: 'Adresse',
        icon: MapPin,
        desc: 'Livraison & facturation',
    },
    {
        id: 'shipping' as const,
        label: 'Livraison',
        icon: Truck,
        desc: "Mode d'expédition",
    },
    {
        id: 'payment' as const,
        label: 'Paiement',
        icon: CreditCard,
        desc: 'Moyen de paiement',
    },
    {
        id: 'review' as const,
        label: 'Confirmation',
        icon: ShieldCheck,
        desc: 'Récapitulatif',
    },
];

const DEFAULT_SHIPPING: ShippingMethod[] = [
    {
        id: 'standard',
        name: 'Standard',
        description: 'Livraison à domicile sous 5-7 jours',
        price: 0,
        estimatedDays: '5-7 jours',
    },
    {
        id: 'express',
        name: 'Express',
        description: 'Livraison prioritaire sous 24-48h',
        price: 15000,
        estimatedDays: '1-2 jours',
    },
];
const DEFAULT_PAYMENT: PaymentMethod[] = [
    {
        id: 'mobile_money',
        name: 'Mobile Money',
        description: 'M-Pesa, Airtel Money, Orange Money',
    },
    { id: 'card', name: 'Carte bancaire', description: 'Visa, Mastercard' },
    { id: 'cash', name: 'Paiement à la livraison' },
];

// ─── Helpers ─────────────────────────────────────────────
const formatCurrency = (amount: number, currency = 'CDF') => {
    try {
        return new Intl.NumberFormat('fr-CD', {
            style: 'currency',
            currency,
            minimumFractionDigits: 2,
        }).format(amount);
    } catch {
        return `${amount.toFixed(2)} ${currency}`;
    }
};
const safeNumber = (val: unknown): number =>
    typeof val === 'number' ? val : Number(val) || 0;

// ─── Composant principal ─────────────────────────────────
export default function CheckoutIndex() {
    const { props } = usePage<Props>();
    const { cart, addresses: initialAddresses = [] } = props;
    const shippingMethods = props.shippingMethods?.length
        ? props.shippingMethods
        : DEFAULT_SHIPPING;
    const paymentMethods = props.paymentMethods?.length
        ? props.paymentMethods
        : DEFAULT_PAYMENT;

    // ─── State ───────────────────────────────────────────
    const [currentStep, setCurrentStep] =
        useState<(typeof STEPS)[number]['id']>('address');
    const [direction, setDirection] = useState(1); // 1 = avant, -1 = arrière
    const [selectedShipping, setSelectedShipping] = useState(
        shippingMethods[0].id,
    );
    const [selectedPayment, setSelectedPayment] = useState(
        paymentMethods[0].id,
    );
    const [sameAsShipping, setSameAsShipping] = useState(false);
    const [addressDialogOpen, setAddressDialogOpen] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState<number | null>(
        null,
    );
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        adresse_facturation_id: '',
        adresse_livraison_id: '',
        shipping_method_id: shippingMethods[0].id,
        payment_method_id: paymentMethods[0].id,
        notes: '',
        same_as_shipping: false,
        new_address: {
            id: null as number | null,
            rue: '',
            complement: '',
            code_postal: '',
            ville: '',
            pays: 'RDCongo',
            telephone: '',
            type: 'livraison' as 'facturation' | 'livraison',
            est_defaut: false,
        },
    });

    // ─── Sync ────────────────────────────────────────────
    useEffect(
        () => setData('shipping_method_id', selectedShipping),
        [selectedShipping, setData],
    );
    useEffect(
        () => setData('payment_method_id', selectedPayment),
        [selectedPayment, setData],
    );
    useEffect(() => {
        setData('same_as_shipping', sameAsShipping);

        if (sameAsShipping && data.adresse_livraison_id) {
            setData('adresse_facturation_id', data.adresse_livraison_id);
        }
    }, [sameAsShipping, data.adresse_livraison_id, setData]);

    // ─── Calculs ─────────────────────────────────────────
    const subtotal = safeNumber(cart.sous_total);
    const taxes = safeNumber(cart.total_taxes);
    const shippingPrice =
        shippingMethods.find((m) => m.id === selectedShipping)?.price ?? 0;
    const discounts = safeNumber(cart.total_remises);
    const total = Math.max(0, subtotal + taxes + shippingPrice - discounts);

    // ─── Adresses ────────────────────────────────────────
    const handleSaveAddress = () => {
        const addr = data.new_address;
        const url = editingAddressId
            ? route('tenant.addresses.update', editingAddressId)
            : route('tenant.addresses.store');
        const method = editingAddressId ? 'put' : 'post';
        setIsLoadingAddresses(true);
        router.visit(url, {
            method,
            data: addr,
            preserveState: true,
            preserveScroll: true,
            showProgress: false,
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
            onFinish: () => setIsLoadingAddresses(false),
        });
    };
    const resetNewAddress = () => {
        setData('new_address', {
            id: null,
            rue: '',
            complement: '',
            code_postal: '',
            ville: '',
            pays: 'RDCongo',
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
    const deleteAddress = (id: number) => {
        if (confirm('Supprimer cette adresse ?')) {
            router.delete(route('tenant.addresses.destroy', id), {
                preserveState: true,
                preserveScroll: false,
                only: ['addresses'],
                onSuccess: () => toast.success('Adresse supprimée'),
            });
        }
    };

    // ─── Progression ─────────────────────────────────────
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
    const stepIndex = STEPS.findIndex((s) => s.id === currentStep);

    const nextStep = () => {
        if (canProceed() && stepIndex < STEPS.length - 1) {
            setDirection(1);
            setCurrentStep(STEPS[stepIndex + 1].id);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (!canProceed()) {
            toast.error('Veuillez compléter toutes les informations requises');
        }
    };
    const prevStep = () => {
        if (stepIndex > 0) {
            setDirection(-1);
            setCurrentStep(STEPS[stepIndex - 1].id);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    const goToStep = (id: (typeof STEPS)[number]['id']) => {
        const targetIdx = STEPS.findIndex((s) => s.id === id);

        if (targetIdx < stepIndex) {
            setDirection(-1);
            setCurrentStep(id);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('tenant.checkout.process'), {
            preserveScroll: true,
            showProgress: false,
            onSuccess: () =>
                toast.success('Commande confirmée ! Redirection...'),
            onError: () => toast.error('Une erreur est survenue'),
        });
    };

    // ─── Adresses sélectionnées ──────────────────────────
    const shippingAddr = initialAddresses.find(
        (a) => String(a.id) === data.adresse_livraison_id,
    );
    const billingAddr = sameAsShipping
        ? shippingAddr
        : initialAddresses.find(
              (a) => String(a.id) === data.adresse_facturation_id,
          );

    // Complétion des étapes (pour l'affichage du stepper)
    const stepCompletion = useMemo(() => {
        const completed = new Set<string>();

        if (data.adresse_livraison_id) {
            completed.add('address');
        }

        if (selectedShipping) {
            completed.add('shipping');
        }

        if (selectedPayment) {
            completed.add('payment');
        }

        return completed;
    }, [data.adresse_livraison_id, selectedShipping, selectedPayment]);

    return (
        <MainLayout>
            <Head title="Finaliser la commande" />
            <TooltipProvider>
                <div className="min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
                    <div className="mx-auto max-w-7xl px-4 py-8 lg:py-12">
                        {/* ─── Header ─── */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-10 text-center"
                        >
                            <Badge
                                variant="outline"
                                className="mb-4 border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                            >
                                <Sparkles className="mr-1.5 h-3 w-3" /> Paiement
                                sécurisé
                            </Badge>
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl dark:text-white">
                                Finaliser votre commande
                            </h1>
                            <p className="mt-2 text-slate-500 dark:text-slate-400">
                                Plus que quelques étapes avant de recevoir vos
                                articles
                            </p>
                        </motion.div>

                        {/* ─── Stepper moderne ─── */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="mb-12"
                        >
                            <nav
                                aria-label="Étapes de commande"
                                className="flex items-center justify-center gap-0"
                            >
                                {STEPS.map((step, idx) => {
                                    const isCompleted =
                                        stepCompletion.has(step.id) &&
                                        idx < stepIndex;
                                    const isCurrent = step.id === currentStep;
                                    const isUpcoming =
                                        !isCompleted && !isCurrent;
                                    const StepIcon = step.icon;

                                    return (
                                        <div
                                            key={step.id}
                                            className="flex items-center"
                                        >
                                            {/* Cercle */}
                                            <button
                                                onClick={() =>
                                                    idx < stepIndex &&
                                                    goToStep(step.id)
                                                }
                                                disabled={idx > stepIndex}
                                                className={cn(
                                                    'group relative flex flex-col items-center gap-1.5 transition-all',
                                                    idx <= stepIndex
                                                        ? 'cursor-pointer'
                                                        : 'cursor-default',
                                                )}
                                            >
                                                <div
                                                    className={cn(
                                                        'relative flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300',
                                                        isCompleted &&
                                                            'border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30',
                                                        isCurrent &&
                                                            'border-emerald-500 bg-white text-emerald-600 shadow-lg shadow-emerald-200 dark:bg-slate-800 dark:shadow-emerald-900/30',
                                                        isUpcoming &&
                                                            'border-slate-200 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-800',
                                                    )}
                                                >
                                                    {isCompleted ? (
                                                        <motion.div
                                                            initial={{
                                                                scale: 0,
                                                            }}
                                                            animate={{
                                                                scale: 1,
                                                            }}
                                                            transition={{
                                                                type: 'spring',
                                                                stiffness: 500,
                                                                damping: 30,
                                                            }}
                                                        >
                                                            <Check className="h-5 w-5" />
                                                        </motion.div>
                                                    ) : (
                                                        <StepIcon className="h-5 w-5" />
                                                    )}
                                                    {/* Anneau extérieur pour l'étape courante */}
                                                    {isCurrent && (
                                                        <motion.div
                                                            initial={{
                                                                opacity: 0,
                                                                scale: 0.8,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                scale: 1,
                                                            }}
                                                            className="absolute inset-0 rounded-full border-2 border-emerald-400"
                                                            style={{
                                                                animation:
                                                                    'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                                <div className="text-center">
                                                    <span
                                                        className={cn(
                                                            'text-xs font-semibold transition-colors',
                                                            isCompleted &&
                                                                'text-emerald-600 dark:text-emerald-400',
                                                            isCurrent &&
                                                                'text-slate-900 dark:text-white',
                                                            isUpcoming &&
                                                                'text-slate-400 dark:text-slate-500',
                                                        )}
                                                    >
                                                        {step.label}
                                                    </span>
                                                    <p className="hidden text-[10px] text-slate-400 sm:block">
                                                        {step.desc}
                                                    </p>
                                                </div>
                                            </button>

                                            {/* Ligne de connexion */}
                                            {idx < STEPS.length - 1 && (
                                                <div className="relative mx-2 h-0.5 w-12 overflow-hidden rounded-full sm:w-24 md:w-32">
                                                    <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700" />
                                                    <motion.div
                                                        className="absolute inset-y-0 left-0 bg-emerald-500"
                                                        initial={{
                                                            width: isCompleted
                                                                ? '100%'
                                                                : '0%',
                                                        }}
                                                        animate={{
                                                            width: isCompleted
                                                                ? '100%'
                                                                : '0%',
                                                        }}
                                                        transition={{
                                                            duration: 0.5,
                                                            ease: 'easeInOut',
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </nav>
                        </motion.div>

                        {/* ─── Contenu principal ─── */}
                        <div className="grid gap-8 lg:grid-cols-3">
                            {/* Formulaire à gauche */}
                            <div className="lg:col-span-2">
                                <AnimatePresence mode="wait" custom={direction}>
                                    <motion.div
                                        key={currentStep}
                                        custom={direction}
                                        initial={{
                                            opacity: 0,
                                            x: direction * 40,
                                        }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{
                                            opacity: 0,
                                            x: direction * -40,
                                        }}
                                        transition={{
                                            duration: 0.25,
                                            ease: 'easeInOut',
                                        }}
                                    >
                                        {currentStep === 'address' && (
                                            <AddressStep
                                                addresses={initialAddresses}
                                                data={data}
                                                setData={setData}
                                                errors={errors}
                                                sameAsShipping={sameAsShipping}
                                                setSameAsShipping={
                                                    setSameAsShipping
                                                }
                                                addressDialogOpen={
                                                    addressDialogOpen
                                                }
                                                setAddressDialogOpen={
                                                    setAddressDialogOpen
                                                }
                                                editingAddressId={
                                                    editingAddressId
                                                }
                                                isLoadingAddresses={
                                                    isLoadingAddresses
                                                }
                                                onSaveAddress={
                                                    handleSaveAddress
                                                }
                                                onEditAddress={editAddress}
                                                onDeleteAddress={deleteAddress}
                                                resetNewAddress={
                                                    resetNewAddress
                                                }
                                            />
                                        )}
                                        {currentStep === 'shipping' && (
                                            <ShippingStep
                                                methods={shippingMethods}
                                                selected={selectedShipping}
                                                onSelect={setSelectedShipping}
                                            />
                                        )}
                                        {currentStep === 'payment' && (
                                            <PaymentStep
                                                methods={paymentMethods}
                                                selected={selectedPayment}
                                                onSelect={setSelectedPayment}
                                            />
                                        )}
                                        {currentStep === 'review' && (
                                            <ReviewStep
                                                cart={cart}
                                                shippingAddress={shippingAddr}
                                                billingAddress={billingAddr}
                                                shippingMethod={shippingMethods.find(
                                                    (m) =>
                                                        m.id ===
                                                        selectedShipping,
                                                )!}
                                                paymentMethod={paymentMethods.find(
                                                    (m) =>
                                                        m.id ===
                                                        selectedPayment,
                                                )!}
                                                notes={data.notes}
                                                setNotes={(v: string) =>
                                                    setData('notes', v)
                                                }
                                                onEditStep={goToStep}
                                            />
                                        )}
                                    </motion.div>
                                </AnimatePresence>

                                {/* Navigation */}
                                <div className="mt-8 flex items-center justify-between gap-4">
                                    {currentStep !== 'address' ? (
                                        <Button
                                            variant="outline"
                                            onClick={prevStep}
                                            className="gap-2 rounded-xl"
                                        >
                                            <ArrowLeft className="h-4 w-4" />{' '}
                                            Retour
                                        </Button>
                                    ) : (
                                        <div />
                                    )}
                                    <div className="flex-1" />
                                    {currentStep !== 'review' ? (
                                        <Button
                                            onClick={nextStep}
                                            disabled={!canProceed()}
                                            className={cn(
                                                'gap-2 rounded-xl px-6 shadow-md transition-all',
                                                canProceed() &&
                                                    'shadow-emerald-200 hover:shadow-lg dark:shadow-emerald-900/20',
                                            )}
                                        >
                                            Continuer{' '}
                                            <ArrowRight className="h-4 w-4" />
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={handleSubmit}
                                            disabled={processing}
                                            size="lg"
                                            className="min-w-48 gap-2 rounded-xl bg-emerald-600 px-8 shadow-lg shadow-emerald-200 hover:bg-emerald-700 dark:shadow-emerald-900/30"
                                        >
                                            {processing ? (
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                            ) : (
                                                <Lock className="h-5 w-5" />
                                            )}
                                            {processing
                                                ? 'Traitement…'
                                                : 'Confirmer la commande'}
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Récapitulatif à droite (sticky) */}
                            <OrderSummary
                                cart={cart}
                                subtotal={subtotal}
                                taxes={taxes}
                                shipping={shippingPrice}
                                discounts={discounts}
                                total={total}
                                shippingMethodName={
                                    shippingMethods.find(
                                        (m) => m.id === selectedShipping,
                                    )?.name
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* Styles pour l'animation ping */}
                <style>{`
                    @keyframes ping {
                        75%, 100% { transform: scale(1.3); opacity: 0; }
                    }
                `}</style>
            </TooltipProvider>
        </MainLayout>
    );
}

// ──────────────────────────────────────────────────────────
// Sous-composants (modernisés)
// ──────────────────────────────────────────────────────────

function AddressStep({
    addresses,
    data,
    setData,
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
    const deliveryAddresses = addresses.filter(
        (a: Address) => a.type === 'livraison',
    );
    const billingAddresses = addresses.filter(
        (a: Address) => a.type === 'facturation',
    );

    return (
        <div className="space-y-6">
            {/* Adresse de livraison */}
            <Card className="overflow-hidden rounded-2xl border-0 bg-white shadow-md dark:bg-slate-900">
                <div className="bg-linear-to-r from-emerald-500 to-emerald-600 px-6 py-4">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                        <Truck className="h-5 w-5" /> Adresse de livraison
                    </h3>
                    <p className="mt-0.5 text-sm text-emerald-100">
                        Où souhaitez-vous recevoir votre commande ?
                    </p>
                </div>
                <CardContent className="p-6">
                    {deliveryAddresses.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 py-8 text-center">
                            <MapPin className="h-12 w-12 text-slate-300 dark:text-slate-600" />
                            <p className="text-slate-500 dark:text-slate-400">
                                Aucune adresse de livraison enregistrée
                            </p>
                            <Button
                                onClick={() => {
                                    resetNewAddress();
                                    setAddressDialogOpen(true);
                                }}
                                className="gap-2 rounded-xl"
                            >
                                <Plus className="h-4 w-4" /> Ajouter une adresse
                            </Button>
                        </div>
                    ) : (
                        <RadioGroup
                            value={data.adresse_livraison_id}
                            onValueChange={(v) =>
                                setData('adresse_livraison_id', v)
                            }
                        >
                            <div className="space-y-3">
                                {deliveryAddresses.map((addr: Address) => (
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
                    )}
                    {deliveryAddresses.length > 0 && (
                        <Dialog
                            open={addressDialogOpen}
                            onOpenChange={setAddressDialogOpen}
                        >
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="mt-4 w-full gap-2 rounded-xl"
                                    onClick={() => resetNewAddress()}
                                >
                                    <Plus className="h-4 w-4" /> Ajouter une
                                    nouvelle adresse
                                </Button>
                            </DialogTrigger>
                            <AddressDialogContent
                                data={data}
                                setData={setData}
                                isLoading={isLoadingAddresses}
                                onSave={onSaveAddress}
                                onCancel={() => setAddressDialogOpen(false)}
                                editing={!!editingAddressId}
                            />
                        </Dialog>
                    )}
                </CardContent>
            </Card>

            {/* Adresse de facturation */}
            <Card className="overflow-hidden rounded-2xl border-0 bg-white shadow-md dark:bg-slate-900">
                <div className="bg-linear-to-r from-slate-600 to-slate-700 px-6 py-4">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                        <Building className="h-5 w-5" /> Adresse de facturation
                    </h3>
                    <p className="mt-0.5 text-sm text-slate-300">
                        Adresse associée à votre moyen de paiement
                    </p>
                </div>
                <CardContent className="p-6">
                    <label className="mb-4 flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
                        <Checkbox
                            id="sameAsShipping"
                            checked={sameAsShipping}
                            onCheckedChange={(c) => setSameAsShipping(!!c)}
                        />
                        <Label
                            htmlFor="sameAsShipping"
                            className="cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                            Identique à l'adresse de livraison
                        </Label>
                    </label>
                    {!sameAsShipping &&
                        (billingAddresses.length === 0 ? (
                            <div className="flex flex-col items-center gap-3 py-4 text-center">
                                <p className="text-sm text-slate-500">
                                    Aucune adresse de facturation disponible
                                </p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        resetNewAddress();
                                        setData('new_address', {
                                            ...data.new_address,
                                            type: 'facturation',
                                        });
                                        setAddressDialogOpen(true);
                                    }}
                                    className="gap-2 rounded-xl"
                                >
                                    <Plus className="h-3 w-3" /> Ajouter
                                </Button>
                            </div>
                        ) : (
                            <RadioGroup
                                value={data.adresse_facturation_id}
                                onValueChange={(v) =>
                                    setData('adresse_facturation_id', v)
                                }
                            >
                                <div className="space-y-3">
                                    {billingAddresses.map((addr: Address) => (
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
                        ))}
                </CardContent>
            </Card>
        </div>
    );
}

function AddressCard({ address, selected, onSelect, onEdit, onDelete }: any) {
    return (
        <label
            className={cn(
                'group relative flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-all duration-200',
                selected
                    ? 'border-emerald-400 bg-emerald-50/60 shadow-md dark:border-emerald-500 dark:bg-emerald-950/20'
                    : 'border-slate-100 bg-white hover:border-emerald-200 hover:shadow-sm dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-emerald-700',
            )}
        >
            <RadioGroupItem
                value={String(address.id)}
                id={`addr-${address.id}`}
                className="mt-0.5"
            />
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    {address.type === 'livraison' ? (
                        <Home className="h-4 w-4 shrink-0 text-emerald-500" />
                    ) : (
                        <Briefcase className="h-4 w-4 shrink-0 text-slate-500" />
                    )}
                    <p className="truncate font-semibold text-slate-800 dark:text-white">
                        {address.rue}
                    </p>
                    {address.est_defaut && (
                        <Badge
                            variant="secondary"
                            className="ml-auto shrink-0 text-[10px]"
                        >
                            <Star className="mr-0.5 h-2.5 w-2.5" /> Défaut
                        </Badge>
                    )}
                </div>
                {address.complement && (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        {address.complement}
                    </p>
                )}
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    {address.code_postal} {address.ville}, {address.pays}
                </p>
                {address.telephone && (
                    <p className="text-sm text-slate-500">
                        {address.telephone}
                    </p>
                )}
            </div>
            <div className="flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                        e.preventDefault();
                        onEdit();
                    }}
                >
                    <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-rose-500 hover:text-rose-600"
                    onClick={(e) => {
                        e.preventDefault();
                        onDelete();
                    }}
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </Button>
            </div>
            {selected && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md"
                >
                    <Check className="h-3.5 w-3.5" />
                </motion.div>
            )}
        </label>
    );
}

function AddressDialogContent({
    data,
    setData,
    isLoading,
    onSave,
    onCancel,
    editing,
}: any) {
    return (
        <DialogContent className="rounded-2xl sm:max-w-md">
            <DialogHeader>
                <DialogTitle>
                    {editing ? "Modifier l'adresse" : 'Nouvelle adresse'}
                </DialogTitle>
                <DialogDescription>
                    Remplissez les informations ci-dessous
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <Input
                    placeholder="Rue *"
                    value={data.new_address.rue}
                    onChange={(e) =>
                        setData('new_address', {
                            ...data.new_address,
                            rue: e.target.value,
                        })
                    }
                    className="rounded-xl"
                />
                <Input
                    placeholder="Complément"
                    value={data.new_address.complement}
                    onChange={(e) =>
                        setData('new_address', {
                            ...data.new_address,
                            complement: e.target.value,
                        })
                    }
                    className="rounded-xl"
                />
                <div className="grid grid-cols-2 gap-3">
                    <Input
                        placeholder="Code postal *"
                        value={data.new_address.code_postal}
                        onChange={(e) =>
                            setData('new_address', {
                                ...data.new_address,
                                code_postal: e.target.value,
                            })
                        }
                        className="rounded-xl"
                    />
                    <Input
                        placeholder="Ville *"
                        value={data.new_address.ville}
                        onChange={(e) =>
                            setData('new_address', {
                                ...data.new_address,
                                ville: e.target.value,
                            })
                        }
                        className="rounded-xl"
                    />
                </div>
                <Input
                    placeholder="Pays"
                    value={data.new_address.pays}
                    onChange={(e) =>
                        setData('new_address', {
                            ...data.new_address,
                            pays: e.target.value,
                        })
                    }
                    className="rounded-xl"
                />
                <Input
                    placeholder="Téléphone"
                    value={data.new_address.telephone}
                    onChange={(e) =>
                        setData('new_address', {
                            ...data.new_address,
                            telephone: e.target.value,
                        })
                    }
                    className="rounded-xl"
                />
                <label className="flex items-center gap-2">
                    <Checkbox
                        checked={data.new_address.est_defaut}
                        onCheckedChange={(c) =>
                            setData('new_address', {
                                ...data.new_address,
                                est_defaut: !!c,
                            })
                        }
                    />
                    <span className="text-sm">
                        Définir comme adresse par défaut
                    </span>
                </label>
                <div className="flex justify-end gap-3">
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        className="rounded-xl"
                    >
                        Annuler
                    </Button>
                    <Button
                        onClick={onSave}
                        disabled={isLoading}
                        className="gap-2 rounded-xl"
                    >
                        {isLoading && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        )}
                        Enregistrer
                    </Button>
                </div>
            </div>
        </DialogContent>
    );
}

function ShippingStep({ methods, selected, onSelect }: any) {
    return (
        <Card className="overflow-hidden rounded-2xl border-0 bg-white shadow-md dark:bg-slate-900">
            <div className="bg-linear-to-r from-blue-500 to-blue-600 px-6 py-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                    <Truck className="h-5 w-5" /> Mode de livraison
                </h3>
                <p className="mt-0.5 text-sm text-blue-100">
                    Choisissez la rapidité de votre expédition
                </p>
            </div>
            <CardContent className="p-6">
                <RadioGroup value={selected} onValueChange={onSelect}>
                    <div className="space-y-3">
                        {methods.map((m: ShippingMethod) => (
                            <label
                                key={m.id}
                                className={cn(
                                    'flex cursor-pointer items-start gap-4 rounded-xl border-2 p-4 transition-all duration-200',
                                    selected === m.id
                                        ? 'border-blue-400 bg-blue-50/60 shadow-md dark:border-blue-500 dark:bg-blue-950/20'
                                        : 'border-slate-100 hover:border-blue-200 hover:shadow-sm dark:border-slate-700 dark:hover:border-blue-700',
                                )}
                            >
                                <RadioGroupItem
                                    value={m.id}
                                    id={m.id}
                                    className="mt-0.5"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold text-slate-800 dark:text-white">
                                            {m.name}
                                        </span>
                                        <Badge
                                            variant={
                                                m.price === 0
                                                    ? 'secondary'
                                                    : 'default'
                                            }
                                            className={
                                                m.price === 0
                                                    ? ''
                                                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                                            }
                                        >
                                            {m.price === 0
                                                ? 'Gratuit'
                                                : formatCurrency(
                                                      m.price,
                                                      'CDF',
                                                  )}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        {m.description}
                                    </p>
                                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                                        <Clock className="h-3 w-3" />{' '}
                                        {m.estimatedDays}
                                    </p>
                                </div>
                                {selected === m.id && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="text-blue-500"
                                    >
                                        <CheckCircle2 className="h-5 w-5" />
                                    </motion.div>
                                )}
                            </label>
                        ))}
                    </div>
                </RadioGroup>
            </CardContent>
        </Card>
    );
}

function PaymentStep({ methods, selected, onSelect }: any) {
    return (
        <Card className="overflow-hidden rounded-2xl border-0 bg-white shadow-md dark:bg-slate-900">
            <div className="bg-linear-to-r from-purple-500 to-purple-600 px-6 py-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                    <CreditCard className="h-5 w-5" /> Mode de paiement
                </h3>
                <p className="mt-0.5 text-sm text-purple-100">
                    Paiement 100% sécurisé par cryptage SSL
                </p>
            </div>
            <CardContent className="p-6">
                <RadioGroup value={selected} onValueChange={onSelect}>
                    <div className="space-y-3">
                        {methods.map((m: PaymentMethod) => (
                            <label
                                key={m.id}
                                className={cn(
                                    'flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all duration-200',
                                    selected === m.id
                                        ? 'border-purple-400 bg-purple-50/60 shadow-md dark:border-purple-500 dark:bg-purple-950/20'
                                        : 'border-slate-100 hover:border-purple-200 hover:shadow-sm dark:border-slate-700 dark:hover:border-purple-700',
                                )}
                            >
                                <RadioGroupItem
                                    value={m.id}
                                    id={m.id}
                                    className="mt-0.5"
                                />
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400">
                                    <CreditCard className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <span className="font-semibold text-slate-800 dark:text-white">
                                        {m.name}
                                    </span>
                                    {m.description && (
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            {m.description}
                                        </p>
                                    )}
                                </div>
                                {selected === m.id && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="text-purple-500"
                                    >
                                        <CheckCircle2 className="h-5 w-5" />
                                    </motion.div>
                                )}
                            </label>
                        ))}
                    </div>
                </RadioGroup>
            </CardContent>
        </Card>
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
        <div className="space-y-6">
            <Card className="overflow-hidden rounded-2xl border-0 bg-white shadow-md dark:bg-slate-900">
                <div className="bg-linear-to-r from-amber-500 to-amber-600 px-6 py-4">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                        <ShieldCheck className="h-5 w-5" /> Récapitulatif de
                        votre commande
                    </h3>
                    <p className="mt-0.5 text-sm text-amber-100">
                        Vérifiez les informations avant de confirmer
                    </p>
                </div>
                <CardContent className="space-y-6 p-6">
                    {/* Adresses */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <ReviewBlock
                            title="Livraison"
                            icon={Truck}
                            onEdit={() => onEditStep('address')}
                        >
                            {shippingAddress ? (
                                <AddressSummary address={shippingAddress} />
                            ) : (
                                <p className="text-sm text-slate-400">
                                    Non définie
                                </p>
                            )}
                        </ReviewBlock>
                        <ReviewBlock
                            title="Facturation"
                            icon={Building}
                            onEdit={() => onEditStep('address')}
                        >
                            {billingAddress ? (
                                <AddressSummary address={billingAddress} />
                            ) : (
                                <p className="text-sm text-slate-400">
                                    Non définie
                                </p>
                            )}
                        </ReviewBlock>
                    </div>
                    {/* Livraison & Paiement */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <ReviewBlock
                            title="Expédition"
                            icon={Truck}
                            onEdit={() => onEditStep('shipping')}
                        >
                            <p className="font-semibold text-slate-800 dark:text-white">
                                {shippingMethod.name}
                            </p>
                            <p className="text-sm text-slate-500">
                                {shippingMethod.description}
                            </p>
                        </ReviewBlock>
                        <ReviewBlock
                            title="Paiement"
                            icon={CreditCard}
                            onEdit={() => onEditStep('payment')}
                        >
                            <p className="font-semibold text-slate-800 dark:text-white">
                                {paymentMethod.name}
                            </p>
                            {paymentMethod.description && (
                                <p className="text-sm text-slate-500">
                                    {paymentMethod.description}
                                </p>
                            )}
                        </ReviewBlock>
                    </div>
                    {/* Articles */}
                    <div>
                        <h4 className="mb-3 font-semibold text-slate-800 dark:text-white">
                            <ShoppingBag className="mr-1.5 inline h-4 w-4" />
                            Articles ({cart.nb_articles})
                        </h4>
                        <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
                            {cart.items.map((item: any) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-3 rounded-lg bg-slate-50 p-2 dark:bg-slate-800/50"
                                >
                                    <img
                                        src={resolveImageUrl(
                                            item.produit.image,
                                        )}
                                        alt=""
                                        className="h-10 w-10 rounded-lg object-cover"
                                        onError={handleImageFallback()}
                                    />
                                    <span className="flex-1 truncate text-sm text-slate-700 dark:text-slate-300">
                                        {item.produit.nom}
                                    </span>
                                    <span className="text-sm text-slate-500">
                                        {item.quantite} ×{' '}
                                        {formatCurrency(
                                            safeNumber(item.prix_unitaire),
                                            'CDF',
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Notes */}
                    <div>
                        <Label
                            htmlFor="notes"
                            className="font-medium text-slate-700 dark:text-slate-300"
                        >
                            Notes de commande (optionnel)
                        </Label>
                        <Textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            className="mt-2 rounded-xl"
                            placeholder="Instructions particulières…"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function ReviewBlock({ title, icon: Icon, children, onEdit }: any) {
    return (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
            <div className="mb-2 flex items-center justify-between">
                <h4 className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    <Icon className="h-4 w-4" /> {title}
                </h4>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onEdit}
                    className="h-7 gap-1 rounded-lg text-xs"
                >
                    <Pencil className="h-3 w-3" /> Modifier
                </Button>
            </div>
            <div className="text-sm">{children}</div>
        </div>
    );
}

function AddressSummary({ address }: { address: Address }) {
    return (
        <div className="text-slate-600 dark:text-slate-400">
            <p className="font-semibold text-slate-800 dark:text-white">
                {address.rue}
            </p>
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
            <Card className="sticky top-24 overflow-hidden rounded-2xl border-0 bg-white shadow-lg dark:bg-slate-900">
                <div className="bg-linear-to-r from-emerald-500 to-teal-500 px-6 py-4">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                        <ShoppingBag className="h-5 w-5" /> Votre commande
                    </h3>
                    <p className="text-sm text-emerald-100">
                        {cart.nb_articles} article
                        {cart.nb_articles > 1 ? 's' : ''}
                    </p>
                </div>
                <CardContent className="space-y-4 p-6">
                    <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
                        {cart.items.slice(0, 6).map((item: any) => (
                            <div key={item.id} className="flex gap-3">
                                <img
                                    src={resolveImageUrl(item.produit.image)}
                                    alt=""
                                    className="h-12 w-12 rounded-lg border border-slate-200 object-cover dark:border-slate-700"
                                    onError={handleImageFallback()}
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-slate-800 dark:text-white">
                                        {item.produit.nom}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        Qté: {item.quantite} ×{' '}
                                        {formatCurrency(
                                            safeNumber(item.prix_unitaire),
                                            'CDF',
                                        )}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {cart.items.length > 6 && (
                            <p className="text-xs text-slate-400">
                                + {cart.items.length - 6} autre(s) article(s)
                            </p>
                        )}
                    </div>
                    <Separator />
                    <div className="space-y-2 text-sm">
                        <Row
                            label="Sous-total"
                            value={formatCurrency(subtotal, 'CDF')}
                        />
                        <Row
                            label="Taxes"
                            value={formatCurrency(taxes, 'CDF')}
                        />
                        <Row
                            label="Livraison"
                            value={
                                shipping === 0
                                    ? 'Gratuite'
                                    : formatCurrency(shipping, 'CDF')
                            }
                            highlight={shipping === 0}
                        />
                        {discounts > 0 && (
                            <Row
                                label="Remises"
                                value={`-${formatCurrency(discounts, 'CDF')}`}
                                highlight
                            />
                        )}
                        <Separator />
                        <div className="flex justify-between text-base font-bold text-slate-800 dark:text-white">
                            <span>Total</span>
                            <span className="text-emerald-600 dark:text-emerald-400">
                                {formatCurrency(total, 'CDF')}
                            </span>
                        </div>
                        {shippingMethodName && (
                            <p className="text-xs text-slate-400">
                                Livraison : {shippingMethodName}
                            </p>
                        )}
                    </div>
                    <div className="rounded-xl bg-emerald-50 p-4 dark:bg-emerald-950/30">
                        <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                            <Lock className="h-4 w-4" /> Paiement 100% sécurisé
                        </div>
                        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                            Vos données sont protégées par cryptage SSL 256-bit.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function Row({
    label,
    value,
    highlight,
}: {
    label: string;
    value: string;
    highlight?: boolean;
}) {
    return (
        <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>{label}</span>
            <span
                className={cn(
                    'font-medium',
                    highlight && 'text-emerald-600 dark:text-emerald-400',
                )}
            >
                {value}
            </span>
        </div>
    );
}
