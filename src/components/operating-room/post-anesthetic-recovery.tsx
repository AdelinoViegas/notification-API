"use client";

import { FormEvent, useActionState, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getDataToDateTimeLocal } from "@/lib/date-formater";
import { useRouter } from "next/navigation";
import Accordium from "@/components/ui/accordium";
import InputDetails from "@/components/ui/input-details";
import InputField from "@/components/ui/input-field";
import Selection from "@/components/ui/selection";
import ButtonEdit from "@/components/ui/button-edit";
import VitalSignalInBlock from "@/components/vital-signals-block";
import { signOperatingRoom, updateVitalSignals } from "@/backend/api/clinical/operating-room-api";
import { 
  activityOptions,
  circulationOptions,
  consciousnessOptions,
  respirationOptions,
  saturationOptions
} from "@/backend/api/clinical/translator";

type recovery = {
  postAnestheticRecovery:{
    checkInTime: Date,
    vitalSignal: {
      date: Date,
      fr: number,
      pulse: number,
      spo2: number,
      ta: string,
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
  const values = [motorActivity, respiration, circulation, consciousness, saturation];
  const data = values.map(value => value !== undefined?String(value):undefined);
  const [selectedId , setSelectedId] = useState("");
  const actionWrapper = useCallback( async (prevState: unknown, formData: FormData) => {
    if(selectedId) 
      return updateVitalSignals(prevState, formData);
    
    return signOperatingRoom(prevState, formData);
  },[selectedId]);
  const [state, action] = useActionState(actionWrapper, { message:"", status: false });
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
  const startDate = checkInTime?getDataToDateTimeLocal(checkInTime):"";

  useEffect(()=>{
    if(state.message)
      if(state.status)
        toast.success(state.message, {
          onClose: ()=> router.refresh()
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
/
          <InputField
            className="w-96"
            textLabel="Hora de entrada"
            type="datetime-local"
            disabled={!!startDate && edit.dateTime}
            name="checkInTime"
            defaultValue={startDate}
            required
          />

          <ButtonEdit
            state={edit}
            setState={setEdit}
            value={[startDate].filter(Boolean)}
            location={["dateTime"].filter(Boolean)}
          />
        </form>
      </Accordium>
      
      <VitalSignalInBlock
        {...{scheduleId}} 
        {...{vitalSignal}} 
        {...{action}}
        {...{selectedId}}
        {...{setSelectedId}}
      />

      <Accordium title="Nível de conciência">
        <form {...{action}} onSubmit={submitUpdate}>
          <input 
            className="hidden"
            name="scheduleId"
            defaultValue={scheduleId}
          />

          <div className="grid grid-cols-2 gap-x-4">
            {!motorActivity?.toString() || !edit.activity?
              <Selection
                label="Actividade Motora"
                options={activityOptions}
                name="motorActivity"
              />  
            :
              <InputField
              textLabel="Actividade Motora"
              disabled
              defaultValue={activityOptions.find( value => Number(value._id) === motorActivity)?.label}
              />
            }

            {!respiration?.toString() || !edit.respiration?
              <Selection
                required
                label="Respiração"
                options={respirationOptions}
                name="respiration"
              />
            :
             <InputField
              textLabel="Respiração"
              disabled
              defaultValue={respirationOptions.find( value => Number(value._id) ===respiration)?.label}
             />
            }

            {!circulation?.toString() || !edit.circulation?
              <Selection
                required
                label="Circulação"
                options={circulationOptions}
                name="circulation"
              />
            :
             <InputField
              textLabel="Circulação"
              disabled
              defaultValue={circulationOptions.find( value => Number(value._id) === circulation)?.label}
             />
            }

            {!consciousness?.toString() || !edit.consciousness?
            <Selection
              required
              label="Consciência"
              options={consciousnessOptions}
              name="consciousness"
            />
            :
             <InputField
              textLabel="Consciência"
              disabled
              defaultValue={consciousnessOptions.find( value => Number(value._id) === consciousness)?.label}
             />
            }

            {!saturation?.toString() || !edit.saturation?
            <Selection
              required
              label="Saturação O2"
              options={saturationOptions}
              name="saturation"
            />
            :
             <InputField
              textLabel="Saturação O2"
              disabled
              defaultValue={saturationOptions.find( value => Number(value._id) === saturation)?.label}
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
            value={data.filter(Boolean)}
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