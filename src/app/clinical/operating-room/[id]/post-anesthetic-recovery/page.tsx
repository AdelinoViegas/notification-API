import PostAnestheticRecovery from "@/components/operating-room/post-anesthetic-recovery";
import { getOperatingRoom, getPatient } from "@/backend/api/clinical/operating-room-api";

export default async function Page({ params }:{
  params: Promise<{
    id: string;
  }>
}){
  const { id } = await params;
  const personal = await getPatient({id});
  const patientId = personal._id as string;
  const { postAnestheticRecovery } = await getOperatingRoom(patientId);
  console.log(postAnestheticRecovery);
  return <PostAnestheticRecovery {...{patientId}} {...{postAnestheticRecovery}}/>
}