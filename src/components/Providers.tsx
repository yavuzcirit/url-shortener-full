'use client';

import { SnackbarProvider } from "notistack";
import { UrlProvider } from "@/contexts/UrlContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <SnackbarProvider 
        maxSnack={3} 
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <UrlProvider>
          {children}
        </UrlProvider>
      </SnackbarProvider>
    </LanguageProvider>
  );
} 