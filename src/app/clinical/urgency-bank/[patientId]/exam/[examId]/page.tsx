// import Link from "next/link";
import SubTitle from "@/components/ui/subtitle";
import Accordium from "@/components/ui/accordium";
// import { FileHandler } from "@/lib/client-files";
// import { FaRegFileImage, FaRegFilePdf } from "react-icons/fa6";
import { getPatientScheduledServices } from "@/backend/api/clinical/scheduling-api";

export default async function Page({
  params
}: {
  params: Promise<{
    laboratoryId: string;
    examId: string;
    patientId: string
  }>
}){
  const { patientId, examId } = await params;
  const exams = await getPatientScheduledServices({ patientId });
  const exam = exams?.find(props => props._id === examId);

  return(

    <div className="flex flex-col gap-y-6 my-5">
      <Accordium title={exam?.name as string}>         
        <div className="grid lg:grid-cols-2">
          <div className="my-5 px-4 flex flex-col gap-y-2">
            <SubTitle className="inline-flex mt-3">Resultado por JPEG/PNG/PDF</SubTitle>
                {/* <Link target="_blank" href={exam?.file.link as string}>
                  <div className="w-96 hover:bg-gray-100 flex gap-2 border border-2 rounded-xl px-3 py-2">
                    <div className="w-10">
                      {
                        FileHandler.getExtension(exam?.file.name as string) === "pdf"?
                        <FaRegFilePdf className="text-red-500 size-10" />:
                        <FaRegFileImage className="text-green-500 size-10" />
                      }
                    </div>
                    <div>
                      <h2 className="font-medium">{FileHandler.handleFileName(exam?.file.name as string)}</h2>
                      <p className="text-sm">{FileHandler.getFileHandlerToString(exam?.file.size as number)}</p>
                    </div>
                  </div>
                </Link> */}
          </div>

          <div className="my-5 px-4 flex flex-col gap-y-2">
            <SubTitle className="inline-flex mt-3">Resultado por Descrição</SubTitle>
            <p className="font-medium text-gray-500">{exam?.plainText}</p>
          </div>
        </div>
      </Accordium>
    </div>
  );
}