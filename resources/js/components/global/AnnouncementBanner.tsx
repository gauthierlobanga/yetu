import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ArrowRight, Bell, Info, Megaphone, PartyPopper, Sparkles, X } from 'lucide-react';
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
}

export function AnnouncementBanner() {
    const { announcements } = usePage().props as unknown as {
        announcements: Announcement[];
    };
    const [visibleAnnouncements, setVisibleAnnouncements] = useState<Announcement[]>([]);

    const bannerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!announcements) return;

        const dismissedIds = JSON.parse(localStorage.getItem('dismissed_announcements') || '[]');
        const activeAnnouncements = announcements.filter(
            (a) => !dismissedIds.includes(a.id)
        );

        setVisibleAnnouncements(activeAnnouncements.slice(0, 3));
    }, [announcements]);

    useEffect(() => {
        const updateBodyPadding = () => {
            if (bannerRef.current && visibleAnnouncements.length > 0) {
                const height = bannerRef.current.getBoundingClientRect().height;
                document.body.style.paddingTop = `${height}px`;
            } else {
                document.body.style.paddingTop = '0px';
            }
        };

        // Update on mount/visible change
        updateBodyPadding();

        // Update on window resize
        window.addEventListener('resize', updateBodyPadding);
        
        // Setup ResizeObserver for the banner itself (in case of animations/content changes)
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
        const dismissedIds = JSON.parse(localStorage.getItem('dismissed_announcements') || '[]');
        if (!dismissedIds.includes(id)) {
            dismissedIds.push(id);
            localStorage.setItem('dismissed_announcements', JSON.stringify(dismissedIds));
        }

        setVisibleAnnouncements((prev) => prev.filter((a) => a.id !== id));
    };

    if (!visibleAnnouncements || visibleAnnouncements.length === 0) {
        return null;
    }

    const getTheme = (type: Announcement['type']) => {
        switch (type) {
            case 'danger':
                return {
                    container: 'bg-red-500 border-red-600 text-white',
                    iconContainer: 'bg-white/20 text-white',
                    icon: <AlertCircle className="size-4" />,
                    button: 'bg-white text-red-600 hover:bg-red-50',
                };
            case 'warning':
                return {
                    container: 'bg-amber-500 border-amber-600 text-white',
                    iconContainer: 'bg-white/20 text-white',
                    icon: <Bell className="size-4" />,
                    button: 'bg-white text-amber-600 hover:bg-amber-50',
                };
            case 'promo':
                return {
                    container: 'bg-linear-to-r from-violet-600 via-fuchsia-600 to-orange-600 border-fuchsia-700 text-white',
                    iconContainer: 'bg-white/20 text-white',
                    icon: <PartyPopper className="size-4" />,
                    button: 'bg-white text-fuchsia-600 hover:bg-fuchsia-50',
                };
            case 'success':
                return {
                    container: 'bg-emerald-600 border-emerald-700 text-white',
                    iconContainer: 'bg-white/20 text-white',
                    icon: <Megaphone className="size-4" />,
                    button: 'bg-white text-emerald-600 hover:bg-emerald-50',
                };
            case 'feature':
                return {
                    container: 'bg-blue-600 border-blue-700 text-white',
                    iconContainer: 'bg-white/20 text-white',
                    icon: <Sparkles className="size-4" />,
                    button: 'bg-white text-blue-600 hover:bg-blue-50',
                };
            case 'info':
            default:
                return {
                    container: 'bg-slate-800 border-slate-900 text-white dark:bg-slate-100 dark:border-slate-200 dark:text-slate-900',
                    iconContainer: 'bg-white/20 dark:bg-black/10',
                    icon: <Info className="size-4" />,
                    button: 'bg-white text-slate-800 hover:bg-slate-100 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800',
                };
        }
    };

    return (
        <div ref={bannerRef} className="fixed top-0 left-0 w-full flex flex-col gap-0 z-[9999] shadow-md">
            <AnimatePresence>
                {visibleAnnouncements.map((announcement) => {
                    const theme = getTheme(announcement.type);
                    return (
                        <motion.div
                            key={announcement.id}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <div
                                className={cn(
                                    'group relative flex items-center gap-x-4 border-b px-4 py-3 sm:px-6 lg:px-8',
                                    theme.container
                                )}
                            >
                                <div className="flex flex-1 items-center gap-x-3 min-w-0">
                                    <div className={cn("flex h-8 w-8 flex-none items-center justify-center rounded-full", theme.iconContainer)}>
                                        {theme.icon}
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-x-2 gap-y-1 min-w-0 flex-1">
                                        <p className="text-sm font-semibold truncate">
                                            {announcement.title}
                                        </p>
                                        <p className="text-sm opacity-90 truncate hidden sm:block">
                                            <span className="hidden sm:inline mx-1 opacity-50">&bull;</span>
                                            {announcement.message}
                                        </p>
                                        <p className="text-xs opacity-90 sm:hidden line-clamp-2">
                                            {announcement.message}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-none items-center gap-x-4">
                                    {announcement.action_url && (
                                        <Button 
                                            asChild 
                                            size="sm" 
                                            className={cn("rounded-full h-8 px-4 text-xs font-semibold shadow-xs hidden sm:flex", theme.button)}
                                        >
                                            <a href={announcement.action_url}>
                                                {announcement.action_text || 'En savoir plus'}
                                                <ArrowRight className="ml-1.5 size-3" />
                                            </a>
                                        </Button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => handleDismiss(announcement.id)}
                                        className="flex flex-none items-center justify-center rounded-full p-1.5 hover:bg-black/5 dark:hover:bg-white/10 transition-colors focus:outline-hidden"
                                    >
                                        <span className="sr-only">Fermer</span>
                                        <X className="h-4 w-4 opacity-70" aria-hidden="true" />
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

function SparklesIcon(props: React.ComponentProps<'svg'>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
        </svg>
    );
}
