import SubTitle from "@/components/ui/subtitle";
import Accordium from "@/components/ui/accordium";
import { getSurgeriesHistory } from "@/backend/api/clinical/operating-room-api";

type SurgeryHistory = Awaited<ReturnType<typeof getSurgeriesHistory>>[number];

export default async function Page({
  params
}: { 
  params: Promise<{ patientId: string }>
}){
  const { patientId } = await params;
  const history = await getSurgeriesHistory(patientId);
  
  return(
    <div>
      <h2 className="text-lg font-bold">Histórico de Cirurgias Feitas</h2>

      <div className="space-y-3 mt-3">
        {history.map((params, index) => (
          <Accordium key={index} title={params.makedt.toLocaleString("pt", { dateStyle: "full", timeStyle: "medium" })}>
            <ViewSurgery surgery={params} />
          </Accordium>
      ))}
      </div>
    </div>
  )
}

function ViewSurgery({ surgery }: { surgery: SurgeryHistory }){ 
  return (
    <div className="flex gap-x-4"> 
        <div className="my-4">
          <SubTitle className="inline-flex">Tipo de Cirugia Feita</SubTitle>
          <p className="mt-1 mx-3">{surgery.sugeryType}</p>
        </div>

        <div className="my-4">
          <SubTitle className="inline-flex">Médico responsável pela Cirugia</SubTitle>
          <p className="mt-1 mx-3">{surgery.responsible}</p>
        </div>
    </div>
  );
}