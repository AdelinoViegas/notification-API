import SugeryPlanning from "@/components/operating-room/surgery-planning";
import TitleAndSubtitle from "@/components/title-subtitle";
import Accordium from "@/components/ui/accordium";
import { getOperatingRoom, getPatient } from "@/backend/api/clinical/operating-room-api";
import { getScheduleSugery } from "@/backend/api/clinical/scheduling-api";
import { getDateInSlashFormat } from "@/lib/date-formater";

export default async function Page({ params }:{
	params: Promise<{
		id: string;
	}>
}){
	const { id } = await params;
  const personal = await getPatient({id});
  const patientId = personal._id as string;
  const schedule = await getScheduleSugery(personal.scheduleId as string);
  const { sugeryPlanning } = await getOperatingRoom(patientId);

  return(
    <div>
      <div className="pt-8 pb-3">
        <Accordium title="Dados predefinidos">
          <div className="flex gap-x-12">
            <TitleAndSubtitle
              className={{content: "ml-0 mt-1"}}
              label="Tipo de cirurgia"
              value={schedule.sugery.type}
            />
            
            <TitleAndSubtitle
              className={{content: "ml-0 mt-1"}}
              label="Responsável pela cirurgia"
              value={schedule.doctor}
            />

            <TitleAndSubtitle
              className={{content: "ml-0 mt-1"}}
              label="Data da cirurgia"
              value={getDateInSlashFormat(schedule.date)}
            />
          </div>
        </Accordium>
      </div>

      <SugeryPlanning
        {...{ patientId }}
        {...{ sugeryPlanning }}
      />
    </div>
  )
}