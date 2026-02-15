import {
  Description,
  Dialog,
  DialogTitle,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import { Fragment } from 'react';

type DrawerProps = {
  header?: React.ReactNode;
  description?: string;
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Drawer({
  header,
  description = '',
  children,
  isOpen,
  setIsOpen,
}: DrawerProps) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog static onClose={() => setIsOpen(false)} className="relative z-30">
        <div className="fixed inset-0 flex h-full w-full">
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
              onClick={() => setIsOpen(false)}
            />
          </TransitionChild>

          <TransitionChild
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="z-50 flex w-[70vw] flex-col justify-between overflow-hidden rounded-r-2xl bg-white text-left md:w-sm lg:w-md">
              <DialogTitle className="flex items-center justify-center p-5 text-2xl font-bold text-(--color-primary-500) md:text-4xl">
                {header}
              </DialogTitle>
              <div className="h-full overflow-y-scroll">
                <Description>{description}</Description>
                <div className="p-4">{children}</div>
              </div>
            </div>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
