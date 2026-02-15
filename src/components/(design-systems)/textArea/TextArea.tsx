// components/ui/TextArea.tsx
import { TextareaHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

export type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  variant?: 'default' | 'error' | 'success';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
};

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    { className, variant = 'default', radius = 'md', disabled, ...props },
    ref
  ) => {
    const radiusClass = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      full: 'rounded-full',
    }[radius];

    return (
      <textarea
        ref={ref}
        disabled={disabled}
        className={clsx(
          'w-full border px-4 py-2 text-sm transition outline-none',
          radiusClass,
          {
            'border-gray-300 bg-white focus:ring-1 focus:ring-(--color-primary-500)':
              variant === 'default',
            'border-red-500 bg-red-50 text-(--color-red-700) placeholder-(--color-red-400) focus:ring-(--color-red-500)':
              variant === 'error',
            'border-green-500 bg-green-50 text-(--color-green-700) placeholder-(--color-green-400) focus:ring-(--color-green-500)':
              variant === 'success',
            'cursor-not-allowed opacity-50': disabled,
          },
          className
        )}
        {...props}
      />
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea;
