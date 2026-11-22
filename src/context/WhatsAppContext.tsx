'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';
import { LedSpec, ScreenCalculation } from '@/types/led';

export interface ActiveQuoteConfig {
  spec: LedSpec | null;
  calculation: ScreenCalculation | null;
}

interface WhatsAppContextValue {
  activeConfig: ActiveQuoteConfig | null;
  setActiveConfig: (config: ActiveQuoteConfig | null) => void;
  clearActiveConfig: () => void;
}

const WhatsAppContext = createContext<WhatsAppContextValue | undefined>(undefined);

export function WhatsAppProvider({ children }: { children: React.ReactNode }) {
  const [activeConfig, setActiveConfigState] = useState<ActiveQuoteConfig | null>(null);

  const setActiveConfig = useCallback((config: ActiveQuoteConfig | null) => {
    setActiveConfigState(config);
  }, []);

  const clearActiveConfig = useCallback(() => {
    setActiveConfigState(null);
  }, []);

  return (
    <WhatsAppContext.Provider
      value={{ activeConfig, setActiveConfig, clearActiveConfig }}
    >
      {children}
    </WhatsAppContext.Provider>
  );
}

export function useWhatsAppConfig() {
  const ctx = useContext(WhatsAppContext);
  if (!ctx) {
    throw new Error('useWhatsAppConfig debe usarse dentro de WhatsAppProvider');
  }
  return ctx;
}