import Image from "next/image";
import Header from "@/components/header";
import { getUser } from "@/app/backend/api/manager/api";
import { whoIsUser } from "@/lib/web-token";
import WorkplaceFrom from "@/components/forms/workplace-form";
import { getGrantedUnitAccess } from "@/app/backend/api/clinical/urgency-bank-api";
import Carousel from "@/components/carousel";

export const dynamic = "force-dynamic";

export default async function Page(){
  const userId = await whoIsUser() as string;
  const [ units, user] = await Promise.all([
    getGrantedUnitAccess(userId),
    getUser(userId)
  ]);
 
  return(
    <main className="bg-white h-screen flex-col lg:flex-row md-flex-row-reverse flex gap-3 items-center">
      <div className="h-screen  max-w-[60%]">
        <Carousel
         images={[
          {
            name:"/slide1.jpg"
          },
          {
            name:"/slide2.jpg"
          }
        ]}
        />
      </div>
      <div className="px-3 py-2 mt-32 mx-auto lg:mt-0 ">
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