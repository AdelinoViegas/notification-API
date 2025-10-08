"use client";

import { FormEvent, useActionState, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MdOutlineSaveAlt } from "react-icons/md";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import InputField from "@/components/ui/input-field";
import ButtonEdit from "@/components/ui/button-edit";
import InputDetails from "@/components/ui/input-details";
import Accordium from "@/components/ui/accordium";
import FinishOperatingRoom from "@/components/finish-operating-room";
import { signOperatingRoom } from "@/backend/api/clinical/operating-room-api";

export default function PatientDischarge({ 
  requestingService,
  result,
  patientDischarge, 
  scheduleId,
  operatingRoomId, 
}: {
  operatingRoomId: string, 
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
  const [edit, setEdit] = useState<Record<string, boolean>>({
    info: true,
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
            disabled={!!patientDischarge.surgicalInformation && edit.info}
            name="surgicalInformation"
            placeholder="descreva"
            defaultValue={patientDischarge.surgicalInformation}
          />

          <ButtonEdit
            state={edit}
            setState={setEdit}
            value={patientDischarge.surgicalInformation}
            location="info"
          />
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

          <Button>
            <MdOutlineSaveAlt className="w-5" />
            Salvar
          </Button>
        </Accordium>
      </div>
    </form>
  )
}