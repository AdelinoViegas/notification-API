import Image from "next/image";
import Header from "@/components/header";
import { getUser } from "@/app/backend/api/manager/api";
import { whoAreYou } from "@/lib/web-token";
import WorkplaceFrom from "@/components/forms/workplace-form";
import { getGrantedUnitAccess } from "@/app/backend/api/clinical/urgency-bank-api";
// import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";

export default async function Page(){
  const userId = await whoAreYou() as string;
  const units = await getGrantedUnitAccess(userId);
  const user = await getUser(userId);

  // if(!units.length || !userId)
  //   redirect("/?nologin");
 
  return(
    <main className="bg-white h-screen flex-col lg:flex-row-reverse flex gap-3 justify-center items-center">
      <div className="px-3 py-2 lg:mx-32 mt-32 lg:mt-0">
        <div className="flex flex-col gap-3 items-center">
          <Image 
            src={"/banner.png"}
            width={300}
            height={300}
            alt="client_logo"
            className="size-16"
          />
          <div className="mb-3">
            <Header title="Local de Trabalho" />
          </div>

          <p>Seja Bem-vindo(a) <span className="text-blue-500">{user?.fullname}</span></p>
          <p>Selecione a sua área de trabalho</p>

          <WorkplaceFrom {...{units}} />
        </div>
      </div>
      <div className="h-screen grow w-full">
        <Image 
          className="rounded-t-3xl lg:rounded-none lg:rounded-r-3xl shadow-lg shadow-black w-full lg:h-full h-[100%]"
          width={500}
          height={500} 
          src="/hero-1.jpg"
          alt="hero_picture"
        />
      </div>
    </main>
  );
}