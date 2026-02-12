import Table from "@/components/table";
import Filter from "./filter";
import { formater } from "@/lib/table-formater";
import Pagination from "@/components/pagination";
import Refresh from "@/components/refresh";
import RegisterNursing from "./register-nursings";
import { getBeds } from "@/backend/api/clinical/hospitalization-api";
import { getDateInSlashFormat } from "@/lib/date-formater";

export default async function Nursings({
  service,
  nursing, 
  section
}: {
  p?: number;
  service?: string;
  nursing?: string;
  section: string; 
}){
  
  const beds = await getBeds({service, nursing, section});

  const rows = formater(beds.beds, {
    filterKey: [
      "id",
      "createdAt",
      "internalService",
      "section",
      "nursing",
      "bed"
    ],
    transform: {
      targetKey: "createdAt",
      fn: e => getDateInSlashFormat(new Date(e))
    },
  });
  
  return (
    <main className="space-y-3">
      <Refresh />

      <div className="flex flex-col lg:flex-row justify-between lg:items-center">
        <div>
          <RegisterNursing />
        </div>

        <Filter />
      </div>

      <Table
        baseRowLink="/clinical/hospitalization/bu"
        columns={[
          "Data de Registro",
          "Serviço de Internamento",
          "Ala", 
          "Enfermaria", 
          "Cama"
        ]} 
        rows={rows}
      />

      <Pagination
        availablePages={beds.availablePages as number}
        totalItems={beds.totalItems as number} 
      />
    </main>
  );
}