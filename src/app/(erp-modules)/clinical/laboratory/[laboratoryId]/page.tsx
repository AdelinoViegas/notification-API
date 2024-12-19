import Header from "@/components/header";
import Card from "@/components/card";
import { getExamResult, getPatient, getPatientExams } from "@/app/backend/api/clinical/unit-api";
import LaboratoryForm from "@/components/forms/laboratory-imaging-form";

export default async function Page({
  params
}: {
  params: Promise<{
    laboratoryId: string;
  }>
}){
  const { laboratoryId } = await params;
  const exams = await getPatientExams(laboratoryId);
  const savedResults = await getExamResult({ serviceResultId: laboratoryId });
  const patientName = await getPatient(laboratoryId);

  return(
    <main className="space-y-3">
      <div className="mt-6">
        <Header title="Exames Marcados" />
      </div>

      <Card>
        <LaboratoryForm
          {...{patientName}} 
          savedResults={savedResults}
          resultId={laboratoryId} 
          {...{exams}}
        />
      </Card>
    </main>
  );
}
