"use client";

import { useActionState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Accordium from "@/components/ui/accordium";
import InputDetails from "@/components/ui/input-details";
import Button from "@/components/ui/button";
import { UploadExamBlock } from "@/components/forms/upload-exam-block";
import { signOperatingRoom } from "@/backend/api/clinical/operating-room-api";

export default function PreoperativeEvaluation({ 
  preoperativeEvaluation, 
  scheduleId 
}: {
  scheduleId: string,
  preoperativeEvaluation: {
    medicalAndsurgicalHistory: string,
    allergies: string,
    laboratoryTests: string,
    imagingTests: string,
    currentClinicalStatus: string,
    surgicalRisk: string,
    fastingConfirmed: string,
    previousMedication: string,
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
      <input 
        className="hidden"
        name="scheduleId"
        defaultValue={scheduleId}
      />
      
      <div className="flex flex-col gap-y-4 py-8">
        <Accordium title="Histórico médico e cirúrgico">
          <InputDetails
            textLabel="Descreva"
            rows={3}
            name="medicalAndsurgicalHistory"
            placeholder="Descreva os Históricos médicos e cirúrgicos"
            defaultValue={preoperativeEvaluation.medicalAndsurgicalHistory}
          />

            <Button>Salvar</Button>
        </Accordium>

        <Accordium title="Alergias">
          <InputDetails
            textLabel="Descreva"
            rows={3}
            name="allergies"
            placeholder="Descreva os sintomas de alergia"
            defaultValue={preoperativeEvaluation.allergies}
          />

            <Button>Salvar</Button>
        </Accordium>

        <Accordium title="Exames laboratoriais">
            <UploadExamBlock />
        </Accordium>

        <Accordium title="Exames imagiológicos">
            <UploadExamBlock />
        </Accordium>

        <Accordium title="Estado clínico actual">
          <InputDetails
            textLabel="Descreva"
            rows={3}
            name="currentClinicalStatus"
            placeholder="Descreva os estado clínico"
            defaultValue={preoperativeEvaluation.currentClinicalStatus}
          />

          <Button>Salvar</Button>
        </Accordium>

        <Accordium title="Riscos cirúrgico">
          <InputDetails
            textLabel="Descreva"
            rows={3}
            name="surgicalRisk"
            placeholder="Descreva os riscos cirúrgicos"
            defaultValue={preoperativeEvaluation.surgicalRisk}
          />

          <Button>Salvar</Button>
        </Accordium>

        <Accordium title="Jejum confirmado">
          <InputDetails
            textLabel="Descreva"
            rows={3}
            name="fastingConfirmed"
            placeholder="Descreva os riscos cirúrgicos"
            defaultValue={preoperativeEvaluation.fastingConfirmed}
          />

          <Button>Salvar</Button>
        </Accordium>

        <Accordium title="Medicação prévia">
          <InputDetails
            textLabel="Descreva"
            rows={3}
            name="previousMedication"
            placeholder="Descreva as medicações prévias"
            defaultValue={preoperativeEvaluation.previousMedication}
          />

          <Button>Salvar</Button>
        </Accordium>
        </div>
    </form>
  )
}