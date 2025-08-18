import TabNav from "@/components/tabnav";
import Screening from "@/components/screening";
import { UIComponent } from "@/components/forms/screening-ui";
import { getPatient } from "@/backend/api/clinical/urgency-bank-api";

type Routes = "reason" | "vital-signals" | "priority" | "state" | "advice";

export default async function Page({
  params,
  searchParams
}:{
  params: Promise<{ patientId: string }>;
  searchParams: Promise<{ r: Routes }>;
}){
  const [{ patientId }, { r }] = await Promise.all([ params, searchParams ]);
  const patient = await getPatient({ patientId });

  if(!patient?.screening)
    throw new Error("Não tem ficha de triagem");

  return(
    <main>
      <div className="max-h-[80vh]">
        <TabNav
          baseUrl="/clinical/screening"
          idAsIndexPage
          keyParam="" 
          useReactHook
          subPaths={[
            { path: "reason", title: "Movito da vinda" },
            { path: "vital-signals", title: "Sinais Vitais" },
            { path: "priority", title: "Grau de Prioridade" },
            { path: "state", title: "Estado Actual" },
            { path: "advice", title: "Recomendações" }
          ]}
        />

        <div className="max-h-[60vh] overflow-auto px-2">
          { 
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
              scrId={patient.screening._id}
            /> 
          }
        </div>
      </div>
    </main>
  );
}