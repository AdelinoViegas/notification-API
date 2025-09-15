import TabNav from "@/components/tabnav";
import Reception from "@/components/hospitalization/reception";
import Hospitalized from "@/components/hospitalization/hospitalized";

export default async function Page({ 
  params,
  searchParams 
}:{ 
  params: Promise<{ id: string }>;
  searchParams: Promise<{ r: "r" | "h" | "n" }>;
}){
  const [{ id }, { r }] = await Promise.all([ params,  searchParams ]);
  
  return(
    <div>
      <TabNav
        keyParam="" 
        useReactHook
        idAsIndexPage
        baseUrl="/clinical/hospitalization"
        subPaths={[
          { path: "r", title: "Em Espera" },
          { path: "h", title: "Internados" },
          { path: "n", title: "Infermagens" }
        ]}
      />

      { r === "r" && <Reception /> }
      { r === "h" && <Hospitalized /> }
    </div>
  )
}