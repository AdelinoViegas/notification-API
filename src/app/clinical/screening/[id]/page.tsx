import { FaFilePdf } from "react-icons/fa6";
import TabNav from "@/components/tabnav";
import PatientForm from "@/components/forms/patient-form";
import Card from "@/components/ui/card";
import Header from "@/components/header";
import ArchiveButton from "@/components/archive-button";
import Screening from "@/components/screening";
import { UIComponent } from "@/components/forms/screening-ui";
import { UnlockProcessAccess, MonitorAccess } from "@/components/lock-unlock-monitor-process";
import ScheduleInScreening from "@/components/scheduleInScreening";
import PDFButton, { ScreeningRecord } from "@/components/pdf-button";
import Button from "@/components/ui/button";
import { getPatient, getScreening } from "@/backend/api/clinical/api";

type Routes = "patient" | "reason" | "vital-signals" | "priority" | "state" | "advice";

export default async function Page({
  params,
  searchParams
}:{
  params: Promise<{ id: string }>;
  searchParams: Promise<{ r: Routes }>;
}){
  const [{ id }, { r }] = await Promise.all([ params, searchParams ]);
  const { personal: { fullname } } = await getPatient(id);

  const patientData = await (getScreening({ patientId: id, isServed: false })
  );
  
  const dataToPDF:ScreeningRecord = {
    reason: patientData.reason as string,
    vitalSignals: {
      paMax: String(patientData.vitalSignals?.paMax),
      paMin: String(patientData.vitalSignals?.paMin),
      jump: String(patientData.vitalSignals?.jump),
      pvc: String(patientData.vitalSignals?.pvc),
      imc: String(patientData.vitalSignals?.imc),
      sp02: String(patientData.vitalSignals?.sp02),
      temperature: String(patientData.vitalSignals?.temperature),
      breathing: String(patientData.vitalSignals?.breathing),
      weight: String(patientData.vitalSignals?.weight),
      height: String(patientData.vitalSignals?.height),
      bloodGlucose: String(patientData.vitalSignals?.bloodGlucose),
    },
    advice: patientData.advice as string,
    priority: patientData.priority as string,
    status: patientData.state as string,
  }

  const data = (patientData.reason && 
    patientData.vitalSignals && 
    patientData.priority && 
    patientData.state 
  )?dataToPDF:undefined;  

  return(
    <main>
      <MonitorAccess
        patientId={id}
        place="screening"
        basePathname="/clinical/screening" 
      />

      <div className="mt-4 mb-6">   
        <div className="flex gap-x-2 justify-end">
          <ScheduleInScreening 
            patientId={id} 
            type="appointment" 
            label="Agendar Consulta"
          />  

          <ScheduleInScreening 
            patientId={id} 
            type="exam" 
            label="Agendar Exame"
          />             
        </div> 

        <Header 
          center 
          title={fullname}
        />
      </div>
      
      <Card className="max-h-[80vh]">
        <TabNav
          baseUrl="/clinical/screening"
          idAsIndexPage
          keyParam="" 
          useReactHook
          subPaths={[
            { path: "patient", title: "Ficha de Cadastro" },
            { path: "reason", title: "Motivo da vinda" },
            { path: "vital-signals", title: "Sinais Vitais" },
            { path: "priority", title: "Grau de Prioridade" },
            { path: "state", title: "Estado Actual" },
            { path: "advice", title: "Recomendações" }
          ]}
        />

        <div className="flex gap-x-3">
          <UnlockProcessAccess
            patientId={id}
            place="screening"
            basePathname="/clinical/screening"
          />
          
          <ArchiveButton />
          
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
        </div>

        <div className="max-h-[60vh] overflow-auto px-2 py-3">
          { r === "patient"?                
              <PatientForm patientId={id} /> 
             : 
              [ 
                "reason",
                "vital-signals",
                "priority",
                "state",
                "advice"
              ].includes(r) && 
              <Screening 
                patientId={id}
                renderComponent={r as UIComponent} 
              /> 
          }
        </div>
      </Card>
    </main>
  );
}