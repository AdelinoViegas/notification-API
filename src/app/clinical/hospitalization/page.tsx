import TabNav from "@/components/tabnav";
import Reception from "@/components/hospitalization/reception";
import Hospitalized from "@/components/hospitalization/hospitalized";
import Nursings from "@/components/hospitalization/nursings";

export const dynamic = "force-dynamic";

export default async function Page({ 
  searchParams 
}:{ 
  searchParams: Promise<{
    r: "r" | "h" | "n", 
    name: string,
    _fst: string;
    _fs: string;
    _fn: string; 
  }>
}){
  const { r: route, name, _fst: section , _fs: service, _fn: nursing } = await searchParams;

  return(
    <div className="space-y-3">
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
      { route === "r" && <Reception {...{name}}/> }
      { route === "h" && <Hospitalized {...{name}} {...{section}} {...{nursing}}/> }
      { route === "n" && <Nursings {...{service}} {...{section}} {...{nursing}}/>}
    </div>
  )
}