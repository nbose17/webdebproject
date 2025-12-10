'use client';

import { useTranslation } from 'react-i18next';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import Button from '@/components/shared/Button';

export default function NotFound() {
  const { t } = useTranslation(['common']);
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();

  return (
    <div className="public-page">
      <Header />
      <main className="public-main">
        <div className="container">
          <div className="not-found-container">
            <div className="not-found-content">
              <h1 className="not-found-code">{t('notFound.title')}</h1>
              <h2 className="not-found-heading">{t('notFound.heading')}</h2>
              <p className="not-found-description">{t('notFound.description')}</p>
              <div className="not-found-actions">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => router.push(`/${locale}`)}
                >
                  {t('notFound.backToHomeButton')}
                </Button>
                <Link href={`/${locale}`} className="not-found-link">
                  {t('notFound.backToHome')}
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


