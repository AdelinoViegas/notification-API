import ScheduleSugery from "@/components/forms/schedule-sugery";

export default async function Page({
  params,
}: {
  params: Promise<{ 
    patientId: string;
  }>
}){
  const { patientId } = await params;

  return <ScheduleSugery {...{patientId}} />
}