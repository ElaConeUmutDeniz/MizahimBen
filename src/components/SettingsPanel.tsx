import React, { useState, useEffect } from 'react';
import { useSettings } from '../hooks/useSettings';
import { useTranslation } from '../lib/i18n';
import { FONT_OPTIONS, DEFAULT_JOKE_SOURCE_URL } from '../constants';
import { getAllowedSources } from '../services/jokeService';
import { requestNotificationPermission, scheduleJokeNotification } from '../services/notificationService';
import { AllowedSources, Settings, Language } from '../types';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
    const { settings, saveSettings } = useSettings();
    const { t, languageName, supportedLanguages } = useTranslation();
    const [localSettings, setLocalSettings] = useState<Settings>(settings);
    const [allowedSources, setAllowedSources] = useState<AllowedSources>({});
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        setLocalSettings(settings);
    }, [settings, isOpen]);

    useEffect(() => {
        getAllowedSources().then(setAllowedSources).catch(console.error);
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const sourceFromUrl = params.get('s');
        if (sourceFromUrl) {
            setLocalSettings(prev => ({
                ...prev,
                jokeSourceUrl: sourceFromUrl,
            }));
        }
    }, []);

    const handleSave = async () => {
        saveSettings(localSettings);
        if (localSettings.notificationsEnabled) {
            const permissionGranted = await requestNotificationPermission();
            if (permissionGranted) {
                scheduleJokeNotification(
                    localSettings.jokeSourceUrl,
                    localSettings.notificationTime,
                    t
                );
            }
        }
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            onClose();
        }, 1500);
    };

    const handleSettingChange = <K extends keyof Settings,>(key: K, value: Settings[K]) => {
        setLocalSettings(prev => ({ ...prev, [key]: value }));

        if (key === 'jokeSourceUrl') {
            const params = new URLSearchParams(window.location.search);
            params.set('s', localSettings.jokeSourceUrl);
            window.history.replaceState(
                {},
                '',
                `${window.location.pathname}?${params.toString()}`
            );
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}>
            <div
                className="fixed top-0 right-0 h-full w-full max-w-sm bg-[var(--primary-bg)] text-[var(--primary-text)] shadow-2xl transform transition-transform duration-300 ease-in-out"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 h-full flex flex-col">
                    <h2 className="text-2xl font-bold mb-6 text-[color:var(--accent-color)]">
                        {t('settings')}
                    </h2>

                    <div className="flex-grow overflow-y-auto pr-2 space-y-6">

                        <div>
                            <label className="font-semibold">{t('theme')}</label>
                            <div className="mt-2 flex items-center bg-[var(--secondary-bg)] rounded-lg p-1">
                                <button
                                    onClick={() => handleSettingChange('theme', 'light')}
                                    className={`w-1/2 py-2 rounded-md ${
                                        localSettings.theme === 'light'
                                            ? 'bg-[var(--primary-bg)] shadow'
                                            : ''
                                    }`}
                                >
                                    <SunIcon />
                                    <span>{t('light')}</span>
                                </button>
                                <button
                                    onClick={() => handleSettingChange('theme', 'dark')}
                                    className={`w-1/2 py-2 rounded-md ${
                                        localSettings.theme === 'dark'
                                            ? 'bg-gray-700 text-white shadow'
                                            : ''
                                    }`}
                                >
                                    <MoonIcon />
                                    <span>{t('dark')}</span>
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="font-select" className="font-semibold">
                                {t('font')}
                            </label>
                            <select
                                id="font-select"
                                value={localSettings.font}
                                onChange={e =>
                                    handleSettingChange('font', e.target.value)
                                }
                                className="w-full mt-2 p-2 rounded-lg border border-[var(--border-color)] bg-[var(--secondary-bg)]"
                            >
                                {FONT_OPTIONS.map(font => (
                                    <option key={font.value} value={font.value}>
                                        {font.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="lang-select" className="font-semibold">
                                {t('language')}
                            </label>
                            <select
                                id="lang-select"
                                value={localSettings.language}
                                onChange={e =>
                                    handleSettingChange(
                                        'language',
                                        e.target.value as Language
                                    )
                                }
                                className="w-full mt-2 p-2 rounded-lg border border-[var(--border-color)] bg-[var(--secondary-bg)]"
                            >
                                {supportedLanguages.map(lang => (
                                    <option key={lang} value={lang}>
                                        {languageName(lang)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="source-select" className="font-semibold">
                                {t('jokeSource')}
                            </label>
                            <select
                                id="source-select"
                                value={localSettings.jokeSourceUrl}
                                onChange={e =>
                                    handleSettingChange(
                                        'jokeSourceUrl',
                                        e.target.value
                                    )
                                }
                                className="w-full mt-2 p-2 rounded-lg border border-[var(--border-color)] bg-[var(--secondary-bg)]"
                            >
                                <option value={DEFAULT_JOKE_SOURCE_URL}>
                                    Mizahım Ben (Varsayılan)
                                </option>
                                {Object.entries(allowedSources).map(([name, url]) => (
                                    <option key={url} value={url}>
                                        {name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex-shrink-0 pt-4">
                        <button
                            onClick={handleSave}
                            className="w-full py-3 text-white font-bold rounded-lg transition-colors bg-[color:var(--accent-color)] hover:opacity-90"
                        >
                            {showSuccess ? t('settingsSaved') : t('saveSettings')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPanel;
