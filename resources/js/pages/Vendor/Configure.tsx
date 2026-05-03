/* eslint-disable @typescript-eslint/no-unused-vars */
// resources / js / Pages / Vendor / Configure.tsx;
// import { Head, useForm, Link } from '@inertiajs/react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//     ArrowLeft,
//     Store,
//     Globe,
//     Mail,
//     Phone,
//     FileText,
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
//     ArrowRight,
//     Check,
//     Camera,
//     Upload,
//     Facebook,
//     Instagram,
//     Twitter,
//     Youtube,
//     Hash,
// } from 'lucide-react';
// import { useState, useEffect, useCallback, useRef } from 'react';

// interface VendorConfigureProps {
//     plan: {
//         id: number;
//         name: string;
//         formatted_price: string;
//         price: number;
//     };
//     currencies: { code: string; symbol: string }[];
//     languages: { code: string; name: string; flag: string }[];
// }

// const steps = [
//     { id: 1, name: 'Identité', icon: Store },
//     { id: 2, name: 'Contact', icon: Mail },
//     { id: 3, name: 'Apparence', icon: Camera },
//     { id: 4, name: 'Validation', icon: ShieldCheck },
// ];

// export default function VendorConfigure({
//     plan,
//     currencies,
//     languages,
// }: VendorConfigureProps) {
//     const [currentStep, setCurrentStep] = useState(1);
//     const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
//     const [slugChecking, setSlugChecking] = useState(false);
//     const [slugStatus, setSlugStatus] = useState<
//         'idle' | 'checking' | 'available' | 'unavailable'
//     >('idle');
//     const [slugErrors, setSlugErrors] = useState<string[]>([]);
//     const [slugSuggestions, setSlugSuggestions] = useState<string[]>([]);
//     const [nameSuggestions, setNameSuggestions] = useState<
//         Array<{ slug: string; domain: string }>
//     >([]);
//     const [logoPreview, setLogoPreview] = useState<string | null>(null);
//     const debounceTimer = useRef<ReturnType<typeof setTimeout>>();

//     const { data, setData, post, processing, errors } = useForm({
//         plan_id: plan.id,
//         shop_name: '',
//         shop_slug: '',
//         shop_description: '',
//         contact_email: '',
//         contact_phone: '',
//         currency: 'CDF',
//         language: 'fr',
//         logo: null as File | null,
//         facebook_url: '',
//         instagram_url: '',
//         twitter_url: '',
//         youtube_url: '',
//         tiktok_url: '',
//         accept_terms: false,
//     });

//     // Génération automatique du slug depuis le nom
//     const generateBaseSlug = (name: string) => {
//         const slug = name
//             .toLowerCase()
//             .normalize('NFD')
//             .replace(/[\u0300-\u036f]/g, '')
//             .replace(/[^a-z0-9]+/g, '-')
//             .replace(/^-|-$/g, '');

//         return slug;
//     };

//     useEffect(() => {
//         if (!slugManuallyEdited && data.shop_name) {
//             setData('shop_slug', generateBaseSlug(data.shop_name));
//         }
//     }, [data.shop_name, setData, slugManuallyEdited]);

//     // Nettoyage manuel du slug
//     const handleSlugChange = (value: string) => {
//         setSlugManuallyEdited(true);
//         const cleaned = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
//         setData('shop_slug', cleaned);
//     };

//     // Vérification de disponibilité du slug
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
//                 const res = await fetch(route('vendor.check-domain'), {
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
//                     setSlugSuggestions([]);
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

//     // Debounce de la vérification
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

//         return () => clearTimeout(debounceTimer.current);
//     }, [data.shop_slug, checkSlug]);

//     // Suggestions basées sur le nom
//     const suggestFromName = useCallback(
//         async (shopName: string) => {
//             if (
//                 !shopName ||
//                 shopName.length < 3 ||
//                 slugManuallyEdited ||
//                 data.shop_slug
//             ) {
//                 setNameSuggestions([]);

//                 return;
//             }

//             try {
//                 const res = await fetch(route('vendor.suggest-domain'), {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'X-CSRF-TOKEN':
//                             document
//                                 .querySelector('meta[name="csrf-token"]')
//                                 ?.getAttribute('content') || '',
//                     },
//                     body: JSON.stringify({ shop_name: shopName }),
//                 });
//                 const json = await res.json();
//                 setNameSuggestions(json.suggestions || []);
//             } catch {
//                 setNameSuggestions([]);
//             }
//         },
//         [slugManuallyEdited, data.shop_slug],
//     );

//     useEffect(() => {
//         if (debounceTimer.current) {
//             clearTimeout(debounceTimer.current);
//         }

//         debounceTimer.current = setTimeout(
//             () => suggestFromName(data.shop_name),
//             600,
//         );

//         return () => clearTimeout(debounceTimer.current);
//     }, [data.shop_name, suggestFromName]);

//     const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];

//         if (file) {
//             setData('logo', file);
//             setLogoPreview(URL.createObjectURL(file));
//         }
//     };

//     const isStepValid = (step: number) => {
//         switch (step) {
//             case 1:
//                 return (
//                     data.shop_name.trim() &&
//                     data.shop_slug.trim() &&
//                     slugStatus !== 'unavailable'
//                 );
//             case 2:
//                 return data.contact_email.trim();
//             case 3:
//                 return true; // Optionnelle
//             case 4:
//                 return data.accept_terms;
//             default:
//                 return false;
//         }
//     };

//     const isFormValid = isStepValid(1) && isStepValid(2) && isStepValid(4);

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         post(route('vendor.store'));
//     };

//     // Animation variants
//     const sectionVariants = {
//         hidden: { opacity: 0, y: 30 },
//         visible: (i: number) => ({
//             opacity: 1,
//             y: 0,
//             transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
//         }),
//     };

//     return (
//         <>
//             <Head title="Configurez votre boutique" />
//             <div className="min-h-screen bg-linear-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
//                 {/* Barre de progression */}
//                 <div className="sticky top-0 z-30 border-b border-gray-200/80 bg-white/80 backdrop-blur-xl dark:border-gray-800/80 dark:bg-gray-900/80">
//                     <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
//                         <Link
//                             href={route('vendor.register')}
//                             className="flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-amber-600 dark:text-gray-400 dark:hover:text-amber-400"
//                         >
//                             <ArrowLeft className="h-4 w-4" /> Retour
//                         </Link>
//                         <div className="hidden items-center gap-1 sm:flex">
//                             {steps.map((step, idx) => (
//                                 <div
//                                     key={step.id}
//                                     className="flex items-center gap-1"
//                                 >
//                                     <motion.button
//                                         whileHover={{ scale: 1.05 }}
//                                         whileTap={{ scale: 0.95 }}
//                                         onClick={() => setCurrentStep(step.id)}
//                                         className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300 ${
//                                             currentStep === step.id
//                                                 ? 'bg-amber-100 text-amber-700 shadow-sm dark:bg-amber-900/50 dark:text-amber-300'
//                                                 : currentStep > step.id
//                                                   ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
//                                                   : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
//                                         }`}
//                                     >
//                                         {currentStep > step.id ? (
//                                             <CheckCircle className="h-4 w-4" />
//                                         ) : (
//                                             <step.icon className="h-4 w-4" />
//                                         )}
//                                         {step.name}
//                                     </motion.button>
//                                     {idx < steps.length - 1 && (
//                                         <div className="h-px w-8 bg-gray-300 dark:bg-gray-700" />
//                                     )}
//                                 </div>
//                             ))}
//                         </div>
//                         <div className="flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-sm font-medium text-amber-700 shadow-sm dark:bg-amber-900/50 dark:text-amber-300">
//                             <Zap className="h-4 w-4" /> Plan {plan.name}
//                         </div>
//                     </div>
//                 </div>

//                 <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
//                     <motion.div
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         className="mb-12 text-center"
//                     >
//                         <div className="mb-4 inline-flex rounded-2xl bg-amber-50 p-3 shadow-sm dark:bg-amber-900/20">
//                             <Sparkles className="h-10 w-10 text-amber-500" />
//                         </div>
//                         <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
//                             Créez votre boutique
//                         </h1>
//                         <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
//                             {plan.price === 0
//                                 ? 'Votre espace sera prêt en quelques secondes.'
//                                 : `Configuration terminée, vous passerez au paiement (${plan.formatted_price}/mois).`}
//                         </p>
//                     </motion.div>

//                     <form onSubmit={handleSubmit} className="space-y-8">
//                         {/* Section 1 : Identité */}
//                         <motion.div
//                             custom={0}
//                             variants={sectionVariants}
//                             initial="hidden"
//                             animate="visible"
//                             className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800/80 dark:backdrop-blur-sm"
//                         >
//                             <div className="border-b border-gray-100 bg-amber-50/50 px-8 py-5 dark:border-gray-700 dark:bg-amber-900/20">
//                                 <h2 className="flex items-center gap-3 text-lg font-semibold text-gray-800 dark:text-gray-100">
//                                     <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white shadow-sm">
//                                         1
//                                     </span>
//                                     Identité de votre boutique
//                                 </h2>
//                             </div>
//                             <div className="space-y-6 p-8">
//                                 {/* Nom de la boutique */}
//                                 <div>
//                                     <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
//                                         Nom de la boutique{' '}
//                                         <span className="text-red-500">*</span>
//                                     </label>
//                                     <div className="relative">
//                                         <Store className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
//                                         <input
//                                             type="text"
//                                             value={data.shop_name}
//                                             onChange={(e) =>
//                                                 setData(
//                                                     'shop_name',
//                                                     e.target.value,
//                                                 )
//                                             }
//                                             className="w-full rounded-xl border border-gray-300 py-3 pr-4 pl-10 text-gray-900 placeholder-gray-400 transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
//                                             placeholder="Ma Boutique Artisanale"
//                                             required
//                                         />
//                                     </div>
//                                 </div>

//                                 {/* Domaine */}
//                                 <div>
//                                     <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
//                                         Adresse web{' '}
//                                         <span className="text-red-500">*</span>
//                                     </label>
//                                     <div className="flex rounded-xl shadow-sm">
//                                         <div className="relative flex-1">
//                                             <Globe className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
//                                             <input
//                                                 type="text"
//                                                 value={data.shop_slug}
//                                                 onChange={(e) =>
//                                                     handleSlugChange(
//                                                         e.target.value,
//                                                     )
//                                                 }
//                                                 className={`w-full rounded-l-xl border py-3 pr-10 pl-10 transition focus:ring-2 ${
//                                                     slugStatus === 'available'
//                                                         ? 'border-green-500 focus:border-green-500 focus:ring-green-200 dark:border-green-400'
//                                                         : slugStatus ===
//                                                             'unavailable'
//                                                           ? 'border-red-500 focus:border-red-500 focus:ring-red-200 dark:border-red-400'
//                                                           : 'border-gray-300 focus:border-amber-500 focus:ring-amber-200 dark:border-gray-600'
//                                                 } dark:bg-gray-700 dark:text-white`}
//                                                 placeholder="ma-boutique"
//                                                 required
//                                             />
//                                             <div className="absolute top-1/2 right-3 -translate-y-1/2">
//                                                 {slugChecking && (
//                                                     <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
//                                                 )}
//                                                 {!slugChecking &&
//                                                     slugStatus ===
//                                                         'available' && (
//                                                         <CheckCircle className="h-5 w-5 text-green-500" />
//                                                     )}
//                                                 {!slugChecking &&
//                                                     slugStatus ===
//                                                         'unavailable' && (
//                                                         <XCircle className="h-5 w-5 text-red-500" />
//                                                     )}
//                                             </div>
//                                         </div>
//                                         <span className="flex items-center rounded-r-xl border border-l-0 border-gray-300 bg-gray-50 px-4 text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400">
//                                             .{window.location.hostname}
//                                         </span>
//                                     </div>

//                                     {/* Feedback visuel */}
//                                     <AnimatePresence>
//                                         {slugStatus === 'available' && (
//                                             <motion.p
//                                                 initial={{ opacity: 0, y: -5 }}
//                                                 animate={{ opacity: 1, y: 0 }}
//                                                 className="mt-2 flex items-center gap-1 text-sm text-green-600 dark:text-green-400"
//                                             >
//                                                 <CheckCircle className="h-4 w-4" />{' '}
//                                                 Disponible !
//                                             </motion.p>
//                                         )}
//                                         {slugErrors.map((err, i) => (
//                                             <motion.p
//                                                 key={i}
//                                                 initial={{ opacity: 0, y: -5 }}
//                                                 animate={{ opacity: 1, y: 0 }}
//                                                 className="mt-2 flex items-center gap-1 text-sm text-red-500"
//                                             >
//                                                 <XCircle className="h-4 w-4" />{' '}
//                                                 {err}
//                                             </motion.p>
//                                         ))}
//                                     </AnimatePresence>

//                                     {data.shop_slug &&
//                                         slugStatus === 'available' && (
//                                             <p className="mt-1 flex items-center gap-1 text-sm text-amber-600 dark:text-amber-400">
//                                                 <Eye className="h-4 w-4" />{' '}
//                                                 {data.shop_slug}.
//                                                 {window.location.hostname}
//                                             </p>
//                                         )}

//                                     {/* Suggestions alternatives */}
//                                     {slugSuggestions.length > 0 && (
//                                         <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
//                                             <p className="mb-2 flex items-center gap-1 text-sm font-medium text-amber-700 dark:text-amber-300">
//                                                 <Lightbulb className="h-4 w-4" />{' '}
//                                                 Suggestions disponibles :
//                                             </p>
//                                             <div className="flex flex-wrap gap-2">
//                                                 {slugSuggestions.map((s) => (
//                                                     <button
//                                                         key={s}
//                                                         type="button"
//                                                         onClick={() => {
//                                                             setData(
//                                                                 'shop_slug',
//                                                                 s,
//                                                             );
//                                                             setSlugManuallyEdited(
//                                                                 true,
//                                                             );
//                                                             checkSlug(s);
//                                                         }}
//                                                         className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-amber-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-amber-900/50"
//                                                     >
//                                                         <Copy className="h-3 w-3" />{' '}
//                                                         {s}
//                                                     </button>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     )}

//                                     {/* Suggestions basées sur le nom */}
//                                     {nameSuggestions.length > 0 &&
//                                         !data.shop_slug && (
//                                             <div className="mt-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
//                                                 <p className="mb-2 flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
//                                                     <Sparkles className="h-4 w-4 text-amber-500" />{' '}
//                                                     Basé sur votre nom :
//                                                 </p>
//                                                 <div className="flex flex-wrap gap-2">
//                                                     {nameSuggestions.map(
//                                                         (s) => (
//                                                             <button
//                                                                 key={s.slug}
//                                                                 type="button"
//                                                                 onClick={() => {
//                                                                     setData(
//                                                                         'shop_slug',
//                                                                         s.slug,
//                                                                     );
//                                                                     setSlugManuallyEdited(
//                                                                         true,
//                                                                     );
//                                                                     checkSlug(
//                                                                         s.slug,
//                                                                     );
//                                                                 }}
//                                                                 className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-amber-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-amber-900/50"
//                                                             >
//                                                                 <Check className="h-3 w-3 text-green-500" />{' '}
//                                                                 {s.slug}
//                                                             </button>
//                                                         ),
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         )}
//                                 </div>
//                             </div>
//                         </motion.div>

//                         {/* Section 2 : Contact & Localisation */}
//                         <motion.div
//                             custom={1}
//                             variants={sectionVariants}
//                             initial="hidden"
//                             animate="visible"
//                             className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800/80"
//                         >
//                             <div className="border-b border-gray-100 bg-amber-50/50 px-8 py-5 dark:border-gray-700 dark:bg-amber-900/20">
//                                 <h2 className="flex items-center gap-3 text-lg font-semibold text-gray-800 dark:text-gray-100">
//                                     <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white shadow-sm">
//                                         2
//                                     </span>
//                                     Contact & localisation
//                                 </h2>
//                             </div>
//                             <div className="grid gap-6 p-8 sm:grid-cols-2">
//                                 <div>
//                                     <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
//                                         Email{' '}
//                                         <span className="text-red-500">*</span>
//                                     </label>
//                                     <div className="relative">
//                                         <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
//                                         <input
//                                             type="email"
//                                             value={data.contact_email}
//                                             onChange={(e) =>
//                                                 setData(
//                                                     'contact_email',
//                                                     e.target.value,
//                                                 )
//                                             }
//                                             className="w-full rounded-xl border border-gray-300 py-3 pr-4 pl-10 text-gray-900 placeholder-gray-400 transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
//                                             placeholder="contact@maboutique.cd"
//                                             required
//                                         />
//                                     </div>
//                                 </div>
//                                 <div>
//                                     <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
//                                         Téléphone
//                                     </label>
//                                     <div className="relative">
//                                         <Phone className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
//                                         <input
//                                             type="tel"
//                                             value={data.contact_phone}
//                                             onChange={(e) =>
//                                                 setData(
//                                                     'contact_phone',
//                                                     e.target.value,
//                                                 )
//                                             }
//                                             className="w-full rounded-xl border border-gray-300 py-3 pr-4 pl-10 text-gray-900 placeholder-gray-400 transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
//                                             placeholder="+243 XXX XXX XXX"
//                                         />
//                                     </div>
//                                 </div>

//                                 {/* Devise & Langue */}
//                                 <div>
//                                     <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
//                                         Devise par défaut
//                                     </label>
//                                     <select
//                                         value={data.currency}
//                                         onChange={(e) =>
//                                             setData('currency', e.target.value)
//                                         }
//                                         className="w-full rounded-xl border border-gray-300 bg-white py-3 pr-10 pl-4 text-gray-900 transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
//                                     >
//                                         {currencies?.map((c) => (
//                                             <option key={c.code} value={c.code}>
//                                                 {c.symbol} {c.code}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>
//                                 <div>
//                                     <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
//                                         Langue par défaut
//                                     </label>
//                                     <select
//                                         value={data.language}
//                                         onChange={(e) =>
//                                             setData('language', e.target.value)
//                                         }
//                                         className="w-full rounded-xl border border-gray-300 bg-white py-3 pr-10 pl-4 text-gray-900 transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
//                                     >
//                                         {languages?.map((l) => (
//                                             <option key={l.code} value={l.code}>
//                                                 {l.flag} {l.name}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>

//                                 {/* Description */}
//                                 <div className="sm:col-span-2">
//                                     <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
//                                         Description de votre boutique
//                                     </label>
//                                     <textarea
//                                         value={data.shop_description}
//                                         onChange={(e) =>
//                                             setData(
//                                                 'shop_description',
//                                                 e.target.value,
//                                             )
//                                         }
//                                         className="w-full rounded-xl border border-gray-300 p-4 text-gray-900 placeholder-gray-400 transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
//                                         rows={4}
//                                         placeholder="Parlez-nous de votre activité, de vos produits..."
//                                         maxLength={500}
//                                     />
//                                     <p className="mt-1 text-right text-xs text-gray-400">
//                                         {data.shop_description?.length || 0}/500
//                                     </p>
//                                 </div>
//                             </div>
//                         </motion.div>

//                         {/* Section 3 : Apparence & Réseaux */}
//                         <motion.div
//                             custom={2}
//                             variants={sectionVariants}
//                             initial="hidden"
//                             animate="visible"
//                             className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800/80"
//                         >
//                             <div className="border-b border-gray-100 bg-amber-50/50 px-8 py-5 dark:border-gray-700 dark:bg-amber-900/20">
//                                 <h2 className="flex items-center gap-3 text-lg font-semibold text-gray-800 dark:text-gray-100">
//                                     <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white shadow-sm">
//                                         3
//                                     </span>
//                                     Apparence & réseaux sociaux
//                                 </h2>
//                             </div>
//                             <div className="grid gap-6 p-8 sm:grid-cols-2">
//                                 {/* Logo */}
//                                 <div className="sm:col-span-2">
//                                     <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
//                                         Logo de votre boutique
//                                     </label>
//                                     <div className="flex items-center gap-6">
//                                         <div className="relative h-24 w-24 overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-amber-400 dark:border-gray-600 dark:bg-gray-700">
//                                             {logoPreview ? (
//                                                 <img
//                                                     src={logoPreview}
//                                                     alt="Logo preview"
//                                                     className="h-full w-full object-cover"
//                                                 />
//                                             ) : (
//                                                 <div className="flex h-full w-full items-center justify-center text-gray-400">
//                                                     <Camera className="h-8 w-8" />
//                                                 </div>
//                                             )}
//                                             <input
//                                                 type="file"
//                                                 accept="image/*"
//                                                 onChange={handleLogoChange}
//                                                 className="absolute inset-0 cursor-pointer opacity-0"
//                                             />
//                                         </div>
//                                         <div className="text-sm text-gray-500 dark:text-gray-400">
//                                             <p className="font-medium">
//                                                 Taille recommandée : 500 × 500
//                                                 px
//                                             </p>
//                                             <p>PNG, JPG ou WebP. Max 2 Mo.</p>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Réseaux sociaux */}
//                                 <div>
//                                     <label className="mb-2 flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
//                                         <Facebook className="h-4 w-4" />{' '}
//                                         Facebook
//                                     </label>
//                                     <input
//                                         type="url"
//                                         value={data.facebook_url}
//                                         onChange={(e) =>
//                                             setData(
//                                                 'facebook_url',
//                                                 e.target.value,
//                                             )
//                                         }
//                                         className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
//                                         placeholder="https://facebook.com/votreboutique"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="mb-2 flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
//                                         <Instagram className="h-4 w-4" />{' '}
//                                         Instagram
//                                     </label>
//                                     <input
//                                         type="url"
//                                         value={data.instagram_url}
//                                         onChange={(e) =>
//                                             setData(
//                                                 'instagram_url',
//                                                 e.target.value,
//                                             )
//                                         }
//                                         className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
//                                         placeholder="https://instagram.com/votreboutique"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="mb-2 flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
//                                         <Twitter className="h-4 w-4" /> Twitter
//                                         / X
//                                     </label>
//                                     <input
//                                         type="url"
//                                         value={data.twitter_url}
//                                         onChange={(e) =>
//                                             setData(
//                                                 'twitter_url',
//                                                 e.target.value,
//                                             )
//                                         }
//                                         className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
//                                         placeholder="https://x.com/votreboutique"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="mb-2 flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
//                                         <Youtube className="h-4 w-4" /> YouTube
//                                     </label>
//                                     <input
//                                         type="url"
//                                         value={data.youtube_url}
//                                         onChange={(e) =>
//                                             setData(
//                                                 'youtube_url',
//                                                 e.target.value,
//                                             )
//                                         }
//                                         className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
//                                         placeholder="https://youtube.com/@votreboutique"
//                                     />
//                                 </div>
//                                 <div>
//                                     <label className="mb-2 flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
//                                         <Hash className="h-4 w-4" /> TikTok
//                                     </label>
//                                     <input
//                                         type="url"
//                                         value={data.tiktok_url}
//                                         onChange={(e) =>
//                                             setData(
//                                                 'tiktok_url',
//                                                 e.target.value,
//                                             )
//                                         }
//                                         className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
//                                         placeholder="https://tiktok.com/@votreboutique"
//                                     />
//                                 </div>
//                             </div>
//                         </motion.div>

//                         {/* Section 4 : Validation */}
//                         <motion.div
//                             custom={3}
//                             variants={sectionVariants}
//                             initial="hidden"
//                             animate="visible"
//                             className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800/80"
//                         >
//                             <div className="border-b border-gray-100 bg-amber-50/50 px-8 py-5 dark:border-gray-700 dark:bg-amber-900/20">
//                                 <h2 className="flex items-center gap-3 text-lg font-semibold text-gray-800 dark:text-gray-100">
//                                     <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white shadow-sm">
//                                         4
//                                     </span>
//                                     Récapitulatif & validation
//                                 </h2>
//                             </div>
//                             <div className="space-y-6 p-8">
//                                 {/* Résumé */}
//                                 <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6 dark:border-gray-700 dark:from-gray-900 dark:to-gray-800">
//                                     <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
//                                         Résumé de votre boutique
//                                     </h3>
//                                     <dl className="divide-y divide-gray-200 dark:divide-gray-700">
//                                         {[
//                                             [
//                                                 'Plan',
//                                                 `${plan.name} (${plan.formatted_price})`,
//                                             ],
//                                             ['Nom', data.shop_name || '—'],
//                                             [
//                                                 'Adresse',
//                                                 `${data.shop_slug}.${window.location.hostname}`,
//                                             ],
//                                             [
//                                                 'Email',
//                                                 data.contact_email || '—',
//                                             ],
//                                             ['Devise', data.currency],
//                                             [
//                                                 'Langue',
//                                                 languages?.find(
//                                                     (l) =>
//                                                         l.code ===
//                                                         data.language,
//                                                 )?.name || data.language,
//                                             ],
//                                         ].map(([label, value]) => (
//                                             <div
//                                                 key={label}
//                                                 className="flex justify-between py-3"
//                                             >
//                                                 <dt className="text-gray-600 dark:text-gray-400">
//                                                     {label}
//                                                 </dt>
//                                                 <dd className="font-medium text-gray-900 dark:text-white">
//                                                     {value}
//                                                 </dd>
//                                             </div>
//                                         ))}
//                                     </dl>
//                                 </div>

//                                 {/* Conditions générales */}
//                                 <div className="flex items-start gap-3 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
//                                     <input
//                                         type="checkbox"
//                                         checked={data.accept_terms}
//                                         onChange={(e) =>
//                                             setData(
//                                                 'accept_terms',
//                                                 e.target.checked,
//                                             )
//                                         }
//                                         className="mt-1 h-5 w-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500 dark:border-gray-600"
//                                         id="terms"
//                                     />
//                                     <label
//                                         htmlFor="terms"
//                                         className="text-sm text-gray-600 dark:text-gray-300"
//                                     >
//                                         J'accepte les{' '}
//                                         <Link
//                                             href="/conditions"
//                                             className="font-medium text-amber-600 underline"
//                                             target="_blank"
//                                         >
//                                             conditions générales
//                                         </Link>{' '}
//                                         et la{' '}
//                                         <Link
//                                             href="/confidentialite"
//                                             className="font-medium text-amber-600 underline"
//                                             target="_blank"
//                                         >
//                                             politique de confidentialité
//                                         </Link>
//                                         .
//                                     </label>
//                                 </div>
//                                 {errors.accept_terms && (
//                                     <p className="flex items-center gap-1 text-sm text-red-500">
//                                         <AlertCircle className="h-4 w-4" />{' '}
//                                         {errors.accept_terms}
//                                     </p>
//                                 )}

//                                 {/* Sécurité */}
//                                 <div className="flex items-center justify-center gap-4 rounded-xl bg-green-50 p-4 dark:bg-green-900/20">
//                                     <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
//                                     <span className="text-sm font-medium text-green-700 dark:text-green-300">
//                                         Vos données sont protégées et cryptées.
//                                     </span>
//                                 </div>

//                                 {/* Bouton de soumission */}
//                                 <div className="flex justify-center pt-4">
//                                     <motion.button
//                                         type="submit"
//                                         disabled={processing || !isFormValid}
//                                         whileHover={
//                                             isFormValid ? { scale: 1.03 } : {}
//                                         }
//                                         whileTap={
//                                             isFormValid ? { scale: 0.97 } : {}
//                                         }
//                                         className={`inline-flex items-center gap-3 rounded-2xl px-12 py-4 text-lg font-bold transition-all duration-300 ${
//                                             processing
//                                                 ? 'cursor-wait bg-amber-400 text-white'
//                                                 : isFormValid
//                                                   ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-xl shadow-amber-200 hover:from-amber-700 hover:to-amber-800 hover:shadow-2xl hover:shadow-amber-300 dark:shadow-amber-900/30 dark:hover:shadow-amber-900/50'
//                                                   : 'cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
//                                         }`}
//                                     >
//                                         {processing ? (
//                                             <>
//                                                 <Loader2 className="h-5 w-5 animate-spin" />{' '}
//                                                 Création en cours...
//                                             </>
//                                         ) : plan.price > 0 ? (
//                                             <>
//                                                 <ShieldCheck className="h-5 w-5" />
//                                                 Payer {plan.formatted_price} et
//                                                 créer ma boutique
//                                             </>
//                                         ) : (
//                                             <>
//                                                 <Sparkles className="h-5 w-5" />
//                                                 Créer ma boutique gratuitement
//                                             </>
//                                         )}
//                                     </motion.button>
//                                 </div>
//                             </div>
//                         </motion.div>
//                     </form>
//                 </div>
//             </div>
//         </>
//     );
// }
// resources/js/Pages/Vendor/Configure.tsx
import { Head, useForm, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Store,
    Globe,
    Mail,
    Phone,
    FileText,
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
    ArrowRight,
    Check,
    Camera,
    Upload,
    Facebook,
    Instagram,
    Twitter,
    Youtube,
    Hash,
    FileCheck,
    Building,
    CreditCard,
    MapPin,
} from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { FaFacebook } from 'react-icons/fa';

interface TypeDocument {
    id: string;
    code: string;
    nom: string;
    description: string | null;
    est_obligatoire: boolean;
}

interface VendorConfigureProps {
    plan: { id: number; name: string; formatted_price: string; price: number };
    currencies: { code: string; symbol: string }[];
    languages: { code: string; name: string; flag: string }[];
    requiredDocuments: TypeDocument[];
    optionalDocuments: TypeDocument[];
}

const steps = [
    { id: 1, name: 'Identité', icon: Store },
    { id: 2, name: 'Contact', icon: Mail },
    { id: 3, name: 'Légal', icon: FileCheck },
    { id: 4, name: 'Apparence', icon: Camera },
    { id: 5, name: 'Validation', icon: ShieldCheck },
];

export default function VendorConfigure({
    plan,
    currencies,
    languages,
    requiredDocuments,
    optionalDocuments,
}: VendorConfigureProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
    const [slugChecking, setSlugChecking] = useState(false);
    const [slugStatus, setSlugStatus] = useState<
        'idle' | 'checking' | 'available' | 'unavailable'
    >('idle');
    const [slugErrors, setSlugErrors] = useState<string[]>([]);
    const [slugSuggestions, setSlugSuggestions] = useState<string[]>([]);
    const [nameSuggestions, setNameSuggestions] = useState<
        Array<{ slug: string; domain: string }>
    >([]);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const debounceTimer = useRef<ReturnType<typeof setTimeout>>();

    const { data, setData, post, processing, errors } = useForm({
        plan_id: plan.id,
        shop_name: '',
        shop_slug: '',
        shop_description: '',
        contact_email: '',
        contact_phone: '',
        currency: 'CDF',
        language: 'fr',
        logo: null as File | null,
        facebook_url: '',
        instagram_url: '',
        twitter_url: '',
        youtube_url: '',
        tiktok_url: '',
        accept_terms: false,
        // Documents légaux
        legal_documents: {} as Record<
            string,
            {
                numero: string;
                date_delivrance: string;
                date_expiration: string;
                fichier: File | null;
            }
        >,
    });

    // Slug generation logic (unchanged)
    const generateBaseSlug = (name: string) => {
        return name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    };

    useEffect(() => {
        if (!slugManuallyEdited && data.shop_name) {
            setData('shop_slug', generateBaseSlug(data.shop_name));
        }
    }, [data.shop_name, setData, slugManuallyEdited]);

    const handleSlugChange = (value: string) => {
        setSlugManuallyEdited(true);
        setData('shop_slug', value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
    };

    // Vérification de disponibilité du slug
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
                const res = await fetch(route('vendor.check-domain'), {
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
                    setSlugSuggestions([]);
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

    // Debounce de la vérification
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

        return () => clearTimeout(debounceTimer.current);
    }, [data.shop_slug, checkSlug]);

    // Suggestions basées sur le nom
    const suggestFromName = useCallback(
        async (shopName: string) => {
            if (
                !shopName ||
                shopName.length < 3 ||
                slugManuallyEdited ||
                data.shop_slug
            ) {
                setNameSuggestions([]);

                return;
            }

            try {
                const res = await fetch(route('vendor.suggest-domain'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN':
                            document
                                .querySelector('meta[name="csrf-token"]')
                                ?.getAttribute('content') || '',
                    },
                    body: JSON.stringify({ shop_name: shopName }),
                });
                const json = await res.json();
                setNameSuggestions(json.suggestions || []);
            } catch {
                setNameSuggestions([]);
            }
        },
        [slugManuallyEdited, data.shop_slug],
    );

    useEffect(() => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(
            () => suggestFromName(data.shop_name),
            600,
        );

        return () => clearTimeout(debounceTimer.current);
    }, [data.shop_name, suggestFromName]);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setData('logo', file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    // Validation per step
    const isStepValid = (step: number) => {
        switch (step) {
            case 1:
                return (
                    data.shop_name.trim() &&
                    data.shop_slug.trim() &&
                    slugStatus !== 'unavailable'
                );
            case 2:
                return data.contact_email.trim();
            case 3:
                return requiredDocuments.every((doc) => {
                    const docData = data.legal_documents[doc.code];

                    return docData?.numero?.trim();
                });
            case 4:
                return true;
            case 5:
                return data.accept_terms;
            default:
                return false;
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('vendor.store'));
    };

    console.log(requiredDocuments);

    return (
        <>
            <Head title="Configurez votre boutique" />
            <div className="min-h-screen bg-linear-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                {/* Progress bar - identical structure */}
                <div className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur-xl dark:bg-gray-900/80">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                        <Link
                            href={route('vendor.register')}
                            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-amber-600"
                        >
                            <ArrowLeft className="h-4 w-4" /> Retour
                        </Link>
                        <div className="hidden items-center gap-1 sm:flex">
                            {steps.map((step, idx) => (
                                <div
                                    key={step.id}
                                    className="flex items-center gap-1"
                                >
                                    <button
                                        onClick={() => setCurrentStep(step.id)}
                                        className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                                            currentStep === step.id
                                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
                                                : currentStep > step.id
                                                  ? 'bg-green-50 text-green-600'
                                                  : 'bg-gray-100 text-gray-400'
                                        }`}
                                    >
                                        {currentStep > step.id ? (
                                            <CheckCircle className="h-3 w-3" />
                                        ) : (
                                            <step.icon className="h-3 w-3" />
                                        )}{' '}
                                        {step.name}
                                    </button>
                                    {idx < steps.length - 1 && (
                                        <div className="h-px w-6 bg-gray-300 dark:bg-gray-700" />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-sm font-medium text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                            <Zap className="h-4 w-4" /> Plan {plan.name}
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12 text-center"
                    >
                        <div className="mb-4 inline-flex rounded-2xl bg-amber-50 p-3 dark:bg-amber-900/20">
                            <Sparkles className="h-10 w-10 text-amber-500" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                            Créez votre boutique
                        </h1>
                        <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
                            {plan.price === 0
                                ? 'Votre espace sera prêt en quelques secondes.'
                                : `Configuration terminée, paiement de ${plan.formatted_price}/mois.`}
                        </p>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Step 1: Identity - identical to original */}
                        <AnimatePresence mode="wait">
                            {currentStep === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="rounded-2xl border bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800/80"
                                >
                                    <h2 className="flex items-center gap-3 text-lg font-semibold">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white">
                                            1
                                        </span>{' '}
                                        Identité de votre boutique
                                    </h2>
                                    <div className="mt-6 space-y-6">
                                        {/* Shop Name */}
                                        <div>
                                            <label className="mb-2 block text-sm font-medium">
                                                Nom de la boutique{' '}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <div className="relative">
                                                <Store className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={data.shop_name}
                                                    onChange={(e) =>
                                                        setData(
                                                            'shop_name',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full rounded-xl border py-3 pr-4 pl-10 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                    placeholder="Ma Boutique Artisanale"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        {/* Domaine */}
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Adresse web{' '}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <div className="flex rounded-xl shadow-sm">
                                                <div className="relative flex-1">
                                                    <Globe className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        value={data.shop_slug}
                                                        onChange={(e) =>
                                                            handleSlugChange(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className={`w-full rounded-l-xl border py-3 pr-10 pl-10 transition focus:ring-2 ${
                                                            slugStatus ===
                                                            'available'
                                                                ? 'border-green-500 focus:border-green-500 focus:ring-green-200 dark:border-green-400'
                                                                : slugStatus ===
                                                                    'unavailable'
                                                                  ? 'border-red-500 focus:border-red-500 focus:ring-red-200 dark:border-red-400'
                                                                  : 'border-gray-300 focus:border-amber-500 focus:ring-amber-200 dark:border-gray-600'
                                                        } dark:bg-gray-700 dark:text-white`}
                                                        placeholder="ma-boutique"
                                                        required
                                                    />
                                                    <div className="absolute top-1/2 right-3 -translate-y-1/2">
                                                        {slugChecking && (
                                                            <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
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
                                                <span className="flex items-center rounded-r-xl border border-l-0 border-gray-300 bg-gray-50 px-4 text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400">
                                                    .{window.location.hostname}
                                                </span>
                                            </div>

                                            {/* Feedback visuel */}
                                            <AnimatePresence>
                                                {slugStatus === 'available' && (
                                                    <motion.p
                                                        initial={{
                                                            opacity: 0,
                                                            y: -5,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            y: 0,
                                                        }}
                                                        className="mt-2 flex items-center gap-1 text-sm text-green-600 dark:text-green-400"
                                                    >
                                                        <CheckCircle className="h-4 w-4" />{' '}
                                                        Disponible !
                                                    </motion.p>
                                                )}
                                                {slugErrors.map((err, i) => (
                                                    <motion.p
                                                        key={i}
                                                        initial={{
                                                            opacity: 0,
                                                            y: -5,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            y: 0,
                                                        }}
                                                        className="mt-2 flex items-center gap-1 text-sm text-red-500"
                                                    >
                                                        <XCircle className="h-4 w-4" />{' '}
                                                        {err}
                                                    </motion.p>
                                                ))}
                                            </AnimatePresence>

                                            {data.shop_slug &&
                                                slugStatus === 'available' && (
                                                    <p className="mt-1 flex items-center gap-1 text-sm text-amber-600 dark:text-amber-400">
                                                        <Eye className="h-4 w-4" />{' '}
                                                        {data.shop_slug}.
                                                        {
                                                            window.location
                                                                .hostname
                                                        }
                                                    </p>
                                                )}

                                            {/* Suggestions alternatives */}
                                            {slugSuggestions.length > 0 && (
                                                <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                                                    <p className="mb-2 flex items-center gap-1 text-sm font-medium text-amber-700 dark:text-amber-300">
                                                        <Lightbulb className="h-4 w-4" />{' '}
                                                        Suggestions disponibles
                                                        :
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {slugSuggestions.map(
                                                            (s) => (
                                                                <button
                                                                    key={s}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setData(
                                                                            'shop_slug',
                                                                            s,
                                                                        );
                                                                        setSlugManuallyEdited(
                                                                            true,
                                                                        );
                                                                        checkSlug(
                                                                            s,
                                                                        );
                                                                    }}
                                                                    className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-amber-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-amber-900/50"
                                                                >
                                                                    <Copy className="h-3 w-3" />{' '}
                                                                    {s}
                                                                </button>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Suggestions basées sur le nom */}
                                            {nameSuggestions.length > 0 &&
                                                !data.shop_slug && (
                                                    <div className="mt-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                                        <p className="mb-2 flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            <Sparkles className="h-4 w-4 text-amber-500" />{' '}
                                                            Basé sur votre nom :
                                                        </p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {nameSuggestions.map(
                                                                (s) => (
                                                                    <button
                                                                        key={
                                                                            s.slug
                                                                        }
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setData(
                                                                                'shop_slug',
                                                                                s.slug,
                                                                            );
                                                                            setSlugManuallyEdited(
                                                                                true,
                                                                            );
                                                                            checkSlug(
                                                                                s.slug,
                                                                            );
                                                                        }}
                                                                        className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-amber-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-amber-900/50"
                                                                    >
                                                                        <Check className="h-3 w-3 text-green-500" />{' '}
                                                                        {s.slug}
                                                                    </button>
                                                                ),
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    isStepValid(1) &&
                                                    setCurrentStep(2)
                                                }
                                                disabled={!isStepValid(1)}
                                                className={`rounded-xl px-6 py-3 text-sm font-semibold ${isStepValid(1) ? 'bg-amber-600 text-white hover:bg-amber-700' : 'cursor-not-allowed bg-gray-200 text-gray-400'}`}
                                            >
                                                Continuer{' '}
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Step 2: Contact - identical */}
                        <AnimatePresence mode="wait">
                            {currentStep === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="rounded-2xl border bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800/80"
                                >
                                    <h2 className="flex items-center gap-3 text-lg font-semibold">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white">
                                            2
                                        </span>{' '}
                                        Contact & localisation
                                    </h2>
                                    <div className="mt-6 grid gap-6 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-2 block text-sm font-medium">
                                                Email{' '}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="email"
                                                    value={data.contact_email}
                                                    onChange={(e) =>
                                                        setData(
                                                            'contact_email',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full rounded-xl border py-3 pr-4 pl-10 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-sm font-medium">
                                                Téléphone
                                            </label>
                                            <div className="relative">
                                                <Phone className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="tel"
                                                    value={data.contact_phone}
                                                    onChange={(e) =>
                                                        setData(
                                                            'contact_phone',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full rounded-xl border py-3 pr-4 pl-10 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-sm font-medium">
                                                Devise par défaut
                                            </label>
                                            <select
                                                value={data.currency}
                                                onChange={(e) =>
                                                    setData(
                                                        'currency',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-xl border py-3 pr-10 pl-4 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            >
                                                {currencies?.map((c) => (
                                                    <option
                                                        key={c.code}
                                                        value={c.code}
                                                    >
                                                        {c.symbol} {c.code}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-sm font-medium">
                                                Langue par défaut
                                            </label>
                                            <select
                                                value={data.language}
                                                onChange={(e) =>
                                                    setData(
                                                        'language',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-xl border py-3 pr-10 pl-4 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            >
                                                {languages?.map((l) => (
                                                    <option
                                                        key={l.code}
                                                        value={l.code}
                                                    >
                                                        {l.flag} {l.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="mb-2 block text-sm font-medium">
                                                Description
                                            </label>
                                            <textarea
                                                value={data.shop_description}
                                                onChange={(e) =>
                                                    setData(
                                                        'shop_description',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-xl border p-4 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                rows={4}
                                                maxLength={500}
                                            />
                                        </div>
                                        <div className="flex justify-between sm:col-span-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setCurrentStep(1)
                                                }
                                                className="rounded-xl px-6 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-100"
                                            >
                                                <ArrowLeft className="mr-2 h-4 w-4" />{' '}
                                                Retour
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    isStepValid(2) &&
                                                    setCurrentStep(3)
                                                }
                                                disabled={!isStepValid(2)}
                                                className={`rounded-xl px-6 py-3 text-sm font-semibold ${isStepValid(2) ? 'bg-amber-600 text-white hover:bg-amber-700' : 'cursor-not-allowed bg-gray-200 text-gray-400'}`}
                                            >
                                                Continuer{' '}
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Step 3: Legal Documents - NEW */}
                        <AnimatePresence mode="wait">
                            {currentStep === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="rounded-2xl border bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800/80"
                                >
                                    <h2 className="flex items-center gap-3 text-lg font-semibold">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white">
                                            3
                                        </span>{' '}
                                        Documents légaux
                                    </h2>
                                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                        Ces documents sont requis pour vérifier
                                        votre identité et votre entreprise.
                                    </p>

                                    <div className="mt-6 space-y-8">
                                        {requiredDocuments.map((doc) => (
                                            <div
                                                key={doc.id}
                                                className="rounded-xl border border-amber-200 bg-amber-50/50 p-5 dark:border-amber-800 dark:bg-amber-900/20"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <FileCheck className="mt-0.5 h-5 w-5 text-amber-600" />
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-gray-900 dark:text-white">
                                                            {doc.nom}{' '}
                                                            <span className="text-red-500">
                                                                *
                                                            </span>
                                                        </h4>
                                                        {doc.description && (
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                {
                                                                    doc.description
                                                                }
                                                            </p>
                                                        )}
                                                        <div className="mt-4 grid gap-4 sm:grid-cols-3">
                                                            <input
                                                                type="text"
                                                                placeholder="Numéro du document"
                                                                value={
                                                                    data
                                                                        .legal_documents[
                                                                        doc.code
                                                                    ]?.numero ||
                                                                    ''
                                                                }
                                                                onChange={(e) =>
                                                                    setData(
                                                                        'legal_documents',
                                                                        {
                                                                            ...data.legal_documents,
                                                                            [doc.code]:
                                                                                {
                                                                                    ...data
                                                                                        .legal_documents[
                                                                                        doc
                                                                                            .code
                                                                                    ],
                                                                                    numero: e
                                                                                        .target
                                                                                        .value,
                                                                                },
                                                                        },
                                                                    )
                                                                }
                                                                className="rounded-lg border px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                            />
                                                            <input
                                                                type="date"
                                                                value={
                                                                    data
                                                                        .legal_documents[
                                                                        doc.code
                                                                    ]
                                                                        ?.date_delivrance ||
                                                                    ''
                                                                }
                                                                onChange={(e) =>
                                                                    setData(
                                                                        'legal_documents',
                                                                        {
                                                                            ...data.legal_documents,
                                                                            [doc.code]:
                                                                                {
                                                                                    ...data
                                                                                        .legal_documents[
                                                                                        doc
                                                                                            .code
                                                                                    ],
                                                                                    date_delivrance:
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                },
                                                                        },
                                                                    )
                                                                }
                                                                className="rounded-lg border px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                            />
                                                            <input
                                                                type="date"
                                                                value={
                                                                    data
                                                                        .legal_documents[
                                                                        doc.code
                                                                    ]
                                                                        ?.date_expiration ||
                                                                    ''
                                                                }
                                                                onChange={(e) =>
                                                                    setData(
                                                                        'legal_documents',
                                                                        {
                                                                            ...data.legal_documents,
                                                                            [doc.code]:
                                                                                {
                                                                                    ...data
                                                                                        .legal_documents[
                                                                                        doc
                                                                                            .code
                                                                                    ],
                                                                                    date_expiration:
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                },
                                                                        },
                                                                    )
                                                                }
                                                                className="rounded-lg border px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {optionalDocuments.length > 0 && (
                                            <div className="mt-6">
                                                <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                    Documents facultatifs
                                                </h3>
                                                {optionalDocuments.map(
                                                    (doc) => (
                                                        <div
                                                            key={doc.id}
                                                            className="mb-3 rounded-xl border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-800/50"
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                <FileText className="mt-0.5 h-5 w-5 text-gray-400" />
                                                                <div className="flex-1">
                                                                    <h4 className="font-medium text-gray-900 dark:text-white">
                                                                        {
                                                                            doc.nom
                                                                        }
                                                                    </h4>
                                                                    {doc.description && (
                                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                            {
                                                                                doc.description
                                                                            }
                                                                        </p>
                                                                    )}
                                                                    <div className="mt-3 grid gap-4 sm:grid-cols-3">
                                                                        <input
                                                                            type="text"
                                                                            placeholder="Numéro (optionnel)"
                                                                            value={
                                                                                data
                                                                                    .legal_documents[
                                                                                    doc
                                                                                        .code
                                                                                ]
                                                                                    ?.numero ||
                                                                                ''
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                setData(
                                                                                    'legal_documents',
                                                                                    {
                                                                                        ...data.legal_documents,
                                                                                        [doc.code]:
                                                                                            {
                                                                                                ...data
                                                                                                    .legal_documents[
                                                                                                    doc
                                                                                                        .code
                                                                                                ],
                                                                                                numero: e
                                                                                                    .target
                                                                                                    .value,
                                                                                            },
                                                                                    },
                                                                                )
                                                                            }
                                                                            className="rounded-lg border px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                                        />
                                                                        <input
                                                                            type="date"
                                                                            value={
                                                                                data
                                                                                    .legal_documents[
                                                                                    doc
                                                                                        .code
                                                                                ]
                                                                                    ?.date_delivrance ||
                                                                                ''
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                setData(
                                                                                    'legal_documents',
                                                                                    {
                                                                                        ...data.legal_documents,
                                                                                        [doc.code]:
                                                                                            {
                                                                                                ...data
                                                                                                    .legal_documents[
                                                                                                    doc
                                                                                                        .code
                                                                                                ],
                                                                                                date_delivrance:
                                                                                                    e
                                                                                                        .target
                                                                                                        .value,
                                                                                            },
                                                                                    },
                                                                                )
                                                                            }
                                                                            className="rounded-lg border px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                                        />
                                                                        <input
                                                                            type="date"
                                                                            value={
                                                                                data
                                                                                    .legal_documents[
                                                                                    doc
                                                                                        .code
                                                                                ]
                                                                                    ?.date_expiration ||
                                                                                ''
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                setData(
                                                                                    'legal_documents',
                                                                                    {
                                                                                        ...data.legal_documents,
                                                                                        [doc.code]:
                                                                                            {
                                                                                                ...data
                                                                                                    .legal_documents[
                                                                                                    doc
                                                                                                        .code
                                                                                                ],
                                                                                                date_expiration:
                                                                                                    e
                                                                                                        .target
                                                                                                        .value,
                                                                                            },
                                                                                    },
                                                                                )
                                                                            }
                                                                            className="rounded-lg border px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-6 flex justify-between">
                                        <button
                                            type="button"
                                            onClick={() => setCurrentStep(2)}
                                            className="rounded-xl px-6 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-100"
                                        >
                                            <ArrowLeft className="mr-2 h-4 w-4" />{' '}
                                            Retour
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                isStepValid(3) &&
                                                setCurrentStep(4)
                                            }
                                            disabled={!isStepValid(3)}
                                            className={`rounded-xl px-6 py-3 text-sm font-semibold ${isStepValid(3) ? 'bg-amber-600 text-white hover:bg-amber-700' : 'cursor-not-allowed bg-gray-200 text-gray-400'}`}
                                        >
                                            Continuer{' '}
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Step 4: Appearance - identical */}
                        <AnimatePresence mode="wait">
                            {currentStep === 4 && (
                                <motion.div
                                    key="step4"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="rounded-2xl border bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800/80"
                                >
                                    <h2 className="flex items-center gap-3 text-lg font-semibold">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white">
                                            4
                                        </span>{' '}
                                        Apparence & réseaux sociaux
                                    </h2>
                                    <div className="mt-6 grid gap-6 sm:grid-cols-2">
                                        {/* Logo upload + social links - identical to original step 3 */}
                                        <div className="sm:col-span-2">
                                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Logo de votre boutique
                                            </label>
                                            <div className="flex items-center gap-6">
                                                <div className="relative h-24 w-24 overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-amber-400 dark:border-gray-600 dark:bg-gray-700">
                                                    {logoPreview ? (
                                                        <img
                                                            src={logoPreview}
                                                            alt="Logo preview"
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
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    <p className="font-medium">
                                                        Taille recommandée : 500
                                                        × 500 px
                                                    </p>
                                                    <p>
                                                        PNG, JPG ou WebP. Max 2
                                                        Mo.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        {[
                                            'facebook_url',
                                            'instagram_url',
                                            'twitter_url',
                                            'youtube_url',
                                            'tiktok_url',
                                        ].map((field) => (
                                            <div key={field}>
                                                <label className="mb-2 flex items-center gap-1 text-sm font-medium capitalize">
                                                    <FaFacebook className="h-4 w-4" />{' '}
                                                    {field.replace('_url', '')}
                                                </label>
                                                <input
                                                    type="url"
                                                    value={data[field]}
                                                    onChange={(e) =>
                                                        setData(
                                                            field,
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full rounded-xl border px-4 py-3 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                                />
                                            </div>
                                        ))}
                                        <div className="flex justify-between sm:col-span-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setCurrentStep(3)
                                                }
                                                className="rounded-xl px-6 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-100"
                                            >
                                                <ArrowLeft className="mr-2 h-4 w-4" />{' '}
                                                Retour
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setCurrentStep(5)
                                                }
                                                className="rounded-xl bg-amber-600 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-700"
                                            >
                                                Continuer{' '}
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Step 5: Validation - identical */}
                        <AnimatePresence mode="wait">
                            {currentStep === 5 && (
                                <motion.div
                                    key="step5"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="rounded-2xl border bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800/80"
                                >
                                    <h2 className="flex items-center gap-3 text-lg font-semibold">
                                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white">
                                            5
                                        </span>{' '}
                                        Récapitulatif & validation
                                    </h2>
                                    <div className="mt-6 space-y-6">
                                        {/* Summary */}
                                        <div className="rounded-xl border bg-linear-to-br from-gray-50 to-white p-6 dark:border-gray-700 dark:from-gray-900 dark:to-gray-800">
                                            <h3 className="mb-4 text-sm font-semibold text-gray-500 uppercase">
                                                Résumé de votre boutique
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
                                                        languages?.find(
                                                            (l) =>
                                                                l.code ===
                                                                data.language,
                                                        )?.name ||
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
                                        {/* Terms */}
                                        <div className="flex items-start gap-3 rounded-xl border p-4 dark:border-gray-700">
                                            <input
                                                type="checkbox"
                                                checked={data.accept_terms}
                                                onChange={(e) =>
                                                    setData(
                                                        'accept_terms',
                                                        e.target.checked,
                                                    )
                                                }
                                                className="mt-1 h-5 w-5 rounded border-gray-300 text-amber-600"
                                                id="terms"
                                            />
                                            <label
                                                htmlFor="terms"
                                                className="text-sm text-gray-600 dark:text-gray-300"
                                            >
                                                J'accepte les{' '}
                                                <Link
                                                    href="/conditions"
                                                    className="font-medium text-amber-600 underline"
                                                    target="_blank"
                                                >
                                                    conditions générales
                                                </Link>{' '}
                                                et la{' '}
                                                <Link
                                                    href="/confidentialite"
                                                    className="font-medium text-amber-600 underline"
                                                    target="_blank"
                                                >
                                                    politique de confidentialité
                                                </Link>
                                                .
                                            </label>
                                        </div>
                                        {errors.accept_terms && (
                                            <p className="flex items-center gap-1 text-sm text-red-500">
                                                <AlertCircle className="h-4 w-4" />{' '}
                                                {errors.accept_terms}
                                            </p>
                                        )}
                                        {/* Security */}
                                        <div className="flex items-center justify-center gap-4 rounded-xl bg-green-50 p-4 dark:bg-green-900/20">
                                            <ShieldCheck className="h-5 w-5 text-green-600" />
                                            <span className="text-sm font-medium text-green-700 dark:text-green-300">
                                                Vos données sont protégées et
                                                cryptées.
                                            </span>
                                        </div>
                                        {/* Submit */}
                                        <div className="flex justify-center pt-4">
                                            <motion.button
                                                type="submit"
                                                disabled={
                                                    processing ||
                                                    !isStepValid(5)
                                                }
                                                whileHover={
                                                    isStepValid(5)
                                                        ? { scale: 1.03 }
                                                        : {}
                                                }
                                                whileTap={
                                                    isStepValid(5)
                                                        ? { scale: 0.97 }
                                                        : {}
                                                }
                                                className={`inline-flex items-center gap-3 rounded-2xl px-12 py-4 text-lg font-bold transition-all duration-300 ${
                                                    processing
                                                        ? 'cursor-wait bg-amber-400 text-white'
                                                        : isStepValid(5)
                                                          ? 'bg-linear-to-r from-amber-600 to-amber-700 text-white shadow-xl hover:from-amber-700 hover:to-amber-800'
                                                          : 'cursor-not-allowed bg-gray-200 text-gray-400'
                                                }`}
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
                                            </motion.button>
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
