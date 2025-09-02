import { 
  ScheduleSugery,
  tableSugeries
} from "@/lib/table-formater";
import Search from "@/components/ui/search";
import Table from "@/components/table";
import { getScheduleSugeries } from "@/backend/api/clinical/scheduling-api";
import SelectionFilter from "@/components/ui/selection-filter";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams
}:{
  searchParams: Promise<{
    name:string;
    area: string;
  }>
}) {
  const { name, area }  = await searchParams;
    const patientRows = tableSugeries(await getScheduleSugeries({ 
      name,
      area,
      served: false,
      canceled: true,
    }) as ScheduleSugery[]);
  
  return (
    <main className="space-y-3">
      <div className="lg:flex justify-between items-center">
        <SelectionFilter
          filterKey="area"
          className="m-0" 
          label="Selecione o serviço solicitante"
          options={[
            {_id:"Consultório de urgência", label:"Consultório de urgência"},
            {_id:"Internamento", label:"Internamento"},
            {_id:"Consultório", label:"Consultório"},
            {_id:"Utentes", label:"Utentes"},
          ]} 
        />
        
        <Search
          className="flex items-center gap-x-3"
          filterKey="name"
          label="Filtar por Nome"
          placeholder="Buscar pelo nome do utente"
        />
      </div>

      <Table
        status
        baseRowLink="/clinical/schedule-sugery/archiveds"
        columns={[
          "Serv. Solicitante",
          "Data e Hora", 
          "Nome do Utente", 
          "Tipo de cirurgia",
          "Efermaria",
          "Cama",
          "Nome do Médico",
          "Estado"
        ]} 
        rows={patientRows}
      />
    </main>
  );
}
