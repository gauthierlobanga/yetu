import { Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useId, useState } from 'react';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types';

interface MobileNavigationProps {
    items: NavItem[];
}

export function MobileNavigation({ items }: MobileNavigationProps) {
    const id = useId();
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <nav className="flex flex-col p-4 space-y-1">
            {items.map((item, index) => {
                const href =
                    typeof item.href === 'string'
                        ? item.href
                        : (item.href as any)?.url || '#';

                const key = `${id}-${href.replace(/[^a-zA-Z0-9]/g, '-')}-${index}`;
                const hasContent = !!item.content;
                const isOpen = openIndex === index;

                return (
                    <div key={key} className="flex flex-col">
                        {hasContent ? (
                            <button
                                onClick={() => toggleAccordion(index)}
                                className={cn(
                                    'flex w-full items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                                    'hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white',
                                    isOpen && 'text-emerald-600 dark:text-emerald-400'
                                )}
                            >
                                <span className="flex items-center">
                                    {item.icon && <item.icon className="mr-3 h-4 w-4" />}
                                    {item.title}
                                </span>
                                <ChevronDown
                                    className={cn(
                                        'h-4 w-4 transition-transform duration-300',
                                        isOpen ? 'rotate-180' : ''
                                    )}
                                />
                            </button>
                        ) : (
                            <Link
                                href={href}
                                className={cn(
                                    'flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                                    'hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white',
                                    route().current(href + '*') &&
                                        'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white',
                                )}
                            >
                                {item.icon && <item.icon className="mr-3 h-4 w-4" />}
                                {item.title}
                            </Link>
                        )}

                        <AnimatePresence initial={false}>
                            {hasContent && isOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                    className="overflow-hidden"
                                >
                                    <div className="py-2">
                                        <div className="rounded-xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50">
                                            {/* Wrapper with a scale down transform to make desktop components fit better on mobile, but tailwind classes handle responsive naturally. 
                                                However, desktop components have their own backgrounds which might overlap. */}
                                            <div className="flex flex-col mobile-menu-wrapper">
                                                {item.content}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </nav>
    );
}
