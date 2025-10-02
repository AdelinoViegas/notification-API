"use client";

import { useActionState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/ui/button";
import InputField from "@/components/ui/input-field";
import InputDetails from "@/components/ui/input-details";
import Accordium from "@/components/ui/accordium";
import { useRouter } from "next/navigation";
import { signOperatingRoom } from "@/backend/api/clinical/operating-room-api";

export default function PatientDischarge({ 
  requestingService,
  result,
  patientDischarge, 
  scheduleId 
}: {
  requestingService: string,
  result: string,
  scheduleId: string,
  patientDischarge: {
    surgicalInformation: string,
    postOperativeIndications: {
      diet: string,
      analgesia: string,
      mobilization: string,
      antibiotics: string,
    }
  }
}){
  const [state, action] = useActionState(signOperatingRoom, { message:"", status: false });
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

  return(
    <form {...{action}}>
      <input 
        className="hidden"
        name="scheduleId"
        defaultValue={scheduleId}
      />

      <Button type="button">Concluir</Button>

      <div className="flex flex-col gap-y-4 py-8">         
        <Accordium title="Estado do paciente e unidade de Destino">
          <div className="grid grid-cols-2 gap-x-4">
            <InputField
              textLabel="Estado do paciente"
              disabled
              defaultValue={result}
            />

            <InputField
              textLabel="Unidade de Destino"
              disabled
              defaultValue={requestingService}
            />
          </div>
        </Accordium>
        
        <Accordium title="Informação de cirúrgica">
          <InputDetails
            textLabel="Informação de cirúgica"
            rows={3}
            name="surgicalInformation"
            placeholder="descreva"
            defaultValue={patientDischarge.surgicalInformation}
          />

          <Button>Salvar</Button>
        </Accordium>

        <Accordium title="Indicações pós-operatórias imediatas">
          <InputDetails
            textLabel="Dieta"
            rows={3}
            name="diet"
            placeholder="descreva a dieta"
            defaultValue={patientDischarge.postOperativeIndications.diet}
          />

          <InputDetails
            textLabel="Analgesia"
            rows={3}
            name="analgesia"
            placeholder="descreva a analgesia"
            defaultValue={patientDischarge.postOperativeIndications.analgesia}
          />

          <InputDetails
            textLabel="Mobilização"
            rows={3}
            name="mobilization"
            placeholder="descreva a mobilização"
            defaultValue={patientDischarge.postOperativeIndications.mobilization}
          />

          <InputDetails
            textLabel="Antibióticos"
            rows={3}
            name="antibiotics"
            placeholder="descreva a antibiótico"
            defaultValue={patientDischarge.postOperativeIndications.antibiotics}
          />

          <Button>Salvar</Button>
        </Accordium>
      </div>
    </form>
  )
}