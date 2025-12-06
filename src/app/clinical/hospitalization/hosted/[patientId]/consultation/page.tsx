import { getRequests } from "@/backend/api/clinical/office-api"
import RequestConsult from "@/components/request-consult";
import Tag from "@/components/ui/tag";
import { formater } from "@/lib/table-formater";
import { getDataAndHoursFormat } from "@/lib/date-formater";
import Table from "@/components/table";

export default async function Page({ params }: { params: Promise<{ patientId: string }>}){
  const { patientId } = await params;
  const requests = await getRequests({ 
    filterByUserId: true, 
    from: "consultation"
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
      <RequestConsult />
      <Tag className="inline-flex my-3">Histórico de Pedidos</Tag>

      <Table
        columns={[
          "Pedido feito em", 
          "Tipo de Consulta", 
          "Estado"
        ]}
        rows={rows}
      />
    </div>
  );
}