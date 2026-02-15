'use client';

import { OnChange, Option } from '@/lib/types';
import { truncateToOneLine } from '@/utils/stringManipulations';
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { CheckIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import Image from 'next/image';

type SelectInputProps = {
  options: Option[];
  selected?: string;
  onChange: (value: OnChange) => void;
  rounded?: 'md' | 'lg' | 'full';
  width?: string;
  icon?: React.SVGProps<SVGSVGElement>;
  className?: string;
  placeholder?: string;
  name: string;
  type?: 'primary' | 'secondary';
};

export default function SelectInput({
  options,
  selected,
  onChange,
  rounded = 'lg',
  width = '52',
  icon,
  className,
  placeholder = 'Pilih...',
  name,
  type = 'primary',
}: SelectInputProps) {
  return (
    <div className={clsx(`mx-auto w-${width}`, className)}>
      <Listbox
        value={selected}
        onChange={(value) => {
          onChange({
            name: name,
            value: value,
          });
        }}
      >
        <ListboxButton
          className={clsx(
            `relative flex w-full gap-2 rounded-${rounded} h-[44px] cursor-pointer items-center py-1.5 pr-8 pl-4 text-left text-sm/6 text-(--color-grey-800)`,
            'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25',
            `${
              type === 'primary'
                ? 'border border-gray-300 bg-white'
                : 'bg-(--color-grey-100)'
            }`
          )}
        >
          {icon && <>{icon}</>}
          {!!selected ? (
            <div>
              {truncateToOneLine(
                options.find((e) => e.value === selected)?.label || '',
                50
              )}
            </div>
          ) : (
            <div className="text-sm text-(--color-grey-500)">{placeholder}</div>
          )}
          <ChevronDownIcon
            className="group pointer-events-none absolute right-4 size-4 fill-(--color-grey-800)"
            aria-hidden="true"
          />
        </ListboxButton>
        <ListboxOptions
          anchor="bottom"
          transition
          className={clsx(
            'absolute z-110 w-(--button-width) overflow-auto rounded-xl border border-gray-300 bg-white p-1 shadow-lg [--anchor-gap:--spacing(1)] focus:outline-none',
            'transition duration-100 ease-in data-leave:data-closed:opacity-0'
          )}
        >
          {options.map((option) => (
            <ListboxOption
              key={option.id}
              value={option.value}
              className="group relative flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-(--color-grey-800)/10"
            >
              {option.icon ? (
                <Image src={option.icon} alt="icon" width={20} height={20} />
              ) : (
                <CheckIcon className="invisible size-4 fill-(--color-primary-500) group-data-selected:visible" />
              )}
              <div className="text-sm/6 text-(--color-grey-800) group-data-selected:text-(--color-primary-500)">
                {option.label}
              </div>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </div>
  );
}
