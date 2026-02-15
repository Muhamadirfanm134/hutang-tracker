import {
  Dialog,
  DialogTitle,
  Transition,
  TransitionChild,
} from '@headlessui/react';
import { Fragment } from 'react';
import Divider from '../divider/Divider';

type DrawerTopProps = {
  header?: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DrawerTop({
  header,
  children,
  isOpen,
  setIsOpen,
}: DrawerTopProps) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        static
        onClose={() => setIsOpen(false)}
        className="relative z-10000"
      >
        <div className="fixed inset-0 flex w-full">
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
            enterFrom="-translate-y-full"
            enterTo="translate-y-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-y-0"
            leaveTo="-translate-y-full"
          >
            <div className="relative z-50 mb-40 flex h-auto w-full flex-col rounded-b-2xl bg-white text-left max-sm:mb-20">
              <DialogTitle className="p-4 text-2xl font-bold text-(--color-primary-500) md:text-4xl">
                {header}
              </DialogTitle>

              <Divider type="horizontal" length="w-full !-mt-1" />

              <div className="no-scrollbar mb-[10] flex h-full w-full flex-col overflow-y-scroll px-4">
                {children}
              </div>

              <div className="mb-5 text-center text-gray-400">
                version: {process.env.NEXT_PUBLIC_RELEASE_TAG}
              </div>

              <div className="flex flex-col items-center">
                <div className="mb-[10] h-[5] w-[100] rounded-full bg-gray-500" />
              </div>
            </div>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
