import Header from "@/components/header";
import Card from "@/components/ui/card";
import TitleAndSubtitle from "@/components/title-subtitle";
import { CurrentDataInOffice, UploadExternalExam, VitalSignalsInOffice } from "@/components/forms/office-form";
import { getConsultResult, getPatient } from "@/backend/api/clinical/office-api";
import Accordium from "@/components/ui/accordium";
import { civilState, gender } from "@/backend/api/clinical/translator";
import FinishConsultation from "@/components/finish-consulation";
import RequestReschedule from "@/components/request-reschedule";
import { getScheduleAppointment } from "@/backend/api/clinical/scheduling-api";
import RequestExams from "@/components/forms/request-exam";
import ScheduleSugery from "@/components/forms/schedule-surgery";
import ViewUserFile from "@/components/view-user-file-client";

export default async function Page({ params }: { params: Promise<{ id: string }>}){
  const { id } = await params; 
  const patient = await getPatient(id);
  const consultResult = await getConsultResult(id);
  const { detail } = await getScheduleAppointment(patient?.scheduleAppointmentId as string);
  // const results = await getPatientScheduledServices({ patientId: patient.personal._id });

  return(
    <main className="space-y-3">
      <div className="my-4 text-center py-3 text-white text-lg font-bold uppercase bg-blue-400 rounded-lg">
          {patient?.personal.fullname as string}
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
            <VitalSignalsInOffice 
              id={id}
              vitalSignal={consultResult?.vitalSignal}
            />
          </Accordium>

          <Accordium title="Dados Actuais">
            <CurrentDataInOffice 
              id={id}
              currentState={consultResult?.currentStates}
            />
          </Accordium>

          <Accordium title="Exames">
            <div className="grid lg:grid-cols-2 lg:space-x-8">
              <RequestExams patientId={patient?.personal._id as string} />
              
              <div>
                <UploadExternalExam 
                  officeId={id}
                  patientId={patient?.personal._id as string}
                  storageId={consultResult?.storageId}
                  labelDescription="Anexar resultado de exame externo"
                />

                {consultResult?.storageId && <ViewUserFile id={consultResult.storageId} />}
              </div>
            </div>
          </Accordium> 
          
          <Accordium title="Cirurgias">
            <ScheduleSugery patientId={patient?.personal._id as string}/>
          </Accordium>     

          <div className="flex gap-3">
            <FinishConsultation id={id} />
            <RequestReschedule />
          </div>
        </Card>
      </div>
    </main>
  );
}
