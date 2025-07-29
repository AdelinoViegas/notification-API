// // import { redirect } from "next/navigation";
// import { whoIsUser } from "@/lib/web-token";
// import DropDown from "@/components/drop-down";
// // import Notification from "@/components/notification";
import { BiUser } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";

import { getUser } from "@/app/backend/api/manager/api"
import { whoIsUser } from "@/lib/web-token";

// export const getFirstAndLastName = (fullname: string)=>{
//   if(!fullname)
//     return;
//   const names = fullname.split(" ");
//   if(names.length == 1)
//     return fullname;
//   return `${names[0]} ${names[names.length - 1]}`;
// }

export const getFirstAndLastName = (fullname: string) => fullname 
  ? fullname.trim().split(" ")[0]
  : "Sem nome"

// export default async function StatusLoginUser(){
//   const userId = await whoIsUser();
//   const user = await getUser(userId as string);

//   const menuItems = [
//     {
//       label: "Meu Perfil",
//       href: "/clinical/profile",
//     },
//     {
//       label: "Deixar Sugestão",
//       href: "#",
//     },
//     {
//       label: "Histórico de Acessos",
//       href: "#",
//     }
//   ];

//   return(
//     <main className="select-none border-b bg-white flex justify-between p-3 items-center">
//       <div>
//         <h2 className="uppercase">Hospital Privado da Socompser</h2>
//       </div>

//       <div className="flex gap-3 items-center">
//         {/* <Notification /> */}
//         <DropDown menuItems={menuItems}>
//           <div className="flex w-48 gap-1 items-center border px-3 py-1 rounded-xl">
//             <div className="border rounded-full"><UserIcon className="size-8"/></div>
//             <h2 className="line-clamp-1">{getFirstAndLastName(user?.fullname as string)}</h2>
//           </div>
//         </DropDown>
//       </div>
//     </main>
//   )
// }

export default async function Userbar(){
  const id = await whoIsUser();
  const user = await getUser(id as string);

  return(
    <div className="flex justify-between px-8 py-4">
      <h2 className="font-bold">HOSPITAL DA SOCOMPSER</h2>
      <div className="flex gap-x-2 items-center ring ring-1 px-3 py-2 ring-gray-300 rounded">
        <FaUserCircle className="size-8 text-gray-500" />
        <p>{getFirstAndLastName(user?.fullname as string)}</p>
      </div>
    </div>
  );
}