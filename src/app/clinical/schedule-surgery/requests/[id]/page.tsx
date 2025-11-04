import { getDataAndHoursFormat } from "@/lib/date-formater";
import TitleAndSubtitle from "@/components/title-subtitle";
import ScheduleSugery from "@/components/forms/schedule-sugery";
import { getRequest } from "@/backend/api/clinical/office-api";

export default async function Page({ params }: { params: Promise<{ id: string }>}){ 
  const { id } = await params;
  const request = await getRequest(id);
  
  return (
    <div>
      <h2 className="text-lg font-bold">Informações da Solicitação </h2>
      
      <div className="flex items-center gap-x-12">
        <div className="ring ring-gray-200 ring-1 pl-6 py-8 rounded-lg min-w-[20vw]">
          <TitleAndSubtitle
            label="Nome do Utente"
            value={request?.patientName} 
          />

          <TitleAndSubtitle
            label="Tipo de consulta escolhido"
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

        <ScheduleSugery 
          patientId={request?.patientId as string}
          requestId={request?.id as string}
        />
      </div>
    </div>
  )
}