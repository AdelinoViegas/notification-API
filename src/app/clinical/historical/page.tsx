import TabNav from "@/components/tabnav";
import TransferHistory from "@/components/transfer-history";
import DeathHistory from "@/components/death-history";
import DischargeHistoryPanel from "@/components/discharge-history/discharge-history-panel";
import Alert from "@/components/ui/alert";
import { getMyClinicalProfile } from "@/backend/api/clinical/api";

export const dynamic = "force-dynamic";

// Mapa: valor da configuração → path da tab e label
const ACCESS_MAP = {
  deaths:    { path: "o", title: "Histórico de Óbitos" },
  transfers: { path: "t", title: "Histórico de Transferências" },
  discharges:{ path: "a", title: "Histórico de Altas" },
} as const;

type AccessKey = keyof typeof ACCESS_MAP;

export default async function Page({ 
  searchParams 
}:{ 
  searchParams: Promise<{
    r: "o" | "t" | "a", 
    name: string,
    processNumber: string,
    fromDate: string,
    toDate: string,
    p: number,
  }>
}){
  const { 
    r: route, 
    name, 
    processNumber,
    fromDate,
    toDate,
    p: page 
  } = await searchParams;

  const profile = await getMyClinicalProfile();
  const historicalAccess = profile?.historicalAccess as AccessKey | null | undefined;

  // Se não tem configuração, bloquear acesso
  if (!historicalAccess || !ACCESS_MAP[historicalAccess]) {
    return (
      <div className="space-y-3">
        <Alert
          type="warn"
          message="Não tem acesso a nenhum histórico. Contacte o administrador para configurar o seu perfil."
        />
      </div>
    );
  }

  const allowedTab = ACCESS_MAP[historicalAccess];

  // Garantir que a route activa é a permitida (redirecionar para a tab correcta se necessário)
  const activeRoute = route ?? allowedTab.path;
  const effectiveRoute = activeRoute === allowedTab.path ? activeRoute : allowedTab.path;

  return(
    <div className="space-y-3">
      <TabNav
        keyParam="" 
        useReactHook
        idAsIndexPage
        baseUrl="/clinical/historical"
        subPaths={[ allowedTab ]}
      />

      { effectiveRoute === "o" && 
        <DeathHistory 
          name={name} 
          page={page} 
          processNumber={processNumber}
          fromDate={fromDate}
          toDate={toDate}
      /> 
      }
      { effectiveRoute === "t" && 
        <TransferHistory 
          name={name} 
          page={page} 
          processNumber={processNumber}
          fromDate={fromDate}
          toDate={toDate} 
        /> 
      }
      { effectiveRoute === "a" && (
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
