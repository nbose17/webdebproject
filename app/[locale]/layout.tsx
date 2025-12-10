import { notFound } from 'next/navigation';
import { AuthProvider } from '@/contexts/AuthContext';
import TranslationsProvider from '@/components/TranslationsProvider';
import initI18next from '../i18n';

const locales = ['en', 'ru'];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }
  
  // Initialize i18n instance and load resources
  const i18n = await initI18next(locale, 'common');
  const resources = i18n.services.resourceStore.data;

  // Nested layouts cannot have html/body - only root layout can
  return (
    <AuthProvider>
      <TranslationsProvider
        locale={locale}
        namespaces={['common']}
        resources={resources}
      >
        {children}
      </TranslationsProvider>
    </AuthProvider>
  );
}

