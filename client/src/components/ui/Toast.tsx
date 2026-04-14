import { useToast, type ToastType } from '../../context/ToastContext';

export function Toast() {
  const { toast, clearToast } = useToast();

  if (!toast) return null;

  const getStyles = (type: ToastType) => {
    const styleMap: Record<ToastType, { bg: string; border: string; text: string; icon: string }> = {
      success: {
        bg: 'bg-[var(--c-hover)]',
        border: 'border-l-4 border-green-500',
        text: 'text-green-400',
        icon: '✓',
      },
      warning: {
        bg: 'bg-[var(--c-hover)]',
        border: 'border-l-4 border-amber-500',
        text: 'text-amber-400',
        icon: '⚠',
      },
      error: {
        bg: 'bg-[var(--c-hover)]',
        border: 'border-l-4 border-red-500',
        text: 'text-red-400',
        icon: '✕',
      },
    };
    return styleMap[type];
  };

  const styles = getStyles(toast.type);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 ${styles.bg} ${styles.border} rounded-lg p-4 shadow-lg transition-all duration-300 animate-in slide-in-from-right max-w-sm`}
    >
      <div className="flex items-start gap-3">
        <span className={`${styles.text} font-bold text-lg flex-shrink-0`}>
          {styles.icon}
        </span>
        <div className="flex-1">
          <p className="text-[var(--c-text)] text-sm">{toast.message}</p>
        </div>
        <button
          onClick={clearToast}
          className="text-[var(--c-text3)] hover:text-[var(--c-text2)] flex-shrink-0 font-bold"
        >
          ×
        </button>
      </div>
    </div>
  );
}
