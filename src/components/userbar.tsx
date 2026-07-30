import { FaUserCircle } from "react-icons/fa";
import { getMyProfile } from "@/backend/api/admin";

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
    <div className="flex justify-between items-center px-8 py-2 bg-white">
      <h2 className="font-bold">HOSPITAL DA SOCOMPSER</h2>
      <div className="flex gap-x-2 items-center border px-3 py-1 rounded">
        <FaUserCircle className="size-8 text-gray-500" />
        <p className="font-medium">{getFirstAndLastName(user?.fullname as string)}</p>
      </div>
    </div>
  );
}