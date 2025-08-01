"use client";

import { 
  useEffect,
  useActionState 
} from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import Selection from "@/components/ui/selection";
import { enterIntoWorkplace } from "@/app/backend/api/clinical/workplace-api";
import { logout } from "@/app/backend/api/manager/api";
import { HiArrowUturnLeft as ArrowUturnLeftIcon} from "react-icons/hi2";
import { toast } from "react-toastify";

export default function WorkplaceFrom({
  units
}:{
  units: { _id: string; label: string }[]
}){
  const [ state, action ] = useActionState(enterIntoWorkplace, { message: "", status: false });
  const router = useRouter();
  const handlaBackButton = async()=> await logout();

  useEffect(()=>{
    if(state.message){
      if(state.status)
        return router.replace('/clinical');
      toast.error(state.message);
    }
  }, [state, router]);

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
    </div>
  );
}