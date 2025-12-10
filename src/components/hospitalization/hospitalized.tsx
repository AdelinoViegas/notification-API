import Table from "@/components/table";
import Search from "@/components/ui/search";
import { formater } from "@/lib/table-formater";
import Pagination from "@/components/pagination";
import Refresh from "@/components/refresh";
import { getPatients } from "@/backend/api/clinical/hospitalization-api";
import Filter from "@/components/hospitalization/filter";
import { getDataAndHoursFormat } from "@/lib/date-formater";
import Alert from "@/components/ui/alert";
import { getMyClinicalProfile } from "@/backend/api/clinical/api";

export default async function Hospitalized({ page }: {
  pfn?: string;
  _fn?: string;
  page?: number;
}){
  const patients = await getPatients({ 
    page: page?Number(page):1,
    served: true,
    filterByUserId: true,
    strictQuery: true
  });

  const intService = (await getMyClinicalProfile())?.internalService;
  
  const rows = formater(patients.patients, {
    filterKey: [
      "id",
      "createdAt",
      "fullname",
      "nursing",
      "bed",
      "processNumber",
      "user"
    ],
    order: [
      "createdAt",
      "fullname",
      "nursing",
      "bed",
      "processNumber",
      "user"
    ],
    transform: {
      targetKey: "createdAt",
      fn: e => getDataAndHoursFormat(new Date(e))
    }
  });
  
  return (
    <main className="space-y-3">
      <Refresh />

      <div className="flex flex-col lg:flex-row justify-between lg:items-center">
        <Alert 
          type="info" 
          message="Faça duplo click sobre o utente para seguir com o atendimento!" 
        />
        <div className="flex gap-x-3 items-top">
          <Filter internalServiceId={intService?.id} />
        
          <Search
            className="flex items-center gap-3"
            filterKey="pfn" // patient fullname
            label="Filtar por nome"
            placeholder="Buscar pelo nome do utente..."
          />
        </div>
      </div>

      <Table
        baseRowLink="/clinical/hospitalization/hosted"
        columns={[
          "Data Registro",
          "Nome Completo", 
          "Enfermaria/Quarto", 
          "Nº da Cama",
          "Nº de Processo",
          "Médico Assistente"
        ]} 
        rows={rows}
      />

      <Pagination
        availablePages={patients.availablePages as number}
        totalItems={patients.totalItems as number} 
      />
    </main>
  );
}