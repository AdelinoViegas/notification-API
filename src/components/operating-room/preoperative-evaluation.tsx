"use client";

import { FormEvent, useActionState, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Accordium from "@/components/ui/accordium";
import InputDetails from "@/components/ui/input-details";
import ButtonEdit from "@/components/ui/button-edit";
import { UploadExamBlock } from "@/components/forms/upload-exam-block";
import { signOperatingRoom } from "@/backend/api/clinical/operating-room-api";

export default function PreoperativeEvaluation({ 
  preoperativeEvaluation, 
  scheduleId,
  operatingRoomId,
  patientId,
}: {
  patientId: string,
  scheduleId: string,
  operatingRoomId: string,
  preoperativeEvaluation: {
    medicalAndsurgicalHistory: string,
    allergies: string,
    laboratoryTests: {
      laboratoryStorageId: string,
      description: string,
    },
    imagingTests: {
      imagingStorageId: string,
      description: string,
    },
    currentClinicalStatus: string,
    surgicalRisk: string,
    fastingConfirmed: string,
    previousMedication: string,
  }
}){
  const [state, action] = useActionState(signOperatingRoom, { message:"", status: false });
  const [ edit, setEdit ] = useState<Record<string, boolean>>({
    medical: true,
    allergies: true,
    evaluation: true,
    risk: true,
    fasting: true,
    medication: true,
    description: true,
    result: true,
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
    <div>
      <form {...{action}} onSubmit={submitUpdate}>
        <input 
          className="hidden"
          name="scheduleId"
          defaultValue={scheduleId}
        />
        
        <div className="flex flex-col gap-y-4 pt-8">
          <Accordium title="Histórico médico e cirúrgico">
            <InputDetails
              textLabel="Descreva"
              rows={3}
              name="medicalAndsurgicalHistory"
              disabled={!!preoperativeEvaluation.medicalAndsurgicalHistory && edit.medical}
              placeholder="Descreva os Históricos médicos e cirúrgicos"
              defaultValue={preoperativeEvaluation.medicalAndsurgicalHistory}
            />

           <ButtonEdit 
            state={edit}
            setState={setEdit}
            value={[preoperativeEvaluation.medicalAndsurgicalHistory].filter(Boolean)}
            location={["medical"].filter(Boolean)}
            />
          </Accordium>

          <Accordium title="Alergias">
            <InputDetails
              textLabel="Descreva"
              rows={3}
              disabled={!!preoperativeEvaluation.allergies && edit.allergies}
              name="allergies"
              placeholder="Descreva os sintomas de alergia"
              defaultValue={preoperativeEvaluation.allergies}
            />

            <ButtonEdit 
              state={edit}
              setState={setEdit}
              value={[preoperativeEvaluation.allergies].filter(Boolean)}
              location={["allergies"].filter(Boolean)}
            />
          </Accordium>
          </div>
      </form>
      
      <div className="flex flex-col gap-y-4 py-4">
          <Accordium title="Exames laboratoriais">
              <UploadExamBlock
                value={edit}
                setValue={setEdit} 
                typeOfExam="laboratory"
                storageId={preoperativeEvaluation.laboratoryTests.laboratoryStorageId}
                description={preoperativeEvaluation.laboratoryTests.description}
                {...{patientId}}
                {...{operatingRoomId}}
                />
          </Accordium>

          <Accordium title="Exames imagiológicos">
              <UploadExamBlock
                value={edit}
                setValue={setEdit} 
                typeOfExam="imaging"
                storageId={preoperativeEvaluation.imagingTests.imagingStorageId}
                description={preoperativeEvaluation.imagingTests.description}
                {...{patientId}}
                {...{operatingRoomId}}
              />
          </Accordium>
      </div>
      
      <form {...{action}} onSubmit={submitUpdate}>
        <input 
          className="hidden"
          name="scheduleId"
          defaultValue={scheduleId}
        />

        <div className="flex flex-col gap-y-4 pb-8">
          <Accordium title="Estado clínico actual">
            <InputDetails
              textLabel="Descreva"
              rows={3}
              disabled={!!preoperativeEvaluation.currentClinicalStatus && edit.evaluation}
              name="currentClinicalStatus"
              placeholder="Descreva os estado clínico"
              defaultValue={preoperativeEvaluation.currentClinicalStatus}
            />

            <ButtonEdit 
              state={edit}
              setState={setEdit}
              value={[preoperativeEvaluation.currentClinicalStatus].filter(Boolean)}
              location={["evaluation"].filter(Boolean)}
            />
          </Accordium>

          <Accordium title="Riscos cirúrgico">
            <InputDetails
              textLabel="Descreva"
              rows={3}
              disabled={!!preoperativeEvaluation.surgicalRisk && edit.risk}
              name="surgicalRisk"
              placeholder="Descreva os riscos cirúrgicos"
              defaultValue={preoperativeEvaluation.surgicalRisk}
            />

            <ButtonEdit 
              state={edit}
              setState={setEdit}
              value={[preoperativeEvaluation.surgicalRisk].filter(Boolean)}
              location={["risk"].filter(Boolean)}
            />
          </Accordium>

          <Accordium title="Jejum confirmado">
            <InputDetails
              textLabel="Descreva"
              rows={3}
              disabled={!!preoperativeEvaluation.fastingConfirmed && edit.fasting}
              name="fastingConfirmed"
              placeholder="Descreva os riscos cirúrgicos"
              defaultValue={preoperativeEvaluation.fastingConfirmed}
            />

            <ButtonEdit 
              state={edit}
              setState={setEdit}
              value={[preoperativeEvaluation.fastingConfirmed].filter(Boolean)}
              location={["fasting"].filter(Boolean)}
            />
          </Accordium>

          <Accordium title="Medicação prévia">
            <InputDetails
              textLabel="Descreva"
              rows={3}
              disabled={!!preoperativeEvaluation.previousMedication && edit.medication}
              name="previousMedication"
              placeholder="Descreva as medicações prévias"
              defaultValue={preoperativeEvaluation.previousMedication}
            />

            <ButtonEdit 
              state={edit}
              setState={setEdit}
              value={[preoperativeEvaluation.previousMedication].filter(Boolean)}
              location={["medication"].filter(Boolean)}
            />
          </Accordium>
        </div>
      </form>
    </div>
  )
}