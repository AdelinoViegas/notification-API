"use client";

import { 
  Dispatch,
  FormEvent,
  SetStateAction,
  useActionState,
  useEffect,
  useRef 
} from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import InputField from "@/components/ui/input-field";
import Tag from "@/components/ui/tag";
import ButtonEdit from "@/components/ui/button-edit";
import InputDetails from "@/components/ui/input-details";
import ViewUserFile from "@/components/view-user-file-client";
import { uploadExternalExamFile } from "@/backend/api/clinical/operating-room-api";

export function UploadExamBlock({
  value,
  setValue,
  storageId,
  typeOfExam, 
  operatingRoomId,
  patientId,
  description,
}: {
  value: Record<string, boolean>,
  setValue: Dispatch<SetStateAction<Record<string, boolean>>>,
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

  const submitUpdate = (event: FormEvent) => {
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement;

    if(submitter?.name === "update")
      for(const value of JSON.parse(submitter.dataset.location as string) as string[])
        setValue( prev => ({...prev, [value]: !prev[value]}))
  }

  return(
    <form {...{action}} onSubmit={submitUpdate}>
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

      <Tag className="inline-flex mt-3">Enviar resultado por JPEG/PNG/PDF</Tag>

      <InputField
        textLabel="Arquivo (PDF/IMAGEM/VIDEO)"
        type="file"
        required
        disabled={!!storageId && value.result}
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
          disabled={!!description && value.description}
          name="description"
          placeholder="Descreva os sintomas de alergia"
          defaultValue={description}
      />

      <ButtonEdit 
        state={value}
        setState={setValue}
        value={[description, storageId].filter(Boolean)}
        location={["description", "result"].filter(Boolean)}
      />
    </form>
  )
}