import Header from "@/components/header";
import { SpecialtyForm } from "@/components/forms/specialty-form";
import { getSpecialty } from "@/backend/api/clinical/api";

export default async function Page({ params }: { params: Promise<{ id: string }>}){
  const { id } = await params;
  const specialty = await getSpecialty(id);

  return(
    <main>
      <div className="mt-6">
        <Header title="Editar Especialidade"/>
      </div>
      
     <SpecialtyForm data={JSON.stringify(specialty)}/>
    </main>
  );
}