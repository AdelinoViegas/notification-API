"use client";

import { 
  useActionState, 
  useEffect, 
  useState
} from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import SubTitle from "@/components/ui/subtitle";
import InputField from "@/components/ui/input-field";
import InputDetails from "@/components/ui/input-details";
import Accordium from "@/components/ui/accordium";
import Alert from "@/components/ui/alert";
import { signExamResult } from "@/app/backend/api/clinical/unit-api";
import { FileHandler } from "@/lib/client-files";
import { toast } from 'react-toastify';
import { FaRegFilePdf } from "react-icons/fa6";
import { FaRegFileImage } from "react-icons/fa";
import Link from "next/link";
import FinishAnalysis from "@/components/finish-analysis";

export default function LaboratoryImagingForm({
  exams,
  resultId,
  savedResults,
  patientName,
  imaging
}:{ 
  patientName: string;
  imaging?: boolean;
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

  const handleFileUpload = async (e: unknown)=>{
    const target = (e as { target: { files: File[]; value: string; } }).target;

    if(target.files.length && !FileHandler.validdateFileType(target.files[0]))
      toast.error("Formato do arquivo inválido!", { 
        theme: "light",
        onOpen: ()=> target.value = ""
      });

    if(target.files.length && !FileHandler.validMaxSize(target.files[0]))
      toast.warn(`Tamanho máximo permitido de apenas ${FileHandler.getMaxFileSize()}`, { 
        theme: "light",
        onOpen: ()=> target.value = ""
      });
      
    if(target.files.length && (await FileHandler.isEmpty(target.files[0])))
      toast.error("Este arquivo está vazio!", { 
        theme: "light",
        onOpen: ()=> target.value = ""
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
                
                <div className="my-5 px-4 flex flex-col gap-y-2">
                  <SubTitle className="inline-flex mt-3">
                    {`Resultado por JPEG/PNG/PDF${imaging?'/VIDEO':''}`}
                  </SubTitle>

                  <InputField
                    className="w-96"
                    type="file"
                    name="file"
                    onChange={handleFileUpload}
                    accept={`.jpg, .jpeg, .png, .pdf ${imaging?', .mp4':''}`}
                  />

                 { !!savedResults?.find(i => i._id === item._id)?.file.size &&
                    <Link target="_blank" href={savedResults?.find(i => i._id === item._id)?.file.link as string}>
                      <div className="w-96 hover:bg-gray-100 flex gap-2 border border-2 rounded-xl px-3 py-2">
                        <div className="w-10">
                          {
                            FileHandler.getExtension(savedResults?.find(i => i._id === item._id)?.file.name as string) === "pdf"?
                            <FaRegFilePdf className="text-red-500 size-10" />:
                            <FaRegFileImage className="text-green-500 size-10" />
                          }
                        </div>
                        <div>
                          <h2 className="font-medium">{FileHandler.handleFileName(savedResults?.find(i => i._id === item._id)?.file.name as string)}</h2>
                          <p className="text-sm">{FileHandler.getFileHandlerToString(savedResults?.find(i => i._id === item._id)?.file.size as number)}</p>
                        </div>
                      </div>
                    </Link>
                  }
                  <p className="text-sm text-red-500">Tamanho máximo do arquivo de {FileHandler.getMaxFileSize()}</p>
                  <p className="text-sm text-red-500">
                    {`Apenas arquivos *.pdf, *.jpg, *.png ${imaging?', *.mp4':''} são permitidos`}
                  </p>
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