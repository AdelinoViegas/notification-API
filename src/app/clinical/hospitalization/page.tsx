import TabNav from "@/components/tabnav";
import Reception from "@/components/hospitalization/reception";
import Hospitalized from "@/components/hospitalization/hospitalized";
import Nursings from "@/components/hospitalization/nursings";

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }:{ searchParams: Promise<{ r: "r" | "h" | "n" }>}){
  const { r: route } = await searchParams;
  
  return(
    <div>
      <TabNav
        keyParam="" 
        useReactHook
        idAsIndexPage
        baseUrl="/clinical/hospitalization"
        subPaths={[
          { path: "r", title: "Lista de Espera" },
          { path: "h", title: "Internados" },
          { path: "n", title: "Enfermaria" }
        ]}
      />

      { route === "r" && <Reception /> }
      { route === "h" && <Hospitalized /> }
      { route === "n" && <Nursings />}
    </div>
  )
}