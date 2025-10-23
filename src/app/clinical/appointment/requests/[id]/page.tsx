import TitleAndSubtitle from "@/components/title-subtitle";
import { getRequest } from "@/backend/api/clinical/office-api";
import { getDataAndHoursFormat } from "@/lib/date-formater";
import ScheduleAppointment from "@/components/forms/schedule-appointment";

export default async function Page({ params }: { params: Promise<{ id: string }>}){ 
  const { id } = await params;
  const request = await getRequest(id);
  
  return (
    <div>
      <h2 className="text-lg font-bold">Informações da Solicitação </h2>
      
      <div className="flex justify-between ring ring-gray-200 ring-1 p-3 my-3 rounded-lg">
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

      <ScheduleAppointment patientId={request?.patientId as string} />
    </div>
  )
}