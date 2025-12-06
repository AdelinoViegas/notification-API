import Card from "@/components/ui/card";
import Tag from "@/components/ui/tag";
import TitleAndSubtitle from "@/components/title-subtitle";
import InputField from "@/components/ui/input-field";
import { getConsultResult, getPatient } from "@/backend/api/clinical/office-api";
import Accordium from "@/components/ui/accordium";
import { civilState, gender } from "@/backend/api/clinical/translator";
import ViewUserFile from "@/components/view-user-file-client";

export default async function Page({ params }: { params: Promise<{ id: string }>}){ 
  const { id } = await params;
  const patient = await getPatient(id);
  const consult = await getConsultResult(id);

  return(
    <main className="space-y-3">
      <div className="mt-6">
      </div>

      <div className="overflow-auto h-[80vh] scroll overflow-auto">
        <Card>
          <Accordium title="Informações Pessoais">
            <div className="flex justify-between">
              <TitleAndSubtitle
                className={{ content: "ml-0 mt-1"}}
                label="Nome do Utente"
                value={patient?.personal.fullname}
              />

              <TitleAndSubtitle
                className={{ content: "ml-0 mt-1"}}
                label="Idade"
                value={patient?.personal.age}
              />

              <TitleAndSubtitle
                className={{ content: "ml-0 mt-1"}}
                label="Estado Civil"
                value={civilState.find(props => props._id === patient?.personal.civilState)?.label}
              />

              <TitleAndSubtitle
                className={{ content: "ml-0 mt-1"}}
                label="Sexo"
                value={gender.find(props => props._id === patient?.personal.gender)?.label}
              />

              <TitleAndSubtitle
                className={{ content: "ml-0 mt-1"}}
                label="Morada Actual"
                value={patient?.actualLocation}
              />
            </div>
          </Accordium>

          <div className="mt-8">
            <Tag className="inline-flex">Sinais Vitais</Tag>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-x-4">
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3">
            <div className="my-8">
              <Tag className="inline-flex">Queixas</Tag>
              <p className="mx-3">{consult?.currentStates?.complaints}</p>
            </div>

            <div className="my-8">
              <Tag className="inline-flex">Exame Físico</Tag>
              <p className="mt-1 mx-3">{consult?.currentStates?.phisicalExam}</p>
            </div>

            <div className="my-8">
              <Tag className="inline-flex">Observações</Tag>
              <p className="mx-3">{consult?.currentStates?.detail}</p>
            </div>
          </div>

          { consult?.storageId && 
            <div className="mt-8">
              <Tag className="inline-flex">Resultado externo</Tag>
              <ViewUserFile id={consult.storageId} />
            </div>
           }
        </Card>
      </div>
    </main>
  );
}
