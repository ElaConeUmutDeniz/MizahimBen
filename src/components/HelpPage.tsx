import React from 'react';
import { useTranslation } from '../lib/i18n';

const CodeBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto text-sm my-4">
        <code className="text-gray-800 dark:text-gray-200">
            {children}
        </code>
    </pre>
);

const HelpPage: React.FC = () => {
    const { t } = useTranslation();
    
    const exampleJson = `{
  "simdiki": [
    "https://pastee.dev/d/gW6VSs4s",
    "https://example.com/markdown/yeni_mizah_2.md"
  ],
  "eski": [
    "https://example.com/markdown/eski_mizah_1.md"
  ]
}`;

    const allowedJsonExample = `{
  "Harika Mizahlar(örnek başlık)": "https://harikamizahlar.com/kaynak.json",
  "Komik Şeyler": "https://komik.net/mizahlar.json"
}`;

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-[var(--secondary-bg)] rounded-lg shadow-md border border-[var(--border-color)]">
            <h1 className="text-3xl font-bold mb-6 text-[color:var(--accent-color)]">{t('helpTitle')}</h1>
            <div className="prose dark:prose-invert max-w-none text-[var(--secondary-text)] space-y-4">
                <p>
                    {t('helpIntro')}
                </p>

                <h2 className="text-2xl font-semibold !mt-8 !mb-3">{t('helpStep1Title')}</h2>
                <p>
                    {t('helpStep1Desc1')} {' '}
                    <code># yaz</code>, {t('helpStep1Desc2')}{' '}
                    <code>![link yüklenemediğinde gösterilecek metin](resim linki)</code> {' '}
                    {t('helpStep1Desc3')} {' '}
                    <code>- yaz </code> {t('helpStep1Desc4')}{' '}
                    <code>* yaz *</code> {t('helpStep1Desc5')}
                </p>

                <h2 className="text-2xl font-semibold !mt-8 !mb-3">{t('helpStep2Title')}</h2>
                <p>
                    {t('helpStep2Desc1')}{' '}
                    <code>simdiki</code> {t('helpStep2Desc2')}{' '}
                    <code>eski</code> {t('helpStep2Desc3')}
                </p>
                <p>{t('helpExampleFormat')}</p>
                <CodeBlock>{exampleJson}</CodeBlock>

                <h2 className="text-2xl font-semibold !mt-8 !mb-3">{t('helpStep3Title')}</h2>
                <p>
                    {t('helpStep3Desc')}
                </p>

                <h2 className="text-2xl font-semibold !mt-8 !mb-3">{t('helpStep4Title')}</h2>
                <p>
                    {t('helpStep4Desc')}
                </p>

                <p>
                    {t('ContactUs')}
                </p>
            </div>
        </div>
    );
};

export default HelpPage;
