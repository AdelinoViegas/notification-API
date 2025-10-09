  "use client";

import { /*FormEvent,*/ useActionState, useEffect/*, useState */} from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { InternalComponent, RenderUIElement } from "@/components/global-component";
import { signOperatingRoom } from "@/backend/api/clinical/operating-room-api";
  
  export function CheckSecurity({
    scheduleId,
    className,
    childrens,
  }: InternalComponent & {
    scheduleId: string, 
  }){
    const [ state, action ] = useActionState(signOperatingRoom, { message:"", status: false});
    /*const [ edit, setEdit ] = useState<Record<string, boolean>>({
      medical: true,
      allergies: true,
      evaluation: true,
      risk: true,
      fasting: true,
      medication: true,
      description: true,
      result: true,
    }); */
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

    /*const submitUpdate = (event: FormEvent) => {
      const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement;
  
      if(submitter?.name === "update")
        for(const value of JSON.parse(submitter.dataset.location as string) as string[])
          setEdit( prev => ({...prev, [value]: !prev[value]}));
    }*/
  
    return(
        <form {...{action}} >
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
  
          {/*<ButtonEdit 
            state={edit}
            setState={setEdit}
            value={[preoperativeEvaluation.currentClinicalStatus].filter(Boolean)}
            location={["evaluation"].filter(Boolean)}
          />*/}
        </form>
    );
  }