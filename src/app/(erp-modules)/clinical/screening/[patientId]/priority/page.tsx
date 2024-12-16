import { PriorityForm } from "@/components/forms/screening-forms";
import { 
  getPatientScreening, 
  getPatientInScreening
} from "@/app/backend/api/clinical/api";
import { redirect } from "next/navigation";

export type Priority = {
  priority: string;
};

export default async function Page({
  params
}:{
  params: Promise<{
    patientId:string
  }>
}){  
  const { patientId } = await params;
  const screening = await getPatientInScreening(patientId);

  if(!screening)
    return redirect("/clinical/?invalid-patient");

  const priority = await getPatientScreening("priority", screening._id.toString()) as Priority;

  return(
    <main>
      {
        priority?
        <PriorityForm
          jsonData={JSON.stringify(priority)}
          hasData
        />:
        <PriorityForm />
      }
    </main>
  );
}