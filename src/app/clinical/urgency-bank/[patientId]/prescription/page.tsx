import Prescription from "@/components/forms/prescription";
import PrescriptionList from "@/components/prescription-list";
import UrgencyFilter from "@/components/urgency-filters";
import { getPrescriptions } from "@/backend/api/clinical/urgency-bank-api";

export default async function Page({
  searchParams,
  params
}: {
  searchParams: Promise<{ f: string; t: string }>;
  params: Promise<{ patientId: string }>
}){
  const { f, t } = await searchParams;
  const { patientId } = await params;
  const prescriptions = await getPrescriptions({ from: f, to: t, patientId });
  
  return(
    <main>
      <Prescription />
      <UrgencyFilter />
      <PrescriptionList items={prescriptions} />
    </main>
  )
}