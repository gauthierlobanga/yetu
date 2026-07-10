import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactDOMServer from 'react-dom/server';
import { TooltipProvider } from '@/components/ui/tooltip';

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

const makeTitleFormatter = (appName: string) => (title: string) => {
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

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: makeTitleFormatter(
            getAppNameFromProps(page.props as InertiaTitleProps),
        ),
        resolve: (name) =>
            resolvePageComponent(
                `./pages/${name}.tsx`,
                import.meta.glob('./pages/**/*.tsx'),
            ),
        setup: ({ App, props }) => {
            return (
                <TooltipProvider delayDuration={0}>
                    <App {...props} />
                </TooltipProvider>
            );
        },
    }),
);
