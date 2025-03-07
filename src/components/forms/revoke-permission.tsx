'use client';

import { useActionState } from "react";
import { BiTrash as TrashIcon } from "react-icons/bi";
import { revokePermission } from "@/app/backend/api/manager/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { triggerUpdate } from "@/lib/ws-trigger";
import { toast } from "react-toastify";

export default function RevokeUserPermission({
  id,
  label
}: {
  id: string;
  label: string;
}){
  const [state, action] = useActionState(revokePermission, { message: "", status: false });
  const router = useRouter();
  
  useEffect(()=>{
    if(state.message){
      if(state.status)
        toast.success(state.message, {
          autoClose: 1500,
          onOpen: ()=>{
            triggerUpdate({ target: "permissions" });
            router.refresh();
          }
        })
      else 
        toast.error(state.message);
    }
  }, [state, router]);
  
  return(
    <form className="my-2" action={action}>
      <input type="hidden" name="id" value={id} />
      <div className="flex gap-x-3 items-center justify-between bg-gray-200 px-2 py-1 rounded outline outline-1 outline-gray-300">
        <h2 className="text-sm font-medium">{label}</h2>
        <button type="submit" className="p-2 rounded bg-red-500 text-white">
          <TrashIcon className="size-5" />
        </button>
      </div>
    </form>
  )
}
