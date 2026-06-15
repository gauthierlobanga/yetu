import { motion, AnimatePresence } from 'framer-motion';
import {
    Paintbrush,
    Download,
    Upload,
    RotateCcw,
    Loader2,
    ChevronRight,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import ColorPicker from './ColorPicker';
import PresetGallery from './PresetGallery';

interface ThemeData {
    current?: any;
    defaults?: any;
    presets?: Record<string, any>;
    history?: any[];
}

export default function ShopThemeCustomizer() {
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [themeData, setThemeData] = useState<ThemeData>({});
    const [currentTheme, setCurrentTheme] = useState<any>(null);
    const [previewMode, setPreviewMode] = useState<'presets' | 'colors'>(
        'presets',
    );

    // Charger les données du thème
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const response = await fetch(route('shop.theme.show'), {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                });

                if (!response.ok) {
throw new Error('Erreur serveur');
}

                const data = await response.json();
                setThemeData(data);
                setCurrentTheme(data.current || data.defaults);
            } catch (error) {
                console.error('Erreur:', error);
                toast.error('Impossible de charger le thème');
            }
        };

        if (open) {
            loadTheme();
        }
    }, [open]);

    // Appliquer le CSS en direct pendant la modification
    useEffect(() => {
        if (!currentTheme?.colors) {
return;
}

        const styleId = 'tenant-theme-preview';
        let styleTag = document.getElementById(styleId);

        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = styleId;
            document.head.appendChild(styleTag);
        }

        // Construire les CSS variables
        let css = ':root {';
        Object.entries(currentTheme.colors).forEach(([key, value]) => {
            css += `${key}: hsl(${value});`;
        });
        css += '}';

        styleTag.innerHTML = css;
    }, [currentTheme?.colors]);

    const updateThemeColors = (key: string, value: string) => {
        setCurrentTheme((prev: any) => ({
            ...prev,
            colors: {
                ...prev?.colors,
                [key]: value,
            },
        }));
    };

    const saveTheme = async () => {
        setSaving(true);

        try {
            const response = await fetch(route('shop.theme.update'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN':
                        (
                            document.querySelector(
                                'meta[name="csrf-token"]',
                            ) as HTMLMetaElement
                        )?.content || '',
                },
                body: JSON.stringify(currentTheme),
            });

            if (!response.ok) {
throw new Error('Erreur serveur');
}

            const data = await response.json();

            if (data.success) {
                toast.success('Thème appliqué avec succès');
                setOpen(false);
                window.location.reload();
            } else {
                toast.error('Erreur lors de la sauvegarde');
            }
        } catch (error) {
            console.error('Erreur:', error);
            toast.error('Impossible de sauvegarder le thème');
        } finally {
            setSaving(false);
        }
    };

    const applyPreset = async (preset: string) => {
        setSaving(true);

        try {
            const response = await fetch(
                route('shop.theme.preset', { preset }),
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN':
                            (
                                document.querySelector(
                                    'meta[name="csrf-token"]',
                                ) as HTMLMetaElement
                            )?.content || '',
                    },
                },
            );

            if (!response.ok) {
throw new Error('Erreur serveur');
}

            const data = await response.json();

            if (data.success) {
                setCurrentTheme(data.theme);
                toast.success(`Thème "${preset}" appliqué`);
            }
        } catch (error) {
            console.error('Erreur:', error);
            toast.error("Erreur lors de l'application du preset");
        } finally {
            setSaving(false);
        }
    };

    const exportTheme = async () => {
        try {
            const response = await fetch(route('shop.theme.export'), {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            const json = await response.json();
            const blob = new Blob([JSON.stringify(json, null, 2)], {
                type: 'application/json',
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'theme.json';
            a.click();
            window.URL.revokeObjectURL(url);

            toast.success('Thème exporté');
        } catch (error) {
            toast.error("Erreur lors de l'export");
        }
    };

    const importTheme = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        setSaving(true);

        try {
            const response = await fetch(route('shop.theme.import'), {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN':
                        (
                            document.querySelector(
                                'meta[name="csrf-token"]',
                            ) as HTMLMetaElement
                        )?.content || '',
                },
                body: formData,
            });

            if (!response.ok) {
throw new Error('Erreur serveur');
}

            const data = await response.json();

            if (data.success) {
                setCurrentTheme(data.theme);
                toast.success('Thème importé avec succès');
            }
        } catch (error) {
            console.error('Erreur:', error);
            toast.error("Erreur lors de l'import");
        } finally {
            setSaving(false);
        }
    };

    const resetTheme = async () => {
        if (
            !confirm(
                'Êtes-vous sûr de vouloir réinitialiser le thème aux paramètres par défaut ?',
            )
        ) {
            return;
        }

        setSaving(true);

        try {
            const response = await fetch(route('shop.theme.reset'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN':
                        (
                            document.querySelector(
                                'meta[name="csrf-token"]',
                            ) as HTMLMetaElement
                        )?.content || '',
                },
            });

            if (!response.ok) {
throw new Error('Erreur serveur');
}

            const data = await response.json();

            if (data.success) {
                setCurrentTheme(data.theme);
                toast.success('Thème réinitialisé');
            }
        } catch (error) {
            console.error('Erreur:', error);
            toast.error('Erreur lors de la réinitialisation');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="group relative h-10 w-10 rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                    title="Personnaliser ma boutique"
                >
                    <motion.div
                        whileHover={{ rotate: 90 }}
                        transition={{ duration: 0.4 }}
                    >
                        <Paintbrush className="h-5 w-5" />
                    </motion.div>
                    <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    </span>
                </Button>
            </SheetTrigger>

            <SheetContent className="flex h-screen w-full max-w-2xl flex-col border-none p-0 sm:max-w-2xl dark:bg-slate-900">
                <div className="flex h-full flex-col overflow-hidden">
                    {/* Header - Fixe */}
                    <div className="shrink-0 border-b border-emerald-200 bg-gradient-to-r from-emerald-50 to-white px-6 py-4 dark:border-emerald-900/30 dark:from-emerald-950/40 dark:to-slate-900">
                        <SheetHeader className="space-y-2">
                            <SheetTitle className="flex items-center gap-2 text-lg text-emerald-700 dark:text-emerald-300">
                                <Paintbrush className="h-5 w-5 text-emerald-500" />
                                Personnaliser ma boutique
                            </SheetTitle>
                            <SheetDescription className="text-xs text-slate-600 dark:text-slate-400">
                                Sélectionnez un thème ou personnalisez les
                                couleurs. Les changements s'appliquent en
                                direct.
                            </SheetDescription>
                        </SheetHeader>
                    </div>

                    {/* Content - Scrollable */}
                    <ScrollArea className="flex-1 overflow-hidden">
                        <div className="space-y-8 px-6 py-6">
                            {/* Mode Selection */}
                            <div className="flex w-full gap-2 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
                                <button
                                    onClick={() => setPreviewMode('presets')}
                                    className={cn(
                                        'flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all',
                                        previewMode === 'presets'
                                            ? 'bg-white text-emerald-600 shadow-sm dark:bg-slate-900 dark:text-emerald-400'
                                            : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300',
                                    )}
                                >
                                    🎨 Thèmes rapides
                                </button>
                                <button
                                    onClick={() => setPreviewMode('colors')}
                                    className={cn(
                                        'flex-1 rounded-md px-3 py-2 text-sm font-medium transition-all',
                                        previewMode === 'colors'
                                            ? 'bg-white text-emerald-600 shadow-sm dark:bg-slate-900 dark:text-emerald-400'
                                            : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300',
                                    )}
                                >
                                    🌈 Couleurs perso
                                </button>
                            </div>

                            {/* PRESETS TAB */}
                            {previewMode === 'presets' && themeData.presets && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-4"
                                >
                                    <PresetGallery
                                        presets={themeData.presets}
                                        currentPreset={
                                            currentTheme?.preset ||
                                            'modern_emerald'
                                        }
                                        onSelectPreset={applyPreset}
                                        isLoading={saving}
                                    />
                                </motion.div>
                            )}

                            {/* COLORS TAB */}
                            {previewMode === 'colors' &&
                                currentTheme?.colors && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="space-y-6"
                                    >
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                                Couleurs principales
                                            </h3>
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <ColorPicker
                                                    value={
                                                        currentTheme.colors[
                                                            '--primary'
                                                        ] || ''
                                                    }
                                                    onChange={(v) =>
                                                        updateThemeColors(
                                                            '--primary',
                                                            v,
                                                        )
                                                    }
                                                    label="Couleur primaire"
                                                    description="Couleur principale de vos boutons"
                                                />
                                                <ColorPicker
                                                    value={
                                                        currentTheme.colors[
                                                            '--secondary'
                                                        ] || ''
                                                    }
                                                    onChange={(v) =>
                                                        updateThemeColors(
                                                            '--secondary',
                                                            v,
                                                        )
                                                    }
                                                    label="Couleur secondaire"
                                                    description="Accents et éléments secondaires"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                                Autres couleurs
                                            </h3>
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <ColorPicker
                                                    value={
                                                        currentTheme.colors[
                                                            '--accent'
                                                        ] || ''
                                                    }
                                                    onChange={(v) =>
                                                        updateThemeColors(
                                                            '--accent',
                                                            v,
                                                        )
                                                    }
                                                    label="Accent"
                                                    description="Mises en avant et highlights"
                                                />
                                                <ColorPicker
                                                    value={
                                                        currentTheme.colors[
                                                            '--destructive'
                                                        ] || ''
                                                    }
                                                    onChange={(v) =>
                                                        updateThemeColors(
                                                            '--destructive',
                                                            v,
                                                        )
                                                    }
                                                    label="Danger (rouge)"
                                                    description="Boutons de suppression/danger"
                                                />
                                            </div>
                                        </div>

                                        {/* Live Preview */}
                                        <div className="space-y-3 rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-50/50 p-4 dark:border-emerald-800/30 dark:from-emerald-950/20 dark:to-emerald-900/10">
                                            <p className="text-xs font-semibold tracking-wide text-emerald-700 uppercase dark:text-emerald-300">
                                                ✨ Aperçu en direct
                                            </p>
                                            <div className="flex flex-wrap gap-3">
                                                <button
                                                    style={{
                                                        backgroundColor: `hsl(${currentTheme.colors['--primary']})`,
                                                        color: `hsl(${currentTheme.colors['--primary-foreground']})`,
                                                    }}
                                                    className="rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-shadow hover:shadow-md"
                                                >
                                                    Primaire
                                                </button>
                                                <button
                                                    style={{
                                                        backgroundColor: `hsl(${currentTheme.colors['--secondary']})`,
                                                        color: `hsl(${currentTheme.colors['--secondary-foreground']})`,
                                                    }}
                                                    className="rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-shadow hover:shadow-md"
                                                >
                                                    Secondaire
                                                </button>
                                                <button
                                                    style={{
                                                        backgroundColor: `hsl(${currentTheme.colors['--accent']})`,
                                                        color: `hsl(${currentTheme.colors['--accent-foreground']})`,
                                                    }}
                                                    className="rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-shadow hover:shadow-md"
                                                >
                                                    Accent
                                                </button>
                                                <button
                                                    style={{
                                                        backgroundColor: `hsl(${currentTheme.colors['--destructive']})`,
                                                        color: `hsl(${currentTheme.colors['--destructive-foreground']})`,
                                                    }}
                                                    className="rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-shadow hover:shadow-md"
                                                >
                                                    Danger
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                            {/* Extra space for scrolling */}
                            <div className="h-4" />
                        </div>
                    </ScrollArea>

                    {/* Footer - Fixe */}
                    <div className="shrink-0 space-y-3 border-t border-slate-200 bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-950">
                        {/* Quick Actions */}
                        <div className="grid grid-cols-3 gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={exportTheme}
                                className="h-9 gap-1 text-xs"
                                disabled={saving}
                            >
                                <Download className="h-3 w-3" />
                                <span className="hidden sm:inline">Export</span>
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-9 gap-1 text-xs"
                                disabled={saving}
                                onClick={() => {
                                    const input =
                                        document.createElement('input');
                                    input.type = 'file';
                                    input.accept = '.json';
                                    input.onchange = (e: any) => {
                                        importTheme(e.target.files[0]);
                                    };
                                    input.click();
                                }}
                            >
                                <Upload className="h-3 w-3" />
                                <span className="hidden sm:inline">Import</span>
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={resetTheme}
                                className="h-9 gap-1 text-xs"
                                disabled={saving}
                            >
                                <RotateCcw className="h-3 w-3" />
                                <span className="hidden sm:inline">Défaut</span>
                            </Button>
                        </div>

                        {/* Save Button */}
                        <Button
                            size="lg"
                            className="h-10 w-full gap-2 bg-emerald-600 font-semibold text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700"
                            onClick={saveTheme}
                            disabled={saving}
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Sauvegarde...
                                </>
                            ) : (
                                <>
                                    <Paintbrush className="h-4 w-4" />
                                    Appliquer le thème
                                    <ChevronRight className="h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
