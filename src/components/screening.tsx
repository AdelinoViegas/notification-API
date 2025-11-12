import { redirect } from "next/navigation";
import ScreeningUI, { UIComponent } from "@/components/forms/screening-ui";
import { getScreening } from "@/backend/api/clinical/api";

export default async function Screening({ 
  patientId,
  renderComponent,
  scrId 
}:{ 
  patientId: string;
  renderComponent: UIComponent;
  scrId?: string;
}){
  const patientData = await (
    scrId
    ? getScreening({ scrId, patientId })
    : getScreening({ patientId, isServed: false })
  );

  if(patientData?.message){
    redirect("/clinical/screening");
  }

  return (
    <ScreeningUI
      ui={renderComponent} 
      patientId={patientId}
      priority={patientData.priority}
      scrId={scrId}
    />
  )
}