
import React, { useState } from 'react';
import { View } from '../types';
import SettingsPanel from './SettingsPanel';
import HomeIcon from './icons/HomeIcon';
import ArchiveIcon from './icons/ArchiveIcon';
import SparklesIcon from './icons/SparklesIcon';
import BookOpenIcon from './icons/BookOpenIcon';
import CogIcon from './icons/CogIcon';
import AndroidIcon from './icons/AndroidIcon'
import { useTranslation } from '../lib/i18n';
interface HeaderProps {
    currentView: View;
    setView: (view: View) => void;
}

const NavButton: React.FC<{
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive
                ? 'bg-[color:var(--accent-color)] text-white'
                : 'text-[var(--secondary-text)] hover:bg-[var(--secondary-bg)] hover:text-[var(--primary-text)]'
        }`}
        aria-label={label}
    >
        {icon}
        <span className="hidden md:inline">{label}</span>
    </button>
);

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const { t } = useTranslation();
    return (
        <>
            <header className="bg-[var(--primary-bg)] shadow-md sticky top-0 z-20 border-b border-[var(--border-color)]">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setView('home')}>
                             <img src="https://raw.githubusercontent.com/ElaConeUmutDeniz/MizahimBen/ae18144c60789a98210a44ba12853d7d412e53a5/logo.png" alt="Mizahım Ben Logo" className="h-8 w-8"/>
                            <span className="text-xl font-bold text-[color:var(--primary-text)] hidden sm:inline">Mizahım Ben</span>
                        </div>
                        <nav className="flex items-center space-x-2 sm:space-x-4">
                            <NavButton label={t('guncel')} icon={<HomeIcon />} isActive={currentView === 'home'} onClick={() => setView('home')} />
                            <NavButton label={t('bildiriler')} icon={<ArchiveIcon />} isActive={currentView === 'old'} onClick={() => setView('old')} />
                            <NavButton label={t('yapayzeka')} icon={<SparklesIcon />} isActive={currentView === 'ai'} onClick={() => setView('ai')} />
                            <NavButton label={t('yardim')} icon={<BookOpenIcon />} isActive={currentView === 'help'} onClick={() => setView('help')} />
                            <NavButton label={t('indir')} icon={<AndroidIcon />} isActive={currentView === 'install'} onClick={() => setView('install')} />
                            
<form name="contact" netlify>
  <p>
    <label>Name <input type="text" name="name" /></label>
  </p>
  <p>
    <label>Email <input type="email" name="email" /></label>
  </p>
  <p>
    <button type="submit">Send</button>
  </p>
</form>

                            <button
                                onClick={() => setIsSettingsOpen(true)}
                                className="p-2 rounded-full text-[var(--secondary-text)] hover:bg-[var(--secondary-bg)] hover:text-[color:var(--accent-color)] transition-colors"
                                aria-label="Ayarları aç"
                            >
                                <CogIcon />
                            </button>
                        </nav>
                    </div>
                </div>
            </header>
            <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </>
    );
};

export default Header;
