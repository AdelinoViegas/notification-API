'use client';

import { useActionState } from "react";
import Button from "@/components/ui/button";
import { BiTrash as TrashIcon } from "react-icons/bi";
import { deleteUserPermission } from "@/app/backend/api/manager/api";
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
  const [state, action] = useActionState(deleteUserPermission, { message: "", status: false });
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
    <form className="bg-gray-100 hover:bg-gray-200 mt-2 mb-1 rounded-md border-2 px-2 flex gap-3 items-center" action={action}>
      <input type="hidden" name="permId" value={id} />
      <div className="w-full capitalize font-medium">
        <p>{label}</p>
      </div>
      <div className="-mt-3 mb-1">
        <Button type="submit" cancel>
          <TrashIcon className="w-5 h-5" />
        </Button>
      </div>
    </form>
  );
}
