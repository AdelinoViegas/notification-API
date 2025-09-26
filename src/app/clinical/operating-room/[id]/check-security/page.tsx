import { CheckSecurity } from "@/components/operating-room/check-security";
import { InternalComponent } from "@/components/global-component";
import { checklistInOperatingRoom } from "@/lib/internal-components";
import { getOperatingRoom, getPatient } from "@/backend/api/clinical/operating-room-api";

export default async function Page({ params }:{
	params: Promise<{
		id: string;
	}>
}){
	const { id } = await params;
  const personal = await getPatient({id});
  const patientId = personal._id as string;
  const { checkSecurity } = await getOperatingRoom(patientId);
  const checkList:InternalComponent[] = [ checklistInOperatingRoom(checkSecurity) ];

  return(
    <div className="py-4">
      {checkList.map((item, i)=> <CheckSecurity itemId="25" {...item} key={i} />)}
    </div>
  )
}