'use client';

import { createInstance, Resource } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { ReactNode } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { getOptions } from '../app/settings';

interface TranslationsProviderProps {
  children: ReactNode;
  locale: string;
  namespaces: string[];
  resources: Resource;
}

const initI18next = async (locale: string, namespaces: string[]) => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`../locales/${language}/${namespace}.json`)
      )
    )
    .init(getOptions(locale, namespaces[0]));
  return i18nInstance;
};

export default function TranslationsProvider({
  children,
  locale,
  namespaces,
  resources,
}: TranslationsProviderProps) {
  const i18n = createInstance();

  i18n
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`../locales/${language}/${namespace}.json`)
      )
    )
    .init({
      ...getOptions(locale, namespaces[0]),
      resources,
      preload: [locale],
    });

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}