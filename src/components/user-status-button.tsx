'use client';

import { BsExclamationCircle as ExclamationCircleIcon } from "react-icons/bs";
import Button from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { updateUserState } from "@/app/backend/api/manager/api";

type StatusProps = {
  status: boolean;
  userId: string;
  isAdmin?: boolean;
}

export default function UserStatusButton({
  status,
  userId
}: StatusProps){
  const route = useRouter();
  
  return(
    <Button
      className="flex gap-x-2" 
      cancel={status} 
      onClick={async()=>{
        await updateUserState(userId, !status); 
        route.refresh();
      }}
    >
      {status && <ExclamationCircleIcon className="h-5 w-5" />}
      {status?'Desativar': 'Activar'}
    </Button>
  );
}