"use client";

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';

import Button from '@/components/ui/button';
import { ModalContext } from '@/components/modal-context';
import clsx from 'clsx';

type ModalProps = {
  open: boolean;
  onClose: ()=>void;
  onConfirm?: ()=>void;
  title: string;
  description?: string;
  alertOnly?: boolean;
  children?: React.ReactNode;
  asWindow?: boolean;
  widthFull?: boolean;
};

export default function Modal({
  title,
  description,
  open,
  onClose,
  onConfirm,
  alertOnly,
  children,
  asWindow,
  widthFull
}: ModalProps){
  return(
    <ModalContext.Provider value={true}>
      <Dialog {...{open}} as="div" className="relative z-10 focus:outline-none" onClose={asWindow?()=>{}:onClose}>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black/30 backdrop-blur-sm">
          <div className={clsx("flex min-h-full items-center justify-center p-4",
            widthFull && "mx-auto max-w-[1024px]"
          )}>
            <DialogPanel
              transition
              className={clsx(
                "relative rounded-lg bg-white duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0 border border-gray-300 shadow-lg overflow-hidden",
                widthFull ? "w-full" : "w-full max-w-md"
              )}
            >
              {/* Header */}
              <div className="relative flex items-center px-6 pt-5 pb-4">
                <DialogTitle as="h3" className="text-xl font-bold text-gray-900 pr-8">
                  {title}
                </DialogTitle>

                {/* Botão fechar com ícone X */}
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute top-4 right-4 w-5 h-5 rounded-full border-2 border-red-400 bg-red-100 hover:bg-red-200 active:bg-red-300 transition-colors"
                  aria-label="Fechar"
                />
              </div>

              {/* Separador */}
              <hr className="border-gray-200 mx-4" />

              {/* Corpo */}
              <div className="px-6 py-4">
                {children ? children : (
                  <>
                    <p className="text-sm text-gray-700">{description}</p>
                    <div className="mt-6 flex gap-3 justify-end">
                      {!alertOnly ? (
                        <>
                          <Button cancel onClick={onClose}>Não</Button>
                          <Button onClick={onConfirm}>Sim</Button>
                        </>
                      ) : (
                        <Button onClick={onClose}>Ok</Button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </ModalContext.Provider>
  );
}