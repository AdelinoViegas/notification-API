"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/components/ui/input-field";
import SubTitle from "@/components/ui/subtitle";
import Button from "@/components/ui/button";
import InputDetails from "@/components/ui/input-details";
import { toast } from "react-toastify";
import { uploadExternalExamFile } from "@/backend/api/clinical/operating-room-api";
import ViewUserFile from "../view-user-file-client";

export function UploadExamBlock({
  storageId,
  typeOfExam, 
  operatingRoomId,
  patientId,
  description,
}: {
  storageId: string; 
  typeOfExam: string;
  operatingRoomId: string;
  patientId: string;
  description: string;
}){
  const [ state, action ] = useActionState(uploadExternalExamFile, { message: "", status: false });
  const router = useRouter();
  const MAX_FILE_SIZE = Math.pow(1024, 2) * 10; // 10 mb 
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(()=>{
    if(state.message)
      if(state.status)
        toast.success(state.message, { onOpen: router.refresh });
      else 
        toast.warn(state.message)
  }, [state])

  return(
    <form {...{action}}>
      <input 
        className="hidden"
        name="storageId"
        defaultValue={storageId}
      />
      
      <input 
        className="hidden"
        name="typeOfExam"
        defaultValue={typeOfExam}
      />

      <input 
        className="hidden"
        name="patientId"
        defaultValue={patientId}
      />

      <input 
        className="hidden"
        name="operatingRoomId"
        defaultValue={operatingRoomId}
      />

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
      
      <div>
       {storageId && <ViewUserFile id={storageId}/>}
      </div>

      <InputDetails
          textLabel="Descreva"
          rows={3}
          name="description"
          placeholder="Descreva os sintomas de alergia"
          defaultValue={description}
      />

      <Button>Salvar</Button>
    </form>
  )
}