// hooks/useSettings.tsx

import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Settings, Language, SupportedLanguages } from '../types';
import { DEFAULT_JOKE_SOURCE_URL, FONT_OPTIONS } from '../constants';

// Set the ultimate fallback language here
const FALLBACK_LANGUAGE: Language = 'en';

const defaultSettings: Settings = {
    theme: 'dark',
    secondaryColor: '#3b82f6',
    font: FONT_OPTIONS[0].value,
    language: FALLBACK_LANGUAGE, // Default to the fallback language
    jokeSourceUrl: DEFAULT_JOKE_SOURCE_URL,
    notificationsEnabled: false,
    notificationTime: '09:00',
};

/**
 * This function is now the single source of truth for the initial settings.
 * It follows the priority list correctly and explicitly.
 */
const getInitialSettings = (): Settings => {
    // 1. Check for a manually saved setting in localStorage.
    try {
        const item = window.localStorage.getItem('mizahimben-settings');
        if (item) {
            const storedSettings = JSON.parse(item);
            // If it contains a VALID language, respect it above all else.
            if (SupportedLanguages.includes(storedSettings.language)) {
                console.log(`[Language] Found valid saved language in localStorage: ${storedSettings.language}`);
                // Merge with defaults to ensure all keys are present
                return { ...defaultSettings, ...storedSettings };
            }
        }
    } catch (e) {
        console.error("Failed to parse settings from localStorage", e);
    }

    // 2. No valid language in storage. Check the URL query parameter.
    const params = new URLSearchParams(window.location.search);
    const langFromUrl = params.get('lang');
    if (langFromUrl && (SupportedLanguages as readonly string[]).includes(langFromUrl)) {
        console.log(`[Language] Detected language from URL parameter: ${langFromUrl}`);
        return { ...defaultSettings, language: langFromUrl as Language };
    }

    // 3. No language in URL. Detect the browser's language.
    const browserLang = navigator.language.split('-')[0];
    if ((SupportedLanguages as readonly string[]).includes(browserLang)) {
        console.log(`[Language] Detected browser language: ${browserLang}`);
        return { ...defaultSettings, language: browserLang as Language };
    }

    // 4. If all else fails, use the hardcoded fallback language.
    console.log(`[Language] No supported language detected. Using fallback: ${FALLBACK_LANGUAGE}`);
    return { ...defaultSettings, language: FALLBACK_LANGUAGE };
};

interface SettingsContextType {
    settings: Settings;
    updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
    saveSettings: (newSettings: Settings) => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // The useState initializer now calls our robust function once.
    const [settings, setSettings] = useState<Settings>(getInitialSettings);

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
