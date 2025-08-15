// import { MonitorAccess, UnlockProcessAccess } from "@/components/lock-unlock-monitor-process";

import { getPatient, getScheduledExams } from "@/backend/api/clinical/unit-api";
import { internalExamResultModel } from "@/backend/model";
import FinishScheduledExam from "@/components/finish-schedule-exam";
import { LoboratoryForm } from "@/components/forms/laboratory-imaging-form";
import Accordium from "@/components/ui/accordium";
import UserFileViewer from "@/components/user-file-viewer";

export default async function Page({ params }: { params: Promise<{laboratoryId: string}>}){
  const { laboratoryId } = await params;
  const requestedExams = await getScheduledExams(laboratoryId);
  const patient = await getPatient(laboratoryId);

  return(
    <div>
      <h2>Utente: {patient?.fullname}</h2>

      <h2 className="font-bold mb-3">Exames Solicitados</h2>
      <div className="space-y-3">
         {requestedExams.map(async (props, index)=>{
          const examResult = await internalExamResultModel.findOne({ 
            serviceId: laboratoryId, 
            examId: props._id  
          });

          return (
            <Accordium title={props.name} key={index}>
              <LoboratoryForm
                examId={props._id}
                serviceId={laboratoryId}
                description={examResult?.description as string}
              />
              {
                examResult?.storageId &&
                <UserFileViewer id={examResult.storageId} />
              }
            </Accordium>
          );
        })}
      </div>
      <FinishScheduledExam id={laboratoryId} />
    </div>
  )
}