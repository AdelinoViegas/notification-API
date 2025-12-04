import { getTransation, resolvedBed } from "@/backend/api/clinical/hospitalization-api";
import Accommodate from "@/components/hospitalization/accommodate";

export default async function Page({ params }:{ params: Promise<{ id: string }> }){
  const { id: patientId } = await params;
  const transation = await getTransation(patientId);

  return(
    <div>
      <div className="w-1/2">
        <Accommodate
          serviceId={transation?.destination.id}
        />
      </div>
    </div>
  )
}