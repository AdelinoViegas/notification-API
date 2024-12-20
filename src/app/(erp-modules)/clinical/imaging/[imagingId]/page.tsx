import Header from "@/components/header";
import Card from "@/components/card";
import { getExamResult, getPatient, getPatientExams } from "@/app/backend/api/clinical/unit-api";
import LaboratoryImagingForm from "@/components/forms/laboratory-imaging-form";

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
  const patientName = await getPatient(imagingId);

  return(
    <main className="space-y-3">
      <div className="mt-6">
        <Header title="Exames Marcados" />
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
    </main>
  );
}
