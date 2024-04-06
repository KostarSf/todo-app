import { Dialog as HDialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

type DialogProps = {
  show: boolean;
  onClose: (value: boolean) => void;
  title?: string;
  children: React.ReactNode;
};
export function Dialog({ show, onClose, title, children }: DialogProps) {
  return (
    <Transition show={show} as={Fragment}>
      <HDialog as={"div"} className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-700/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <HDialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg border border-slate-100 bg-white p-6 text-left align-middle shadow-xl shadow-slate-500/25 transition-all">
                {title && (
                  <HDialog.Title
                    as="h3"
                    className="text-center text-xl font-medium leading-6 text-slate-800"
                  >
                    {title}
                  </HDialog.Title>
                )}
                {children}
              </HDialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </HDialog>
    </Transition>
  );
}
