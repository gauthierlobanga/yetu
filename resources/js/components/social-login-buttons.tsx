import { ArrowRight } from 'lucide-react';
import { FaFacebook, FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Provider = {
    name: string;
    label: string;
    icon: React.ReactNode;
    iconClassName?: string;
};

const providers: Provider[] = [
    {
        name: 'google',
        label: 'Google',
        icon: <FcGoogle className="h-5 w-5" />,
    },
    {
        name: 'facebook',
        label: 'Facebook',
        icon: <FaFacebook className="h-5 w-5 text-[#1877F2]" />,
    },
    {
        name: 'github',
        label: 'GitHub',
        icon: <FaGithub className="h-5 w-5 text-slate-900 dark:text-white" />,
    },
];

export function SocialLoginButtons() {
    const getSocialUrl = (provider: string): string | null => {
        try {
            return route('tenant.socialite.redirect', provider);
        } catch {
            return null;
        }
    };

    return (
        <div className="grid grid-cols-3 gap-3">
            {providers.map((provider) => {
                const url = getSocialUrl(provider.name);
                const isDisabled = !url;

                return (
                    <Button
                        key={provider.name}
                        type="button"
                        variant="outline"
                        size="lg"
                        disabled={isDisabled}
                        asChild={!isDisabled}
                        className={cn(
                            'group relative h-12 rounded-2xl border border-slate-200/80 bg-white/80 px-3 shadow-sm backdrop-blur-xl transition-all duration-300',
                            'hover:-translate-y-0.5 hover:border-emerald-300/60 hover:bg-white hover:shadow-lg hover:shadow-emerald-500/10',
                            'dark:border-slate-700/80 dark:bg-slate-900/70',
                            'dark:hover:border-emerald-500/40 dark:hover:bg-slate-900',
                            'disabled:cursor-not-allowed disabled:opacity-50',
                        )}
                    >
                        {isDisabled ? (
                            <span className="flex items-center justify-center">
                                {provider.icon}
                            </span>
                        ) : (
                            <a
                                href={url}
                                aria-label={`Continuer avec ${provider.label}`}
                                title={`Continuer avec ${provider.label}`}
                                className="flex w-full items-center justify-center"
                            >
                                {/* Glow subtil */}
                                <span className="absolute inset-0 rounded-2xl bg-linear-to-r from-emerald-500/0 via-emerald-500/5 to-emerald-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                {/* Contenu */}
                                <span className="relative flex items-center justify-center">
                                    {provider.icon}
                                </span>

                                {/* Indicateur discret au hover */}
                                <span className="absolute top-2 right-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                                    <ArrowRight className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                                </span>
                            </a>
                        )}
                    </Button>
                );
            })}
        </div>
    );
}
