import { getConsultationHistory } from "@/backend/api/clinical/office-api"
import SubTitle from "@/components/ui/subtitle";
import InputField from "@/components/ui/input-field";
import Accordium from "@/components/ui/accordium";
import ViewUserFile from "@/components/view-user-file-client";

type ConsultHistory = Awaited<ReturnType<typeof getConsultationHistory>>[number];

export default async function Page({ params }: { params: Promise<{ patientId: string }>}){
  const { patientId } = await params;
  const history = await getConsultationHistory(patientId);
  
  return(
    <div>
      <h2 className="text-lg font-bold">Todas as consultas realizadas</h2>

      <div className="space-y-3 mt-3">
        {history.map((params, index) => (
          <Accordium key={index} title={params.makedt.toLocaleString("pt", { dateStyle: "full", timeStyle: "medium" })}>
            <ViewConsultResult consult={params} />
          </Accordium>
      ))}
      </div>
    </div>
  )
}

function ViewConsultResult({ consult }: { consult: ConsultHistory }){ 

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-x-4">
        <SubTitle className="inline-flex">Sinais Vitais</SubTitle>
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3">
        <div className="my-8">
          <SubTitle className="inline-flex">Queixas</SubTitle>
          <p className="mx-3">{consult?.currentStates?.complaints}</p>
        </div>

        <div className="my-8">
          <SubTitle className="inline-flex">Exame Físico</SubTitle>
          <p className="mt-1 mx-3">{consult?.currentStates?.phisicalExam}</p>
        </div>

        <div className="my-8">
          <SubTitle className="inline-flex">Observações</SubTitle>
          <p className="mx-3">{consult?.currentStates?.detail}</p>
        </div>
      </div>

    { consult?.storageId && 
      <div className="mt-8">
        <SubTitle className="inline-flex">Resultado externo</SubTitle>
        <ViewUserFile id={consult.storageId} />
      </div>
      }
    </div>
  );
}