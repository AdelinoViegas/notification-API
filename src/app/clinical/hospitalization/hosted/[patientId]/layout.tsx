import TabNav from "@/components/tabnav";
import Card from "@/components/ui/card";
import { MonitorAccess, UnlockProcessAccess } from "@/components/lock-unlock-monitor-process";
import DefineState from "@/components/define-state";
import clsx from "clsx";
import { getPatient } from "@/backend/api/clinical/api";
import { redirect } from "next/navigation";
import { getPatientState } from "@/backend/api/clinical/urgency-bank-api";
import Header from "@/components/header";
import InternalMoviment from "@/components/hospitalization/internal-moviment";

export default async function Layout({ 
  children,
  params
}:{ 
  children: React.ReactNode;
  params: Promise<{ patientId: string }>
}){
  const { patientId: id } = await params;
  const patient = await getPatient(id); 
  const patientState = await getPatientState(id);
  const basePath = "/clinical/hospitalization?r=r&p=1"
  
  if(!patient || !patientState)
    redirect(basePath);
    
  return(
    <div>
      <div className="flex gap-x-2">
        <MonitorAccess
          patientId={id}
          place="hospitalization"
          basePathname={basePath}
        />

        <UnlockProcessAccess
          patientId={id}
          place="hospitalization"
          basePathname={basePath}
        />
        <DefineState />
        <InternalMoviment />
      </div>

      <div className={clsx("my-4 text-center pt-3 text-white bg-blue-400 rounded-lg",
          patientState.color.tw.bg,
          {"animate-pulse": ["critica", "serious"].includes(patientState._id)})}>
        <Header 
          center 
          title={patient?.personal.fullname.toUpperCase()}
        />
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
            { path: "anamnesis", title: "Anamneses" },
            { path: "exam", title: "Exames" },
            { path: "clinical-diary", title: "Diário Clínico" },
            { path: "consultation", title: "Consultas" },
            { path: "prescription", title: "Receituário" },
            { path: "surgery", title: "Cirurgia"},
            { path: "discharge", title: "Título de Alta" },
            // { path: "im", title: "Movimento Interno" }
          ]}
        />
      </div>
    </div>
  )
}