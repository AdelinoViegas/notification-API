//import Header from "@/components/header";
//import clsx from "clsx";
import TabNav from "@/components/tabnav";
import Card from "@/components/ui/card";
//import { getPatient } from "@/backend/api/clinical/operating-room-api";
import { MonitorAccess, UnlockProcessAccess } from "@/components/lock-unlock-monitor-process";
//import { redirect } from "next/navigation";

export default async function Layout({ 
  children,
  params
}:{ 
  children: React.ReactNode;
  params: Promise<{ patientId: string }>
}){
  const { patientId } = await params;
  /*const patient = await getPatient({patientId}); 
  
  if(patient?.message || !patient.screening){
    redirect("/clinical/operating-room");
  }*/
    
  return(
    <div>
      <MonitorAccess
        patientId={patientId}
        place="urgency"
        basePathname="/clinicaloperating-room" 
      />

      <UnlockProcessAccess
        patientId={patientId}
        place="urgency"
        basePathname="/clinical/operating-room" 
      />

      {/*<div className={clsx("my-4 text-center pt-3 text-white rounded-lg",
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
			</div>*/}
      
      <div className="flex h-[70vh] gap-x-3">
        <Card className="h-full w-full overflow-y-scroll">{children}</Card>
       
        <TabNav
          idAsIndexPage
          isAside
          keyParam="patientId"
          baseUrl="/clinical/operating-room"
          subPaths={[
            { path: "patient-identification", title: "Identificação do Paciente" },
            { path: "preoperative-evaluation", title: "Avaliação Pré-Operatória" },
            { path: "surgery-planning", title: "Planeamento da Cirurgia" },
            { path: "check-security", title: "Checklist de Segurança Cirúrgica" },
            { path: "intraoperative-procedure", title: "Procedimento Intraoperatório" },
            { path: "postAnesthetic-recovery", title: "Recuperação Pós-Anestésica (RPA)" },
          ]}
        />
      </div>
    </div>
  )
}