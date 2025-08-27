"use client";

import { addUserWorkplace, removeUserWorkplace } from "@/backend/api/clinical/urgency-bank-api";
import Button from "@/components/ui/button";
import Selection, { SelectionOption } from "@/components/ui/selection";
import { useActionState, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function UserWorkplaceForm({ 
  items,
  userId,
  userItems
}: { 
  items: SelectionOption[];
  userItems: SelectionOption[];
  userId: string; 
}){
  const [ state, action ] = useActionState(addUserWorkplace, { message: "", status: false });
  const router = useRouter();
  
  useEffect(()=>{
    if(state.message){
      if(state.status)
        toast.success(state.message, { onOpen: router.refresh });
      else
        toast.warn(state.message);
    }
  }, [state]);

  return (
    <div>
      <form action={action} className="flex gap-x-3 items-center">
        <input type="hidden" name="userId" value={userId} />

        <Selection
          label="Areas de trabalho" 
          options={items}
          className="grow"
          required
          name="id"
        />
        <Button>Adicionar</Button>
      </form>

      <div className="space-y-2">
        {userItems.map((props, index)=>(
          <RemoveWorkplace 
            key={index} 
            id={props._id}
            label={props.label} 
          />
        ))}
      </div>
    </div>
  );
}

function RemoveWorkplace({ id, label }: { id: string; label: string }){
  const [ state, action ] = useActionState(removeUserWorkplace, { message: "", status: false });
  const router = useRouter();

  useEffect(()=>{
    if(state.message){
      if(state.status)
        toast.success(state.message, { onOpen: router.refresh });
      else
        toast.warn(state.message);
    }
  }, [state]);

  return(
    <form action={action} className="group ring ring-1 ring-gray-500/25 hover:bg-gray-100 px-2 py-1 rounded">
      <input type="hidden" name="id" value={id} />
      
      <div className="flex gap-x-3 items-center">
        <h2 className="grow">{label}</h2>
        <button className="group-hover:bg-red-500/25 text-red-500 px-3 py-1 rounded">Remover</button>
      </div>
    </form>
  )
}