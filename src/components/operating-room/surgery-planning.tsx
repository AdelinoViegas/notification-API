"use client";

import { FormEvent, useActionState, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { MdOutlineSaveAlt } from "react-icons/md";
import { useRouter } from "next/navigation";
import InputDetails from "@/components/ui/input-details";
import Accordium from "@/components/ui/accordium";
import Button from "@/components/ui/button";
import ButtonEdit from "@/components/ui/button-edit";
import { signOperatingRoom } from "@/backend/api/clinical/operating-room-api";

export default function SugeryPlanning({ 
  sugeryPlanning, 
  scheduleId 
}: {
  scheduleId: string,
  sugeryPlanning: {
    surgicalTeam: string,
    designatedRoom: string,
    materialsAndEquipment: string,
    implantableDevices: string,
  }
}){
  const [state, action] = useActionState(signOperatingRoom, { message:"", status: false });
  const [edit, setEdit] = useState<Record<string, boolean>>({
    equipment: true,
    devices: true,

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
      <div className="flex flex-col gap-y-3">
        <input 
          className="hidden"
          name="scheduleId"
          defaultValue={scheduleId}
        />

        <Accordium title="Equipa cirúrgica e sala">
          <InputDetails
            textLabel="Equipa cirúrgica"
            placeholder="Descreva a equipa"
            rows={3}
            name="surgicalTeam"
            defaultValue={sugeryPlanning.surgicalTeam}
          />

          <InputDetails
            textLabel="Sala designada"
            placeholder="Descreva a sala"
            rows={3}
            name="designatedRoom"
            defaultValue={sugeryPlanning.designatedRoom}
          />

          <Button>
            <MdOutlineSaveAlt className="w-5" />
            Salvar
          </Button>
        </Accordium>
        
        <Accordium title="Materiais e equipamentos necessários">
          <InputDetails
            textLabel="Materiais e equipamentos necessários"
            placeholder="Descreva"
            rows={3}
            disabled={!!sugeryPlanning.materialsAndEquipment && edit.equipment}
            name="materialsAndEquipment"
            defaultValue={sugeryPlanning.materialsAndEquipment}
          />

          <ButtonEdit
            state={edit}
            setState={setEdit}
            value={sugeryPlanning.materialsAndEquipment}
            location="equipment"
          />
        </Accordium>

        <Accordium title="Dispositivos implantáveis">
          <InputDetails
            textLabel="Dispositivos implantáveis"
            placeholder="Descreva"
            rows={3}
            disabled={!!sugeryPlanning.implantableDevices && edit.equipment}
            name="implantableDevices"
            defaultValue={sugeryPlanning.implantableDevices}
          />

          <ButtonEdit
            state={edit}
            setState={setEdit}
            value={sugeryPlanning.implantableDevices}
            location="devices"
          />
        </Accordium>
      </div>
    </form>
  )
}