"use client";

import { 
  useEffect,
  useActionState,
  useRef,
} from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import InputField from "@/components/ui/input-field";
import InputDetails from "@/components/ui/input-details";
import Button from "@/components/ui/button";
import SubTitle from "@/components/ui/subtitle";
import type { ConsultCurrentStates, ConsultVitalSignal } from "@/backend/schemas/types";
import { signConsutation, uploadExternalExamFile } from "@/backend/api/clinical/office-api";

export function VitalSignalsInOffice({ 
  id, 
  vitalSignal
}:{ 
  id: string;
  vitalSignal?: ConsultVitalSignal;
}){
  const [ state, action ] = useActionState(signConsutation, { message:"", status:false });
  const router = useRouter();

  useEffect(()=>{
    if(state.message)
      if(state.status)
        toast.success(state.message, {
          onClose: ()=>{
            router.refresh();  
          }
        });
      else
        toast.error(state.message);
  }, [state, router]);

  return(
    <form {...{action}} className="mt-3">
      <input
        className="hidden"
        name="officeId"
        defaultValue={id}
        readOnly
      />

      <input
        className="hidden"
        name="type"
        defaultValue="vitalSignals"
      />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <InputField
          type="number"
          textLabel="P.A MÁXIMA (mmHG)"
          name="pamax" 
          placeholder="0 (mmHG)"
          defaultValue={vitalSignal?.paMax}
          required
        />

        <InputField
          type="number"
          textLabel="P.A MÍNIMA (mmHG)"
          name="pamin" 
          placeholder="0 (mmHG)"
          defaultValue={vitalSignal?.paMin}
          required
        />
        
        <InputField
          type="number"
          textLabel="PULSO (BPM)"
          name="jump" 
          placeholder="0 (BPM)"
          defaultValue={vitalSignal?.jump}
        />

        <InputField
          type="number"
          step={0.01}
          textLabel="TEMPERATURA (°)"
          name="temperature"
          placeholder="0 graus(°)"
          defaultValue={vitalSignal?.temperature}
          required
        />

        <InputField
          type="number"
          textLabel="RESPIRAÇÂO (IRPM)"
          name="breathing" 
          placeholder="0 (IRPM)"
          defaultValue={vitalSignal?.breathing}
          required
        />

        <InputField
          type="number"
          textLabel="PESO (kg)"
          name="weight" 
          placeholder="0 (kg)"
          step={0.01}
          defaultValue={vitalSignal?.weight}
        />

        <InputField
          type="number"
          step={0.01}
          textLabel="ALTURA ((m)"
          name="height"
          placeholder="0 (m)"
          defaultValue={vitalSignal?.height}
        />

        <InputField
          type="number"
          textLabel="SpO2 ((%) opcional)"
          name="sp02"
          step={0.01}
          placeholder="0 (%)"
          defaultValue={vitalSignal?.sp02}
        />

        <InputField
          type="number"
          textLabel="PVC ((CH20) opcional)"
          name="pvc"
          placeholder="0 (CH20)"
          defaultValue={vitalSignal?.pvc}
        />

        <InputField
          type="number"
          step={0.01}
          textLabel="GLICEMIA ( (mg/dl) opcional)"
          name="bloodGlucose"
          placeholder="0 (mg/dl)"
          defaultValue={vitalSignal?.bloodGlucose}
        />
      </div>

      <Button>Salvar</Button>
    </form>
  )
}

export function CurrentDataInOffice({
  id,
  currentState
}:{ 
  id: string,
  currentState?: ConsultCurrentStates;
}){
  const [ state, action ] = useActionState(signConsutation, { message:"", status:false })
  const router = useRouter();

  useEffect(()=>{
    if(state.message)
      if(state.status)
        toast.success(state.message, {
          onClose: ()=>{
            router.refresh();  
          }
        });
      else
        toast.error(state.message);
  }, [state, router]);

  return(
    <form {...{action}} className="mt-3">
      <input
        className="hidden"
        name="officeId"
        defaultValue={id}
        readOnly
      />

      <input
        className="hidden"
        name="type"
        defaultValue="currentStates"
      />

      <div className="grid gap-3 lg:grid-cols-3">
        <InputDetails
          textLabel="Queixas"  
          name="complaints"
          rows={3}
          placeholder="Descreva as queixas do utente"
          defaultValue={currentState?.complaints}
        />

        <InputDetails
          textLabel="Exame Físico"  
          name="phisicalExam"
          rows={3}
          placeholder="Descreva os exames físicos"
          defaultValue={currentState?.phisicalExam}

        />

        <InputDetails
          textLabel="Observações"  
          name="detail"
          rows={3}
          placeholder="O que observou?"
          defaultValue={currentState?.detail}

        />
      </div>
      
      <Button>Salvar</Button>
    </form>
  )
}

export function UploadExternalExam({ 
  patientId,
  officeId,
  storageId
}: { 
  patientId: string;
  officeId: string;
  storageId?: string;
}){
  const [ state, action ] = useActionState(uploadExternalExamFile, { message: "", status: false });
  const router = useRouter();
  const MAX_FILE_SIZE = Math.pow(1024, 2) * 10; // 10 mb 
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(()=>{
    if(state.message)
      if(state.status)
        toast.success(state.message, {
          onOpen: router.refresh 
        });
      else 
        toast.warn(state.message)
  }, [state])

  return(
    <form action={action}>
      <input type="hidden" name="patientId" defaultValue={patientId} />
      <input type="hidden" name="officeId" defaultValue={officeId} />
      <input type="hidden" name="storageId" defaultValue={storageId} />

      <SubTitle className="inline-flex mt-3">Enviar resultado por JPEG/PNG/PDF</SubTitle>

      <InputField
        textLabel="Arquivo (PDF/IMAGEM/VIDEO)"
        type="file"
        required
        name="externalFile"
        accept={".pdf, video/*, image/*"}
        onChange={({ target }) =>{
          if(target.files?.length){
            const [ file ] = target.files;

            if(file.size > MAX_FILE_SIZE)
              toast.warn("Arquivo muito grande!", { onOpen: ()=>formRef.current?.reset() })
          }
        }}
      />

      <Button>Salvar</Button>
    </form>
  )
}