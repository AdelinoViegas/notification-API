"use client";

import { 
  useEffect,
  useActionState 
} from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import Selection, { type SelectionOption } from "@/components/ui/selection";
import { enterIntoWorkplace } from "@/backend/api/clinical/workplace-api";
import { toast } from "react-toastify";
import LogoutButton from "@/components/logout-button";

export default function WorkplaceFrom({ units }:{ units: SelectionOption[] }){
  const [ state, action ] = useActionState(enterIntoWorkplace, { message: "", status: false });
  const router = useRouter();

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
       { units.length >= 2 && 
          <Selection
            label="Local de Trabalho"
            options={units}
            name="workplaceId"
            required
          />
        }

        { units.length === 1 && <input type="hidden" name="workplaceId" value={units[0]._id} /> }

        <div className="flex justify-between items-end">
          <LogoutButton
            baseUrl={process.env.WEB_ADMIN_URL as string}
            className="bg-red-500 text-white flex gap-x-2 items-center px-3 py-2 rounded-lg hover:bg-red-400" 
          />

          <Button className="w-32">Continuar</Button>
        </div>
      </form>
    </div>
  );
}