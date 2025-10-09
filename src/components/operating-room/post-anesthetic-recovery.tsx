"use client";

import { FormEvent, useActionState, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Accordium from "@/components/ui/accordium";
import InputDetails from "@/components/ui/input-details";
import InputField from "@/components/ui/input-field";
import Selection from "@/components/ui/selection";
import ButtonEdit from "@/components/ui/button-edit";
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
  const [edit, setEdit] = useState<Record<string, boolean>>({
    dateTime: true,
    medication: true,
    events: true,
    activity: true,
    respiration: true,
    circulation: true,
    consciousness: true,
    saturation: true,
  });
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

  const submitUpdate = (event: FormEvent) => {
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement;

    if(submitter?.name === "update")
      for(const value of JSON.parse(submitter.dataset.location as string) as string[])
        setEdit( prev => ({...prev, [value]: !prev[value]}));
  }

  return(
    <div className="flex flex-col gap-y-4 py-8">         
      <Accordium title="Horários de entrada">
        <form {...{action}} onSubmit={submitUpdate}>
          <input 
            className="hidden"
            name="scheduleId"
            defaultValue={scheduleId}
          />

          <InputField
            className="w-96"
            textLabel="Hora de entrada"
            type="datetime-local"
            disabled={!!startDate && edit.dateTime}
            name="checkInTime"
            defaultValue={startDate}
          />

          <ButtonEdit
            state={edit}
            setState={setEdit}
            value={[startDate].filter(Boolean)}
            location={["dateTime"].filter(Boolean)}
          />
        </form>
      </Accordium>
      
      <VitalSignalInBlock {...{vitalSignal}} {...{scheduleId}} {...{action}}/>

      <Accordium title="Nível de conciência">
        <form {...{action}} onSubmit={submitUpdate}>
          <input 
            className="hidden"
            name="scheduleId"
            defaultValue={scheduleId}
          />

          <div className="grid grid-cols-2 gap-x-4">
            {!edit.activity?
              <Selection
                label="Actividade Motora"
                options={[
                  {_id:"0", label:"Incapaz de se mover"},
                  {_id:"1", label:"Capaz de mover 2 membros"},
                  {_id:"2", label:"Capaz de mover 4 membros"},
                ]}
                name="motorActivity"
              />  
            :
              <InputField
              textLabel="Actividade Motora"
              disabled
              defaultValue={[
                {_id:"0", label:"Incapaz de se mover"},
                {_id:"1", label:"Capaz de mover 2 membros"},
                {_id:"2", label:"Capaz de mover 4 membros"},
              ].find( value => Number(value._id) === motorActivity)?.label}
              />
            }

            {!edit.respiration?
              <Selection
                label="Respiração"
                options={[
                  {_id:"0", label:"Apneia"},
                  {_id:"1", label:"Dispneia ou respira superficial"},
                  {_id:"2", label:"Respira profundamente e tosse"},
                ]}
                name="respiration"
              />
            :
             <InputField
              textLabel="Respiração"
              disabled
              defaultValue={[
                {_id:"0", label:"Apneia"},
                {_id:"1", label:"Dispneia ou respira superficial"},
                {_id:"2", label:"Respira profundamente e tosse"},
              ].find( value => Number(value._id) ===respiration)?.label}
             />
            }

            {!edit.circulation?
              <Selection
                label="Circulação"
                options={[
                  {_id:"0", label:"P/A alterada em >= 50% do valor pré-anestésico"},
                  {_id:"1", label:"P/A dentro de +/-20% do valor pré-anestésico"},
                  {_id:"2", label:"P/A dentro de +/-20% do valor pré-anestésico"},
                ]}
                name="circulation"
              />
            :
             <InputField
              textLabel="Circulação"
              disabled
              defaultValue={[
                {_id:"0", label:"P/A alterada em >= 50% do valor pré-anestésico"},
                {_id:"1", label:"P/A dentro de +/-20% do valor pré-anestésico"},
                {_id:"2", label:"P/A dentro de +/-20% do valor pré-anestésico"},
              ].find( value => Number(value._id) === circulation)?.label}
             />
            }

            {!edit.consciousness?<Selection
              label="Consciência"
              options={[
                {_id:"0", label:"Não desperta"},
                {_id:"1", label:"Responde a estímulo"},
                {_id:"2", label:"Acordado e orientado"},
              ]}
              name="consciousness"
            />
            :
             <InputField
              textLabel="Consciência"
              disabled
              defaultValue={[
                {_id:"0", label:"P/A alterada em >= 50% do valor pré-anestésico"},
                {_id:"1", label:"P/A dentro de +/-20% do valor pré-anestésico"},
                {_id:"2", label:"P/A dentro de +/-20% do valor pré-anestésico"},
              ].find( value => Number(value._id) === consciousness)?.label}
             />
            }

            {!edit.saturation?<Selection
              label="Saturação O2"
              options={[
                {_id:"0", label:"SpO2 < 90% com O2"},
                {_id:"1", label:"SpO2 > 90% com O2"},
                {_id:"2", label:"SpO2 > 92% em ar ambiente"},
              ]}
              name="saturation"
            />
            :
             <InputField
              textLabel="Saturação O2"
              disabled
              defaultValue={[
                {_id:"0", label:"SpO2 < 90% com O2"},
                {_id:"1", label:"SpO2 > 90% com O2"},
                {_id:"2", label:"SpO2 > 92% em ar ambiente"},
              ].find( value => Number(value._id) === saturation)?.label}
             />
            }

            <InputField
              textLabel="Resultado"
              placeholder="descreva o resultado"
              disabled
              defaultValue={result}
            />
          </div>

          <ButtonEdit
            state={edit}
            setState={setEdit}
            value={[
              String(motorActivity), 
              String(respiration), 
              String(circulation),
              String(consciousness),
              String(saturation)
            ].filter(Boolean)}
            location={[
              "activity",
              "respiration",
              "circulation",
              "consciousness",
              "saturation"
            ].filter(Boolean)}
          />
        </form>
      </Accordium>
      
      <Accordium title="Medicação administrada">
        <form {...{action}} onSubmit={submitUpdate}>
          <input 
            className="hidden"
            name="scheduleId"
            defaultValue={scheduleId}
          />

          <InputDetails
            textLabel="Medicação administrada"
            name="medication"
            rows={3}
            disabled={!!medicationAdministered && edit.medication}
            placeholder="descreva"
            defaultValue={medicationAdministered}
          />

          <ButtonEdit
            state={edit}
            setState={setEdit}
            value={[medicationAdministered].filter(Boolean)}
            location={["medication"].filter(Boolean)}
          />
        </form>
      </Accordium>

      <Accordium title="Ocorrências pós-anestésicas imediatas">
        <form {...{action}} onSubmit={submitUpdate}>
          <input 
            className="hidden"
            name="scheduleId"
            defaultValue={scheduleId}
          />

          <InputDetails
            textLabel="Ocorrências pós-anestésicas imediatas"
            name="postAnestheticoccurrences"
            rows={3}
            disabled={!!postAnestheticEvents && edit.events}
            placeholder="descreva"
            defaultValue={postAnestheticEvents}
          />

          <ButtonEdit
            state={edit}
            setState={setEdit}
            value={[postAnestheticEvents].filter(Boolean)}
            location={["events"].filter(Boolean)}
          />
        </form>
      </Accordium>
    </div>
  )
}