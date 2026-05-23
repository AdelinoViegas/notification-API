import Table from "@/components/table";
import Alert from "@/components/ui/alert";
import Search from "@/components/ui/search";
import Refresh from "@/components/refresh";

export default async function DeathHistory({ 
  name: _name,
}: {
  name?: string;
}){
  return (
    <main className="space-y-3">
      <Refresh />

      <div className="flex flex-col lg:flex-row justify-between lg:items-center">
        <Alert 
          type="info" 
          message="Registos de óbitos serão exibidos nesta secção." 
        />
        
        <Search
          className="flex items-center gap-3"
          filterKey="name"
          label="Filtar por nome"
          placeholder="Buscar pelo nome do utente..."
        />
      </div>

      <Table
        baseRowLink="/clinical/historical"
        columns={[
          "Nº do processo",
          "Nome do paciente",
          "Serviço",
          "Data admissão",
          "Médico Assistente",
        ]} 
        rows={[]}
      />
    </main>
  );
}
