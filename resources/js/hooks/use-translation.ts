import { usePage } from '@inertiajs/react';

export function useTranslation() {
    const { props } = usePage<any>();
    const { locale, translations } = props;

    const t = (key: string, replace?: Record<string, string | number>) => {
        let translation = translations?.[key] ?? key;
        
        if (replace && translation) {
            Object.keys(replace).forEach((k) => {
                translation = translation.replace(new RegExp(`:${k}`, 'g'), String(replace[k]));
            });
        }
        
        return translation;
    };

    return { t, locale };
}
