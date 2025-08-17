// Footer.tsx

import React from 'react';
import { useTranslation } from '../lib/i18n';
import { SafeMailto } from '../lib/utils';
import { View } from '../types';

// Step 1: Define the props the Footer component will receive
interface FooterProps {
    setView: (view: View) => void;
}

// Step 2: Update the component to accept and use the props
const Footer: React.FC<FooterProps> = ({ setView }) => {
    const { t } = useTranslation();

    return (
        <footer className="bg-[var(--secondary-bg)] text-[var(--secondary-text)] py-6 mt-12 border-t border-[var(--border-color)]">
            <div className="container mx-auto px-4 text-center text-sm">
                <p className="mb-2">{t('copyright')}</p>
                <p className="mb-2 font-semibold">{t('geminiDisclaimer')}</p>
                <p className="mb-2">
                    <a href="https://www.instagram.com/MizahimBen" target="_blank" rel="noopener noreferrer">Instagram: @mizahimben</a>
                </p>
                
                {/* Step 3: Fix the onClick handler */}
                {/* It now calls the `setView` function passed in via props. */}
                {/* We also add cursor-pointer to make it look clickable. */}
                <a 
                    className="mb-2 text-blue-500 hover:underline cursor-pointer" 
                    onClick={() => setView('pp')}
                >
                    Privacy Policy
                </a>

                <p>
                    <SafeMailto email="contact@mizahimben.com">
                        {t('contact')}
                    </SafeMailto>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
