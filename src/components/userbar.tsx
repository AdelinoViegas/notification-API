import { FaUserCircle } from "react-icons/fa";
import { getMyProfile } from "@/app/backend/api/admin";

export const getFirstAndLastName = (fullname: string) => {
  if(!fullname)
    return "Sem nome";
  return fullname.split(" ").length >= 2
  ? [fullname.split(" ")[0], fullname.split(" ").slice(-1)].join(" ")
  : fullname
}

export default async function Userbar(){
  const user = await getMyProfile();

  return(
    <div className="flex justify-between px-8 py-2">
      <h2 className="font-bold">HOSPITAL DA SOCOMPSER</h2>
      <div className="flex gap-x-2 items-center ring ring-1 px-3 py-1 ring-gray-300 rounded-lg">
        <FaUserCircle className="size-8 text-gray-500" />
        <p>{getFirstAndLastName(user?.fullname as string)}</p>
      </div>
    </div>
  );
}