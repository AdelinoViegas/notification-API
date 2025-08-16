import { MonitorAccess, UnlockProcessAccess } from "@/components/lock-unlock-monitor-process";
import { getPatient, getScheduledExams } from "@/backend/api/clinical/unit-api";
import { internalExamResultModel } from "@/backend/model";
import FinishScheduledExam from "@/components/finish-schedule-exam";
import { LoboratoryForm } from "@/components/forms/laboratory-imaging-form";
import Accordium from "@/components/ui/accordium";
import UserFileViewer from "@/components/user-file-viewer";

export default async function Page({ params }: { params: Promise<{ id: string}>}){
  const { id } = await params;
  const requestedExams = await getScheduledExams(id);
  const patient = await getPatient(id);

  return(
    <div>
      <MonitorAccess
        basePathname="/clinical/imaging"
        patientId={patient?.id as string}
        place="imaging" 
      />

      <UnlockProcessAccess
        basePathname="/clinical/imaging"
        patientId={patient?.id as string}
        place="imaging" 
      />

      <div className="my-3">
        <h2 className="text-xl">Utente: {patient?.fullname}</h2>

        <h2 className="font-bold mb-3 text-center">Exames Solicitados</h2>
        <div className="space-y-3">
          {requestedExams.map(async (props, index)=>{
            const examResult = await internalExamResultModel.findOne({ 
              serviceId: id, 
              examId: props._id  
            });

            return (
              <Accordium title={props.name} key={index}>
                <LoboratoryForm
                  examId={props._id}
                  serviceId={id}
                  description={examResult?.description as string}
                />
                { examResult?.storageId &&
                  <UserFileViewer id={examResult.storageId} />
                }
              </Accordium>
            );
          })}
        </div>
      </div>
      
      <FinishScheduledExam id={id} />
    </div>
  )
}