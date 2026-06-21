import { MonitorAccess, UnlockProcessAccess } from "@/components/lock-unlock-monitor-process";
import { getPatient, getScheduledExams } from "@/backend/api/clinical/internal-services-api";
import { internalExamResultModel } from "@/backend/model";
import FinishScheduledExam from "@/components/finish-schedule-exam";
import { LoboratoryForm } from "@/components/forms/laboratory-imaging-form";
import Accordium from "@/components/ui/accordium";
import clsx from "clsx";

export default async function Page({ params }: { params: Promise<{ id: string }>}){
  const { id } = await params;
  const requestedExams = await getScheduledExams(id);
  const patient = await getPatient(id);

  const className = clsx({ 
    "grid gap-3 grid-cols-2": requestedExams.length > 2,
    "flex flex-col gap-y-3": requestedExams.length <= 2 
  }, "overflow-auto max-h-[60vh]");

  return(
    <div>
      <MonitorAccess
        basePathname="/clinical/laboratory"
        patientId={patient?.id as string}
        place="laboratory" 
      />

      <UnlockProcessAccess
        basePathname="/clinical/laboratory"
        patientId={patient?.id as string}
        place="laboratory" 
      />

      <div className="my-3">
        <h2 className="text-xl">Utente: {patient?.fullname}</h2>

        <h2 className="font-bold mb-3 text-center">Exames Solicitados</h2>
        <div className={className}>
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
                  storageId={examResult?.storageId as string}
                />
              </Accordium>
            );
          })}
        </div>
      </div>
      <FinishScheduledExam id={id} />
    </div>
  )
}