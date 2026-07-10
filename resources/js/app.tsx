/* eslint-disable import/order */
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TooltipProvider } from '@/components/ui/tooltip';
import '../css/app.css';
import { initializeTheme } from '@/hooks/use-appearance';
import { configureEcho, echo } from '@laravel/echo-react';

configureEcho({
    broadcaster: 'reverb',
});

const reverbScheme =
    import.meta.env.VITE_REVERB_SCHEME ??
    (typeof window !== 'undefined' && window.location.protocol === 'https:'
        ? 'https'
        : 'http');
const reverbUsesTls = reverbScheme === 'https';
const reverbHost =
    import.meta.env.VITE_REVERB_HOST &&
    import.meta.env.VITE_REVERB_HOST !== '0.0.0.0'
        ? import.meta.env.VITE_REVERB_HOST
        : typeof window !== 'undefined'
          ? window.location.hostname
          : 'localhost';
const reverbPort = Number(
    import.meta.env.VITE_REVERB_PORT || (reverbUsesTls ? 443 : 8081),
);

configureEcho({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: reverbHost,
    wsPort: reverbPort,
    wssPort: reverbPort,
    forceTLS: reverbUsesTls,
    encrypted: reverbUsesTls,
    enabledTransports: [reverbUsesTls ? 'wss' : 'ws'],
});

if (typeof window !== 'undefined') {
    window.Echo = echo();
}

type InertiaTitleProps = {
    appName?: string;
    name?: string;
    seo?: {
        appName?: string;
    };
    tenant?: {
        raison_sociale?: string;
    };
};

const fallbackAppName = import.meta.env.VITE_APP_NAME || 'Laravel';

const getAppNameFromProps = (props?: InertiaTitleProps) =>
    props?.appName ||
    props?.seo?.appName ||
    props?.tenant?.raison_sociale ||
    props?.name ||
    fallbackAppName;

const getInitialAppName = () => {
    if (typeof document === 'undefined') {
        return fallbackAppName;
    }

    const pageData = document.getElementById('app')?.dataset.page;

    if (!pageData) {
        return (
            document.querySelector('title[inertia]')?.textContent ||
            fallbackAppName
        );
    }

    try {
        return getAppNameFromProps(JSON.parse(pageData).props);
    } catch {
        return fallbackAppName;
    }
};

const appName = getInitialAppName();
const formatTitle = (title: string) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle || trimmedTitle === appName) {
        return appName;
    }

    if (
        trimmedTitle.endsWith(` - ${appName}`) ||
        trimmedTitle.endsWith(` | ${appName}`)
    ) {
        return trimmedTitle;
    }

    return `${trimmedTitle} - ${appName}`;
};

import { GlobalLayoutWrapper } from '@/components/global/GlobalLayoutWrapper';

createInertiaApp({
    title: formatTitle,
    resolve: (name) => {
        const pagePromise = resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        );

        pagePromise.then((module: any) => {
            const originalLayout = module.default.layout;
            module.default.layout = (page: React.ReactNode) => {
                const layout = originalLayout ? originalLayout(page) : page;

                return <GlobalLayoutWrapper>{layout}</GlobalLayoutWrapper>;
            };
        });

        return pagePromise;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <StrictMode>
                <TooltipProvider delayDuration={0}>
                    <App {...props} />
                </TooltipProvider>
            </StrictMode>,
        );
    },
    progress: {
        color: '#069f41',
    },
});

// This will set light / dark mode on load...
initializeTheme();

// Ensure the favicon set by the server (Blade) is applied to the SPA and re-applied after Inertia navigations.
if (typeof window !== 'undefined') {
    (function () {
        const getInitialHref = () => {
            const serverLink =
                document.getElementById('favicon') ||
                document.querySelector('link[rel="icon"]');

            return serverLink?.getAttribute('href') || '/favicon.ico';
        };

        const setFavicon = (href: string | null | undefined) => {
            if (!href) {
                return;
            }

            let link = document.querySelector(
                'link[rel="icon"]',
            ) as HTMLLinkElement | null;

            if (!link) {
                link = document.createElement('link');
                link.rel = 'icon';
                link.id = 'favicon';
            }

            const sep = href.includes('?') ? '&' : '?';
            link.href = href + sep + 'v=' + Date.now(); // cache buster
            document.head.appendChild(link);
        };

        // Apply on load
        setFavicon(getInitialHref());

        // Re-apply after Inertia navigations (events fired by Inertia)
        document.addEventListener('inertia:finish', () =>
            setFavicon(getInitialHref()),
        );
        document.addEventListener('inertia:load', () =>
            setFavicon(getInitialHref()),
        );
    })();
}
