import Header from "@/components/header";
import Card from "@/components/card";
import { getExamResult, getPatient, getPatientExams } from "@/app/backend/api/clinical/unit-api";
import LaboratoryForm from "@/components/forms/laboratory-form";

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
        <LaboratoryForm
          {...{patientName}} 
          savedResults={savedResults}
          resultId={imagingId} 
          {...{exams}}
        />
      </Card>
    </main>
  );
}
