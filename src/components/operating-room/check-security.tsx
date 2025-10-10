  "use client";

import { FormEvent, useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { InternalComponent, RenderUIElement } from "@/components/global-component";
import { signOperatingRoom } from "@/backend/api/clinical/operating-room-api";
import ButtonEdit from "../ui/button-edit";
  
export function CheckSecurity({
  scheduleId,
  className,
  childrens,
  validatedSignature,
  checkSecurity:{
    patientIdentity,
    surgerySite,
    validConsent,
    anestheticRisk,
    bloodAndEmergencySupplies,
  }
}: InternalComponent & {
  scheduleId: string
  validatedSignature: boolean,  
  checkSecurity: {
    patientIdentity: boolean,
    surgerySite: string,
    validConsent: boolean,
    anestheticRisk: boolean,
    bloodAndEmergencySupplies: boolean,
  }
}){//console.log(validatedSignature);
  const [ state, action ] = useActionState(signOperatingRoom, { message:"", status: false});
  const [ edit, setEdit ] = useState<Record<string, boolean>>({
    identity: true,
    surgery: true,
    consent: true,
    risk: true,
    supplies: true,
  });
  const indice = ["identity","surgery", "consent", "risk", "supplies"];
  const values = [patientIdentity, surgerySite, validConsent, anestheticRisk, bloodAndEmergencySupplies];
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

  const submitUpdate = (event: FormEvent) => {
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement;

    if(submitter?.name === "update")
      for(const value of JSON.parse(submitter.dataset.location as string) as string[])
        setEdit( prev => ({...prev, [value]: !prev[value]}));
  }
  
  for(const i in childrens){
    if(childrens[i] === childrens[1]){
      if(childrens[1].elements){
        const data = childrens[1].elements;
  
        if(data[0].props){
          data[0].props = {
            ...data[0].props,
            disabled : !!values[i] && edit[indice[i]]
          }
        }
      }
    }
      
    if(childrens[i].separatedElements){
      const data = childrens[i].separatedElements[0].elements;

      data[0].props = {
        ...data[0].props,
        disabled : data[0].props.name === "validConsent"?validatedSignature?!!edit[indice[i]]:true:!!edit[indice[i]]
      }

      data[1].props = {
        ...data[1].props,
        disabled : data[0].props.name === "validConsent"?validatedSignature?!!edit[indice[i]]:true:!!edit[indice[i]]

      }
    } 
  }

  return(
      <form {...{action}} onSubmit={submitUpdate}>
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

        <ButtonEdit 
          state={edit}
          setState={setEdit}
          value={values.filter( value => Boolean(value) || value === false)}
          location={indice.filter(Boolean)}
        />
      </form>
  );
}