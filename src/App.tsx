// app.tsx

import React, { useState, useEffect } from 'react';
import { SettingsProvider, useSettings } from './hooks/useSettings';
import Header from './components/Header';
import Footer from './components/Footer';
import JokeCard from './components/JokeCard';
import AIAssistant from './components/AIAssistant';
import HelpPage from './components/HelpPage';
import Install from './components/install';
import { useTranslation } from './lib/i18n';
import { getJokeSource } from './services/jokeService';
import { JokeSource, View } from './types';
import { DEFAULT_JOKE_SOURCE_URL } from './constants';
import LoadingSpinner from './components/LoadingSpinner';
import MailTr from './components/MailTr';
import MailEn from './components/MailEn';
import PrivacyPolicy from './components/privacyPolicy';

// --- ADDED THIS ARRAY OF YOUR SUPPORTED LANGUAGES ---
const SUPPORTED_LANGUAGES = [
    'tr', 'en', 'uz', 'az', 'de', 'fr', 'zh', 'ru', 'pt', 'hi', 'es', 'ja', 'id', 'ar'
];
// ---------------------------------------------------

const MainContent: React.FC = () => {
    const { settings } = useSettings();
    const { t } = useTranslation();
    const [view, setView] = useState<View>('home');
    const [jokeSource, setJokeSource] = useState<JokeSource | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isNewsletterFormVisible, setIsNewsletterFormVisible] = useState(false);
    const [hasButtonClicked, setHasButtonClicked] = useState(false);
    const [hideNewsletterButtonPermanently, setHideNewsletterButtonPermanently] = useState(false);

    useEffect(() => {
        const clicked = localStorage.getItem('newsletterButtonClicked') === 'true';
        setHasButtonClicked(clicked);
        const hidePermanently = localStorage.getItem('hideNewsletterButtonPermanently') === 'true';
        setHideNewsletterButtonPermanently(hidePermanently);
    }, []);

    useEffect(() => {
        const fetchJokes = async () => {
            setLoading(true);
            setError(null);
            try {
                const source = await getJokeSource(settings.jokeSourceUrl || DEFAULT_JOKE_SOURCE_URL);
                setJokeSource(source);
            } catch (err) {
                console.error("Failed to fetch joke source:", err);
                setError(t('errorFetchJokes'));
            } finally {
                setLoading(false);
            }
        };
        fetchJokes();
    }, [settings.jokeSourceUrl, t]);

    const handleNewsletterClick = () => {
        setIsNewsletterFormVisible(prev => !prev);

        if (!hasButtonClicked) {
            localStorage.setItem('newsletterButtonClicked', 'true');
            setHasButtonClicked(true);
        }
    };

    const handleHidePermanently = () => {
        localStorage.setItem('hideNewsletterButtonPermanently', 'true');
        setHideNewsletterButtonPermanently(true);
        setIsNewsletterFormVisible(false);
    };

    const renderView = () => {
        if (loading) {
            return <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>;
        }
        if (error) {
            return (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md my-4" role="alert">
                    <p className="font-bold">{t('errorTitle')}</p>
                    <p>{error}</p>
                    <p className="mt-3 text-sm">{t('errorInstruction')}</p>
                </div>
            );
        }

        switch (view) {
            case 'home':
                const buttonBgClass = hasButtonClicked
                    ? 'bg-[color:var(--accent-color)]'
                    : 'bg-red-600 hover:bg-red-700';

                return (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold text-[color:var(--accent-color)]">
                                {t('currentJokes')}
                            </h1>
                            {!hideNewsletterButtonPermanently && (
                                <button
                                    type="button"
                                    onClick={handleNewsletterClick}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors text-white ${buttonBgClass}`}
                                >
                                    {t('newsletter')}
                                </button>
                            )}
                        </div>
                        <div
                          className={`transition-all duration-500 ease-in-out overflow-hidden ${isNewsletterFormVisible ? 'max-h-[1000px] opacity-100 mb-6' : 'max-h-0 opacity-0'}`}
                        >
                           {settings.language === 'tr' ? <MailTr /> : <MailEn />}
                           <button
                             onClick={handleHidePermanently}
                             className="mt-4 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                           >
                             {t('neverShowButton')}
                           </button>
                        </div>
                        <div className="space-y-6">
                            {jokeSource?.simdiki.map((url, index) => <JokeCard key={url + index} jokeUrl={url} />)}
                        </div>
                    </div>
                );
            case 'old':
                 return (
                    <div>
                        <h1 className="text-3xl font-bold mb-6 text-[color:var(--accent-color)]">{t('oldJokes')}</h1>
                        <div className="space-y-6">
                            {jokeSource?.eski.map((url, index) => <JokeCard key={url + index} jokeUrl={url} />)}
                        </div>
                    </div>
                );
            case 'ai':
                return <AIAssistant />;
            case 'help':
                return <HelpPage />;
            case 'install':
                return <Install />;
            case 'pp':
                return <PrivacyPolicy />;
            default:
                return <div>{t('pageNotFound')}</div>;
        }
    };
    
    return (
        <div className="min-h-screen flex flex-col bg-[var(--primary-bg)] text-[var(--primary-text)] font-sans">
            <Header currentView={view} setView={setView} />
            <main className="flex-grow container mx-auto px-4 py-8">
                {renderView()}
            </main>
            <Footer currentView={view} setView={setView} />
        </div>
    );
};

const ThemedApp: React.FC = () => {
    const { settings } = useSettings();
    const { t } = useTranslation();

    // THIS EFFECT SYNCS THE BROWSER URL WITH THE CURRENT LANGUAGE
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('lang') !== settings.language) {
            params.set('lang', settings.language);
            const newUrl = `${window.location.pathname}?${params.toString()}`;
            window.history.replaceState({}, '', newUrl);
        }
    }, [settings.language]);

    // This effect handles theming and NON-SEO document updates
    useEffect(() => {
        const root = document.documentElement;
        root.lang = settings.language;
        root.classList.remove('light', 'dark', 'oled');
        root.classList.add(settings.theme);
        root.style.setProperty('--accent-color', settings.secondaryColor);
        root.style.setProperty('--font-family', settings.font);
    }, [settings, t]);

    // --- NEW: Define variables for social media meta tags ---
    const pageUrl = `https://mizahimben.com/?lang=${settings.language}`;
    const siteTitle = t('siteTitle');
    const siteDescription = t('siteDescription');
    // NOTE: For best results, replace this logo with a larger image (e.g., 1200x630px).
    const imageUrl = "https://raw.githubusercontent.com/ElaConeUmutDeniz/MizahimBen/ae18144c60789a98210a44ba12853d7d412e53a5/logo.png";
    // --------------------------------------------------------

    return (
      <>
        {/* --- Primary SEO Meta Tags --- */}
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />

        {/* --- hreflang Tags for Multilingual SEO --- */}
        {SUPPORTED_LANGUAGES.map((langCode) => (
            <link
                key={langCode}
                rel="alternate"
                hrefLang={langCode}
                href={`https://mizahimben.com/?lang=${langCode}`}
            />
        ))}
        <link
            rel="alternate"
            hrefLang="x-default"
            href="https://mizahimben.com/?lang=tr"
        />

        {/* --- START: Open Graph / Facebook Meta Tags --- */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={siteDescription} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:site_name" content="Mizahım Ben" />
        {/* --- END: Open Graph Meta Tags --- */}
        
        {/* --- START: Twitter Card Meta Tags --- */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={pageUrl} />
        <meta name="twitter:title" content={siteTitle} />
        <meta name="twitter:description" content={siteDescription} />
        <meta name="twitter:image" content={imageUrl} />
        {/* --- END: Twitter Card Meta Tags --- */}

        <MainContent />
      </>
    );
}

const App: React.FC = () => {
    return (
        <SettingsProvider>
            <ThemedApp />
        </SettingsProvider>
    );
};

export default App;
