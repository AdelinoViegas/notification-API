  "use client";

//import { useActionState, useEffect } from "react";
import { InternalComponent, RenderUIElement } from "./global-component";
import Button from "./ui/button";
//import { useRouter } from "next/navigation";
//import { toast } from "react-toastify";

  
  export function CheckSecurity({
    /*itemId,*/
    className,
    childrens,
  }: InternalComponent){
    //const [ state, action ] = useActionState(apiFn,initialState);
    //const router = useRouter();
    
    /*useEffect(()=>{
      if(state?.message){
        if(state.status)
          toast.success(state.message, {
            onClose: router.refresh,
            autoClose: 1500
          });
        else 
          if(state?.isWarn)
            toast.warn(state.message);
          else
            toast.error(state.message);
      }
    }, [state, router]);*/
  
    return(
        <form /*{...{action}}*/>
          {/*<input
            className="hidden"
            name="patientId"
            defaultValue={itemId}
          />*/}
  
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
  
          <Button>Salvar</Button>
        </form>
    );
  }