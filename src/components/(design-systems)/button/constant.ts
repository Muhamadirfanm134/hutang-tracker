export type Variant =
  | 'default'
  | 'outline'
  | 'primary'
  | 'filled'
  | 'link'
  | 'text'
  | 'danger';

export type Radius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export const variantClasses: Record<Variant, string> = {
  default:
    'border border-(--color-primary-500) text-(--color-primary-500) hover:bg-gray-100',
  outline:
    'border border-(--color-gray-200) text-(--color-gray-500) hover:bg-gray-100',
  primary:
    'bg-(--color-primary-500) text-white hover:bg-(--color-primary-400) focus:ring-1',
  filled:
    'bg-(--color-primary-100) text-(--color-primary-500) hover:bg-(--color-primary-200)',
  link: 'text-(--color-primary-500) hover:text-(--color-primary-400)',
  text: 'text-(--color-primary-500) hover:text-(--color-primary-400) hover:bg-(--color-neutral-200)',
  danger: 'bg-(--color-red-500) text-white hover:bg-(--color-red-300)',
};

export const radiusClasses: Record<Radius, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
};

export const sizeClasses: Record<Size, string> = {
  xs: 'text-xs px-2 py-1',
  sm: 'text-sm px-3 py-1.5',
  md: 'text-base px-4 py-2',
  lg: 'text-lg px-5 py-2.5',
  xl: 'text-xl px-6 py-3',
};
