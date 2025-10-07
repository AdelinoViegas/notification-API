"use client";

import { useActionState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Accordium from "@/components/ui/accordium";
import Button from "@/components/ui/button";
import InputDetails from "@/components/ui/input-details";
import InputField from "@/components/ui/input-field";
import Selection from "@/components/ui/selection";
import VitalSignalInBlock from "@/components/vital-signals-block";
import { signOperatingRoom } from "@/backend/api/clinical/operating-room-api";

type recovery = {
  postAnestheticRecovery:{
    checkInTime: Date,
    vitalSignal: {
      date: Date,
      fr: number,
      pulse: number,
      spo2: number,
      ta: number,
      t: number,
    }[],
    levelofConsciousness: {
      motorActivity: number,
      respiration: number,
      circulation: number,
      consciousness: number,
      saturation: number,
      result: string,
    },
    medicationAdministered: string,
    postAnestheticEvents: string,
  }
}

export default function PostAnestheticRecovery({
scheduleId,
postAnestheticRecovery:{  
  checkInTime,
  vitalSignal,
  levelofConsciousness:{
    motorActivity,
    respiration,
    circulation,
    consciousness,
    saturation,
    result,
  },
  medicationAdministered,
  postAnestheticEvents,
}
}:recovery & {
  scheduleId: string,
}){
  const [state, action] = useActionState(signOperatingRoom, { message:"", status: false });
  const router = useRouter();
  const startDate = checkInTime?checkInTime.toISOString().slice(0, 16):"";

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
    <div className="flex flex-col gap-y-4 py-8">         
      <Accordium title="Horários de entrada">
        <form {...{action}}>
          <input 
            className="hidden"
            name="scheduleId"
            defaultValue={scheduleId}
          />

          <InputField
            className="w-96"
            textLabel="Hora de entrada"
            type="datetime-local"
            name="checkInTime"
            defaultValue={startDate}
          />

          <Button>Salvar</Button>
        </form>
      </Accordium>
      
      <VitalSignalInBlock {...{vitalSignal}} {...{scheduleId}} {...{action}}/>

      <Accordium title="Nível de conciência">
        <form {...{action}}>
          <input 
            className="hidden"
            name="scheduleId"
            defaultValue={scheduleId}
          />

          <div className="grid grid-cols-2 gap-x-4">
            <Selection
              label="Actividade Motora"
              options={[
                {_id:"0", label:"Incapaz de se mover"},
                {_id:"1", label:"Capaz de mover 2 membros"},
                {_id:"2", label:"Capaz de mover 4 membros"},
              ]}
              name="motorActivity"
              required
              defaultValue={motorActivity}
            />

            <Selection
              label="Respiração"
              options={[
                {_id:"0", label:"Apneia"},
                {_id:"1", label:"Dispneia ou respira superficial"},
                {_id:"2", label:"Respira profundamente e tosse"},
              ]}
              name="respiration"
              required
              defaultValue={respiration}
            />

            <Selection
              label="Circulação"
              options={[
                {_id:"0", label:"P/A alterada em >= 50% do valor pré-anestésico"},
                {_id:"1", label:"P/A dentro de +/-20% do valor pré-anestésico"},
                {_id:"2", label:"P/A dentro de +/-20% do valor pré-anestésico"},
              ]}
              name="circulation"
              required
              defaultValue={circulation}
            />

            <Selection
              label="Consciência"
              options={[
                {_id:"0", label:"Não desperta"},
                {_id:"1", label:"Responde a estímulo"},
                {_id:"2", label:"Acordado e orientado"},
              ]}
              name="consciousness"
              required
              defaultValue={consciousness}
            />

            <Selection
              label="Saturação O2"
              options={[
                {_id:"0", label:"SpO2 < 90% com O2"},
                {_id:"1", label:"SpO2 > 90% com O2"},
                {_id:"2", label:"SpO2 > 92% em ar ambiente"},
              ]}
              name="saturation"
              required
              defaultValue={saturation}
            />

            <InputField
              textLabel="Resultado"
              placeholder="descreva o resultado"
              disabled
              defaultValue={result}
            />
          </div>

          <Button>Salvar</Button>
        </form>
      </Accordium>
      
      <Accordium title="Medicação administrada">
        <form {...{action}}>
          <input 
            className="hidden"
            name="scheduleId"
            defaultValue={scheduleId}
          />

          <InputDetails
            textLabel="Medicação administrada"
            name="medication"
            rows={3}
            placeholder="descreva"
            defaultValue={medicationAdministered}
          />

          <Button>Salvar</Button>
        </form>
      </Accordium>

      <Accordium title="Ocorrências pós-anestésicas imediatas">
        <form {...{action}}>
          <input 
            className="hidden"
            name="scheduleId"
            defaultValue={scheduleId}
          />

          <InputDetails
            textLabel="Ocorrências pós-anestésicas imediatas"
            name="postAnestheticoccurrences"
            rows={3}
            placeholder="descreva"
            defaultValue={postAnestheticEvents}
          />

          <Button>Salvar</Button>
        </form>
      </Accordium>
    </div>
  )
}