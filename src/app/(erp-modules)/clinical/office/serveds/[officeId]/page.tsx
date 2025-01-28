import Header from "@/components/header";
import Card from "@/components/ui/card";
import SubTitle from "@/components/ui/subtitle";
import TitleAndSubtitle from "@/components/title-subtitle";
import InputField from "@/components/ui/input-field";
import { getConsult, getPatient } from "@/app/backend/api/clinical/office-api";
import Accordium from "@/components/ui/accordium";
import { civilState, gender } from "@/app/backend/api/clinical/translator";

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
  
  return(
    <main className="space-y-3">
      <div className="mt-6">
        <Header title="Informações da Consulta" />
      </div>

      <div className="overflow-auto h-[80vh] scroll overflow-auto">
        <Card>
          <Accordium title="Informações Pessoais">
            <div className="flex justify-between">
              <TitleAndSubtitle
                label="Nome do Utente"
                value={patient?.personal.fullname}
              />

              <TitleAndSubtitle
                label="Idade"
                value={patient?.personal.age}
              />

              <TitleAndSubtitle
                label="Estado Civil"
                value={civilState.find(props => props._id === patient?.personal.civilState)?.label}
              />

              <TitleAndSubtitle
                label="Sexo"
                value={gender.find(props => props._id === patient?.personal.gender)?.label}
              />

              <TitleAndSubtitle
                label="Morada Actual"
                value={patient?.actualLocation}
              />
            </div>
          </Accordium>
      
          <div>
            <div className="border my-3 px-3 py-2 rounded-md">
              <SubTitle className="inline-flex">Sinais Vitais</SubTitle>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <InputField
                  type="number"
                  textLabel="P.A MÁXIMA (mmHG)"
                  name="pamax" 
                  defaultValue={consult?.vitalSignal?.paMax}
                  disabled
                />

                <InputField
                  type="number"
                  textLabel="P.A MÍNIMA (mmHG)"
                  name="pamin" 
                  defaultValue={consult?.vitalSignal?.paMin}
                  disabled
                />
                
                <InputField
                  type="number"
                  textLabel="PULSO (BPM)"
                  name="jump" 
                  defaultValue={consult?.vitalSignal?.jump}
                  disabled
                />

                <InputField
                  type="number"
                  step={0.01}
                  textLabel="TEMPERATURA (°)"
                  name="temperature"
                  required 
                  defaultValue={consult?.vitalSignal?.temperature}
                  disabled
                />

                <InputField
                  type="number"
                  textLabel="RESPIRAÇÂO (IRPM)"
                  name="breathing" 
                  required
                  defaultValue={consult?.vitalSignal?.breathing}
                  disabled
                />

                <InputField
                  type="number"
                  textLabel="PESO (kg)"
                  name="weight" 
                  defaultValue={consult?.vitalSignal?.weight}
                  disabled
                />

                <InputField
                  type="number"
                  textLabel="ALTURA ((m)"
                  name="height"
                  defaultValue={consult?.vitalSignal?.height}
                  disabled
                />

                <InputField
                  type="number"
                  textLabel="SpO2 ((%) opcional)"
                  name="sp02"
                  defaultValue={consult?.vitalSignal?.sp02}
                  disabled
                />

                <InputField
                  type="number"
                  textLabel="PVC ((CH20) opcional)"
                  name="pvc"
                  defaultValue={consult?.vitalSignal?.pvc}
                  disabled
                />

                <InputField
                  type="number"
                  step={0.01}
                  textLabel="GLICEMIA ( (mg/dl) opcional)"
                  name="bloodGlucose"
                  defaultValue={consult?.vitalSignal?.bloodGlucose}
                  disabled
                />
              </div>
            </div>

            <div className="grid gap-3 lg:grid-cols-3 my-3">
              <TitleAndSubtitle
                label="Queixas"
                value={consult.currentStates?.complaints}
              />

              <TitleAndSubtitle
                label="Exame Físico"
                value={consult.currentStates?.phisicalExam}
              />

              <TitleAndSubtitle
                label="Observações"
                value={consult.currentStates?.detail}
              />
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
