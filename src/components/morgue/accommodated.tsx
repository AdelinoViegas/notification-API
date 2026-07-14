import { getMorgueAccommodated } from "@/backend/api/clinical/morgue-api";
import { formater } from "@/lib/table-formater";
import Table from "@/components/table";
import Alert from "@/components/ui/alert";
import Search from "@/components/ui/search";
import Refresh from "@/components/refresh";

export default async function Accommodated({
  name,
  responsibleName,
  responsibleBI,
}: {
  name?: string;
  responsibleName?: string;
  responsibleBI?: string;
}) {
  const patients = await getMorgueAccommodated({ name, responsibleName, responsibleBI });

  const tableData = patients.map((p) => ({
    id: p.id,          // accommodationId — used for double-click navigation to /exit/[id]
    fullname: p.fullname,
    chamber: p.chamber,
    drawer: p.drawer,
    responsibleName: p.responsibleName,
    responsibleBI: p.responsibleBI,
    responsibleContact: p.responsibleContact,
    responsibleKinship: p.responsibleKinship,
  }));

  const rows = formater(tableData);

  return (
    <main className="space-y-3">
      <Refresh />

      <Alert
        type="info"
        message="Faça duplo click sobre o utente para registar a saída do corpo."
      />

      <div className="flex flex-col sm:flex-row gap-2">
        <Search
          className="flex items-center gap-3"
          filterKey="name"
          label="Filtrar por nome do utente"
          placeholder="Nome do utente..."
        />
        <Search
          className="flex items-center gap-3"
          filterKey="rName"
          label="Nome do responsável"
          placeholder="Nome do responsável..."
        />
        <Search
          className="flex items-center gap-3"
          filterKey="rBI"
          label="BI do responsável"
          placeholder="Nº do BI..."
        />
      </div>

      <Table
        baseRowLink="/clinical/morgue/exit"
        columns={[
          "Nome do Utente",
          "Câmara",
          "Gaveta",
          "Responsável",
          "Nº do BI",
          "Contacto",
          "Parentesco",
        ]}
        rows={rows}
      />
    </main>
  );
}
