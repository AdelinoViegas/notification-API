import { getTransation } from "@/backend/api/clinical/hospitalization-api";
import Accommodate from "@/components/hospitalization/accommodate";
import Alert from "@/components/ui/alert";

export default async function Page({ params }:{ params: Promise<{ id: string }> }){
  const { id: patientId } = await params;
  const transation = await getTransation(patientId);

  return(
    <div>
      <div className="w-1/2 space-y-3">
        <Alert
          message={`O medico pediu para internar no serviço de ${transation?.destination.name}`} 
          type="warn"
        />

        <Accommodate
          serviceId={transation?.destination.id}
        />
      </div>
    </div>
  )
}