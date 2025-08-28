import { getExamsHistories } from "@/backend/api/clinical/scheduling-api"

export default async function ExamHistory({ patientId }: { patientId: string }){
  const examsHistory = await getExamsHistories(patientId);

  return(
    <div>
      <h2>Todos os exames realizados</h2>
      <pre>{JSON.stringify(examsHistory, null, 2)}</pre>
    </div>
  )
}