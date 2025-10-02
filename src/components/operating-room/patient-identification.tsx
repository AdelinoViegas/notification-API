"use client";

import { useActionState, useEffect, useRef } from "react";
import InputDetails from "@/components/ui/input-details";
import Accordium from "@/components/ui/accordium";
import InputField from "@/components/ui/input-field";
import Button from "@/components/ui/button";
import { signOperatingRoom } from "@/backend/api/clinical/operating-room-api";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
//import { PiArchiveDuotone } from "react-icons/pi";
//import { getScheduleSugery } from "@/backend/api/clinical/scheduling-api";

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
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

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

	return (
    <form {...{action}} ref={formRef}>
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
              name="preoperative-diagnosis"
              placeholder="Descreva o diagnóstico pré-operatório"  
              defaultValue={patientIdentification.preoperativeDiagnosis} 
            />

            <Button>Salvar</Button>
        </Accordium>

        <Accordium title="Consentimento informado">
            <InputDetails
              textLabel="Descreva"
              rows={3}
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

            <Button>Salvar</Button>
        </Accordium>
      </div>
    </form>
	) 
}