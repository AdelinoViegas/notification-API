// //import { getSurgery } from "@/backend/api/clinical/urgency-bank-api";
// import ScheduleSugery from "@/components/forms/schedule-surgery";
// /*import Surgery from "@/components/forms/surgery";
// import SurgeryList from "@/components/surgery-list";
// import Accordium from "@/components/ui/accordium";*/

// export default async function Page({
//   params,
// }: {
//   params: Promise<{ 
//     patientId: string;
//   }>
// }){
//   const { patientId } = await params;

//   return(
//     <div>
//       {/*<Surgery />*/}
//         <ScheduleSugery {...{patientId}} />
//       {/*<SurgeryList items={surgeries} />*/}
//     </div>
//   )
// }

import { getRequests } from "@/backend/api/clinical/office-api"
import RequestSurgery from "@/components/request-surgery";
import Tag from "@/components/ui/tag";
import { formater } from "@/lib/table-formater";
import { getDataAndHoursFormat } from "@/lib/date-formater";
import Table from "@/components/table";

export default async function Page(){
  const requests = await getRequests({ 
    filterByUserId: true, 
    from: "surgery"
  });

  const rows = formater(requests, {
    filterKey: [
      "id",
      "kind", 
      "pending", 
      "createdAt"
    ],
    order: ["createdAt", "kind", "pending"],
    transform: {
      targetKey: "createdAt",
      fn: e => getDataAndHoursFormat(new Date(e))
    }
  });

  return(
    <div>
      <RequestSurgery />
      <Tag className="inline-flex my-3">Histórico de Pedidos</Tag>

      <Table
        columns={[
          "Pedido feito em", 
          "Tipo de Cirurgia", 
          "Estado"
        ]}
        rows={rows}
      />
    </div>
  );
}