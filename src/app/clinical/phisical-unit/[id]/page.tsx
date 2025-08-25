import Header from "@/components/header";
import UnitForm from "@/components/forms/unit-form";
import { getUnit } from "@/backend/api/clinical/urgency-bank-api";

export default async function Page({ params }: { params: Promise<{ id: string }> }){
  const { id } = await params;
  const unit = await getUnit(id);

  return(
    <main>
      <div className="mt-6">
        <Header title="Editar Unidades Físicas"/>
      </div>

      <UnitForm jsonData={JSON.stringify(unit)} />
    </main>
  );
}