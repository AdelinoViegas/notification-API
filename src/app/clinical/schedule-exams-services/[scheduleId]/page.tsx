import Header from "@/components/header";
import Card from "@/components/ui/card";
import { getSchedulePatientExam } from "@/app/backend/api/clinical/scheduling-api";
import RescheduleExam from "@/components/reschedule-exam";
import { getUnits } from "@/app/backend/api/clinical/urgency-bank-api";
import { SelectionOption } from "@/components/ui/selection";
import SubTitle from "@/components/ui/subtitle";
import Button from "@/components/ui/button";
import ArchivingScheduleExam from "@/components/archiving-schedule-exam";
import { angolaCurrency } from "@/lib/table-formater";
import TitleAndSubtitle from "@/components/title-subtitle";
import SendScheduleExam from "@/components/send-schedule-exam";
import ValidateService from "@/components/validate-services";
import { FaFilePdf } from "react-icons/fa6";

export default async function Page({
  params
}: {
  params: Promise<{
    scheduleId: string;
  }>
}){ 
  const { scheduleId } = await params;
  const schedule = await getSchedulePatientExam(scheduleId);
  const laboratories = await getUnits(['laboratory', 'imaging'], true) as SelectionOption[];

  return (
    <main className="space-y-3">
      <div className="mt-6">
        <Header title="Atender Exame Agendado"/>
      </div>

      <div className="overflow-auto h-[80vh] scroll overflow-auto">
        <Card>
          <div className="grid lg:grid-cols-2">
            <div>
              <SubTitle className="inline-flex mt-3">Informações do Agendamento</SubTitle>
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
                value={angolaCurrency(Number(schedule?.examPrice))} 
              />

              <TitleAndSubtitle
                label="Observação"
                value={schedule?.detail as string} 
              />

            </div>
            <div>                                                    
              <SubTitle className="inline-flex mt-3">Informações do Pagamento</SubTitle>
              
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
            <Button 
              className="flex gap-x-2" >
              <FaFilePdf/>
              Visualizar
            </Button>
            
            <RescheduleExam 
              detail={schedule?.detail as string} 
              date={schedule?._createdAt as Date}
              laboratories={{
                list: laboratories,
                current: schedule?.laboratoryId as string,
              }}
              scheduleId={scheduleId}
            />
            
            <ValidateService
              disabled={!Number(schedule.examPrice) || schedule.payment.status === "Confirmado"}
              scheduleId={scheduleId}
              code={schedule.payment.code}
              proof={schedule.payment.proof}
              value={schedule.payment.value}
            />

            <SendScheduleExam scheduleId={scheduleId} />

            <ArchivingScheduleExam scheduleId={scheduleId} />
          </div>
        </Card>
      </div>
    </main>
  );
}
