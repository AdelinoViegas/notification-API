import Header from "@/components/header";
import { ExternalUnitForm } from "@/components/forms/unit-form";
import { getExternalUnit } from "@/backend/api/clinical/urgency-bank-api";

export default async function Page({ params }: {
  params: Promise<{
    unitId: string;
  }>
}){
  const { unitId } = await params;
  const externalUnit = await getExternalUnit(unitId);

  return(
    <main>
      <div className="mt-6">
        <Header title="Editar Unidade Externa"/>
      </div>

      <ExternalUnitForm jsonData={JSON.stringify(externalUnit)} />
    </main>
  );
}