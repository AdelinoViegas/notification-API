import { getCurrentLocation } from "@/backend/api/clinical/hospitalization-api";
import InternalMoviment from "@/components/hospitalization/internal-moviment";

export default async function Page({ params }: { params: Promise<{ patientId: string }>}){
  const { patientId } = await params;
  const currentLocation = await getCurrentLocation(patientId); 

  return(
    <div>
      <div className="ring ring-gray-400 inline-flex flex-col rounded-lg">
        <h2 className="font-bold text-lg text-center">Localização Atual</h2>
        <h2 className="bg-gray-500 text-white inline-flex px-3 font-medium">{currentLocation}</h2>
      </div>
      <InternalMoviment />
    </div>
  )
}