import Link from "next/link";
import Button from "@/components/ui/button";
import { getPermissions } from "@/app/backend/api/manager/api";
import Header from "@/components/header";
import { BiPlus as PlusIcon } from "react-icons/bi";
import { MdOutlineModeEdit  } from "react-icons/md";

export const dynamic = "force-dynamic";

type PermissionsProps = {
  _id: string;
  label: string;
  detail: string;
  userGroupId: string;
  userGroupLabel: string;
}

function Permission({
  _id,
  label,
  detail,
  userGroupLabel,
}: PermissionsProps){
  return(
    <div className="bg-white h-auto w-full lg:w-60 px-4 py-3 rounded-xl border">
      <h2 className="font-medium mb-4 text-primary text-lg">{label}</h2>
      <p className="inline-flex text-sm bg-gray-700 text-white px-2 py-1 rounded-xl">{userGroupLabel}</p>
      <p className="text-sm line-clamp-1">{detail}</p>
      <Link href={`/manager/permissions/${_id}`}>
        <Button className="flex gap-x-2">
          <MdOutlineModeEdit/>
          Editar
        </Button>
      </Link>
    </div>
  );
}

export default async function Page(){
  const permissions = await getPermissions() as PermissionsProps[];

  return(
    <main className="px-2 pt-4 w-full">
      <Header title="Permissões" className="mb-3">
        <Link href="/manager/permissions/sign" className="-translate-y-2">
          <Button className="flex gap-x-2">
            <PlusIcon className="w-5"/>
            Nova Permissão
          </Button>
        </Link>
      </Header>

      <div className="overflow-auto h-[80vh]">
        <div className="flex gap-3 flex-wrap">
          {permissions?.map((item:PermissionsProps, index:number)=>(
            <Permission 
              key={index}
              {...item}
            />
          ))}
        </div>
      </div>
    </main>
  );
}