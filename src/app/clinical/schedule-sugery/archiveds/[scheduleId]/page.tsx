import Header from "@/components/header";
import Card from "@/components/ui/card";
import { getScheduleSugery } from "@/backend/api/clinical/scheduling-api";
import SubTitle from "@/components/ui/subtitle";
import TitleAndSubtitle from "@/components/title-subtitle";
import { angolaCurrency } from "@/lib/table-formater";
import { getDateInSlashFormat } from "@/lib/date-formater";
import ArchivingSugery from "@/components/archiving-sugery";
//import RescheduleAppointment from "@/components/reschedule-appointment";

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
        <Header title="Informações da consulta arquivada"/>
      </div>

      <div className="overflow-auto h-[80vh] scroll overflow-auto">
        <Card>
          <div className="grid grid-cols-2 py-2">
            <div>
              <SubTitle className="inline-flex mt-3">Informações da Cirurgia</SubTitle>
              
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
                value={schedule.doctor} 
              />

              <TitleAndSubtitle
                label="Data da Cirurgia"
                value={schedule.date?getDateInSlashFormat(schedule.date):"Indefinido"} 
              />

              <TitleAndSubtitle
                label="Hora da Cirurgia"
                value={schedule.hour || "Indefinido"} 
              />

              <TitleAndSubtitle
                label="Observação"
                value={schedule.description} 
              />
            </div>

            <div>
            <SubTitle className="inline-flex mt-3">Informações do arquivamento</SubTitle>

              <TitleAndSubtitle
                label="Motivo do arquivamento"
                value={schedule.archiving.reason} 
              />
              
              <ArchivingSugery 
                scheduleId={scheduleId}
                isArchived
              />
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
