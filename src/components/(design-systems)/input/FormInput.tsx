'use client';

import { Controller, useFormContext } from 'react-hook-form';
import Input, { InputProps } from './Input';
import clsx from 'clsx';
import { CircleAlertIcon } from 'lucide-react';

type FormInputProps = InputProps & {
  name: string;
  label?: string;
  helperText?: string;
  required?: boolean;
};

export const FormInput = ({
  name,
  label,
  helperText,
  required,
  ...props
}: FormInputProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const errorMessage = errors[name]?.message as string | undefined;
  const hasError = !!errorMessage;

  return (
    <div className="flex w-full flex-col gap-1">
      {label && (
        <label
          htmlFor={name}
          className={clsx(
            'text-sm font-medium',
            hasError ? 'text-red-600' : 'text-gray-700'
          )}
        >
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input
            id={name}
            {...field}
            {...props}
            variant={hasError ? 'error' : props.variant}
          />
        )}
      />

      {hasError ? (
        <div className="flex items-center gap-1">
          <CircleAlertIcon size={14} className="text-red-500" />{' '}
          <p className="text-xs text-red-500">{errorMessage}</p>
        </div>
      ) : (
        helperText && <p className="text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
};
