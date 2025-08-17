import React from 'react';
import { useTranslation } from '../lib/i18n';
import { SafeMailto } from '../lib/utils';
import { View } from '../types';

// 1. Define props for the Footer component
interface FooterProps {
    currentView: View;
    setView: (view: View) => void;
}

// 2. Update the component to accept and use these props
const Footer: React.FC<FooterProps> = ({ currentView, setView }) => {
    const { t } = useTranslation();

    return (
        <footer className="bg-[var(--secondary-bg)] text-[var(--secondary-text)] py-6 mt-12 border-t border-[var(--border-color)]">
            <div className="container mx-auto px-4 text-center text-sm">
                <p className="mb-2">{t('copyright')}</p>
                <p className="mb-2 font-semibold">{t('geminiDisclaimer')}</p>
                <a href="https://www.instagram.com/MizahimBen">Instagram: @mizahimben</a>
<br />
                {/* 3. Fix the onClick handler to call setView */}
                <a
                    className="mb-2 text-blue-500 cursor-pointer"
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
