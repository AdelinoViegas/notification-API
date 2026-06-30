import { angolaCurrency } from "@/lib/table-formater";
import Header from "@/components/header";
import Card from "@/components/ui/card";
import RescheduleExam from "@/components/reschedule-exam";
import { SelectionOption } from "@/components/ui/selection";
import Tag from "@/components/ui/tag";
import ArchivingScheduleExam from "@/components/archiving-schedule-exam";
import TitleAndSubtitle from "@/components/title-subtitle";
import SendScheduleExam from "@/components/send-schedule-exam";
import ValidateService from "@/components/validate-services";
import PDFButton from "@/components/pdf-button";
import { getSchedulePatientExam } from "@/backend/api/clinical/scheduling-api";
import { getUnits } from "@/backend/api/clinical/urgency-bank-api";

export default async function Page({ params }:{ params: Promise<{ id: string }>
}){ 
  const { id } = await params;
  const schedule = await getSchedulePatientExam(id);
  const laboratories = await getUnits({type: ["laboratory", "imaging"]}) as SelectionOption[];

  return (
    <main className="space-y-3">
      <div className="mt-6">
        <Header title="Atender Exame Agendado"/>
      </div>

      <div className="overflow-auto h-[80vh] scroll overflow-auto">
        <Card>
          <div className="grid lg:grid-cols-2">
            <div>
              <Tag className="inline-flex mt-3">Informações do Agendamento</Tag>
              <TitleAndSubtitle
                label="Nome Completo do Utente"
                value={schedule?.patient as string} 
              />

              <TitleAndSubtitle
                label="Local"
                value={schedule?.laboratory as string} 
              />

              <TitleAndSubtitle
                label="Data e Hora da Marcação"
                value={schedule?.createdAt as string} 
              />

              <TitleAndSubtitle
                label="Responsável pelo agendamento"
                value={schedule?.user as string}
              />

              <TitleAndSubtitle
                label="Exames solicitados"
                value={
                  <details className="my-3">
                    <summary>Lista</summary>
                    <div className="mt-3">
                      <ul>
                        {schedule?.exams.map((props, i)=>(
                          <li key={i}>{i+1}. {`${props.name} - ${angolaCurrency(props.price)}`}</li>
                        ))}
                      </ul>
                    </div>
                  </details>
                }
              />

              <TitleAndSubtitle
                label="Preço Total"
                value={angolaCurrency(schedule?.examPrice)} 
              />

              <TitleAndSubtitle
                label="Observação"
                value={schedule?.detail as string} 
              />

            </div>
            <div>                                                    
              <Tag className="inline-flex mt-3">Informações do Pagamento</Tag>
              
              <TitleAndSubtitle
                label="Código da Fatura"
                value={schedule?.payment.code?schedule?.payment.code:"Não definido"} 
              />

              <TitleAndSubtitle
                label="Código do Comprovante"
                value={schedule?.payment.proof?schedule?.payment.proof:"Não definido"} 
              />

              <TitleAndSubtitle
                label="Estado do Pagmento"
                value={schedule?.payment.status} 
              />

              <TitleAndSubtitle
                label="Valor Pago"
                value={angolaCurrency(Number(schedule?.payment.value))} 
              />

              <TitleAndSubtitle
                label="Valor Porcentual"
                value={schedule?.payment.porcentage} 
              />
            </div>
          </div>
          <div className="flex gap-x-3 my-4">
            <PDFButton
              label="Visualizar"
              type="scheduleExamsRecord"
              args={{
                registerNumber: schedule.registerNumber,
                fullname: schedule.patient,
                age: schedule.age,
                gender: schedule.gender,
                date: schedule.createdAt,
                exams: schedule.exams,
                examsTotalPrice: schedule.examPrice
              }}
            />   
            
            <RescheduleExam 
              detail={schedule?.detail as string} 
              date={schedule?._createdAt as Date}
              laboratories={{
                list: laboratories,
                current: schedule?.laboratoryId as string,
              }}
              scheduleId={id}
            />
            
            <ValidateService
              disabled={!schedule.examPrice || schedule.payment.status === "Confirmado"}
              scheduleId={id}
              code={schedule.payment.code}
              proof={schedule.payment.proof}
              value={schedule.payment.value}
            />

            <SendScheduleExam scheduleId={id} />
            <ArchivingScheduleExam scheduleId={id} />
          </div>
        </Card>
      </div>
    </main>
  );
}