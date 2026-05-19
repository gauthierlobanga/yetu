// import { Moon, Sun } from 'lucide-react';
// import type { HTMLAttributes } from 'react';
// import { useAppearance } from '@/hooks/use-appearance';
// import { cn } from '@/lib/utils';

// interface AppearanceToggleProps extends HTMLAttributes<HTMLButtonElement> {
//     className?: string;
// }

// export default function AppearanceToggle({
//     className = '',
//     ...props
// }: AppearanceToggleProps) {
//     const { appearance, updateAppearance } = useAppearance();

//     const isDark = appearance === 'dark';

//     const toggleAppearance = () => {
//         updateAppearance(isDark ? 'light' : 'dark');
//     };

//     return (
//         <button
//             onClick={toggleAppearance}
//             className={cn(
//                 'relative inline-flex h-7 w-15 cursor-pointer items-center rounded-full transition-colors focus:outline-none',
//                 isDark ? 'bg-transparent' : 'bg-transparent',
//                 className,
//             )}
//             aria-label={
//                 isDark ? 'Passer au mode clair' : 'Passer au mode sombre'
//             }
//             {...props}
//         >
//             {/* Icône du mode actuel */}
//             <span
//                 className={cn(
//                     'absolute left-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition-transform duration-200 ease-in-out',
//                     isDark ? 'translate-x-7' : 'translate-x-0',
//                 )}
//             >
//                 {isDark ? (
//                     <Moon className="h-5 w-5 text-gray-700" />
//                 ) : (
//                     <Sun className="h-5 w-5 text-yellow-500" />
//                 )}
//             </span>

//             {/* Icônes indicatrices */}
//             <span className="sr-only">
//                 {isDark ? 'Mode sombre' : 'Mode clair'}
//             </span>
//         </button>
//     );
// }
import { Moon, Sun } from 'lucide-react';
import type { ButtonHTMLAttributes } from 'react';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

interface AppearanceToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
}

export default function AppearanceToggle({
    className,
    ...props
}: AppearanceToggleProps) {
    const { appearance, updateAppearance } = useAppearance();

    const isDark = appearance === 'dark';

    const toggleAppearance = () => {
        updateAppearance(isDark ? 'light' : 'dark');
    };

    return (
        <button
            type="button"
            onClick={toggleAppearance}
            aria-label={
                isDark ? 'Passer au mode clair' : 'Passer au mode sombre'
            }
            aria-pressed={isDark}
            title={isDark ? 'Mode sombre activé' : 'Mode clair activé'}
            className={cn(
                'group relative inline-flex h-10 w-20 shrink-0 items-center rounded-full',
                'border border-slate-200/80 bg-white/90 p-1',
                'shadow-lg shadow-slate-200/50 backdrop-blur-xl',
                'transition-all duration-500 ease-out',
                'hover:shadow-xl hover:shadow-emerald-500/10',
                'focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-2 focus-visible:outline-none',
                'focus-visible:ring-offset-white',
                'dark:border-slate-700/80 dark:bg-slate-900/90',
                'dark:shadow-black/30 dark:focus-visible:ring-offset-slate-950',
                className,
            )}
            {...props}
        >
            {/* Fond dynamique */}
            <span
                className={cn(
                    'absolute inset-0 rounded-full transition-all duration-500',
                    isDark
                        ? 'bg-linear-to-r from-slate-900 via-slate-800 to-slate-900'
                        : 'bg-linear-to-r from-amber-50 via-white to-amber-100',
                )}
            />

            {/* Glow subtil */}
            <span
                className={cn(
                    'absolute inset-0 rounded-full opacity-100 transition-opacity duration-500',
                    isDark
                        ? 'shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)]'
                        : 'shadow-[inset_0_1px_2px_rgba(255,255,255,0.9)]',
                )}
            />

            {/* Icônes de fond */}
            <span className="absolute inset-0 flex items-center justify-between px-3">
                <Sun
                    className={cn(
                        'h-4 w-4 transition-all duration-500',
                        isDark
                            ? 'scale-90 text-slate-500 opacity-40'
                            : 'scale-100 text-amber-500 opacity-100',
                    )}
                />
                <Moon
                    className={cn(
                        'h-4 w-4 transition-all duration-500',
                        isDark
                            ? 'scale-100 text-emerald-300 opacity-100'
                            : 'scale-90 text-slate-400 opacity-50',
                    )}
                />
            </span>

            {/* Bouton mobile */}
            <span
                className={cn(
                    'relative z-10 flex h-8 w-8 items-center justify-center rounded-full',
                    'border border-white/70 bg-white',
                    'shadow-md shadow-slate-900/10',
                    'transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                    'dark:border-slate-700 dark:bg-slate-800 dark:shadow-black/30',
                    isDark ? 'translate-x-10' : 'translate-x-0',
                )}
            >
                <span
                    className={cn(
                        'absolute inset-0 rounded-full transition-all duration-500',
                        isDark
                            ? 'bg-linear-to-br from-slate-700 to-slate-900'
                            : 'bg-linear-to-br from-white to-amber-50',
                    )}
                />

                {isDark ? (
                    <Moon className="relative h-4.5 w-4.5 text-emerald-300" />
                ) : (
                    <Sun className="relative h-4.5 w-4.5 text-amber-500" />
                )}
            </span>

            {/* Texte accessible */}
            <span className="sr-only">
                {isDark ? 'Mode sombre activé' : 'Mode clair activé'}
            </span>
        </button>
    );
}
