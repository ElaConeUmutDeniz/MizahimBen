import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Settings, Theme, Language } from '../types';
import { DEFAULT_JOKE_SOURCE_URL, FONT_OPTIONS } from '../constants';

const defaultSettings: Settings = {
    theme: 'dark',
    secondaryColor: '#3b82f6', // Varsayılan renk
    font: FONT_OPTIONS[0].value,
    language: 'tr',
    jokeSourceUrl: DEFAULT_JOKE_SOURCE_URL,
    notificationsEnabled: false,
    notificationTime: '09:00',
};

interface SettingsContextType {
    settings: Settings;
    updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
    saveSettings: (newSettings: Settings) => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<Settings>(() => {
        try {
            const item = window.localStorage.getItem('mizahimben-settings');
            return item ? { ...defaultSettings, ...JSON.parse(item) } : defaultSettings;
        } catch (error) {
            console.error('Error reading settings from localStorage', error);
            return defaultSettings;
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