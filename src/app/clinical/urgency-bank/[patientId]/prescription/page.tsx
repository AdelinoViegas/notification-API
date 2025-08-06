import Prescription from "@/components/forms/prescription";
import { getPrescriptions } from "@/app/backend/api/clinical/urgency-bank-api";
import PrescriptionList from "@/components/prescription-list";

export default async function Page(){
  const prescriptions = await getPrescriptions();
  
  return(
    <div>
      <Prescription />
      <PrescriptionList items={prescriptions} />
    </div>
  )
}