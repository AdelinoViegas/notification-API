"use client";

import InputDetails from "@/components/ui/input-details";
import InputField from "@/components/ui/input-field";
import Button from "@/components/ui/button";
import { useActionState, useEffect } from "react";
import { registerExamResult } from "@/backend/api/clinical/unit-api";
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
          name="internalExamFile"
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
// import { 
//   useActionState, 
//   useEffect, 
//   useState
// } from "react";
// import { useRouter } from "next/navigation";
// import Button from "@/components/ui/button";
// import SubTitle from "@/components/ui/subtitle";
// import InputField from "@/components/ui/input-field";
// import InputDetails from "@/components/ui/input-details";
// import Accordium from "@/components/ui/accordium";
// import Alert from "@/components/ui/alert";
// import { signExamResult } from "@/backend/api/clinical/unit-api";
// import { FileHandler } from "@/lib/client-files";
// import { toast } from 'react-toastify';
// import { FaRegFilePdf } from "react-icons/fa6";
// import { FaRegFileImage } from "react-icons/fa";
// import Link from "next/link";
// import FinishAnalysis from "@/components/finish-analysis";
// import { ResponseDriveFile } from "@/backend/api/types";

// export default function LaboratoryImagingForm({
//   exams,
//   resultId,
//   savedResults,
//   patientName,
//   imaging
// }:{ 
//   patientName: string;
//   imaging?: boolean;
//   resultId: string;
//   exams: { _id: string; name: string }[];
//   savedResults?: { 
//     _id: string; 
//     plainText: string;
//     file: {
//       name: string;
//       size: number;
//       link: string;
//     } 
//   }[]; 
// }){
//   const [ state, action ] = useActionState(signExamResult, { message: "", status: false, serviceId: "" });
//   const router = useRouter();

//   useEffect(()=>{
//     if(state.message)
//       if(state.status)
//         toast.success(state.message, { });
//       else 
//         toast.error(state.message);
//   },[state, router]);

//   return(
//     <div className="overflow-auto max-h-[75vh] px-3">
//       <p className="font-medium mb-5 uppercase">{patientName}</p>

//       {exams.map((item, i)=>(
//         <div className="flex flex-col gap-y-6 my-5" key={i}>
//           <Accordium title={item.name}>         
//             <form {...{action}}>
//               <div className="grid lg:grid-cols-2">
//                 <input
//                   type="hidden"
//                   name="serviceId"
//                   defaultValue={item._id}
//                 />

//                 <input
//                   type="hidden"
//                   name="resultId"
//                   defaultValue={resultId}
//                 />

//                 <input
//                   type="hidden"
//                   name="sourceType"
//                   defaultValue="laboratory"
//                 />

//                 <input
//                   type="hidden"
//                   name="exam"
//                   defaultValue={item.name}
//                 />
                
//                 <div className="my-5 px-4 flex flex-col gap-y-2">
//                   <SubTitle className="inline-flex mt-3">
//                     {`Resultado por JPEG/PNG/PDF${imaging?'/VIDEO':''}`}
//                   </SubTitle>

//                   <InputField
//                     className="w-96"
//                     type="file"
//                     name="file"
//                     onChange={handleFileUpload}
//                     accept={`.jpg, .jpeg, .png, .pdf ${imaging?', .mp4':''}`}
//                   />

//                  {/* { !!savedResults?.find(i => i._id === item._id)?.file.size &&
//                     <Link target="_blank" href={savedResults?.find(i => i._id === item._id)?.file.link as string}>
//                       <div className="w-96 hover:bg-gray-100 flex gap-2 border border-2 rounded-xl px-3 py-2">
//                         <div className="w-10">
//                           {
//                             FileHandler.getExtension(savedResults?.find(i => i._id === item._id)?.file.name as string) === "pdf"?
//                             <FaRegFilePdf className="text-red-500 size-10" />:
//                             <FaRegFileImage className="text-green-500 size-10" />
//                           }
//                         </div>
//                         <div>
//                           <h2 className="font-medium">{FileHandler.handleFileName(savedResults?.find(i => i._id === item._id)?.file.name as string)}</h2>
//                           <p className="text-sm">{FileHandler.getFileHandlerToString(savedResults?.find(i => i._id === item._id)?.file.size as number)}</p>
//                         </div>
//                       </div>
//                     </Link>
//                   }
//                   <p className="text-sm text-red-500">Tamanho máximo do arquivo de {FileHandler.getMaxFileSize()}</p>
//                   <p className="text-sm text-red-500">
//                     {`Apenas arquivos *.pdf, *.jpg, *.png ${imaging?', *.mp4':''} são permitidos`}
//                   </p> */}
//                 </div>
    
//                 <div className="my-5 px-4 flex flex-col gap-y-2">
//                   <SubTitle className="inline-flex mt-3">Resultado por Descrição</SubTitle>
//                   <InputDetails
//                     textLabel="Descrição"
//                     name="plainText"
//                     placeholder="Descreva o resultado"
//                     defaultValue={savedResults?.find(i => i._id === item._id)?.plainText}
//                     rows={3}
//                   />
//                 </div>
//               </div>

//               <Button>Salvar</Button>

//               <div className="w-96 mt-4">
//                 {item._id === state.serviceId && msgState &&  
//                   <Alert
//                     type={state.status?"success":"error"}
//                     message={state.message}
//                   />
//                 }
//               </div>
//             </form>
//           </Accordium>
//         </div>
//       ))}
      
//       <FinishAnalysis {...{resultId}}/>   
//     </div>
//   )
// }

