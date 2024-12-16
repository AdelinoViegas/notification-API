'use client';

import { useActionState } from "react";
import Button from "@/components/ui/button";
import { TrashIcon } from "@heroicons/react/24/outline";
import { deleteUserPermission } from "@/app/backend/api/manager/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { triggerUpdate } from "@/lib/ws-trigger";

export const dynamic = 'force-dynamic';

export default function DeleteUserPermissionForm({
  permId,
  permLabel
}: {
  permId: string;
  permLabel: string;
}){
  const [state, action] = useActionState(deleteUserPermission, false);
  const router = useRouter();
  
  useEffect(()=>{
    triggerUpdate({ target: "permissions" });
    router.refresh();
  }, [state, router]);
  
  return(
    <form className="bg-gray-100 hover:bg-gray-200 my-1 rounded-md border-2 px-2 flex gap-3 items-center" action={action}>
      <input type="hidden" name="permId" value={permId} />
      <div className="w-full capitalize font-medium">
        <p>{permLabel}</p>
      </div>
      <div className="-mt-3 mb-1">
        <Button type="submit" cancel>
          <TrashIcon className="w-5 h-5" />
        </Button>
      </div>
    </form>
  );
}
