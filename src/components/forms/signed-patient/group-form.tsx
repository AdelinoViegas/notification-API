"use client";

import { 
  useEffect,
  useState,
  useActionState
} from "react";
import Selection from "@/components/ui/selection";
import Button from "@/components/ui/button";
import { updatePatientGroup } from "@/backend/api/clinical/api";
import { 
  AssuredInputs,
  EmployeeInputs,
  EnterpriseInputs 
} from "@/components/forms/signed-patient/groups/inputs";
import { patientGroup as UserGroup } from "@/backend/api/clinical/translator";
import type { 
  Enterprise,
  Assured,
  Employee
 } from "@/backend/api/clinical/types";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import forceRefreshPage from "@/lib/force-refresh";

type AccessType = {
  id: string;
  type?: string;
  jsonGroup?: string;
};

export default function GroupForm({
  id,
  type,
  jsonGroup
}: AccessType){
  const [ state, action ] = useActionState(updatePatientGroup, { message: "", status: false })
  const [ inputs, setInputs ] = useState(type);
  const [ isEdit, setIsEdit ] = useState(false);

  const parsedGroup = jsonGroup?JSON.parse(jsonGroup):undefined;
  const assuredGroup = parsedGroup as Assured;
  const enterpriseGroup = parsedGroup as Enterprise;
  const employeeGroup  = parsedGroup as Employee;
  const disableEdit = ()=>setIsEdit(false);
  const router = useRouter();
  
  useEffect(()=>{
    if(state.message){
      if(state.status)
        toast.success(state.message, { 
          onOpen: ()=>{
            router.refresh();
            disableEdit();
          },
          onClose: forceRefreshPage
        });
      else
        toast.error(state.message);
    }
  }, [state]);

  return(
    <form {...{action}}>
      <input 
        type="hidden" 
        name="id" 
        value={id} 
      />
      <div className="w-96">
        <Selection
          name="group"
          label="Escolha o grupo de utentes"
          options={UserGroup}
          required
          onChange={(item)=>setInputs(item.target.value)}
          disabled={!isEdit}
          defaultValue={type}
        />
      </div>

      <div>
        { inputs === "assured" &&
          <AssuredInputs 
            disabled={!isEdit}
            {...assuredGroup}
          />
        }
        { inputs === "enterprise" && 
          <EnterpriseInputs 
            disabled={!isEdit}
            {...enterpriseGroup}
          /> 
        }
        { inputs === "employee" && 
          <EmployeeInputs
            disabled={!isEdit}
            {...employeeGroup} 
          /> 
        }
      </div>
      
      <div className="flex gap-3">
        {
          !isEdit && 
          <Button 
            type={"button"}
            onClick={()=>setIsEdit(true)}>
              Editar
          </Button>
        }
        {
          isEdit && <>
          <Button
            cancel 
            onClick={disableEdit}>
              Cancelar
          </Button>
          <Button type="submit">Actualizar</Button>
          </>
        }
      </div>
    </form>
  );
}