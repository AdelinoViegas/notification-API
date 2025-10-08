"use client";

import { useActionState, useState, useEffect, FormEvent } from "react";
import { toast } from "react-toastify";
import { MdOutlineSaveAlt } from "react-icons/md";
import { useRouter } from "next/navigation";
import ButtonEdit from "@/components/ui/button-edit";
import InputDetails from "@/components/ui/input-details";
import Accordium from "@/components/ui/accordium";
import InputField from "@/components/ui/input-field";
import Button from "@/components/ui/button";
import { signOperatingRoom } from "@/backend/api/clinical/operating-room-api";

export default function PatientIdentification({ 
  patientIdentification, 
  scheduleId
}: {
  scheduleId: string,
  patientIdentification: {
    preoperativeDiagnosis: string,
    informedConsent: string,
    responsible: string,
  }
}){
  const [state, action] = useActionState(signOperatingRoom, { message:"", status: false });
  const [edit, setEdit] = useState<Record<string, boolean>>({
    diagnosis: true,

  });
  const router = useRouter();

  useEffect(()=>{
    if(state.message)
      if(state.status)
        toast.success(state.message, {
          autoClose: 1500,
          onClose: ()=> router.refresh(),
        });
      else
        toast.error(state.message);
  }, [state, router]);
 
  const submitUpdate = (event: FormEvent) => {
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement;
    const location = submitter.dataset.location as string;
    
    if(submitter?.name === "update"){
      setEdit( prev => ({...prev, [location]: !prev[location]}))
    }
  }

	return (
    <form {...{action}} onSubmit={submitUpdate}>
      <input
        className="hidden"
        name="scheduleId"
        defaultValue={scheduleId}
      />

      <div className="flex flex-col gap-y-4">
        <Accordium title="Diganóstico pré-operatório">
            <InputDetails
              textLabel="Descreva"
              rows={3}
              disabled={!!patientIdentification.preoperativeDiagnosis && edit.diagnosis}
              name="preoperative-diagnosis"
              placeholder="Descreva o diagnóstico pré-operatório"  
              defaultValue={patientIdentification.preoperativeDiagnosis} 
            />

           <ButtonEdit
              state={edit}
              setState={setEdit}
              value={patientIdentification.preoperativeDiagnosis}
              location="diagnosis"
           />
        </Accordium>

        <Accordium title="Consentimento informado">
            <InputDetails
              textLabel="Descreva"
              rows={3}
              disabled={!edit}
              name="Informed-consent"
              placeholder="Descreva o consentimento informado" 
              defaultValue={patientIdentification.informedConsent} 
            />

            <InputField
              className="w-96"
              textLabel="Nome do responsável"
              name="responsible"
              placeholder="Digite o responsável do paciente"
              defaultValue={patientIdentification.responsible} 
            />

            <Button>
              <MdOutlineSaveAlt className="w-5" />
              Salvar
            </Button>
        </Accordium>
      </div>
    </form>
	) 
}