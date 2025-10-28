import { formater } from "@/lib/table-formater";
import Table from "@/components/table";
import Search from "@/components/ui/search";
import { getRequests } from "@/backend/api/clinical/operating-room-api";
import { getDataAndHoursFormat } from "@/lib/date-formater";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams
}:{
  searchParams: Promise<{
    name: string;
  }>
}) {
  const { name } = await searchParams;
  const surgeries = await getRequests({ from: "surgery", name });

  const rows = formater(surgeries, {
    filterKey: [
      "id",
      "patientName",
      "kind",
      "pending",
      "requester",
      "createdAt"
    ],
    order: [
      "createdAt",
      "kind",
      "patientName",
      "pending",
      "requester"
    ],
    transform: {
      targetKey: "createdAt",
      fn: e => getDataAndHoursFormat(new Date(e))
    }
  });

  return (
    <main className="space-y-3">
      <Search
        className="flex items-center gap-3"
        filterKey="name"
        label="Filtar por Nome"
        placeholder="Buscar pelo nome do utente..."
      />

      <Table
        columns={[
          "Data", 
          "Tipo de Cirurgia", 
          "Utente",
          "Estado",
          "Solicitante"
        ]} 
        rows={rows}
        baseRowLink="/clinical/schedule-surgery/requests"
      />
    </main>
  );
}
