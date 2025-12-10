import Header from "@/components/header";
import { SpecialtyForm } from "@/components/forms/specialty-form";
import { getSpecialty } from "@/backend/api/clinical/api";

export default async function Page({ params }: {
  params: Promise<{
    specialtyId: string;
  }>
}){
  const { specialtyId } = await params;
  const specialty = await getSpecialty(specialtyId);

  return(
    <main>
      <div className="mt-6">
        <Header title="Editar Unidade Externa"/>
      </div>
      
     <SpecialtyForm data={JSON.stringify(specialty)}/>
    </main>
  );
}