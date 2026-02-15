'use client';

import { Dialog, DialogPanel, TransitionChild } from '@headlessui/react';
import { Fragment, ReactNode } from 'react';
import ButtonV2 from '../button/Button';
import { XMarkIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';

export const Modal = ({
  isOpen,
  close,
  children,
  withCloseButton = false,
  width,
}: {
  isOpen: boolean;
  close: () => void;
  children: ReactNode;
  withCloseButton?: boolean;
  width?: string;
}) => {
  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-1000 focus:outline-none"
      onClose={close}
    >
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="transition-opacity ease-in duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-30"
            leave="transition-opacity ease-out duration-300"
            leaveFrom="opacity-30"
            leaveTo="opacity-0"
          >
            <div
              className="fixed inset-0 bg-(--color-grey-800)/50"
              aria-hidden="true"
              onClick={close}
            />
          </TransitionChild>
          <DialogPanel
            transition
            className={clsx(
              'flex flex-col items-center rounded-3xl bg-white backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0',
              withCloseButton ? 'px-10 pt-[60px] pb-10' : 'p-10',
              width ? `${width}` : 'w-full max-w-md'
            )}
          >
            {withCloseButton && (
              <ButtonV2
                variant="filled"
                icon={
                  <XMarkIcon
                    width={20}
                    className="text-(--color-primary-500)"
                  />
                }
                radius="full"
                className="absolute top-[24px] right-[24px]"
                onClick={close}
              />
            )}
            {children}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};
