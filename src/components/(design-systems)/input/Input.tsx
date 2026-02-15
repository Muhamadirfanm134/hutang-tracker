import { InputHTMLAttributes, forwardRef, useState, ReactNode } from 'react';
import clsx from 'clsx';
import { Eye, EyeOff } from 'lucide-react';

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  variant?: 'default' | 'error' | 'success';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  size?: 'sm' | 'md' | 'lg';
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant = 'default',
      radius = 'lg',
      size = 'md',
      disabled,
      type = 'text',
      iconLeft,
      iconRight,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    const radiusClass = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      full: 'rounded-full',
    }[radius];

    const sizeClass = {
      sm: 'px-2 py-1 text-xs h-[34px]',
      md: 'px-3 py-2 text-sm h-[45px]',
      lg: 'px-4 py-3 text-base h-[50px]',
    }[size];

    return (
      <div className="relative w-full">
        {iconLeft && (
          <span className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
            {iconLeft}
          </span>
        )}

        <input
          ref={ref}
          type={inputType}
          disabled={disabled}
          className={clsx(
            'w-full border transition outline-none',
            radiusClass,
            sizeClass,
            {
              'border-gray-300 bg-white focus:ring-1 focus:ring-[var(--color-primary-500)]':
                variant === 'default',
              'border-red-500 bg-red-50 text-[var(--color-red-700)] placeholder-[var(--color-red-400)] focus:ring-[var(--color-red-500)]':
                variant === 'error',
              'border-green-500 bg-green-50 text-[var(--color-green-700)] placeholder-[var(--color-green-400)] focus:ring-[var(--color-green-500)]':
                variant === 'success',
              'cursor-not-allowed opacity-50': disabled,
              'pl-10': iconLeft,
              'pr-10': iconRight || isPassword,
            },
            className
          )}
          {...props}
        />

        {/* Icon kanan (custom atau password toggle) */}
        <span className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-400 select-none">
          {isPassword ? (
            showPassword ? (
              <EyeOff
                size={18}
                onClick={() => setShowPassword(false)}
                className="hover:text-gray-600"
              />
            ) : (
              <Eye
                size={18}
                onClick={() => setShowPassword(true)}
                className="hover:text-gray-600"
              />
            )
          ) : (
            iconRight
          )}
        </span>
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
