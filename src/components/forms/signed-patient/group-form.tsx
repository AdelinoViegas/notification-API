"use client";

import { 
  useEffect,
  useState,
  useActionState
} from "react";
import Selection from "@/components/ui/selection";
import Button from "@/components/ui/button";
import { updatePatientGroup } from "@/app/backend/api/clinical/api";
import Alert from '@/components/ui/alert';
import { 
  AssuredInputs,
  EmployeeInputs,
  EnterpriseInputs 
} from "@/components/forms/signed-patient/groups/inputs";
import forceRefreshPage from "@/lib/force-refresh";
import { patientGroup as UserGroup } from "@/app/backend/api/clinical/translator";
import type { 
  Enterprise,
  Assured,
  Employee
 } from "@/app/backend/api/clinical/types";

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
  const [ messageState, setMessageState ] = useState(false);
  const parsedGroup = jsonGroup?JSON.parse(jsonGroup):undefined;
  const assuredGroup = parsedGroup as Assured;
  const enterpriseGroup = parsedGroup as Enterprise;
  const employeeGroup  = parsedGroup as Employee;
  const disableEdit = ()=>setIsEdit(false);

  useEffect(()=>{
    if(state.message){
      setMessageState(true);

      setTimeout(()=>{
        setMessageState(false);

        if(state.status){
          disableEdit();
          forceRefreshPage();
        }
      }, 2000);
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
      {
        state.message && messageState &&
        <div className="flex mt-3">
          <Alert
            type={state.status?'success':'error'}
            message={state.message}
          />
        </div>
      }
    </form>
  );
}