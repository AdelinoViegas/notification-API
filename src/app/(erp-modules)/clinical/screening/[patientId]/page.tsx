import TabNav from "@/components/tabnav";
import PatientForm from "@/components/forms/patient-form";
import Card from "@/components/ui/card";
import Header from "@/components/header";
import { getPatient } from "@/app/backend/api/clinical/api";
import CloseProcess from "@/components/close-process";
import ArchiveButton from "@/components/archive-button";
import Screening from "@/components/screening";
type Routes = "patient" | "reason" | "vital-signals" | "priority" | "status" | "advice";

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
            { path: "status", title: "Estado Actual" },
            { path: "advice", title: "Recomendações" }
          ]}
        />

        <div className="flex gap-x-3 px-2">
          <CloseProcess
            {...{patientId}}
            location="screening"
            path="/clinical/screening"
          />
          
          <ArchiveButton />
        </div>

        <div className="max-h-[60vh] overflow-auto px-2">
          { r === "patient" && <PatientForm patientId={patientId} /> }
          { r === "reason" && 
            <Screening 
              patientId={patientId}
              renderComponent={r} 
            />
          }
        </div>
      </Card>
    </main>
  );
}