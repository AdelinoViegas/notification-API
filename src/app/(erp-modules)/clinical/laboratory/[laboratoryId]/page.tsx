import Header from "@/components/header";
import Card from "@/components/card";
import { getExamResult, getPatient, getPatientExams } from "@/app/backend/api/clinical/unit-api";
import LaboratoryForm from "@/components/forms/laboratory-imaging-form";
import CloseProcess from "@/components/close-process";
import { openPatientProcess } from "@/app/backend/api/clinical/process-api";
import ProcessAlert from "@/components/process-alert";

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
  const { patientId, patientName } = await getPatient(laboratoryId);
  const processState = await openPatientProcess(patientId, "laboratory");

  return(
    <main className="space-y-3">
      <div className="mt-6">
        <Header title="Exames Marcados" />
      </div>

      <div className="flex gap-x-3">
        <CloseProcess
          {...{patientId}}
          location="laboratory"
          path="/clinical/laboratory"
        />
      </div>

      <Card>
        <LaboratoryForm
          {...{patientName}} 
          savedResults={savedResults}
          resultId={laboratoryId} 
          {...{exams}}
        />
      </Card>
      {
        (processState && !processState?.status) &&
        <ProcessAlert path="/clinical/laboratory"/>
      }
    </main>
  );
}
