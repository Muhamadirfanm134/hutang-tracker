import React from 'react';

interface DividerProps {
  type: 'vertical' | 'horizontal';
  length?: string;
  color?: string;
  thickness?: number;
  className?: string;
}

const Divider: React.FC<DividerProps> = ({
  type,
  length,
  color = '(--color-grey-300)',
  thickness = 0.5,
  className = '',
}) => {
  const dividerStyle =
    type === 'vertical'
      ? `${length} border-l border-${color}`
      : `${length} border-t border-${color} my-2`;

  return (
    <div
      className={`flex items-center ${
        type === 'vertical' ? 'flex-col justify-center' : 'flex-row'
      } ${className}`}
    >
      <div className={dividerStyle} style={{ borderWidth: thickness }}></div>
    </div>
  );
};

export default Divider;
