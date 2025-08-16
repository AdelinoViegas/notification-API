import Header from "@/components/header";
import Card from "@/components/ui/card";
import { getScheduleAppointment } from "@/backend/api/clinical/scheduling-api";
import SubTitle from "@/components/ui/subtitle";
import ArchivingAppointment from "@/components/archiving-appointment";
import TitleAndSubtitle from "@/components/title-subtitle";
import { angolaCurrency } from "@/lib/table-formater";

export default async function Page({ params }: { params: Promise<{ id: string }>}){ 
  const { id } = await params;
  const schedule = await getScheduleAppointment(id);

  return (
    <main className="space-y-3">
      <div className="mt-6">
        <Header title="Consutal Arquiva"/>
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
            <ArchivingAppointment 
              scheduleId={id}
              isArchived 
            />
          </div>
        </Card>
      </div>
    </main>
  );
}
