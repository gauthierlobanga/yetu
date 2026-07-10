// resources/js/lib/notification-helpers.ts
import {
  Bell,
  CreditCard,
  Gift,
  Heart,
  Info,
  MessageCircle,
  Package,
  Star,
  Tag,
 Truck,
} from 'lucide-react';
import type {LucideIcon} from 'lucide-react';

export const ICON_MAP: Record<string, LucideIcon> = {
  order: Package,
  payment: CreditCard,
  success: CreditCard,
  message: MessageCircle,
  review: Star,
  promotion: Tag,
  loyalty: Gift,
  wishlist: Heart,
  error: Info,
 delivery_update: Truck,
  default: Bell,
};

export const COLOR_MAP: Record<string, string> = {
  order: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800',
  payment: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
  success: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
  promotion: 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800',
  loyalty: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800',
  wishlist: 'bg-pink-50 text-pink-600 border-pink-200 dark:bg-pink-950/40 dark:text-pink-400 dark:border-pink-800',
  error: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800',
  message: 'bg-cyan-50 text-cyan-600 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-400 dark:border-cyan-800',
  review: 'bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-950/40 dark:text-yellow-400 dark:border-yellow-800',
 delivery_update: 'bg-teal-50 text-teal-600 border-teal-200 dark:bg-teal-950/40 dark:text-teal-400 dark:border-teal-800',
  default: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
};

export const LABEL_MAP: Record<string, string> = {
  order: 'Commande',
  payment: 'Paiement',
  success: 'Succès',
  message: 'Message',
  review: 'Avis',
  promotion: 'Promotion',
  loyalty: 'Fidélité',
  wishlist: 'Liste de souhaits',
  error: 'Erreur',
 delivery_update: 'Livraison',
  default: 'Information',
};

export function getIconForType(type: string) {
  return ICON_MAP[type] || ICON_MAP.default;
}

export function getColorForType(type: string) {
  return COLOR_MAP[type] || COLOR_MAP.default;
}

export function getLabelForType(type: string) {
  return LABEL_MAP[type] || LABEL_MAP.default;
}
