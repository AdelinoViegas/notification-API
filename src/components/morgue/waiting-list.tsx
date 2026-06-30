import { getMorgueWaitingList } from "@/backend/api/clinical/morgue-api";
import { formater } from "@/lib/table-formater";
import Table from "@/components/table";
import Alert from "@/components/ui/alert";
import Search from "@/components/ui/search";
import Refresh from "@/components/refresh";

export default async function WaitingList({ name }: { name?: string }) {
  const patients = await getMorgueWaitingList({ name });

  // formater espera { id, ...campos } — remover 'id' ao início
  const tableData = patients.map((p) => ({
    id: p.id,
    fullname: p.fullname,
    gender: p.gender,
    processNumber: p.processNumber,
    admissionDate: p.admissionDate,
    dateOfDeath: p.dateOfDeath,
    service: p.service,
  }));

  const rows = formater(tableData);

  return (
    <main className="space-y-3">
      <Refresh />

      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-3">
        <Alert
          type="info"
          message="Faça duplo click sobre o utente para proceder à acomodação na morgue."
        />
        <Search
          className="flex items-center gap-3"
          filterKey="name"
          label="Filtrar por nome"
          placeholder="Buscar pelo nome do utente..."
        />
      </div>

      <Table
        baseRowLink="/clinical/morgue"
        columns={[
          "Nome do Utente",
          "Sexo",
          "Nº Processo Clínico",
          "Data/Hora Admissão",
          "Data/Hora Óbito",
          "Serviço de Internamento",
        ]}
        rows={rows}
      />
    </main>
  );
}
