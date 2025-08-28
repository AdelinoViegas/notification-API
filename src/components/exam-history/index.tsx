import { getExamsHistories } from "@/backend/api/clinical/scheduling-api"

export default async function ExamHistory({ patientId }: { patientId: string }){
  await getExamsHistories(patientId);

  return(
    <div>
      <h2>Todos os exames realizados</h2>
    </div>
  )
}