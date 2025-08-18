import { getSurgery } from "@/app/backend/api/clinical/urgency-bank-api";
import Surgery from "@/components/forms/surgery";
import SurgeryList from "@/components/surgery-list";

export default async function Page({
  
}: {
  searchParams: Promise<{ from: string; to: string }>
}){
  const surgeries = await getSurgery({});
  
  console.log(surgeries);
  return(
    <div>
      <Surgery />
      <SurgeryList items={surgeries} />
    </div>
  )
}