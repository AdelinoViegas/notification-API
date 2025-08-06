import Prescription from "@/components/forms/prescription";
import { getPrescriptions } from "@/app/backend/api/clinical/urgency-bank-api";
import PrescriptionList from "@/components/prescription-list";
import UrgencyFilter from "@/components/urgency-filters";

export default async function Page({
  searchParams
}: {
  searchParams: Promise<{ from: string; to: string }>
}){
  const { from, to } = await searchParams;
  const prescriptions = await getPrescriptions({ from, to });
  
  return(
    <div>
      <Prescription />
      <UrgencyFilter />
      <PrescriptionList items={prescriptions} />
    </div>
  )
}