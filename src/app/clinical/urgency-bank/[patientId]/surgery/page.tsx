import Prescription from "@/components/forms/prescription";
import { getPrescriptions, getSurgery } from "@/app/backend/api/clinical/urgency-bank-api";
import PrescriptionList from "@/components/prescription-list";
import UrgencyFilter from "@/components/urgency-filters";
import Surgery from "@/components/forms/surgery";
import SurgeryList from "@/components/surgery-list";

export default async function Page({
  searchParams
}: {
  searchParams: Promise<{ from: string; to: string }>
}){
  const { from, to } = await searchParams;
  const surgeries = await getSurgery({});
  // const prescriptions = await getPrescriptions({ from, to });
  
  return(
    <div>
      <Surgery />
      {/* <UrgencyFilter />
      <PrescriptionList items={prescriptions} /> */}

      <SurgeryList items={surgeries} />
    </div>
  )
}