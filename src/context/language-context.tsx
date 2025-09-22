"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import en from '@/i18n/en.json';
import hi from '@/i18n/hi.json';
import bn from '@/i18n/bn.json';
import te from '@/i18n/te.json';

type Language = 'en' | 'hi' | 'bn' | 'te';

type Translations = { [key: string]: any };

const translations: { [key in Language]: Translations } = {
  en,
  hi,
  bn,
  te,
};

const languages = [
  { value: "en", label: "English" },
  { value: "hi", label: "हिन्दी" },
  { value: "bn", label: "বাংলা" },
  { value: "te", label: "తెలుగు" },
];

interface LanguageContextProps {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, replacements?: { [key: string]: string }) => string;
  languages: { value: string; label: string }[];
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    if (translations[lang]) {
      setLanguage(lang);
      localStorage.setItem('language', lang);
    }
  };

  const t = (key: string, replacements?: { [key: string]: string }): string => {
    const keys = key.split('.');
    let text = translations[language];
    try {
      for (const k of keys) {
        text = text[k];
      }
      if (typeof text !== 'string') return key;
      
      if (replacements) {
        return Object.keys(replacements).reduce((acc, currentKey) => {
          return acc.replace(`{{${currentKey}}}`, replacements[currentKey]);
        }, text);
      }
      return text;
    } catch (error) {
      return key;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, languages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
