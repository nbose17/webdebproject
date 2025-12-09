import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { locales } from '@/i18n/routing';
import { AuthProvider } from '@/contexts/AuthContext';

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
  
  // Set the request locale for next-intl (must be called before getMessages)
  setRequestLocale(locale);

  // Provide all messages to the client
  const messages = await getMessages();

  // Nested layouts cannot have html/body - only root layout can
  return (
    <AuthProvider>
      <NextIntlClientProvider messages={messages}>
        {children}
      </NextIntlClientProvider>
    </AuthProvider>
  );
}

