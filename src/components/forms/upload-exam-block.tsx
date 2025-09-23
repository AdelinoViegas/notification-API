"use client";

import { /*useActionState, useEffect,*/ useRef } from "react";
//import { useRouter } from "next/navigation";
import InputField from "@/components/ui/input-field";
import SubTitle from "@/components/ui/subtitle";
import Button from "@/components/ui/button";
import InputDetails from "@/components/ui/input-details";
import { toast } from "react-toastify";

export function UploadExamBlock(/*{ 
  patientId,
  officeId,
  storageId
}: { 
  patientId?: string;
  officeId?: string;
  storageId?: string;
*/){
  //const [ state, action ] = useActionState(uploadExternalExamFile, { message: "", status: false });
  //const router = useRouter();
  const MAX_FILE_SIZE = Math.pow(1024, 2) * 10; // 10 mb 
  const formRef = useRef<HTMLFormElement>(null);

  /*useEffect(()=>{
    if(state.message)
      if(state.status)
        toast.success(state.message, { onOpen: router.refresh });
      else 
        toast.warn(state.message)
  }, [state])*/

  return(
    <form>
      <SubTitle className="inline-flex mt-3">Enviar resultado por JPEG/PNG/PDF</SubTitle>

      <InputField
        textLabel="Arquivo (PDF/IMAGEM/VIDEO)"
        type="file"
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

      <InputDetails
          textLabel="Descreva"
          rows={3}
          placeholder="Descreva os sintomas de alergia"
      />

      <Button>Salvar</Button>
    </form>
  )
}