import React from 'react';
import { useTranslation } from '../lib/i18n';

const Install: React.FC = () => {
    const { t } = useTranslation();
      return (
           <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-[var(--secondary-bg)] rounded-lg shadow-md border border-[var(--border-color)]">
            <h2 className="text-3xl font-bold mb-6 text-[color:var(--accent-color)]"> {t('Install1')} </h2>
            <p>{t('Install2')}</p>
            <a href="mizahimben.apk"  style={{display:'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', maxWidth: '120px', maxHeight: '50px', cursor: 'pointer' }}
  className="px-4 py-2 bg-[color:var(--accent-color)] text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
<img src="download-install-line-icon.svg" className="w-6 h-6 flex-shrink-0"/>
            {t('Install3')}</a>
            </div>

      );
}

export default Install;
