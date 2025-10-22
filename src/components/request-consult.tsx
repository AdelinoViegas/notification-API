"use client";

import Modal from "@/components/modal";
import Button from "./ui/button";
import { useState } from "react";
import Selection from "./ui/selection";
import { useParams } from "next/navigation";

export default function RequestConsult(){
  const [ state, setState ] = useState(false);
  const params = useParams<{ patientId: string }>();
  
  return(
    <>
      <Button onClick={()=>setState(true)}>Solicitar Consulta</Button>

      <Modal 
        title="Solicitação de consulta" 
        onClose={()=>setState(false)} 
        open={state}
      >
        <form>
          <Selection
            label="Tipo de Consulta"
            name="kind"
            required
            options={[]} 
          />
            { params.patientId }
          <Button>Enviar</Button>
        </form>
      </Modal>
    </>
  )
}