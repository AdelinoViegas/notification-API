import Header from "@/components/header";
import { getPatient } from "@/app/backend/api/clinical/api";
import { openPatientProcess } from "@/app/backend/api/clinical/process-api";
import ProcessAlert from "@/components/process-alert";
import CloseProcess from "@/components/close-process";
import ArchiveButton from "@/components/archive-button";
import TabNav from "@/components/tabnav";

export default async function Layout({ 
  children,
  params
}:{ 
  children: React.ReactNode;
  params: Promise<{
    patientId: string;
  }>
}){
  const { patientId } = await params;
  const patient = await getPatient(patientId); 
  const processState = await openPatientProcess(patientId, "screening");

  return(
    <div>
      <div className="mt-4 mb-6">
				<Header 
          center 
          title={patient?.personal.fullname as string}
        />
			</div>

      <div className="flex gap-3">
        <CloseProcess
          {...{patientId}}
          location="screening"
          path="/clinical/screening"
        />
        
        <ArchiveButton />
      </div>
      
      <div>
        <TabNav
          idAsIndexPage
          keyParam="patientId"
          baseUrl="/clinical/screening"
          subPaths={[
            { path: "", title: "Ficha de Cadastro" },
            { path: "reason", title: "Movito da vinda" },
            { path: "vital-signals", title: "Sinais Vitais" },
            { path: "priority", title: "Grau de Prioridade" },
            { path: "status", title: "Estado Actual" },
            { path: "advice", title: "Recomendações" }
          ]}
        />

        <div className="bg-white px-3 lg:px-16 py-5 rounded-b-xl border border-t-0 max-h-sizeTab overflow-auto scroll">
          {children}
        </div>
      </div>
      {
        (processState && !processState?.status) &&
        <ProcessAlert path="/clinical/screening" />
      }
    </div>
  )
}