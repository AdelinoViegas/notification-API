import Header from "@/components/header";
import TabNav from "@/components/tabnav";
import Card from "@/components/ui/card";
import { getPatient } from "@/backend/api/clinical/operating-room-api";
import { MonitorAccess, UnlockProcessAccess } from "@/components/lock-unlock-monitor-process";
import { redirect } from "next/navigation";

export default async function Layout({ 
  children,
  params
}:{ 
  children: React.ReactNode;
  params: Promise<{ id: string }>
}){
  const { id } = await params;
  const data = await getPatient({id}); 

  if(data?.message || !data)
    redirect("/clinical/operating-room");
    
  return(
    <div>
      <MonitorAccess
        patientId={data._id as string}
        place="block"
        basePathname="/clinical/operating-room" 
      />

      <UnlockProcessAccess
        patientId={data._id as string}
        place="block"
        basePathname="/clinical/operating-room" 
      />

      <div className="my-4 text-center pt-3 text-white bg-blue-400 rounded-lg">
			 	<Header 
          center 
          title={data.fullname as string}
        />
			</div>
      
      <div className="flex h-[70vh] gap-x-3">
        <Card className="h-full w-full overflow-y-scroll">{children}</Card>
       
        <TabNav
          idAsIndexPage
          isAside
          keyParam="id"
          baseUrl="/clinical/operating-room"
          subPaths={[
            { path: "patient-identification", title: "Identificação do Paciente" },
            { path: "preoperative-evaluation", title: "Avaliação Pré-Operatória" },
            { path: "surgery-planning", title: "Planeamento da Cirurgia" },
            { path: "check-security", title: "Checklist de Segurança Cirúrgica" },
            { path: "intraoperative-procedure", title: "Procedimento Intraoperatório" },
            { path: "post-anesthetic-recovery", title: "Recuperação Pós-Anestésica (RPA)" },
            { path: "patient-discharge", title: "Alta do Bloco" },
          ]}
        />
      </div>
    </div>
  )
}