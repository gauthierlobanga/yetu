import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ThemePreset {
    label: string;
    description: string;
    primaryColor: string;
    neutralColor: string;
}

interface PresetGalleryProps {
    presets: Record<string, ThemePreset>;
    currentPreset: string;
    onSelectPreset: (preset: string) => void;
    isLoading?: boolean;
}

export default function PresetGallery({
    presets,
    currentPreset,
    onSelectPreset,
    isLoading = false,
}: PresetGalleryProps) {
    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Thèmes prédéfinis
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Choisissez un thème professionnel pour votre boutique
                </p>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(presets).map(([key, preset]) => {
                    const isSelected = currentPreset === key;
                    const primaryHsl = preset.primaryColor;
                    const neutralHsl = preset.neutralColor;

                    return (
                        <motion.div
                            key={key}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => !isLoading && onSelectPreset(key)}
                            className={cn(
                                'relative cursor-pointer overflow-hidden rounded-xl border-2 p-4 text-left transition-all',
                                isSelected
                                    ? 'border-emerald-500 bg-emerald-50/50 shadow-lg dark:bg-emerald-950/20'
                                    : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600',
                                isLoading && 'cursor-not-allowed opacity-50',
                            )}
                        >
                            {/* Miniature des couleurs */}
                            <div className="mb-3 flex gap-2">
                                <div
                                    className="h-8 w-8 rounded-lg border border-slate-200 shadow-sm dark:border-slate-700"
                                    style={{
                                        backgroundColor: `hsl(${primaryHsl})`,
                                    }}
                                />
                                <div
                                    className="h-8 w-8 rounded-lg border border-slate-200 shadow-sm dark:border-slate-700"
                                    style={{
                                        backgroundColor: `hsl(${neutralHsl})`,
                                    }}
                                />
                            </div>

                            {/* Label et description */}
                            <div className="mb-3">
                                <div className="mb-1 flex items-start justify-between gap-2">
                                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                        {preset.label}
                                    </h4>
                                    {isSelected && (
                                        <Badge className="bg-emerald-600 text-xs text-white">
                                            <Check className="mr-1 h-3 w-3" />
                                            Actif
                                        </Badge>
                                    )}
                                </div>
                                <p className="line-clamp-2 text-xs text-slate-600 dark:text-slate-400">
                                    {preset.description}
                                </p>
                            </div>

                            {/* Aperçu d'exemple */}
                            <div className="space-y-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                                <div
                                    className="flex h-7 w-full cursor-default items-center justify-center rounded-md text-xs font-medium text-white transition-opacity hover:opacity-90"
                                    style={{
                                        backgroundColor: `hsl(${primaryHsl})`,
                                    }}
                                >
                                    Aperçu
                                </div>
                                <div
                                    className="flex h-7 w-full cursor-default items-center justify-center rounded-md border border-slate-300 text-xs font-medium transition-opacity"
                                    style={{
                                        borderColor: `hsl(${neutralHsl})`,
                                        color: `hsl(${neutralHsl})`,
                                    }}
                                >
                                    Secondaire
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
