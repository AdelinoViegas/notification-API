import Header from "@/components/header";
import Card from "@/components/card";
import TitleAndSubtitle from "@/components/title-subtitle";
import { CurrentDataInOffice, FileUpload, VitalSignalsInOffice } from "@/components/forms/office-form";
import { getConsult, getPatient, readExternalExamFile } from "@/app/backend/api/clinical/office-api";
import Accordium from "@/components/accordium";
import { civilState, gender } from "@/app/backend/api/clinical/translator";
import FinishConsultation from "@/components/finish-consulation";
import RequestReschedule from "@/components/request-reschedule";
import { getScheduleAppointment } from "@/app/backend/api/clinical/scheduling-api";
import RequestExams from "@/components/forms/request-exam";

export default async function Page({
  params
}: {
  params: Promise<{
    officeId: string;
  }>
}){
  const { officeId } = await params; 
  const patient = await getPatient(officeId);
  const consult = await getConsult(officeId);
  const { detail } = await getScheduleAppointment(patient.scheduleAppointmentId);
  const externalFile = await readExternalExamFile({ officeId, patientId: patient.personal._id });
  
  return(
    <main className="space-y-3">
      <div className="mt-6">
        <Header title="Consultar" />
      </div>

      <div className="overflow-auto h-[80vh] scroll overflow-auto">
        <Card className="flex flex-col gap-y-4 py-8">
          <Accordium title="Informações Pessoais">
            <div className="grid md:grid-cols-2 lg:grid-none lg:flex lg:justify-between">
              <TitleAndSubtitle
                label="Nome do Utente"
                value={patient?.personal.fullname}
                className={{ content: "text-left" }}
              />

              <TitleAndSubtitle
                label="Idade"
                value={patient?.personal.age}
                className={{ content: "text-left" }}
              />

              <TitleAndSubtitle
                label="Estado Civil"
                value={civilState.find(props => props._id === patient?.personal.civilState)?.label}
                className={{ content: "text-left" }}
              />

              <TitleAndSubtitle
                label="Sexo"
                value={gender.find(props => props._id === patient?.personal.gender)?.label}
                className={{ content: "text-left" }}
              />

              <TitleAndSubtitle
                label="Morada Actual"
                value={patient?.actualLocation}
                className={{ content: "text-left" }}
              />
            </div>

            <TitleAndSubtitle
              label="Observação"
              value={detail}
              className={{ content: "text-left" }}
            />
          </Accordium>

          <Accordium title="Sinais Vitais">
            <VitalSignalsInOffice id={officeId} {...{consult}}/>
          </Accordium>

          <Accordium title="Dados Actuais">
            <CurrentDataInOffice id={officeId} {...{consult}}/>
          </Accordium>

          <Accordium title="Exames">
            <div className="grid lg:grid-cols-2 lg:space-x-8">
              <RequestExams patientId={patient.personal._id} />
              <FileUpload 
                {...{officeId}} 
                patientId={patient.personal._id}  
                {...{externalFile}}
              />
            </div>
          </Accordium>      

          <div className="flex gap-3">
            <FinishConsultation />
            <RequestReschedule />
          </div>
        </Card>
      </div>
    </main>
  );
}
