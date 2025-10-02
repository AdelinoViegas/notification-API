import PreoperativeEvaluation from "@/components/operating-room/preoperative-evaluation";
import { getOperatingRoom, getPatient } from "@/backend/api/clinical/operating-room-api";


export default async function Page({ params }:{
	params: Promise<{
		id: string;
	}>
}){
	const { id } = await params;
  const personal = await getPatient({id});
  const scheduleId = personal.scheduleId as string;
  const patientId = personal._id as string;
  const { preoperativeEvaluation } = await getOperatingRoom(scheduleId);
  
  return(
    <div>
      <PreoperativeEvaluation 
        {...{preoperativeEvaluation}} 
        {...{scheduleId}}
        {...{patientId}}
        operatingRoomId={id}
      />
    </div>
  )
}