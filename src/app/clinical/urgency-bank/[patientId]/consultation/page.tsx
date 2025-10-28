import { getConsultationHistory } from "@/backend/api/clinical/office-api"

export default async function Page({ params }: { params: Promise<{ patientId: string }>}){
  const { patientId } = await params;
  const history = await getConsultationHistory(patientId);
  
  return(
    <div>
      <h2>historico de consultas</h2>
      <pre className="bg-indigo-950 text-white font-bold">{JSON.stringify(history, null, 2)}</pre>
    </div>
  )
}