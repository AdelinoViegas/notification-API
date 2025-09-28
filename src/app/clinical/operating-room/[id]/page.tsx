import TitleAndSubtitle from "@/components/title-subtitle";
import { getOperatingRoom, getPatient } from "@/backend/api/clinical/operating-room-api";
import { gender } from "@/backend/api/clinical/translator";
import Accordium from "@/components/ui/accordium";
//import RescheduleSugery from "@/components/reschedule-sugery";
//import { getScheduleSugery } from "@/backend/api/clinical/scheduling-api";
import PatientIdentification from "@/components/operating-room/patient-identification";

export default async function Page({ params }:{
	params: Promise<{
		id: string;
	}>
}){
	const { id } = await params;
  const {...patient} = await getPatient({id});
  //const schedule = await getScheduleSugery(scheduleId as string)
  const scheduleId = patient.scheduleId as string;
  const { patientIdentification } = await getOperatingRoom(scheduleId);

	return (
    <div className="flex flex-col gap-y-4 py-2"> 
      <div className="flex gap-x-4 mb-2">
        {/*<RescheduleSugery
          scheduleId={scheduleId as string}
          doctorId={schedule.doctorId}
          date={schedule.date.en}
          hour={schedule.hour}
        />*/}
      </div> 
                
      <Accordium title="Informações do utente">
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
      
      <PatientIdentification 
        {...{patientIdentification}} 
        {...{scheduleId}}
      /> 
    </div>
	) 
}