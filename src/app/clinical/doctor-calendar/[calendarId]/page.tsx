import Card from "@/components/ui/card";
import Header from "@/components/header";
import CalendarForm from "@/components/forms/calendar-form";
import { getUsers } from "@/app/backend/api/clinical/api";
import { getDoctorCalender } from "@/app/backend/api/clinical/urgency-bank-api";

export default async function Page({
   params
}:{
   params: Promise<{
     calendarId: string 
    }>
  }){
  const { calendarId } = await params;  
  const users = await getUsers();
  const doctors = users.filter((user)=> user.categoryId === "doctor");
  const calendar = await getDoctorCalender(calendarId);
  const doctorListFormated = [];
  
  for(const doctor of doctors)
    doctorListFormated.push({
      _id: doctor._id,
      label: doctor.fullname,
    });

  return(
    <main className="space-y-3">
      <div className="mt-6">
        <Header title="Editar Calendário"/>
      </div>
      
      <Card>
        <CalendarForm 
          doctors={doctorListFormated}
          calendar={JSON.stringify(calendar)} 
        />
      </Card>
    </main>
  );
}