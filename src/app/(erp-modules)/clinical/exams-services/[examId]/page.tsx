import Header from "@/components/header";
import { getExam } from "@/app/backend/api/clinical/scheduling-api";
import ExamForm from "@/components/forms/exam-form";
import { getCCGs } from "@/app/backend/api/clinical/scheduling-api";
import { getSpecialties } from "@/app/backend/api/clinical/api";

export default async function Page({
	params
}:{
	params: Promise<{
		examId: string;
	}>
}) {
  const { examId } = await params;
  const examData = await getExam(examId);
  const group = await getCCGs("group");
  const categories = await getCCGs("category");
  const classifications = await getCCGs("classification");
  const specialties = await getSpecialties();

  return (
    <main className="space-y-3">
      <div className="mt-6">
        <Header title="Editar Exame/Serviço"/>
      </div>
      
      <ExamForm 
        exam={JSON.stringify(examData)} 
        groups={JSON.stringify(group)}
        categories={JSON.stringify(categories)}
        classifications={JSON.stringify(classifications)}
        specialties={JSON.stringify(specialties)}
      />
    </main> 
  );
}
