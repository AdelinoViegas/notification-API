"use client";

import { 
  useEffect, 
  useActionState 
} from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import { putInScreening } from "@/app/backend/api/clinical/api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function SendToScreening(){
  const [ state, action ] = useActionState(putInScreening, { message: "", status: false });
  const urlParams:{ patientId: string } = useParams();
  const router = useRouter();
  
  useEffect(()=>{
    if(state.message){
      if(state.status)
        toast.success(state.message, {
          onOpen: ()=> router.replace("/clinical/patient")
        })
      else
        toast.warn(state.message)
    }
  }, [state, router]);

  return(
    <div>
      <form {...{action}}>
        <input type="hidden" name="patientId" value={urlParams.patientId} />
        <Button>Enviar para Triagem</Button>
      </form>
    </div>
  );
}