import { getTransation, resolvedBed } from "@/backend/api/clinical/hospitalization-api";
import Accommodate from "@/components/hospitalization/accommodate";

export default async function Page({ params }:{ params: Promise<{ id: string }> }){
  const { id: patientId } = await params;
  const bedPosition = await resolvedBed(patientId);
  const transation = await getTransation(patientId);

  return(
    <div>
      <div className="w-1/2">
        <Accommodate
          serviceId={transation?.destination.id as string}
          sectionId={bedPosition?.section.id as string}
          nursingId={bedPosition?.nursing.id as string}
          bedId={bedPosition?.bed.id as string}
        />
      </div>
    </div>
  )
}