
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
    "https://example.com/markdown/yeni_mizah_1.md",
    "https://example.com/markdown/yeni_mizah_2.md"
  ],
  "eski": [
    "https://example.com/markdown/eski_mizah_1.md"
  ]
}`;

    const allowedJsonExample = `{
  "Harika Mizahlar": "https://harikamizahlar.com/kaynak.json",
  "Komik Şeyler": "https://komik.net/mizahlar.json"
}`;

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-[var(--secondary-bg)] rounded-lg shadow-md border border-[var(--border-color)]">
            <h1 className="text-3xl font-bold mb-6 text-[color:var(--accent-color)]">{t('helpTitle')}</h1>
            <div className="prose dark:prose-invert max-w-none text-[var(--secondary-text)] space-y-4">
                <p>
                    Mizahım Ben, farklı kaynaklardan mizahları gösterebilen esnek bir platformdur. Kendi mizah koleksiyonunuzu oluşturup siteye eklemek için aşağıdaki adımları izleyebilirsiniz.
                </p>

                <h2 className="text-2xl font-semibold !mt-8 !mb-3">Adım 1: Mizahlarınızı Yazın</h2>
                <p>
                    Her bir mizahınızı ayrı bir Markdown (.md) dosyasına yazın. Markdown, metni kolayca formatlamanıza olanak tanır. Örneğin, başlıklar için <code>#</code>, listeler için <code>-</code> veya <code>*</code> kullanabilirsiniz. Bu dosyaları internet üzerinden erişilebilecek bir yere yüklemelisiniz (örneğin, GitHub Gist, Pastebin veya kendi web sunucunuz).
                </p>

                <h2 className="text-2xl font-semibold !mt-8 !mb-3">Adım 2: Kaynak JSON Dosyasını Oluşturun</h2>
                <p>
                    Tüm mizahlarınızın linklerini içeren bir JSON dosyası oluşturmanız gerekmektedir. Bu dosya, <code>simdiki</code> (ana sayfada görünecekler) ve <code>eski</code> (arşivde görünecekler) adında iki anahtar içermelidir. Bu anahtarların değeri, Markdown dosyalarınızın direkt linklerini içeren birer dizi (array) olmalıdır.
                </p>
                <p>İşte bir örnek format:</p>
                <CodeBlock>{exampleJson}</CodeBlock>

                <h2 className="text-2xl font-semibold !mt-8 !mb-3">Adım 3: Kaynağınızı Ekleyin</h2>
                <p>
                    Oluşturduğunuz JSON dosyasını da internet üzerinden erişilebilir bir yere yükleyin. Ardından, Mizahım Ben sitesindeki Ayarlar panelinden "Üçüncü Parti Kaynak" seçeneğini kullanarak bu JSON dosyanızın linkini girebilir ve kendi mizahlarınızı görüntüleyebilirsiniz.
                </p>

                 <h2 className="text-2xl font-semibold !mt-8 !mb-3">Adım 4: Kaynağınızı Listeletmek (İsteğe Bağlı)</h2>
                <p>
                    Eğer mizah kaynağınızın herkesin görebileceği "Mizah Kaynağı" listesinde yer almasını istiyorsanız, bize e-posta yoluyla ulaşabilirsiniz. Kaynağınız incelendikten sonra uygun görülürse resmi listeye eklenecektir. Bu liste, <a href="https://raw.githubusercontent.com/ElaConeUmutDeniz/MizahimBen/main/mizahimben_officalmizahlar/allowed.json" target="_blank" rel="noopener noreferrer" className="text-[color:var(--accent-color)] hover:underline">bu dosyaya</a> benzer bir yapıda olmalıdır:
                </p>
                <CodeBlock>{allowedJsonExample}</CodeBlock>

                <p>
                    Herhangi bir sorunuz olursa, iletişim e-posta adresimizden bize ulaşmaktan çekinmeyin.
                </p>
            </div>
        </div>
    );
};

export default HelpPage;