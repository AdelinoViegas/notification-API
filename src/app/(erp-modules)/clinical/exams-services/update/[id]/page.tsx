import Header from "@/components/header";
import { getCCG, updateCCG } from "@/app/backend/api/clinical/scheduling-api";
import Button from "@/components/ui/button";
import InputField from "@/components/ui/input-field";
import Card from "@/components/ui/card";

export default async function Page({
	params
}:{
	params: Promise<{
		id: string;
	}>
}) {
  const { id } = await params;
  const res = await getCCG({ id }); 
  return (
    <main className="space-y-3">
      <div className="mt-6">
        <Header title="Editar"/>
      </div>

      <Card>
        <form className="w-96" action={updateCCG}>
          <input 
            type="hidden"
            name="id"
            defaultValue={res?._id}
          />

          <InputField
            textLabel="Descrição"
            defaultValue={res?.name}
            name="name"
            required
          />

          <Button>Salvar</Button>
        </form>
      </Card>
    </main> 
  );
}
