"use client";

import InputDetails from "@/components/ui/input-details";
import InputField from "@/components/ui/input-field";
import Button from "@/components/ui/button";
import { useActionState, useEffect } from "react";
import { registerExamResult } from "@/backend/api/clinical/internal-services-api";
import { toast } from "react-toastify";
import { useRef } from "react";
import { useRouter } from "next/navigation";

export function LoboratoryForm({
  description,
  examId,
  serviceId
}:{
  description?: string;
  examId: string;
  serviceId: string;
}){
  const [ state, action ] = useActionState(registerExamResult, { message: "", status: false });
  const router = useRouter();
  const MAX_FILE_SIZE = Math.pow(1024, 2) * 10; // 10 mb 
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(()=>{
    if(state.message)
      if(state.status)
        toast.success(state.message, { onOpen: router.refresh });
      else
        toast.warn(state.message);
  }, [state]);

  return(
    <form action={action} ref={formRef}>
      <input type="hidden" name="examId" value={examId} />
      <input type="hidden" name="serviceId" value={serviceId} />

      <div className="grid md:grid-cols-2 gap-3">
        <InputDetails
          textLabel="Descrição do Resultado"
          name="description"
          defaultValue={description}
          placeholder="O resultado descritivo do exame feito"
          rows={3}
        />

        <InputField
          textLabel="Arquivo (PDF/IMAGEM/VIDEO)"
          type="file"
          name="userFile"
          accept={".pdf, video/*, image/*"}
          onChange={({ target }) =>{
            if(target.files?.length){
              const [ file ] = target.files;

              if(file.size > MAX_FILE_SIZE)
                toast.warn("Arquivo muito grande!", { onOpen: ()=>formRef.current?.reset() })
            }
          }}
        />
      </div>

      <Button>Salvar</Button>
    </form>
  )
}