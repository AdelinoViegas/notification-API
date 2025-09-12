import Prescription from "@/components/forms/prescription";
import PrescriptionList from "@/components/prescription-list";
import UrgencyFilter from "@/components/urgency-filters";
import { getPrescriptions } from "@/backend/api/clinical/urgency-bank-api";

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