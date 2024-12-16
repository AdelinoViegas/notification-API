"use client";

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Button from "@/components/ui/button";
import Modal from '@/components/modal';
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline';
import { closePatientProcess } from '@/app/backend/api/clinical/process-api';

export default function CloseProcess(){
  const [ state, setState ] = useState(false);
  const [ alertState, setAlertState ] = useState(false);
  const [ message, setMessage ] = useState("");
  const { replace } = useRouter();
  const { patientId }:{ patientId: string } = useParams();

  const handleConfirm = async ()=>{
    setState(false);
    const state = await closePatientProcess(patientId, "screening");
    setMessage(state.message);
    setAlertState(true);
  }

  const handleClose = ()=>{
    setAlertState(false);
    replace("/clinical/screening");
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