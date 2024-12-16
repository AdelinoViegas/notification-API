"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/components/modal';

export default function ProcessAlert(){
  const [ state, setState ] = useState(true);
  const { replace } = useRouter();

  const handlerClose = ()=>{
    setState(false);
    replace('/clinical/screening');
  }

  return(
    <div>
      <Modal
        title='Processo em uso'
        description='Desculpe, mas este processo está sendo feito por outro colega!'
        alertOnly
        onClose={handlerClose}
        open={state} 
      />
    </div>
  )
}