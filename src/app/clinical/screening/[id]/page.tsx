import TabNav from "@/components/tabnav";
import PatientForm from "@/components/forms/patient-form";
import Card from "@/components/ui/card";
import Header from "@/components/header";
import { getPatient } from "@/backend/api/clinical/api";
import ArchiveButton from "@/components/archive-button";
import Screening from "@/components/screening";
import { UIComponent } from "@/components/forms/screening-ui";
import { UnlockProcessAccess, MonitorAccess } from "@/components/lock-unlock-monitor-process";
import ScheduleInScreening from "@/components/scheduleInScreening";

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
            label="agendar consulta"
          />  

          <ScheduleInScreening 
            patientId={id} 
            type="exam" 
            label="agendar exame"
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