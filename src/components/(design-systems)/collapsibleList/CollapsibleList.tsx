'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';
import { useTailwindBreakpoint } from '@/hooks/useTailwindBreakpoint';

interface Item {
  id: string;
  icon: React.ReactNode;
}

interface CollapsibleListProps {
  items: Item[];
  namespace: string;
}

const CollapsibleList: React.FC<CollapsibleListProps> = ({
  items,
  namespace,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const t = useTranslations(namespace);
  const breakpoint = useTailwindBreakpoint();

  const isMobile =
    breakpoint === null || ['xs', 'sm', 'md'].includes(breakpoint);

  const toggle = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="w-full divide-y divide-gray-200">
      {items.map((item, index) => {
        const isActive = activeIndex === index;
        return (
          <div key={item.id} className="space-y-5 py-4 max-lg:space-y-[12px]">
            <button
              onClick={() => toggle(index)}
              className="flex w-full items-center justify-between gap-[24px] text-left"
            >
              <div className="flex items-center gap-4">
                {!isMobile && (
                  <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-(--color-primary-50)">
                    {item.icon}
                  </div>
                )}
                <div className="text-lg font-semibold text-(--color-grey-800) hover:text-(--color-primary-500)">
                  {t(`question.${item.id}.title`)}
                </div>
              </div>

              <div
                className={clsx(
                  isActive && 'bg-(--color-grey-200)',
                  'flex h-[48px] w-[48px] flex-none cursor-pointer items-center justify-center rounded-full ring-1 ring-(--color-grey-300)'
                )}
              >
                {isActive ? (
                  <ChevronUpIcon className="h-6 w-6 text-gray-800" />
                ) : (
                  <ChevronDownIcon className="h-6 w-6 text-gray-800" />
                )}
              </div>
            </button>

            {isActive && (
              <div
                className="text-sm text-gray-600"
                dangerouslySetInnerHTML={{
                  __html: t.raw(`question.${item.id}.desc`),
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CollapsibleList;
