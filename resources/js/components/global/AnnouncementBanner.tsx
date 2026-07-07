/* eslint-disable react-hooks/set-state-in-effect */
 
import { usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowRight,
  Bell,
  Info,
  Megaphone,
  PartyPopper,
  Sparkles,
  X,
} from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface Announcement {
  id: string;
  type: 'info' | 'success' | 'warning' | 'danger' | 'promo' | 'feature';
  title: string;
  message: string;
  action_url: string | null;
  action_text: string | null;
  target_audience?: 'all' | 'buyers' | 'vendors';
  starts_at?: string | null;
  ends_at?: string | null;
  is_active?: boolean;
}

interface AnnouncementBannerProps {
  /** Public cible : 'buyers' (défaut) ou 'vendors' */
  audience?: 'all' | 'buyers' | 'vendors';
  /** Nombre maximum d'annonces affichées (défaut: 3) */
  maxDisplay?: number;
}

// Styles modernes sans ombre – fonds transparents, bordures fines
const typeConfig = {
  info: {
    icon: Info,
    container: 'bg-slate-50/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100',
    iconContainer: 'bg-slate-200/60 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300',
    button: 'bg-slate-200/60 hover:bg-slate-300/60 dark:bg-slate-700/60 dark:hover:bg-slate-600/60 text-slate-900 dark:text-slate-100',
  },
  success: {
    icon: Megaphone,
    container: 'bg-emerald-50/80 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100',
    iconContainer: 'bg-emerald-100/60 dark:bg-emerald-800/40 text-emerald-700 dark:text-emerald-300',
    button: 'bg-emerald-100/60 hover:bg-emerald-200/60 dark:bg-emerald-800/40 dark:hover:bg-emerald-700/40 text-emerald-700 dark:text-emerald-100',
  },
  warning: {
    icon: Bell,
    container: 'bg-amber-50/80 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100',
    iconContainer: 'bg-amber-100/60 dark:bg-amber-800/40 text-amber-700 dark:text-amber-300',
    button: 'bg-amber-100/60 hover:bg-amber-200/60 dark:bg-amber-800/40 dark:hover:bg-amber-700/40 text-amber-700 dark:text-amber-100',
  },
  danger: {
    icon: AlertCircle,
    container: 'bg-red-50/80 dark:bg-red-950/60 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100',
    iconContainer: 'bg-red-100/60 dark:bg-red-800/40 text-red-700 dark:text-red-300',
    button: 'bg-red-100/60 hover:bg-red-200/60 dark:bg-red-800/40 dark:hover:bg-red-700/40 text-red-700 dark:text-red-100',
  },
  promo: {
    icon: PartyPopper,
    container: 'bg-gradient-to-r from-violet-50/80 via-fuchsia-50/80 to-orange-50/80 dark:from-violet-950/60 dark:via-fuchsia-950/60 dark:to-orange-950/60 border-violet-200 dark:border-violet-800 text-violet-900 dark:text-violet-100',
    iconContainer: 'bg-violet-100/60 dark:bg-violet-800/40 text-violet-700 dark:text-violet-300',
    button: 'bg-violet-100/60 hover:bg-violet-200/60 dark:bg-violet-800/40 dark:hover:bg-violet-700/40 text-violet-700 dark:text-violet-100',
  },
  feature: {
    icon: Sparkles,
    container: 'bg-blue-50/80 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100',
    iconContainer: 'bg-blue-100/60 dark:bg-blue-800/40 text-blue-700 dark:text-blue-300',
    button: 'bg-blue-100/60 hover:bg-blue-200/60 dark:bg-blue-800/40 dark:hover:bg-blue-700/40 text-blue-700 dark:text-blue-100',
  },
};

export function AnnouncementBanner({
  audience = 'buyers',
  maxDisplay = 3,
}: AnnouncementBannerProps) {
  const { announcements } = usePage().props as unknown as {
    announcements: Announcement[];
  };
  const [visibleAnnouncements, setVisibleAnnouncements] = useState<Announcement[]>([]);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!announcements) {
return;
}

    // Filtrer par audience
    const filtered = announcements.filter(
      (a) => a.target_audience === 'all' || a.target_audience === audience
    );

    // Exclure celles déjà rejetées
    const dismissedIds = JSON.parse(
      localStorage.getItem(`dismissed_announcements_${audience}`) || '[]'
    );
    const active = filtered.filter((a) => !dismissedIds.includes(a.id));

    // Trier par date de début (les plus récentes d'abord)
    const sorted = active.sort((a, b) => {
      const aStart = a.starts_at ? new Date(a.starts_at).getTime() : 0;
      const bStart = b.starts_at ? new Date(b.starts_at).getTime() : 0;

      return bStart - aStart;
    });

    setVisibleAnnouncements(sorted.slice(0, maxDisplay));
  }, [announcements, audience, maxDisplay]);

  // Ajuster le padding du body pour éviter le chevauchement
  useEffect(() => {
    const updateBodyPadding = () => {
      if (bannerRef.current && visibleAnnouncements.length > 0) {
        const height = bannerRef.current.getBoundingClientRect().height;
        document.body.style.paddingTop = `${height}px`;
      } else {
        document.body.style.paddingTop = '0px';
      }
    };

    updateBodyPadding();
    window.addEventListener('resize', updateBodyPadding);

    let observer: ResizeObserver | null = null;

    if (bannerRef.current) {
      observer = new ResizeObserver(updateBodyPadding);
      observer.observe(bannerRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateBodyPadding);

      if (observer) {
observer.disconnect();
}

      document.body.style.paddingTop = '0px';
    };
  }, [visibleAnnouncements]);

  const handleDismiss = (id: string) => {
    const key = `dismissed_announcements_${audience}`;
    const dismissedIds = JSON.parse(localStorage.getItem(key) || '[]');

    if (!dismissedIds.includes(id)) {
      dismissedIds.push(id);
      localStorage.setItem(key, JSON.stringify(dismissedIds));
    }

    setVisibleAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  if (!visibleAnnouncements || visibleAnnouncements.length === 0) {
    return null;
  }

  return (
    <div
      ref={bannerRef}
      className="fixed top-0 left-0 w-full flex flex-col gap-px z-9999 bg-white/10 backdrop-blur-sm"
      style={{ backdropFilter: 'blur(6px)' }}
    >
      <AnimatePresence mode="popLayout">
        {visibleAnnouncements.map((announcement, index) => {
          const config = typeConfig[announcement.type] || typeConfig.info;
          const Icon = config.icon;

          return (
            <motion.div
              key={announcement.id}
              layout
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <div
                className={cn(
                  'group relative flex items-center gap-x-3 border-b border-t-0 px-4 py-2.5 sm:px-6 md:py-2',
                  config.container,
                  index === 0 && 'border-t'
                )}
              >
                {/* Effet de survol subtil */}
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="flex flex-1 items-center gap-x-3 min-w-0">
                  <div
                    className={cn(
                      'flex h-7 w-7 flex-none items-center justify-center rounded-full',
                      config.iconContainer
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-x-2 gap-y-0.5 min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate leading-tight">
                      {announcement.title}
                    </p>
                    <p className="text-xs opacity-80 truncate hidden sm:block">
                      <span className="hidden sm:inline mx-1 opacity-40">&bull;</span>
                      {announcement.message}
                    </p>
                    <p className="text-xs opacity-80 sm:hidden line-clamp-1">
                      {announcement.message}
                    </p>
                  </div>
                </div>

                <div className="flex flex-none items-center gap-x-3">
                  {announcement.action_url && (
                    <Button
                      asChild
                      size="sm"
                      className={cn(
                        'rounded-full h-7 px-3 text-[11px] font-medium transition-all hover:scale-105',
                        config.button
                      )}
                    >
                      <a href={announcement.action_url}>
                        {announcement.action_text || 'En savoir plus'}
                        <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                      </a>
                    </Button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDismiss(announcement.id)}
                    className="flex flex-none items-center justify-center rounded-full p-1 hover:bg-black/5 dark:hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    aria-label="Fermer"
                  >
                    <X className="h-3.5 w-3.5 opacity-60" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}