/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/Pages/Vendor/Configure.tsx
// import { Head, useForm, Link } from '@inertiajs/react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//     ArrowLeft,
//     ArrowRight,
//     Store,
//     Globe,
//     Mail,
//     Phone,
//     Camera,
//     CheckCircle,
//     AlertCircle,
//     Sparkles,
//     ShieldCheck,
//     Zap,
//     Eye,
//     Loader2,
//     Lightbulb,
//     XCircle,
//     Copy,
//     Check,
//     FileCheck,
//     FileText,
//     Search,
//     ChevronDown,
//     ChevronsUpDown,
// } from 'lucide-react';
// import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import {
//     Command,
//     CommandEmpty,
//     CommandGroup,
//     CommandInput,
//     CommandItem,
//     CommandList,
// } from '@/components/ui/command';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import {
//     Popover,
//     PopoverContent,
//     PopoverTrigger,
// } from '@/components/ui/popover';
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from '@/components/ui/select';
// import { Textarea } from '@/components/ui/textarea';

// // Types des données venant du backend
// interface Currency {
//     code: string;
//     symbol: string;
//     name: string;
// }

// interface Language {
//     code: string;
//     name: string;
// }

// interface Country {
//     iso2: string;
//     name: string;
//     phone_code: string;
// }

// // ---------- TYPES (à placer en dehors du composant) ----------
// interface TypeDocument {
//     id: string;
//     code: string;
//     nom: string;
//     description: string | null;
//     est_obligatoire: boolean;
//     forme_juridique?: string; // "societe_commerciale" | "petit_commercant" | "organisation_sans_but_lucratif" | "toutes"
// }

// interface DocumentData {
//     numero: string;
//     date_delivrance: string;
//     date_expiration: string;
// }

// interface Props {
//     plan: { id: number; name: string; formatted_price: string; price: number };
//     currencies: Currency[];
//     languages: Language[];
//     countries: Country[];
//     requiredDocuments: TypeDocument[]; // ✅ tableau
//     optionalDocuments: TypeDocument[]; // ✅ tableau
// }

// // Étapes
// const STEPS = [
//     { id: 1, name: 'Identité', icon: Store },
//     { id: 2, name: 'Contact', icon: Mail },
//     { id: 3, name: 'Légal', icon: FileCheck },
//     { id: 4, name: 'Apparence', icon: Camera },
//     { id: 5, name: 'Validation', icon: ShieldCheck },
// ];

// // Fonction pour obtenir le drapeau depuis flagcdn.com (basée sur le code ISO2)
// function getFlagUrl(iso2: string): string {
//     return `https://flagcdn.com/w40/${iso2}.png`;
// }

// // Détection automatique du pays de l'utilisateur via son fuseau horaire
// function detectUserCountry(countries: Country[]): Country | null {
//     const tz = Intl.DateTimeFormat().resolvedOptions().timeZone; // ex: "Africa/Lubumbashi"
//     const parts = tz.split('/');
//     const city = parts[1] || '';

//     // Chercher le pays correspondant via son ISO2 (approximation)
//     const tzMap: Record<string, string> = {
//         Kinshasa: 'cd',
//         Lubumbashi: 'cd',
//         Paris: 'fr',
//         London: 'gb',
//         New_York: 'us',
//         Brussels: 'be',
//         Zurich: 'ch',
//         Toronto: 'ca',
//         Brazzaville: 'cg',
//         Kigali: 'rw',
//         Bujumbura: 'bi',
//         Nairobi: 'ke',
//         Dar_es_Salaam: 'tz',
//         Kampala: 'ug',
//     };

//     const iso2 = tzMap[city] || 'cd';

//     return countries.find((c) => c.iso2 === iso2) || null;
// }

// export default function VendorConfigure({
//     plan,
//     currencies,
//     languages,
//     countries,
//     requiredDocuments,
//     optionalDocuments,
// }: Props) {
//     // Détection du pays
//     const detectedCountry = useMemo(
//         () => detectUserCountry(countries),
//         [countries],
//     );

//     const [currentStep, setCurrentStep] = useState(1);
//     const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
//     const [slugStatus, setSlugStatus] = useState<
//         'idle' | 'checking' | 'available' | 'unavailable'
//     >('idle');
//     const [slugChecking, setSlugChecking] = useState(false);
//     const [slugErrors, setSlugErrors] = useState<string[]>([]);
//     const [slugSuggestions, setSlugSuggestions] = useState<string[]>([]);
//     const [nameSuggestions, setNameSuggestions] = useState<
//         { slug: string; domain: string }[]
//     >([]);
//     const [logoPreview, setLogoPreview] = useState<string | null>(null);
//     const [selectedPhoneCountry, setSelectedPhoneCountry] =
//         useState<Country | null>(detectedCountry);
//     const [phoneSearch, setPhoneSearch] = useState('');
//     const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

//     const { data, setData, post, processing, errors } = useForm({
//         plan_id: plan.id,
//         shop_name: '',
//         shop_slug: '',
//         shop_description: '',
//         contact_email: '',
//         contact_phone: '',
//         phone_code: detectedCountry?.phone_code || '+243',
//         currency: 'CDF',
//         language: 'fr',
//         logo: null as File | null,
//         facebook_url: '',
//         instagram_url: '',
//         twitter_url: '',
//         youtube_url: '',
//         tiktok_url: '',
//         accept_terms: false,
//         forme_juridique: 'societe_commerciale',
//         legal_documents: {} as Record<string, DocumentData>,
//     });

//     const selectedCurrency = useMemo(
//         () => currencies.find((c) => c.code === data.currency),
//         [currencies, data.currency],
//     );

//     const selectedLanguage = useMemo(
//         () => languages.find((l) => l.code === data.language),
//         [languages, data.language],
//     );

//     // Slug helpers
//     const cleanSlug = (v: string) => v.toLowerCase().replace(/[^a-z0-9-]/g, '');
//     const generateBaseSlug = (name: string) =>
//         name
//             .toLowerCase()
//             .normalize('NFD')
//             .replace(/[\u0300-\u036f]/g, '')
//             .replace(/[^a-z0-9]+/g, '-')
//             .replace(/^-|-$/g, '');

//     useEffect(() => {
//         if (!slugManuallyEdited && data.shop_name) {
//             setData('shop_slug', generateBaseSlug(data.shop_name));
//         }
//     }, [data.shop_name, slugManuallyEdited, setData]);

//     const checkSlug = useCallback(
//         async (slug: string) => {
//             if (!slug || slug.length < 3) {
//                 setSlugStatus('idle');
//                 setSlugErrors([]);
//                 setSlugSuggestions([]);

//                 return;
//             }

//             setSlugChecking(true);
//             setSlugStatus('checking');

//             try {
//                 const res = await fetch('/devenir-vendeur/check-domain', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'X-CSRF-TOKEN':
//                             document
//                                 .querySelector('meta[name="csrf-token"]')
//                                 ?.getAttribute('content') || '',
//                     },
//                     body: JSON.stringify({ slug }),
//                 });
//                 const json = await res.json();

//                 if (json.errors?.length) {
//                     setSlugStatus('unavailable');
//                     setSlugErrors(json.errors);
//                 } else if (json.available) {
//                     setSlugStatus('available');
//                     setSlugErrors([]);

//                     if (json.cleaned_slug && json.cleaned_slug !== slug) {
//                         setData('shop_slug', json.cleaned_slug);
//                     }
//                 } else {
//                     setSlugStatus('unavailable');
//                     setSlugErrors(['Ce sous-domaine est déjà pris.']);
//                     setSlugSuggestions(json.suggestions || []);
//                 }
//             } catch {
//                 setSlugStatus('idle');
//             } finally {
//                 setSlugChecking(false);
//             }
//         },
//         [setData],
//     );

//     useEffect(() => {
//         if (debounceTimer.current) {
//             clearTimeout(debounceTimer.current);
//         }

//         if (data.shop_slug.length >= 3) {
//             debounceTimer.current = setTimeout(
//                 () => checkSlug(data.shop_slug),
//                 500,
//             );
//         } else {
//             setSlugStatus('idle');
//             setSlugSuggestions([]);
//         }

//         return () => {
//             if (debounceTimer.current) {
//                 clearTimeout(debounceTimer.current);
//             }
//         };
//     }, [data.shop_slug, checkSlug]);

//     const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];

//         if (file) {
//             setData('logo', file);
//             setLogoPreview(URL.createObjectURL(file));
//         }
//     };

//     const isFormValid = () => {
//         if (
//             !data.shop_name.trim() ||
//             !data.shop_slug.trim() ||
//             slugStatus !== 'available'
//         ) {
//             return false;
//         }

//         if (!data.contact_email.trim()) {
//             return false;
//         }

//         for (const doc of requiredDocuments) {
//             if (!data.legal_documents[doc.code]?.numero?.trim()) {
//                 return false;
//             }
//         }

//         if (!data.accept_terms) {
//             return false;
//         }

//         return true;
//     };

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();

//         if (isFormValid()) {
//             post('/devenir-vendeur/store');
//         }
//     };

//     // Filtrer les pays pour le sélecteur téléphonique
//     const filteredCountries = useMemo(() => {
//         if (!phoneSearch.trim()) {
//             return countries;
//         }

//         return countries.filter(
//             (c) =>
//                 c.name.toLowerCase().includes(phoneSearch.toLowerCase()) ||
//                 c.phone_code.includes(phoneSearch),
//         );
//     }, [phoneSearch, countries]);

//     return (
//         <>
//             <Head title="Configurez votre boutique" />
//             <div className="min-h-screen bg-linear-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
//                 {/* Barre de progression */}
//                 <div className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur-xl dark:bg-gray-900/80">
//                     <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
//                         <Link
//                             href={route('vendor.register')}
//                             className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-amber-600"
//                         >
//                             <ArrowLeft className="h-4 w-4" /> Retour
//                         </Link>
//                         {/* Barre de progression */}
//                         <div className="hidden items-center gap-1 sm:flex">
//                             {STEPS.map((step, idx) => (
//                                 <div
//                                     key={step.id}
//                                     className="flex items-center gap-1"
//                                 >
//                                     <button
//                                         onClick={() => setCurrentStep(step.id)}
//                                         className={`flex cursor-pointer items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition hover:bg-gray-200 dark:hover:bg-gray-700 ${
//                                             currentStep === step.id
//                                                 ? 'bg-amber-100 text-amber-700 shadow-sm dark:bg-amber-900/50 dark:text-amber-300'
//                                                 : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
//                                         }`}
//                                     >
//                                         <step.icon className="h-3 w-3" />
//                                         {step.name}
//                                     </button>
//                                     {idx < STEPS.length - 1 && (
//                                         <div className="h-px w-6 bg-gray-300 dark:bg-gray-700" />
//                                     )}
//                                 </div>
//                             ))}
//                         </div>
//                         <Badge
//                             variant="outline"
//                             className="bg-amber-50 text-amber-700"
//                         >
//                             <Zap className="mr-1 h-3 w-3" /> Plan {plan.name}
//                         </Badge>
//                     </div>
//                 </div>

//                 <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
//                     <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         className="mb-12 text-center"
//                     >
//                         <div className="mb-4 inline-flex rounded-2xl bg-amber-50 p-3 dark:bg-amber-900/20">
//                             <Sparkles className="h-10 w-10 text-amber-500" />
//                         </div>
//                         <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
//                             Créez votre boutique
//                         </h1>
//                         <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
//                             {plan.price === 0
//                                 ? 'Votre espace sera prêt en quelques secondes.'
//                                 : `Configuration terminée, paiement de ${plan.formatted_price}/mois.`}
//                         </p>
//                     </motion.div>

//                     <form onSubmit={handleSubmit} className="space-y-8">
//                         <AnimatePresence mode="wait">
//                             {/* ============================================================ */}
//                             {/* Étape 1 : Identité */}
//                             {/* ============================================================ */}
//                             {currentStep === 1 && (
//                                 <motion.div
//                                     key="step1"
//                                     initial={{ opacity: 0, y: 20 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     exit={{ opacity: 0, y: -20 }}
//                                     className="rounded-2xl border bg-card p-8 shadow-sm"
//                                 >
//                                     <h2 className="flex items-center gap-3 text-lg font-semibold">
//                                         <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white">
//                                             1
//                                         </span>{' '}
//                                         Identité
//                                     </h2>
//                                     <div className="mt-6 space-y-6">
//                                         <div>
//                                             <Label htmlFor="shop_name">
//                                                 Nom de la boutique{' '}
//                                                 <span className="text-red-500">
//                                                     *
//                                                 </span>
//                                             </Label>
//                                             <div className="relative mt-2">
//                                                 <Store className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
//                                                 <Input
//                                                     id="shop_name"
//                                                     value={data.shop_name}
//                                                     onChange={(e) =>
//                                                         setData(
//                                                             'shop_name',
//                                                             e.target.value,
//                                                         )
//                                                     }
//                                                     className="pl-10"
//                                                     placeholder="Ma Boutique Artisanale"
//                                                     required
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div>
//                                             <Label htmlFor="shop_slug">
//                                                 Adresse web{' '}
//                                                 <span className="text-red-500">
//                                                     *
//                                                 </span>
//                                             </Label>
//                                             <div className="mt-2 flex rounded-lg shadow-sm">
//                                                 <div className="relative flex-1">
//                                                     <Globe className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
//                                                     <Input
//                                                         id="shop_slug"
//                                                         value={data.shop_slug}
//                                                         onChange={(e) => {
//                                                             setSlugManuallyEdited(
//                                                                 true,
//                                                             );
//                                                             setData(
//                                                                 'shop_slug',
//                                                                 cleanSlug(
//                                                                     e.target
//                                                                         .value,
//                                                                 ),
//                                                             );
//                                                         }}
//                                                         className={`rounded-r-none pl-10 ${
//                                                             slugStatus ===
//                                                             'available'
//                                                                 ? 'border-green-500 focus-visible:ring-green-500'
//                                                                 : slugStatus ===
//                                                                     'unavailable'
//                                                                   ? 'border-red-500 focus-visible:ring-red-500'
//                                                                   : ''
//                                                         }`}
//                                                         placeholder="ma-boutique"
//                                                         required
//                                                     />
//                                                     <div className="absolute top-1/2 right-3 -translate-y-1/2">
//                                                         {slugChecking && (
//                                                             <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
//                                                         )}
//                                                         {!slugChecking &&
//                                                             slugStatus ===
//                                                                 'available' && (
//                                                                 <CheckCircle className="h-5 w-5 text-green-500" />
//                                                             )}
//                                                         {!slugChecking &&
//                                                             slugStatus ===
//                                                                 'unavailable' && (
//                                                                 <XCircle className="h-5 w-5 text-red-500" />
//                                                             )}
//                                                     </div>
//                                                 </div>
//                                                 <span className="flex items-center rounded-r-lg border border-l-0 bg-muted px-4 text-sm text-muted-foreground">
//                                                     .{window.location.hostname}
//                                                 </span>
//                                             </div>
//                                             <AnimatePresence>
//                                                 {slugStatus === 'available' && (
//                                                     <motion.p
//                                                         initial={{
//                                                             opacity: 0,
//                                                             y: -5,
//                                                         }}
//                                                         animate={{
//                                                             opacity: 1,
//                                                             y: 0,
//                                                         }}
//                                                         className="mt-2 text-sm text-green-600"
//                                                     >
//                                                         <CheckCircle className="inline h-4 w-4" />{' '}
//                                                         Disponible !
//                                                     </motion.p>
//                                                 )}
//                                                 {slugErrors.map((err, i) => (
//                                                     <motion.p
//                                                         key={i}
//                                                         initial={{
//                                                             opacity: 0,
//                                                             y: -5,
//                                                         }}
//                                                         animate={{
//                                                             opacity: 1,
//                                                             y: 0,
//                                                         }}
//                                                         className="mt-2 text-sm text-red-500"
//                                                     >
//                                                         <XCircle className="inline h-4 w-4" />{' '}
//                                                         {err}
//                                                     </motion.p>
//                                                 ))}
//                                             </AnimatePresence>
//                                             {slugSuggestions.length > 0 && (
//                                                 <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
//                                                     <p className="mb-2 flex items-center gap-1 text-sm font-medium text-amber-700">
//                                                         <Lightbulb className="h-4 w-4" />{' '}
//                                                         Suggestions :
//                                                     </p>
//                                                     <div className="flex flex-wrap gap-2">
//                                                         {slugSuggestions.map(
//                                                             (s) => (
//                                                                 <button
//                                                                     key={s}
//                                                                     type="button"
//                                                                     onClick={() => {
//                                                                         setData(
//                                                                             'shop_slug',
//                                                                             s,
//                                                                         );
//                                                                         setSlugManuallyEdited(
//                                                                             true,
//                                                                         );
//                                                                         checkSlug(
//                                                                             s,
//                                                                         );
//                                                                     }}
//                                                                     className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-amber-100"
//                                                                 >
//                                                                     <Copy className="h-3 w-3" />{' '}
//                                                                     {s}
//                                                                 </button>
//                                                             ),
//                                                         )}
//                                                     </div>
//                                                 </div>
//                                             )}
//                                         </div>
//                                         {/* Bouton Continuer dans chaque étape */}
//                                         <div className="flex justify-end">
//                                             <Button
//                                                 type="button"
//                                                 onClick={() =>
//                                                     setCurrentStep((prev) =>
//                                                         Math.min(prev + 1, 5),
//                                                     )
//                                                 }
//                                             >
//                                                 Continuer{' '}
//                                                 <ArrowRight className="ml-2 h-4 w-4" />
//                                             </Button>
//                                         </div>
//                                     </div>
//                                 </motion.div>
//                             )}

//                             {/* ============================================================ */}
//                             {/* Étape 2 : Contact */}
//                             {/* ============================================================ */}
//                             {currentStep === 2 && (
//                                 <motion.div
//                                     key="step2"
//                                     initial={{ opacity: 0, y: 20 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     exit={{ opacity: 0, y: -20 }}
//                                     className="rounded-2xl border bg-card p-8 shadow-sm"
//                                 >
//                                     <h2 className="flex items-center gap-3 text-lg font-semibold">
//                                         <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white">
//                                             2
//                                         </span>{' '}
//                                         Contact & localisation
//                                     </h2>
//                                     <div className="mt-6 grid gap-6 sm:grid-cols-2">
//                                         <div>
//                                             <Label htmlFor="contact_email">
//                                                 Email{' '}
//                                                 <span className="text-red-500">
//                                                     *
//                                                 </span>
//                                             </Label>
//                                             <div className="relative mt-2">
//                                                 <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
//                                                 <Input
//                                                     id="contact_email"
//                                                     type="email"
//                                                     value={data.contact_email}
//                                                     onChange={(e) =>
//                                                         setData(
//                                                             'contact_email',
//                                                             e.target.value,
//                                                         )
//                                                     }
//                                                     className="pl-10"
//                                                     required
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div>
//                                             <Label>Téléphone</Label>
//                                             <div className="mt-2 flex gap-2">
//                                                 {/* Sélecteur de pays avec drapeaux réels */}
//                                                 <Popover>
//                                                     <PopoverTrigger asChild>
//                                                         <Button
//                                                             variant="outline"
//                                                             className="w-32.5 justify-between"
//                                                             role="combobox"
//                                                         >
//                                                             {selectedPhoneCountry ? (
//                                                                 <span className="flex items-center gap-2">
//                                                                     <img
//                                                                         src={getFlagUrl(
//                                                                             selectedPhoneCountry.iso2,
//                                                                         )}
//                                                                         alt=""
//                                                                         className="h-4 w-6 rounded-sm object-cover"
//                                                                     />
//                                                                     {
//                                                                         selectedPhoneCountry.phone_code
//                                                                     }
//                                                                 </span>
//                                                             ) : (
//                                                                 <ChevronsUpDown className="h-4 w-4" />
//                                                             )}
//                                                         </Button>
//                                                     </PopoverTrigger>
//                                                     <PopoverContent
//                                                         className="w-70 p-0"
//                                                         align="start"
//                                                     >
//                                                         <Command>
//                                                             <CommandInput
//                                                                 placeholder="Rechercher un pays..."
//                                                                 value={
//                                                                     phoneSearch
//                                                                 }
//                                                                 onValueChange={
//                                                                     setPhoneSearch
//                                                                 }
//                                                             />
//                                                             <CommandList>
//                                                                 <CommandEmpty>
//                                                                     Aucun pays
//                                                                     trouvé
//                                                                 </CommandEmpty>
//                                                                 <CommandGroup>
//                                                                     {filteredCountries.map(
//                                                                         (
//                                                                             country,
//                                                                         ) => (
//                                                                             <CommandItem
//                                                                                 key={
//                                                                                     country.iso2
//                                                                                 }
//                                                                                 value={
//                                                                                     country.phone_code
//                                                                                 }
//                                                                                 onSelect={() => {
//                                                                                     setSelectedPhoneCountry(
//                                                                                         country,
//                                                                                     );
//                                                                                     setData(
//                                                                                         'phone_code',
//                                                                                         country.phone_code,
//                                                                                     );
//                                                                                 }}
//                                                                             >
//                                                                                 <img
//                                                                                     src={getFlagUrl(
//                                                                                         country.iso2,
//                                                                                     )}
//                                                                                     alt=""
//                                                                                     className="mr-2 h-4 w-6 rounded-sm object-cover"
//                                                                                 />
//                                                                                 {
//                                                                                     country.name
//                                                                                 }
//                                                                                 <span className="ml-auto text-muted-foreground">
//                                                                                     {
//                                                                                         country.phone_code
//                                                                                     }
//                                                                                 </span>
//                                                                             </CommandItem>
//                                                                         ),
//                                                                     )}
//                                                                 </CommandGroup>
//                                                             </CommandList>
//                                                         </Command>
//                                                     </PopoverContent>
//                                                 </Popover>
//                                                 <Input
//                                                     type="tel"
//                                                     value={data.contact_phone}
//                                                     onChange={(e) =>
//                                                         setData(
//                                                             'contact_phone',
//                                                             e.target.value,
//                                                         )
//                                                     }
//                                                     placeholder="XXX XXX XXX"
//                                                     className="flex-1"
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div>
//                                             <Label>Devise par défaut</Label>
//                                             <Select
//                                                 value={data.currency}
//                                                 onValueChange={(v) =>
//                                                     setData('currency', v)
//                                                 }
//                                             >
//                                                 <SelectTrigger className="mt-2">
//                                                     <SelectValue />
//                                                 </SelectTrigger>
//                                                 <SelectContent>
//                                                     {currencies.map((c) => (
//                                                         <SelectItem
//                                                             key={c.code}
//                                                             value={c.code}
//                                                         >
//                                                             {c.code} — {c.name}{' '}
//                                                             ({c.symbol})
//                                                         </SelectItem>
//                                                     ))}
//                                                 </SelectContent>
//                                             </Select>
//                                         </div>
//                                         <div>
//                                             <Label>Langue par défaut</Label>
//                                             <Select
//                                                 value={data.language}
//                                                 onValueChange={(v) =>
//                                                     setData('language', v)
//                                                 }
//                                             >
//                                                 <SelectTrigger className="mt-2">
//                                                     <SelectValue />
//                                                 </SelectTrigger>
//                                                 <SelectContent>
//                                                     {languages.map((l) => (
//                                                         <SelectItem
//                                                             key={l.code}
//                                                             value={l.code}
//                                                         >
//                                                             {l.name}
//                                                         </SelectItem>
//                                                     ))}
//                                                 </SelectContent>
//                                             </Select>
//                                         </div>
//                                         <div className="sm:col-span-2">
//                                             <Label htmlFor="shop_description">
//                                                 Description
//                                             </Label>
//                                             <Textarea
//                                                 id="shop_description"
//                                                 value={data.shop_description}
//                                                 onChange={(e) =>
//                                                     setData(
//                                                         'shop_description',
//                                                         e.target.value,
//                                                     )
//                                                 }
//                                                 className="mt-2"
//                                                 rows={4}
//                                                 maxLength={500}
//                                                 placeholder="Parlez-nous de votre activité, de vos produits..."
//                                             />
//                                             <p className="mt-1 text-right text-xs text-muted-foreground">
//                                                 {data.shop_description
//                                                     ?.length || 0}
//                                                 /500
//                                             </p>
//                                         </div>
//                                         <div className="flex justify-between sm:col-span-2">
//                                             <Button
//                                                 type="button"
//                                                 variant="outline"
//                                                 onClick={() =>
//                                                     setCurrentStep(1)
//                                                 }
//                                             >
//                                                 <ArrowLeft className="mr-2 h-4 w-4" />{' '}
//                                                 Retour
//                                             </Button>
//                                             {/* Bouton Continuer dans chaque étape */}
//                                             <div className="flex justify-end">
//                                                 <Button
//                                                     type="button"
//                                                     onClick={() =>
//                                                         setCurrentStep((prev) =>
//                                                             Math.min(
//                                                                 prev + 1,
//                                                                 5,
//                                                             ),
//                                                         )
//                                                     }
//                                                 >
//                                                     Continuer{' '}
//                                                     <ArrowRight className="ml-2 h-4 w-4" />
//                                                 </Button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </motion.div>
//                             )}

//                             {/* Étape 3 : Légal */}
//                             {currentStep === 3 && (
//                                 <motion.div
//                                     key="step3"
//                                     initial={{ opacity: 0, y: 20 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     exit={{ opacity: 0, y: -20 }}
//                                     className="rounded-2xl border bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800/80"
//                                 >
//                                     <h2 className="flex items-center gap-3 text-lg font-semibold">
//                                         <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white">
//                                             3
//                                         </span>{' '}
//                                         Documents légaux
//                                     </h2>
//                                     <p className="mt-2 text-sm text-muted-foreground">
//                                         Ces documents sont requis pour vérifier
//                                         votre identité et votre entreprise.
//                                     </p>

//                                     {/* Sélecteur de forme juridique */}
//                                     <div className="mt-6">
//                                         <Label htmlFor="forme_juridique">
//                                             Forme juridique de votre activité{' '}
//                                             <span className="text-red-500">
//                                                 *
//                                             </span>
//                                         </Label>
//                                         <Select
//                                             value={data.forme_juridique}
//                                             onValueChange={(v) => {
//                                                 setData('forme_juridique', v);
//                                                 setData('legal_documents', {});
//                                             }}
//                                         >
//                                             <SelectTrigger className="mt-2">
//                                                 <SelectValue placeholder="Sélectionnez votre forme juridique" />
//                                             </SelectTrigger>
//                                             <SelectContent>
//                                                 <SelectItem value="societe_commerciale">
//                                                     Société commerciale (RCCM)
//                                                 </SelectItem>
//                                                 <SelectItem value="petit_commercant">
//                                                     Petit commerçant individuel
//                                                     (Patente)
//                                                 </SelectItem>
//                                                 <SelectItem value="organisation_sans_but_lucratif">
//                                                     Organisation sans but
//                                                     lucratif (ASBL/ONG)
//                                                 </SelectItem>
//                                             </SelectContent>
//                                         </Select>
//                                     </div>

//                                     <div className="mt-6 space-y-8">
//                                         {/* Documents obligatoires pour la forme choisie */}
//                                         {/* Documents obligatoires pour la forme choisie ou communs */}
//                                         {requiredDocuments
//                                             .filter(
//                                                 (doc) =>
//                                                     doc.forme_juridique ===
//                                                         data.forme_juridique ||
//                                                     doc.forme_juridique ===
//                                                         'toutes',
//                                             )
//                                             .map((doc) => (
//                                                 <DocumentCard
//                                                     key={doc.id}
//                                                     doc={doc}
//                                                     data={data}
//                                                     setData={setData}
//                                                 />
//                                             ))}

//                                         {/* Documents optionnels pour la forme choisie */}
//                                         {/* Documents optionnels pour la forme choisie ou communs */}
//                                         {optionalDocuments.filter(
//                                             (doc) =>
//                                                 doc.forme_juridique ===
//                                                     data.forme_juridique ||
//                                                 doc.forme_juridique ===
//                                                     'toutes',
//                                         ).length > 0 && (
//                                             <div className="mt-6">
//                                                 <h3 className="mb-3 text-sm font-semibold text-gray-700">
//                                                     Documents facultatifs
//                                                 </h3>
//                                                 {optionalDocuments
//                                                     .filter(
//                                                         (doc) =>
//                                                             doc.forme_juridique ===
//                                                                 data.forme_juridique ||
//                                                             doc.forme_juridique ===
//                                                                 'toutes',
//                                                     )
//                                                     .map((doc) => (
//                                                         <DocumentCard
//                                                             key={doc.id}
//                                                             doc={doc}
//                                                             data={data}
//                                                             setData={setData}
//                                                         />
//                                                     ))}
//                                             </div>
//                                         )}
//                                     </div>

//                                     {/* Boutons de navigation */}
//                                     <div className="mt-6 flex justify-between">
//                                         <Button
//                                             type="button"
//                                             variant="outline"
//                                             onClick={() => setCurrentStep(2)}
//                                         >
//                                             <ArrowLeft className="mr-2 h-4 w-4" />{' '}
//                                             Retour
//                                         </Button>
//                                         <Button
//                                             type="button"
//                                             onClick={() =>
//                                                 setCurrentStep((prev) =>
//                                                     Math.min(prev + 1, 5),
//                                                 )
//                                             }
//                                         >
//                                             Continuer{' '}
//                                             <ArrowRight className="ml-2 h-4 w-4" />
//                                         </Button>
//                                     </div>
//                                 </motion.div>
//                             )}

//                             {/* Étape 4 : Apparence */}
//                             {currentStep === 4 && (
//                                 <motion.div
//                                     key="step4"
//                                     initial={{ opacity: 0, y: 20 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     exit={{ opacity: 0, y: -20 }}
//                                     className="rounded-2xl border bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800/80"
//                                 >
//                                     <h2 className="flex items-center gap-3 text-lg font-semibold">
//                                         <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white">
//                                             4
//                                         </span>{' '}
//                                         Apparence & réseaux sociaux
//                                     </h2>
//                                     <div className="mt-6 grid gap-6 sm:grid-cols-2">
//                                         <div className="sm:col-span-2">
//                                             <label className="mb-2 block text-sm font-medium">
//                                                 Logo
//                                             </label>
//                                             <div className="flex items-center gap-6">
//                                                 <div className="relative h-24 w-24 overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700">
//                                                     {logoPreview ? (
//                                                         <img
//                                                             src={logoPreview}
//                                                             alt="Logo"
//                                                             className="h-full w-full object-cover"
//                                                         />
//                                                     ) : (
//                                                         <div className="flex h-full w-full items-center justify-center text-gray-400">
//                                                             <Camera className="h-8 w-8" />
//                                                         </div>
//                                                     )}
//                                                     <input
//                                                         type="file"
//                                                         accept="image/*"
//                                                         onChange={
//                                                             handleLogoChange
//                                                         }
//                                                         className="absolute inset-0 cursor-pointer opacity-0"
//                                                     />
//                                                 </div>
//                                                 <div className="text-sm text-gray-500">
//                                                     <p className="font-medium">
//                                                         500 × 500 px
//                                                     </p>
//                                                     <p>
//                                                         PNG, JPG ou WebP. Max 2
//                                                         Mo.
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                         <SocialInput
//                                             label="Facebook"
//                                             value={data.facebook_url}
//                                             onChange={(v) =>
//                                                 setData('facebook_url', v)
//                                             }
//                                         />
//                                         <SocialInput
//                                             label="Instagram"
//                                             value={data.instagram_url}
//                                             onChange={(v) =>
//                                                 setData('instagram_url', v)
//                                             }
//                                         />
//                                         <SocialInput
//                                             label="Twitter / X"
//                                             value={data.twitter_url}
//                                             onChange={(v) =>
//                                                 setData('twitter_url', v)
//                                             }
//                                         />
//                                         <SocialInput
//                                             label="YouTube"
//                                             value={data.youtube_url}
//                                             onChange={(v) =>
//                                                 setData('youtube_url', v)
//                                             }
//                                         />
//                                         <SocialInput
//                                             label="TikTok"
//                                             value={data.tiktok_url}
//                                             onChange={(v) =>
//                                                 setData('tiktok_url', v)
//                                             }
//                                         />
//                                         <div className="flex justify-between sm:col-span-2">
//                                             <button
//                                                 type="button"
//                                                 onClick={() =>
//                                                     setCurrentStep(3)
//                                                 }
//                                                 className="rounded-xl px-6 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-100"
//                                             >
//                                                 <ArrowLeft className="mr-2 inline h-4 w-4" />{' '}
//                                                 Retour
//                                             </button>
//                                             {/* Bouton Continuer dans chaque étape */}
//                                             <div className="flex justify-end">
//                                                 <Button
//                                                     type="button"
//                                                     onClick={() =>
//                                                         setCurrentStep((prev) =>
//                                                             Math.min(
//                                                                 prev + 1,
//                                                                 5,
//                                                             ),
//                                                         )
//                                                     }
//                                                 >
//                                                     Continuer{' '}
//                                                     <ArrowRight className="ml-2 h-4 w-4" />
//                                                 </Button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </motion.div>
//                             )}

//                             {/* Étape 5 : Validation */}
//                             {currentStep === 5 && (
//                                 <motion.div
//                                     key="step5"
//                                     initial={{ opacity: 0, y: 20 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     exit={{ opacity: 0, y: -20 }}
//                                     className="rounded-2xl border bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800/80"
//                                 >
//                                     <h2 className="flex items-center gap-3 text-lg font-semibold">
//                                         <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white">
//                                             5
//                                         </span>{' '}
//                                         Récapitulatif & validation
//                                     </h2>
//                                     <div className="mt-6 space-y-6">
//                                         <div className="rounded-xl border bg-linear-to-br from-gray-50 to-white p-6 dark:border-gray-700 dark:from-gray-900 dark:to-gray-800">
//                                             <h3 className="mb-4 text-sm font-semibold text-gray-500 uppercase">
//                                                 Récapitulatif
//                                             </h3>
//                                             <dl className="divide-y divide-gray-200 dark:divide-gray-700">
//                                                 {[
//                                                     [
//                                                         'Plan',
//                                                         `${plan.name} (${plan.formatted_price})`,
//                                                     ],
//                                                     [
//                                                         'Nom',
//                                                         data.shop_name || '—',
//                                                     ],
//                                                     [
//                                                         'Adresse',
//                                                         `${data.shop_slug}.${window.location.hostname}`,
//                                                     ],
//                                                     [
//                                                         'Email',
//                                                         data.contact_email ||
//                                                             '—',
//                                                     ],
//                                                     ['Devise', data.currency],
//                                                     [
//                                                         'Langue',
//                                                         selectedLanguage?.name ||
//                                                             data.language,
//                                                     ],
//                                                 ].map(([label, value]) => (
//                                                     <div
//                                                         key={label}
//                                                         className="flex justify-between py-3"
//                                                     >
//                                                         <dt className="text-gray-600">
//                                                             {label}
//                                                         </dt>
//                                                         <dd className="font-medium text-gray-900 dark:text-white">
//                                                             {value}
//                                                         </dd>
//                                                     </div>
//                                                 ))}
//                                             </dl>
//                                         </div>
//                                         <div className="flex items-start gap-3 rounded-xl border p-4 dark:border-gray-700">
//                                             <input
//                                                 type="checkbox"
//                                                 checked={data.accept_terms}
//                                                 onChange={(e) =>
//                                                     setData(
//                                                         'accept_terms',
//                                                         e.target.checked,
//                                                     )
//                                                 }
//                                                 className="mt-1 h-5 w-5 rounded border-gray-300 text-amber-600"
//                                                 id="terms"
//                                             />
//                                             <label
//                                                 htmlFor="terms"
//                                                 className="text-sm text-gray-600 dark:text-gray-300"
//                                             >
//                                                 J'accepte les{' '}
//                                                 <Link
//                                                     href="/conditions"
//                                                     className="font-medium text-amber-600 underline"
//                                                     target="_blank"
//                                                 >
//                                                     conditions générales
//                                                 </Link>{' '}
//                                                 et la{' '}
//                                                 <Link
//                                                     href="/confidentialite"
//                                                     className="font-medium text-amber-600 underline"
//                                                     target="_blank"
//                                                 >
//                                                     politique de confidentialité
//                                                 </Link>
//                                                 .
//                                             </label>
//                                         </div>
//                                         {errors.accept_terms && (
//                                             <p className="text-sm text-red-500">
//                                                 <AlertCircle className="inline h-4 w-4" />{' '}
//                                                 {errors.accept_terms}
//                                             </p>
//                                         )}
//                                         <div className="flex items-center justify-center gap-4 rounded-xl bg-green-50 p-4 dark:bg-green-900/20">
//                                             <ShieldCheck className="h-5 w-5 text-green-600" />
//                                             <span className="text-sm font-medium text-green-700 dark:text-green-300">
//                                                 Vos données sont protégées et
//                                                 cryptées.
//                                             </span>
//                                         </div>
//                                         <div className="flex justify-between pt-4">
//                                             <button
//                                                 type="button"
//                                                 onClick={() =>
//                                                     setCurrentStep(4)
//                                                 }
//                                                 className="rounded-xl px-6 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-100"
//                                             >
//                                                 <ArrowLeft className="mr-2 inline h-4 w-4" />{' '}
//                                                 Retour
//                                             </button>
//                                             <motion.button
//                                                 type="submit"
//                                                 disabled={
//                                                     processing || !isFormValid()
//                                                 }
//                                                 whileHover={
//                                                     isFormValid()
//                                                         ? { scale: 1.03 }
//                                                         : {}
//                                                 }
//                                                 whileTap={
//                                                     isFormValid()
//                                                         ? { scale: 0.97 }
//                                                         : {}
//                                                 }
//                                                 className={`inline-flex items-center gap-3 rounded-2xl px-12 py-4 text-lg font-bold transition-all ${
//                                                     processing
//                                                         ? 'cursor-wait bg-amber-400 text-white'
//                                                         : isFormValid()
//                                                           ? 'bg-linear-to-r from-amber-600 to-amber-700 text-white shadow-xl hover:from-amber-700 hover:to-amber-800'
//                                                           : 'cursor-not-allowed bg-gray-200 text-gray-400'
//                                                 }`}
//                                             >
//                                                 {processing ? (
//                                                     <>
//                                                         <Loader2 className="h-5 w-5 animate-spin" />{' '}
//                                                         Création en cours...
//                                                     </>
//                                                 ) : plan.price > 0 ? (
//                                                     <>
//                                                         <ShieldCheck className="h-5 w-5" />{' '}
//                                                         Payer{' '}
//                                                         {plan.formatted_price}{' '}
//                                                         et créer ma boutique
//                                                     </>
//                                                 ) : (
//                                                     <>
//                                                         <Sparkles className="h-5 w-5" />{' '}
//                                                         Créer ma boutique
//                                                         gratuitement
//                                                     </>
//                                                 )}
//                                             </motion.button>
//                                         </div>
//                                     </div>
//                                 </motion.div>
//                             )}
//                         </AnimatePresence>
//                     </form>
//                 </div>
//             </div>
//         </>
//     );
// }
// // Composant helper pour les réseaux sociaux
// function SocialInput({
//     label,
//     value,
//     onChange,
// }: {
//     label: string;
//     value: string;
//     onChange: (v: string) => void;
// }) {
//     return (
//         <div>
//             <label className="mb-2 flex items-center gap-1 text-sm font-medium">
//                 {label}
//             </label>
//             <input
//                 type="url"
//                 value={value}
//                 onChange={(e) => onChange(e.target.value)}
//                 className="w-full rounded-xl border px-4 py-3 focus:border-amber-500 focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
//                 placeholder={`https://${label.toLowerCase()}.com/votreboutique`}
//             />
//         </div>
//     );
// }

// // Composant DocumentCard – utilise data et setData directement
// function DocumentCard({
//     doc,
//     data,
//     setData,
// }: {
//     doc: TypeDocument;
//     data: any; // données du formulaire
//     setData: (field: string, value: any) => void;
// }) {
//     const docData = data.legal_documents[doc.code] || {
//         numero: '',
//         date_delivrance: '',
//         date_expiration: '',
//     };

//     const updateDoc = (field: string, value: string) => {
//         setData('legal_documents', {
//             ...data.legal_documents,
//             [doc.code]: { ...docData, [field]: value },
//         });
//     };

//     return (
//         <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5 dark:border-amber-800 dark:bg-amber-900/20">
//             <div className="flex items-start gap-3">
//                 <FileCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
//                 <div className="flex-1 space-y-4">
//                     <div>
//                         <h4 className="font-semibold">
//                             {doc.nom}
//                             {doc.est_obligatoire && (
//                                 <span className="text-red-500"> *</span>
//                             )}
//                         </h4>
//                         {doc.description && (
//                             <p className="text-sm text-muted-foreground">
//                                 {doc.description}
//                             </p>
//                         )}
//                     </div>
//                     <div className="grid gap-4 sm:grid-cols-3">
//                         <Input
//                             type="text"
//                             placeholder="Numéro du document"
//                             value={docData.numero}
//                             onChange={(e) =>
//                                 updateDoc('numero', e.target.value)
//                             }
//                         />
//                         <Input
//                             type="date"
//                             value={docData.date_delivrance}
//                             onChange={(e) =>
//                                 updateDoc('date_delivrance', e.target.value)
//                             }
//                         />
//                         <Input
//                             type="date"
//                             value={docData.date_expiration}
//                             onChange={(e) =>
//                                 updateDoc('date_expiration', e.target.value)
//                             }
//                         />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
// resources/js/Pages/Vendor/Configure.tsx
// import { Head, useForm, Link } from '@inertiajs/react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//     ArrowLeft,
//     ArrowRight,
//     Store,
//     Globe,
//     Mail,
//     Phone,
//     Camera,
//     CheckCircle,
//     AlertCircle,
//     Sparkles,
//     ShieldCheck,
//     Zap,
//     Eye,
//     Loader2,
//     Lightbulb,
//     XCircle,
//     Copy,
//     Check,
//     FileCheck,
//     FileText,
//     Search,
//     ChevronDown,
//     ChevronsUpDown,
// } from 'lucide-react';
// import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import {
//     Command,
//     CommandEmpty,
//     CommandGroup,
//     CommandInput,
//     CommandItem,
//     CommandList,
// } from '@/components/ui/command';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import {
//     Popover,
//     PopoverContent,
//     PopoverTrigger,
// } from '@/components/ui/popover';
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from '@/components/ui/select';
// import { Textarea } from '@/components/ui/textarea';

// // ---------- TYPES ----------
// interface Currency {
//     code: string;
//     symbol: string;
//     name: string;
// }
// interface Language {
//     code: string;
//     name: string;
// }
// interface Country {
//     iso2: string;
//     name: string;
//     phone_code: string;
// }
// interface TypeDocument {
//     id: string;
//     code: string;
//     nom: string;
//     description: string | null;
//     est_obligatoire: boolean;
//     forme_juridique?: string;
// }
// interface DocumentData {
//     numero: string;
//     date_delivrance: string;
//     date_expiration: string;
// }
// interface Props {
//     plan: { id: number; name: string; formatted_price: string; price: number };
//     currencies: Currency[];
//     languages: Language[];
//     countries: Country[];
//     requiredDocuments: TypeDocument[];
//     optionalDocuments: TypeDocument[];
// }

// const STEPS = [
//     { id: 1, name: 'Identité', icon: Store },
//     { id: 2, name: 'Contact', icon: Mail },
//     { id: 3, name: 'Légal', icon: FileCheck },
//     { id: 4, name: 'Apparence', icon: Camera },
//     { id: 5, name: 'Validation', icon: ShieldCheck },
// ];

// function getFlagUrl(iso2: string) {
//     return `https://flagcdn.com/w40/${iso2}.png`;
// }

// function detectUserCountry(countries: Country[]): Country | null {
//     const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
//     const city = tz.split('/')[1] || '';
//     const tzMap: Record<string, string> = {
//         Kinshasa: 'cd',
//         Lubumbashi: 'cd',
//         Paris: 'fr',
//         London: 'gb',
//         New_York: 'us',
//         Brussels: 'be',
//         Zurich: 'ch',
//         Toronto: 'ca',
//         Brazzaville: 'cg',
//         Kigali: 'rw',
//         Bujumbura: 'bi',
//         Nairobi: 'ke',
//         Dar_es_Salaam: 'tz',
//         Kampala: 'ug',
//     };

//     return countries.find((c) => c.iso2 === (tzMap[city] || 'cd')) || null;
// }

// export default function VendorConfigure({
//     plan,
//     currencies,
//     languages,
//     countries,
//     requiredDocuments,
//     optionalDocuments,
// }: Props) {
//     return (
//         <>
//             <Head title="Configurez votre boutique" />
//             <div className="min-h-screen bg-white dark:bg-gray-950">
//                 {/* Barre de progression */}
//                 <div className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur-xl dark:bg-gray-900/80">
//                     <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
//                         <Link
//                             href={route('vendor.register')}
//                             className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-emerald-600"
//                         >
//                             <ArrowLeft className="h-4 w-4" /> Retour
//                         </Link>
//                         <div className="hidden items-center gap-1 sm:flex">
//                             {STEPS.map((step, idx) => (
//                                 <div
//                                     key={step.id}
//                                     className="flex items-center gap-1"
//                                 >
//                                     <button
//                                         onClick={() => setCurrentStep(step.id)}
//                                         className={`flex cursor-pointer items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition hover:bg-gray-200 dark:hover:bg-gray-700 ${
//                                             currentStep === step.id
//                                                 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
//                                                 : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
//                                         }`}
//                                     >
//                                         <step.icon className="h-3 w-3" />{' '}
//                                         {step.name}
//                                     </button>
//                                     {idx < STEPS.length - 1 && (
//                                         <div className="h-px w-6 bg-gray-300 dark:bg-gray-700" />
//                                     )}
//                                 </div>
//                             ))}
//                         </div>
//                         <Badge
//                             variant="outline"
//                             className="border-emerald-200 bg-emerald-50 text-emerald-700"
//                         >
//                             <Zap className="mr-1 h-3 w-3" /> Plan {plan.name}
//                         </Badge>
//                     </div>
//                 </div>

//                 <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
//                     <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         className="mb-12 text-center"
//                     >
//                         <div className="mb-4 inline-flex rounded-xl bg-emerald-50 p-3 dark:bg-emerald-900/20">
//                             <Sparkles className="h-10 w-10 text-emerald-500" />
//                         </div>
//                         <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
//                             Créez votre boutique
//                         </h1>
//                         <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
//                             {plan.price === 0
//                                 ? 'Votre espace sera prêt en quelques secondes.'
//                                 : `Configuration terminée, paiement de ${plan.formatted_price}/mois.`}
//                         </p>
//                     </motion.div>

//                     <form onSubmit={handleSubmit} className="space-y-8">
//                         <AnimatePresence mode="wait">
//                             {/* Étape 1 : Identité */}
//                             {currentStep === 1 && (
//                                 <motion.div
//                                     key="step1"
//                                     initial={{ opacity: 0, y: 20 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     exit={{ opacity: 0, y: -20 }}
//                                     className="rounded-xl border bg-card p-6"
//                                 >
//                                     <h2 className="flex items-center gap-3 text-lg font-semibold">
//                                         <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">
//                                             1
//                                         </span>{' '}
//                                         Identité
//                                     </h2>
//                                     <div className="mt-6 space-y-6">
//                                         <div>
//                                             <Label htmlFor="shop_name">
//                                                 Nom de la boutique{' '}
//                                                 <span className="text-red-500">
//                                                     *
//                                                 </span>
//                                             </Label>
//                                             <div className="relative mt-2">
//                                                 <Store className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
//                                                 <Input
//                                                     id="shop_name"
//                                                     value={data.shop_name}
//                                                     onChange={(e) =>
//                                                         setData(
//                                                             'shop_name',
//                                                             e.target.value,
//                                                         )
//                                                     }
//                                                     className="pl-10"
//                                                     placeholder="Ma Boutique Artisanale"
//                                                     required
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div>
//                                             <Label htmlFor="shop_slug">
//                                                 Adresse web{' '}
//                                                 <span className="text-red-500">
//                                                     *
//                                                 </span>
//                                             </Label>
//                                             <div className="mt-2 flex rounded-lg">
//                                                 <div className="relative flex-1">
//                                                     <Globe className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
//                                                     <Input
//                                                         id="shop_slug"
//                                                         value={data.shop_slug}
//                                                         onChange={(e) => {
//                                                             setSlugManuallyEdited(
//                                                                 true,
//                                                             );
//                                                             setData(
//                                                                 'shop_slug',
//                                                                 cleanSlug(
//                                                                     e.target
//                                                                         .value,
//                                                                 ),
//                                                             );
//                                                         }}
//                                                         className={`rounded-r-none pl-10 ${slugStatus === 'available' ? 'border-green-500 focus-visible:ring-green-500' : slugStatus === 'unavailable' ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
//                                                         placeholder="ma-boutique"
//                                                         required
//                                                     />
//                                                     <div className="absolute top-1/2 right-3 -translate-y-1/2">
//                                                         {slugChecking && (
//                                                             <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
//                                                         )}
//                                                         {!slugChecking &&
//                                                             slugStatus ===
//                                                                 'available' && (
//                                                                 <CheckCircle className="h-5 w-5 text-green-500" />
//                                                             )}
//                                                         {!slugChecking &&
//                                                             slugStatus ===
//                                                                 'unavailable' && (
//                                                                 <XCircle className="h-5 w-5 text-red-500" />
//                                                             )}
//                                                     </div>
//                                                 </div>
//                                                 <span className="flex items-center rounded-r-lg border border-l-0 bg-muted px-4 text-sm text-muted-foreground">
//                                                     .{window.location.hostname}
//                                                 </span>
//                                             </div>
//                                             <AnimatePresence>
//                                                 {slugStatus === 'available' && (
//                                                     <motion.p
//                                                         initial={{
//                                                             opacity: 0,
//                                                             y: -5,
//                                                         }}
//                                                         animate={{
//                                                             opacity: 1,
//                                                             y: 0,
//                                                         }}
//                                                         className="mt-2 text-sm text-green-600"
//                                                     >
//                                                         <CheckCircle className="inline h-4 w-4" />{' '}
//                                                         Disponible !
//                                                     </motion.p>
//                                                 )}
//                                                 {slugErrors.map((err, i) => (
//                                                     <motion.p
//                                                         key={i}
//                                                         initial={{
//                                                             opacity: 0,
//                                                             y: -5,
//                                                         }}
//                                                         animate={{
//                                                             opacity: 1,
//                                                             y: 0,
//                                                         }}
//                                                         className="mt-2 text-sm text-red-500"
//                                                     >
//                                                         <XCircle className="inline h-4 w-4" />{' '}
//                                                         {err}
//                                                     </motion.p>
//                                                 ))}
//                                             </AnimatePresence>
//                                             {slugSuggestions.length > 0 && (
//                                                 <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
//                                                     <p className="mb-2 flex items-center gap-1 text-sm font-medium text-emerald-700">
//                                                         <Lightbulb className="h-4 w-4" />{' '}
//                                                         Suggestions :
//                                                     </p>
//                                                     <div className="flex flex-wrap gap-2">
//                                                         {slugSuggestions.map(
//                                                             (s) => (
//                                                                 <button
//                                                                     key={s}
//                                                                     onClick={() => {
//                                                                         setData(
//                                                                             'shop_slug',
//                                                                             s,
//                                                                         );
//                                                                         setSlugManuallyEdited(
//                                                                             true,
//                                                                         );
//                                                                         checkSlug(
//                                                                             s,
//                                                                         );
//                                                                     }}
//                                                                     className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-sm font-medium hover:bg-emerald-100"
//                                                                 >
//                                                                     <Copy className="h-3 w-3" />{' '}
//                                                                     {s}
//                                                                 </button>
//                                                             ),
//                                                         )}
//                                                     </div>
//                                                 </div>
//                                             )}
//                                         </div>
//                                         <div className="flex justify-end">
//                                             <Button
//                                                 type="button"
//                                                 onClick={() =>
//                                                     setCurrentStep((prev) =>
//                                                         Math.min(prev + 1, 5),
//                                                     )
//                                                 }
//                                             >
//                                                 Continuer{' '}
//                                                 <ArrowRight className="ml-2 h-4 w-4" />
//                                             </Button>
//                                         </div>
//                                     </div>
//                                 </motion.div>
//                             )}

//                             {/* Étape 2 : Contact */}
//                             {currentStep === 2 && (
//                                 <motion.div
//                                     key="step2"
//                                     initial={{ opacity: 0, y: 20 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     exit={{ opacity: 0, y: -20 }}
//                                     className="rounded-xl border bg-card p-6"
//                                 >
//                                     <h2 className="flex items-center gap-3 text-lg font-semibold">
//                                         <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">
//                                             2
//                                         </span>{' '}
//                                         Contact & localisation
//                                     </h2>
//                                     <div className="mt-6 grid gap-6 sm:grid-cols-2">

//                                             <div className="mt-2 flex gap-2">
//                                                 <Popover>
//                                                     <PopoverTrigger asChild>
//                                                         <Button
//                                                             variant="outline"
//                                                             className="w-32.5 justify-between"
//                                                             role="combobox"
//                                                         >
//                                                             {selectedPhoneCountry ? (
//                                                                 <span className="flex items-center gap-2">
//                                                                     <img
//                                                                         src={getFlagUrl(
//                                                                             selectedPhoneCountry.iso2,
//                                                                         )}
//                                                                         alt=""
//                                                                         className="h-4 w-6 rounded-sm object-cover"
//                                                                     />
//                                                                     {
//                                                                         selectedPhoneCountry.phone_code
//                                                                     }
//                                                                 </span>
//                                                             ) : (
//                                                                 <ChevronsUpDown className="h-4 w-4" />
//                                                             )}
//                                                         </Button>
//                                                     </PopoverTrigger>
//                                                     <PopoverContent
//                                                         className="w-70 p-0"
//                                                         align="start"
//                                                     >

//                                                     </PopoverContent>
//                                                 </Popover>
//                                                 <Input
//                                                     type="tel"
//                                                     value={data.contact_phone}
//                                                     onChange={(e) =>
//                                                         setData(
//                                                             'contact_phone',
//                                                             e.target.value,
//                                                         )
//                                                     }
//                                                     placeholder="XXX XXX XXX"
//                                                     className="flex-1"
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div>
//                                             <Label>Devise par défaut</Label>
//                                             <Select
//                                                 value={data.currency}
//                                                 onValueChange={(v) =>
//                                                     setData('currency', v)
//                                                 }
//                                             >
//                                                 <SelectTrigger className="mt-2">
//                                                     <SelectValue />
//                                                 </SelectTrigger>
//                                                 <SelectContent>
//                                                     {currencies.map((c) => (
//                                                         <SelectItem
//                                                             key={c.code}
//                                                             value={c.code}
//                                                         >
//                                                             {c.code} — {c.name}{' '}
//                                                             ({c.symbol})
//                                                         </SelectItem>
//                                                     ))}
//                                                 </SelectContent>
//                                             </Select>
//                                         </div>
//                                         <div>
//                                             <Label>Langue par défaut</Label>
//                                             <Select
//                                                 value={data.language}
//                                                 onValueChange={(v) =>
//                                                     setData('language', v)
//                                                 }
//                                             >
//                                                 <SelectTrigger className="mt-2">
//                                                     <SelectValue />
//                                                 </SelectTrigger>
//                                                 <SelectContent>
//                                                     {languages.map((l) => (
//                                                         <SelectItem
//                                                             key={l.code}
//                                                             value={l.code}
//                                                         >
//                                                             {l.name}
//                                                         </SelectItem>
//                                                     ))}
//                                                 </SelectContent>
//                                             </Select>
//                                         </div>
//                                         <div className="sm:col-span-2">
//                                             <Label htmlFor="shop_description">
//                                                 Description
//                                             </Label>
//                                             <Textarea
//                                                 id="shop_description"
//                                                 value={data.shop_description}
//                                                 onChange={(e) =>
//                                                     setData(
//                                                         'shop_description',
//                                                         e.target.value,
//                                                     )
//                                                 }
//                                                 className="mt-2"
//                                                 rows={4}
//                                                 maxLength={500}
//                                                 placeholder="Parlez-nous de votre activité, de vos produits..."
//                                             />
//                                             <p className="mt-1 text-right text-xs text-muted-foreground">
//                                                 {data.shop_description
//                                                     ?.length || 0}
//                                                 /500
//                                             </p>
//                                         </div>
//                                         <div className="flex justify-between sm:col-span-2">
//                                             <Button
//                                                 type="button"
//                                                 variant="outline"
//                                                 onClick={() =>
//                                                     setCurrentStep(1)
//                                                 }
//                                             >
//                                                 <ArrowLeft className="mr-2 h-4 w-4" />{' '}
//                                                 Retour
//                                             </Button>
//                                             <Button
//                                                 type="button"
//                                                 onClick={() =>
//                                                     setCurrentStep((prev) =>
//                                                         Math.min(prev + 1, 5),
//                                                     )
//                                                 }
//                                             >
//                                                 Continuer{' '}
//                                                 <ArrowRight className="ml-2 h-4 w-4" />
//                                             </Button>
//                                         </div>
//                                     </div>
//                                 </motion.div>
//                             )}

//                             {/* Étape 3 : Légal */}
//                             {currentStep === 3 && (
//                                 <motion.div
//                                     key="step3"
//                                     initial={{ opacity: 0, y: 20 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     exit={{ opacity: 0, y: -20 }}
//                                     className="rounded-xl border bg-card p-6"
//                                 >
//                                     <div className="mt-6 space-y-4">
//                                         {requiredDocuments
//                                             .filter(
//                                                 (doc) =>
//                                                     doc.forme_juridique ===
//                                                         data.forme_juridique ||
//                                                     doc.forme_juridique ===
//                                                         'toutes',
//                                             )
//                                             .map((doc) => (
//                                                 <DocumentCard
//                                                     key={doc.id}
//                                                     doc={doc}
//                                                     data={data}
//                                                     setData={setData}
//                                                 />
//                                             ))}
//                                         {optionalDocuments.filter(
//                                             (doc) =>
//                                                 doc.forme_juridique ===
//                                                     data.forme_juridique ||
//                                                 doc.forme_juridique ===
//                                                     'toutes',
//                                         ).length > 0 && (
//                                             <div className="mt-6">
//                                                 <h3 className="mb-3 text-sm font-semibold text-gray-700">
//                                                     Documents facultatifs
//                                                 </h3>
//                                                 {optionalDocuments
//                                                     .filter(
//                                                         (doc) =>
//                                                             doc.forme_juridique ===
//                                                                 data.forme_juridique ||
//                                                             doc.forme_juridique ===
//                                                                 'toutes',
//                                                     )
//                                                     .map((doc) => (
//                                                         <DocumentCard
//                                                             key={doc.id}
//                                                             doc={doc}
//                                                             data={data}
//                                                             setData={setData}
//                                                         />
//                                                     ))}
//                                             </div>
//                                         )}
//                                     </div>
//                                     <div className="mt-6 flex justify-between">
//                                         <Button
//                                             type="button"
//                                             variant="outline"
//                                             onClick={() => setCurrentStep(2)}
//                                         >
//                                             <ArrowLeft className="mr-2 h-4 w-4" />{' '}
//                                             Retour
//                                         </Button>
//                                         <Button
//                                             type="button"
//                                             onClick={() =>
//                                                 setCurrentStep((prev) =>
//                                                     Math.min(prev + 1, 5),
//                                                 )
//                                             }
//                                         >
//                                             Continuer{' '}
//                                             <ArrowRight className="ml-2 h-4 w-4" />
//                                         </Button>
//                                     </div>
//                                 </motion.div>
//                             )}
//                         </AnimatePresence>
//                     </form>
//                 </div>
//             </div>
//         </>
//     );
// }

// // Composants auxiliaires
// function SocialInput({
//     label,
//     value,
//     onChange,
// }: {
//     label: string;
//     value: string;
//     onChange: (v: string) => void;
// }) {
//     return (
//         <div>
//             <Label className="mb-2 flex items-center gap-1 text-sm font-medium">
//                 {label}
//             </Label>
//             <Input
//                 type="url"
//                 value={value}
//                 onChange={(e) => onChange(e.target.value)}
//                 placeholder={`https://${label.toLowerCase().replace(' / x', '')}.com/votreboutique`}
//             />
//         </div>
//     );
// }

// function DocumentCard({
//     doc,
//     data,
//     setData,
// }: {
//     doc: TypeDocument;
//     data: any;
//     setData: (field: string, value: any) => void;
// }) {
//     const docData = data.legal_documents[doc.code] || {
//         numero: '',
//         date_delivrance: '',
//         date_expiration: '',
//     };
//     const updateDoc = (field: string, value: string) =>
//         setData('legal_documents', {
//             ...data.legal_documents,
//             [doc.code]: { ...docData, [field]: value },
//         });

//     return (
//         <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
//             <div className="flex items-start gap-3">
//                 <FileCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
//                 <div className="flex-1 space-y-3">
//                     <div>
//                         <h4 className="font-semibold">
//                             {doc.nom}
//                             {doc.est_obligatoire && (
//                                 <span className="text-red-500"> *</span>
//                             )}
//                         </h4>
//                         {doc.description && (
//                             <p className="text-sm text-muted-foreground">
//                                 {doc.description}
//                             </p>
//                         )}
//                     </div>
//                     <div className="grid gap-3 sm:grid-cols-3">
//                         <Input
//                             type="text"
//                             placeholder="Numéro du document"
//                             value={docData.numero}
//                             onChange={(e) =>
//                                 updateDoc('numero', e.target.value)
//                             }
//                         />
//                         <Input
//                             type="date"
//                             value={docData.date_delivrance}
//                             onChange={(e) =>
//                                 updateDoc('date_delivrance', e.target.value)
//                             }
//                         />
//                         <Input
//                             type="date"
//                             value={docData.date_expiration}
//                             onChange={(e) =>
//                                 updateDoc('date_expiration', e.target.value)
//                             }
//                         />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// resources/js/Pages/Vendor/Configure.tsx
import { Head, useForm, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    ArrowRight,
    Store,
    Globe,
    Mail,
    Phone,
    Camera,
    CheckCircle,
    AlertCircle,
    Sparkles,
    ShieldCheck,
    Zap,
    Eye,
    Loader2,
    Lightbulb,
    XCircle,
    Copy,
    Check,
    FileCheck,
    FileText,
    Search,
    ChevronDown,
    ChevronsUpDown,
} from 'lucide-react';
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

// ---------- TYPES ----------
interface Currency {
    code: string;
    symbol: string;
    name: string;
}
interface Language {
    code: string;
    name: string;
}
interface Country {
    iso2: string;
    name: string;
    phone_code: string;
}
interface TypeDocument {
    id: string;
    code: string;
    nom: string;
    description: string | null;
    est_obligatoire: boolean;
    forme_juridique?: string;
}
interface DocumentData {
    numero: string;
    date_delivrance: string;
    date_expiration: string;
}
interface Props {
    plan: { id: number; name: string; formatted_price: string; price: number };
    currencies: Currency[];
    languages: Language[];
    countries: Country[];
    requiredDocuments: TypeDocument[];
    optionalDocuments: TypeDocument[];
}

const STEPS = [
    { id: 1, name: 'Identité', icon: Store },
    { id: 2, name: 'Contact', icon: Mail },
    { id: 3, name: 'Légal', icon: FileCheck },
    { id: 4, name: 'Apparence', icon: Camera },
    { id: 5, name: 'Validation', icon: ShieldCheck },
];

function getFlagUrl(iso2: string) {
    return `https://flagcdn.com/w40/${iso2}.png`;
}

function detectUserCountry(countries: Country[]): Country | null {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const city = tz.split('/')[1] || '';
    const tzMap: Record<string, string> = {
        Kinshasa: 'cd',
        Lubumbashi: 'cd',
        Paris: 'fr',
        London: 'gb',
        New_York: 'us',
        Brussels: 'be',
        Zurich: 'ch',
        Toronto: 'ca',
        Brazzaville: 'cg',
        Kigali: 'rw',
        Bujumbura: 'bi',
        Nairobi: 'ke',
        Dar_es_Salaam: 'tz',
        Kampala: 'ug',
    };

    return countries.find((c) => c.iso2 === (tzMap[city] || 'cd')) || null;
}

// Composant DatePicker réutilisable (utilise le Calendar shadcn)
function DatePickerField({
    value,
    onChange,
    placeholder,
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
}) {
    const [date, setDate] = useState<Date | undefined>(
        value ? new Date(value) : undefined,
    );
    const [open, setOpen] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDate(value ? new Date(value) : undefined);
    }, [value]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        'h-11 w-full justify-start text-left font-normal',
                        !date && 'text-muted-foreground',
                    )}
                >
                    {date ? (
                        format(date, 'PPP', { locale: fr })
                    ) : (
                        <span>{placeholder}</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => {
                        if (d) {
                            setDate(d);
                            onChange(format(d, 'yyyy-MM-dd'));
                            setOpen(false);
                        }
                    }}
                    initialFocus
                    locale={fr}
                />
            </PopoverContent>
        </Popover>
    );
}

export default function VendorConfigure({
    plan,
    currencies,
    languages,
    countries,
    requiredDocuments,
    optionalDocuments,
}: Props) {
    const detectedCountry = useMemo(
        () => detectUserCountry(countries),
        [countries],
    );

    const [currentStep, setCurrentStep] = useState(1);
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
    const [slugStatus, setSlugStatus] = useState<
        'idle' | 'checking' | 'available' | 'unavailable'
    >('idle');
    const [slugChecking, setSlugChecking] = useState(false);
    const [slugErrors, setSlugErrors] = useState<string[]>([]);
    const [slugSuggestions, setSlugSuggestions] = useState<string[]>([]);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [selectedPhoneCountry, setSelectedPhoneCountry] =
        useState<Country | null>(detectedCountry);
    const [phoneSearch, setPhoneSearch] = useState('');
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        plan_id: plan.id,
        shop_name: '',
        shop_slug: '',
        shop_description: '',
        contact_email: '',
        contact_phone: '',
        phone_code: detectedCountry?.phone_code || '+243',
        currency: 'CDF',
        language: 'fr',
        logo: null as File | null,
        facebook_url: '',
        instagram_url: '',
        twitter_url: '',
        youtube_url: '',
        tiktok_url: '',
        accept_terms: false,
        forme_juridique: 'societe_commerciale',
        legal_documents: {} as Record<string, DocumentData>,
    });

    const selectedCurrency = useMemo(
        () => currencies.find((c) => c.code === data.currency),
        [currencies, data.currency],
    );
    const selectedLanguage = useMemo(
        () => languages.find((l) => l.code === data.language),
        [languages, data.language],
    );

    const cleanSlug = (v: string) => v.toLowerCase().replace(/[^a-z0-9-]/g, '');
    const generateBaseSlug = (name: string) =>
        name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');

    useEffect(() => {
        if (!slugManuallyEdited && data.shop_name) {
            setData('shop_slug', generateBaseSlug(data.shop_name));
        }
    }, [data.shop_name, slugManuallyEdited, setData]);

    const checkSlug = useCallback(
        async (slug: string) => {
            if (!slug || slug.length < 3) {
                setSlugStatus('idle');
                setSlugErrors([]);
                setSlugSuggestions([]);

                return;
            }

            setSlugChecking(true);
            setSlugStatus('checking');

            try {
                const res = await fetch('/devenir-vendeur/check-domain', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN':
                            document
                                .querySelector('meta[name="csrf-token"]')
                                ?.getAttribute('content') || '',
                    },
                    body: JSON.stringify({ slug }),
                });
                const json = await res.json();

                if (json.errors?.length) {
                    setSlugStatus('unavailable');
                    setSlugErrors(json.errors);
                } else if (json.available) {
                    setSlugStatus('available');
                    setSlugErrors([]);

                    if (json.cleaned_slug && json.cleaned_slug !== slug) {
                        setData('shop_slug', json.cleaned_slug);
                    }
                } else {
                    setSlugStatus('unavailable');
                    setSlugErrors(['Ce sous-domaine est déjà pris.']);
                    setSlugSuggestions(json.suggestions || []);
                }
            } catch {
                setSlugStatus('idle');
            } finally {
                setSlugChecking(false);
            }
        },
        [setData],
    );

    useEffect(() => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        if (data.shop_slug.length >= 3) {
            debounceTimer.current = setTimeout(
                () => checkSlug(data.shop_slug),
                500,
            );
        } else {
            setSlugStatus('idle');
            setSlugSuggestions([]);
        }

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [data.shop_slug, checkSlug]);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setData('logo', file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const isFormValid = () => {
        if (
            !data.shop_name.trim() ||
            !data.shop_slug.trim() ||
            slugStatus !== 'available'
        ) {
            return false;
        }

        if (!data.contact_email.trim()) {
            return false;
        }

        for (const doc of requiredDocuments.filter(
            (d) =>
                d.forme_juridique === data.forme_juridique ||
                d.forme_juridique === 'toutes',
        )) {
            if (!data.legal_documents[doc.code]?.numero?.trim()) {
                return false;
            }
        }

        if (!data.accept_terms) {
            return false;
        }

        return true;
    };

    const handleSubmit = (
        e: React.BaseSyntheticEvent<
            SubmitEvent,
            HTMLFormElement,
            HTMLFormElement
        >,
    ) => {
        e.preventDefault();

        if (isFormValid()) {
            post('/devenir-vendeur/store');
        }
    };

    const filteredCountries = useMemo(() => {
        if (!phoneSearch.trim()) {
            return countries;
        }

        return countries.filter(
            (c) =>
                c.name.toLowerCase().includes(phoneSearch.toLowerCase()) ||
                c.phone_code.includes(phoneSearch),
        );
    }, [phoneSearch, countries]);

    return (
        <>
            <Head title="Configurez votre boutique" />
            <div className="min-h-screen bg-white dark:bg-gray-950">
                {/* Barre de progression identique (inchangée) */}

                <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
                    {/* ... */}
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <AnimatePresence mode="wait">
                            {/* Étape 1 : Identité */}
                            {currentStep === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="rounded-xl border bg-card p-6"
                                >
                                    <h2 className="flex items-center gap-3 text-lg font-semibold">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">
                                            1
                                        </span>{' '}
                                        Identité
                                    </h2>
                                    <div className="mt-6 space-y-6">
                                        <div>
                                            <Label htmlFor="shop_name">
                                                Nom de la boutique{' '}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <div className="relative mt-2">
                                                <Store className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                                <Input
                                                    id="shop_name"
                                                    value={data.shop_name}
                                                    onChange={(e) =>
                                                        setData(
                                                            'shop_name',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-11 pl-10"
                                                    placeholder="Ma Boutique Artisanale"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label htmlFor="shop_slug">
                                                Adresse web{' '}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <div className="mt-2 flex rounded-lg">
                                                <div className="relative flex-1">
                                                    <Globe className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                                    <Input
                                                        id="shop_slug"
                                                        value={data.shop_slug}
                                                        onChange={(e) => {
                                                            setSlugManuallyEdited(
                                                                true,
                                                            );
                                                            setData(
                                                                'shop_slug',
                                                                cleanSlug(
                                                                    e.target
                                                                        .value,
                                                                ),
                                                            );
                                                        }}
                                                        className={`h-11 rounded-r-none pl-10 ${slugStatus === 'available' ? 'border-green-500 focus-visible:ring-green-500' : slugStatus === 'unavailable' ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                                        placeholder="ma-boutique"
                                                        required
                                                    />
                                                    <div className="absolute top-1/2 right-3 -translate-y-1/2">
                                                        {slugChecking && (
                                                            <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
                                                        )}
                                                        {!slugChecking &&
                                                            slugStatus ===
                                                                'available' && (
                                                                <CheckCircle className="h-5 w-5 text-green-500" />
                                                            )}
                                                        {!slugChecking &&
                                                            slugStatus ===
                                                                'unavailable' && (
                                                                <XCircle className="h-5 w-5 text-red-500" />
                                                            )}
                                                    </div>
                                                </div>
                                                <span className="flex items-center rounded-r-lg border border-l-0 bg-muted px-4 text-sm text-muted-foreground">
                                                    .{window.location.hostname}
                                                </span>
                                            </div>
                                            {/* ... (reste du feedback, suggestions) */}
                                        </div>
                                        <div className="flex justify-end">
                                            <Button
                                                type="button"
                                                onClick={() =>
                                                    setCurrentStep((prev) =>
                                                        Math.min(prev + 1, 5),
                                                    )
                                                }
                                            >
                                                Continuer{' '}
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Étape 2 : Contact – tous les Input, Select, Textarea ont maintenant h-11 */}
                            {currentStep === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="rounded-xl border bg-card p-6"
                                >
                                    <h2 className="flex items-center gap-3 text-lg font-semibold">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">
                                            2
                                        </span>{' '}
                                        Contact & localisation
                                    </h2>
                                    <div className="mt-6 grid gap-6 sm:grid-cols-2">
                                        <div>
                                            <Label htmlFor="contact_email">
                                                Email{' '}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <div className="relative mt-2">
                                                <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                                                <Input
                                                    id="contact_email"
                                                    type="email"
                                                    value={data.contact_email}
                                                    onChange={(e) =>
                                                        setData(
                                                            'contact_email',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-11 pl-10"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label>Téléphone</Label>
                                            <div className="mt-2 flex gap-2">
                                                {/* Sélecteur de pays – inchangé */}
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className="h-11 w-32.5 justify-between"
                                                            role="combobox"
                                                        >
                                                            {selectedPhoneCountry ? (
                                                                <span className="flex items-center gap-2">
                                                                    <img
                                                                        src={getFlagUrl(
                                                                            selectedPhoneCountry.iso2,
                                                                        )}
                                                                        alt=""
                                                                        className="h-4 w-6 rounded-sm object-cover"
                                                                    />
                                                                    {
                                                                        selectedPhoneCountry.phone_code
                                                                    }
                                                                </span>
                                                            ) : (
                                                                <ChevronsUpDown className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent
                                                        className="w-70 p-0"
                                                        align="start"
                                                    >
                                                        <Command>
                                                            <CommandInput
                                                                placeholder="Rechercher un pays..."
                                                                value={
                                                                    phoneSearch
                                                                }
                                                                onValueChange={
                                                                    setPhoneSearch
                                                                }
                                                            />
                                                            <CommandList>
                                                                <CommandEmpty>
                                                                    Aucun pays
                                                                    trouvé
                                                                </CommandEmpty>
                                                                <CommandGroup>
                                                                    {filteredCountries.map(
                                                                        (
                                                                            country,
                                                                        ) => (
                                                                            <CommandItem
                                                                                key={
                                                                                    country.iso2
                                                                                }
                                                                                value={
                                                                                    country.phone_code
                                                                                }
                                                                                onSelect={() => {
                                                                                    setSelectedPhoneCountry(
                                                                                        country,
                                                                                    );
                                                                                    setData(
                                                                                        'phone_code',
                                                                                        country.phone_code,
                                                                                    );
                                                                                }}
                                                                            >
                                                                                <img
                                                                                    src={getFlagUrl(
                                                                                        country.iso2,
                                                                                    )}
                                                                                    alt=""
                                                                                    className="mr-2 h-4 w-6 rounded-sm object-cover"
                                                                                />
                                                                                {
                                                                                    country.name
                                                                                }
                                                                                <span className="ml-auto text-muted-foreground">
                                                                                    {
                                                                                        country.phone_code
                                                                                    }
                                                                                </span>
                                                                            </CommandItem>
                                                                        ),
                                                                    )}
                                                                </CommandGroup>
                                                            </CommandList>
                                                        </Command>
                                                    </PopoverContent>
                                                </Popover>
                                                <Input
                                                    type="tel"
                                                    value={data.contact_phone}
                                                    onChange={(e) =>
                                                        setData(
                                                            'contact_phone',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="XXX XXX XXX"
                                                    className="h-11 flex-1"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label>Devise par défaut</Label>
                                            <Select
                                                value={data.currency}
                                                onValueChange={(v) =>
                                                    setData('currency', v)
                                                }
                                            >
                                                <SelectTrigger className="mt-2 h-11">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {currencies.map((c) => (
                                                        <SelectItem
                                                            key={c.code}
                                                            value={c.code}
                                                        >
                                                            {c.code} — {c.name}{' '}
                                                            ({c.symbol})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label>Langue par défaut</Label>
                                            <Select
                                                value={data.language}
                                                onValueChange={(v) =>
                                                    setData('language', v)
                                                }
                                            >
                                                <SelectTrigger className="mt-2 h-11">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {languages.map((l) => (
                                                        <SelectItem
                                                            key={l.code}
                                                            value={l.code}
                                                        >
                                                            {l.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="sm:col-span-2">
                                            <Label htmlFor="shop_description">
                                                Description
                                            </Label>
                                            <Textarea
                                                id="shop_description"
                                                value={data.shop_description}
                                                onChange={(e) =>
                                                    setData(
                                                        'shop_description',
                                                        e.target.value,
                                                    )
                                                }
                                                className="mt-2 min-h-30"
                                                rows={4}
                                                maxLength={500}
                                                placeholder="Parlez-nous de votre activité, de vos produits..."
                                            />
                                            <p className="mt-1 text-right text-xs text-muted-foreground">
                                                {data.shop_description
                                                    ?.length || 0}
                                                /500
                                            </p>
                                        </div>
                                        <div className="flex justify-between sm:col-span-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    setCurrentStep(1)
                                                }
                                            >
                                                <ArrowLeft className="mr-2 h-4 w-4" />{' '}
                                                Retour
                                            </Button>
                                            <Button
                                                type="button"
                                                onClick={() =>
                                                    setCurrentStep((prev) =>
                                                        Math.min(prev + 1, 5),
                                                    )
                                                }
                                            >
                                                Continuer{' '}
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Étape 3 : Légal – avec DatePicker dans DocumentCard */}
                            {currentStep === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="rounded-xl border bg-card p-6"
                                >
                                    <h2 className="flex items-center gap-3 text-lg font-semibold">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">
                                            3
                                        </span>{' '}
                                        Documents légaux
                                    </h2>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        Ces documents sont requis pour vérifier
                                        votre identité et votre entreprise.
                                    </p>
                                    <div className="mt-6">
                                        <Label htmlFor="forme_juridique">
                                            Forme juridique de votre activité{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Select
                                            value={data.forme_juridique}
                                            onValueChange={(v) => {
                                                setData('forme_juridique', v);
                                                setData('legal_documents', {});
                                            }}
                                        >
                                            <SelectTrigger className="mt-2">
                                                <SelectValue placeholder="Sélectionnez votre forme juridique" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="societe_commerciale">
                                                    Société commerciale (RCCM)
                                                </SelectItem>
                                                <SelectItem value="petit_commercant">
                                                    Petit commerçant individuel
                                                    (Patente)
                                                </SelectItem>
                                                <SelectItem value="organisation_sans_but_lucratif">
                                                    Organisation sans but
                                                    lucratif (ASBL/ONG)
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="mt-6 space-y-4">
                                        {requiredDocuments
                                            .filter(
                                                (doc) =>
                                                    doc.forme_juridique ===
                                                        data.forme_juridique ||
                                                    doc.forme_juridique ===
                                                        'toutes',
                                            )
                                            .map((doc) => (
                                                <DocumentCard
                                                    key={doc.id}
                                                    doc={doc}
                                                    data={data}
                                                    setData={setData}
                                                />
                                            ))}
                                        {optionalDocuments.filter(
                                            (doc) =>
                                                doc.forme_juridique ===
                                                    data.forme_juridique ||
                                                doc.forme_juridique ===
                                                    'toutes',
                                        ).length > 0 && (
                                            <div className="mt-6">
                                                <h3 className="mb-3 text-sm font-semibold text-gray-700">
                                                    Documents facultatifs
                                                </h3>
                                                {optionalDocuments
                                                    .filter(
                                                        (doc) =>
                                                            doc.forme_juridique ===
                                                                data.forme_juridique ||
                                                            doc.forme_juridique ===
                                                                'toutes',
                                                    )
                                                    .map((doc) => (
                                                        <DocumentCard
                                                            key={doc.id}
                                                            doc={doc}
                                                            data={data}
                                                            setData={setData}
                                                        />
                                                    ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-6 flex justify-between">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setCurrentStep(2)}
                                        >
                                            <ArrowLeft className="mr-2 h-4 w-4" />{' '}
                                            Retour
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={() =>
                                                setCurrentStep((prev) =>
                                                    Math.min(prev + 1, 5),
                                                )
                                            }
                                        >
                                            Continuer{' '}
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Étape 4 : Apparence */}
                            {currentStep === 4 && (
                                <motion.div
                                    key="step4"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="rounded-xl border bg-card p-6"
                                >
                                    <h2 className="flex items-center gap-3 text-lg font-semibold">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">
                                            4
                                        </span>{' '}
                                        Apparence & réseaux sociaux
                                    </h2>
                                    <div className="mt-6 grid gap-6 sm:grid-cols-2">
                                        <div className="sm:col-span-2">
                                            <Label>Logo</Label>
                                            <div className="mt-2 flex items-center gap-6">
                                                <div className="relative h-24 w-24 overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700">
                                                    {logoPreview ? (
                                                        <img
                                                            src={logoPreview}
                                                            alt="Logo"
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center text-gray-400">
                                                            <Camera className="h-8 w-8" />
                                                        </div>
                                                    )}
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={
                                                            handleLogoChange
                                                        }
                                                        className="absolute inset-0 cursor-pointer opacity-0"
                                                    />
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    <p className="font-medium">
                                                        500 × 500 px
                                                    </p>
                                                    <p>
                                                        PNG, JPG ou WebP. Max 2
                                                        Mo.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        {[
                                            [
                                                'Facebook',
                                                data.facebook_url,
                                                (v: string) =>
                                                    setData('facebook_url', v),
                                            ],
                                            [
                                                'Instagram',
                                                data.instagram_url,
                                                (v: string) =>
                                                    setData('instagram_url', v),
                                            ],
                                            [
                                                'Twitter / X',
                                                data.twitter_url,
                                                (v: string) =>
                                                    setData('twitter_url', v),
                                            ],
                                            [
                                                'YouTube',
                                                data.youtube_url,
                                                (v: string) =>
                                                    setData('youtube_url', v),
                                            ],
                                            [
                                                'TikTok',
                                                data.tiktok_url,
                                                (v: string) =>
                                                    setData('tiktok_url', v),
                                            ],
                                        ].map(([label, value, onChange]) => (
                                            <SocialInput
                                                key={label}
                                                label={label as string}
                                                value={value as string}
                                                onChange={
                                                    onChange as (
                                                        v: string,
                                                    ) => void
                                                }
                                            />
                                        ))}
                                        <div className="flex justify-between sm:col-span-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    setCurrentStep(3)
                                                }
                                            >
                                                <ArrowLeft className="mr-2 h-4 w-4" />{' '}
                                                Retour
                                            </Button>
                                            <Button
                                                type="button"
                                                onClick={() =>
                                                    setCurrentStep((prev) =>
                                                        Math.min(prev + 1, 5),
                                                    )
                                                }
                                            >
                                                Continuer{' '}
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Étape 5 : Validation */}
                            {currentStep === 5 && (
                                <motion.div
                                    key="step5"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="rounded-xl border bg-card p-6"
                                >
                                    <h2 className="flex items-center gap-3 text-lg font-semibold">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">
                                            5
                                        </span>{' '}
                                        Récapitulatif & validation
                                    </h2>
                                    <div className="mt-6 space-y-6">
                                        <div className="rounded-xl border bg-gray-50/50 p-6 dark:bg-gray-900/50">
                                            <h3 className="mb-4 text-sm font-semibold text-gray-500 uppercase">
                                                Récapitulatif
                                            </h3>
                                            <dl className="divide-y divide-gray-200 dark:divide-gray-700">
                                                {[
                                                    [
                                                        'Plan',
                                                        `${plan.name} (${plan.formatted_price})`,
                                                    ],
                                                    [
                                                        'Nom',
                                                        data.shop_name || '—',
                                                    ],
                                                    [
                                                        'Adresse',
                                                        `${data.shop_slug}.${window.location.hostname}`,
                                                    ],
                                                    [
                                                        'Email',
                                                        data.contact_email ||
                                                            '—',
                                                    ],
                                                    ['Devise', data.currency],
                                                    [
                                                        'Langue',
                                                        selectedLanguage?.name ||
                                                            data.language,
                                                    ],
                                                ].map(([label, value]) => (
                                                    <div
                                                        key={label}
                                                        className="flex justify-between py-3"
                                                    >
                                                        <dt className="text-gray-600">
                                                            {label}
                                                        </dt>
                                                        <dd className="font-medium text-gray-900 dark:text-white">
                                                            {value}
                                                        </dd>
                                                    </div>
                                                ))}
                                            </dl>
                                        </div>
                                        <div className="flex items-start gap-3 rounded-xl border p-4">
                                            <input
                                                type="checkbox"
                                                checked={data.accept_terms}
                                                onChange={(e) =>
                                                    setData(
                                                        'accept_terms',
                                                        e.target.checked,
                                                    )
                                                }
                                                className="mt-1 h-5 w-5 rounded border-gray-300 text-emerald-600"
                                                id="terms"
                                            />
                                            <label
                                                htmlFor="terms"
                                                className="text-sm text-gray-600 dark:text-gray-300"
                                            >
                                                J'accepte les{' '}
                                                <Link
                                                    href="/conditions"
                                                    className="font-medium text-emerald-600 underline"
                                                    target="_blank"
                                                >
                                                    conditions générales
                                                </Link>{' '}
                                                et la{' '}
                                                <Link
                                                    href="/confidentialite"
                                                    className="font-medium text-emerald-600 underline"
                                                    target="_blank"
                                                >
                                                    politique de confidentialité
                                                </Link>
                                                .
                                            </label>
                                        </div>
                                        {errors.accept_terms && (
                                            <p className="text-sm text-red-500">
                                                <AlertCircle className="inline h-4 w-4" />{' '}
                                                {errors.accept_terms}
                                            </p>
                                        )}
                                        <div className="flex items-center justify-center gap-4 rounded-xl bg-green-50 p-4 dark:bg-green-900/20">
                                            <ShieldCheck className="h-5 w-5 text-green-600" />
                                            <span className="text-sm font-medium text-green-700">
                                                Vos données sont protégées et
                                                cryptées.
                                            </span>
                                        </div>
                                        <div className="flex justify-between pt-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    setCurrentStep(4)
                                                }
                                            >
                                                <ArrowLeft className="mr-2 h-4 w-4" />{' '}
                                                Retour
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={
                                                    processing || !isFormValid()
                                                }
                                                className="inline-flex items-center gap-3 rounded-xl bg-emerald-600 px-8 py-4 text-base font-bold text-white transition hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400"
                                            >
                                                {processing ? (
                                                    <>
                                                        <Loader2 className="h-5 w-5 animate-spin" />{' '}
                                                        Création en cours...
                                                    </>
                                                ) : plan.price > 0 ? (
                                                    <>
                                                        <ShieldCheck className="h-5 w-5" />{' '}
                                                        Payer{' '}
                                                        {plan.formatted_price}{' '}
                                                        et créer ma boutique
                                                    </>
                                                ) : (
                                                    <>
                                                        <Sparkles className="h-5 w-5" />{' '}
                                                        Créer ma boutique
                                                        gratuitement
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </form>
                </div>
            </div>
        </>
    );
}

// ------------------------------------------------------------------
// Composant DocumentCard mis à jour avec DatePickerField
// ------------------------------------------------------------------
function DocumentCard({
    doc,
    data,
    setData,
}: {
    doc: TypeDocument;
    data: any;
    setData: (field: string, value: any) => void;
}) {
    const docData = data.legal_documents[doc.code] || {
        numero: '',
        date_delivrance: '',
        date_expiration: '',
    };
    const updateDoc = (field: string, value: string) =>
        setData('legal_documents', {
            ...data.legal_documents,
            [doc.code]: { ...docData, [field]: value },
        });

    return (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 dark:border-emerald-800 dark:bg-emerald-900/20">
            <div className="flex items-start gap-3">
                <FileCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <div className="flex-1 space-y-3">
                    <div>
                        <h4 className="font-semibold">
                            {doc.nom}
                            {doc.est_obligatoire && (
                                <span className="text-red-500"> *</span>
                            )}
                        </h4>
                        {doc.description && (
                            <p className="text-sm text-muted-foreground">
                                {doc.description}
                            </p>
                        )}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                        <Input
                            type="text"
                            placeholder="Numéro du document"
                            value={docData.numero}
                            onChange={(e) =>
                                updateDoc('numero', e.target.value)
                            }
                            className="h-11"
                        />
                        <DatePickerField
                            value={docData.date_delivrance}
                            onChange={(v) => updateDoc('date_delivrance', v)}
                            placeholder="Date de délivrance"
                        />
                        <DatePickerField
                            value={docData.date_expiration}
                            onChange={(v) => updateDoc('date_expiration', v)}
                            placeholder="Date d'expiration"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Composant SocialInput (inchangé, mais ajoutez h-11 sur l'Input si désiré)
function SocialInput({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
}) {
    return (
        <div>
            <Label className="mb-2 flex items-center gap-1 text-sm font-medium">
                {label}
            </Label>
            <Input
                type="url"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={`https://${label.toLowerCase().replace(' / x', '')}.com/votreboutique`}
                className="h-11"
            />
        </div>
    );
}
