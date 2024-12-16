import Header from "@/components/header";
import UserForm from '@/components/forms/user-form';
export const dynamic = "force-dynamic";

export default function Page(){
  return(
    <main className="pt-3">
      <Header className="my-3" title="Cadastro de Usuário" />
      <UserForm />
    </main>
  );
}