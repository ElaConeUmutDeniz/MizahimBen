import React, { useState, useEffect } from 'react';
import { getJokeContent } from '../services/jokeService';
import { useSettings } from '../hooks/useSettings';
import { useTranslation } from '../lib/i18n';
import LoadingSpinner from './LoadingSpinner';

interface JokeCardProps {
    jokeUrl: string;
}

const JokeCard: React.FC<JokeCardProps> = ({ jokeUrl }) => {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { settings } = useSettings();
    const { t } = useTranslation();

    // --- NEW: Create a slug from the joke's filename ---
    // This takes a URL like "/jokes/my-funny-joke.md" and turns it into "my-funny-joke"
    const slug = jokeUrl.split('/').pop()?.replace(/\.md$/, '') || '';

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const markdown = await getJokeContent(jokeUrl);
                const unsafeHtml = (window as any).marked?.parse(markdown);
                setContent(unsafeHtml || markdown);
            } catch (err) {
                console.error(`Failed to fetch joke from ${jokeUrl}`, err);
                setError(t('errorFetchMarkdown'));
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, [jokeUrl, t]);
    
    const translateUrl = `https://translate.google.com/?sl=auto&tl=${settings.language}&text=${encodeURIComponent(content.replace(/<[^>]*>?/gm, ''))}&op=translate`;

    if (loading) {
        return (
            <div className="bg-[var(--secondary-bg)] p-6 rounded-lg shadow-md flex items-center justify-center min-h-[150px]">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                <p className="font-bold">{t('errorTitle')}</p>
                <p>{error}</p>
                <p className="mt-3 text-sm">{t('errorInstruction')}</p>
            </div>
        );
    }

    return (
        // --- MODIFIED: Added the id attribute using the generated slug ---
        <div id={slug} className="bg-[var(--secondary-bg)] p-6 rounded-lg shadow-md border border-[var(--border-color)]">
            <div className="prose dark:prose-invert max-w-none text-[var(--secondary-text)]" dangerouslySetInnerHTML={{ __html: content }} />
            
            <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
                <a 
                    href={translateUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm font-medium text-[color:var(--accent-color)] hover:underline"
                >
                    {t('translate')}
                </a>






                
   </div>
        </div>
    );
};

export default JokeCard;
