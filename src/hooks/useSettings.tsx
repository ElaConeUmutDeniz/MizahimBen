// hooks/useSettings.tsx

import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Settings, Language, SupportedLanguages } from '../types';
import { DEFAULT_JOKE_SOURCE_URL, FONT_OPTIONS } from '../constants';

const defaultSettings: Settings = {
    theme: 'dark',
    secondaryColor: '#3b82f6',
    font: FONT_OPTIONS[0].value,
    language: 'tr', // This is the fallback default, but our logic will usually override it.
    jokeSourceUrl: DEFAULT_JOKE_SOURCE_URL,
    notificationsEnabled: false,
    notificationTime: '09:00',
};

/**
 * Determines language from URL or Browser only. Does NOT check localStorage.
 * This is used when no setting is saved yet.
 * Priority: 1. URL Query -> 2. Browser Language -> 3. Fallback to English ('en').
 */
const getLanguageForFirstVisit = (): Language => {
    // Priority 1: Check for a language query in the URL
    const params = new URLSearchParams(window.location.search);
    const langFromUrl = params.get('lang');
    if (langFromUrl && (SupportedLanguages as readonly string[]).includes(langFromUrl)) {
        return langFromUrl as Language;
    }

    // Priority 2: Detect browser language
    // navigator.language can be 'en-US', 'fr-CA', etc. We only want the 'en' or 'fr' part.
    const browserLang = navigator.language.split('-')[0];
    if ((SupportedLanguages as readonly string[]).includes(browserLang)) {
        return browserLang as Language;
    }

    // Priority 3: Default to English if browser language is not supported
    return 'en';
};

interface SettingsContextType {
    settings: Settings;
    updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
    saveSettings: (newSettings: Settings) => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<Settings>(() => {
        // Step 1: Try to load any existing settings from localStorage.
        let storedSettings: Partial<Settings> = {};
        try {
            const item = window.localStorage.getItem('mizahimben-settings');
            if (item) {
                storedSettings = JSON.parse(item);
            }
        } catch (error) {
            console.error('Error reading settings from localStorage', error);
        }

        // Step 2: Determine the definitive initial language with the CORRECT priority.
        const initialLanguage =
            // Priority 1: Use language from localStorage if it exists and is valid.
            SupportedLanguages.includes(storedSettings.language as any)
                ? (storedSettings.language as Language)
                // Priority 2 & 3: If no stored language, get it from URL or Browser.
                : getLanguageForFirstVisit();

        // Step 3: Combine everything. Defaults first, then stored settings,
        // and finally, overwrite with the definitive language we just calculated.
        return {
            ...defaultSettings,
            ...storedSettings,
            language: initialLanguage,
        };
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
