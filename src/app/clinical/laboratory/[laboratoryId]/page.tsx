// import Card from "@/components/ui/card";
// import { getExamResult, getPatient, getPatientExams } from "@/app/backend/api/clinical/unit-api";
// import LaboratoryForm from "@/components/forms/laboratory-imaging-form";
// import { MonitorAccess, UnlockProcessAccess } from "@/components/lock-unlock-monitor-process";

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

export default function Page(){
  return<></>
}
