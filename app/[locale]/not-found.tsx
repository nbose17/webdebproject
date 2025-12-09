'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import Button from '@/components/shared/Button';

export default function NotFound() {
  const t = useTranslations('notFound');
  const locale = useLocale();
  const router = useRouter();

  return (
    <div className="public-page">
      <Header />
      <main className="public-main">
        <div className="container">
          <div className="not-found-container">
            <div className="not-found-content">
              <h1 className="not-found-code">{t('title')}</h1>
              <h2 className="not-found-heading">{t('heading')}</h2>
              <p className="not-found-description">{t('description')}</p>
              <div className="not-found-actions">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => router.push(`/${locale}`)}
                >
                  {t('backToHomeButton')}
                </Button>
                <Link href={`/${locale}`} className="not-found-link">
                  {t('backToHome')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

