'use client';

import React, { createContext, useContext, useState } from 'react';
import { UrlDto } from '@/types/url';

interface UrlContextType {
  urls: UrlDto[];
  setUrls: React.Dispatch<React.SetStateAction<UrlDto[]>>;
  lastEditedUrl: UrlDto | null;
  setLastEditedUrl: React.Dispatch<React.SetStateAction<UrlDto | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const UrlContext = createContext<UrlContextType | undefined>(undefined);

export function UrlProvider({ children }: { children: React.ReactNode }) {
  const [urls, setUrls] = useState<UrlDto[]>([]);
  const [lastEditedUrl, setLastEditedUrl] = useState<UrlDto | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <UrlContext.Provider value={{
      urls,
      setUrls,
      lastEditedUrl,
      setLastEditedUrl,
      loading,
      setLoading,
    }}>
      {children}
    </UrlContext.Provider>
  );
}

export function useUrlContext() {
  const context = useContext(UrlContext);
  if (!context) {
    throw new Error('useUrlContext must be used within a UrlProvider');
  }
  return context;
}