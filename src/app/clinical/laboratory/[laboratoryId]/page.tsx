// import Card from "@/components/ui/card";
// import { getExamResult, getPatient, getPatientExams } from "@/app/backend/api/clinical/unit-api";
// import LaboratoryForm from "@/components/forms/laboratory-imaging-form";
// import { MonitorAccess, UnlockProcessAccess } from "@/components/lock-unlock-monitor-process";

import { getExamResult, getPatient, getPatientExams } from "@/backend/api/clinical/unit-api";
import { internalExamResultModel } from "@/backend/model";

// export default async function Page({
//   params
// }: {
//   params: Promise<{
//     laboratoryId: string;
//   }>
// }){
//   const { laboratoryId } = await params;
//   const exams = await getPatientExams(laboratoryId);
//   const savedResults = await getExamResult({ serviceResultId: laboratoryId });
//   const { patientId, patientName } = await getPatient(laboratoryId);

//   return(
//     <main className="space-y-3">
//       <MonitorAccess
//         patientId={patientId}
//         place="laboratory"
//         basePathname="/clinical/laboratory"
//       />

//       <div className="flex gap-x-3">
//         <UnlockProcessAccess
//           patientId={patientId}
//           place="laboratory"
//           basePathname="/clinical/laboratory"
//         />
//       </div>

//       <Card>
//         <LaboratoryForm
//           {...{patientName}} 
//           savedResults={savedResults}
//           resultId={laboratoryId} 
//           {...{exams}}
//         />
//       </Card>
//     </main>
//   );
// }

import { LoboratoryForm } from "@/components/forms/laboratory-imaging-form";
import Accordium from "@/components/ui/accordium";
import UserFileViewer from "@/components/user-file-viewer";

export default async function Page({ params }: { params: Promise<{laboratoryId: string}>}){
  const { laboratoryId } = await params;
  const requestedExams = await getPatientExams(laboratoryId);
  // const savedResults = await getExamResult({ serviceResultId: laboratoryId });
  // const patient = await getPatient(laboratoryId);
  // console.log(requestedExams, savedResults, patient);

  return(
    <div>
      <h2>Exames Solicitados</h2>
      {requestedExams.map(async (props, index)=>{
        const examResult = await internalExamResultModel.findOne({ serviceId: laboratoryId });
        
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
  )
}