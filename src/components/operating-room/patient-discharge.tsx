"use client";

import { FormEvent, useActionState, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import InputField from "@/components/ui/input-field";
import ButtonEdit from "@/components/ui/button-edit";
import InputDetails from "@/components/ui/input-details";
import Accordium from "@/components/ui/accordium";
import FinishOperatingRoom from "@/components/finish-operating-room";
import { signOperatingRoom } from "@/backend/api/clinical/operating-room-api";
import { surgerySchedulingArea } from "@/backend/api/clinical/translator";
import Selection from "@/components/ui/selection";

export default function PatientDischarge({ 
  result,
  patientDischarge, 
  scheduleId,
  operatingRoomId, 
}: {
  operatingRoomId: string, 
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
  const [edit, setEdit] = useState<Record<string, boolean>>({
    info: true,
    diet: true,
    analgesia: true,
    mobilization: true,
    antibiotics: true,
  });
  const router = useRouter();

  useEffect(()=>{
    if(state.message)
      if(state.status)
        toast.success(state.message, {
          autoClose: 3500,
          onClose: ()=> router.refresh(),
        });
      else
        toast.error(state.message, {autoClose: 3500});
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

      <FinishOperatingRoom {...{operatingRoomId}} />

      <div className="flex flex-col gap-y-4 py-8">         
        <Accordium title="Estado do paciente e unidade de Destino">
          <div className="grid grid-cols-2 gap-x-4">
            <InputField
              textLabel="Estado do paciente"
              placeholder="sem estado"
              disabled
              defaultValue={result}
            />

            <Selection
              label="Unidade de Destino"
              options={surgerySchedulingArea}
              name="requestingService"
            />
          </div>
        </Accordium>
        
        <Accordium title="Informação de cirúrgica">
          <InputDetails
            textLabel="Informação de cirúgica"
            rows={3}
            disabled={!!patientDischarge.surgicalInformation && edit.info}
            name="surgicalInformation"
            placeholder="descreva"
            defaultValue={patientDischarge.surgicalInformation}
          />

          <ButtonEdit
            state={edit}
            setState={setEdit}
            value={[patientDischarge.surgicalInformation].filter(Boolean)}
            location={["info"].filter(Boolean)}
          />
        </Accordium>

        <Accordium title="Indicações pós-operatórias imediatas">
          <InputDetails
            textLabel="Dieta"
            rows={3}
            disabled={!!patientDischarge.postOperativeIndications.diet && edit.diet}
            name="diet"
            placeholder="descreva a dieta"
            defaultValue={patientDischarge.postOperativeIndications.diet}
          />

          <InputDetails
            textLabel="Analgesia"
            rows={3}
            disabled={!!patientDischarge.postOperativeIndications.analgesia && edit.analgesia}
            name="analgesia"
            placeholder="descreva a analgesia"
            defaultValue={patientDischarge.postOperativeIndications.analgesia}
          />

          <InputDetails
            textLabel="Mobilização"
            rows={3}
            disabled={!!patientDischarge.postOperativeIndications.mobilization && edit.mobilization}
            name="mobilization"
            placeholder="descreva a mobilização"
            defaultValue={patientDischarge.postOperativeIndications.mobilization}
          />

          <InputDetails
            textLabel="Antibióticos"
            rows={3}
            disabled={!!patientDischarge.postOperativeIndications.antibiotics && edit.antibiotics}
            name="antibiotics"
            placeholder="descreva a antibiótico"
            defaultValue={patientDischarge.postOperativeIndications.antibiotics}
          />

          <ButtonEdit
            state={edit}
            setState={setEdit}
            value={[
              patientDischarge.postOperativeIndications.diet,
              patientDischarge.postOperativeIndications.analgesia,
              patientDischarge.postOperativeIndications.mobilization,
              patientDischarge.postOperativeIndications.antibiotics
            ].filter(Boolean)}
            location={[
              "diet",
              "analgesia",
              "mobilization",
              "antibiotics"
            ].filter(Boolean)}
          />
        </Accordium>
      </div>
    </form>
  )
}