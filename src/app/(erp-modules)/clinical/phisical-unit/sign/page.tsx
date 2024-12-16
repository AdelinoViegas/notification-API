import UnitForm from "@/components/forms/unit-form";
import Header from "@/components/header";
export const dynamic = "force-dynamic";

export default function Page(){
  return(
    <main>
      <div className="mt-6">
        <Header title="Cadastro de Unidade Física"/>
      </div>
      <UnitForm />
    </main>
  );
}