import Header from "@/components/header";
import Card from "@/components/ui/card";
import { getScheduleAppointment } from "@/app/backend/api/clinical/scheduling-api";
import SubTitle from "@/components/ui/subtitle";
import TitleAndSubtitle from "@/components/title-subtitle";
import { angolaCurrency } from "@/lib/table-formater";
import RescheduleAppointment from "@/components/reschedule-appointment";

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
        <Header title="Informações da consulta arquivada"/>
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
            <SubTitle className="inline-flex mt-3">Informações do arquivamento</SubTitle>

              <TitleAndSubtitle
                label="Motivo do arquivamento"
                value={schedule.archiving.reason} 
              />
              
              <RescheduleAppointment 
                scheduleId={scheduleId}
                doctorId={schedule.doctorId}
                date={schedule.date.en}
                hour={schedule.hour}
                isArchived
              />
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
