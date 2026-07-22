import TabNav from "@/components/tabnav";
import Screening from "@/components/screening";
import { UIComponent } from "@/components/forms/screening-ui";
import { getPatient } from "@/backend/api/clinical/urgency-bank-api";
import PDFButton, { ScreeningRecord } from "@/components/pdf-button";
import Button from "@/components/ui/button";
import { FaFilePdf } from "react-icons/fa6";

type Routes = "reason" | "vital-signals" | "priority" | "state" | "advice";

export default async function Page({
  params,
  searchParams
}:{
  params: Promise<{ patientId: string }>;
  searchParams: Promise<{ r: Routes }>;
}){
  const [{ patientId }, { r }] = await Promise.all([ params, searchParams ]);
  const patient = await getPatient({ patientId });

  if(!patient?.screening)
    throw new Error("Não tem ficha de triagem");
  
    const dataToPDF:ScreeningRecord = {
      reason: patient.screening.reason as string,
      vitalSignals: {
        paMax: String(patient.screening.vitalSignals?.paMax),
        paMin: String(patient.screening.vitalSignals?.paMin),
        jump: String(patient.screening.vitalSignals?.jump),
        pvc: String(patient.screening.vitalSignals?.pvc),
        imc: String(patient.screening.vitalSignals?.imc),
        sp02: String(patient.screening.vitalSignals?.sp02),
        temperature: String(patient.screening.vitalSignals?.temperature),
        breathing: String(patient.screening.vitalSignals?.breathing),
        weight: String(patient.screening.vitalSignals?.weight),
        height: String(patient.screening.vitalSignals?.height),
        bloodGlucose: String(patient.screening.vitalSignals?.bloodGlucose),
      },
      advice: patient.screening.advice as string,
      priority: patient.screening.priority as string,
      status: patient.screening.state as string,
    }
  
    const data = (patient.screening.reason && 
      patient.screening.vitalSignals && 
      patient.screening.priority && 
      patient.screening.state 
    )?dataToPDF:undefined;  

  return(
    <main>
      <div className="max-h-[80vh]">
        <TabNav
          baseUrl="/clinical/screening"
          idAsIndexPage
          keyParam="" 
          useReactHook
          subPaths={[
            { path: "reason", title: "Movito da vinda" },
            { path: "vital-signals", title: "Sinais Vitais" },
            { path: "priority", title: "Grau de Prioridade" },
            { path: "state", title: "Estado Actual" },
            { path: "advice", title: "Recomendações" }
          ]}
        />

        <div>
          {
            data?
            <PDFButton
              label="Ficha-Triagem"
              type="screeningRecord"
              args={data}
            />
            :        
            <Button disabled type="button" className="flex gap-x-2">
              <FaFilePdf className="size-5"/>
              Ficha-Triagem
            </Button>
          }
        </div>

        <div className="max-h-[60vh] overflow-auto px-2">
          { 
            [ 
              "reason",
              "vital-signals",
              "priority",
              "state",
              "advice"
            ].includes(r) && 
            <Screening 
              patientId={patientId}
              renderComponent={r as UIComponent} 
              scrId={patient.screening._id}
            /> 
          }
        </div>
      </div>
    </main>
  );
}