import { getSurgery } from "@/backend/api/clinical/urgency-bank-api";
import Surgery from "@/components/forms/surgery";
import SurgeryList from "@/components/surgery-list";

export default async function Page({
  
}: {
  searchParams: Promise<{ from: string; to: string }>
}){
  const surgeries = await getSurgery({});
  
  return(
    <div>
      <Surgery />
      <SurgeryList items={surgeries} />
    </div>
  )
}