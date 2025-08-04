import Image from "next/image";
import Header from "@/components/header";
// import { getUser } from "@/app/backend/api/manager/api";
import { getUserId } from "@/lib/web-token";
import WorkplaceFrom from "@/components/forms/workplace-form";
import { getGrantedUnitAccess } from "@/app/backend/api/clinical/urgency-bank-api";
import Carousel from "@/components/carousel";
import { getUser } from "../backend/api/admin";

export const dynamic = "force-dynamic";

export default async function Page(){
  const id = await getUserId();
  const [ units, user] = await Promise.all([
    getGrantedUnitAccess(id),
    getUser(id)
  ]);
 
  return(
    <main className="flex bg-white h-[100%] flex-col-reverse lg:flex-row gap-3 items-center">
      <div className="hidden md:block h-screen w-full lg:h-screen lg:max-w-[60%] shadow-md shadow-black rounded-t-3xl lg:rounded-none lg:rounded-r-3xl">
        <Carousel
         images={[
          { name:"/slide1.jpg" },
          { name:"/slide2.jpg" }
        ]}
        />
      </div>
      <div className="px-3 py-2 mt-32 mb-10 mx-auto lg:mt-0 lg:mb:0 w-full">
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
    </main>
  );
}