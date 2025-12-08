import { getBeds, getTransation, resolvedBed } from "@/backend/api/clinical/hospitalization-api";
import Accommodate from "@/components/hospitalization/accommodate";
import BedUpdate from "@/components/hospitalization/bed-update";

export default async function Page({ params }:{ params: Promise<{ id: string }> }){
  const { id } = await params;
  const bed = await resolvedBed(id);
  // const transation = await getTransation(patientId);
  console.log(bed);
  
  return(
    <div>
      <div className="w-1/2 space-y-3">
        <BedUpdate />
      </div>
    </div>
  )
}