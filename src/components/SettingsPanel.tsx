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

    /* allowed sources yükle */
    useEffect(() => {
        getAllowedSources().then(setAllowedSources).catch(console.error);
    }, []);

    /* settings + URL senkronizasyonu (URL ÖNCELİKLİ) */
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const sourceFromUrl = params.get('s');

        if (sourceFromUrl) {
            setLocalSettings({
                ...settings,
                jokeSourceUrl: sourceFromUrl,
            });
        } else {
            setLocalSettings(settings);
        }
    }, [settings, isOpen]);

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

    const handleSettingChange = <K extends keyof Settings>(
        key: K,
        value: Settings[K]
    ) => {
        setLocalSettings(prev => ({ ...prev, [key]: value }));

        if (key === 'jokeSourceUrl') {
            const params = new URLSearchParams(window.location.search);
            params.set('s', String(value));

            window.history.replaceState(
                null,
                '',
                `${window.location.pathname}?${params.toString()}`
            );
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}>
            <div
                className="fixed top-0 right-0 h-full w-full max-w-sm bg-[var(--primary-bg)] text-[var(--primary-text)] shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 h-full flex flex-col">
                    <h2 className="text-2xl font-bold mb-6 text-[color:var(--accent-color)]">
                        {t('settings')}
                    </h2>

                    <div className="flex-grow overflow-y-auto pr-2 space-y-6">

                        {/* THEME */}
                        <div>
                            <label className="font-semibold">{t('theme')}</label>
                            <div className="mt-2 flex bg-[var(--secondary-bg)] rounded-lg p-1">
                                <button
                                    onClick={() => handleSettingChange('theme', 'light')}
                                    className={`w-1/2 py-2 rounded-md ${localSettings.theme === 'light' ? 'bg-[var(--primary-bg)] shadow' : ''}`}
                                >
                                    <SunIcon /> {t('light')}
                                </button>
                                <button
                                    onClick={() => handleSettingChange('theme', 'dark')}
                                    className={`w-1/2 py-2 rounded-md ${localSettings.theme === 'dark' ? 'bg-gray-700 text-white shadow' : ''}`}
                                >
                                    <MoonIcon /> {t('dark')}
                                </button>
                                <button
                                    onClick={() => handleSettingChange('theme', 'oled')}
                                    className={`w-1/2 py-2 rounded-md ${localSettings.theme === 'oled' ? 'bg-gray-700 text-white shadow' : ''}`}
                                >
                                    <MoonIcon /> OLED
                                </button>
                            </div>
                        </div>



                        {/* Secondary Color */}


                        <div>


                            <label htmlFor="color-picker" className="font-semibold">{t('secondaryColor')}</label>


                            <div className="mt-2 flex items-center space-x-3">


                                <input


                                    type="color"


                                    id="color-picker"


                                    value={localSettings.secondaryColor}


                                    onChange={e => handleSettingChange('secondaryColor', e.target.value)}


                                    className="w-12 h-12 p-1 border-none rounded-lg cursor-pointer bg-transparent"


                                />


                                <div className="flex-grow p-2 rounded-lg border border-[var(--border-color)] bg-[var(--secondary-bg)]">


                                    <span className="font-mono text-sm">{localSettings.secondaryColor}</span>


                                </div>


                            </div>


                        </div>
                        {/* FONT */}
                        <div>
                            <label className="font-semibold">{t('font')}</label>
                            <select
                                value={localSettings.font}
                                onChange={(e) =>
                                    handleSettingChange('font', e.target.value)
                                }
                                className="w-full mt-2 p-2 rounded-lg border bg-[var(--secondary-bg)]"
                            >
                                {FONT_OPTIONS.map(font => (
                                    <option key={font.value} value={font.value}>
                                        {font.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* LANGUAGE */}
                        <div>
                            <label className="font-semibold">{t('language')}</label>
                            <select
                                value={localSettings.language}
                                onChange={(e) =>
                                    handleSettingChange('language', e.target.value as Language)
                                }
                                className="w-full mt-2 p-2 rounded-lg border bg-[var(--secondary-bg)]"
                            >
                                {supportedLanguages.map(lang => (
                                    <option key={lang} value={lang}>
                                        {languageName(lang)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* JOKE SOURCE */}
                        <div>
                            <label className="font-semibold">{t('jokeSource')}</label>
                            <select
                                value={localSettings.jokeSourceUrl}
                                onChange={(e) =>
                                    handleSettingChange('jokeSourceUrl', e.target.value)
                                }
                                className="w-full mt-2 p-2 rounded-lg border bg-[var(--secondary-bg)]"
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

                    <button
                        onClick={handleSave}
                        className="w-full py-3 mt-4 text-white font-bold rounded-lg bg-[color:var(--accent-color)]"
                    >
                        {showSuccess ? t('settingsSaved') : t('saveSettings')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsPanel;
