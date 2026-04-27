import { Moon, Sun } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

interface AppearanceToggleProps extends HTMLAttributes<HTMLButtonElement> {
    className?: string;
}

export default function AppearanceToggle({
    className = '',
    ...props
}: AppearanceToggleProps) {
    const { appearance, updateAppearance } = useAppearance();

    const isDark = appearance === 'dark';

    const toggleAppearance = () => {
        updateAppearance(isDark ? 'light' : 'dark');
    };

    return (
        <button
            onClick={toggleAppearance}
            className={cn(
                'relative inline-flex h-7 w-15 cursor-pointer items-center rounded-full transition-colors focus:outline-none',
                isDark ? 'bg-transparent' : 'bg-transparent',
                className,
            )}
            aria-label={
                isDark ? 'Passer au mode clair' : 'Passer au mode sombre'
            }
            {...props}
        >
            {/* Icône du mode actuel */}
            <span
                className={cn(
                    'absolute left-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition-transform duration-200 ease-in-out',
                    isDark ? 'translate-x-7' : 'translate-x-0',
                )}
            >
                {isDark ? (
                    <Moon className="h-5 w-5 text-gray-700" />
                ) : (
                    <Sun className="h-5 w-5 text-yellow-500" />
                )}
            </span>

            {/* Icônes indicatrices */}
            <span className="sr-only">
                {isDark ? 'Mode sombre' : 'Mode clair'}
            </span>
        </button>
    );
}
