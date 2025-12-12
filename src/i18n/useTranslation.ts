'use client';

import { useState, useEffect } from 'react';
import { Language, Translations, getTranslations, detectBrowserLanguage, SUPPORTED_LANGUAGES } from './translations';

export function useTranslation() {
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState<Translations>(getTranslations('en'));

  useEffect(() => {
    // Check localStorage first for user preference
    const stored = localStorage.getItem('language') as Language | null;
    if (stored && SUPPORTED_LANGUAGES.includes(stored)) {
      setLanguage(stored);
      setTranslations(getTranslations(stored));
    } else {
      // Detect from browser
      const detected = detectBrowserLanguage();
      setLanguage(detected);
      setTranslations(getTranslations(detected));
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    setTranslations(getTranslations(lang));
    localStorage.setItem('language', lang);
  };

  return { t: translations, language, changeLanguage };
}
