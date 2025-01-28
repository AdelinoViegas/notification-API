import Alert from "@/components/alert";
import Header from "@/components/header";
import Table from "@/components/table";
import Button from "@/components/ui/button";
import Link from "next/link";
import { getDoctorCalendars } from "@/app/backend/api/clinical/urgency-bank-api";
import tableFormater, { Calendar } from "@/lib/table-formater";
import { BiPlus as PlusIcon } from "react-icons/bi";

export const dynamic = "force-dynamic";

export default async function Page(){
  const calendarRows = tableFormater(await getDoctorCalendars() as Calendar[]);

  return(
    <main className="space-y-3">
      
      <div className="mt-6">
        <Header title="Calendário de Trabalho"/>
      </div>

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