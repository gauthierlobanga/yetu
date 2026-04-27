import { FaFacebook, FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { Button } from '@/components/ui/button';

export function SocialLoginButtons() {
    const getSocialUrl = (provider: string): string | null => {
        try {
            return route('socialite.redirect', provider);
        } catch {
            return null;
        }
    };

    return (
        <div className="space-y-3">
            <Button
                variant="outline"
                className="group h-11 w-full gap-3 border-border/50 bg-white/50 backdrop-blur-sm transition-all hover:bg-white hover:shadow-md dark:bg-black/20 dark:hover:bg-black/40"
                asChild
            >
                <a href={getSocialUrl('google') || '#'}>
                    <FcGoogle className="h-5 w-5 transition-transform group-hover:scale-110" />
                    Continue with Google
                </a>
            </Button>

            <Button
                variant="outline"
                className="group h-11 w-full gap-3 border-border/50 bg-white/50 backdrop-blur-sm transition-all hover:bg-white hover:shadow-md dark:bg-black/20 dark:hover:bg-black/40"
                asChild
            >
                <a href={getSocialUrl('facebook') || '#'}>
                    <FaFacebook className="h-5 w-5 text-[#1877F2] transition-transform group-hover:scale-110" />
                    Continue with Facebook
                </a>
            </Button>

            <Button
                variant="outline"
                className="group h-11 w-full gap-3 border-border/50 bg-white/50 backdrop-blur-sm transition-all hover:bg-white hover:shadow-md dark:bg-black/20 dark:hover:bg-black/40"
                asChild
            >
                <a href={getSocialUrl('github') || '#'}>
                    <FaGithub className="h-5 w-5 transition-transform group-hover:scale-110" />
                    Continue with GitHub
                </a>
            </Button>
        </div>
    );
}
