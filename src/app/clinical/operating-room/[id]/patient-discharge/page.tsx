import { getOperatingRoom, getPatient } from "@/backend/api/clinical/operating-room-api";
import PatientDischarge from "@/components/operating-room/patient-discharge";

export default async function Page({ params }:{
  params: Promise<{
    id: string;
  }>
}){
  const { id } = await params;
  const personal = await getPatient({id});
  const scheduleId = personal.scheduleId as string;
  const {
    requestingService, 
    patientDischarge,
    postAnestheticRecovery: { 
      levelofConsciousness:{ result } 
    } } = await getOperatingRoom(scheduleId);
  return (
    <PatientDischarge
      {...{requestingService}} 
      {...{result}}
      {...{scheduleId}} 
      {...{patientDischarge}} 
    />
  )
}