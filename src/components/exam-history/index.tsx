import { getExamsHistories } from "@/backend/api/clinical/scheduling-api"
import ExamHistoryComponent from "./client";
import Tag from "@/components/ui/tag";

export default async function ExamHistory({ patientId }: { patientId: string }){
  const examsHistory = await getExamsHistories(patientId);

  return(
    <div className="space-y-3 py-2">
      <Tag className="inline-flex">Todos os exames realizados</Tag>
      <ExamHistoryComponent items={examsHistory} />
    </div>
  )
}