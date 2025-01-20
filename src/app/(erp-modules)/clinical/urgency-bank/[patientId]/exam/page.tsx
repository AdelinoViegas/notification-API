import { getPatientScheduledServices } from "@/app/backend/api/clinical/scheduling-api";
import RequestExams from "@/components/forms/request-exam";
import Accordium from "@/components/accordium";

export default async function Page({ params }: {
  params: Promise<{ patientId: string }>
}){
  const { patientId } = await params;
  const results = await getPatientScheduledServices({ patientId });

  return(
    <main>
      <pre className="text-xs fixed bg-black right-0 bottom-0 h-96 text-green-300 font-medium overflow-auto">
        {JSON.stringify(results, null, 2)}
      </pre>

      <Accordium title="Solicitação de Exames">
        <RequestExams {...{patientId}} isFullWindow />
      </Accordium>
     
    </main>
  );
}