import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ThemePreviewPanelProps {
    colors: Record<string, string>;
    typography?: {
        font_family?: string;
        heading_size?: number;
        body_size?: number;
        line_height?: number;
    };
}

export default function ThemePreviewPanel({
    colors,
    typography = {
        font_family: 'Inter',
        heading_size: 1.25,
        body_size: 1,
        line_height: 1.5,
    },
}: ThemePreviewPanelProps) {
    const getCssVariables = (colors: Record<string, string>) => {
        const vars: Record<string, string> = {};
        Object.entries(colors).forEach(([key, value]) => {
            vars[key] = `hsl(${value})`;
        });

        return vars;
    };

    const cssVars = getCssVariables(colors);

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Aperçu en direct
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Voici comment vos composants vont aparaître avec ce thème
                </p>
            </div>

            <div style={cssVars as any} className="space-y-4">
                {/* Buttons */}
                <Card className="border-slate-200 dark:border-slate-700">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Boutons</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="w-full rounded-lg px-4 py-2 text-center font-medium text-white transition-all"
                            style={{
                                backgroundColor: cssVars['--primary'],
                                color: cssVars['--primary-foreground'],
                            }}
                        >
                            Bouton Principal
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="w-full rounded-lg border-2 px-4 py-2 text-center font-medium transition-all"
                            style={{
                                borderColor: cssVars['--secondary'],
                                color: cssVars['--foreground'],
                            }}
                        >
                            Bouton Secondaire
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="w-full rounded-lg border-2 px-4 py-2 text-center font-medium text-white transition-all"
                            style={{
                                borderColor: cssVars['--destructive'],
                                backgroundColor: cssVars['--destructive'],
                                color: cssVars['--destructive-foreground'],
                            }}
                        >
                            Bouton Danger
                        </motion.div>
                    </CardContent>
                </Card>

                {/* Badges */}
                <Card className="border-slate-200 dark:border-slate-700">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Badges & Tags</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        <Badge
                            style={{
                                backgroundColor: cssVars['--primary'],
                                color: cssVars['--primary-foreground'],
                            }}
                        >
                            Principal
                        </Badge>
                        <Badge
                            style={{
                                backgroundColor: cssVars['--accent'],
                                color: cssVars['--accent-foreground'],
                            }}
                        >
                            Accent
                        </Badge>
                        <Badge
                            style={{
                                backgroundColor: cssVars['--secondary'],
                                color: cssVars['--foreground'],
                            }}
                        >
                            Secondaire
                        </Badge>
                        <Badge
                            style={{
                                backgroundColor: cssVars['--muted'],
                                color: cssVars['--muted-foreground'],
                            }}
                        >
                            Neutre
                        </Badge>
                    </CardContent>
                </Card>

                {/* Alerts */}
                <div className="space-y-2">
                    {/* Success Alert */}
                    <div
                        className="flex gap-3 rounded-lg border-l-4 p-4"
                        style={{
                            backgroundColor: `hsl(${colors['--background']})`,
                            borderColor: cssVars['--primary'],
                        }}
                    >
                        <CheckCircle2
                            className="h-5 w-5 flex-shrink-0"
                            style={{ color: cssVars['--primary'] }}
                        />
                        <div className="flex-1">
                            <p
                                className="text-sm font-medium"
                                style={{ color: cssVars['--foreground'] }}
                            >
                                Succès
                            </p>
                            <p
                                className="text-xs"
                                style={{ color: cssVars['--muted-foreground'] }}
                            >
                                Votre action a été complétée avec succès
                            </p>
                        </div>
                    </div>

                    {/* Info Alert */}
                    <div
                        className="flex gap-3 rounded-lg border-l-4 p-4"
                        style={{
                            backgroundColor: `hsl(${colors['--background']})`,
                            borderColor: cssVars['--ring'],
                        }}
                    >
                        <Info
                            className="h-5 w-5 flex-shrink-0"
                            style={{ color: cssVars['--ring'] }}
                        />
                        <div className="flex-1">
                            <p
                                className="text-sm font-medium"
                                style={{ color: cssVars['--foreground'] }}
                            >
                                Information
                            </p>
                            <p
                                className="text-xs"
                                style={{ color: cssVars['--muted-foreground'] }}
                            >
                                Voici une notification informative
                            </p>
                        </div>
                    </div>

                    {/* Error Alert */}
                    <div
                        className="flex gap-3 rounded-lg border-l-4 p-4"
                        style={{
                            backgroundColor: `hsl(${colors['--background']})`,
                            borderColor: cssVars['--destructive'],
                        }}
                    >
                        <AlertCircle
                            className="h-5 w-5 flex-shrink-0"
                            style={{ color: cssVars['--destructive'] }}
                        />
                        <div className="flex-1">
                            <p
                                className="text-sm font-medium"
                                style={{ color: cssVars['--foreground'] }}
                            >
                                Erreur
                            </p>
                            <p
                                className="text-xs"
                                style={{ color: cssVars['--muted-foreground'] }}
                            >
                                Une erreur s'est produite lors du traitement
                            </p>
                        </div>
                    </div>
                </div>

                {/* Cards */}
                <Card
                    className="border-2"
                    style={{
                        borderColor: cssVars['--border'],
                        backgroundColor: cssVars['--card'],
                    }}
                >
                    <CardHeader
                        style={{
                            borderBottomColor: cssVars['--border'],
                        }}
                        className="border-b pb-3"
                    >
                        <CardTitle
                            style={{ color: cssVars['--foreground'] }}
                            className="text-sm"
                        >
                            Exemple de Carte
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <p
                            style={{ color: cssVars['--muted-foreground'] }}
                            className="mb-3 text-xs"
                        >
                            Ceci est un exemple de carte avec votre thème. Elle
                            montre comment les éléments s'affichent.
                        </p>
                        <div className="flex gap-2">
                            <div
                                className="flex-1 rounded px-3 py-1 text-center text-xs font-medium text-white"
                                style={{
                                    backgroundColor: cssVars['--primary'],
                                }}
                            >
                                Action
                            </div>
                            <div
                                className="flex-1 rounded border px-3 py-1 text-center text-xs font-medium"
                                style={{
                                    borderColor: cssVars['--border'],
                                    color: cssVars['--foreground'],
                                }}
                            >
                                Cancel
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Input Preview */}
                <Card className="border-slate-200 dark:border-slate-700">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Formulaires</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <input
                            type="text"
                            placeholder="Champ de texte"
                            className="w-full rounded-lg border-2 px-4 py-2 transition-all focus:ring-2 focus:outline-none"
                            style={{
                                borderColor: cssVars['--input'],
                                backgroundColor: cssVars['--background'],
                                color: cssVars['--foreground'],
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor =
                                    cssVars['--ring'];
                                e.currentTarget.style.boxShadow = `0 0 0 3px ${cssVars['--ring']}33`;
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor =
                                    cssVars['--input'];
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        />
                        <select
                            className="w-full rounded-lg border-2 px-4 py-2 transition-all focus:outline-none"
                            style={{
                                borderColor: cssVars['--input'],
                                backgroundColor: cssVars['--background'],
                                color: cssVars['--foreground'],
                            }}
                        >
                            <option>Sélectionnez une option</option>
                            <option>Option 1</option>
                            <option>Option 2</option>
                        </select>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
