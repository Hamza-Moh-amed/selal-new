"use client";

import { useState, useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import { createInstance, type Resource } from "i18next";

import initTranslations from "./i18n";
import LanguageChanger from "./LanguageChanger";
// import initTranslations from "@/i18n/init";

interface ClientLanguageChangerProps {
  locale: string;
  namespaces: string[];
  resources: Resource;
}

export default function ClientLanguageChanger({
  locale,
  namespaces,
  resources,
}: ClientLanguageChangerProps) {
  const [i18nInstance, setI18nInstance] = useState<any>(null);

  useEffect(() => {
    // Create a new i18n instance and initialize it with the provided props.
    const instance = createInstance();
    initTranslations(locale, namespaces, instance, resources).then(() => {
      setI18nInstance(instance);
    });
  }, [locale, namespaces, resources]);

  if (!i18nInstance) {
    // While the translations are being loaded, you can display a loader or fallback UI.
    return <div>Loading....</div>;
  }

  return (
    <I18nextProvider i18n={i18nInstance}>
      <LanguageChanger />
    </I18nextProvider>
  );
}
