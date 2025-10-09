"use client";

import { FormEvent, useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { getDataToDateTimeLocal } from "@/lib/date-formater";
import InputDetails from "@/components/ui/input-details";
import InputField from "@/components/ui/input-field";
import ButtonEdit from "@/components/ui/button-edit";
import { signOperatingRoom } from "@/backend/api/clinical/operating-room-api";

export default function IntraoperativeProcedure({ 
  intraoperativeProcedure, 
  scheduleId 
}: {
  scheduleId: string,
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
  const [edit, setEdit] = useState<Record<string, boolean>>({
    startDate: true,
    endDate: true,
    anesthesia: true,
    technique: true,
    implants: true,
    intraoperative: true,
    fluid: true,
    medication: true,
    other: true,
  });
  const router = useRouter();
  const startTime = intraoperativeProcedure.startTime?getDataToDateTimeLocal(intraoperativeProcedure.startTime as Date):"";
  const endTime = intraoperativeProcedure.endTime?getDataToDateTimeLocal(intraoperativeProcedure.endTime as Date):"";

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

    if(submitter?.name === "update")
      for(const value of JSON.parse(submitter.dataset.location as string) as string[])
        setEdit( prev => ({...prev, [value]: !prev[value]}));
  }

  return(
      <form {...{action}} onSubmit={submitUpdate}>
        <input 
          className="hidden"
          name="scheduleId"
          defaultValue={scheduleId}
        />
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 items-center">
          <div className="flex gap-x-2 justify-between">
            <InputField
              textLabel="Horário de início"
              type="datetime-local"
              name="startTime"
              disabled={!!startTime && edit.startDate}
              defaultValue={startTime}
            />

            <InputField
              textLabel="Horário de Fim"
              type="datetime-local"
              name="endTime"
              disabled={!!endTime && edit.endDate}
              defaultValue={endTime}
            />
          </div>
          
          <InputField
            textLabel="Tipo de anestesia utilizada:"
            name="typeOfAnesthesia"
            disabled={!!intraoperativeProcedure.typeOfAnesthesia && edit.anesthesia}
            placeholder="digite o tipo de anestesia"
            defaultValue={intraoperativeProcedure.typeOfAnesthesia}
          />

          <InputDetails
            textLabel="Técnica cirúrgica aplicada"
            rows={3}
            disabled={!!intraoperativeProcedure.surgicalTechnique && edit.technique}
            name="surgicalTechnique"
            placeholder="descreva a técnica utilizada"
            defaultValue={intraoperativeProcedure.surgicalTechnique}
          />

          <InputDetails
            textLabel="Implantes/protéses utilizados"
            rows={3}
            disabled={!!intraoperativeProcedure.implantsAndProsthesesUsed && edit.implants}
            name="implantsAndProsthesesUsed"
            placeholder="Implantes e protéses"
            defaultValue={intraoperativeProcedure.implantsAndProsthesesUsed}
          />

          <InputDetails
            textLabel="Ocorrências ou complicações intraoperatórias"
            rows={3}
            disabled={!!intraoperativeProcedure.intraoperativeComplications && edit.intraoperative}
            name="intraoperativeComplications"
            placeholder="descreva as complicações intraoperatórias"
            defaultValue={intraoperativeProcedure.intraoperativeComplications}
          />

          <InputDetails
            textLabel=" Volume de fluidos administrados / perdas sanguíneas"
            rows={3}
            disabled={!!intraoperativeProcedure.fluidVolumeAndBloodLoss && edit.fluid}
            name="fluidVolumeAndBloodLoss"
            placeholder="descreva"
            defaultValue={intraoperativeProcedure.fluidVolumeAndBloodLoss}
          />

          <InputDetails
            textLabel="Medicação administrada durante e antes do fecho"
            rows={3}
            disabled={!!intraoperativeProcedure.medicationAdministered && edit.medication}
            name="medicationAdministered"
            placeholder="medicação administrada"
            defaultValue={intraoperativeProcedure.medicationAdministered}
          />

          <InputDetails
            textLabel="Outro procedimento"
            rows={3}
            disabled={!!intraoperativeProcedure.otherProcedure && edit.other}
            name="otherProcedure"
            placeholder="Descreva"
            defaultValue={intraoperativeProcedure.otherProcedure}
          />  
        </div>

        <ButtonEdit
          state={edit}
          setState={setEdit}
          value={[
            startTime, 
            endTime,
            intraoperativeProcedure.typeOfAnesthesia,
            intraoperativeProcedure.surgicalTechnique,
            intraoperativeProcedure.implantsAndProsthesesUsed,
            intraoperativeProcedure.intraoperativeComplications,
            intraoperativeProcedure.fluidVolumeAndBloodLoss,
            intraoperativeProcedure.medicationAdministered,
            intraoperativeProcedure.otherProcedure,
          ].filter(Boolean)}
          location={[
            "startDate",
            "endDate",
            "anesthesia",
            "technique",
            "implants",
            "intraoperative",
            "fluid",
            "medication",
            "other",
          ].filter(Boolean)}
        />
      </form>
  )
}