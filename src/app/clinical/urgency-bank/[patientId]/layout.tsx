import { redirect } from "next/navigation";
import clsx from "clsx";
import TabNav from "@/components/tabnav";
import Card from "@/components/ui/card";
import { MonitorAccess, UnlockProcessAccess } from "@/components/lock-unlock-monitor-process";
import { getPatient } from "@/backend/api/clinical/urgency-bank-api";
import QuickFabShurtcut from "@/components/quick-fab-shurtcut";
import DefineState from "@/components/define-state";
import Hospitalization from "@/components/hospitalization";

export default async function Layout({ 
  children,
  params
}:{ 
  children: React.ReactNode;
  params: Promise<{ patientId: string }>
}){
  const { patientId } = await params;
  const patient = await getPatient({patientId}); 
  
  if(patient?.message || !patient.screening){
    redirect("/clinical/urgency-bank");
  }
    
  return(
    <div>
      <div className="flex gap-x-3">
         <MonitorAccess
          patientId={patientId}
          place="urgency"
          basePathname="/clinical/urgency-bank" 
        />

        <UnlockProcessAccess
          patientId={patientId}
          place="urgency"
          basePathname="/clinical/urgency-bank" 
        />

        <Hospitalization />
        { /* Transferencia */}
        <DefineState />
      </div>
      
      <div className={clsx("my-4 text-center text-white",
        {"bg-red-500 animate-pulse": patient.screening.priority === "red"},
        {"bg-blue-500": patient.screening.priority === "blue"},
        {"bg-green-500": patient.screening?.priority === "green"},
        {"bg-yellow-500": patient.screening?.priority === "yellow"},
        {"bg-orange-600": patient.screening?.priority === "orange"}
       )}>

        <h2 className="text-xl font-medium">{patient.fullname?.toUpperCase()}</h2>
			</div>
      
      <div className="flex h-[70vh] gap-x-3">
        <Card className="h-full w-full overflow-y-auto">{children}</Card>
       
        <TabNav
          idAsIndexPage
          isAside
          keyParam="patientId"
          baseUrl="/clinical/urgency-bank"
          subPaths={[
            { path: "", title: "Ficha de Cadastro" },
            { path: "screening", title: "Ficha de Triagem" },
            { path: "anamnesis", title: "Anamneses" },
            { path: "exam", title: "Exames" },
            { path: "clinical-diary", title: "Diário Clínico" },
            { path: "consultation", title: "Consultas" },
            { path: "prescription", title: "Receituário" },
            { path: "surgery", title: "Cirurgia"},
            { path: "discharge", title: "Título de Alta" }
          ]}
        />
      </div>

      <QuickFabShurtcut 
        visibleComponent={[
          // "request_consult",
          // "request_surgery",
          "request_hospital",
          // "internal_movement",
          // "define_state"
        ]}
      />
    </div>
  )
}