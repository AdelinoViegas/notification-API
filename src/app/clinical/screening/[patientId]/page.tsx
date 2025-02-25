import TabNav from "@/components/tabnav";
import PatientForm from "@/components/forms/patient-form";
import Card from "@/components/ui/card";
import Header from "@/components/header";
import { getPatient } from "@/app/backend/api/clinical/api";
import ArchiveButton from "@/components/archive-button";
import Screening from "@/components/screening";
import { UIComponent } from "@/components/forms/screening-ui";
import { UnlockProcessAccess, MonitorAccess } from "@/components/lock-unlock-monitor-process";

type Routes = "patient" | "reason" | "vital-signals" | "priority" | "state" | "advice";

export default async function Page({
  params,
  searchParams
}:{
  params: Promise<{ patientId: string }>;
  searchParams: Promise<{ r: Routes }>;
}){
  const [{ patientId }, { r }] = await Promise.all([ params, searchParams ]);
  const { personal: { fullname } } = await getPatient(patientId);
  
  return(
    <main>
      <MonitorAccess
        patientId={patientId}
        place="screening"
        basePathname="/clinical/screening" 
      />

      <div className="mt-4 mb-6">
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
            { path: "reason", title: "Movito da vinda" },
            { path: "vital-signals", title: "Sinais Vitais" },
            { path: "priority", title: "Grau de Prioridade" },
            { path: "state", title: "Estado Actual" },
            { path: "advice", title: "Recomendações" }
          ]}
        />

        <div className="flex gap-x-3">
          <UnlockProcessAccess
            patientId={patientId}
            place="screening"
            basePathname="/clinical/screening"
          />
          
          <ArchiveButton />
        </div>

        <div className="max-h-[60vh] overflow-auto px-2 py-3">
          { r === "patient"?                
              <PatientForm 
                patientId={patientId} 
              /> 
             : 
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
              /> 
          }
        </div>
      </Card>
    </main>
  );
}