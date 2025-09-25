"use client";

import { useActionState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import InputDetails from "@/components/ui/input-details";
import Accordium from "@/components/ui/accordium";
import Button from "@/components/ui/button";
import { signOperatingRoom } from "@/backend/api/clinical/operating-room-api";

export default function SugeryPlanning({ 
  sugeryPlanning, 
  patientId 
}: {
  patientId: string,
  sugeryPlanning: {
    surgicalTeam: string,
    designatedRoom: string,
    materialsAndEquipment: string,
    implantableDevices: string,
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
      <div className="flex flex-col gap-y-3">
        <input 
          className="hidden"
          name="patientId"
          defaultValue={patientId}
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

          <Button>Salvar</Button>
        </Accordium>
        
        <Accordium title="Materiais e equipamentos necessários">
          <InputDetails
            textLabel="Materiais e equipamentos necessários"
            placeholder="Descreva"
            rows={3}
            name="materialsAndEquipment"
            defaultValue={sugeryPlanning.materialsAndEquipment}
          />

          <Button>Salvar</Button>
        </Accordium>

        <Accordium title="Dispositivos implantáveis">
          <InputDetails
            textLabel="Dispositivos implantáveis"
            placeholder="Descreva"
            rows={3}
            name="implantableDevices"
            defaultValue={sugeryPlanning.implantableDevices}
          />

          <Button>Salvar</Button>
        </Accordium>
      </div>
    </form>
  )
}