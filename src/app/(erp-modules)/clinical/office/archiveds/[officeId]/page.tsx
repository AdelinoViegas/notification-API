// import Header from "@/components/header";
// import Card from "@/components/card";
// import { getScheduleAppointment } from "@/app/backend/api/clinical/scheduling-api";
// import React from "react";
// import SubTitle from "@/components/ui/subtitle";
// import RescheduleAppointment from "@/components/reschedule-appointment";
// import Button from "@/components/ui/button";
// import { angolaCurrency } from "@/lib/table-formater";
// import TitleAndSubtitle from "@/components/title-subtitle";

// export default async function Page({
//   params
// }: {
//   params: {
//     scheduleId: string;
//   }
// }){

//   const schedule = await getScheduleAppointment(params.scheduleId);

//   return (
//     <main className="space-y-3">
//       <div className="mt-6">
//         <Header title="Informações da Consulta Arquivadas"/>
//       </div>

//       <div className="block overflow-auto h-[80vh] scroll overflow-auto">
//       <Card className="grid lg:grid-cols-2">
//           <div>
//             <SubTitle className="inline-flex mt-3">Informações da Consulta</SubTitle>
            
//             <TitleAndSubtitle
//               label="Nome Completo do Utente"
//               value={schedule.patient} 
//             />

//             <TitleAndSubtitle
//               label="Médico"
//               value={schedule.doctor} 
//             />

//             <TitleAndSubtitle
//               label="Descrição da Consulta"
//               value={schedule.consult.name} 
//             />

//             <TitleAndSubtitle
//               label="Preço"
//               value={angolaCurrency(schedule.consult.price)} 
//             />

//             <TitleAndSubtitle
//               label="Responsável"
//               value={schedule.responsable} 
//             />

//             <TitleAndSubtitle
//               label="Data da Consulta"
//               value={schedule.date.pt} 
//             />

//             <TitleAndSubtitle
//               label="Hora da Consulta"
//               value={schedule.hour} 
//             />

//             <div className="flex gap-x-3 mt-3">
//               <Button>Visualizar</Button>

//               <RescheduleAppointment 
//                 scheduleId={params.scheduleId}
//                 doctorId={schedule.doctorId}
//                 date={schedule.date.en}
//                 hour={schedule.hour}
//               />
//             </div>
//           </div>
//         </Card>
//       </div>
//     </main>
//   );
// }
import Header from "@/components/header";
import Card from "@/components/card";
import { getScheduleAppointment } from "@/app/backend/api/clinical/scheduling-api";
import SubTitle from "@/components/ui/subtitle";
import ArchivingAppointment from "@/components/archiving-appointment";
import TitleAndSubtitle from "@/components/title-subtitle";
import { angolaCurrency } from "@/lib/table-formater";

export default async function Page({
  params
}: {
  params: Promise<{
    officeId: string;
  }>
}){ 
  const { officeId } = await params;
  const schedule = await getScheduleAppointment(officeId);

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
              scheduleId={officeId}
              isArchived 
            />
          </div>
        </Card>
      </div>
    </main>
  );
}
