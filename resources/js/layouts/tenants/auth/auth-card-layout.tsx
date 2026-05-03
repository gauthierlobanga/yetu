// import { Link } from '@inertiajs/react';
// import type { PropsWithChildren } from 'react';
// import AppLogoIcon from '@/components/app-logo-icon';
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardHeader,
//     CardTitle,
// } from '@/components/ui/card';
// import { home } from '@/routes';

// export default function AuthCardLayout({
//     children,
//     title,
//     description,
// }: PropsWithChildren<{
//     name?: string;
//     title?: string;
//     description?: string;
// }>) {
//     return (
//         <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
//             <div className="flex w-full max-w-md flex-col gap-6">
//                 <Link
//                     href={home()}
//                     className="flex items-center gap-2 self-center font-medium"
//                 >
//                     <div className="flex h-9 w-9 items-center justify-center">
//                         <AppLogoIcon className="size-9 fill-current text-black dark:text-white" />
//                     </div>
//                 </Link>

//                 <div className="flex flex-col gap-6">
//                     <Card className="rounded-xl">
//                         <CardHeader className="px-10 pt-8 pb-0 text-center">
//                             <CardTitle className="text-xl">{title}</CardTitle>
//                             <CardDescription>{description}</CardDescription>
//                         </CardHeader>
//                         <CardContent className="px-10 py-8">
//                             {children}
//                         </CardContent>
//                     </Card>
//                 </div>
//             </div>
//         </div>
//     );
// }
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import type { PropsWithChildren } from 'react';
import { homeIndex } from '@/actions/App/Http/Controllers/Home/HomeController';
import AppLogoIcon from '@/components/app-logo-icon';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-linear-to-br from-primary/5 via-background to-primary/5 p-6 md:p-10">
            {/* Cercles décoratifs animés en arrière-plan */}
            <div className="absolute -top-32 -left-32 h-96 w-96 animate-pulse rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -right-32 -bottom-32 h-96 w-96 animate-pulse rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 h-150 w-150 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="relative flex w-full max-w-md flex-col gap-6"
            >
                {/* Logo avec animation subtile */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex justify-center"
                >
                    <Link
                        href={route('home')}
                        className="flex items-center gap-2 self-center font-medium"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20 transition-shadow hover:shadow-primary/30">
                            <AppLogoIcon className="size-7 fill-current text-primary-foreground" />
                        </div>
                    </Link>
                </motion.div>

                {/* Carte avec glassmorphism */}
                <Card className="overflow-hidden rounded-2xl border border-white/20 bg-white/80 shadow-2xl backdrop-blur-xl transition-all dark:border-white/10 dark:bg-black/40">
                    <CardHeader className="px-8 pt-8 pb-0 text-center">
                        <CardTitle className="text-2xl font-bold tracking-tight">
                            {title}
                        </CardTitle>
                        <CardDescription className="mt-1 text-sm">
                            {description}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-8 py-6">{children}</CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
