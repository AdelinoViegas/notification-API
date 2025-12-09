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