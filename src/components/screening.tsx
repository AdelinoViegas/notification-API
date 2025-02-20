import { getScreening } from "@/app/backend/api/clinical/api";
import ScreeningUI, { UIComponent } from "@/components/forms/screening-ui";

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

  if(patientData?.message)
    return <>Oops, algo de errado não está certo, possivelmente {patientData?.message}!!</>;
  
  return (
    <ScreeningUI
      ui={renderComponent} 
      patientId={patientId}
    />
  )
}