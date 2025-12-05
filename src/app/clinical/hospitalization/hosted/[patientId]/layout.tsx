// import { redirect } from "next/navigation";
// import clsx from "clsx";
// import Header from "@/components/header";
import TabNav from "@/components/tabnav";
import Card from "@/components/ui/card";
import { MonitorAccess, UnlockProcessAccess } from "@/components/lock-unlock-monitor-process";
import QuickFabShurtcut from "@/components/quick-fab-shurtcut";
// import { getPatient } from "@/backend/api/clinical/urgency-bank-api";
// import { getPatient } from "@/backend/api/clinical/api";
// import RequestConsult from "@/components/request-consult";
// import Hospitalization from "@/components/hospitalization";
// import RequestSurgery from "@/components/request-surgery";
// import InternalMovement from "@/components/internal-movement";
import DefineState from "@/components/define-state";

export default async function Layout({ 
  children,
  params
}:{ 
  children: React.ReactNode;
  params: Promise<{ patientId: string }>
}){
  const { patientId } = await params;
  // const patient = await getPatient(patientId); 
  
  // if(patient?.message || !patient.screening){
  //   redirect("/clinical/urgency-bank");
  // }
    
  return(
    <div>
      <div className="flex gap-x-2">
        <MonitorAccess
          patientId={patientId}
          place="urgency"
          basePathname="/clinical/hospitalization/hosted" 
        />

        <UnlockProcessAccess
          patientId={patientId}
          place="urgency"
          basePathname="/clinical/hospitalization/hosted" 
        />

        {/* <div className={clsx("my-4 text-center pt-3 text-white rounded-lg",
          {"bg-red-500 animate-pulse": patient.screening.priority === "red"},
          {"bg-blue-500": patient.screening.priority === "blue"},
          {"bg-green-500": patient.screening?.priority === "green"},
          {"bg-yellow-500": patient.screening?.priority === "yellow"},
          {"bg-orange-600": patient.screening?.priority === "orange"}
        )}>
          <Header 
            center 
            title={patient.fullname}
          />
        </div>
        */}

        <DefineState />
      </div>
      <div className="flex h-[70vh] gap-x-3 mt-3">
        <Card className="h-full w-full overflow-y-auto">{children}</Card>
       
        <TabNav
          idAsIndexPage
          isAside
          keyParam="patientId"
          baseUrl="/clinical/hospitalization/hosted"
          subPaths={[
            { path: "", title: "Ficha de Cadastro" },
            // { path: "screening", title: "Ficha de Triagem" },
            { path: "anamnesis", title: "Anamneses" },
            { path: "exam", title: "Exames" },
            { path: "clinical-diary", title: "Diário Clínico" },
            { path: "consultation", title: "Consultas" },
            { path: "prescription", title: "Receituário" },
            { path: "surgery", title: "Cirurgia"},
            { path: "discharge", title: "Título de Alta" },
            { path: "im", title: "Movimento Interno" }
          ]}
        />
      </div>

      <QuickFabShurtcut 
        visibleComponent={[
          "request_consult",
          "request_surgery",
          "define_state"
        ]} 
      />
    </div>
  )
}