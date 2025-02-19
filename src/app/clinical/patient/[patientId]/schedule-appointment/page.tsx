import ScheduleAppointment from "@/components/forms/schedule-appointment";

export default async function Page({ params }: {
  params: Promise<{ patientId: string }>
}){
  const { patientId } = await params;
  return(
    <ScheduleAppointment {...{patientId}} />
  );
}