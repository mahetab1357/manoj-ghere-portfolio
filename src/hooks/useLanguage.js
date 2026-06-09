import { createContext, useContext, useState } from 'react';
import t from '../i18n/translations';

export const LangContext = createContext(null);

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used inside LangProvider');
  return ctx;
}

export function useLangProvider() {
  const [lang, setLang] = useState('en');
  return { lang, setLang, tr: t[lang] };
}
