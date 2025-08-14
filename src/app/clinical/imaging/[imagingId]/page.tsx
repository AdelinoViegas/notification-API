import Header from "@/components/header";
// import Card from "@/components/ui/card";
import { 
  // getExamResult, 
  getPatient, 
  // getPatientExams 
} from "@/app/backend/api/clinical/unit-api";
// import LaboratoryImagingForm from "@/components/forms/laboratory-imaging-form";
import { MonitorAccess, UnlockProcessAccess } from "@/components/lock-unlock-monitor-process";

export default async function Page({
  params
}: {
  params: Promise<{
    imagingId: string;
  }>
}){
  const { imagingId } = await params;
  // const exams = await getPatientExams(imagingId);
  // const savedResults = await getExamResult({ serviceResultId: imagingId });
  const { patientId } = await getPatient(imagingId);

  return(
    <main className="space-y-3">
      <MonitorAccess
        patientId={patientId}
        place="imaging"
        basePathname="/clinical/imaging" 
      />

      <div className="mt-6">
        <Header title="Exames Marcados" />
      </div>

      <div className="flex gap-x-3">
        <UnlockProcessAccess
          patientId={patientId}
          place="imaging"
          basePathname="/clinical/imaging" 
        />
      </div>

      {/* <Card>
        <LaboratoryImagingForm
          {...{patientName}} 
          savedResults={savedResults}
          resultId={imagingId} 
          {...{exams}}
          imaging
        />
      </Card> */}
    </main>
  );
}
