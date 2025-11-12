//import { getSurgery } from "@/backend/api/clinical/urgency-bank-api";
import ScheduleSugery from "@/components/forms/schedule-surgery";
/*import Surgery from "@/components/forms/surgery";
import SurgeryList from "@/components/surgery-list";
import Accordium from "@/components/ui/accordium";*/

export default async function Page({
  params,
}: {
  params: Promise<{ 
    patientId: string;
  }>
}){
  const { patientId } = await params;

  return(
    <div>
      {/*<Surgery />*/}
        <ScheduleSugery {...{patientId}} />
      {/*<SurgeryList items={surgeries} />*/}
    </div>
  )
}