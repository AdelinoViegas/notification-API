"use client";

import { useState } from 'react';
import { 
  useRouter, 
  useParams,  
} from 'next/navigation';
import Button from "@/components/ui/button";
import Modal from '@/components/modal';
import { ArchiveBoxXMarkIcon } from '@heroicons/react/24/outline';
import { changeArchived } from '@/app/backend/api/clinical/api';

export default function ArchiveButton({ invert }:{ invert?: boolean }){
  const [ state, setState ] = useState(false);
  const [ alertState, setAlertState ] = useState(false);
  const [ message, setMessage ] = useState("");
  const { replace } = useRouter();
  const { patientId }:{ patientId: string } = useParams();

  const handleConfirm = async ()=>{
    setState(false);
    const state = await changeArchived({patientId, isArchived: !!invert});
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
        className='bg-orange-500 flex items-center gap-3'
        onClick={()=>setState(true)} 
        type="button">
          <ArchiveBoxXMarkIcon className='w-5' />
          {invert?"Desarquivar Utente":"Arquivar Utente"}
      </Button>

      <Modal
        title={invert?'Desarquivar Utente':'Arquivar Utente'}
        description={invert?'Tem certeza que deseja desarquivar?':'Tem certeza que deseja arquivar?'}
        onClose={()=>setState(false)}
        onConfirm={handleConfirm}
        open={state} 
      />

      <Modal
        title='Utente Arquivado'
        description={message}
        onClose={handleClose}
        open={alertState} 
        alertOnly
      />
    </div>
  );
}