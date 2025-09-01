"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from "@/components/ui/button";
import Modal from '@/components/modal';
import { HiArrowUturnLeft as ArrowUturnLeftIcon } from 'react-icons/hi2';
import { closePatientProcess, openPatientProcess } from '@/backend/api/clinical/process-control';
import { toast } from 'react-toastify';
type Places = "laboratory" | "screening" | "imaging" | "urgency"; 

export function UnlockProcessAccess({
  patientId,
  place,
  basePathname,
  text
}:{
  patientId: string;
  place: Places;
  text?: string;
  basePathname: string;
}){

  const [ modalState, setModalState ] = useState(false);
  const closeModal = ()=>setModalState(false);
  const router = useRouter();

  const handlerConfirm = ()=>{
    closePatientProcess(patientId, place)
    .then(data => {
      if(data.status)
        toast.success(data.message, { 
          onOpen: () => router.replace(basePathname)
        });
      else 
        toast.error(data.message);
    })
    .finally(closeModal);
  }

  return(
    <div>
      <Button
        className='flex items-center gap-3'
        type="button" 
        onClick={()=>setModalState(true)}
        cancel
      >
        <ArrowUturnLeftIcon className='w-5' />
        {text?text:"Libertar Utente"}
      </Button>

      <Modal
        title='Libertar o Utente'
        description='Tem certeza que deseja liberar este processo?'
        onClose={closeModal}
        onConfirm={handlerConfirm}
        open={modalState} 
      />
    </div>
  );
}

export function MonitorAccess({
  basePathname,
  patientId,
  place,
}: { 
  patientId: string;
  place: Places;
  basePathname: string;
}){
  const router = useRouter();

  useEffect(()=>{
    openPatientProcess(patientId, place)
    .then(data => {
      if(data && !data.status){
        router.replace(basePathname)
        toast.warn(data.message);
      }
    });

    return;
  }, []);
  return <></>
}