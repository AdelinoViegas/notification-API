//import { getConsultationHistory } from "@/backend/api/clinical/office-api"
/*import SubTitle from "@/components/ui/subtitle";
import InputField from "@/components/ui/input-field";
import Accordium from "@/components/ui/accordium";
import ViewUserFile from "@/components/view-user-file-client";*/
//import { getSurgeriesHistory } from "@/backend/api/clinical/operating-room-api";

//type SurgeryHistory = Awaited<ReturnType<typeof getConsultationHistory>>[number];

export default async function Page(/*{ }: { params: Promise<{ patientId: string }>}*/){
  //const { patientId } = await params;
  //const history = await getSurgeriesHistory(patientId);
  
  return(
    <div>
      <h2 className="text-lg font-bold">Histórico de Cirurgias Feitas</h2>

      <div className="space-y-3 mt-3">
        {/*history.map((params, index) => (
          <Accordium key={index} title={params.makedt.toLocaleString("pt", { dateStyle: "full", timeStyle: "medium" })}>
            <ViewSurgery surgery={params} />
          </Accordium>
      ))*/}
      </div>
    </div>
  )
}

/*function ViewSurgery({ surgery }: { surgery: SurgeryHistory }){ 

  return (
    <div> teste
    
    </div>
  );
}*/