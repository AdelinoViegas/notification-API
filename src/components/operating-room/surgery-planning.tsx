"use client";

import { FormEvent, useActionState, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import InputDetails from "@/components/ui/input-details";
import Accordium from "@/components/ui/accordium";
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
    room: true, 
    team: true,
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

    if(submitter?.name === "update")
      for(const value of JSON.parse(submitter.dataset.location as string) as string[])
        setEdit( prev => ({...prev, [value]: !prev[value]}));
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
            disabled={!!sugeryPlanning.surgicalTeam && edit.team}
            name="surgicalTeam"
            defaultValue={sugeryPlanning.surgicalTeam}
          />

          <InputDetails
            textLabel="Sala designada"
            placeholder="Descreva a sala"
            rows={3}
            disabled={!!sugeryPlanning.designatedRoom && edit.room}
            name="designatedRoom"
            defaultValue={sugeryPlanning.designatedRoom}
          />

          <ButtonEdit
            state={edit}
            setState={setEdit}
            value={[
              sugeryPlanning.surgicalTeam,
              sugeryPlanning.designatedRoom
            ].filter(Boolean)}
            location={["room", "team"].filter(Boolean)}
          />
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
            value={[sugeryPlanning.materialsAndEquipment].filter(Boolean)}
            location={["equipment"].filter(Boolean)}
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
            value={[sugeryPlanning.implantableDevices].filter(Boolean)}
            location={["devices"].filter(Boolean)}
          />
        </Accordium>
      </div>
    </form>
  )
}