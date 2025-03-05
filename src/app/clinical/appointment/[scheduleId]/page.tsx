import Header from "@/components/header";
import Card from "@/components/ui/card";
import { getScheduleAppointment } from "@/app/backend/api/clinical/scheduling-api";
import SubTitle from "@/components/ui/subtitle";
import Button from "@/components/ui/button";
import ArchivingAppointment from "@/components/archiving-appointment";
import RescheduleAppointment from "@/components/reschedule-appointment";
import ValidateAppointment from "@/components/validate-appointment";
import TitleAndSubtitle from "@/components/title-subtitle";
import { angolaCurrency } from "@/lib/table-formater";
import SendAppointment from "@/components/send-appointment";
import { FaFilePdf } from "react-icons/fa6";

export default async function Page({
  params
}: {
  params: Promise<{
    scheduleId: string;
  }>
}){ 
  const { scheduleId } = await params;
  const schedule = await getScheduleAppointment(scheduleId);

  return (
    <main className="space-y-3">
      <div className="mt-6">
        <Header title="Atender Consulta Agendada"/>
      </div>

      <div className="overflow-auto h-[80vh] scroll overflow-auto">
        <Card>
          <div className="grid grid-cols-2">
            <div>
              <SubTitle className="inline-flex mt-3">Informações da Consulta</SubTitle>
              
              <TitleAndSubtitle
                label="Nome do Utente"
                value={schedule.patient} 
              />

              <TitleAndSubtitle
                label="Médico"
                value={schedule.doctor} 
              />

              <TitleAndSubtitle
                label="Descrição da Consulta"
                value={schedule.consult.name} 
              />

              <TitleAndSubtitle
                label="Preço da Consulta"
                value={angolaCurrency(schedule.consult.price)} 
              />

              <TitleAndSubtitle
                label="Responsável"
                value={schedule.responsable} 
              />

              <TitleAndSubtitle
                label="Data da Consulta"
                value={schedule.date.pt} 
              />

              <TitleAndSubtitle
                label="Hora da Consulta"
                value={schedule.hour} 
              />

              <TitleAndSubtitle
                label="Observação"
                value={schedule.detail} 
              />
            </div>

            <div>
              <SubTitle className="inline-flex mt-3">Informações do Pagamento</SubTitle>
              
              <TitleAndSubtitle
                label="Código da Fatura"
                value={schedule.payment.code?schedule.payment.code:"Não definido"} 
              />

              <TitleAndSubtitle
                label="Código do Comprovante"
                value={schedule.payment.proof?schedule.payment.proof:"Não definido"} 
              />

              <TitleAndSubtitle
                label="Estado do Pagmento"
                value={schedule.payment.status} 
              />

              <TitleAndSubtitle
                label="Valor Pago"
                value={angolaCurrency(schedule.payment.value)} 
              />

              <TitleAndSubtitle
                label="Valor Porcentual"
                value={schedule.payment.porcentage} 
              />
            </div>
          </div>

          <div className="flex gap-x-3 mt-3">                        
            <Button 
              className="flex gap-x-2" 
              disabled
            >
              <FaFilePdf className="size-5"/>
              Visualizar
            </Button>

            <RescheduleAppointment 
              scheduleId={scheduleId}
              doctorId={schedule.doctorId}
              date={schedule.date.en}
              hour={schedule.hour}
            />

            <ValidateAppointment 
              disabled={!schedule.consult.price || schedule.payment.status === "Confirmado"}
              scheduleId={scheduleId}
              code={schedule.payment.code}
              proof={schedule.payment.proof}
              value={schedule.payment.value}
            />

            <SendAppointment scheduleId={scheduleId} />
            
            <ArchivingAppointment scheduleId={scheduleId} />
          </div>
        </Card>
      </div>
    </main>
  );
}

