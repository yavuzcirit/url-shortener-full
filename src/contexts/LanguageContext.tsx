'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'url.shortener': 'URL Shortener',
    'url.input': 'URL Input',
    'url.admin': 'Admin Panel',
    'url.enter': 'Enter URL',
    'url.shorten': 'Shorten',
    'url.shortened': 'Shortened URL',
    'url.copy': 'Copy',
    'url.test': 'Test',
    'url.add': 'Add New URL',
    'url.edit': 'Edit',
    'url.delete': 'Delete',
    'url.save': 'Save',
    'url.cancel': 'Cancel',
    'url.ttl': 'TTL (seconds)',
    'url.permanent': 'Permanent',
    'url.ttlHelp': 'Leave empty for permanent URL',
    'url.confirmDelete': 'Are you sure you want to delete this URL?',
    'url.addSuccess': 'URL added successfully',
    'url.deleteSuccess': 'URL deleted successfully',
    'url.error.add': 'Failed to add URL',
    'url.error.update': 'Failed to update URL',
    'url.error.delete': 'Failed to delete URL',
    'url.table.id': 'ID',
    'url.table.url': 'URL',
    'url.table.ttl': 'TTL (seconds)',
    'url.table.createdDate': 'Created Date',
    'url.table.modifiedDate': 'Modified Date',
    'url.table.actions': 'Actions',
    'url.create.title': 'Create Short URL',
    'url.create.placeholder': 'https://example.com',
    'url.create.button': 'Create Short URL',
    'url.copySuccess': 'URL copied to clipboard',
    'url.error.copy': 'Failed to copy URL',
  },
  de: {
    'url.shortener': 'URL Kürzer',
    'url.input': 'URL Eingabe',
    'url.admin': 'Admin-Bereich',
    'url.enter': 'URL eingeben',
    'url.shorten': 'Kürzen',
    'url.shortened': 'Gekürzte URL',
    'url.copy': 'Kopieren',
    'url.test': 'Testen',
    'url.add': 'Neue URL hinzufügen',
    'url.edit': 'Bearbeiten',
    'url.delete': 'Löschen',
    'url.save': 'Speichern',
    'url.cancel': 'Abbrechen',
    'url.ttl': 'TTL (Sekunden)',
    'url.permanent': 'Permanent',
    'url.ttlHelp': 'Leer lassen für permanente URL',
    'url.confirmDelete': 'Sind Sie sicher, dass Sie diese URL löschen möchten?',
    'url.addSuccess': 'URL erfolgreich hinzugefügt',
    'url.deleteSuccess': 'URL erfolgreich gelöscht',
    'url.error.add': 'Fehler beim Hinzufügen der URL',
    'url.error.update': 'Fehler beim Aktualisieren der URL',
    'url.error.delete': 'Fehler beim Löschen der URL',
    'url.table.id': 'ID',
    'url.table.url': 'URL',
    'url.table.ttl': 'TTL (Sekunden)',
    'url.table.createdDate': 'Erstellungsdatum',
    'url.table.modifiedDate': 'Änderungsdatum',
    'url.table.actions': 'Aktionen',
    'url.create.title': 'Kurz-URL erstellen',
    'url.create.placeholder': 'https://beispiel.de',
    'url.create.button': 'Kurz-URL erstellen',
    'url.copySuccess': 'URL in die Zwischenablage kopiert',
    'url.error.copy': 'Fehler beim Kopieren der URL',
  },
};

const LANGUAGE_KEY = 'preferred_language';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Get language from localStorage on initial load
    const savedLanguage = localStorage.getItem(LANGUAGE_KEY) as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'de')) {
      setLanguageState(savedLanguage);
    }
    setIsLoaded(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_KEY, lang);
  };

  const t = (key: string) => {
    const value = translations[language][key as keyof typeof translations['en']];
    return value || key;
  };

  // Don't render children until we've loaded the language preference
  if (!isLoaded) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}