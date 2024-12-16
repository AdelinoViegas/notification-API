'use client';

import Button from "@/components/ui/button";
import { TrashIcon } from "@heroicons/react/24/outline";

type DeleteButtonProps = {
  id: string;
  callback: (id: string)=> boolean;
  icon?: boolean;
}

export default function DeleteButton({
  id,
  callback,
  icon
}:DeleteButtonProps){
  return(
    <Button onClick={()=>callback(id)} cancel>
      { icon?
        <TrashIcon className="w-5 h-5" />:
        'Apagar'
      }
    </Button>
  )
}