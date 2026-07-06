import { useState, useEffect } from 'react';
import axios from 'axios';

export interface CookiePreferences {
    necessary: boolean;
    [key: string]: boolean;
}

const STORAGE_KEY = 'yetu-cookie-consent';

const defaultPreferences: CookiePreferences = {
    necessary: true, // Always true
    analytics: false,
    marketing: false,
    preferences: false,
};

export function useCookieConsent() {
    const [showBanner, setShowBanner] = useState<boolean>(false);
    const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setPreferences({ ...defaultPreferences, ...parsed, necessary: true });
                setShowBanner(false);
            } catch (e) {
                setShowBanner(true);
            }
        } else {
            setShowBanner(true);
        }
        setIsLoaded(true);
    }, []);

    const saveAndDispatch = async (newPrefs: CookiePreferences) => {
        // Ensure necessary is always true
        const prefsToSave = { ...newPrefs, necessary: true };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(prefsToSave));
        setPreferences(prefsToSave);
        setShowBanner(false);
        
        // Dispatch custom event for other scripts (e.g. Google Analytics)
        window.dispatchEvent(new CustomEvent('cookieConsentChange', { detail: prefsToSave }));

        // Save to backend for GDPR compliance log
        try {
            await axios.post('/api/cookie-consent', {
                preferences: prefsToSave
            });
        } catch (error) {
            console.error('Failed to save cookie consent to server:', error);
        }
    };

    const acceptAll = () => {
        saveAndDispatch({
            necessary: true,
            analytics: true,
            marketing: true,
            preferences: true,
        });
    };

    const declineAll = () => {
        saveAndDispatch({
            necessary: true,
            analytics: false,
            marketing: false,
            preferences: false,
        });
    };

    const savePreferences = (customPrefs: CookiePreferences) => {
        saveAndDispatch(customPrefs);
    };

    const resetConsent = () => {
        localStorage.removeItem(STORAGE_KEY);
        setPreferences(defaultPreferences);
        setShowBanner(true);
    };

    return {
        showBanner,
        preferences,
        isLoaded,
        acceptAll,
        declineAll,
        savePreferences,
        resetConsent,
    };
}
