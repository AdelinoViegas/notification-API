"use client";

import { 
  useState, 
  useEffect, 
  useActionState 
} from "react";
import { useParams, useRouter } from "next/navigation";
import Alert from "@/components/ui/alert";
import Button from "@/components/ui/button";
import { putInScreening } from "@/app/backend/api/clinical/api";
import { triggerUpdate } from "@/lib/ws-trigger";

export default function Page(){
  const [ state, action ] = useActionState(putInScreening, { message: "", status: false });
  const [ messageState, setMessageState ] = useState(false);
  const urlParams:{ patientId: string } = useParams();
  const router = useRouter();
  
  useEffect(()=>{
    if(state.message){
      setMessageState(true);

      setTimeout(()=>{
        setMessageState(false);
        if(state.status){
          triggerUpdate({ target: "screening" });
          triggerUpdate({ target: "patient" });
          router.replace("/clinical/patient");
        }
      }, 3000);
    }
  }, [state, router]);

  return(
    <div>
      <form {...{action}}>
        <input type="hidden" name="patientId" value={urlParams.patientId} />
        <Button>Enviar para Triagem</Button>
      </form>
      {
        state.message && messageState &&
        <div className="flex mt-3">
          <Alert
            type={state.status?'success':'error'}
            message={state.message}
          />
        </div>
      }
    </div>
  );
}