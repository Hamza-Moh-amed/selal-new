"use client";

import { I18nextProvider } from "react-i18next";
import { createInstance } from "i18next";
import initTranslations from "./i18n";
import { TranslationProviderProps } from "@/types";

export default function TranslationsProvider({
  children,
  locale,
  namespaces,
  resources,
}: TranslationProviderProps) {
  const i18n = createInstance();

  initTranslations(locale, namespaces, i18n, resources);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
