import { formater } from "@/lib/table-formater";
import Table from "@/components/table";
import SpecialtyModal from "@/components/specialty-modal";
import { getSpecialties } from "@/backend/api/clinical/api";

export const dynamic = "force-dynamic";

export default async function Page() {
  const specialtiesData = await getSpecialties();
  const patientRows = formater(specialtiesData, {
    order:[
      "name",
    ],
    filterKey: [
      "id",
      "name",
    ]
  });

  return (
    <main className="space-y-3">
      <div className="flex gap-x-2 pb-4">
        <SpecialtyModal />
      </div>
  
      <Table
        baseRowLink="/clinical/phisical-unit/specialty"
        columns={["Especialidade"]} 
        rows={patientRows}
      />
    </main>
  );
}