import TabNav from "@/components/tabnav";
import Screening from "@/components/screening";
import { UIComponent } from "@/components/forms/screening-ui";

type Routes = "patient" | "reason" | "vital-signals" | "priority" | "state" | "advice";

export default async function Page({
  params,
  searchParams
}:{
  params: Promise<{ patientId: string }>;
  searchParams: Promise<{ r: Routes }>;
}){
  const [{ patientId }, { r }] = await Promise.all([ params, searchParams ]);

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
            /> 
          }
        </div>
      </div>
    </main>
  );
}