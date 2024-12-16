"use client";

import { 
  useCallback,
  useEffect,
  useState,
  useActionState 
} from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import Selection from "@/components/ui/selection";
import Alert from "@/components/alert";
import { enterIntoWorkplace } from "@/app/backend/api/clinical/workplace";
import { endSession } from "@/app/backend/api/manager/api";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";

export default function WorkplaceFrom({
  units
}:{
  units: { _id: string; label: string }[]
}){
  const [ state, action ] = useActionState(enterIntoWorkplace, { message: "", status: false });
  const [ msgState, setMsgState ] = useState(false);
  const toggle = useCallback(()=> setMsgState(!msgState), [msgState]);
  const router = useRouter();
  const handlaBackButton = useCallback(async()=>{
    await endSession();
  }, []);
  useEffect(()=>{
    if(state.status)
      router.replace('/clinical');
    
    if(state.message && state.status === false){
      toggle();
      setTimeout(()=>setMsgState(false), 3000);
    }
  }, [state, router, toggle]);

  return(
    <div className="w-96 space-y-3">
      <form action={action} className="space-y-4">
        <Selection
          label="Local de Trabalho"
          options={units}
          name="workplaceId"
          required
        />
        <div className="flex justify-between">
          <Button 
            type="button"
            cancel
            onClick={handlaBackButton} 
            className="gap-3 items-center w-32">
            <ArrowUturnLeftIcon className="size-6" />
            Sair
          </Button>
          <Button className="w-32">Continuar</Button>
        </div>
      </form>

      {
        msgState &&
        <Alert 
          type={"warn"} 
          message={state.message as string} 
        />
      }
    </div>
  );

}