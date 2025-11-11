import { GrSchedulePlay } from "react-icons/gr";
import TitleAndSubtitle from "@/components/title-subtitle";
import Accordium from "@/components/ui/accordium";
import Button from "@/components/ui/button";
import PatientIdentification from "@/components/operating-room/patient-identification";
import { gender } from "@/backend/api/clinical/translator";
import { getOperatingRoom, getPatient } from "@/backend/api/clinical/operating-room-api";

export default async function Page({ params }:{
	params: Promise<{
		id: string;
	}>
}){
	const { id } = await params;
  const personal = await getPatient({id});
  const scheduleId = personal.scheduleId as string;
  const { patientIdentification } = await getOperatingRoom(scheduleId);

	return (
    <div className="flex flex-col gap-y-4 py-2"> 
      <div className="flex gap-x-4 mb-2">
        <Button
          className="flex gap-x-2"
          >
          <GrSchedulePlay className="size-5"/>
          Reagendar
        </Button>
        {/*<RescheduleSugery scheduleId={scheduleId}/>*/}
      </div> 
                
      <Accordium title="Informações do utente">
        <div className="flex flex-row gap-x-12">
          <TitleAndSubtitle
            className={{content: "ml-0 mt-1"}}
            label="Nª de processo"
            value={personal?.registerNumber}
          />
          <TitleAndSubtitle
            className={{content: "ml-0 mt-1"}}
            label="Nome do Utente"
            value={personal?.fullname}
          />

          <TitleAndSubtitle
            className={{content: "ml-0 mt-1"}}
            label="Idade"
            value={personal?.age}
          />

          <TitleAndSubtitle
            className={{content: "ml-0 mt-1"}}
            label="Sexo"
            value={gender.find(props => props._id === personal?.gender)?.label}
          />
        </div>
      </Accordium>
      
      <PatientIdentification 
        {...{patientIdentification}} 
        {...{scheduleId}}
      /> 
    </div>
	) 
}