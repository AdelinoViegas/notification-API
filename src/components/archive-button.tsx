"use client";

import { useState } from 'react';
import { 
  useRouter, 
  useParams,  
} from 'next/navigation';
import Button from "@/components/ui/button";
import Modal from '@/components/modal';
import { HiArchiveBoxXMark as ArchiveBoxXMarkIcon } from 'react-icons/hi2';
import { changeArchived } from '@/backend/api/clinical/api';
import { toast } from 'react-toastify';

export default function ArchiveButton({ invert }:{ invert?: boolean }){
  const [ state, setState ] = useState(false);
  const router = useRouter();
  const params = useParams<{ patientId: string }>();

  const handleConfirm = ()=>{
    changeArchived({
      patientId: params.id, 
      isArchived: !!invert
    })
    .then(data => {
      if(data.status)
        toast.success(data.message, {
          onClose: ()=> router.replace("/clinical/screening"),
          autoClose: 1500
        });
      else 
        toast.error(data.message);
    })
    .finally(()=>setState(false));
  }
   
  return(
    <div>
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
    </div>
  );
}