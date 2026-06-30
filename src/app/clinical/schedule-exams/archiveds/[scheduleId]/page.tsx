import Header from "@/components/header";
import Card from "@/components/ui/card";
import Tag from "@/components/ui/tag";
import RescheduleExam from "@/components/reschedule-exam";
import { SelectionOption } from "@/components/ui/selection";
import { getUnits } from "@/backend/api/clinical/urgency-bank-api";
import { 
  getExamCancel, 
  getSchedulePatientExam 
} from "@/backend/api/clinical/scheduling-api";

function TitleAndSubtitle({
  label,
  value,
}:{
  label: string;
  value: string | React.ReactNode;
}){
  return(
    <div className="mt-3">
      <p className="font-medium text-gray-500">{label}</p>
      <div className="ml-3">{value}</div>
    </div>
  )
}

export default async function Page({
  params
}: {
  params: Promise<{
    scheduleId: string;
  }>
}){ 
  const { scheduleId } = await params; 
  const schedule = await getSchedulePatientExam(scheduleId);
  const cancelation = await getExamCancel(scheduleId);
  const laboratories = await getUnits({type: ["laboratory", "imaging"]}) as SelectionOption[];
  
  return (
    <main className="space-y-3">
      <div className="mt-6">
        <Header title="Informações do exame arquivado"/>
      </div>

      <div className="block overflow-auto h-[80vh] scroll overflow-auto">
        <Card className="grid lg:grid-cols-2">
          <div>
            <Tag className="inline-flex mt-3">Informações do Agendamento</Tag>
            
            <TitleAndSubtitle
              label="Nome Completo do Utente"
              value={schedule?.patient as string} 
            />

            <TitleAndSubtitle
              label="Responsável pelo agendamento"
              value={schedule?.user as string}
            />

            <TitleAndSubtitle
              label="Responsável pelo arquivamento"
              value={cancelation?.user as string}
            />

            <TitleAndSubtitle
              label="Laboratório"
              value={schedule?.laboratory as string} 
            />

            <TitleAndSubtitle
              label="Data e Hora da Marcação"
              value={schedule?.createdAt as string} 
            />

            <TitleAndSubtitle
              label="Data e Hora do arquivamento"
              value={cancelation?.createdAt as string} 
            />

            <TitleAndSubtitle
              label="Observação"
              value={schedule?.detail as string} 
            />
          </div>

          <div>
          <Tag className="inline-flex mt-3">Exames solicitados</Tag>
            <TitleAndSubtitle
              label="Exames Selecionados"
              value={
                <details className="my-3">
                  <summary>Ver os exames</summary>
                  <div className="mt-3">
                    <ul>
                      {schedule?.exams.map((props, i)=>(
                        <li key={i}>{i+1}. {props.name}</li>
                      ))}
                    </ul>
                  </div>
                </details>
              }
            />   

            <TitleAndSubtitle
              label="Movito do arquivamento"
              value={cancelation?.reason as string} 
            /> 

            <RescheduleExam 
              detail={schedule?.detail as string} 
              date={schedule?._createdAt as Date}
              laboratories={{
                list: laboratories,
                current: schedule?.laboratoryId as string,
              }}
              scheduleId={scheduleId}
              isArchived
            /> 
          </div>
        </Card>
      </div>
    </main>
  );
}
