"use client";

import { 
  useEffect, 
  useActionState 
} from "react";
import { useParams } from "next/navigation";
import Button from "@/components/ui/button";
import { putInScreening } from "@/app/backend/api/clinical/api";

import { toast } from "react-toastify";

export default function SendToScreening(){
  const [ state, action ] = useActionState(putInScreening, { message: "", status: false });
  const urlParams:{ patientId: string } = useParams();
  
  useEffect(()=>{
    if(state.message){
      if(state.status)
        toast.success(state.message, { autoClose: 1500 })
      else
        toast.warn(state.message)
    }
  }, [state]);

  return(
    <div>
      <form {...{action}}>
        <input type="hidden" name="patientId" value={urlParams.patientId} />
        <Button>Enviar para Triagem</Button>
      </form>
    </div>
  );
}