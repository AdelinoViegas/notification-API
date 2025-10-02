import PostAnestheticRecovery from "@/components/operating-room/post-anesthetic-recovery";
import { getOperatingRoom, getPatient } from "@/backend/api/clinical/operating-room-api";

export default async function Page({ params }:{
  params: Promise<{
    id: string;
  }>
}){
  const { id } = await params;
  const personal = await getPatient({id});
  const scheduleId = personal.scheduleId as string;
  const { postAnestheticRecovery } = await getOperatingRoom(scheduleId);
  return <PostAnestheticRecovery {...{scheduleId}} {...{postAnestheticRecovery}}/>
}