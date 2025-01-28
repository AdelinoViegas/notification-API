import Card from "@/components/ui/card";
import Header from "@/components/header";
import CalendarForm from "@/components/forms/calendar-form";
import { getUsers } from "@/app/backend/api/clinical/api";

export const dynamic = "force-dynamic";

export default async function Page(){
  const users = await getUsers();
  const doctors = users.filter((user)=> user.categoryId === "doctor");
  const doctorListFormated = [];
  
  for(const doctor of doctors)
    doctorListFormated.push({
      _id: doctor._id,
      label: doctor.fullname,
    });

  return(
    <main className="space-y-3">
      <div className="mt-6">
        <Header title="Cadastrar Calendário"/>
      </div>
      
      <Card>
        <CalendarForm doctors={doctorListFormated} />
      </Card>
    </main>
  );
}