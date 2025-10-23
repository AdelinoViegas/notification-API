import { formater } from "@/lib/table-formater";
import Table from "@/components/table";
import Search from "@/components/ui/search";
import { getRequests } from "@/backend/api/clinical/office-api";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams
}:{
  searchParams: Promise<{
    name: string;
  }>
}) {
  const { name } = await searchParams;
  const consultations = await getRequests({ kind: "consultation" });

  const rows = formater(consultations, {
    filterKey: [
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
    ]
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
          "Data e Hora", 
          "Nome do Utente", 
          "Nome do Médico",
          "Responsável",
          "Estado"
        ]} 
        rows={rows}
      />
    </main>
  );
}
