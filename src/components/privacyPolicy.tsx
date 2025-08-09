import React from 'react';
import { useTranslation } from '../lib/i18n';

const pp: React.FC = () => {
    const { t } = useTranslation();
      return (
           <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-[var(--secondary-bg)] rounded-lg shadow-md border border-[var(--border-color)]">
            <h2 className="text-3xl font-bold mb-6 text-[color:var(--accent-color)]"> {t('pp1')} </h2>
            <p>{t('pp2')}</p>
            </div>

      );
}

export default pp;
