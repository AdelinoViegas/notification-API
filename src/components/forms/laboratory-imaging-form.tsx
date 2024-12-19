"use client";

import { 
  useActionState, 
  useEffect, 
  useState, 
  useRef
} from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import SubTitle from "@/components/ui/subtitle";
import InputField from "@/components/ui/input-field";
import InputDetails from "@/components/ui/input-details";
import Accordium from "@/components/accordium";
import Alert from "@/components/alert";
import { signExamResult } from "@/app/backend/api/clinical/unit-api";
import { FileSize } from "@/lib/file";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaRegFilePdf } from "react-icons/fa6";
import { FaRegFileImage } from "react-icons/fa";
import Link from "next/link";
import FinishAnalysis from "@/components/finish-analysis";

export default function LaboratoryImagingForm({
  exams,
  resultId,
  savedResults,
  patientName,
  type
}:{ 
  patientName: string;
  type?: "laboratory" | "imaging";
  resultId: string;
  exams: { _id: string; name: string }[];
  savedResults?: { 
    _id: string; 
    plainText: string;
    file: {
      name: string;
      size: number;
      link: string;
    } 
  }[]; 
}){
  const [ state, action ] = useActionState(signExamResult, { message: "", status: false, serviceId: "" });
  const [ msgState, setMsgState ] = useState(false);
  const router = useRouter();
  const fileRef = useRef<HTMLDivElement>(null);
  
  const handleFileUpload = (e: unknown)=>{
    const file = (e as { target: { files: File[] } }).target.files[0];
    
    if(!FileSize.validdateFileType(file))
      toast.warn("Formato do arquivo inválido!", { 
        theme: "light",
      });
  }

  useEffect(()=>{
    if(state?.message){
      setMsgState(true);

      setTimeout(()=>{
        if(state.status)
          router.refresh();

        setMsgState(false);    
      },state?.status?2000:5000);
    }
  },[state, router]);

  return(
    <div className="overflow-auto max-h-[75vh] px-3">
      <ToastContainer
        theme="colored" 
      />
      <p className="font-medium mb-5 uppercase">{patientName}</p>

      {exams.map((item, i)=>(
        <div className="flex flex-col gap-y-6 my-5" key={i}>
          <Accordium title={item.name}>         
            <form {...{action}}>
              <div className="grid lg:grid-cols-2">
                <input
                  type="hidden"
                  name="serviceId"
                  defaultValue={item._id}
                />

                <input
                  type="hidden"
                  name="resultId"
                  defaultValue={resultId}
                />

                <input
                  type="hidden"
                  name="sourceType"
                  defaultValue="laboratory"
                />

                <input
                  type="hidden"
                  name="exam"
                  defaultValue={item.name}
                />
                
                <div ref={fileRef} className="my-5 px-4 flex flex-col gap-y-2">
                  <SubTitle className="inline-flex mt-3">
                    {type === "imaging"?"Resultado por JPEG/PNG/PDF/VIDEO":"Resultado por JPEG/PNG/PDF"}
                  </SubTitle>
                  <InputField
                    className="w-96"
                    type="file"
                    name="file"
                    onChange={handleFileUpload}
                    accept={type === "imaging"?".jpg, .jpeg, .png, .pdf, .mp4":".jpg, .jpeg, .png, .pdf"}
                  />

                 { !!savedResults?.find(i => i._id === item._id)?.file.size &&
                    <Link target="_blank" href={savedResults?.find(i => i._id === item._id)?.file.link as string}>
                      <div className="w-96 hover:bg-gray-100 flex gap-2 border border-2 rounded-xl px-3 py-2">
                        <div className="w-10">
                          {
                            FileSize.getExtension(savedResults?.find(i => i._id === item._id)?.file.name as string) === "pdf"?
                            <FaRegFilePdf className="text-red-500 size-10" />:
                            <FaRegFileImage className="text-green-500 size-10" />
                          }
                        </div>
                        <div>
                          <h2 className="font-medium">{FileSize.handleFileName(savedResults?.find(i => i._id === item._id)?.file.name as string)}</h2>
                          <p className="text-sm">{FileSize.getFileSizeToString(savedResults?.find(i => i._id === item._id)?.file.size as number)}</p>
                        </div>
                      </div>
                    </Link>
                  }
                  <p className="text-sm text-red-500">Tamanho máximo do arquivo de 2MB</p>
                  <p className="text-sm text-red-500">Apenas arquivos *.pdf, *.jpg, *.png são permitidos</p>
                </div>
    
                <div className="my-5 px-4 flex flex-col gap-y-2">
                  <SubTitle className="inline-flex mt-3">Resultado por Descrição</SubTitle>
                  <InputDetails
                    textLabel="Descrição"
                    name="plainText"
                    placeholder="Descreva o resultado"
                    defaultValue={savedResults?.find(i => i._id === item._id)?.plainText}
                    rows={3}
                  />
                </div>
              </div>

              <Button>Salvar</Button>

              <div className="w-96 mt-4">
                {item._id === state.serviceId && msgState &&  
                  <Alert
                    type={state.status?"success":"error"}
                    message={state.message}
                  />
                }
              </div>
            </form>
          </Accordium>
        </div>
      ))}
      
      <FinishAnalysis {...{resultId}}/>   
    </div>
  )
}