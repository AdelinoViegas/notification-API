'use client';

import Button from "@/components/ui/button";
import { BiTrash } from "react-icons/bi";

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
        <BiTrash className="w-5 h-5" />:
        'Apagar'
      }
    </Button>
  )
}