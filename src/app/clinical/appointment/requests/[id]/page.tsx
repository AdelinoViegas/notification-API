import Header from "@/components/header";
import Card from "@/components/ui/card";
import { getScheduleAppointment } from "@/backend/api/clinical/scheduling-api";
import SubTitle from "@/components/ui/subtitle";
import ArchivingAppointment from "@/components/archiving-appointment";
import RescheduleAppointment from "@/components/reschedule-appointment";
import ValidateAppointment from "@/components/validate-appointment";
import TitleAndSubtitle from "@/components/title-subtitle";
import { angolaCurrency } from "@/lib/table-formater";
import SendAppointment from "@/components/send-appointment";
import PDFButton from "@/components/pdf-button";
import { getRequest } from "@/backend/api/clinical/office-api";

export default async function Page({ params }: { params: Promise<{ id: string }>}){ 
  const { id } = await params;
  const request = await getRequest(id);
  
  return (
    <div>
      <h2>Informações da Solicitação </h2>
      <TitleAndSubtitle
        label="Nome do Utente"
        value={request?.patientName} 
      />
    </div>
  )
}