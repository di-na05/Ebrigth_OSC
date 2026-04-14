import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type ToastType = 'success' | 'warning' | 'error';

interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: ToastMessage | null;
  showToast: (message: string, type: ToastType) => void;
  clearToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToast({ id, message, type });
    
    // Auto-dismiss after 4000ms
    setTimeout(() => {
      setToast(prev => prev?.id === id ? null : prev);
    }, 4000);
  }, []);

  const clearToast = useCallback(() => {
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ toast, showToast, clearToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
