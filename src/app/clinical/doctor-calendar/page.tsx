import Link from "next/link";
import { formater } from "@/lib/table-formater";
import { BiPlus as PlusIcon } from "react-icons/bi";
import Alert from "@/components/ui/alert";
import Table from "@/components/table";
import Button from "@/components/ui/button";
import { getDoctorCalendars } from "@/backend/api/clinical/urgency-bank-api";
import { getDateInSlashFormat } from "@/lib/date-formater";

export const dynamic = "force-dynamic";

export default async function Page(){
  const calendar = await getDoctorCalendars();

  const calendarRows = formater(calendar, {
    filterKey: [
      "id",
      "createdAt",
      "description",
      "monthName",
      "creator",
    ],
    order: [
      "createdAt",
      "description",
      "monthName",
      "creator",
    ],
    transform: {
      targetKey: "createdAt",
      fn: e => getDateInSlashFormat(new Date(e))
    }
  });

  return(
    <main className="space-y-3">

      <div className="flex gap-3">
        <Link href="/clinical/doctor-calendar/sign">
          <Button className="flex gap-x-2">
            <PlusIcon className="w-5" />
            Novo Calendário
          </Button>
        </Link>
      </div>

      <div className="flex lg:flex-row py-3 items-center">
        <Alert 
          type="info" 
          message="Faça duplo click para editar!" 
        />
      </div>

      <Table
        columns={[
          "Data de Registro",
          "Descrição",
          "Mes do Calendário",
          "Responsável" 
        ]}
        baseRowLink="/clinical/doctor-calendar"
        rows={calendarRows}
      />
    </main>
  );
}