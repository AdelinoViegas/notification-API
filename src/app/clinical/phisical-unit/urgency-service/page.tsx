import { formater } from "@/lib/table-formater";
import Table from "@/components/table";
import SignUrgencyService from "@/components/forms/sign-urgency-services";
import { getUrgencyServices } from "@/backend/api/clinical/urgency-bank-api";

export const dynamic = "force-dynamic";

export default async function Page() {
  const urgencyServicies = await getUrgencyServices();
  const patientRows = formater(urgencyServicies, {
    order:["label"],
    filterKey: [
      "id",
      "label",
    ]
  });

  return (
    <main className="space-y-3">
      <div className="flex gap-x-2 pb-4">
        <SignUrgencyService />
      </div>

      <Table
        baseRowLink="/clinical/phisical-unit/urgency-service"
        columns={["Serviço de urgência"]} 
        rows={patientRows}
      />
    </main>
  );
}