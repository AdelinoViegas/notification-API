import IntraoperativeProcedure from "@/components/operating-room/intraoperative-procedure";
import { getOperatingRoom, getPatient } from "@/backend/api/clinical/operating-room-api";

export default async function Page({ params }:{
  params: Promise<{
    id: string;
  }>
}){
  const { id } = await params;
  const personal = await getPatient({id});
  const scheduleId = personal.scheduleId as string;
  const { intraoperativeProcedure } = await getOperatingRoom(scheduleId);
  return <IntraoperativeProcedure {...{scheduleId}} {...{intraoperativeProcedure}}/>
}