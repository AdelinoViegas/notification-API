import { InternalComponent } from "@/components/global-component";
import { CheckSecurity } from "@/components/operating-room/check-security";
import { checklistInOperatingRoom } from "@/lib/internal-components";
import { getOperatingRoom, getPatient } from "@/backend/api/clinical/operating-room-api";

export default async function Page({ params }:{
	params: Promise<{
		id: string;
	}>
}){
	const { id } = await params;
  const personal = await getPatient({id});
  const scheduleId = personal.scheduleId as string;
  const { checkSecurity, patientIdentification:{ responsible } } = await getOperatingRoom(scheduleId);
  const checkList:InternalComponent[] = [ checklistInOperatingRoom(checkSecurity, responsible) ];
  return(
    <div className="py-4">
      {checkList.map((item, i)=> <CheckSecurity {...{scheduleId}} {...item} key={i} />)}
    </div>
  )
}