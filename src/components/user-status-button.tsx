'use client';

import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import Button from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { changeUserState } from "@/app/backend/api/manager/api";

type StatusProps = {
  status: boolean;
  userId: string;
  isAdmin?: boolean;
}

export default function UserStatusButton({
  status,
  userId,
  isAdmin
}: StatusProps){
  const route = useRouter();
  
  return(
    <Button
      disabled={isAdmin}
      className="flex gap-x-2" 
      cancel={status} 
      onClick={async()=>{
        await changeUserState(userId, !status); 
        route.refresh();
      }}
    >
      {status && <ExclamationCircleIcon className="h-5 w-5" />}
      {status?'Desativar': 'Activar'}
    </Button>
  );
}