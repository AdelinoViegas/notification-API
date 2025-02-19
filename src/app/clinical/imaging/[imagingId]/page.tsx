import Header from "@/components/header";
import Card from "@/components/ui/card";
import { getExamResult, getPatient, getPatientExams } from "@/app/backend/api/clinical/unit-api";
import LaboratoryImagingForm from "@/components/forms/laboratory-imaging-form";
import { openPatientProcess } from "@/app/backend/api/clinical/process-api";
import CloseProcess from "@/components/close-process";
import ProcessAlert from "@/components/process-alert";

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
  const { patientId, patientName } = await getPatient(imagingId);
  const processState = await openPatientProcess(patientId, "imaging");

  return(
    <main className="space-y-3">
      <div className="mt-6">
        <Header title="Exames Marcados" />
      </div>

      <div className="flex gap-x-3">
        <CloseProcess
          {...{patientId}}
          location="imaging"
          path="/clinical/imaging"
        />
      </div>

      <Card>
        <LaboratoryImagingForm
          {...{patientName}} 
          savedResults={savedResults}
          resultId={imagingId} 
          {...{exams}}
          imaging
        />
      </Card>
      {
        (processState && !processState?.status) &&
        <ProcessAlert path="/clinical/imaging"/>
      } 
    </main>
  );
}
