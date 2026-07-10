'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { MdCheckCircle, MdClose } from 'react-icons/md';

interface Toast {
  id: number;
  message: string;
}

interface ToastContextType {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="flex items-center gap-3 rounded-xl bg-neutral-800 px-5 py-3 text-sm text-white shadow-lg ring-1 ring-neutral-700"
          >
            <MdCheckCircle size={20} className="text-green-400" />
            {toast.message}
            <button
              onClick={() =>
                setToasts((prev) => prev.filter((t) => t.id !== toast.id))
              }
            >
              <MdClose size={16} className="text-gray-500 hover:text-white" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
