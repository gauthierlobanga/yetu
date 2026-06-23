import { Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { NavItem } from '@/types';

type Props = {
    items: NavItem[];
    topClass?: string;
};

export function MainNavigation({ items, topClass }: Props) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearTimer = () => {
        if (closeTimeout.current) {
            clearTimeout(closeTimeout.current);
            closeTimeout.current = null;
        }
    };

    const handleMouseEnter = (index: number) => {
        clearTimer();
        setOpenIndex(index);
    };

    const handleMouseLeave = () => {
        closeTimeout.current = setTimeout(() => {
            setOpenIndex(null);
        }, 100);
    };

    useEffect(() => {
        return () => clearTimer();
    }, []);

    return (
        <nav className="flex h-full items-center gap-10">
            {items.map((item, index) => (
                <div
                    key={index}
                    className="relative flex h-full items-center"
                    onMouseEnter={() => item.content && handleMouseEnter(index)}
                    onMouseLeave={() => item.content && handleMouseLeave()}
                >
                    {item.content ? (
                        <>
                            <button
                                className={`inline-flex items-center gap-1.5 text-[1.0rem] font-medium transition-colors duration-200 focus:outline-none ${
                                    openIndex === index
                                        ? 'text-foreground'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                {item.title}
                                <ChevronDown
                                    className={`h-4 w-4 transition-transform duration-200 ${
                                        openIndex === index ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>

                            <AnimatePresence>
                                {openIndex === index && (
                                    <>
                                        <div className="absolute top-full h-5 w-full" />
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ 
                                                height: 0, 
                                                opacity: 0,
                                                transition: { 
                                                    height: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                                                    opacity: { duration: 0.3, delay: 0.05 } 
                                                }
                                            }}
                                            transition={{
                                                duration: 0.4,
                                                ease: [0.16, 1, 0.3, 1],
                                            }}
                                            className={`fixed left-0 w-full overflow-hidden border-b border-border/40 bg-background shadow-xs backdrop-blur-md ${topClass || 'top-16'}`}
                                            onMouseEnter={clearTimer}
                                        >
                                            <div className="mx-auto">
                                                {item.content}
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </>
                    ) : (
                        <Link
                            href={item.href || '#'}
                            className="text-[1.0rem] font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
                        >
                            {item.title}
                        </Link>
                    )}
                </div>
            ))}
        </nav>
    );
}
