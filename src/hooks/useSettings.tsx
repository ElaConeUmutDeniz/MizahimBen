// hooks/useSettings.tsx

import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Settings, Language, SupportedLanguages } from '../types'; // Import SupportedLanguages
import { DEFAULT_JOKE_SOURCE_URL, FONT_OPTIONS } from '../constants';

const defaultSettings: Settings = {
    theme: 'dark',
    secondaryColor: '#3b82f6',
    font: FONT_OPTIONS[0].value,
    language: 'tr', // This will be overridden by our new logic
    jokeSourceUrl: DEFAULT_JOKE_SOURCE_URL,
    notificationsEnabled: false,
    notificationTime: '09:00',
};

/**
 * Determines the initial language based on a clear priority:
 * 1. Manually set language from localStorage.
 * 2. Language from the URL query parameter (?lang=...).
 * 3. User's browser/system language.
 * 4. Default to 'en' if none of the above are supported.
 */
const getInitialLanguage = (): Language => {
    // Priority 1: Check for a manually saved setting in localStorage
    try {
        const storedSettings = window.localStorage.getItem('mizahimben-settings');
        if (storedSettings) {
            const parsedSettings = JSON.parse(storedSettings);
            if (SupportedLanguages.includes(parsedSettings.language)) {
                return parsedSettings.language;
            }
        }
    } catch (e) {
        console.error("Failed to parse settings from localStorage for language", e);
    }

    // Priority 2: Check for a language query in the URL
    const params = new URLSearchParams(window.location.search);
    const langFromUrl = params.get('lang');
    if (langFromUrl && (SupportedLanguages as readonly string[]).includes(langFromUrl)) {
        return langFromUrl as Language;
    }

    // Priority 3: Detect browser language
    // navigator.language can be 'en-US', 'fr-CA', etc. We only want the 'en' or 'fr' part.
    const browserLang = navigator.language.split('-')[0];
    if ((SupportedLanguages as readonly string[]).includes(browserLang)) {
        return browserLang as Language;
    }

    // Priority 4: Default to English
    return 'en';
};


interface SettingsContextType {
    settings: Settings;
    updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
    saveSettings: (newSettings: Settings) => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// This is a React Functional Component, which is why it's in a .tsx file
export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<Settings>(() => {
        // We calculate the initial language first using our priority logic
        const initialLanguage = getInitialLanguage();

        try {
            const item = window.localStorage.getItem('mizahimben-settings');
            const storedSettings = item ? JSON.parse(item) : {};

            // We combine default settings, stored settings, and our calculated language.
            // This ensures the language is set correctly on first load while preserving other settings.
            return {
                ...defaultSettings,
                ...storedSettings,
                language: initialLanguage,
            };
        } catch (error) {
            console.error('Error reading settings from localStorage', error);
            // If storage fails, still use the calculated initial language
            return { ...defaultSettings, language: initialLanguage };
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem('mizahimben-settings', JSON.stringify(settings));
        } catch (error) {
            console.error('Error saving settings to localStorage', error);
        }
    }, [settings]);

    const updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void = useCallback((key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    }, []);

    const saveSettings = useCallback((newSettings: Settings) => {
        setSettings(newSettings);
    }, []);

    // The return of JSX is what makes this a .tsx file
    return (
        <SettingsContext.Provider value={{ settings, updateSetting, saveSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = React.useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
