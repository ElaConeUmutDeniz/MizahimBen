// hooks/useSettings.tsx
import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Settings, Language, SupportedLanguages } from '../types';
import { DEFAULT_JOKE_SOURCE_URL, FONT_OPTIONS } from '../constants';

const defaultSettings: Settings = {
    theme: 'dark',
    secondaryColor: '#3b82f6',
    font: FONT_OPTIONS[0].value,
    language: 'tr',
    jokeSourceUrl: DEFAULT_JOKE_SOURCE_URL,
    notificationsEnabled: false,
    notificationTime: '09:00',
};

const getInitialLanguage = (): Language => {
    const params = new URLSearchParams(window.location.search);
    const langFromUrl = params.get('lang');

    if (langFromUrl && SupportedLanguages.includes(langFromUrl as Language)) {
        return langFromUrl as Language;
    }

    const browserLang = navigator.language.split('-')[0];
    if (SupportedLanguages.includes(browserLang as Language)) {
        return browserLang as Language;
    }

    return 'en';
};

const getStoredSettings = (): Partial<Settings> => {
    try {
        const stored = localStorage.getItem('mizahimben-settings');
        return stored ? JSON.parse(stored) : {};
    } catch {
        return {};
    }
};

const getInitialJokeSource = (stored: Partial<Settings>): string => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get('s');

    if (fromUrl) return fromUrl;
    if (stored.jokeSourceUrl) return stored.jokeSourceUrl;

    return DEFAULT_JOKE_SOURCE_URL;
};

interface SettingsContextType {
    settings: Settings;
    updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
    saveSettings: (newSettings: Settings) => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<Settings>(() => {
        const stored = getStoredSettings();

        return {
            ...defaultSettings,
            ...stored, // ✅ theme, font, color vs BURADAN
            language: getInitialLanguage(),
            jokeSourceUrl: getInitialJokeSource(stored),
        };
    });

    useEffect(() => {
        localStorage.setItem('mizahimben-settings', JSON.stringify(settings));
    }, [settings]);

    const updateSetting = useCallback(
        <K extends keyof Settings>(key: K, value: Settings[K]) => {
            setSettings(prev => ({ ...prev, [key]: value }));
        },
        []
    );

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
    const ctx = React.useContext(SettingsContext);
    if (!ctx) {
        throw new Error('useSettings must be used within SettingsProvider');
    }
    return ctx;
};
