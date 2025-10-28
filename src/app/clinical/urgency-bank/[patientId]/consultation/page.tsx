import { getConsultationHistory } from "@/backend/api/clinical/office-api"

export default async function Page({ params }: { params: Promise<{ patientId: string }>}){
  const { patientId } = await params;

  await getConsultationHistory(patientId);
  
  return(
    <div>historico de consultas</div>
  )
}