// import { Input, Button } from "@base-ui/react";
// import { Textarea } from "@headlessui/react";
// import { SelectTrigger, SelectValue, SelectContent, SelectItem } from "@radix-ui/react-select";
// import { BadgeDollarSign, Loader2 } from "lucide-react";
// import { Label, Select } from "radix-ui";
// import InputError from "@/components/input-error";
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
// import { cn } from "@/lib/utils";

// {/* Formulaire d'offre */}
// <Card className="overflow-hidden border-slate-200 bg-white/80 shadow-lg backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
//     <CardHeader>
//         <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
//             <BadgeDollarSign className="h-5 w-5 text-teal-500" />
//             Faire une offre
//         </CardTitle>
//         <CardDescription>
//             Proposez un prix pour ce bien.
//         </CardDescription>
//     </CardHeader>
//     <CardContent>
//         <form onSubmit={submitOffer} className="space-y-5">
//             {/* Type d'offre */}
//             <div className="space-y-2">
//                 <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                     Type <span className="text-red-400">*</span>
//                 </Label>
//                 <Select
//                     value={offerForm.data.type}
//                     onValueChange={(value) => offerForm.setData('type', value)}
//                 >
//                     <SelectTrigger
//                         className={cn(
//                             'h-11 w-full rounded-xl border px-3 text-sm font-medium transition-all duration-200',
//                             'border-slate-200 bg-white/80 text-slate-700 shadow-sm backdrop-blur',
//                             'hover:border-teal-300 hover:bg-white',
//                             'focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20',
//                             'dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300',
//                             'dark:hover:border-teal-700 dark:hover:bg-slate-900',
//                             'dark:focus:border-teal-400 dark:focus:ring-teal-400/20',
//                             offerForm.errors.type
//                                 ? 'border-red-400 focus:border-red-500 dark:border-red-500'
//                                 : '',
//                         )}
//                     >
//                         <SelectValue placeholder="Choisir le type" />
//                     </SelectTrigger>
//                     <SelectContent
//                         position="popper"
//                         side="bottom"
//                         align="start"
//                         sideOffset={8}
//                         className={cn(
//                             'rounded-xl border border-slate-200/80 bg-white/95 p-1 shadow-lg backdrop-blur-xl',
//                             'dark:border-slate-800/80 dark:bg-slate-950/95',
//                         )}
//                     >
//                         <SelectItem
//                             value="purchase"
//                             className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-teal-50 hover:text-teal-700 dark:text-slate-300 dark:hover:bg-teal-900/30 dark:hover:text-teal-400"
//                         >
//                             Achat
//                         </SelectItem>
//                         <SelectItem
//                             value="rent"
//                             className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-teal-50 hover:text-teal-700 dark:text-slate-300 dark:hover:bg-teal-900/30 dark:hover:text-teal-400"
//                         >
//                             Location
//                         </SelectItem>
//                     </SelectContent>
//                 </Select>
//                 <InputError message={offerForm.errors.type} />
//             </div>

//             {/* Devise */}
//             <div className="space-y-2">
//                 <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                     Devise
//                 </Label>
//                 <Select
//                     value={offerForm.data.currency}
//                     onValueChange={(value) => offerForm.setData('currency', value)}
//                 >
//                     <SelectTrigger
//                         className={cn(
//                             'h-11 w-full rounded-xl border px-3 text-sm font-medium transition-all duration-200',
//                             'border-slate-200 bg-white/80 text-slate-700 shadow-sm backdrop-blur',
//                             'hover:border-teal-300 hover:bg-white',
//                             'focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20',
//                             'dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300',
//                             'dark:hover:border-teal-700 dark:hover:bg-slate-900',
//                             'dark:focus:border-teal-400 dark:focus:ring-teal-400/20',
//                             offerForm.errors.currency
//                                 ? 'border-red-400 focus:border-red-500 dark:border-red-500'
//                                 : '',
//                         )}
//                     >
//                         <SelectValue placeholder="Choisir la devise" />
//                     </SelectTrigger>
//                     <SelectContent
//                         position="popper"
//                         side="bottom"
//                         align="start"
//                         sideOffset={8}
//                         className={cn(
//                             'rounded-xl border border-slate-200/80 bg-white/95 p-1 shadow-lg backdrop-blur-xl',
//                             'dark:border-slate-800/80 dark:bg-slate-950/95',
//                         )}
//                     >
//                         <SelectItem
//                             value="USD"
//                             className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-teal-50 hover:text-teal-700 dark:text-slate-300 dark:hover:bg-teal-900/30 dark:hover:text-teal-400"
//                         >
//                             USD
//                         </SelectItem>
//                         <SelectItem
//                             value="CDF"
//                             className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-teal-50 hover:text-teal-700 dark:text-slate-300 dark:hover:bg-teal-900/30 dark:hover:text-teal-400"
//                         >
//                             CDF
//                         </SelectItem>
//                         <SelectItem
//                             value="EUR"
//                             className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-teal-50 hover:text-teal-700 dark:text-slate-300 dark:hover:bg-teal-900/30 dark:hover:text-teal-400"
//                         >
//                             EUR
//                         </SelectItem>
//                     </SelectContent>
//                 </Select>
//                 <InputError message={offerForm.errors.currency} />
//             </div>

//             {/* Montant */}
//             <div className="space-y-2">
//                 <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                     Montant <span className="text-red-400">*</span>
//                 </Label>
//                 <Input
//                     type="number"
//                     placeholder="Ex: 150000"
//                     value={offerForm.data.amount}
//                     onChange={(e) => offerForm.setData('amount', e.target.value)}
//                     className={cn(
//                         'h-11 w-full rounded-xl border px-3 text-sm font-medium transition-all duration-200',
//                         'border-slate-200 bg-white/80 text-slate-700 shadow-sm backdrop-blur',
//                         'hover:border-teal-300 hover:bg-white',
//                         'focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20',
//                         'dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300',
//                         'dark:hover:border-teal-700 dark:hover:bg-slate-900',
//                         'dark:focus:border-teal-400 dark:focus:ring-teal-400/20',
//                         offerForm.errors.amount
//                             ? 'border-red-400 focus:border-red-500 dark:border-red-500'
//                             : '',
//                     )}
//                     required
//                 />
//                 <InputError message={offerForm.errors.amount} />
//             </div>

//             {/* Message optionnel */}
//             <div className="space-y-2">
//                 <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
//                     Message
//                 </Label>
//                 <Textarea
//                     rows={3}
//                     placeholder="Ajoutez un message..."
//                     value={offerForm.data.message}
//                     onChange={(e) => offerForm.setData('message', e.target.value)}
//                     className={cn(
//                         'w-full rounded-xl border px-3 py-2 text-sm font-medium transition-all duration-200',
//                         'border-slate-200 bg-white/80 text-slate-700 shadow-sm backdrop-blur',
//                         'hover:border-teal-300 hover:bg-white',
//                         'focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20',
//                         'dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300',
//                         'dark:hover:border-teal-700 dark:hover:bg-slate-900',
//                         'dark:focus:border-teal-400 dark:focus:ring-teal-400/20',
//                         offerForm.errors.message
//                             ? 'border-red-400 focus:border-red-500 dark:border-red-500'
//                             : '',
//                     )}
//                 />
//                 <InputError message={offerForm.errors.message} />
//             </div>

//             <Button
//                 type="submit"
//                 className="h-11 w-full rounded-xl bg-teal-600 text-sm font-semibold text-white shadow-md shadow-teal-200 transition-all hover:bg-teal-700 hover:shadow-lg hover:shadow-teal-300 dark:bg-teal-500 dark:shadow-teal-900/30 dark:hover:bg-teal-600 dark:hover:shadow-teal-800/40"
//                 disabled={offerForm.processing}
//             >
//                 {offerForm.processing ? (
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 ) : null}
//                 Envoyer l'offre
//             </Button>
//         </form>
//     </CardContent>
// </Card>
