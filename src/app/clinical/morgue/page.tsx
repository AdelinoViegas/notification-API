import TabNav from "@/components/tabnav";
import WaitingList from "@/components/morgue/waiting-list";
import Accommodated from "@/components/morgue/accommodated";
import Chambers from "@/components/morgue/chambers";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    r: "w" | "a" | "c";
    name?: string;
    rName?: string;
    rBI?: string;
  }>;
}) {
  const { r: route, name, rName, rBI } = await searchParams;

  return (
    <div className="space-y-3">
      <TabNav
        keyParam=""
        useReactHook
        idAsIndexPage
        baseUrl="/clinical/morgue"
        subPaths={[
          { path: "w", title: "Lista de Espera" },
          { path: "a", title: "Acomodados" },
          { path: "c", title: "Câmara" },
        ]}
      />

      {route === "w" && <WaitingList name={name} />}
      {route === "a" && (
        <Accommodated name={name} responsibleName={rName} responsibleBI={rBI} />
      )}
      {route === "c" && <Chambers />}
    </div>
  );
}
