import Header from "@/components/header";
import Card from "@/components/ui/card";
import SubTitle from "@/components/ui/subtitle";
import ArchivingAppointment from "@/components/archiving-appointment";
import TitleAndSubtitle from "@/components/title-subtitle";
import { angolaCurrency } from "@/lib/table-formater";
import SendAppointment from "@/components/send-appointment";
//import PDFButton from "@/components/pdf-button";
import ValidateSugery from "@/components/validate-sugery";
import RescheduleSugery from "@/components/reschedule-sugery";
import { getScheduleSugery } from "@/backend/api/clinical/scheduling-api";
import Button from "@/components/ui/button";

export default async function Page({
  params
}: {
  params: Promise<{
    scheduleId: string;
  }>
}){ 
  const { scheduleId } = await params;
  const schedule = await getScheduleSugery(scheduleId);

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
                label="Tipo de Cirurgia"
                value={schedule.sugery.type} 
              />

              <TitleAndSubtitle
                label="Preço da Cirurgia"
                value={angolaCurrency(schedule.sugery.price)} 
              />

              <TitleAndSubtitle
                label="Responsável"
                value={'schedule.responsable'} 
              />

              <TitleAndSubtitle
                label="Data da Cirurgia"
                value={schedule.date.pt} 
              />

              <TitleAndSubtitle
                label="Hora da Cirurgia"
                value={schedule.hour} 
              />

              <TitleAndSubtitle
                label="Observação"
                value={schedule.description} 
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
            {/*<PDFButton
              label="Visualizar"
              type="appointmentRecord"
              args={{    
                patientName: schedule.patient,
                age: schedule.age,
                gender: schedule.gender,
                date: schedule.date.pt,
                hour: schedule.hour,
                consultationType: schedule.consult.name,
                consultationPrice: schedule.consult.price,
              }}
            />*/}
            <Button>Visualizar</Button>                    

            <RescheduleSugery
              scheduleId={scheduleId}
              doctorId={schedule.doctorId}
              date={schedule.date.en}
              hour={schedule.hour}
            />
              
            <ValidateSugery 
              disabled={!schedule.sugery.price || schedule.payment.status === "Confirmado"}
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

