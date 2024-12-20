import Link from "next/link";
import Header from "@/components/header";
import Card from "@/components/card";
import SubTitle from "@/components/ui/subtitle";
import Accordium from "@/components/accordium";
import { FileHandler } from "@/lib/client-files";
import { FaRegFileImage, FaRegFilePdf } from "react-icons/fa6";
import { getExamResult, getPatient, getPatientExams } from "@/app/backend/api/clinical/unit-api";

export default async function Page({
  params
}: {
  params: Promise<{
    imagingId: string;
  }>
}){
  const { imagingId } = await params;
  const exams = await getPatientExams(imagingId);
  const savedResults = await getExamResult({ serviceResultId: imagingId });
  const patientName = await getPatient(imagingId);

  return(
    <main className="space-y-3">
      <div className="mt-6">
        <Header title="Informações dos Exames Feitos" />
      </div>

      <Card>
        <p className="font-medium mb-5 uppercase">{patientName}</p>

        {exams.map((item, i)=>(
          <div className="flex flex-col gap-y-6 my-5" key={i}>
            <Accordium title={item.name}>         
              <div className="grid lg:grid-cols-2">
                <div className="my-5 px-4 flex flex-col gap-y-2">
                  <SubTitle className="inline-flex mt-3">Resultado por JPEG/PNG/PDF/VIDEO</SubTitle>
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
                </div>
    
                <div className="my-5 px-4 flex flex-col gap-y-2">
                  <SubTitle className="inline-flex mt-3">Resultado por Descrição</SubTitle>
                  <p className="font-medium text-gray-500">{savedResults?.find(i => i._id === item._id)?.plainText}</p>
                </div>
              </div>
            </Accordium>
          </div>
        ))}
      </Card>
    </main>
  );
}