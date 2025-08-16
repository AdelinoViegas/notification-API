import { getPatient, getScheduledExams } from "@/backend/api/clinical/unit-api";
import { internalExamResultModel } from "@/backend/model";
import Accordium from "@/components/ui/accordium";
import UserFileViewer from "@/components/user-file-viewer";
import InputDetails from "@/components/ui/input-details";

export default async function Page({ params }: { params: Promise<{laboratoryId: string}>}){
  const { laboratoryId } = await params;
  const requestedExams = await getScheduledExams(laboratoryId);
  const patient = await getPatient(laboratoryId);

  return(
    <div>
      <div className="my-3">
        <h2 className="text-xl">Utente: {patient?.fullname}</h2>

        <h2 className="font-bold mb-3 text-center">Exames Solicitados</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {requestedExams.map(async (props, index)=>{
            const examResult = await internalExamResultModel.findOne({ 
              serviceId: laboratoryId, 
              examId: props._id  
            });

            return (
              <Accordium title={props.name} key={index}>
                <InputDetails
                  textLabel="Resultado Descritivo"
                  defaultValue={examResult?.description as string}
                  disabled 
                />
                
                { examResult?.storageId &&
                  <UserFileViewer id={examResult.storageId} />
                }
              </Accordium>
            );
          })}
        </div>
      </div>
    </div>
  )
}