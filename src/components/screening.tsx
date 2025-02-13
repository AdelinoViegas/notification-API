import { getScreening } from "@/app/backend/api/clinical/api";
import { ReasonForm } from "@/components/forms/screening-forms";
type Components = "reason" | "vitalSignal" | "priority" | "advice" | "all";

export default async function Screening({ 
  patientId,
  renderComponent 
}:{ 
  patientId: string;
  renderComponent: Components;
}){

  const patientData = await getScreening(patientId);
  if(patientData?.message)
    return <>Oops, algo ocorreu mal {patientData?.message}!!</>;

  switch(renderComponent){
    case "reason": 
      return <ReasonForm screeningId={patientData?._id as string}/>;
  }
}