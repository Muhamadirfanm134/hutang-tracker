export type ToastOptions = {
  title?: string;
  description?: string;
  duration?: number;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  position?:
    | 'bottom-right'
    | 'bottom-left'
    | 'top-right'
    | 'top-left'
    | 'top-center';
};

export function toast(opts: ToastOptions) {
  if (typeof window === 'undefined') return;
  const ev = new CustomEvent('__juwal_toast__', { detail: opts });
  window.dispatchEvent(ev as Event);
}

export default toast;
