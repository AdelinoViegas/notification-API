import TitleAndSubtitle from "@/components/title-subtitle";
import { getPatient } from "@/backend/api/clinical/operating-room-api";
import { gender } from "@/backend/api/clinical/translator";
import InputDetails from "@/components/ui/input-details";
import Accordium from "@/components/ui/accordium";
import InputField from "@/components/ui/input-field";
import Button from "@/components/ui/button";
import { PiArchiveDuotone } from "react-icons/pi";
import RescheduleSugery from "@/components/reschedule-sugery";
import { getScheduleSugery } from "@/backend/api/clinical/scheduling-api";

export default async function Page({ params }:{
	params: Promise<{
		id: string;
	}>
}){
	const { id } = await params;
  const { scheduleId, ...patient} = await getPatient({id});
  const schedule = await getScheduleSugery(scheduleId as string)

	return (
    <div className="flex flex-col gap-y-4 py-2"> 
      <div className="flex gap-x-4 mb-2">
        <RescheduleSugery
          scheduleId={scheduleId as string}
          doctorId={schedule.doctorId}
          date={schedule.date.en}
          hour={schedule.hour}
        />
        
        <Button className="flex gap-x-2 bg-slate-700">
          <PiArchiveDuotone/>
          Pacientes Atendidos
        </Button>
      </div> 
                
      <Accordium title="Informações do Utente">
        <div className="flex flex-row gap-x-12">
          <TitleAndSubtitle
            className={{content: "ml-0 mt-1"}}
            label="Nª de processo"
            value={patient?.registerNumber}
          />
          <TitleAndSubtitle
            className={{content: "ml-0 mt-1"}}
            label="Nome do Utente"
            value={patient?.fullname}
          />

          <TitleAndSubtitle
            className={{content: "ml-0 mt-1"}}
            label="Idade"
            value={patient?.age}
          />

          <TitleAndSubtitle
            className={{content: "ml-0 mt-1"}}
            label="Sexo"
            value={gender.find(props => props._id === patient?.gender)?.label}
          />
        </div>
      </Accordium>

      <Accordium title="Diganóstico pré-Operatório">
        <form>
          <InputDetails
            textLabel="Descreva"
            rows={3}
            placeholder="Descreva o diagnóstico pré-operatório"  
          />

          <Button>Salvar</Button>
        </form>
      </Accordium>

      <Accordium title="Consentimento informado">
        <form>
          <InputDetails
            textLabel="Descreva"
            rows={3}
            placeholder="Descreva o consentimento informado"  
          />

          <InputField
            className="w-96"
            textLabel="Nome do responsável"
            name="responsible"
            placeholder="Digite o responsável do paciente"
          />

          <Button>Salvar</Button>
        </form>
      </Accordium>
    </div>
	) 
}