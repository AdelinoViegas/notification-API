import { redirect } from "next/navigation";
import { AdviceForm } from "@/components/forms/screening-forms";
import { 
  getPatientInScreening,
  getPatientScreening 
} from "@/app/backend/api/clinical/api";

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
    return redirect("/clinical/screening");

  const advice = await getPatientScreening("advice", screening._id.toString()) as { detail: string; };

  return(
    <main>
      {
         advice?
        <AdviceForm 
          hasData
          jsonData={JSON.stringify(advice)} 
        />
        :
        <AdviceForm />
      }
    </main>
  );
}

