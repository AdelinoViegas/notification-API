import { getPatient, getScheduledExams } from "@/backend/api/clinical/internal-services-api";
import { internalExamResultModel } from "@/backend/model";
import Accordium from "@/components/ui/accordium";
import InputDetails from "@/components/ui/input-details";
import ViewUserFile from "@/components/view-user-file-client";

export default async function Page({ params }: { params: Promise<{ id: string }>}){
  const { id } = await params;
  const requestedExams = await getScheduledExams(id);
  const patient = await getPatient(id);

  return(
    <div>
      <div className="my-3">
        <h2 className="text-xl">Utente: {patient?.fullname}</h2>

        <h2 className="font-bold mb-3 text-center">Exames Solicitados</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {requestedExams.map(async (props, index)=>{
            const examResult = await internalExamResultModel.findOne({ 
              serviceId: id, 
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
                  <ViewUserFile id={examResult.storageId} />
                }
              </Accordium>
            );
          })}
        </div>
      </div>
    </div>
  )
}