import { getScreening } from "@/backend/api/clinical/api";
import ScreeningUI, { UIComponent } from "@/components/forms/screening-ui";
import { redirect } from "next/navigation";
import { ScreeningRecord } from "./pdf-button";

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
  
  const dataToPDF:ScreeningRecord = {
    reason: patientData.reason as string,
    vitalSignals: {
      paMax: String(patientData.vitalSignals?.paMax),
      paMin: String(patientData.vitalSignals?.paMin),
      jump: String(patientData.vitalSignals?.jump),
      pvc: String(patientData.vitalSignals?.pvc),
      imc: String(patientData.vitalSignals?.imc),
      sp02: String(patientData.vitalSignals?.sp02),
      temperature: String(patientData.vitalSignals?.temperature),
      breathing: String(patientData.vitalSignals?.breathing),
      weight: String(patientData.vitalSignals?.weight),
      height: String(patientData.vitalSignals?.height),
      bloodGlucose: String(patientData.vitalSignals?.bloodGlucose),
    },
    advice: patientData.advice as string,
    priority: patientData.priority as string,
    status: patientData.state as string,
  }

  return (
    <ScreeningUI
      ui={renderComponent} 
      patientId={patientId}
      priority={patientData.priority}
      scrId={scrId}
      {...{dataToPDF}}
    />
  )
}