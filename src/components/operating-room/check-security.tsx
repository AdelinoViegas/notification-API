  "use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { MdOutlineSaveAlt } from "react-icons/md";
import { InternalComponent, RenderUIElement } from "@/components/global-component";
import Button from "@/components/ui/button";
import { signOperatingRoom } from "@/backend/api/clinical/operating-room-api";
  
  export function CheckSecurity({
    scheduleId,
    className,
    childrens,
  }: InternalComponent & {
    scheduleId: string, 
  }){
    const [ state, action ] = useActionState(signOperatingRoom, { message:"", status: false});
    const router = useRouter(); 
    
    useEffect(()=>{
      if(state.message)
        if(state.status)
          toast.success(state.message, {
            autoClose: 1500,
            onClose: ()=> router.refresh(),
          });
        else
          toast.error(state.message);
    }, [state, router]);
  
    return(
        <form {...{action}}>
          <input
            className="hidden"
            name="scheduleId"
            defaultValue={scheduleId}
          />
  
          <div className={className}>
            {childrens.map((item, i)=>(
              <div key={i} className={item.className}>
                <RenderUIElement items={item.elements} />
  
                { !!item.separatedElements &&
                  item.separatedElements.map((item, index)=>(
                    <div className={item.className} key={index}>
                      <p className="font-medium text-sm">{item.label}: </p>
                      <RenderUIElement items={item.elements} />
                    </div> 
                  ))
                }
              </div>
            ))}
          </div>
  
          <Button>
            <MdOutlineSaveAlt className="w-5" />
            Salvar
          </Button>
        </form>
    );
  }