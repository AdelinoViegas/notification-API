import { getExamsHistories } from "@/backend/api/clinical/scheduling-api"
import ExamHistoryComponent from "./client";

export default async function ExamHistory({ patientId }: { patientId: string }){
  const examsHistory = await getExamsHistories(patientId);

  return(
    <div className="space-y-3 py-2">
      <h2 className="text-lg font-bold">Todos os exames realizados</h2>
      <ExamHistoryComponent items={examsHistory} />
    </div>
  )
}