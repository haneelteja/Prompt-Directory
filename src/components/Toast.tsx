import { useToastStore } from '@/store/useToastStore';

const typeStyles = {
  success: 'bg-[var(--color-success)]/20 border-[var(--color-success)]/50 text-[var(--color-success)]',
  error: 'bg-[var(--color-error)]/20 border-[var(--color-error)]/50 text-[var(--color-error)]',
  info: 'bg-[var(--color-accent)]/20 border-[var(--color-accent)]/50 text-[var(--color-accent)]',
};

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const remove = useToastStore((s) => s.remove);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center justify-between gap-4 px-4 py-3 rounded-lg border ${typeStyles[t.type]} animate-in slide-in-from-right`}
          role="alert"
        >
          <span className="text-sm font-medium">{t.message}</span>
          <button
            onClick={() => remove(t.id)}
            className="opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
