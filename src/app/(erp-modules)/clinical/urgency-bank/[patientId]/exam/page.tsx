import { getPatientScheduledServices } from "@/app/backend/api/clinical/scheduling-api";
import RequestExams from "@/components/forms/request-exam";
import Accordium from "@/components/accordium";
import Table from "@/components/table";
import { TableFormatter } from "@/lib/table-formater";
import WsUpdate from "@/components/ws-update";

export default async function Page({ params }: {
  params: Promise<{ patientId: string }>
}){
  const { patientId } = await params;
  const results = await getPatientScheduledServices({ patientId });
  const rows = TableFormatter.urgencyExamResults(results);
 
  return(
    <main>
      <WsUpdate target="laboratory" />

      <Accordium title="Solicitação de Exames">
        <RequestExams {...{patientId}} isFullWindow />
      </Accordium>

      <div className="flex flex-col gap-x-3 mt-6 mb-3">
        <h2 className="text-lg font-medium text-primary">Histórico de exames</h2>
        
        <Table
          columns={[
            "Data e Hora",
            "Tipo de Exame",
            "Resultado Descritivo",
            "Documento"
          ]}
          rows={rows}
        />
      </div>
    </main>
  );
}