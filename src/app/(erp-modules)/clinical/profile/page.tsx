
import Image from "next/image";
import { redirect } from "next/navigation";
import Button from "@/components/ui/button";
import Header from "@/components/header";
import InputField from "@/components/ui/input-field";
import { whoAreYou } from "@/lib/web-token";
import { getUserById } from "@/app/backend/api/manager/api";
//import { getUserById as getClinicalUser } from "@/app/backend/api/clinical/api";

export const dynamic = "force-dynamic";

export default async function Page(){
  const userId = await whoAreYou();
  if(!userId) 
    redirect('/');
  const user = await getUserById(userId); 
  //const clinicalData = await getClinicalUser(userId);

  return(
    <main className="space-y-3">
      <div className="mt-6">
        <Header title="Meu Perfil" />
      </div>

      <div className="lg:flex-row lg:gap-6 lg:p-8 px-4 py-3 items-center rounded-xl border bg-white flex flex-col gap-3">
        <div className="inline-flex flex-col items-center">
          <Image
            src="/banner.png"
            width={250}
            height={250}
            alt="myphoto"
          />
          <form>
            <InputField 
              type="file"
              required
              name="picture"
              textLabel="Carregar Imagem"
            />
            <Button>Actualizar</Button>
          </form>
        </div>
       
        <div className="w-full lg:w-96">
          <div className="mb-8 lg:text-start text-center">
            <h2 className="text-2xl">
              {user?.fullname}
            </h2>
            <div>
              <span className="text-blue-500 font-sans">{user?.email}</span> -
            </div>
            <div>
              {"test"}
            </div>
            <div>
              {"test"}
            </div>
          </div>

          <InputField
            textLabel="Nome Completo"
            defaultValue={user?.fullname}
            disabled
          />

          <InputField
            textLabel="Nome de Login"
            defaultValue={user?.username}
            disabled
          />

          <InputField
            textLabel="Email"
            type="email"
            defaultValue={user?.email as string}
            disabled
          />

          <InputField
            textLabel="Telefone"
            defaultValue={user?.tel as string}
            type="tel"
            disabled
          />

          <Button>Pedir Alteração</Button>
        </div>
      </div>
    </main>
  )
}