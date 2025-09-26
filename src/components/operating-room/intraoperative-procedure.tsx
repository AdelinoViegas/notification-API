"use client";

import { useActionState, useEffect } from "react";
import Button from "@/components/ui/button";
import InputDetails from "@/components/ui/input-details";
import InputField from "@/components/ui/input-field";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { signOperatingRoom } from "@/backend/api/clinical/operating-room-api";

export default function IntraoperativeProcedure({ 
  intraoperativeProcedure, 
  patientId 
}: {
  patientId: string,
    intraoperativeProcedure: {
      startTime?: Date,
      endTime?: Date,
      typeOfAnesthesia: string,
      surgicalTechnique: string,
      implantsAndProsthesesUsed: string,
      intraoperativeComplications: string,
      fluidVolumeAndBloodLoss: string,
      medicationAdministered: string,
      otherProcedure: string,
    }
}){
  const [state, action] = useActionState(signOperatingRoom, { message:"", status: false });
  const router = useRouter();
  const startTime = intraoperativeProcedure.startTime?intraoperativeProcedure.startTime?.toISOString().slice(0, 16):"";
  const endTime = intraoperativeProcedure.endTime?intraoperativeProcedure.endTime?.toISOString().slice(0, 16):"";

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
          name="patientId"
          defaultValue={patientId}
        />
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 items-center">
          <div className="flex gap-x-2 justify-between">
            <InputField
              textLabel="Horário de início"
              type="datetime-local"
              name="startTime"
              defaultValue={startTime}
            />

            <InputField
              textLabel="Horário de Fim"
              type="datetime-local"
              name="endTime"
              defaultValue={endTime}
            />
          </div>
          
          <InputField
            textLabel="Tipo de anestesia utilizada:"
            name="typeOfAnesthesia"
            placeholder="digite o tipo de anestesia"
            defaultValue={intraoperativeProcedure.typeOfAnesthesia}
          />

          <InputDetails
            textLabel="Técnica cirúrgica aplicada"
            rows={3}
            name="surgicalTechnique"
            placeholder="descreva a técnica utilizada"
            defaultValue={intraoperativeProcedure.surgicalTechnique}
          />

          <InputDetails
            textLabel="Implantes/protéses utilizados"
            rows={3}
            name="implantsAndProsthesesUsed"
            placeholder="Implantes e protéses"
            defaultValue={intraoperativeProcedure.implantsAndProsthesesUsed}
          />

          <InputDetails
            textLabel="Ocorrências ou complicações intraoperatórias"
            rows={3}
            name="intraoperativeComplications"
            placeholder="descreva as complicações intraoperatórias"
            defaultValue={intraoperativeProcedure.intraoperativeComplications}
          />

          <InputDetails
            textLabel=" Volume de fluidos administrados / perdas sanguíneas"
            rows={3}
            name="fluidVolumeAndBloodLoss"
            placeholder="descreva"
            defaultValue={intraoperativeProcedure.fluidVolumeAndBloodLoss}
          />

          <InputDetails
            textLabel="Medicação administrada durante e antes do fecho"
            rows={3}
            name="medicationAdministered"
            placeholder="medicação administrada"
            defaultValue={intraoperativeProcedure.medicationAdministered}
          />

          <InputDetails
            textLabel="Outro procedimento"
            rows={3}
            name="otherProcedure"
            placeholder="Descreva"
            defaultValue={intraoperativeProcedure.otherProcedure}
          />  
        </div>

        <Button>Salvar</Button>
      </form>
  )
}