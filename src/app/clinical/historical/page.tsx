import TabNav from "@/components/tabnav";
import TransferHistory from "@/components/transfer-history";
import DeathHistory from "@/components/death-history";
import DischargeHistoryPanel from "@/components/discharge-history/discharge-history-panel";

export const dynamic = "force-dynamic";

export default async function Page({ 
  searchParams 
}:{ 
  searchParams: Promise<{
    r: "o" | "t" | "a", 
    name: string,
    registerNumber: number,
    processNumber: string,
    fromDate: string,
    toDate: string,
    p: number,
  }>
}){
  const { 
    r: route, 
    name, 
    registerNumber, 
    processNumber,
    fromDate,
    toDate,
    p: page 
  } = await searchParams;

  return(
    <div className="space-y-3">
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
      { route === "o" && <DeathHistory name={name} /> }
      { route === "t" && <TransferHistory name={name} page={page} registerNumber={registerNumber} /> }
      { route === "a" && (
        <DischargeHistoryPanel 
          name={name} 
          processNumber={processNumber}
          fromDate={fromDate}
          toDate={toDate}
          page={page ? Number(page) : 1}
        />
      )}
    </div>
  )
}
