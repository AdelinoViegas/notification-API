"use client";

import { useActionState, useState, useEffect, FormEvent } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import ButtonEdit from "@/components/ui/button-edit";
import InputDetails from "@/components/ui/input-details";
import Accordium from "@/components/ui/accordium";
import InputField from "@/components/ui/input-field";
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
    consent: true, 
    responsible: true,
  });
  const router = useRouter();

  useEffect(()=>{
    if(state.message)
      if(state.status)
        toast.success(state.message, {
          onClose: ()=> router.refresh()
        });
      else
        toast.error(state.message);
  }, [state, router]);
 
  const submitUpdate = (event: FormEvent) => {
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement;

    if(submitter?.name === "update")
      for(const value of JSON.parse(submitter.dataset.location as string) as string[])
        setEdit( prev => ({...prev, [value]: !prev[value]}));
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
              value={[patientIdentification.preoperativeDiagnosis].filter(Boolean)}
              location={["diagnosis"].filter(Boolean)}
           />
        </Accordium>

        <Accordium title="Consentimento informado">
            <InputDetails
              textLabel="Descreva"
              rows={3}
              disabled={!!patientIdentification.informedConsent && edit.responsible}
              name="Informed-consent"
              placeholder="Descreva o consentimento informado" 
              defaultValue={patientIdentification.informedConsent} 
            />

            <InputField
              className="w-96"
              textLabel="Nome do responsável"
              name="responsible"
              disabled={!!patientIdentification.responsible && edit.responsible}
              placeholder="Digite o responsável do paciente"
              defaultValue={patientIdentification.responsible} 
            />

           <ButtonEdit
              state={edit}
              setState={setEdit}
              value={[
                patientIdentification.informedConsent, 
                patientIdentification.responsible
              ].filter(Boolean)}
              location={["consent", "responsible"].filter(Boolean)}
           />
        </Accordium>
      </div>
    </form>
	) 
}