import React from 'react';
import clsx from 'clsx';

interface LoadingIconProps {
  size?: number;
  color?: string;
  className?: string;
}

const LoadingIcon: React.FC<LoadingIconProps> = ({
  size = 24,
  color = '#2563eb', // Tailwind's blue-600
  className,
}) => {
  return (
    <svg
      className={clsx('animate-spin', className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill={color}
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
};

export default LoadingIcon;
