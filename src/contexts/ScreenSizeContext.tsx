"use client";

import React, { createContext, useState, useContext, ReactNode } from 'react';

export type ScreenSizeType = 'desktop' | 'mobile';

interface ScreenSizeContextProps {
  screenSize: ScreenSizeType;
  setScreenSize: (size: ScreenSizeType) => void;
}

// Création du contexte avec une valeur par défaut (peut être undefined ou une valeur initiale)
const ScreenSizeContext = createContext<ScreenSizeContextProps | undefined>(undefined);

// Création du Provider
export const ScreenSizeProvider = ({ children }: { children: ReactNode }) => {
  const [screenSize, setScreenSize] = useState<ScreenSizeType>('desktop'); // Défaut à 'desktop'

  return (
    <ScreenSizeContext.Provider value={{ screenSize, setScreenSize }}>
      {children}
    </ScreenSizeContext.Provider>
  );
};

// Création du Hook personnalisé
export const useScreenSize = () => {
  const context = useContext(ScreenSizeContext);
  if (context === undefined) {
    throw new Error('useScreenSize must be used within a ScreenSizeProvider');
  }
  return context;
}; 