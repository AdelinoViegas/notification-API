"use client";

import { 
  useEffect,
  useState,
  useActionState,
  useRef
} from "react";
import InputField from "@/components/ui/input-field";
import InputDetails from "@/components/ui/input-details";
import Button from "@/components/ui/button";
import Alert from "@/components/ui/alert";
import { signConsutation, uploadExternalExamFile } from "@/app/backend/api/clinical/office-api";
import { useRouter } from "next/navigation";

import { resultsConsult } from "@/app/backend/api/clinical/types";
import { FileHandler } from "@/lib/client-files";
import { toast, ToastContainer } from "react-toastify";
import SubTitle from "@/components/ui/subtitle";
import { FaRegFileImage, FaRegFilePdf } from "react-icons/fa6";
import Link from "next/link";

function VitalSignalsInOffice({ 
  id, 
  consult
}:{ 
  id: string, 
  consult: resultsConsult
}){
  const [ state, action ] = useActionState(signConsutation, { message:"", status:false });
  const [ messageState, setMessageState ] = useState(false);
  const router = useRouter();

  useEffect(()=>{
    if(state?.message){
      setMessageState(true);

      setTimeout(()=>{
        if(state?.status){
          router.refresh();        
        }
        setMessageState(false);
      },state.status?2000:3000);
    }
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
          defaultValue={consult?.vitalSignal.paMax}
          required
        />

        <InputField
          type="number"
          textLabel="P.A MÍNIMA (mmHG)"
          name="pamin" 
          placeholder="0 (mmHG)"
          defaultValue={consult?.vitalSignal.paMin}
          required
        />
        
        <InputField
          type="number"
          textLabel="PULSO (BPM)"
          name="jump" 
          placeholder="0 (BPM)"
          defaultValue={consult?.vitalSignal.jump}
        />

        <InputField
          type="number"
          step={0.01}
          textLabel="TEMPERATURA (°)"
          name="temperature"
          placeholder="0 graus(°)"
          defaultValue={consult?.vitalSignal.temperature}
          required
        />

        <InputField
          type="number"
          textLabel="RESPIRAÇÂO (IRPM)"
          name="breathing" 
          placeholder="0 (IRPM)"
          defaultValue={consult?.vitalSignal.breathing}
          required
        />

        <InputField
          type="number"
          textLabel="PESO (kg)"
          name="weight" 
          placeholder="0 (kg)"
          step={0.01}
          defaultValue={consult?.vitalSignal.weight}
        />

        <InputField
          type="number"
          step={0.01}
          textLabel="ALTURA ((m)"
          name="height"
          placeholder="0 (m)"
          defaultValue={consult?.vitalSignal.height}
        />

        <InputField
          type="number"
          textLabel="SpO2 ((%) opcional)"
          name="sp02"
          step={0.01}
          placeholder="0 (%)"
          defaultValue={consult?.vitalSignal.sp02}
        />

        <InputField
          type="number"
          textLabel="PVC ((CH20) opcional)"
          name="pvc"
          placeholder="0 (CH20)"
          defaultValue={consult?.vitalSignal.pvc}
        />

        <InputField
          type="number"
          step={0.01}
          textLabel="GLICEMIA ( (mg/dl) opcional)"
          name="bloodGlucose"
          placeholder="0 (mg/dl)"
          defaultValue={consult?.vitalSignal.bloodGlucose}
        />
      </div>

      <Button>Salvar</Button>

      {
        state?.message && messageState &&
        <div className="w-96 flex mt-3">
          <Alert
            type={state?.status?'success':'error'}
            message={state?.message}
          />
        </div>
      }
    </form>
  )
}

function CurrentDataInOffice({
  id,
  consult
}:{ 
  id: string,
  consult: resultsConsult
}){
  const [ state, action ] = useActionState(signConsutation, { message:"", status:false })
  const [ messageState, setMessageState ] = useState(false);
  const router = useRouter();

  useEffect(()=>{
    if(state?.message){
      setMessageState(true);

      setTimeout(()=>{
        if(state?.status){
          router.refresh();        
        }
        setMessageState(false);
      },state.status?2000:3000);
    }
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
          defaultValue={consult.currentStates.complaints}
        />

        <InputDetails
          textLabel="Exame Físico"  
          name="phisicalDetail"
          rows={3}
          placeholder="Descreva os exames físicos"
          defaultValue={consult.currentStates.phisicalExam}

        />

        <InputDetails
          textLabel="Observações"  
          name="detail"
          rows={3}
          placeholder="O que observou?"
          defaultValue={consult.currentStates.detail}

        />
      </div>
      
      <Button>Salvar</Button>

      {
        state?.message && messageState &&
        <div className="w-96 flex mt-3">
          <Alert
            type={state?.status?'success':'error'}
            message={state?.message}
          />
        </div>
      }
    </form>
  )
}

function FileUpload({ 
  patientId,
  officeId,
  externalFile
}: { 
  patientId: string;
  officeId: string;
  externalFile?: {
    name: string;
    size: number;
    link: string;
  }
}){
  const [ state, action ] = useActionState(uploadExternalExamFile, { message: "", status: false });
  const [ messageState, setMessageState ] = useState(false);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const handleFileUpload = async (e: unknown)=>{
    const file = (e as { target: { files: File[] } }).target.files[0];
    
    if(!FileHandler.validdateFileType(file))
      toast.error("Formato do arquivo inválido!", { 
        theme: "light",
        onOpen: ()=> formRef.current?.reset()
      });

    if(!FileHandler.validMaxSize(file))
      toast.warn("Tamanho máximo permitido é de 2MB!", { 
        theme: "light",
        onOpen: ()=> formRef.current?.reset()
      });
      
    if(await FileHandler.isEmpty(file))
      toast.error("Arquivo vazios!", { 
        theme: "light",
        onOpen: ()=> formRef.current?.reset()
      });
  }

  useEffect(()=>{
    setMessageState(true);
    if(state.message)
      setTimeout(()=>{
        if(state.status)
          router.refresh();

        setMessageState(false)
      }, state.status?3000:5000);
  }, [state, router]);

  return(
    <form ref={formRef} {...{action}}>
      <input type="hidden" name="patientId" defaultValue={patientId} />
      <input type="hidden" name="officeId" defaultValue={officeId} />

      <ToastContainer
        theme="colored" 
      />
      <SubTitle className="inline-flex mt-3">Enviar resultado por JPEG/PNG/PDF</SubTitle>
      <InputField
        type="file"
        name="externalFile"
        required
        onChange={handleFileUpload}
        accept=".jpg, .jpeg, .png, .pdf"
      />

    { !!externalFile &&
        <Link target="_blank" href={externalFile.link}>
          <div className="w-96 hover:bg-gray-100 flex gap-2 border border-2 rounded-xl px-3 py-2">
            <div className="w-10">
              {
                FileHandler.getExtension(externalFile.name) === "pdf"?
                <FaRegFilePdf className="text-red-500 size-10" />:
                <FaRegFileImage className="text-green-500 size-10" />
              }
            </div>
            <div>
              <h2 className="font-medium">{FileHandler.handleFileName(externalFile.name)}</h2>
              <p className="text-sm">{FileHandler.getFileHandlerToString(externalFile.size)}</p>
            </div>
          </div>
        </Link>
      }
      <p className="text-sm text-red-500">Tamanho máximo do arquivo de 2MB</p>
      <p className="text-sm text-red-500">Apenas arquivos *.pdf, *.jpg, *.png são permitidos</p>
      <Button>Salvar</Button>

      <div className='mt-3'>
        {
          state.message && messageState &&
          <Alert 
            type={state.status?'success': 'error'} 
            message={state.message} 
          />
        }
      </div>
    </form>
  )
}

export {
  FileUpload,
  CurrentDataInOffice,
  VitalSignalsInOffice
}