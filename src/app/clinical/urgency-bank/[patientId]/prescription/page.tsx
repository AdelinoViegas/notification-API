import Prescription from "@/components/forms/prescription";
import PrescriptionList from "@/components/prescription-list";
import UrgencyFilter from "@/components/urgency-filters";
import { getPrescriptions } from "@/backend/api/clinical/urgency-bank-api";

export default async function Page({
  searchParams,
  params
}: {
  searchParams: Promise<{ from: string; to: string }>;
  params: Promise<{ patientId: string }>
}){
  const { from, to } = await searchParams;
  const { patientId } = await params;
  const prescriptions = await getPrescriptions({ from, to, patientId });
  
  return(
    <main>
      <Prescription />
      <UrgencyFilter />
      <PrescriptionList items={prescriptions} />
    </main>
  )
}