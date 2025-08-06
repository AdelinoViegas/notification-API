import Prescription from "@/components/forms/prescription";
import { getPrescriptions } from "@/app/backend/api/clinical/urgency-bank-api";

export default async function Page(){
  const prescriptions = await getPrescriptions();

  return(
    <div>
      <Prescription />

      {JSON.stringify(prescriptions)}
    </div>
  )
}