"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from "@/components/ui/button";
import Modal from '@/components/modal';
import { HiArrowUturnLeft as ArrowUturnLeftIcon } from 'react-icons/hi2';
import { closePatientProcess } from '@/app/backend/api/clinical/process-api';

export default function CloseProcess({
  patientId,
  path,
  location
}:{
  patientId: string;
  path: string;
  location: string;
}){
  const [ state, setState ] = useState(false);
  const [ alertState, setAlertState ] = useState(false);
  const [ message, setMessage ] = useState("");
  const { replace } = useRouter();

  const handleConfirm = async ()=>{
    setState(false);
    const state = await closePatientProcess(patientId, location);
    setMessage(state.message);
    setAlertState(true);
  }

  const handleClose = ()=>{
    setAlertState(false);
    replace(path);
  }

  return(
    <div className="my-3">
      <Button
        className='flex items-center gap-3'
        onClick={()=>setState(true)} 
        type="button" 
        cancel>
          <ArrowUturnLeftIcon className='w-5' />
          Libertar Utente
      </Button>

      <Modal
        title='Libertar o Utente'
        description='Tem certeza que deseja liberar este processo?'
        onClose={()=>setState(false)}
        onConfirm={handleConfirm}
        open={state} 
      />

      <Modal
        title='Utente Lisbertado'
        description={message}
        onClose={handleClose}
        open={alertState} 
        alertOnly
      />
    </div>
  );
}