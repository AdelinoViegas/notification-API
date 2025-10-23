import TitleAndSubtitle from "@/components/title-subtitle";
import { getRequest } from "@/backend/api/clinical/office-api";
import { getDataAndHoursFormat } from "@/lib/date-formater";

export default async function Page({ params }: { params: Promise<{ id: string }>}){ 
  const { id } = await params;
  const request = await getRequest(id);
  
  return (
    <div>
      <h2>Informações da Solicitação </h2>
      
      <div>
        <TitleAndSubtitle
          label="Nome do Utente"
          value={request?.patientName} 
        />

        <TitleAndSubtitle
          label="Tipo de Consulta"
          value={request?.kind} 
        />

        <TitleAndSubtitle
          label="Colega que solicitou"
          value={request?.requester} 
        />

        <TitleAndSubtitle
          label="Data do Pedido"
          value={getDataAndHoursFormat(request?.createdAt as Date)} 
        />
      </div>
    </div>
  )
}