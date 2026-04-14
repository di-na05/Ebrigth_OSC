import { useEffect } from 'react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
  children: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmDisabled?: boolean;
  isLoading?: boolean;
}

export function Modal({
  isOpen,
  title,
  onClose,
  onConfirm,
  children,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmDisabled = false,
  isLoading = false,
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[var(--c-card)] rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto border border-[var(--c-border)]">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-[var(--c-text)] mb-4">{title}</h2>
          <div className="mb-6">{children}</div>
          <div className="flex gap-3 justify-end">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelLabel}
            </Button>
            <Button
              variant="primary"
              onClick={onConfirm}
              disabled={confirmDisabled || isLoading}
              isLoading={isLoading}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
