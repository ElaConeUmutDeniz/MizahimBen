import React, { useState, useEffect } from 'react';
import { SettingsProvider, useSettings } from './hooks/useSettings';
import Header from './components/Header';
import Footer from './components/Footer';
import JokeCard from './components/JokeCard';
import AIAssistant from './components/AIAssistant';
import HelpPage from './components/HelpPage';
import Install from './components/install'
import Language, { useTranslation } from './lib/i18n';
import { getJokeSource } from './services/jokeService';
import { JokeSource, View } from './types';
import { DEFAULT_JOKE_SOURCE_URL } from './constants';
import LoadingSpinner from './components/LoadingSpinner';
import MailTr from './components/MailTr'
import MailEn from './components/MailEn'

const MainContent: React.FC = () => {
    const { settings } = useSettings();
    const { t } = useTranslation();
    const [view, setView] = useState<View>('home');
    const [jokeSource, setJokeSource] = useState<JokeSource | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- MODIFICATION START ---
    const [isNewsletterFormVisible, setIsNewsletterFormVisible] = useState(false);
    // State to track if the button has EVER been clicked, persists in localStorage
    const [hasButtonClicked, setHasButtonClicked] = useState(false);
    // State to permanently hide the newsletter button, persists in localStorage
    const [hideNewsletterButtonPermanently, setHideNewsletterButtonPermanently] = useState(false);

    // Check localStorage on initial mount
    useEffect(() => {
        const clicked = localStorage.getItem('newsletterButtonClicked') === 'true';
        setHasButtonClicked(clicked);
        const hidePermanently = localStorage.getItem('hideNewsletterButtonPermanently') === 'true';
        setHideNewsletterButtonPermanently(hidePermanently);
    }, []);
    // --- MODIFICATION END ---


    useEffect(() => {
        const fetchJokes = async () => {
            setLoading(true);
            setError(null);
            try {
                const source = await getJokeSource(settings.jokeSourceUrl || DEFAULT_JOKE_SOURCE_URL);
                setJokeSource(source);
            } catch (err)
 {
                console.error("Failed to fetch joke source:", err);
                setError(t('errorFetchJokes'));
            } finally {
                setLoading(false);
            }
        };
        fetchJokes();
    }, [settings.jokeSourceUrl, t]);
    
    // --- MODIFICATION START ---
    // Handle the newsletter button click
    const handleNewsletterClick = () => {
        // Toggle the form visibility
        setIsNewsletterFormVisible(prev => !prev);

        // If this is the first time clicking, update state and localStorage
        if (!hasButtonClicked) {
            localStorage.setItem('newsletterButtonClicked', 'true');
            setHasButtonClicked(true);
        }
    };

    // Handle click to permanently hide the newsletter button
    const handleHidePermanently = () => {
        localStorage.setItem('hideNewsletterButtonPermanently', 'true');
        setHideNewsletterButtonPermanently(true);
        setIsNewsletterFormVisible(false); // Also hide the form
    };
    // --- MODIFICATION END ---

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
                // --- MODIFICATION START ---
                // Dynamically set the button's background color class
                const buttonBgClass = hasButtonClicked
                    ? 'bg-[color:var(--accent-color)]'
                    : 'bg-red-600 hover:bg-red-700';

                return (
                    <div>
                        {/* Flex container to align H1 and Button on the same line */}
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold text-[color:var(--accent-color)]">
                                {t('currentJokes')}
                            </h1>
                            {/* Conditionally render the newsletter button */}
                            {!hideNewsletterButtonPermanently && (
                                <button
                                    type="button"
                                    onClick={handleNewsletterClick}
                                    // Apply dynamic background and other styles
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors text-white ${buttonBgClass}`}
                                >
                                    {t('newsletter')}
                                </button>
                            )}
                        </div>

                        {/* Animated container for the MailTr component */}
                        <div
                          className={`transition-all duration-500 ease-in-out overflow-hidden ${isNewsletterFormVisible ? 'max-h-[1000px] opacity-100 mb-6' : 'max-h-0 opacity-0'}`}
                        >
                           {/* Conditionally render MailTr or MailEn based on language */}
                           {settings.language === 'tr' ? <MailTr /> : <MailEn />}
                           
                           {/* Button to permanently hide the newsletter feature */}
                           <button
                             onClick={handleHidePermanently}
                             className="mt-4 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                           >
                             {t('neverShowButton')}
                           </button>
                        </div>
                        {/* --- MODIFICATION END --- */}

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
                return <Install />
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
            <Footer />
        </div>
    );
};

const ThemedApp: React.FC = () => {
    const { settings } = useSettings();
    const { t } = useTranslation();

    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(settings.theme);
        root.style.setProperty('--accent-color', settings.secondaryColor);
        root.style.setProperty('--font-family', settings.font);

        document.title = t('siteTitle');
        const metaDesc = document.getElementById('meta-description');
        if (metaDesc) {
            metaDesc.setAttribute('content', t('siteDescription'));
        }

    }, [settings, t]);

    return <MainContent />;
}

const App: React.FC = () => {
    return (
        <SettingsProvider>
            <ThemedApp />
        </SettingsProvider>
    );
};

export default App;
