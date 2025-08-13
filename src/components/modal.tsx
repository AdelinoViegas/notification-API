"use client";

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import Button from '@/components/ui/button';
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
    <>
    <Dialog {...{open}} as="div" className="relative z-10 focus:outline-none" onClose={asWindow?()=>{}:onClose}>
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-primary/50 backdrop-blur">
          <div className={clsx("flex min-h-full items-center justify-center p-4",
            widthFull && "mx-auto max-w-[1024px]"
          )}>
            <DialogPanel
              transition
              className={clsx("rounded-xl bg-white p-6 duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0 border shadow-xl",
               widthFull?"w-full":"w-full max-w-md"
              )}
            >
              <DialogTitle as="h3" className="text-base/7 font-medium uppercase">
                {title}
              </DialogTitle>
              {
                children?children:
                <>
                  <p className="mt-2 text-sm/6">
                    {description}
                  </p>
                  <div className="mt-4 flex gap-3 justify-end">
                    { !alertOnly ?
                      <>
                        <Button cancel onClick={onClose}>Cancelar</Button>
                        <Button onClick={onConfirm}>Sim</Button> 
                      </>
                      :
                      <Button onClick={onClose}>ok</Button>
                    }
                  </div>
                </>
              }
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}