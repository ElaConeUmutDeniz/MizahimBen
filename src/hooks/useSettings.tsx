// hooks/useSettings.tsx

import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Settings, Language, SupportedLanguages } from '../types';
import { DEFAULT_JOKE_SOURCE_URL, FONT_OPTIONS } from '../constants';

// This default object is a fallback. The language property will be immediately
// replaced by our smarter detection logic on the first load.
const defaultSettings: Settings = {
    theme: 'dark',
    secondaryColor: '#3b82f6',
    font: FONT_OPTIONS[0].value,
    language: 'tr', // This is the value that was causing the problem. It will be overridden.
    // jokeSourceUrl: DEFAULT_JOKE_SOURCE_URL,
    notificationsEnabled: false,
    notificationTime: '09:00',
};

/**
 * Determines the initial language based on a clear priority:
 * 1. Manually set language from localStorage (checked inside the main hook).
 * 2. Language from the URL query parameter (?lang=...).
 * 3. User's browser/system language.
 * 4. Default to 'en' if none of the above are supported.
 */
const getInitialLanguage = (): Language => {
    // Priority 2: Check for a language query in the URL first.
    // This allows sharing links with specific languages.
    const params = new URLSearchParams(window.location.search);
    const langFromUrl = params.get('lang');
    if (langFromUrl && (SupportedLanguages as readonly string[]).includes(langFromUrl)) {
        return langFromUrl as Language;
    }

    // Priority 3: Detect browser language.
    // navigator.language can be 'en-US', 'fr-CA', etc. We only want the 'en' or 'fr' part.
    const browserLang = navigator.language.split('-')[0];
    if ((SupportedLanguages as readonly string[]).includes(browserLang)) {
        return browserLang as Language;
    }

    // Priority 4: Default to English if the browser language is not supported.
    return 'en';
};

interface SettingsContextType {
    settings: Settings;
    updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
    saveSettings: (newSettings: Settings) => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // THIS IS THE CORRECTED LOGIC. IT REPLACES THE OLD INITIALIZER.
    const [settings, setSettings] = useState<Settings>(() => {
        try {
            const storedSettingsJSON = window.localStorage.getItem('mizahimben-settings');
            const storedSettings = storedSettingsJSON ? JSON.parse(storedSettingsJSON) : {};

            // Priority 1: Use the language from localStorage if it exists and is valid.
            if (storedSettings.language && SupportedLanguages.includes(storedSettings.language)) {
                 // If a language is already saved, use it and combine with other saved settings.
                 return { ...defaultSettings, ...storedSettings };
            }

            // If no language is in localStorage, determine it from URL or browser.
            const detectedLanguage = getInitialLanguage();

            // Return the final initial settings, combining defaults, any stored non-language settings,
            // and the correctly detected language.
            return {
                ...defaultSettings,
                ...storedSettings,
                language: detectedLanguage,
            };

        } catch (error) {
            console.error('Error initializing settings', error);
            // If everything fails, still try to detect the language instead of using the hardcoded default.
            return { ...defaultSettings, language: getInitialLanguage() };
        }
    });

    // This effect saves settings to localStorage whenever they change.
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
