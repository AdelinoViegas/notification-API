import Image from "next/image";
import WorkplaceFrom from "@/components/forms/workplace-form";
import { getGrantedUnitAccess } from "@/backend/api/clinical/urgency-bank-api";
import Carousel from "@/components/carousel";
import { getMyProfile } from "@/backend/api/admin";

export const dynamic = "force-dynamic";

export default async function Page(){
  const profile = await getMyProfile();
  const units = await getGrantedUnitAccess(profile.id);
 
  return(
    <main className="flex bg-white h-[100%] flex-col-reverse lg:flex-row gap-3 items-center">
      <div className="hidden md:block h-screen w-full lg:h-screen lg:max-w-[60%] shadow-md shadow-black rounded-t-3xl lg:rounded-none lg:rounded-r-3xl">
        <Carousel
          images={[
            { name:"/slides/1.jpg" },
            { name:"/slides/2.jpg" }
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
          <p>Seja Bem-vindo(a)</p>
          <p className="font-bold">{profile.fullname}</p>
          <p>A sua zona de trabalho</p>
          {units?.length > 1 && <p>Selecione a sua área de trabalho</p>}

          <WorkplaceFrom units={units} />
        </div>
      </div>
    </main>
  );
}