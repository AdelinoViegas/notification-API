import TabNav from "@/components/tabnav";
import TransferHistory from "@/components/transfer-history";
import DeathHistory from "@/components/death-history";
import DischargeHistory from "@/components/discharge-history";

export const dynamic = "force-dynamic";

export default async function Page({ 
  searchParams 
}:{ 
  searchParams: Promise<{
    r: "o" | "t" | "a", 
    name: string,
    registerNumber: number,
    p: number,
  }>
}){
  const { r: route, name, registerNumber, p: page } = await searchParams;

  return(
    <div>
      <TabNav
        keyParam="" 
        useReactHook
        idAsIndexPage
        baseUrl="/clinical/historical"
        subPaths={[
          { path: "o", title: "Histórico de Óbitos" },
          { path: "t", title: "Histórico de Transferências" },
          { path: "a", title: "Histórico de Altas" }
        ]}
      />
      { route === "o" && <DeathHistory {...{name}} /> }
      { route === "t" && <TransferHistory {...{name}} {...{page}} {...{registerNumber}} /> }
      { route === "a" && <DischargeHistory {...{name}}/>}
    </div>
  )
}