import { VitalSignalsForm } from "@/components/forms/screening-forms";
import { 
  getPatientScreening, 
  getPatientInScreening
} from "@/app/backend/api/clinical/api";
import { redirect } from "next/navigation";

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

  const vitalSignals = await getPatientScreening("vital signal", screening._id.toString());

  return(
    <main>
      {
        !!vitalSignals?
        <VitalSignalsForm 
          hasData
          jsonData={JSON.stringify(vitalSignals)}
        />:
        <VitalSignalsForm />
      }
    </main>
  );
}