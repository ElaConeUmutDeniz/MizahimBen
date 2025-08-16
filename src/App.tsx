
import React, { useState, useEffect } from 'react';
import { SettingsProvider, useSettings } from './hooks/useSettings';
import Header from './components/Header';
import Footer from './components/Footer';
import JokeCard from './components/JokeCard';
import AIAssistant from './components/AIAssistant';
import HelpPage from './components/HelpPage';
import Install from './components/install'
import { useTranslation } from './lib/i18n';
import { getJokeSource } from './services/jokeService';
import { JokeSource, View } from './types';
import { DEFAULT_JOKE_SOURCE_URL } from './constants';
import LoadingSpinner from './components/LoadingSpinner';

const MainContent: React.FC = () => {
    const { settings } = useSettings();
    const { t } = useTranslation();
    const [view, setView] = useState<View>('home');
    const [jokeSource, setJokeSource] = useState<JokeSource | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                return (
                    <div>
                        <h1 className="text-3xl font-bold mb-6 text-[color:var(--accent-color)]">{t('currentJokes')}   <a href="javascript:void(0)"
        className='ml-onclick-form flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors bg-[color:var(--accent-color)] text-white'
        onClick={() => (window as any).ml('show', 'NK0MZI', true)}
    >
        {t('newsletter')}
    </button></h1>
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
