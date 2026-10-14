import React, { createContext, useCallback, useContext, useState } from 'react';

type SheetContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const SheetContext = createContext<SheetContextValue | undefined>(undefined);

export function SheetProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  return <SheetContext.Provider value={{ isOpen, open, close }}>{children}</SheetContext.Provider>;
}

export function useSheet() {
  const ctx = useContext(SheetContext);
  if (!ctx) throw new Error('useSheet must be used within a SheetProvider');
  return ctx;
}
