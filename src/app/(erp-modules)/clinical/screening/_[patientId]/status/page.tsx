import { StatusForm } from "@/components/forms/screening-forms";
import { 
  getPatientScreening, 
  getPatientInScreening
} from "@/app/backend/api/clinical/api";
import { redirect } from "next/navigation";

export default async function Page({
  params
}:{
  params: Promise<{
    patientId: string;
  }>
}){
  const { patientId } = await params;
  const screening = await getPatientInScreening(patientId);

  if(!screening)
    return redirect("/clinical/?invalid-patient");

  const actualStatus = await getPatientScreening("status", screening._id.toString()) as { detail: string; };

  return(
    <main>
      {
        actualStatus?
        <StatusForm
          jsonData={JSON.stringify(actualStatus)}
          hasData 
        />:
        <StatusForm />
      }
    </main>
  );
}