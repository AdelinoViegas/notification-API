// import { redirect } from "next/navigation";
import { whoAreYou } from "@/lib/web-token";
import DropDown from "@/components/drop-down";
import Notification from "@/components/notification";
import { BiUser as UserIcon } from "react-icons/bi";
import { getUserById } from "@/app/backend/api/manager/api"

export const getFirstAndLastName = (fullname: string)=>{
  if(!fullname)
    return;
  const names = fullname.split(" ");
  if(names.length == 1)
    return fullname;
  return `${names[0]} ${names[names.length - 1]}`;
}

export default async function StatusLoginUser(){
  const userId = await whoAreYou();
  // if(!userId) 
  //   redirect("/?invalid-user");

  const user = await getUserById(userId as string);
  const menuItems = [
    {
      label: "Meu Perfil",
      href: "/clinical/profile",
    },
    {
      label: "Deixar Sugestão",
      href: "#",
    },
    {
      label: "Histórico de Acessos",
      href: "#",
    }
  ];

  return(
    <main className="select-none border-b bg-white flex justify-between p-3 items-center">
      <div>
        <h2 className="">Instituto de Saúde Pública de Angola - ISPA</h2>
      </div>

      <div className="flex gap-3 items-center">
        <Notification />
        <DropDown menuItems={menuItems}>
          <div className="flex w-48 gap-1 items-center border px-3 py-1 rounded-xl">
            <div className="border rounded-full"><UserIcon className="size-8"/></div>
            <h2 className="line-clamp-1">{getFirstAndLastName(user?.fullname as string)}</h2>
          </div>
        </DropDown>
      </div>
    </main>
  )
}