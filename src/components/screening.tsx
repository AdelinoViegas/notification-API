import { getScreening } from "@/app/backend/api/clinical/api";
import ScreeningUI, { UIComponent } from "@/components/forms/screening-ui";

export default async function Screening({ 
  patientId,
  renderComponent 
}:{ 
  patientId: string;
  renderComponent: UIComponent;
}){

  const patientData = await getScreening(patientId);
  if(patientData?.message)
    return <>Oops, algo de errado não está certo, possivelmente {patientData?.message}!!</>;
  return (
    <ScreeningUI
      ui={renderComponent} 
      patientId={patientId}
    />
  )
}